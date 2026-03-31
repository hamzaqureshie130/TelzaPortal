/* =============================================
   KYC Portal – Pure JavaScript Conversion
   Replaces: Redux + React + Framer Motion
   ============================================= */

/* ======== SVG ICONS (inline) ======== */
const ICONS = {
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 20 4 15"></polyline></svg>`,
    checkSm: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 20 4 15"></polyline></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    creditCard: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    creditCardSm: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    shieldCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.42a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.08a16 16 0 0 0 6 6l.92-1.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.41v1.51z"/></svg>`,
    network: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="6"/><rect x="16" y="16" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/><path d="M5 16v-4h14v4"/><path d="M12 12V8"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    hash: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,
};

/* ======== STATE (replaces Redux store) ======== */
const state = {
    currentStep: 1,
    direction: 1,           // 1 = forward, -1 = backward
    formData: {
        user: { email: '', password: '', confirmPassword: '' },
        company: {
            companyName: '', address: '', city: '', state: '', country: '',
            zipCode: '', corporateType: '', businessLine: '', mobileNumber: '',
            whatsapp: '', filerId499: '', businessContactName: '', voipEmail: ''
        },
        billing: { cardName: '', cardNumber: '', expiryDate: '', cvv: '', billingAddress: '', sameAsCompany: false },
        products: { selectedProducts: [], details: {} }
    }
};

/* ======== STEPS CONFIG ======== */
const STEPS = [
    { id: 1, title: 'Registration' },
    { id: 2, title: 'Company Details' },
    { id: 3, title: 'Billing Info' },
    { id: 4, title: 'Products Setup' },
];

const CORPORATE_TYPES = ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Non-Profit'];

const PRODUCTS = [
    {
        id: 'cloud_pbx',
        title: 'Cloud PBX',
        description: 'Enterprise voice features with advanced routing capabilities.',
        icon: ICONS.phone,
        color: 'text-blue-600', // Mapped to primary green in CSS
        bgColor: 'bg-blue-100', // Mapped to light green in CSS
        borderClass: 'border-blue-600',
        fields: [{ name: 'numberOfExtensions', label: 'Number of Extensions', type: 'number', placeholder: 'e.g., 50' }]
    },
    {
        id: 'sip_trunking',
        title: 'SIP Trunking',
        description: 'Connect your existing on-premise PBX to our global voice network.',
        icon: ICONS.network,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderClass: 'border-blue-600',
        fields: [{ name: 'concurrentChannels', label: 'Concurrent Channels', type: 'number', placeholder: 'e.g., 20' }]
    },
    {
        id: 'contact_center',
        title: 'Contact Center',
        description: 'Omnichannel customer support solution with real-time analytics.',
        icon: ICONS.users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderClass: 'border-blue-600',
        fields: [{ name: 'numberOfAgents', label: 'Number of Agents', type: 'number', placeholder: 'e.g., 100' }]
    },
    {
        id: 'toll_free',
        title: 'Toll-Free Numbers',
        description: 'Provide complimentary toll-free calling access to your customers globally.',
        icon: ICONS.hash,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderClass: 'border-blue-600',
        fields: [{ name: 'regions', label: 'Target Regions', type: 'text', placeholder: 'e.g., US, UK, Canada' }]
    }
];

/* ======== HELPERS ======== */
function createInput({ id, name, type = 'text', placeholder = '', value = '', maxlength, className = '', inputClass = '' }) {
    const extraAttrs = maxlength ? `maxlength="${maxlength}"` : '';
    return `
        <div class="form-group ${className}">
            <input
                class="form-input ${inputClass}"
                id="${id}"
                name="${name}"
                type="${type}"
                placeholder="${placeholder}"
                value="${escHtml(value)}"
                autocomplete="off"
                ${extraAttrs}
            />
        </div>`;
}

function escHtml(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ======== STEP RENDERERS ======== */

function renderStep1() {
    const u = state.formData.user;
    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">User Account</h2>
            <p class="step-subtitle">Create your primary administrator credentials.</p>
        </div>
        <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input class="form-input" id="email" name="email" type="email" placeholder="admin@company.com" value="${escHtml(u.email)}" data-section="user" />
        </div>
        <div class="two-col-grid">
            <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <input class="form-input" id="password" name="password" type="password" placeholder="••••••••" value="${escHtml(u.password)}" data-section="user" />
            </div>
            <div class="form-group">
                <label class="form-label" for="confirmPassword">Confirm Password</label>
                <input class="form-input" id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value="${escHtml(u.confirmPassword)}" data-section="user" />
            </div>
        </div>
    </div>`;
}

function renderStep2() {
    const c = state.formData.company;
    const typeOptions = CORPORATE_TYPES.map(t =>
        `<option value="${t}" ${c.corporateType === t ? 'selected' : ''}>${t}</option>`
    ).join('');

    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">Company Details</h2>
            <p class="step-subtitle">Provide information about your business entity.</p>
        </div>
        <div class="form-grid form-grid-2">
            <div class="form-group col-span-2">
                <label class="form-label" for="companyName">Legal Company Name</label>
                <input class="form-input" id="companyName" name="companyName" type="text" placeholder="Acme Corp" value="${escHtml(c.companyName)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="corporateType">Corporate Type</label>
                <div class="select-wrap">
                    <select class="form-select" id="corporateType" name="corporateType" data-section="company">
                        <option value="">Select Type</option>
                        ${typeOptions}
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="businessLine">Line of Business</label>
                <input class="form-input" id="businessLine" name="businessLine" type="text" placeholder="e.g. Telecommunications" value="${escHtml(c.businessLine)}" data-section="company" />
            </div>

            <div class="section-divider col-span-2">
                <h3>Contact &amp; Location</h3>
            </div>

            <div class="form-group col-span-2">
                <label class="form-label" for="address">Address</label>
                <input class="form-input" id="address" name="address" type="text" placeholder="123 Business Ave, Suite 100" value="${escHtml(c.address)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="city">City</label>
                <input class="form-input" id="city" name="city" type="text" placeholder="New York" value="${escHtml(c.city)}" data-section="company" />
            </div>
            <div class="two-col-grid">
                <div class="form-group">
                    <label class="form-label" for="state">State</label>
                    <input class="form-input" id="state" name="state" type="text" placeholder="NY" value="${escHtml(c.state)}" data-section="company" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="zipCode">ZIP Code</label>
                    <input class="form-input" id="zipCode" name="zipCode" type="text" placeholder="10001" value="${escHtml(c.zipCode)}" data-section="company" />
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="country">Country</label>
                <input class="form-input" id="country" name="country" type="text" placeholder="United States" value="${escHtml(c.country)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="mobileNumber">Mobile Number</label>
                <input class="form-input" id="mobileNumber" name="mobileNumber" type="text" placeholder="+1 (555) 000-0000" value="${escHtml(c.mobileNumber)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="whatsapp">WhatsApp / Teams ID</label>
                <input class="form-input" id="whatsapp" name="whatsapp" type="text" placeholder="@username" value="${escHtml(c.whatsapp)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="filerId499">499 Filer ID</label>
                <input class="form-input" id="filerId499" name="filerId499" type="text" placeholder="Optional" value="${escHtml(c.filerId499)}" data-section="company" />
            </div>

            <div class="section-divider col-span-2">
                <h3>Portal Access</h3>
            </div>

            <div class="form-group">
                <label class="form-label" for="businessContactName">Business Contact Name</label>
                <input class="form-input" id="businessContactName" name="businessContactName" type="text" placeholder="John Doe" value="${escHtml(c.businessContactName)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="voipEmail">Email Address for VoIP Portal</label>
                <input class="form-input" id="voipEmail" name="voipEmail" type="email" placeholder="voip@company.com" value="${escHtml(c.voipEmail)}" data-section="company" />
            </div>
        </div>
    </div>`;
}

function renderStep3() {
    const b = state.formData.billing;
    return `
    <div class="step-space">
        <div class="billing-header">
            <div>
                <h2 class="step-title">Billing Information</h2>
                <p class="step-subtitle">Set up your payment method securely.</p>
            </div>
            <div class="badge-secure">${ICONS.shieldCheck} Secure 256-bit encryption</div>
        </div>

        <div class="card-section">
            <div class="card-section-header">
                <div class="icon-circle indigo">${ICONS.creditCard}</div>
                <div class="card-section-label">Credit Card Details</div>
            </div>

            <div class="form-group">
                <label class="form-label" for="cardName">Name on Card</label>
                <input class="form-input" id="cardName" name="cardName" type="text" placeholder="John Doe" value="${escHtml(b.cardName)}" data-section="billing" />
            </div>

            <div class="form-group">
                <label class="form-label" for="cardNumber">Card Number</label>
                <div class="input-icon-wrap">
                    <span class="input-icon">${ICONS.creditCardSm}</span>
                    <input class="form-input" id="cardNumber" name="cardNumber" type="text" placeholder="0000 0000 0000 0000" value="${escHtml(b.cardNumber)}" maxlength="19" data-section="billing" />
                </div>
            </div>

            <div class="two-col-grid">
                <div class="form-group">
                    <label class="form-label" for="expiryDate">Expiry Date</label>
                    <input class="form-input" id="expiryDate" name="expiryDate" type="text" placeholder="MM/YY" value="${escHtml(b.expiryDate)}" maxlength="5" data-section="billing" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="cvv">CVV</label>
                    <input class="form-input" id="cvv" name="cvv" type="password" placeholder="123" value="${escHtml(b.cvv)}" maxlength="4" data-section="billing" />
                </div>
            </div>
        </div>

        <div>
            <div class="checkbox-row">
                <input type="checkbox" id="sameAsCompany" name="sameAsCompany" ${b.sameAsCompany ? 'checked' : ''} data-section="billing" data-type="checkbox" />
                <label class="checkbox-label" for="sameAsCompany">Billing address is same as company address</label>
            </div>

            <div class="billing-address-wrap ${b.sameAsCompany ? '' : 'visible'}" id="billingAddressWrap">
                <div class="form-group">
                    <label class="form-label" for="billingAddress">Billing Address</label>
                    <input class="form-input" id="billingAddress" name="billingAddress" type="text" placeholder="123 Billing St, City, State, ZIP" value="${escHtml(b.billingAddress)}" data-section="billing" />
                </div>
            </div>
        </div>
    </div>`;
}

function renderStep4() {
    const sp = state.formData.products.selectedProducts;
    const details = state.formData.products.details;

    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">Select Products</h2>
            <p class="step-subtitle">Choose the services you need to empower your business communication.</p>
        </div>
        <div class="products-grid">
            ${PRODUCTS.map(product => {
        const isSelected = sp.includes(product.id);
        const productDetail = details[product.id] || {};
        const fieldValue = product.fields?.[0] ? (productDetail[product.fields[0].name] ?? '') : '';

        return `
                <div class="product-card ${isSelected ? 'selected ' + product.borderClass : ''}"
                     data-product-id="${product.id}" role="button" tabindex="0"
                     aria-pressed="${isSelected}">
                    <div class="product-card-header">
                        <div class="icon-circle ${product.bgColor} ${product.color}">${product.icon}</div>
                        <div style="flex:1">
                            <div class="product-title">${product.title}</div>
                            <div class="product-desc">${product.description}</div>
                        </div>
                        <div class="product-check ${isSelected ? 'checked' : ''}">
                            ${ICONS.checkSm}
                        </div>
                    </div>
                    ${product.fields ? `
                    <div class="product-detail-expand ${isSelected ? 'visible' : ''}" id="detail-${product.id}">
                        <div class="product-detail-inner">
                            ${product.fields.map(field => `
                            <div class="form-group">
                                <label class="form-label small-label" for="${product.id}-${field.name}">${field.label}</label>
                                <input class="form-input" id="${product.id}-${field.name}"
                                    type="${field.type}" placeholder="${field.placeholder}"
                                    value="${escHtml(fieldValue)}"
                                    data-product-key="${product.id}"
                                    data-field-name="${field.name}" />
                            </div>`).join('')}
                        </div>
                    </div>` : ''}
                </div>`;
    }).join('')}
        </div>
    </div>`;
}

/* ======== PROGRESS BAR RENDERER ======== */
function renderProgressBar() {
    const progressBarEl = document.getElementById('progressBar');
    const totalSteps = STEPS.length;
    const fillPercent = ((state.currentStep - 1) / (totalSteps - 1)) * 100;

    progressBarEl.innerHTML = `
        <div class="progress-steps">
            <div class="progress-track-bg"></div>
            <div class="progress-track-fill" style="width: ${fillPercent}%"></div>
            ${STEPS.map(step => {
        const isCompleted = state.currentStep > step.id;
        const isActive = state.currentStep === step.id;
        const labelClass = isActive ? 'active' : isCompleted ? 'completed' : '';
        const circleClass = isActive ? 'active' : isCompleted ? 'completed' : '';

        return `
                <div class="progress-step-item">
                    <div class="step-circle ${circleClass}">
                        ${isCompleted ? ICONS.check : step.id}
                    </div>
                    <div class="step-label ${labelClass}">${step.title}</div>
                </div>`;
    }).join('')}
        </div>`;
}

/* ======== ANIMATION GUARD ======== */
let isAnimating = false;

/* ======== MAIN STEP RENDERER WITH ANIMATION ======== */
function renderCurrentStep(animDir) {
    const wrapper = document.getElementById('stepWrapper');
    const stepRenderers = { 1: renderStep1, 2: renderStep2, 3: renderStep3, 4: renderStep4 };
    const newContent = stepRenderers[state.currentStep]?.() ?? '';

    const ANIM_DURATION = 220; // ms — must match CSS exit animation duration

    const existing = wrapper.firstElementChild;

    if (existing) {
        // 1. Play exit animation on the old element
        isAnimating = true;
        existing.style.animation = 'none'; // reset any in-progress entry animation
        void existing.offsetWidth;         // force reflow
        existing.style.animation = `${animDir === 1 ? 'slideOutLeft' : 'slideOutRight'} ${ANIM_DURATION}ms cubic-bezier(.4,0,.2,1) forwards`;

        // 2. After exit finishes, remove old and show new
        setTimeout(() => {
            wrapper.innerHTML = '';

            const div = document.createElement('div');
            div.className = 'step-content';
            div.style.animation = `${animDir === 1 ? 'slideIn' : 'slideInFromLeft'} 280ms cubic-bezier(.4,0,.2,1) both`;
            div.innerHTML = newContent;
            wrapper.appendChild(div);

            bindStepEvents();
            isAnimating = false;
        }, ANIM_DURATION);

    } else {
        // First render — no exit animation needed
        const div = document.createElement('div');
        div.className = 'step-content';
        div.style.animation = 'slideIn 280ms cubic-bezier(.4,0,.2,1) both';
        div.innerHTML = newContent;
        wrapper.appendChild(div);
        bindStepEvents();
    }
}

/* ======== BUTTON STATE ======== */
function updateButtons() {
    const btnBack = document.getElementById('btnBack');
    const btnNext = document.getElementById('btnNext');

    // Back button
    if (state.currentStep === 1) {
        btnBack.classList.add('invisible');
    } else {
        btnBack.classList.remove('invisible');
    }

    // Next/Complete button
    if (state.currentStep < 4) {
        btnNext.className = 'btn btn-primary';
        btnNext.innerHTML = `Continue ${ICONS.chevronRight}`;
    } else {
        btnNext.className = 'btn btn-success';
        btnNext.innerHTML = `Complete Setup ${ICONS.checkCircle}`;
    }
}

/* ======== EVENT BINDING ======== */
function bindStepEvents() {
    // Generic inputs / selects
    document.querySelectorAll('[data-section]').forEach(el => {
        el.addEventListener('change', handleFormChange);
        el.addEventListener('input', handleFormChange);
    });

    // Billing: sameAsCompany checkbox toggle
    const sameCheck = document.getElementById('sameAsCompany');
    if (sameCheck) {
        sameCheck.addEventListener('change', () => {
            const wrap = document.getElementById('billingAddressWrap');
            if (wrap) wrap.classList.toggle('visible', !sameCheck.checked);
        });
    }

    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', () => {
            let v = cardNumber.value.replace(/\D/g, '').substring(0, 16);
            cardNumber.value = v.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    // Expiry date formatting
    const expiry = document.getElementById('expiryDate');
    if (expiry) {
        expiry.addEventListener('input', () => {
            let v = expiry.value.replace(/\D/g, '').substring(0, 4);
            if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
            expiry.value = v;
        });
    }

    // Product card toggles
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', handleProductToggle);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleProductToggle.call(card, e); } });
    });

    // Product detail inputs
    document.querySelectorAll('[data-product-key]').forEach(input => {
        input.addEventListener('input', handleProductDetailChange);
        input.addEventListener('click', e => e.stopPropagation());
    });
}

function handleFormChange(e) {
    const el = e.target;
    const section = el.dataset.section;
    const name = el.name;
    const isCheckbox = el.type === 'checkbox';
    const value = isCheckbox ? el.checked : el.value;

    if (section && name) {
        state.formData[section][name] = value;
    }
}

function handleProductToggle(e) {
    const card = e.currentTarget || this;
    const productId = card.dataset.productId;
    const sp = state.formData.products.selectedProducts;

    const isSelected = sp.includes(productId);
    if (isSelected) {
        state.formData.products.selectedProducts = sp.filter(id => id !== productId);
    } else {
        state.formData.products.selectedProducts = [...sp, productId];
    }

    // Re-render just this card
    const product = PRODUCTS.find(p => p.id === productId);
    const nowSelected = state.formData.products.selectedProducts.includes(productId);

    card.className = `product-card ${nowSelected ? 'selected ' + product.borderClass : ''}`;
    card.setAttribute('aria-pressed', nowSelected);

    const checkEl = card.querySelector('.product-check');
    if (checkEl) {
        checkEl.className = `product-check ${nowSelected ? 'checked' : ''}`;
    }

    const detailEl = document.getElementById(`detail-${productId}`);
    if (detailEl) {
        detailEl.classList.toggle('visible', nowSelected);
    }
}

function handleProductDetailChange(e) {
    const input = e.target;
    const productKey = input.dataset.productKey;
    const fieldName = input.dataset.fieldName;
    const value = input.value;

    if (!state.formData.products.details[productKey]) {
        state.formData.products.details[productKey] = {};
    }
    state.formData.products.details[productKey][fieldName] = value;
}

/* ======== NAVIGATION ======== */
function goNext() {
    if (isAnimating) return;              // Ignore clicks during transition
    if (state.currentStep < 4) {
        state.direction = 1;
        state.currentStep++;
        update(1);
    } else {
        handleSubmit();
    }
}

function goPrev() {
    if (isAnimating) return;              // Ignore clicks during transition
    if (state.currentStep > 1) {
        state.direction = -1;
        state.currentStep--;
        update(-1);
    }
}

function update(animDir) {
    renderProgressBar();
    renderCurrentStep(animDir);
    updateButtons();
}

async function handleSubmit() {
    const API_BASE = 'https://localhost:7090/api';
    const fd = state.formData;

    // Build backend payload matching SubmitKycApplicationCommand
    const payload = {
        userId: '',   // public submission — backend will assign a guest ID
        companyDetails: {
            companyName: fd.company.companyName,
            address: fd.company.address,
            city: fd.company.city,
            state: fd.company.state,
            country: fd.company.country,
            zipCode: fd.company.zipCode,
            corporateType: mapCorporateType(fd.company.corporateType),
            businessLine: fd.company.businessLine,
            mobileNumber: fd.company.mobileNumber,
            teamsOrWhatsApp: fd.company.whatsapp,
            filerID499: fd.company.filerId499,
            businessContactName: fd.company.businessContactName,
            voipPortalEmail: fd.company.voipEmail || fd.company.email || fd.user.email,
        },
        billingInformation: {
            billingContactName: fd.billing.cardName,
            billingEmail: fd.company.voipEmail || fd.user.email,
            billingAddress: fd.billing.sameAsCompany
                ? `${fd.company.address}, ${fd.company.city}, ${fd.company.state} ${fd.company.zipCode}, ${fd.company.country}`
                : fd.billing.billingAddress,
            billingCity: fd.billing.sameAsCompany ? fd.company.city : '',
            billingState: fd.billing.sameAsCompany ? fd.company.state : '',
            billingCountry: fd.billing.sameAsCompany ? fd.company.country : '',
            billingZipCode: fd.billing.sameAsCompany ? fd.company.zipCode : '',
            paymentMethod: 'Credit Card',
            bankName: '',
            accountName: fd.billing.cardName,
            accountNumber: fd.billing.cardNumber ? '****' + fd.billing.cardNumber.slice(-4) : '',
            routingNumber: '',
            notes: '',
        },
        productSelections: fd.products.selectedProducts.map(pid => {
            const details = fd.products.details[pid] || {};
            return {
                productType: mapProductType(pid),
                numberOfPorts: pid === 'cloud_pbx' ? parseInt(details.numberOfExtensions) || null : null,
                numberOfAgents: pid === 'contact_center' ? parseInt(details.numberOfAgents) || null : null,
                numberOfDIDs: null,
                specificAreaCodes: pid === 'toll_free' ? details.regions || null : null,
                tfnQuantity: null,
                numberOfBots: null,
                botServerInformation: null,
                closerDiallerDetails: null,
            };
        }),
        technicalInformation: {
            diallerServerLink: null,
            validationLink: null,
            serverIPs: null,
            diallerLevel9Access: false,
        }
    };

    // Show loading state
    const btn = document.getElementById('btnNext');
    btn.disabled = true;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Submitting…`;

    try {
        const res = await fetch(`${API_BASE}/kyc/submit-public`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.message || data.title || `Server Error (${res.status})`);
        }

        // ✅ Success — show success screen
        showSuccessScreen();

    } catch (err) {
        console.error('KYC Submission Error:', err);
        btn.disabled = false;
        updateButtons();
        showToast('❌ Submission failed: ' + err.message, 'error');
    }
}

function mapCorporateType(val) {
    const map = {
        'LLC': 0, 'Corporation': 1, 'Partnership': 2,
        'Sole Proprietorship': 3, 'Non-Profit': 4,
    };
    return map[val] ?? 0;
}

function mapProductType(pid) {
    const map = {
        'cloud_pbx': 0,
        'sip_trunking': 1,
        'contact_center': 2,
        'toll_free': 3,
    };
    return map[pid] ?? 0;
}

function showSuccessScreen() {
    const wrapper = document.getElementById('stepWrapper');
    const navButtons = document.querySelector('.nav-buttons');
    const progressBar = document.getElementById('progressBar');

    if (progressBar) progressBar.style.display = 'none';
    if (navButtons) navButtons.style.display = 'none';

    wrapper.innerHTML = `
    <div class="step-content" style="animation: slideIn 400ms cubic-bezier(.4,0,.2,1) both">
        <div style="text-align:center; padding: 3rem 2rem;">
            <div style="
                width: 80px; height: 80px;
                background: linear-gradient(135deg, #10963D, #059669);
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                margin: 0 auto 1.5rem;
                box-shadow: 0 8px 32px rgba(16,150,61,.35);
                animation: popIn .5s cubic-bezier(.175,.885,.32,1.275) both;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 20 4 15"></polyline>
                </svg>
            </div>
            <h2 style="font-size:1.75rem; font-weight:800; color:#152E23; margin-bottom:.65rem;">
                Application Submitted! 🎉
            </h2>
            <p style="color:#3d5a4e; font-size:1rem; max-width:400px; margin:0 auto 2rem; line-height:1.65;">
                Thank you! Your KYC application has been received. Our team will review your details and reach out within <strong>1–2 business days</strong>.
            </p>
            <div style="
                background: linear-gradient(135deg, #e8f5ec, #f0fdf4);
                border: 1.5px solid #d5e3dc;
                border-radius: 12px;
                padding: 1.25rem 1.5rem;
                max-width: 420px;
                margin: 0 auto;
                text-align: left;
            ">
                <div style="font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#10963D; margin-bottom:.65rem;">
                    📋 What happens next?
                </div>
                <div style="font-size:.875rem; color:#234C3D; display:flex; flex-direction:column; gap:.55rem;">
                    <div>✅ Admin team reviews your application</div>
                    <div>📞 Sales rep contacts you within 48 hours</div>
                    <div>🔧 Account provisioning & onboarding call</div>
                    <div>🚀 Go live with your Telza services!</div>
                </div>
            </div>
            <p style="margin-top:1.75rem; font-size:.8rem; color:#7a9589;">
                Questions? Email us at
                <a href="mailto:Telzaofficial@gmail.com" style="color:#10963D; font-weight:600;">Telzaofficial@gmail.com</a>
            </p>
        </div>
    </div>`;
}

function showToast(msg, type = 'info') {
    const existing = document.getElementById('kyc-toast');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'kyc-toast';
    el.style.cssText = `
        position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
        background: ${type === 'error' ? '#e73232' : '#10963D'};
        color: #fff; padding: .8rem 1.5rem; border-radius: 999px;
        font-size: .875rem; font-weight: 600;
        box-shadow: 0 8px 32px rgba(0,0,0,.2);
        z-index: 9999; animation: fadeSlideInToast .3s ease both;
    `;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
}

/* ======== INIT ======== */
document.addEventListener('DOMContentLoaded', () => {
    // Nav buttons
    document.getElementById('btnNext').addEventListener('click', goNext);
    document.getElementById('btnBack').addEventListener('click', goPrev);

    // Initial render
    update(1);
});
