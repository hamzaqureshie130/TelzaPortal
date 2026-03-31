/**
 * Telza Portal – App Logic
 * Connects to ASP.NET Core REST API
 * API Base: https://localhost:7090/api
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────
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

function fillCustomerInfoCard(customerId) {
    const card = document.getElementById('customer-info-card');
    if (!card) return;

    if (!customerId) {
        card.classList.add('hidden');
        return;
    }

    const c = state.customers.find(x => x.id == customerId);
    if (!c) { card.classList.add('hidden'); return; }

    document.getElementById('cic-avatar').textContent = fmt.initials(c.name);
    document.getElementById('cic-name').textContent = c.name || '—';
    document.getElementById('cic-company').textContent = c.company || '—';
    document.getElementById('cic-email').textContent = c.email || '—';
    document.getElementById('cic-phone').textContent = c.phone || '—';
    document.getElementById('cic-address').textContent = c.address || '—';

    card.classList.remove('hidden');

    // Auto-fill billing info from KYC data if available
    const kyc = state.kycApplications.find(k =>
        k.companyDetails?.businessContactName === c.name ||
        k.companyDetails?.voipPortalEmail === c.email ||
        k.companyDetails?.companyName === c.company
    );

    if (kyc?.billingInformation) {
        const b = kyc.billingInformation;
        safeSet('inv-payment-method', b.paymentMethod);
        safeSet('inv-bank-name', b.bankName);
        safeSet('inv-account-name', b.accountName);
        safeSet('inv-account-number', b.accountNumber);
        safeSet('inv-notes', b.notes);
    }
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
        const matchText =
            (cd.companyName || '').toLowerCase().includes(q) ||
            (cd.businessContactName || '').toLowerCase().includes(q) ||
            (cd.voipPortalEmail || '').toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || (k.status || 'Pending') === statusFilter;
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
            <td>${statusBadge(k.status || 'Pending')}</td>
            <td><div class="row-actions">
                <button class="row-btn" onclick="app.viewKycDetail('${k.id}')" title="View Details"><i class="fa-solid fa-eye"></i></button>
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
    const MIN_ROWS = 8;

    const itemRows = items.map((it) => `
        <tr>
            <td>${fmt.date(inv.invoiceDate)}</td>
            <td>${it.itemName || ''}</td>
            <td style="text-align:right">${fmt.currency(it.unitPrice)}</td>
            <td style="text-align:center">${it.quantity}</td>
            <td style="text-align:right">${fmt.currency(it.total != null ? it.total : it.quantity * it.unitPrice)}</td>
        </tr>`).join('');

    const blankCount = Math.max(0, MIN_ROWS - items.length);
    const blankRows = Array.from({ length: blankCount })
        .map(() => `<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td></tr>`).join('');

    const total = inv.total != null ? inv.total : ((inv.subtotal || 0) + (inv.tax || 0));
    const custAddr = [customer?.company, customer?.address].filter(Boolean).join(', ')
        || 'Building No: U-524, Peshawari Gali, Urdu Bazar, Rawalpindi';

    const bi = billingInfo || {};

    return `
    <div class="tpl-invoice">

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
                    <div class="tpl-pay-line"><span>Account Name:</span><span>${bi.accountName || $('inv-account-name')?.value || '—'}</span></div>
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
function buildKycDetailHTML(kyc) {
    const cd = kyc.companyDetails || {};
    const bi = kyc.billingInformation || {};
    const ti = kyc.technicalInformation || {};
    const ps = kyc.productSelections || [];

    return `
    <div class="kyc-detail-grid">
        <div class="kyc-detail-section">
            <div class="kyc-section-title"><i class="fa-solid fa-building"></i> Company Details</div>
            <div class="kyc-detail-rows">
                <div class="kyc-detail-row"><span>Company Name</span><strong>${cd.companyName || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Business Contact</span><strong>${cd.businessContactName || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Email (VoIP)</span><strong>${cd.voipPortalEmail || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Mobile</span><strong>${cd.mobileNumber || '—'}</strong></div>
                <div class="kyc-detail-row"><span>WhatsApp/Teams</span><strong>${cd.teamsOrWhatsApp || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Corporate Type</span><strong>${cd.corporateType || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Business Line</span><strong>${cd.businessLine || '—'}</strong></div>
                <div class="kyc-detail-row"><span>499 Filer ID</span><strong>${cd.filerID499 || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Address</span><strong>${[cd.address, cd.city, cd.state, cd.zipCode, cd.country].filter(Boolean).join(', ') || '—'}</strong></div>
            </div>
        </div>

        <div class="kyc-detail-section">
            <div class="kyc-section-title"><i class="fa-solid fa-building-columns"></i> Billing Information</div>
            <div class="kyc-detail-rows">
                <div class="kyc-detail-row"><span>Billing Contact</span><strong>${bi.billingContactName || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Billing Email</span><strong>${bi.billingEmail || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Payment Method</span><strong>${bi.paymentMethod || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Bank Name</span><strong>${bi.bankName || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Account Name</span><strong>${bi.accountName || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Account Number</span><strong>${bi.accountNumber || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Routing Number</span><strong>${bi.routingNumber || '—'}</strong></div>
                <div class="kyc-detail-row"><span>Billing Address</span><strong>${[bi.billingAddress, bi.billingCity, bi.billingState, bi.billingZipCode, bi.billingCountry].filter(Boolean).join(', ') || '—'}</strong></div>
            </div>
        </div>

        ${ps.length > 0 ? `
        <div class="kyc-detail-section kyc-full-width">
            <div class="kyc-section-title"><i class="fa-solid fa-boxes-stacked"></i> Product Selections</div>
            <div class="kyc-products-grid">
                ${ps.map(p => `
                <div class="kyc-product-chip">
                    <i class="fa-solid fa-check-circle"></i>
                    <span>${p.productType || p.productType}</span>
                    ${p.numberOfPorts ? `<small>Ports: ${p.numberOfPorts}</small>` : ''}
                    ${p.numberOfAgents ? `<small>Agents: ${p.numberOfAgents}</small>` : ''}
                    ${p.numberOfDIDs ? `<small>DIDs: ${p.numberOfDIDs}</small>` : ''}
                </div>`).join('')}
            </div>
        </div>` : ''}

        ${(ti.diallerServerLink || ti.serverIPs) ? `
        <div class="kyc-detail-section kyc-full-width">
            <div class="kyc-section-title"><i class="fa-solid fa-server"></i> Technical Information</div>
            <div class="kyc-detail-rows">
                ${ti.diallerServerLink ? `<div class="kyc-detail-row"><span>Dialler Server Link</span><strong>${ti.diallerServerLink}</strong></div>` : ''}
                ${ti.validationLink ? `<div class="kyc-detail-row"><span>Validation Link</span><strong>${ti.validationLink}</strong></div>` : ''}
                ${ti.serverIPs ? `<div class="kyc-detail-row"><span>Server IPs</span><strong>${ti.serverIPs}</strong></div>` : ''}
                <div class="kyc-detail-row"><span>Dialler Level 9 Access</span><strong>${ti.diallerLevel9Access ? 'Yes' : 'No'}</strong></div>
            </div>
        </div>` : ''}
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
        if (page === 'create-invoice') populateCustomerDropdown();
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
            // Clear billing fields
            ['inv-payment-method', 'inv-bank-name', 'inv-account-name', 'inv-account-number', 'inv-notes'].forEach(id => { const el = $(id); if (el) el.value = ''; });
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
            $('invoice-print-area').innerHTML = buildInvoiceHTML(inv, cust, kyc?.billingInformation);
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
            accountName: $('inv-account-name')?.value || '',
            accountNumber: $('inv-account-number')?.value || '',
        };

        $('invoice-print-area').innerHTML = buildInvoiceHTML(inv, cust, billingInfo);
        openModal('modal-preview-invoice');
    },

    // ─── View KYC Detail ──────────────────────────────────────────────────
    async viewKycDetail(id) {
        try {
            let kyc = state.kycApplications.find(k => k.id == id);
            if (!kyc?.companyDetails) {
                kyc = await apiFetch(`/kyc/${id}`);
            }
            state.selectedKyc = kyc;
            $('kyc-detail-body').innerHTML = buildKycDetailHTML(kyc);
            openModal('modal-kyc-detail');
        } catch (err) {
            toast('Unable to load KYC details: ' + err.message, 'err');
        }
    },

    // ─── Create Invoice from KYC ──────────────────────────────────────────
    createInvoiceFromKyc(kycId) {
        const kyc = state.kycApplications.find(k => k.id == kycId);
        if (!kyc) return;

        const cd = kyc.companyDetails || {};
        const bi = kyc.billingInformation || {};

        // Find matching customer
        const cust = state.customers.find(c =>
            c.email === cd.voipPortalEmail ||
            c.company === cd.companyName ||
            c.name === cd.businessContactName
        );

        app.navigate('create-invoice');

        setTimeout(() => {
            if (cust) {
                const sel = $('inv-customer');
                if (sel) sel.value = cust.id;
                fillCustomerInfoCard(cust.id);
            }
            // Auto-fill billing
            safeSet('inv-payment-method', bi.paymentMethod);
            safeSet('inv-bank-name', bi.bankName);
            safeSet('inv-account-name', bi.accountName);
            safeSet('inv-account-number', bi.accountNumber);
            safeSet('inv-notes', bi.notes);

            toast('Customer & billing info auto-filled from KYC!', 'info');
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
