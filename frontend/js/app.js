/**
 * Telza Portal – App Logic
 * Connects to ASP.NET Core REST API
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Production (same origin as API when deployed — e.g. admin.telza.co)
// const API = '/api';

// Local — TelzaPortal.API (Properties/launchSettings.json → https://localhost:7090)
const API = 'https://localhost:7090/api';

// ─── STATE ───────────────────────────────────────────────────────────────────
const state = {
    token: localStorage.getItem('telza_token') || null,
    user: null,
    customers: [],
    invoices: [],
    kycApplications: [],
    currentPage: 'dashboard',
    invoiceFilter: 'all',
    kycFilter: 'all',
    deleteCallback: null,
    selectedKyc: null,      // KYC currently viewed in detail modal
    kycStatusEditId: null,  // KYC id when status modal is open
};

// ─── TOAST ───────────────────────────────────────────────────────────────────
function toast(msg, type = 'ok') {
    const stack = document.getElementById('toast-stack');
    const icons = { ok: 'fa-circle-check', err: 'fa-circle-xmark', warn: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `
        <i class="fa-solid ${icons[type] || icons.ok} toast-icon"></i>
        <span>${msg}</span>
        <button class="toast-dismiss" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>`;
    stack.appendChild(t);
    setTimeout(() => {
        t.style.animation = 'toast-out .3s ease forwards';
        setTimeout(() => t.remove(), 300);
    }, 3800);
}

// ─── API FETCH ────────────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
        ...(opts.headers || {}),
    };
    const res = await fetch(`${API}${path}`, { ...opts, headers });

    if (res.status === 401) { app.logout('Session expired. Please sign in again.'); throw new Error('Unauthorized'); }

    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.title || res.statusText || 'Server Error');
    return data;
}

// ─── FORMAT HELPERS ───────────────────────────────────────────────────────────
const fmt = {
    currency: (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(+n || 0),
    date: (s) => {
        if (!s) return '—';
        const d = new Date(s);
        return isNaN(d) ? s : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    initials: (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?',
    greeting: () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    },
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function statusBadge(status = 'Draft') {
    const map = { Draft: 'badge-draft', Pending: 'badge-pending', Paid: 'badge-paid', Overdue: 'badge-overdue', Approved: 'badge-paid', Rejected: 'badge-overdue' };
    return `<span class="badge ${map[status] || 'badge-draft'}">${status}</span>`;
}

function kycStatusString(raw) {
    if (raw === 1 || raw === '1' || raw === 'Pending' || raw === 'pending') return 'Pending';
    if (raw === 2 || raw === '2' || raw === 'UnderReview' || raw === 'Under Review') return 'Under Review';
    if (raw === 3 || raw === '3' || raw === 'Approved' || raw === 'approved') return 'Approved';
    if (raw === 4 || raw === '4' || raw === 'Rejected' || raw === 'rejected') return 'Rejected';
    if (typeof raw === 'string' && raw.trim()) return raw;
    return 'Pending';
}

function kycStatusBadge(raw) {
    const s = kycStatusString(raw);
    const map = { Pending: 'badge-pending', 'Under Review': 'badge-draft', Approved: 'badge-paid', Rejected: 'badge-overdue' };
    return `<span class="badge ${map[s] || 'badge-draft'}">${s}</span>`;
}

// ─── MODAL CONTROL ────────────────────────────────────────────────────────────
function openModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}
function closeAllModals() {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
}

// ─── INVOICE CALCULATIONS ─────────────────────────────────────────────────────
function recalcInvoice() {
    let sub = 0;
    document.querySelectorAll('.item-row').forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = qty * price;
        row.querySelector('.item-row-total').textContent = fmt.currency(total);
        sub += total;
    });
    const taxRate = parseFloat(document.getElementById('inv-tax-rate').value) || 0;
    const tax = sub * (taxRate / 100);
    const total = sub + tax;
    document.getElementById('sum-subtotal').textContent = fmt.currency(sub);
    document.getElementById('sum-tax').textContent = fmt.currency(tax);
    document.getElementById('sum-total').textContent = fmt.currency(total);
    return { subtotal: sub, tax, total, taxRate };
}

function addLineItem(desc = '', qty = 1, price = 0) {
    const tbody = document.getElementById('line-items-body');
    const empty = document.getElementById('items-empty');
    if (empty) empty.classList.add('hidden');

    const tr = document.createElement('tr');
    tr.className = 'item-row';
    tr.innerHTML = `
        <td class="col-desc">
            <input type="text" class="field-input item-desc" placeholder="Service or product description" value="${desc}" required>
        </td>
        <td class="col-qty">
            <input type="number" class="field-input item-qty" placeholder="1" min="0.01" step="0.01" value="${qty}" required>
        </td>
        <td class="col-price">
            <input type="number" class="field-input item-price" placeholder="0.00" min="0" step="0.01" value="${price}" required>
        </td>
        <td class="col-total item-row-total">${fmt.currency(qty * price)}</td>
        <td class="col-del">
            <button type="button" class="del-btn" title="Remove">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>`;
    tbody.appendChild(tr);

    tr.querySelector('.del-btn').addEventListener('click', () => {
        tr.remove();
        if (document.querySelectorAll('.item-row').length === 0) {
            empty.classList.remove('hidden');
        }
        recalcInvoice();
    });

    tr.querySelectorAll('input').forEach(inp => inp.addEventListener('input', recalcInvoice));
    recalcInvoice();
}

// ─── CUSTOMER DROPDOWN + AUTO-FILL ────────────────────────────────────────────
function populateCustomerDropdown() {
    const sel = document.getElementById('inv-customer');
    if (!sel) return;
    sel.innerHTML = '<option value="">— Choose a customer —</option>';
    state.customers.forEach(c => {
        const o = document.createElement('option');
        o.value = c.id;
        o.textContent = c.name + (c.company ? ` — ${c.company}` : '');
        sel.appendChild(o);
    });
}

function clearInvoiceBillingFields() {
    ['inv-payment-method', 'inv-bank-name', 'inv-bank-address', 'inv-account-name', 'inv-contact-phone', 'inv-contact-email', 'inv-contact-fax', 'inv-account-number', 'inv-notes'].forEach(id => {
        const el = $(id);
        if (el) el.value = '';
    });
}

function applyInvoiceBillingFromApi(b) {
    if (!b) return;
    const set = (id, v) => { const el = $(id); if (el) el.value = v != null ? String(v) : ''; };
    set('inv-payment-method', b.paymentMethod);
    set('inv-bank-name', b.bankName);
    set('inv-bank-address', b.bankAddress);
    set('inv-account-name', b.accountName);
    set('inv-account-number', b.accountNumber);
    set('inv-contact-phone', b.contactPhone);
    set('inv-contact-email', b.contactEmail);
    set('inv-contact-fax', b.contactFax);
}

async function loadInvoiceBillingForClient(customerId) {
    clearInvoiceBillingFields();
    if (!customerId) return;
    try {
        const b = await apiFetch(`/clients/${customerId}/invoice-billing`);
        applyInvoiceBillingFromApi(b);
    } catch {
        clearInvoiceBillingFields();
    }
}

async function loadInvoiceBillingForKyc(kycId) {
    clearInvoiceBillingFields();
    if (!kycId) return;
    try {
        const b = await apiFetch(`/kyc/${kycId}/invoice-billing`);
        applyInvoiceBillingFromApi(b);
    } catch {
        clearInvoiceBillingFields();
    }
}

function fillCustomerInfoCard(customerId, opts = {}) {
    const kycId = opts.kycId || null;
    const card = document.getElementById('customer-info-card');
    if (!card) return;

    if (!customerId) {
        card.classList.add('hidden');
        clearInvoiceBillingFields();
        if (kycId) void loadInvoiceBillingForKyc(kycId);
        return;
    }

    const c = state.customers.find(x => x.id == customerId);
    if (!c) {
        card.classList.add('hidden');
        clearInvoiceBillingFields();
        if (kycId) void loadInvoiceBillingForKyc(kycId);
        return;
    }

    document.getElementById('cic-avatar').textContent = fmt.initials(c.name);
    document.getElementById('cic-name').textContent = c.name || '—';
    document.getElementById('cic-company').textContent = c.company || '—';
    document.getElementById('cic-email').textContent = c.email || '—';
    document.getElementById('cic-phone').textContent = c.phone || '—';
    document.getElementById('cic-address').textContent = c.address || '—';

    card.classList.remove('hidden');
    if (kycId) void loadInvoiceBillingForKyc(kycId);
    else void loadInvoiceBillingForClient(customerId);
}

function safeSet(id, val) {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
}

// ─── RENDER TABLES ────────────────────────────────────────────────────────────
function renderDashboard() {
    const pending = state.invoices.filter(i => (i.status || '').toLowerCase() === 'pending').length;
    const revenue = state.invoices.reduce((s, i) => s + (+i.total || 0), 0);

    $('kpi-customers').textContent = state.customers.length;
    $('kpi-kyc').textContent = state.kycApplications.length;
    $('kpi-invoices').textContent = state.invoices.length;
    $('kpi-revenue').textContent = fmt.currency(revenue);
    $('kpi-pending').textContent = pending;
    $('badge-invoices').textContent = state.invoices.length;
    $('badge-kyc').textContent = state.kycApplications.length;

    const name = state.user?.userName || state.user?.email?.split('@')[0] || 'Admin';
    $('greeting-msg').textContent = fmt.greeting() + ', ' + name + '!';
    $('sb-username').textContent = name;
    $('sb-avatar').textContent = fmt.initials(name);
    $('tb-avatar').textContent = fmt.initials(name);

    const recent = [...state.invoices]
        .sort((a, b) => new Date(b.invoiceDate || 0) - new Date(a.invoiceDate || 0))
        .slice(0, 6);

    const tbody = $('dash-inv-body');
    if (recent.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-row"><div class="empty-state"><i class="fa-solid fa-file-invoice-dollar"></i> No invoices yet.</div></td></tr>`;
        return;
    }
    tbody.innerHTML = recent.map(inv => `
        <tr>
            <td class="td-primary">${inv.invoiceNumber || '—'}</td>
            <td><div class="avatar-chip"><div class="chip-ava">${fmt.initials(inv.clientName)}</div><span class="chip-name">${inv.clientName || '—'}</span></div></td>
            <td class="td-secondary">${fmt.date(inv.invoiceDate)}</td>
            <td class="td-amount">${fmt.currency(inv.total)}</td>
            <td>${statusBadge(inv.status)}</td>
            <td><div class="row-actions">
                <button class="row-btn" onclick="app.previewInvoice('${inv.id}')" title="Preview"><i class="fa-regular fa-eye"></i></button>
                <button class="row-btn danger" onclick="app.confirmDelete('invoice','${inv.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div></td>
        </tr>`).join('');
}

function renderCustomers(filter = '') {
    const q = filter.toLowerCase();
    const list = state.customers.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q)
    );
    const tbody = $('customers-body');
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-row"><div class="empty-state"><i class="fa-solid fa-users"></i> No customers found.</div></td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(c => `
        <tr>
            <td><div class="avatar-chip">
                <div class="chip-ava">${fmt.initials(c.name)}</div>
                <span class="chip-name">${c.name}</span>
            </div></td>
            <td class="td-secondary">${c.company || '—'}</td>
            <td class="td-secondary">${c.email || '—'}</td>
            <td class="td-secondary">${c.phone || '—'}</td>
            <td class="td-secondary">${c.address ? c.address.slice(0, 40) + (c.address.length > 40 ? '…' : '') : '—'}</td>
            <td><div class="row-actions">
                <button class="row-btn" onclick="app.createInvoiceForCustomer('${c.id}')" title="Create Invoice"><i class="fa-solid fa-file-invoice-dollar"></i></button>
                <button class="row-btn danger" onclick="app.confirmDelete('customer','${c.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div></td>
        </tr>`).join('');
}

function renderKycApplications(filter = '') {
    const q = filter.toLowerCase();
    const statusFilter = state.kycFilter;

    const list = state.kycApplications.filter(k => {
        const cd = k.companyDetails || {};
        const statusStr = kycStatusString(k.status);
        const hay = [
            cd.companyName, cd.businessContactName, cd.voipPortalEmail, cd.mobileNumber,
            cd.businessPhone, cd.feinNumber, cd.frnNumber, cd.businessLine, cd.country,
            k.userId, statusStr,
        ].filter(Boolean).join(' ').toLowerCase();
        const matchText = !q || hay.includes(q);
        const matchStatus = statusFilter === 'all' || statusStr === statusFilter;
        return matchText && matchStatus;
    });

    const tbody = $('kyc-body');
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="empty-row"><div class="empty-state"><i class="fa-solid fa-id-card-clip"></i> No KYC applications found.</div></td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(k => {
        const cd = k.companyDetails || {};
        return `
        <tr>
            <td class="td-primary"><div class="avatar-chip">
                <div class="chip-ava">${fmt.initials(cd.companyName || '?')}</div>
                <span class="chip-name">${cd.companyName || '—'}</span>
            </div></td>
            <td class="td-secondary">${cd.businessContactName || '—'}</td>
            <td class="td-secondary">${cd.mobileNumber || '—'}</td>
            <td class="td-secondary">${cd.voipPortalEmail || '—'}</td>
            <td class="td-secondary">${cd.country || '—'}</td>
            <td class="td-secondary">${cd.businessLine || '—'}</td>
            <td class="td-secondary">${fmt.date(k.createdAt)}</td>
            <td>${kycStatusBadge(k.status)}</td>
            <td><div class="row-actions">
                <button class="row-btn" onclick="app.viewKycDetail('${k.id}')" title="View Details"><i class="fa-solid fa-eye"></i></button>
                <button class="row-btn" onclick="app.openKycStatusModal('${k.id}', ${Number(k.status) || 1})" title="Update status"><i class="fa-solid fa-flag"></i></button>
                <button class="row-btn" onclick="app.createInvoiceFromKyc('${k.id}')" title="Create Invoice"><i class="fa-solid fa-file-invoice-dollar"></i></button>
            </div></td>
        </tr>`;
    }).join('');
}

function renderInvoices(filter = '') {
    const q = filter.toLowerCase();
    const sFilter = state.invoiceFilter;
    const list = state.invoices.filter(i => {
        const matchText = (i.invoiceNumber || '').toLowerCase().includes(q) ||
            (i.clientName || '').toLowerCase().includes(q);
        const matchStatus = sFilter === 'all' || (i.status || 'draft').toLowerCase() === sFilter;
        return matchText && matchStatus;
    });
    const tbody = $('invoices-body');
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-row"><div class="empty-state"><i class="fa-solid fa-file-invoice-dollar"></i> No invoices found.</div></td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(inv => `
        <tr>
            <td class="td-primary">${inv.invoiceNumber || '—'}</td>
            <td><div class="avatar-chip">
                <div class="chip-ava">${fmt.initials(inv.clientName)}</div>
                <span class="chip-name">${inv.clientName || '—'}</span>
            </div></td>
            <td class="td-secondary">${fmt.date(inv.invoiceDate)}</td>
            <td class="td-amount">${fmt.currency(inv.subtotal)}</td>
            <td class="td-secondary">${fmt.currency(inv.tax)}</td>
            <td class="td-amount">${fmt.currency(inv.total)}</td>
            <td>${statusBadge(inv.status)}</td>
            <td><div class="row-actions">
                <button class="row-btn" onclick="app.previewInvoice('${inv.id}')" title="Preview"><i class="fa-regular fa-eye"></i></button>
                <button class="row-btn danger" onclick="app.confirmDelete('invoice','${inv.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div></td>
        </tr>`).join('');
}

// ─── INVOICE PREVIEW ─────────────────────────────────────────────────────────
function buildInvoiceHTML(inv, customer, billingInfo) {
    const items = (inv.items || []);

    const itemRows = items.map((it) => `
        <tr>
            <td>${fmt.date(inv.invoiceDate)}</td>
            <td>${it.itemName || ''}</td>
            <td style="text-align:right">${fmt.currency(it.unitPrice)}</td>
            <td style="text-align:center">${it.quantity}</td>
            <td style="text-align:right">${fmt.currency(it.total != null ? it.total : it.quantity * it.unitPrice)}</td>
        </tr>`).join('');

    // No filler rows — keeps invoice on one page when printing/PDF
    const blankRows = '';

    const total = inv.total != null ? inv.total : ((inv.subtotal || 0) + (inv.tax || 0));
    const custAddr = [customer?.company, customer?.address].filter(Boolean).join(', ')
        || 'Building No: U-524, Peshawari Gali, Urdu Bazar, Rawalpindi';

    const bi = billingInfo || {};

    return `
    <div class="tpl-invoice tpl-invoice--compact">

        <div class="tpl-header-bar">
            <div class="tpl-header-diagonal"></div>
            <img src="logo Telza.png" alt="Telza" class="tpl-logo-img">
        </div>

        <div class="tpl-body">

            <h1 class="tpl-invoice-title">INVOICE</h1>

            <div class="tpl-meta-block">
                <div class="tpl-meta-line">
                    <span class="tpl-meta-key">Date:</span>
                    <span class="tpl-meta-val tpl-underline">${fmt.date(inv.invoiceDate)}</span>
                </div>
                <div class="tpl-meta-line">
                    <span class="tpl-meta-key">No. Invoice :</span>
                    <span class="tpl-meta-val tpl-underline">${inv.invoiceNumber || 'DRAFT'}</span>
                </div>
            </div>

            <div class="tpl-info-row">
                <div class="tpl-bill-col">
                    <div class="tpl-info-label">Bill to:</div>
                    <div class="tpl-info-underline">${customer?.name || inv.clientName || ''}</div>
                    <div class="tpl-info-address">${custAddr}</div>
                    ${customer?.email ? `<div class="tpl-info-address">${customer.email}</div>` : ''}
                    ${customer?.phone ? `<div class="tpl-info-address">${customer.phone}</div>` : ''}
                </div>
                <div class="tpl-pay-col">
                    <div class="tpl-pay-line"><span>Payment Method:</span><span>${bi.paymentMethod || $('inv-payment-method')?.value || '—'}</span></div>
                    <div class="tpl-pay-line"><span>Bank Name:</span><span>${bi.bankName || $('inv-bank-name')?.value || '—'}</span></div>
                    <div class="tpl-pay-line"><span>Bank Address:</span><span>${bi.bankAddress || $('inv-bank-address')?.value || '—'}</span></div>
                    <div class="tpl-pay-line"><span>Bank Contact Name:</span><span>${bi.accountName || $('inv-account-name')?.value || '—'}</span></div>
                    <div class="tpl-pay-line"><span>Bank Contact Phone:</span><span>${bi.contactPhone || $('inv-contact-phone')?.value || '—'}</span></div>
                    <div class="tpl-pay-line"><span>Bank Contact Email:</span><span>${bi.contactEmail || $('inv-contact-email')?.value || '—'}</span></div>
                    <div class="tpl-pay-line"><span>Contact Fax:</span><span>${bi.contactFax || $('inv-contact-fax')?.value || '—'}</span></div>
                    <div class="tpl-pay-line"><span>Account Number:</span><span>${bi.accountNumber || $('inv-account-number')?.value || '—'}</span></div>
                </div>
            </div>

            <table class="tpl-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Item Description</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows}
                    ${blankRows}
                </tbody>
            </table>

            <div class="tpl-footer-row">
                <div class="tpl-thank-you">THANK YOU!</div>
                <div class="tpl-total-box">
                    <span class="tpl-total-label">Total:</span>
                    <span class="tpl-total-val">${fmt.currency(total)}</span>
                </div>
            </div>

            <div class="tpl-contacts">
                <span><i class="fa-solid fa-phone"></i> +92 315 5169366 | +92 324 5708356</span>
                <span><i class="fa-regular fa-envelope"></i> Telzaofficial@gmail.com</span>
                <span><i class="fa-solid fa-globe"></i> www.telza.co</span>
            </div>

        </div>
    </div>`;
}

// ─── KYC DETAIL HTML ──────────────────────────────────────────────────────────
function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function kycDetailRow(label, value) {
    const v = value == null || value === '' ? '—' : String(value);
    return `<div class="kyc-detail-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(v)}</strong></div>`;
}

function ynLabel(v) {
    if (v === true) return 'Yes';
    if (v === false) return 'No';
    return '—';
}

function corporateTypeLabel(v) {
    const m = { 1: 'Sole Proprietorship', 2: 'LLC', 3: 'Corporation', 4: 'Partnership', 5: 'Other', 6: 'Non-Profit' };
    if (v != null && m[v] != null) return m[v];
    if (typeof v === 'string' && v.trim()) return v;
    return '—';
}

function productTypeLabel(pt) {
    const m = {
        1: 'VoIP', 2: 'Dialler Server', 3: 'Inbound DID', 4: 'TFN', 5: 'AI Bots',
        VOIP: 'VoIP', DiallerServer: 'Dialler Server', InboundDID: 'Inbound DID', TFN: 'TFN', AIBots: 'AI Bots',
    };
    if (m[pt] != null) return m[pt];
    return pt != null && pt !== '' ? String(pt) : '—';
}

function productDetailParts(p) {
    const parts = [];
    if (p.numberOfPorts != null) parts.push(`Ports: ${p.numberOfPorts}`);
    if (p.numberOfAgents != null) parts.push(`Agents: ${p.numberOfAgents}`);
    if (p.numberOfDIDs != null) parts.push(`DIDs: ${p.numberOfDIDs}`);
    if (p.specificAreaCodes) parts.push(`Area codes: ${p.specificAreaCodes}`);
    if (p.tfnQuantity != null) parts.push(`TFN qty: ${p.tfnQuantity}`);
    if (p.numberOfBots != null) parts.push(`Bots: ${p.numberOfBots}`);
    if (p.botServerInformation) parts.push(`Server info: ${p.botServerInformation}`);
    if (p.closerDiallerDetails) parts.push(`Closer dialler: ${p.closerDiallerDetails}`);
    return parts.join(' · ');
}

const BIZ_DESC_LABELS = {
    carrier: 'Carrier / Service Provider',
    reseller: 'Reseller',
    enterprise: 'Enterprise',
    call_center: 'Call Center / BPO',
    other: 'Other',
};

function formatBizDesc(arr) {
    if (!arr || !arr.length) return '—';
    return arr.map(k => BIZ_DESC_LABELS[k] || k).join(', ');
}

function filterKycDetailSections() {
    const input = $('kyc-detail-search');
    const body = $('kyc-detail-body');
    if (!input || !body) return;
    const q = input.value.trim().toLowerCase();
    body.querySelectorAll('.kyc-detail-section').forEach(sec => {
        let visible = 0;
        sec.querySelectorAll('.kyc-detail-row, .kyc-trade-ref-card, .kyc-product-chip').forEach(el => {
            const show = !q || el.textContent.toLowerCase().includes(q);
            el.classList.toggle('kyc-detail-row--hidden', !show);
            if (show) visible++;
        });
        sec.classList.toggle('kyc-detail-section--hidden', visible === 0 && q.length > 0);
    });
}

function buildKycDetailHTML(kyc) {
    const cd = kyc.companyDetails || {};
    const ti = kyc.technicalInformation || {};
    const ps = kyc.productSelections || [];
    const ox = kyc.onboardingExtensions || null;
    const bk = ox?.companyBanking || {};
    const tr = ox?.tradeReferences || [];
    const reg = ox?.regulatoryCompliance || {};
    const att = ox?.attestation || {};

    const legacyNotice = !ox
        ? `<div class="kyc-detail-notice kyc-full-width"><strong>Note:</strong> Banking, trade references, regulatory compliance, and attestation were not stored on this record (submitted before extended snapshot). New applications include full section data.</div>`
        : '';

    const metaSection = `
        <div class="kyc-detail-section kyc-full-width">
            <div class="kyc-section-title"><i class="fa-solid fa-fingerprint"></i> Application</div>
            <div class="kyc-detail-rows">
                ${kycDetailRow('Application ID', kyc.id)}
                ${kycDetailRow('User ID', kyc.userId)}
                ${kycDetailRow('Status', kycStatusString(kyc.status))}
                ${kycDetailRow('Submitted', fmt.date(kyc.createdAt))}
                ${kyc.updatedAt ? kycDetailRow('Last updated', fmt.date(kyc.updatedAt)) : ''}
            </div>
        </div>`;

    const companySection = `
        <div class="kyc-detail-section kyc-full-width">
            <div class="kyc-section-title"><i class="fa-solid fa-building"></i> Company information</div>
            <div class="kyc-detail-rows">
                ${kycDetailRow('Legal company name', cd.companyName)}
                ${kycDetailRow('Other designated names', cd.otherDesignatedNames)}
                ${kycDetailRow('Physical address', cd.address)}
                ${kycDetailRow('City', cd.city)}
                ${kycDetailRow('State / province', cd.state)}
                ${kycDetailRow('ZIP / postal', cd.zipCode)}
                ${kycDetailRow('Country', cd.country)}
                ${kycDetailRow('Mailing address', cd.mailingAddress)}
                ${kycDetailRow('Mailing city / state / ZIP', cd.mailingCityStateZip)}
                ${kycDetailRow('Business based in U.S.', ynLabel(cd.businessBasedInUs))}
                ${kycDetailRow('State of incorporation', cd.stateOfIncorporation)}
                ${kycDetailRow('Date of incorporation', cd.dateOfIncorporation ? fmt.date(cd.dateOfIncorporation) : '—')}
                ${kycDetailRow('Business license #', cd.businessLicenseNumber)}
                ${kycDetailRow('FEIN', cd.feinNumber)}
                ${kycDetailRow('FRN', cd.frnNumber)}
                ${kycDetailRow('Corporate type', corporateTypeLabel(cd.corporateType))}
                ${kycDetailRow('Business line', cd.businessLine)}
                ${kycDetailRow('Mobile', cd.mobileNumber)}
                ${kycDetailRow('Teams / WhatsApp', cd.teamsOrWhatsApp)}
                ${kycDetailRow('499 Filer ID', cd.filerID499)}
                ${kycDetailRow('Business contact name', cd.businessContactName)}
                ${kycDetailRow('Business phone', cd.businessPhone)}
                ${kycDetailRow('Mobile (separate)', cd.mobilePhoneSeparate)}
                ${kycDetailRow('VoIP portal email', cd.voipPortalEmail)}
                ${kycDetailRow('Email for rates', cd.emailForRates)}
                ${kycDetailRow('Email for notices', cd.emailForNotices)}
                ${kycDetailRow('Email for balances', cd.emailForBalances)}
                ${kycDetailRow('Primary main email', cd.primaryMainEmail)}
                ${kycDetailRow('Billing / accounting email', cd.billingAccountingEmail)}
                ${kycDetailRow('Support / NOC email', cd.supportNocEmail)}
                ${kycDetailRow('Legal email', cd.legalEmail)}
                ${kycDetailRow('Compliance email', cd.complianceEmail)}
                ${kycDetailRow('Fraud report email', cd.fraudReportEmail)}
                ${kycDetailRow('Customer main phone', cd.customerMainPhone)}
                ${kycDetailRow('Customer fax', cd.customerFax)}
                ${kycDetailRow('Customer URL', cd.customerUrl)}
                ${kycDetailRow('Company contact name', cd.companyContactName)}
                ${kycDetailRow('Skype ID', cd.skypeId)}
            </div>
        </div>`;

    let bankingSection = '';
    if (ox) {
        bankingSection = `
        <div class="kyc-detail-section kyc-full-width">
            <div class="kyc-section-title"><i class="fa-solid fa-building-columns"></i> Banking (U.S. account)</div>
            <div class="kyc-detail-rows">
                ${kycDetailRow('Has U.S. bank account', ynLabel(bk.hasUsBankAccount))}
                ${bk.hasUsBankAccount ? `
                ${kycDetailRow('Bank name', bk.bankName)}
                ${kycDetailRow('Bank address', bk.bankAddress)}
                ${kycDetailRow('Contact name', bk.contactName)}
                ${kycDetailRow('Contact phone', bk.contactPhone)}
                ${kycDetailRow('Contact email', bk.contactEmail)}
                ${kycDetailRow('Contact fax', bk.contactFax)}
                ${kycDetailRow('Account number', bk.accountNumber)}
                ` : ''}
            </div>
        </div>`;
    }

    let tradeSection = '';
    if (ox && tr.length) {
        tradeSection = `
        <div class="kyc-detail-section kyc-full-width">
            <div class="kyc-section-title"><i class="fa-solid fa-handshake"></i> Trade references</div>
            ${tr.map((r, i) => `
            <div class="kyc-trade-ref-card">
                <div class="kyc-trade-ref-title">Reference ${i + 1}</div>
                <div class="kyc-detail-rows">
                    ${kycDetailRow('Name', r.tradeReferenceName)}
                    ${kycDetailRow('Number', r.tradeReferenceNumber)}
                    ${kycDetailRow('Address', r.tradeReferenceAddress)}
                    ${kycDetailRow('Contact name', r.contactName)}
                    ${kycDetailRow('Contact email', r.contactEmail)}
                    ${kycDetailRow('Contact phone', r.contactPhone)}
                </div>
            </div>`).join('')}
        </div>`;
    }

    const regBoolRows = ox ? [
        ['robocallMitigationRegistered', 'Registered with RoboCall Mitigation Database'],
        ['stirShakenRmdImplemented', 'STIR/SHAKEN & RMD plan implemented'],
        ['signingAllCalls', 'Signing and attesting ALL calls'],
        ['complianceUsBankAccount', 'U.S. bank account (compliance)'],
        ['originateConversationalTraffic', 'Originate / process conversational traffic'],
        ['originateAutodialedTraffic', 'Originate / process autodialed traffic'],
        ['directAutodialClients', 'Direct autodial clients'],
        ['nonUsAutodialSources', 'Autodialed traffic from non-U.S. sources'],
        ['itgTracingEngaged', 'Engaged in ITG tracing'],
        ['moreThanThreeTracebacksLastYear', '&gt;3 tracebacks in last year'],
        ['moreThanFourGovImpersonationTracebacks', '&gt;4 gov. impersonation tracebacks'],
        ['nonCooperativeVspByUsTelecom', 'Non-cooperative VSP (US Telecom)'],
        ['blockedFromNetworkLastTwoYears', 'Blocked/removed from another network (2 yrs)'],
        ['adverseJudgementUnlawfulRobocalls', 'Adverse judgement (unlawful robocalls)'],
    ].map(([key, label]) => kycDetailRow(label, ynLabel(reg[key]))).join('') : '';

    let regulatorySection = '';
    if (ox) {
        regulatorySection = `
        <div class="kyc-detail-section kyc-full-width">
            <div class="kyc-section-title"><i class="fa-solid fa-scale-balanced"></i> Regulatory &amp; compliance</div>
            <div class="kyc-detail-rows">
                ${kycDetailRow('Business descriptions', formatBizDesc(reg.businessDescriptions))}
                ${kycDetailRow('Other description', reg.businessDescriptionOtherText)}
                ${kycDetailRow('Intermediate Provider Registry company', reg.intermediateProviderRegistryCompanyName)}
                ${kycDetailRow('STIR/SHAKEN certificate company', reg.stirShakenCertCompanyName)}
                ${kycDetailRow('OCN (STIR/SHAKEN header)', reg.ocnStirShakenHeader)}
                ${kycDetailRow('FCC 499 Filer ID', reg.fcc499FilerId)}
                ${kycDetailRow('RoboCall Mitigation listed company', reg.robocallMitigationListedCompanyName)}
                ${kycDetailRow('RoboCall Mitigation database #', reg.robocallMitigationDatabaseNumber)}
                ${regBoolRows}
                ${kycDetailRow('Estimated ASR %', reg.estimatedAsrPercent != null ? String(reg.estimatedAsrPercent) : '—')}
                ${kycDetailRow('Estimated ALOC (sec)', reg.estimatedAloc != null ? String(reg.estimatedAloc) : '—')}
                ${kycDetailRow('Unallocated 404 %', reg.estimatedUnallocated404Percent != null ? String(reg.estimatedUnallocated404Percent) : '—')}
                ${kycDetailRow('Cancel / 487 %', reg.estimatedCancel487Percent != null ? String(reg.estimatedCancel487Percent) : '—')}
                ${kycDetailRow('Short duration %', reg.estimatedShortDurationPercent != null ? String(reg.estimatedShortDurationPercent) : '—')}
            </div>
        </div>`;
    }

    const productsSection = ps.length ? `
        <div class="kyc-detail-section kyc-full-width">
            <div class="kyc-section-title"><i class="fa-solid fa-boxes-stacked"></i> Product selections</div>
            <div class="kyc-products-grid">
                ${ps.map(p => {
        const title = productTypeLabel(p.productType);
        const sub = productDetailParts(p);
        return `
                <div class="kyc-product-chip">
                    <i class="fa-solid fa-check-circle"></i>
                    <span>${escapeHtml(title)}</span>
                    ${sub ? `<small>${escapeHtml(sub)}</small>` : ''}
                </div>`;
    }).join('')}
            </div>
        </div>` : '';

    const techSection = `
        <div class="kyc-detail-section kyc-full-width">
            <div class="kyc-section-title"><i class="fa-solid fa-server"></i> Technical information</div>
            <div class="kyc-detail-rows">
                ${kycDetailRow('Dialler server link', ti.diallerServerLink || '—')}
                ${kycDetailRow('Validation link', ti.validationLink || '—')}
                ${ti.serverIPs ? `<div class="kyc-detail-row"><span>Server IPs</span><strong class="kyc-detail-multiline">${escapeHtml(ti.serverIPs)}</strong></div>` : kycDetailRow('Server IPs', '—')}
                ${ti.diallerLevel9AccessDetails ? `<div class="kyc-detail-row"><span>Dialler level 9 / access</span><strong class="kyc-detail-multiline">${escapeHtml(ti.diallerLevel9AccessDetails)}</strong></div>` : kycDetailRow('Dialler level 9 / access', '—')}
            </div>
        </div>`;

    let attestationSection = '';
    if (ox) {
        attestationSection = `
        <div class="kyc-detail-section kyc-full-width">
            <div class="kyc-section-title"><i class="fa-solid fa-pen-to-square"></i> Attestation</div>
            <div class="kyc-detail-rows">
                ${kycDetailRow('Officer name', att.officerName)}
                ${kycDetailRow('Typed signature', att.signatureText)}
            </div>
        </div>`;
    }

    return `
    <div class="kyc-detail-grid">
        ${legacyNotice}
        ${metaSection}
        ${companySection}
        ${bankingSection}
        ${tradeSection}
        ${regulatorySection}
        ${productsSection}
        ${techSection}
        ${attestationSection}
    </div>`;
}

// ─── SHORTHAND ────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

// ─── MAIN APP OBJECT ─────────────────────────────────────────────────────────
const app = {

    async init() {
        // Wire modal close buttons
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', () => closeModal(btn.dataset.modal));
        });
        // Backdrop click close
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', e => {
                if (e.target === backdrop) closeAllModals();
            });
        });

        // Sidebar toggle
        $('sidebar-open')?.addEventListener('click', () => {
            $('sidebar').classList.add('open');
            $('sidebar-overlay').classList.add('visible');
        });
        $('sidebar-close')?.addEventListener('click', () => {
            $('sidebar').classList.remove('open');
            $('sidebar-overlay').classList.remove('visible');
        });
        $('sidebar-overlay')?.addEventListener('click', () => {
            $('sidebar').classList.remove('open');
            $('sidebar-overlay').classList.remove('visible');
        });

        // Nav items
        document.querySelectorAll('.nav-item[data-page]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                app.navigate(link.dataset.page);
                if (window.innerWidth <= 768) {
                    $('sidebar').classList.remove('open');
                    $('sidebar-overlay').classList.remove('visible');
                }
            });
        });

        // Login
        $('login-form').addEventListener('submit', app.handleLogin);

        // Password toggle
        $('toggle-password')?.addEventListener('click', () => {
            const inp = $('login-password');
            const icon = $('toggle-password').querySelector('i');
            const show = inp.type === 'password';
            inp.type = show ? 'text' : 'password';
            icon.className = show ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        });

        // Logout
        $('btn-logout').addEventListener('click', () => app.logout());

        // Add customer form
        $('form-add-customer').addEventListener('submit', app.handleAddCustomer);

        // Invoice form
        $('create-invoice-form').addEventListener('submit', app.handleCreateInvoice);
        $('btn-add-item').addEventListener('click', () => addLineItem());
        $('btn-preview-invoice').addEventListener('click', app.previewFromForm);
        window.addEventListener('beforeprint', () => {
            if ($('modal-preview-invoice')?.classList.contains('open')) {
                document.documentElement.classList.add('print-invoice-preview');
            }
        });
        window.addEventListener('afterprint', () => {
            document.documentElement.classList.remove('print-invoice-preview');
        });
        $('btn-print-invoice')?.addEventListener('click', () => {
            if ($('modal-preview-invoice')?.classList.contains('open')) {
                document.documentElement.classList.add('print-invoice-preview');
            }
            requestAnimationFrame(() => window.print());
        });
        $('inv-tax-rate').addEventListener('input', recalcInvoice);

        // Customer select → auto-fill
        $('inv-customer').addEventListener('change', e => fillCustomerInfoCard(e.target.value));

        // Global search
        $('global-search').addEventListener('input', e => {
            const v = e.target.value;
            if (state.currentPage === 'customers') renderCustomers(v);
            if (state.currentPage === 'invoices') renderInvoices(v);
            if (state.currentPage === 'kyc-applications') renderKycApplications(v);
        });

        // Customer search
        $('search-customers').addEventListener('input', e => renderCustomers(e.target.value));
        $('search-invoices').addEventListener('input', e => renderInvoices(e.target.value));
        $('search-kyc').addEventListener('input', e => renderKycApplications(e.target.value));

        // Invoice filter pills
        document.querySelectorAll('.filter-pills .pill[data-filter]').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.filter-pills .pill[data-filter]').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                state.invoiceFilter = pill.dataset.filter;
                renderInvoices($('search-invoices').value);
            });
        });

        // KYC filter pills
        document.querySelectorAll('.pill[data-kycfilter]').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.pill[data-kycfilter]').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                state.kycFilter = pill.dataset.kycfilter;
                renderKycApplications($('search-kyc').value);
            });
        });

        // Confirm delete
        $('btn-confirm-delete').addEventListener('click', () => {
            if (state.deleteCallback) state.deleteCallback();
            closeModal('modal-confirm-delete');
            state.deleteCallback = null;
        });

        // KYC modal → Create Invoice button
        $('btn-create-invoice-from-kyc')?.addEventListener('click', () => {
            if (state.selectedKyc) {
                closeModal('modal-kyc-detail');
                app.createInvoiceFromKyc(state.selectedKyc.id);
            }
        });

        $('kyc-detail-search')?.addEventListener('input', () => filterKycDetailSections());

        $('btn-kyc-status-save')?.addEventListener('click', () => { void app.saveKycStatus(); });

        // Check auth
        if (state.token) {
            await app.boot();
        }
    },

    async handleLogin(e) {
        e.preventDefault();
        const btn = $('btn-login');
        const label = btn.querySelector('.btn-label');
        const spinner = btn.querySelector('.btn-spinner');
        const alertEl = $('auth-alert');
        const alertTx = $('auth-alert-text');

        label.textContent = 'Signing in…';
        spinner.classList.remove('hidden');
        btn.disabled = true;
        alertEl.classList.add('hidden');

        const email = $('login-email').value.trim();
        const password = $('login-password').value;

        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            if (!res?.token) throw new Error('No token received');
            state.token = res.token;
            state.user = res;
            localStorage.setItem('telza_token', res.token);
            await app.boot();
        } catch (err) {
            alertTx.textContent = err.message || 'Invalid email or password';
            alertEl.classList.remove('hidden');
        } finally {
            label.textContent = 'Sign In';
            spinner.classList.add('hidden');
            btn.disabled = false;
        }
    },

    async boot() {
        $('auth-screen').classList.add('hidden');
        $('app-shell').classList.remove('hidden');
        await app.loadData();
        renderDashboard();
        renderCustomers();
        renderInvoices();
        renderKycApplications();
        populateCustomerDropdown();
        app.navigate('dashboard');

        // Default invoice date
        const d = new Date();
        const yyyy = d.getFullYear(), mm = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
        if ($('inv-date')) $('inv-date').value = `${yyyy}-${mm}-${dd}`;

        // Add first line item
        if (document.querySelectorAll('.item-row').length === 0) addLineItem();
    },

    async loadData() {
        try {
            const [cust, inv, kyc] = await Promise.all([
                apiFetch('/clients'),
                apiFetch('/invoices'),
                apiFetch('/kyc').catch(() => []),   // gracefully handle if no kyc yet
            ]);
            state.customers = cust || [];
            state.invoices = inv || [];
            state.kycApplications = kyc || [];
        } catch (err) {
            toast('Could not load data from server: ' + err.message, 'err');
        }
    },

    logout(msg) {
        state.token = null;
        state.user = null;
        localStorage.removeItem('telza_token');
        $('auth-screen').classList.remove('hidden');
        $('app-shell').classList.add('hidden');
        if (msg) { setTimeout(() => toast(msg, 'warn'), 200); }
    },

    navigate(page) {
        state.currentPage = page;

        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
        const target = $(`page-${page}`);
        if (target) target.classList.add('active');

        document.querySelectorAll('.nav-item').forEach(n => {
            n.classList.toggle('active', n.dataset.page === page);
        });

        const labels = {
            dashboard: 'Dashboard',
            customers: 'Customers',
            'kyc-applications': 'KYC Applications',
            invoices: 'Invoices',
            'create-invoice': 'Create Invoice'
        };
        $('page-heading').textContent = labels[page] || page;

        // Refresh content per page
        if (page === 'dashboard') renderDashboard();
        if (page === 'customers') renderCustomers();
        if (page === 'kyc-applications') renderKycApplications();
        if (page === 'invoices') renderInvoices();
        if (page === 'create-invoice') {
            populateCustomerDropdown();
            const invSel = $('inv-customer');
            if (invSel?.value) fillCustomerInfoCard(invSel.value);
            else fillCustomerInfoCard(null);
        }
    },

    openModal,

    // ─── Add Customer ─────────────────────────────────────────────────────
    async handleAddCustomer(e) {
        e.preventDefault();
        const btn = $('btn-save-customer');
        const label = btn.querySelector('.btn-label');
        const spinner = btn.querySelector('.btn-spinner');

        label.textContent = 'Saving…'; spinner.classList.remove('hidden'); btn.disabled = true;

        const payload = {
            name: $('cust-name').value.trim(),
            email: $('cust-email').value.trim(),
            phone: $('cust-phone').value.trim(),
            company: $('cust-company').value.trim(),
            address: $('cust-address').value.trim(),
        };
        try {
            const res = await apiFetch('/clients', { method: 'POST', body: JSON.stringify(payload) });
            state.customers.push(res);
            toast('Customer added successfully!', 'ok');
            closeModal('modal-add-customer');
            e.target.reset();
            renderCustomers();
            populateCustomerDropdown();
            renderDashboard();
        } catch (err) {
            toast(err.message, 'err');
        } finally {
            label.textContent = 'Save Customer'; spinner.classList.add('hidden'); btn.disabled = false;
        }
    },

    // ─── Create Invoice ───────────────────────────────────────────────────
    async handleCreateInvoice(e) {
        e.preventDefault();

        const clientId = $('inv-customer').value;
        if (!clientId) { toast('Please select a customer', 'warn'); return; }

        const rows = document.querySelectorAll('.item-row');
        if (rows.length === 0) { toast('Add at least one line item', 'warn'); return; }

        const items = [];
        let valid = true;
        rows.forEach(row => {
            const desc = row.querySelector('.item-desc').value.trim();
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            if (!desc || qty <= 0 || price < 0) { valid = false; return; }
            items.push({ itemName: desc, quantity: qty, unitPrice: price });
        });
        if (!valid) { toast('Fill in all line item fields correctly', 'warn'); return; }

        const taxRate = parseFloat($('inv-tax-rate').value) || 0;
        const status = $('inv-status').value;
        const invDate = $('inv-date').value;
        const taxAmount = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0) * (taxRate / 100);

        const payload = {
            clientId: clientId,
            invoiceDate: invDate,
            tax: taxAmount,
            status: status,
            items: items,
        };

        const btn = $('btn-save-invoice');
        const label = btn.querySelector('.btn-label');
        const spinner = btn.querySelector('.btn-spinner');
        label.classList.add('hidden'); spinner.classList.remove('hidden'); btn.disabled = true;

        try {
            const res = await apiFetch('/invoices', { method: 'POST', body: JSON.stringify(payload) });
            state.invoices.push(res);
            toast('Invoice created successfully!', 'ok');
            // Reset form
            $('create-invoice-form').reset();
            document.getElementById('line-items-body').innerHTML = '';
            addLineItem();
            $('items-empty').classList.add('hidden');
            recalcInvoice();
            fillCustomerInfoCard(null);
            app.navigate('invoices');
        } catch (err) {
            toast(err.message, 'err');
        } finally {
            label.classList.remove('hidden'); spinner.classList.add('hidden'); btn.disabled = false;
        }
    },

    // ─── Preview Invoice (from list) ──────────────────────────────────────
    async previewInvoice(id) {
        try {
            let inv = state.invoices.find(i => i.id == id);
            if (!inv?.items || inv.items.length === 0) {
                inv = await apiFetch(`/invoices/${id}`);
            }
            const cust = state.customers.find(c => c.id == inv.clientId);
            const kyc = state.kycApplications.find(k =>
                k.companyDetails?.voipPortalEmail === cust?.email ||
                k.companyDetails?.companyName === cust?.company
            );
            $('invoice-print-area').innerHTML = buildInvoiceHTML(inv, cust, null);
            openModal('modal-preview-invoice');
        } catch (err) {
            toast('Unable to load invoice: ' + err.message, 'err');
        }
    },

    // ─── Preview Invoice from form ────────────────────────────────────────
    previewFromForm() {
        const clientId = $('inv-customer').value;
        if (!clientId) { toast('Select a customer first', 'warn'); return; }

        const rows = document.querySelectorAll('.item-row');
        if (rows.length === 0) { toast('Add at least one item', 'warn'); return; }

        const items = [];
        rows.forEach(row => {
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            items.push({ itemName: row.querySelector('.item-desc').value.trim() || '—', quantity: qty, unitPrice: price, total: qty * price });
        });

        const { subtotal, tax, total } = recalcInvoice();
        const cust = state.customers.find(c => c.id == clientId);
        const inv = { invoiceNumber: 'DRAFT', invoiceDate: $('inv-date').value, subtotal, tax, total, items };

        // Collect billing info from form fields
        const billingInfo = {
            paymentMethod: $('inv-payment-method')?.value || '',
            bankName: $('inv-bank-name')?.value || '',
            bankAddress: $('inv-bank-address')?.value || '',
            accountName: $('inv-account-name')?.value || '',
            accountNumber: $('inv-account-number')?.value || '',
            contactPhone: $('inv-contact-phone')?.value || '',
            contactEmail: $('inv-contact-email')?.value || '',
            contactFax: $('inv-contact-fax')?.value || '',
        };

        $('invoice-print-area').innerHTML = buildInvoiceHTML(inv, cust, billingInfo);
        openModal('modal-preview-invoice');
    },

    // ─── View KYC Detail ──────────────────────────────────────────────────
    async viewKycDetail(id) {
        try {
            const kyc = await apiFetch(`/kyc/${id}`);
            state.selectedKyc = kyc;
            const idx = state.kycApplications.findIndex(k => k.id == id);
            if (idx >= 0) state.kycApplications[idx] = kyc;
            const searchEl = $('kyc-detail-search');
            if (searchEl) searchEl.value = '';
            $('kyc-detail-body').innerHTML = buildKycDetailHTML(kyc);
            filterKycDetailSections();
            openModal('modal-kyc-detail');
        } catch (err) {
            toast('Unable to load KYC details: ' + err.message, 'err');
        }
    },

    openKycStatusModal(id, currentStatus) {
        state.kycStatusEditId = id;
        const idEl = $('kyc-status-application-id');
        if (idEl) idEl.textContent = id;
        const sel = $('kyc-status-select');
        if (sel) sel.value = String(Number(currentStatus) || 1);
        openModal('modal-kyc-status');
    },

    async saveKycStatus() {
        const id = state.kycStatusEditId;
        if (!id) return;
        const sel = $('kyc-status-select');
        const status = sel ? parseInt(sel.value, 10) : 1;
        try {
            const updated = await apiFetch(`/kyc/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status }),
            });
            const idx = state.kycApplications.findIndex(k => k.id == id);
            if (idx >= 0) state.kycApplications[idx] = updated;
            if (state.selectedKyc && state.selectedKyc.id == id) state.selectedKyc = updated;
            closeModal('modal-kyc-status');
            state.kycStatusEditId = null;
            renderKycApplications($('search-kyc').value);
            toast('KYC status updated.', 'ok');
        } catch (err) {
            toast(err.message || 'Update failed', 'err');
        }
    },

    // ─── Create Invoice from KYC ──────────────────────────────────────────
    createInvoiceFromKyc(kycId) {
        const kyc = state.kycApplications.find(k => k.id == kycId);
        if (!kyc) return;

        const cd = kyc.companyDetails || {};
        const norm = (s) => (s || '').trim().toLowerCase();
        const em = norm(cd.voipPortalEmail);
        const pm = norm(cd.primaryMainEmail);
        const ba = norm(cd.billingAccountingEmail);

        const cust = state.customers.find(c => {
            const ce = norm(c.email);
            const emailHit = ce && (ce === em || ce === pm || ce === ba);
            const companyHit = c.company && cd.companyName && norm(c.company) === norm(cd.companyName);
            const nameHit = c.name && cd.businessContactName && norm(c.name) === norm(cd.businessContactName);
            return emailHit || companyHit || nameHit;
        });

        app.navigate('create-invoice');

        setTimeout(() => {
            const sel = $('inv-customer');
            if (cust && sel) {
                sel.value = cust.id;
                fillCustomerInfoCard(cust.id, { kycId });
            } else {
                if (sel) sel.value = '';
                fillCustomerInfoCard(null, { kycId });
            }
            toast(cust ? 'Customer and billing loaded from KYC.' : 'Select a customer — billing pre-filled from this KYC.', 'info');
        }, 100);
    },

    // ─── Create Invoice for a specific customer ───────────────────────────
    createInvoiceForCustomer(custId) {
        app.navigate('create-invoice');
        setTimeout(() => {
            const sel = $('inv-customer');
            if (sel) sel.value = custId;
            fillCustomerInfoCard(custId);
            toast('Customer selected! Add line items and save.', 'info');
        }, 100);
    },

    // ─── Delete ───────────────────────────────────────────────────────────
    confirmDelete(type, id) {
        $('confirm-delete-text').textContent =
            type === 'invoice'
                ? 'Delete this invoice permanently? This cannot be undone.'
                : 'Delete this customer permanently? This cannot be undone.';
        state.deleteCallback = () => app.doDelete(type, id);
        openModal('modal-confirm-delete');
    },

    async doDelete(type, id) {
        try {
            if (type === 'invoice') {
                await apiFetch(`/invoices/${id}`, { method: 'DELETE' });
                state.invoices = state.invoices.filter(i => i.id != id);
                renderInvoices();
                renderDashboard();
                toast('Invoice deleted', 'ok');
            } else {
                await apiFetch(`/clients/${id}`, { method: 'DELETE' });
                state.customers = state.customers.filter(c => c.id != id);
                renderCustomers();
                populateCustomerDropdown();
                renderDashboard();
                toast('Customer deleted', 'ok');
            }
        } catch (err) {
            toast('Delete failed: ' + err.message, 'err');
        }
    },
};

// ─── BOOT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => app.init());
