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
    registeredUserId: null,
    registeredEmail: null,
    formData: {
        user: { email: '', password: '', confirmPassword: '' },
        company: {
            vendorType: '', campaign: '', rmd: '',
            companyName: '', otherDesignatedNames: '', address: '', city: '', state: '', country: 'United States',
            zipCode: '', mailingAddress: '', mailingCityStateZip: '', businessBasedInUs: true,
            stateOfIncorporation: '', dateOfIncorporation: '', businessLicenseNumber: '',
            feinNumber: '', frnNumber: '', corporateType: '', businessLine: '', mobileNumber: '',
            teamsOrWhatsApp: '', filerId499: '', businessContactName: '', businessPhone: '', mobilePhoneSeparate: '',
            emailForRates: '', emailForNotices: '', emailForBalances: '', voipPortalEmail: '',
            customerMainPhone: '', customerFax: '', customerUrl: '', companyContactName: '',
            primaryMainEmail: '', billingAccountingEmail: '', supportNocEmail: '', legalEmail: '',
            complianceEmail: '', fraudReportEmail: '', skypeId: '',
        },
        banking: {
            hasUsBankAccount: null,
            bankName: '', bankAddress: '', contactName: '', contactPhone: '', contactEmail: '', contactFax: '', accountNumber: '',
        },
        products: { selectedProducts: [], details: {} },
        tradeReferences: [
            { tradeReferenceName: '', tradeReferenceAddress: '', tradeReferenceNumber: '', contactName: '', contactEmail: '', contactPhone: '' },
        ],
        regulatory: {
            businessDescriptions: [],
            businessDescriptionOtherText: '',
            intermediateProviderRegistryCompanyName: '',
            stirShakenCertCompanyName: '',
            ocnStirShakenHeader: '',
            fcc499FilerId: '',
            robocallMitigationRegistered: null,
            robocallMitigationListedCompanyName: '',
            robocallMitigationDatabaseNumber: '',
            stirShakenRmdImplemented: null,
            signingAllCalls: null,
            complianceUsBankAccount: null,
            originateConversationalTraffic: null,
            originateAutodialedTraffic: null,
            directAutodialClients: null,
            nonUsAutodialSources: null,
            itgTracingEngaged: null,
            moreThanThreeTracebacksLastYear: null,
            moreThanFourGovImpersonationTracebacks: null,
            nonCooperativeVspByUsTelecom: null,
            blockedFromNetworkLastTwoYears: null,
            adverseJudgementUnlawfulRobocalls: null,
            estimatedAsrPercent: '',
            estimatedAloc: '',
            estimatedUnallocated404Percent: '',
            estimatedCancel487Percent: '',
            estimatedShortDurationPercent: '',
        },
        technical: {
            diallerServerLink: '',
            validationLink: '',
            serverIPs: '',
            diallerLevel9AccessDetails: '',
        },
        attestation: { officerName: '', signatureText: '' },
    }
};

/* ======== STEPS CONFIG ======== */
const STEPS = [
    { id: 1, title: 'Create User' },
    { id: 2, title: 'Vendor Type' },
    { id: 3, title: 'Company Information' },
    { id: 4, title: 'Banking Information' },
    { id: 5, title: 'Trade References' },
    { id: 6, title: 'Regulatory' },
    { id: 7, title: 'Products' },
    { id: 8, title: 'Technical' },
    { id: 9, title: 'Attestation' },
];

const BUSINESS_DESC_OPTIONS = [
    { key: 'carrier', label: 'Carrier / Service Provider' },
    { key: 'reseller', label: 'Reseller' },
    { key: 'enterprise', label: 'Enterprise' },
    { key: 'call_center', label: 'Call Center / BPO' },
    { key: 'other', label: 'Other' },
];

const CORPORATE_TYPES = ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Non-Profit'];

const US_STATE_NAMES = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut',
    DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
    KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan',
    MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
    NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
    OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
    TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
    WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia',
};
const US_STATE_OPTIONS = [['', 'Select state'], ...Object.entries(US_STATE_NAMES).sort((a, b) => a[1].localeCompare(b[1])), ['OTHER', 'Other / Non-US']];

const COUNTRIES = [
    'United States', 'Canada', 'Mexico', 'United Kingdom', 'Ireland', 'Germany', 'France', 'India', 'Pakistan',
    'Australia', 'Brazil', 'China', 'Japan', 'United Arab Emirates', 'Other',
];

const PRODUCTS = [
    {
        id: 'voip',
        title: 'VoIP',
        description: 'Voice over IP ports and related capacity.',
        icon: ICONS.phone,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderClass: 'border-blue-600',
    },
    {
        id: 'dialler_server',
        title: 'Dialler Server',
        description: 'Outbound dialler capacity and agent seats.',
        icon: ICONS.network,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderClass: 'border-blue-600',
    },
    {
        id: 'inbound_did',
        title: 'Inbound DID',
        description: 'Direct inward dial numbers.',
        icon: ICONS.hash,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderClass: 'border-blue-600',
    },
    {
        id: 'toll_free',
        title: 'TFN (Toll-Free)',
        description: 'Toll-free number quantities.',
        icon: ICONS.hash,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderClass: 'border-blue-600',
    },
    {
        id: 'ai_bots',
        title: 'AI Bots',
        description: 'AI bot deployments and dialler integration.',
        icon: ICONS.users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderClass: 'border-blue-600',
    },
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

function usStateOptionsHtml(selected) {
    return US_STATE_OPTIONS.map(([code, label]) =>
        `<option value="${escHtml(code)}" ${selected === code ? 'selected' : ''}>${escHtml(label)}</option>`
    ).join('');
}

function countryOptionsHtml(selected) {
    return COUNTRIES.map(ctry =>
        `<option value="${escHtml(ctry)}" ${selected === ctry ? 'selected' : ''}>${escHtml(ctry)}</option>`
    ).join('');
}

function getApiBase() {
    // Production (same origin as API when deployed — e.g. kyc.telza.co)
    // return '/api';
    return 'https://localhost:7090/api';
}

function validatePasswordPolicy(password) {
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
    return '';
}

/* ======== STEP RENDERERS ======== */

function renderStep1() {
    const u = state.formData.user;
    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">User Account</h2>
            <p class="step-subtitle">Create your primary administrator credentials (used to sign in).</p>
        </div>
        <div class="form-group">
            <label class="form-label" for="email">Email Address <span aria-hidden="true">*</span></label>
            <input class="form-input" id="email" name="email" type="email" placeholder="admin@company.com" value="${escHtml(u.email)}" autocomplete="email" data-section="user" />
        </div>
        <div class="two-col-grid">
            <div class="form-group">
                <label class="form-label" for="password">Password <span aria-hidden="true">*</span></label>
                <input class="form-input" id="password" name="password" type="password" placeholder="••••••••" value="${escHtml(u.password)}" autocomplete="new-password" data-section="user" />
            </div>
            <div class="form-group">
                <label class="form-label" for="confirmPassword">Confirm Password <span aria-hidden="true">*</span></label>
                <input class="form-input" id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value="${escHtml(u.confirmPassword)}" autocomplete="new-password" data-section="user" />
            </div>
        </div>
    </div>`;
}

function renderStep2Vendor() {
    const c = state.formData.company;
    const voip = c.vendorType === 'VoIP Vendor';
    const cc   = c.vendorType === 'Call Centre';

    const vendorTypes = [
        {
            id: 'VoIP Vendor',
            title: 'VoIP Vendor',
            description: 'Carrier, reseller, or enterprise providing Voice over IP services, SIP trunking, or telecom infrastructure.',
            icon: ICONS.phone,
        },
        {
            id: 'Call Centre',
            title: 'Call Centre',
            description: 'Outbound or inbound call centre / BPO operation using dialler technology and agent-based campaigns.',
            icon: ICONS.users,
        },
    ];

    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">Vendor Type</h2>
            <p class="step-subtitle">Select the type of vendor you are onboarding as. This controls which fields are required throughout the form.</p>
        </div>
        <div class="products-grid" id="vendorTypeGrid">
            ${vendorTypes.map(vt => {
                const isSelected = c.vendorType === vt.id;
                return `
                <div class="product-card ${isSelected ? 'selected border-blue-600' : ''}"
                     data-vendor-type="${vt.id}" role="button" tabindex="0"
                     aria-pressed="${isSelected}" style="cursor:pointer;">
                    <div class="product-card-header">
                        <div class="icon-circle bg-blue-100 text-blue-600">${vt.icon}</div>
                        <div style="flex:1">
                            <div class="product-title">${vt.title}</div>
                            <div class="product-desc">${vt.description}</div>
                        </div>
                        <div class="product-check ${isSelected ? 'checked' : ''}">
                            ${ICONS.checkSm}
                        </div>
                    </div>
                    <input type="radio" name="vendorType" value="${vt.id}" data-section="company"
                           ${isSelected ? 'checked' : ''} style="display:none;" />
                </div>`;
            }).join('')}
        </div>
    </div>`;
}

function renderStep3() {
    const c = state.formData.company;
    const typeOptions = CORPORATE_TYPES.map(t =>
        `<option value="${t}" ${c.corporateType === t ? 'selected' : ''}>${t}</option>`
    ).join('');
    const usYes = c.businessBasedInUs === true;
    const usNo = c.businessBasedInUs === false;

    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">Company Information</h2>
            <p class="step-subtitle">Legal entity, physical location, incorporation, and contact details.</p>
        </div>
        <div class="form-grid form-grid-2">
            <div class="form-group col-span-2">
                <label class="form-label" for="companyName">Legal Name of Company <span aria-hidden="true">*</span></label>
                <input class="form-input" id="companyName" name="companyName" type="text" placeholder="Registered legal name" value="${escHtml(c.companyName)}" data-section="company" />
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="otherDesignatedNames">Other Designated Names (DBA)</label>
                <input class="form-input" id="otherDesignatedNames" name="otherDesignatedNames" type="text" placeholder="If any" value="${escHtml(c.otherDesignatedNames)}" data-section="company" />
            </div>

            <div class="section-divider col-span-2"><h3>Physical address</h3></div>
            <div class="form-group col-span-2">
                <label class="form-label" for="address">Physical Address <span aria-hidden="true">*</span></label>
                <input class="form-input" id="address" name="address" type="text" placeholder="Street, suite" value="${escHtml(c.address)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="city">Physical City <span aria-hidden="true">*</span></label>
                <input class="form-input" id="city" name="city" type="text" placeholder="City" value="${escHtml(c.city)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="state">Physical State <span aria-hidden="true">*</span></label>
                <div class="select-wrap">
                    <select class="form-select" id="state" name="state" data-section="company">${usStateOptionsHtml(c.state)}</select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="zipCode">Physical ZIP <span aria-hidden="true">*</span></label>
                <input class="form-input" id="zipCode" name="zipCode" type="text" placeholder="ZIP / postal code" value="${escHtml(c.zipCode)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="country">Country <span aria-hidden="true">*</span></label>
                <div class="select-wrap">
                    <select class="form-select" id="country" name="country" data-section="company">${countryOptionsHtml(c.country)}</select>
                </div>
            </div>

            <div class="section-divider col-span-2"><h3>Mailing (if different)</h3></div>
            <div class="form-group col-span-2">
                <label class="form-label" for="mailingAddress">Mailing Address</label>
                <input class="form-input" id="mailingAddress" name="mailingAddress" type="text" placeholder="Leave blank if same as physical" value="${escHtml(c.mailingAddress)}" data-section="company" />
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="mailingCityStateZip">Mailing City / State / ZIP</label>
                <input class="form-input" id="mailingCityStateZip" name="mailingCityStateZip" type="text" placeholder="Single line" value="${escHtml(c.mailingCityStateZip)}" data-section="company" />
            </div>

            <div class="section-divider col-span-2"><h3>Incorporation</h3></div>
            <div class="form-group col-span-2">
                <span class="form-label">Is company business based in U.S.? <span aria-hidden="true">*</span></span>
                <div class="checkbox-row" style="margin-top:.5rem;">
                    <label class="checkbox-label" style="margin-right:1.25rem;">
                        <input type="radio" name="businessBasedInUs" value="true" data-section="company" ${usYes ? 'checked' : ''} /> Yes
                    </label>
                    <label class="checkbox-label">
                        <input type="radio" name="businessBasedInUs" value="false" data-section="company" ${usNo ? 'checked' : ''} /> No
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="stateOfIncorporation">State of Incorporation ${usYes ? '<span aria-hidden="true">*</span>' : ''}</label>
                <div class="select-wrap">
                    <select class="form-select" id="stateOfIncorporation" name="stateOfIncorporation" data-section="company">${usStateOptionsHtml(c.stateOfIncorporation)}</select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="dateOfIncorporation">Date of Incorporation</label>
                <input class="form-input" id="dateOfIncorporation" name="dateOfIncorporation" type="date" value="${escHtml(c.dateOfIncorporation)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="businessLicenseNumber">Business License #</label>
                <input class="form-input" id="businessLicenseNumber" name="businessLicenseNumber" type="text" value="${escHtml(c.businessLicenseNumber)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="feinNumber">FEIN # <span aria-hidden="true">*</span></label>
                <input class="form-input" id="feinNumber" name="feinNumber" type="text" placeholder="Federal Employer Identification Number" value="${escHtml(c.feinNumber)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="frnNumber">FRN # <span aria-hidden="true">*</span></label>
                <input class="form-input" id="frnNumber" name="frnNumber" type="text" placeholder="FCC Registration Number" value="${escHtml(c.frnNumber)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="corporateType">Corporate Type <span aria-hidden="true">*</span></label>
                <div class="select-wrap">
                    <select class="form-select" id="corporateType" name="corporateType" data-section="company">
                        <option value="">Select Type</option>
                        ${typeOptions}
                    </select>
                </div>
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="businessLine">Business Line <span aria-hidden="true">*</span></label>
                <input class="form-input" id="businessLine" name="businessLine" type="text" placeholder="Short description of business" value="${escHtml(c.businessLine)}" data-section="company" />
            </div>

            <div class="section-divider col-span-2"><h3>Primary contacts</h3></div>
            <div class="form-group">
                <label class="form-label" for="mobileNumber">Mobile Number <span aria-hidden="true">*</span></label>
                <input class="form-input" id="mobileNumber" name="mobileNumber" type="tel" placeholder="+1 (555) 000-0000" value="${escHtml(c.mobileNumber)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="teamsOrWhatsApp">Teams ID or WhatsApp <span aria-hidden="true">*</span></label>
                <input class="form-input" id="teamsOrWhatsApp" name="teamsOrWhatsApp" type="text" placeholder="One field — either is fine" value="${escHtml(c.teamsOrWhatsApp)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="filerId499">499 Filer ID <span aria-hidden="true">*</span></label>
                <input class="form-input" id="filerId499" name="filerId499" type="text" value="${escHtml(c.filerId499)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="businessContactName">Name of Business Contact <span aria-hidden="true">*</span></label>
                <input class="form-input" id="businessContactName" name="businessContactName" type="text" value="${escHtml(c.businessContactName)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="businessPhone">Business Phone <span aria-hidden="true">*</span></label>
                <input class="form-input" id="businessPhone" name="businessPhone" type="tel" value="${escHtml(c.businessPhone)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="mobilePhoneSeparate">Mobile Phone (if separate)</label>
                <input class="form-input" id="mobilePhoneSeparate" name="mobilePhoneSeparate" type="tel" value="${escHtml(c.mobilePhoneSeparate)}" data-section="company" />
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="voipPortalEmail">VoIP Portal Email <span aria-hidden="true">*</span></label>
                <input class="form-input" id="voipPortalEmail" name="voipPortalEmail" type="email" placeholder="voip@company.com" value="${escHtml(c.voipPortalEmail)}" data-section="company" />
            </div>

            <div class="section-divider col-span-2"><h3>Additional emails</h3></div>
            <div class="form-group">
                <label class="form-label" for="emailForRates">Email for Rates</label>
                <input class="form-input" id="emailForRates" name="emailForRates" type="email" value="${escHtml(c.emailForRates)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="emailForNotices">Email for Notices</label>
                <input class="form-input" id="emailForNotices" name="emailForNotices" type="email" value="${escHtml(c.emailForNotices)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="emailForBalances">Email for Balances</label>
                <input class="form-input" id="emailForBalances" name="emailForBalances" type="email" value="${escHtml(c.emailForBalances)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="primaryMainEmail">Primary Main Email</label>
                <input class="form-input" id="primaryMainEmail" name="primaryMainEmail" type="email" value="${escHtml(c.primaryMainEmail)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="billingAccountingEmail">Billing / Accounting Email</label>
                <input class="form-input" id="billingAccountingEmail" name="billingAccountingEmail" type="email" value="${escHtml(c.billingAccountingEmail)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="supportNocEmail">Support / NOC Email</label>
                <input class="form-input" id="supportNocEmail" name="supportNocEmail" type="email" value="${escHtml(c.supportNocEmail)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="legalEmail">Legal Email</label>
                <input class="form-input" id="legalEmail" name="legalEmail" type="email" value="${escHtml(c.legalEmail)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="complianceEmail">Compliance Email</label>
                <input class="form-input" id="complianceEmail" name="complianceEmail" type="email" value="${escHtml(c.complianceEmail)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="fraudReportEmail">Fraud Report Email</label>
                <input class="form-input" id="fraudReportEmail" name="fraudReportEmail" type="email" value="${escHtml(c.fraudReportEmail)}" data-section="company" />
            </div>

            <div class="section-divider col-span-2"><h3>Customer &amp; other</h3></div>
            <div class="form-group">
                <label class="form-label" for="customerMainPhone">Customer Main Phone</label>
                <input class="form-input" id="customerMainPhone" name="customerMainPhone" type="tel" value="${escHtml(c.customerMainPhone)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="customerFax">Customer Fax</label>
                <input class="form-input" id="customerFax" name="customerFax" type="tel" value="${escHtml(c.customerFax)}" data-section="company" />
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="customerUrl">Customer URL</label>
                <input class="form-input" id="customerUrl" name="customerUrl" type="url" placeholder="https://" value="${escHtml(c.customerUrl)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="companyContactName">Company Contact Name</label>
                <input class="form-input" id="companyContactName" name="companyContactName" type="text" value="${escHtml(c.companyContactName)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="skypeId">Skype ID</label>
                <input class="form-input" id="skypeId" name="skypeId" type="text" value="${escHtml(c.skypeId)}" data-section="company" />
            </div>
            
            <div class="section-divider col-span-2"><h3>Operations (Call Centre)</h3></div>
            <div class="form-group">
                <label class="form-label" for="campaign">Campaign ${c.vendorType === 'Call Centre' ? '<span aria-hidden="true">*</span>' : ''}</label>
                <input class="form-input" id="campaign" name="campaign" type="text" value="${escHtml(c.campaign)}" data-section="company" />
            </div>
            <div class="form-group">
                <label class="form-label" for="rmd">RMD (Recurring Monthly Deposit?) ${c.vendorType === 'Call Centre' ? '<span aria-hidden="true">*</span>' : ''}</label>
                <input class="form-input" id="rmd" name="rmd" type="text" value="${escHtml(c.rmd)}" data-section="company" />
            </div>
        </div>
    </div>`;
}

function renderStep4() {
    const bk = state.formData.banking;
    const bankYes = bk.hasUsBankAccount === true;
    const bankNo = bk.hasUsBankAccount === false;
    const showBankFields = bankYes;

    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">Banking Information</h2>
            <p class="step-subtitle">U.S. bank account details for your company (if applicable).</p>
        </div>
        <div class="form-grid form-grid-2">
            <div class="form-group col-span-2">
                <span class="form-label">Does your Company have a U.S. Bank Account? <span aria-hidden="true">*</span></span>
                <div class="checkbox-row" style="margin-top:.5rem;">
                    <label class="checkbox-label" style="margin-right:1.25rem;">
                        <input type="radio" name="hasUsBankAccount" value="true" data-section="banking" ${bankYes ? 'checked' : ''} /> Yes
                    </label>
                    <label class="checkbox-label">
                        <input type="radio" name="hasUsBankAccount" value="false" data-section="banking" ${bankNo ? 'checked' : ''} /> No
                    </label>
                </div>
            </div>
            <div class="bank-details-wrap col-span-2 ${showBankFields ? 'visible' : ''}" id="bankDetailsWrap">
                <div class="form-group col-span-2">
                    <label class="form-label" for="bankName">Bank Name <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="bankName" name="bankName" type="text" value="${escHtml(bk.bankName)}" data-section="banking" />
                </div>
                <div class="form-group col-span-2">
                    <label class="form-label" for="bankAddress">Bank Address <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="bankAddress" name="bankAddress" type="text" value="${escHtml(bk.bankAddress)}" data-section="banking" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="bankContactName">Contact Name <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="bankContactName" name="contactName" type="text" value="${escHtml(bk.contactName)}" data-section="banking" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="bankContactPhone">Contact Phone <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="bankContactPhone" name="contactPhone" type="tel" value="${escHtml(bk.contactPhone)}" data-section="banking" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="bankContactEmail">Contact Email <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="bankContactEmail" name="contactEmail" type="email" value="${escHtml(bk.contactEmail)}" data-section="banking" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="bankContactFax">Contact Fax</label>
                    <input class="form-input" id="bankContactFax" name="contactFax" type="tel" value="${escHtml(bk.contactFax)}" data-section="banking" />
                </div>
                <div class="form-group col-span-2">
                    <label class="form-label" for="bankAccountNumber">Account # <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="bankAccountNumber" name="accountNumber" type="text" value="${escHtml(bk.accountNumber)}" data-section="banking" autocomplete="off" />
                </div>
            </div>
        </div>
    </div>`;
}

function renderStep5TradeReferences() {
    const rows = state.formData.tradeReferences;
    const blocks = rows.map((row, i) => `
        <div class="trade-ref-card" style="border:1px solid #d5e3dc;border-radius:12px;padding:1rem 1.1rem;margin-bottom:1rem;background:#fafdfb;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.85rem;gap:.5rem;">
                <span style="font-weight:700;color:#152E23;">Trade reference ${i + 1}</span>
                ${rows.length > 1 ? `<button type="button" class="btn btn-outline" style="padding:.35rem .75rem;font-size:.8rem;" data-remove-trade-index="${i}">Remove</button>` : ''}
            </div>
            <div class="form-grid form-grid-2">
                <div class="form-group">
                    <label class="form-label" for="tr-${i}-name">Trade reference name <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="tr-${i}-name" type="text" value="${escHtml(row.tradeReferenceName)}"
                        data-section="tradeRefs" data-trade-index="${i}" data-field="tradeReferenceName" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="tr-${i}-num">Trade reference #</label>
                    <input class="form-input" id="tr-${i}-num" type="text" value="${escHtml(row.tradeReferenceNumber)}"
                        data-section="tradeRefs" data-trade-index="${i}" data-field="tradeReferenceNumber" />
                </div>
                <div class="form-group col-span-2">
                    <label class="form-label" for="tr-${i}-addr">Trade reference address <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="tr-${i}-addr" type="text" value="${escHtml(row.tradeReferenceAddress)}"
                        data-section="tradeRefs" data-trade-index="${i}" data-field="tradeReferenceAddress" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="tr-${i}-cname">Contact name <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="tr-${i}-cname" type="text" value="${escHtml(row.contactName)}"
                        data-section="tradeRefs" data-trade-index="${i}" data-field="contactName" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="tr-${i}-cemail">Contact email <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="tr-${i}-cemail" type="email" value="${escHtml(row.contactEmail)}"
                        data-section="tradeRefs" data-trade-index="${i}" data-field="contactEmail" />
                </div>
                <div class="form-group col-span-2">
                    <label class="form-label" for="tr-${i}-cphone">Contact phone (E.164) <span aria-hidden="true">*</span></label>
                    <input class="form-input" id="tr-${i}-cphone" type="tel" placeholder="+15551234567" value="${escHtml(row.contactPhone)}"
                        data-section="tradeRefs" data-trade-index="${i}" data-field="contactPhone" />
                </div>
            </div>
        </div>`).join('');

    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">Trade References</h2>
            <p class="step-subtitle">Add at least one supplier or customer reference we may contact.</p>
        </div>
        ${blocks}
        <button type="button" class="btn btn-outline" id="addTradeRef">+ Add another reference</button>
    </div>`;
}

function regRadioGroup(label, name, regKey) {
    const r = state.formData.regulatory;
    const v = r[regKey];
    const y = v === true;
    const n = v === false;
    return `
        <div class="form-group col-span-2">
            <span class="form-label">${label} <span aria-hidden="true">*</span></span>
            <div class="checkbox-row" style="margin-top:.5rem;">
                <label class="checkbox-label" style="margin-right:1.25rem;">
                    <input type="radio" name="${name}" value="true" data-section="regulatory" data-reg-key="${regKey}" ${y ? 'checked' : ''} /> Yes
                </label>
                <label class="checkbox-label">
                    <input type="radio" name="${name}" value="false" data-section="regulatory" data-reg-key="${regKey}" ${n ? 'checked' : ''} /> No
                </label>
            </div>
        </div>`;
}

function renderStep6Regulatory() {
    const r = state.formData.regulatory;
    const bizChecks = BUSINESS_DESC_OPTIONS.map(opt => {
        const on = r.businessDescriptions.includes(opt.key);
        return `
            <label class="checkbox-label" style="display:flex;align-items:center;gap:.5rem;margin:.35rem .75rem .35rem 0;">
                <input type="checkbox" data-section="regulatory" data-biz-desc="${opt.key}" ${on ? 'checked' : ''} />
                ${opt.label}
            </label>`;
    }).join('');
    const rmdYes = r.robocallMitigationRegistered === true;
    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">Regulatory &amp; Compliance</h2>
            <p class="step-subtitle">Complete all required fields. Use E.164 for phones where applicable.</p>
        </div>
        <div class="form-group col-span-2">
            <span class="form-label">Business description (select all that apply)</span>
            <div class="checkbox-row" style="flex-wrap:wrap;margin-top:.5rem;">${bizChecks}</div>
        </div>
        <div class="form-group col-span-2" id="regOtherWrap" style="${r.businessDescriptions.includes('other') ? '' : 'display:none;'}">
            <label class="form-label" for="regOtherText">If &quot;Other&quot;, please describe</label>
            <input class="form-input" id="regOtherText" name="businessDescriptionOtherText" type="text" value="${escHtml(r.businessDescriptionOtherText)}"
                data-section="regulatory" data-reg-text="businessDescriptionOtherText" />
        </div>
        <div class="form-grid form-grid-2">
            <div class="form-group col-span-2">
                <label class="form-label" for="iprName">Company name registered in Intermediate Provider Registry <span aria-hidden="true">*</span></label>
                <input class="form-input" id="iprName" name="intermediateProviderRegistryCompanyName" type="text" value="${escHtml(r.intermediateProviderRegistryCompanyName)}"
                    data-section="regulatory" data-reg-text="intermediateProviderRegistryCompanyName" />
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="stirName">Company name contained in STIR/SHAKEN certificate <span aria-hidden="true">*</span></label>
                <p class="step-subtitle" style="margin:-.25rem 0 .5rem;font-size:.8rem;">Confirm against the certificate details sent to your <a href="mailto:Telzaofficial@gmail.com">compliance email</a>.</p>
                <input class="form-input" id="stirName" name="stirShakenCertCompanyName" type="text" value="${escHtml(r.stirShakenCertCompanyName)}"
                    data-section="regulatory" data-reg-text="stirShakenCertCompanyName" />
            </div>
            <div class="form-group">
                <label class="form-label" for="ocn">OCN associated with STIR/SHAKEN header <span aria-hidden="true">*</span></label>
                <input class="form-input" id="ocn" name="ocnStirShakenHeader" type="text" value="${escHtml(r.ocnStirShakenHeader)}"
                    data-section="regulatory" data-reg-text="ocnStirShakenHeader" />
            </div>
            <div class="form-group">
                <label class="form-label" for="fcc499">FCC 499 Filer ID # <span aria-hidden="true">*</span></label>
                <input class="form-input" id="fcc499" name="fcc499FilerId" type="text" value="${escHtml(r.fcc499FilerId)}"
                    data-section="regulatory" data-reg-text="fcc499FilerId" />
            </div>
            ${regRadioGroup('Has customer registered with RoboCall Mitigation Database?', 'robocallMitigationRegistered', 'robocallMitigationRegistered')}
            <div class="form-group col-span-2 rmd-extra" style="${rmdYes ? '' : 'display:none;'}" id="rmdExtraWrap">
                <div class="form-grid form-grid-2">
                    <div class="form-group">
                        <label class="form-label" for="rmdListed">Company name listed in RoboCall Mitigation <span aria-hidden="true">*</span></label>
                        <input class="form-input" id="rmdListed" name="robocallMitigationListedCompanyName" type="text" value="${escHtml(r.robocallMitigationListedCompanyName)}"
                            data-section="regulatory" data-reg-text="robocallMitigationListedCompanyName" />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="rmdDb">RoboCall Mitigation database # <span aria-hidden="true">*</span></label>
                        <input class="form-input" id="rmdDb" name="robocallMitigationDatabaseNumber" type="text" value="${escHtml(r.robocallMitigationDatabaseNumber)}"
                            data-section="regulatory" data-reg-text="robocallMitigationDatabaseNumber" />
                    </div>
                </div>
            </div>
            ${regRadioGroup('Has customer implemented STIR/SHAKEN and updated RMD plan?', 'stirShakenRmdImplemented', 'stirShakenRmdImplemented')}
            ${regRadioGroup('Is customer currently signing and attesting ALL calls?', 'signingAllCalls', 'signingAllCalls')}
            ${regRadioGroup('Do you have a U.S. Bank Account?', 'complianceUsBankAccount', 'complianceUsBankAccount')}
            ${regRadioGroup('Does customer originate or process conversational traffic?', 'originateConversationalTraffic', 'originateConversationalTraffic')}
            ${regRadioGroup('Does customer originate or process autodialed call traffic?', 'originateAutodialedTraffic', 'originateAutodialedTraffic')}
            ${regRadioGroup('Does customer have any direct autodial clients?', 'directAutodialClients', 'directAutodialClients')}
            ${regRadioGroup('Are any sources of autodialed traffic from non-U.S. clients?', 'nonUsAutodialSources', 'nonUsAutodialSources')}
            ${regRadioGroup('Is customer actively engaged in ITG tracing process?', 'itgTracingEngaged', 'itgTracingEngaged')}
            ${regRadioGroup('Has customer been originator for &gt;3 tracebacks/notifications in last year?', 'moreThanThreeTracebacksLastYear', 'moreThanThreeTracebacksLastYear')}
            ${regRadioGroup('Has customer been originator for &gt;4 government impersonation tracebacks?', 'moreThanFourGovImpersonationTracebacks', 'moreThanFourGovImpersonationTracebacks')}
            ${regRadioGroup('Has customer been determined &quot;Non-Cooperative Voice Service Provider&quot; by US Telecom?', 'nonCooperativeVspByUsTelecom', 'nonCooperativeVspByUsTelecom')}
            ${regRadioGroup('Has customer been blocked/removed from another network in last 2 years?', 'blockedFromNetworkLastTwoYears', 'blockedFromNetworkLastTwoYears')}
            ${regRadioGroup('Has customer or any principal had adverse judgement for unlawful robocalls?', 'adverseJudgementUnlawfulRobocalls', 'adverseJudgementUnlawfulRobocalls')}
            <div class="form-group">
                <label class="form-label" for="asr">Estimated ASR % (0–100) <span aria-hidden="true">*</span></label>
                <input class="form-input" id="asr" name="estimatedAsrPercent" type="number" step="0.01" min="0" max="100" value="${escHtml(r.estimatedAsrPercent)}"
                    data-section="regulatory" data-reg-text="estimatedAsrPercent" />
            </div>
            <div class="form-group">
                <label class="form-label" for="aloc">Estimated ALOC (avg length of call, seconds) <span aria-hidden="true">*</span></label>
                <input class="form-input" id="aloc" name="estimatedAloc" type="number" step="0.01" min="0" value="${escHtml(r.estimatedAloc)}"
                    data-section="regulatory" data-reg-text="estimatedAloc" />
            </div>
            <div class="form-group">
                <label class="form-label" for="p404">Estimated Unallocated 404 % (0–100) <span aria-hidden="true">*</span></label>
                <input class="form-input" id="p404" name="estimatedUnallocated404Percent" type="number" step="0.01" min="0" max="100" value="${escHtml(r.estimatedUnallocated404Percent)}"
                    data-section="regulatory" data-reg-text="estimatedUnallocated404Percent" />
            </div>
            <div class="form-group">
                <label class="form-label" for="p487">Estimated Cancel / 487 % (0–100) <span aria-hidden="true">*</span></label>
                <input class="form-input" id="p487" name="estimatedCancel487Percent" type="number" step="0.01" min="0" max="100" value="${escHtml(r.estimatedCancel487Percent)}"
                    data-section="regulatory" data-reg-text="estimatedCancel487Percent" />
            </div>
            <div class="form-group">
                <label class="form-label" for="pshort">Estimated short duration % (0–100) <span aria-hidden="true">*</span></label>
                <input class="form-input" id="pshort" name="estimatedShortDurationPercent" type="number" step="0.01" min="0" max="100" value="${escHtml(r.estimatedShortDurationPercent)}"
                    data-section="regulatory" data-reg-text="estimatedShortDurationPercent" />
            </div>
        </div>
    </div>`;
}

function renderStep7Products() {
    const sp = state.formData.products.selectedProducts;
    const details = state.formData.products.details;

    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">Products</h2>
            <p class="step-subtitle">Select products; each expands for required details.</p>
        </div>
        <div class="products-grid">
            ${PRODUCTS.map(product => {
        const isSelected = sp.includes(product.id);
        const productDetail = details[product.id] || {};

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
                            ${product.fields.map(field => {
            const fv = productDetail[field.name] ?? '';
            return `
                            <div class="form-group">
                                <label class="form-label small-label" for="${product.id}-${field.name}">${field.label}${field.name !== 'specificAreaCodes' ? ' <span aria-hidden="true">*</span>' : ''}</label>
                                <input class="form-input" id="${product.id}-${field.name}"
                                    type="${field.type}" placeholder="${field.placeholder}"
                                    value="${escHtml(fv)}"
                                    data-product-key="${product.id}"
                                    data-field-name="${field.name}" />
                            </div>`;
        }).join('')}
                        </div>
                    </div>` : ''}
                </div>`;
    }).join('')}
        </div>
    </div>`;
}

function renderStep8Technical() {
    const sp = state.formData.products.selectedProducts;
    const details = state.formData.products.details;
    const t = state.formData.technical;
    
    // Dynamic logic
    const hasDiallerServer = sp.includes('dialler_server');
    const hasVoip = sp.includes('voip');
    const hasAiBots = sp.includes('ai_bots');
    const needsThirdPartyDialler = !hasDiallerServer && (hasVoip || hasAiBots);

    let html = `
    <div class="step-space">
        <div>
            <h2 class="step-title">Technical Information</h2>
            <p class="step-subtitle">Provide details for your selected products.</p>
        </div>
        <div class="form-grid form-grid-2">`;

    if (needsThirdPartyDialler) {
        html += `
            <div class="section-divider col-span-2"><h3>Third-Party Dialler Access</h3></div>
            <div class="form-group col-span-2">
                <label class="form-label" for="diallerLink">Dialler server link <span aria-hidden="true">*</span></label>
                <input class="form-input" id="diallerLink" name="diallerServerLink" type="url" placeholder="https://..." value="${escHtml(t.diallerServerLink)}" data-section="technical" />
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="valLink">Validation link <span aria-hidden="true">*</span></label>
                <input class="form-input" id="valLink" name="validationLink" type="url" value="${escHtml(t.validationLink)}" data-section="technical" />
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="serverIps">Server IPs <span aria-hidden="true">*</span></label>
                <textarea class="form-input" id="serverIps" name="serverIPs" rows="4" placeholder="One IP per line" data-section="technical">${escHtml(t.serverIPs)}</textarea>
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="l9access">Dialler level 9 access <span aria-hidden="true">*</span></label>
                <p class="step-subtitle" style="margin:-.25rem 0 .5rem;font-size:.8rem;">SSH key, API token, or other credential text your team uses for access.</p>
                <textarea class="form-input" id="l9access" name="diallerLevel9AccessDetails" rows="3" data-section="technical">${escHtml(t.diallerLevel9AccessDetails)}</textarea>
            </div>`;
    }

    if (sp.includes('voip')) {
        const pd = details['voip'] || {};
        html += `
            <div class="section-divider col-span-2"><h3>VoIP</h3></div>
            <div class="form-group col-span-2">
                <label class="form-label" for="voip-numberOfPorts">Number of ports <span aria-hidden="true">*</span></label>
                <input class="form-input" id="voip-numberOfPorts" type="number" placeholder="e.g., 50" value="${escHtml(pd.numberOfPorts || '')}" data-product-key="voip" data-field-name="numberOfPorts" />
            </div>`;
    }

    if (sp.includes('dialler_server')) {
        const pd = details['dialler_server'] || {};
        html += `
            <div class="section-divider col-span-2"><h3>Dialler Server</h3></div>
            <div class="form-group">
                <label class="form-label" for="dialler-numberOfAgents">Number of agents <span aria-hidden="true">*</span></label>
                <input class="form-input" id="dialler-numberOfAgents" type="number" placeholder="e.g., 20" value="${escHtml(pd.numberOfAgents || '')}" data-product-key="dialler_server" data-field-name="numberOfAgents" />
            </div>
            <div class="form-group">
                <label class="form-label" for="dialler-numberOfCampaigns">Number of campaigns <span aria-hidden="true">*</span></label>
                <input class="form-input" id="dialler-numberOfCampaigns" type="number" placeholder="e.g., 5" value="${escHtml(pd.numberOfCampaigns || '')}" data-product-key="dialler_server" data-field-name="numberOfCampaigns" />
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="dialler-settings">Settings which should be done in dialler <span aria-hidden="true">*</span></label>
                <textarea class="form-input" id="dialler-settings" rows="3" placeholder="Specific configuration requests" data-product-key="dialler_server" data-field-name="diallerSettings">${escHtml(pd.diallerSettings || '')}</textarea>
            </div>`;
    }

    if (sp.includes('inbound_did')) {
        const pd = details['inbound_did'] || {};
        html += `
            <div class="section-divider col-span-2"><h3>Inbound DID</h3></div>
            <div class="form-group">
                <label class="form-label" for="did-numberOfDIDs">Number of DIDs <span aria-hidden="true">*</span></label>
                <input class="form-input" id="did-numberOfDIDs" type="number" placeholder="e.g., 100" value="${escHtml(pd.numberOfDIDs || '')}" data-product-key="inbound_did" data-field-name="numberOfDIDs" />
            </div>
            <div class="form-group">
                <label class="form-label" for="did-areaCode">Any specific area code?</label>
                <input class="form-input" id="did-areaCode" type="text" placeholder="Optional" value="${escHtml(pd.specificAreaCodes || '')}" data-product-key="inbound_did" data-field-name="specificAreaCodes" />
            </div>`;
    }

    if (sp.includes('toll_free')) {
        const pd = details['toll_free'] || {};
        html += `
            <div class="section-divider col-span-2"><h3>TFN (Toll-Free)</h3></div>
            <div class="form-group col-span-2">
                <label class="form-label" for="tfn-quantity">Number of TFN numbers <span aria-hidden="true">*</span></label>
                <input class="form-input" id="tfn-quantity" type="number" placeholder="e.g., 10" value="${escHtml(pd.tfnQuantity || '')}" data-product-key="toll_free" data-field-name="tfnQuantity" />
            </div>`;
    }

    if (sp.includes('ai_bots')) {
        const pd = details['ai_bots'] || {};
        html += `
            <div class="section-divider col-span-2"><h3>AI Bots</h3></div>
            <div class="form-group">
                <label class="form-label" for="bots-numberOfBots">Number of AI bots <span aria-hidden="true">*</span></label>
                <input class="form-input" id="bots-numberOfBots" type="number" placeholder="e.g., 5" value="${escHtml(pd.numberOfBots || '')}" data-product-key="ai_bots" data-field-name="numberOfBots" />
            </div>
            <div class="form-group">
                <label class="form-label" for="bots-campaign">Campaign <span aria-hidden="true">*</span></label>
                <input class="form-input" id="bots-campaign" type="text" placeholder="Campaign name" value="${escHtml(pd.aiBotCampaign || '')}" data-product-key="ai_bots" data-field-name="aiBotCampaign" />
            </div>
            <div class="form-group col-span-2">
                <label class="form-label" for="bots-script">Any script for the bots?</label>
                <textarea class="form-input" id="bots-script" rows="3" placeholder="Optional" data-product-key="ai_bots" data-field-name="aiBotScript">${escHtml(pd.aiBotScript || '')}</textarea>
            </div>`;
    }

    html += `
        </div>
    </div>`;
    
    return html;
}

function renderStep9Attestation() {
    const a = state.formData.attestation;
    return `
    <div class="step-space">
        <div>
            <h2 class="step-title">Attestation &amp; Submit</h2>
            <p class="step-subtitle">Authorized signatory for this application.</p>
        </div>
        <div style="background:#f0fdf4;border:1px solid #d5e3dc;border-radius:12px;padding:1rem 1.15rem;margin-bottom:1.25rem;font-size:.9rem;line-height:1.55;color:#234C3D;">
            By signing, the representative named below declares they are an officer of the Customer and is duly authorized to submit this application and bind the Customer to the information provided.
        </div>
        <div class="form-group">
            <label class="form-label" for="officerName">Officer name (signatory) <span aria-hidden="true">*</span></label>
            <input class="form-input" id="officerName" name="officerName" type="text" value="${escHtml(a.officerName)}"
                data-section="attestation" />
        </div>
        <div class="form-group">
            <label class="form-label" for="sigText">Signature (type full name) <span aria-hidden="true">*</span></label>
            <p class="step-subtitle" style="margin:-.25rem 0 .5rem;font-size:.8rem;">By typing your name, you agree this constitutes your electronic signature.</p>
            <input class="form-input" id="sigText" name="signatureText" type="text" value="${escHtml(a.signatureText)}"
                data-section="attestation" />
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
    const stepRenderers = {
        1: renderStep1,
        2: renderStep2Vendor,
        3: renderStep3,
        4: renderStep4,
        5: renderStep5TradeReferences,
        6: renderStep6Regulatory,
        7: renderStep7Products,
        8: renderStep8Technical,
        9: renderStep9Attestation,
    };
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
    if (state.currentStep < 9) {
        btnNext.className = 'btn btn-primary';
        btnNext.innerHTML = `Continue ${ICONS.chevronRight}`;
    } else {
        btnNext.className = 'btn btn-success';
        btnNext.innerHTML = `Submit application ${ICONS.checkCircle}`;
    }
}

/* ======== EVENT BINDING ======== */
function bindStepEvents() {
    // Generic inputs / selects
    document.querySelectorAll('[data-section]').forEach(el => {
        el.addEventListener('change', handleFormChange);
        el.addEventListener('input', handleFormChange);
    });

    // Product card toggles
    document.querySelectorAll('.product-card').forEach(card => {
        if (card.dataset.productId) {
            card.addEventListener('click', handleProductToggle);
            card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleProductToggle.call(card, e); } });
        } else if (card.dataset.vendorType) {
            card.addEventListener('click', handleVendorTypeToggle);
            card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleVendorTypeToggle.call(card, e); } });
        }
    });

    // Product detail inputs
    document.querySelectorAll('[data-product-key]').forEach(input => {
        input.addEventListener('input', handleProductDetailChange);
        input.addEventListener('click', e => e.stopPropagation());
    });

    const addTr = document.getElementById('addTradeRef');
    if (addTr) {
        addTr.addEventListener('click', () => {
            state.formData.tradeReferences.push({
                tradeReferenceName: '',
                tradeReferenceAddress: '',
                tradeReferenceNumber: '',
                contactName: '',
                contactEmail: '',
                contactPhone: '',
            });
            update(1);
        });
    }
    document.querySelectorAll('[data-remove-trade-index]').forEach(btn => {
        btn.addEventListener('click', e => {
            const i = parseInt(e.currentTarget.getAttribute('data-remove-trade-index'), 10);
            if (!Number.isNaN(i) && state.formData.tradeReferences.length > 1) {
                state.formData.tradeReferences.splice(i, 1);
                update(1);
            }
        });
    });
}

function handleFormChange(e) {
    const el = e.target;
    stripFieldInvalid(el);
    document.querySelector('.products-grid')?.classList.remove(FIELD_INVALID_CLS);
    const section = el.dataset.section;
    const name = el.name;

    if (section === 'company' && name === 'businessBasedInUs' && el.type === 'radio') {
        if (el.checked) state.formData.company.businessBasedInUs = el.value === 'true';
        return;
    }

    if (section === 'banking' && name === 'hasUsBankAccount' && el.type === 'radio') {
        if (el.checked) {
            state.formData.banking.hasUsBankAccount = el.value === 'true';
            const wrap = document.getElementById('bankDetailsWrap');
            if (wrap) wrap.classList.toggle('visible', state.formData.banking.hasUsBankAccount === true);
        }
        return;
    }

    if (section === 'tradeRefs' && el.dataset.tradeIndex != null && el.dataset.field) {
        const idx = parseInt(el.dataset.tradeIndex, 10);
        const field = el.dataset.field;
        const row = state.formData.tradeReferences[idx];
        if (row) row[field] = el.value;
        return;
    }

    if (section === 'regulatory') {
        if (el.type === 'checkbox' && el.dataset.bizDesc) {
            const key = el.dataset.bizDesc;
            let arr = state.formData.regulatory.businessDescriptions;
            if (el.checked && !arr.includes(key)) arr = [...arr, key];
            else arr = arr.filter(x => x !== key);
            state.formData.regulatory.businessDescriptions = arr;
            const wrap = document.getElementById('regOtherWrap');
            if (wrap) wrap.style.display = arr.includes('other') ? '' : 'none';
            return;
        }
        if (el.type === 'radio' && el.dataset.regKey && el.checked) {
            state.formData.regulatory[el.dataset.regKey] = el.value === 'true';
            if (el.dataset.regKey === 'robocallMitigationRegistered') {
                const wx = document.getElementById('rmdExtraWrap');
                if (wx) wx.style.display = state.formData.regulatory.robocallMitigationRegistered ? '' : 'none';
            }
            return;
        }
        if (el.dataset.regText) {
            state.formData.regulatory[el.dataset.regText] = el.value;
            return;
        }
    }

    const isCheckbox = el.type === 'checkbox';
    const value = isCheckbox ? el.checked : el.value;

    if (section && name && state.formData[section]) {
        state.formData[section][name] = value;
    }
    if (section === 'user' && name === 'email') {
        const normalized = String(value ?? '').trim().toLowerCase();
        if (state.registeredEmail && normalized && normalized !== state.registeredEmail) {
            state.registeredUserId = null;
        }
    }
}

const FIELD_INVALID_CLS = 'field-invalid';

function clearFieldErrors() {
    document.getElementById('stepWrapper')?.querySelectorAll(`.${FIELD_INVALID_CLS}`)
        .forEach(el => el.classList.remove(FIELD_INVALID_CLS));
}

function markFieldInvalid(fieldRef) {
    if (fieldRef == null) return;
    if (fieldRef === '__products_grid__') {
        document.querySelector('.products-grid')?.classList.add(FIELD_INVALID_CLS);
        return;
    }
    if (typeof fieldRef === 'object' && fieldRef.radioName) {
        const inp = document.querySelector(`input[name="${CSS.escape(fieldRef.radioName)}"]`);
        inp?.closest('.form-group')?.classList.add(FIELD_INVALID_CLS);
        return;
    }
    const el = typeof fieldRef === 'string' ? document.getElementById(fieldRef) : fieldRef;
    if (!el) return;
    el.closest('.form-group')?.classList.add(FIELD_INVALID_CLS);
}

function validationFail(msg, fieldRef) {
    showToast(msg, 'error');
    markFieldInvalid(fieldRef);
    requestAnimationFrame(() => scrollToFirstFieldError());
}

function scrollToFirstFieldError() {
    const wrap = document.getElementById('stepWrapper');
    if (!wrap) return;
    const g = wrap.querySelector(`.form-group.${FIELD_INVALID_CLS}`);
    if (g) {
        const t = g.querySelector('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
        if (t && typeof t.focus === 'function') {
            t.focus();
            t.scrollIntoView({ block: 'center', behavior: 'smooth' });
            return;
        }
        const r = g.querySelector('input[type="radio"]');
        if (r && typeof r.focus === 'function') {
            r.focus();
            g.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        return;
    }
    wrap.querySelector('.products-grid.field-invalid')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function stripFieldInvalid(el) {
    el?.closest('.form-group')?.classList.remove(FIELD_INVALID_CLS);
}

function validateStep1() {
    clearFieldErrors();
    const u = state.formData.user;
    const email = (u.email || '').trim();
    if (!email) {
        validationFail('Please enter your email address.', 'email');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        validationFail('Please enter a valid email address.', 'email');
        return false;
    }
    if (!(u.password || '').length) {
        validationFail('Please enter a password.', 'password');
        return false;
    }
    const pwdErr = validatePasswordPolicy(u.password);
    if (pwdErr) {
        validationFail(pwdErr, 'password');
        return false;
    }
    if (u.password !== u.confirmPassword) {
        validationFail('Password and confirm password must match.', 'confirmPassword');
        return false;
    }
    return true;
}

function validateStep2Vendor() {
    clearFieldErrors();
    const c = state.formData.company;
    if (c.vendorType !== 'VoIP Vendor' && c.vendorType !== 'Call Centre') {
        validationFail('Please select a vendor type.', { radioName: 'vendorType' });
        return false;
    }
    return true;
}

function validateStep2() {
    clearFieldErrors();
    const c = state.formData.company;
    const req = (v) => String(v ?? '').trim().length > 0;
    const isCallCentre = c.vendorType === 'Call Centre';

    // Core Call Centre fields
    if (!req(c.companyName)) { validationFail('Legal name of company is required.', 'companyName'); return false; }
    if (!req(c.address)) { validationFail('Physical address is required.', 'address'); return false; }
    if (!req(c.customerUrl)) { validationFail('Customer URL (Company Website) is required.', 'customerUrl'); return false; }
    if (!req(c.voipPortalEmail)) { validationFail('VoIP Portal email (Official Email) is required.', 'voipPortalEmail'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(c.voipPortalEmail).trim())) {
        validationFail('VoIP Portal email must be valid.', 'voipPortalEmail'); return false;
    }
    if (!req(c.feinNumber)) { validationFail('FEIN is required.', 'feinNumber'); return false; }
    if (isCallCentre) {
        if (!req(c.campaign)) { validationFail('Campaign is required.', 'campaign'); return false; }
        if (!req(c.rmd)) { validationFail('RMD is required.', 'rmd'); return false; }
    }

    if (!isCallCentre) {
        if (!req(c.city)) { validationFail('Physical city is required.', 'city'); return false; }
        if (!req(c.state)) { validationFail('Physical state is required.', 'state'); return false; }
        if (!req(c.zipCode)) { validationFail('Physical ZIP is required.', 'zipCode'); return false; }
        if (!req(c.country)) { validationFail('Country is required.', 'country'); return false; }
        if (c.businessBasedInUs !== true && c.businessBasedInUs !== false) {
            validationFail('Please indicate if the company is U.S.-based.', { radioName: 'businessBasedInUs' }); return false;
        }
        if (c.businessBasedInUs && !req(c.stateOfIncorporation)) {
            validationFail('State of incorporation is required for U.S.-based businesses.', 'stateOfIncorporation'); return false;
        }
        if (!req(c.corporateType)) { validationFail('Corporate type is required.', 'corporateType'); return false; }
        if (!req(c.businessLine)) { validationFail('Business line is required.', 'businessLine'); return false; }
        if (!req(c.frnNumber)) { validationFail('FRN is required.', 'frnNumber'); return false; }
        if (!req(c.mobileNumber)) { validationFail('Mobile number is required.', 'mobileNumber'); return false; }
        if (!req(c.teamsOrWhatsApp)) { validationFail('Teams ID or WhatsApp is required.', 'teamsOrWhatsApp'); return false; }
        if (!req(c.filerId499)) { validationFail('499 Filer ID is required.', 'filerId499'); return false; }
        if (!req(c.businessContactName)) { validationFail('Business contact name is required.', 'businessContactName'); return false; }
        if (!req(c.businessPhone)) { validationFail('Business phone is required.', 'businessPhone'); return false; }
    }

    const optEmails = [
        [c.emailForRates, 'email for rates', 'emailForRates'],
        [c.emailForNotices, 'email for notices', 'emailForNotices'],
        [c.emailForBalances, 'email for balances', 'emailForBalances'],
        [c.primaryMainEmail, 'primary main email', 'primaryMainEmail'],
        [c.billingAccountingEmail, 'billing/accounting email', 'billingAccountingEmail'],
        [c.supportNocEmail, 'support/NOC email', 'supportNocEmail'],
        [c.legalEmail, 'legal email', 'legalEmail'],
        [c.complianceEmail, 'compliance email', 'complianceEmail'],
        [c.fraudReportEmail, 'fraud report email', 'fraudReportEmail'],
    ];
    for (const [val, label, fieldId] of optEmails) {
        const s = String(val || '').trim();
        if (s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) {
            validationFail(`Invalid ${label}.`, fieldId); return false;
        }
    }
    return true;
}

function isHttpUrl(s) {
    if (!s || !String(s).trim()) return false;
    try {
        const u = new URL(String(s).trim());
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
        return false;
    }
}

const E164_RE = /^\+[1-9]\d{1,14}$/;

function validateStep5TradeReferences() {
    clearFieldErrors();
    const rows = state.formData.tradeReferences;
    if (state.formData.company.vendorType === 'Call Centre') {
        // Trade references are optional for Call Centre
        return true;
    }
    if (!rows.length) {
        validationFail('Add at least one trade reference.', 'tr-0-name');
        return false;
    }
    const req = (v) => String(v ?? '').trim().length > 0;
    for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (!req(r.tradeReferenceName)) { validationFail(`Trade reference ${i + 1}: name is required.`, `tr-${i}-name`); return false; }
        if (!req(r.tradeReferenceAddress)) { validationFail(`Trade reference ${i + 1}: address is required.`, `tr-${i}-addr`); return false; }
        if (!req(r.contactName)) { validationFail(`Trade reference ${i + 1}: contact name is required.`, `tr-${i}-cname`); return false; }
        if (!req(r.contactEmail) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(r.contactEmail).trim())) {
            validationFail(`Trade reference ${i + 1}: valid contact email is required.`, `tr-${i}-cemail`); return false;
        }
        const ph = String(r.contactPhone || '').trim();
        if (!E164_RE.test(ph)) {
            validationFail(`Trade reference ${i + 1}: contact phone must be E.164 (e.g. +15551234567).`, `tr-${i}-cphone`); return false;
        }
    }
    return true;
}

function validateStep6Regulatory() {
    clearFieldErrors();
    if (state.formData.company.vendorType === 'Call Centre') {
        // Regulatory is optional for Call Centre
        return true;
    }
    const r = state.formData.regulatory;
    const req = (v) => String(v ?? '').trim().length > 0;
    const yn = (v) => v === true || v === false;

    if (!req(r.intermediateProviderRegistryCompanyName)) { validationFail('Intermediate Provider Registry company name is required.', 'iprName'); return false; }
    if (!req(r.stirShakenCertCompanyName)) { validationFail('STIR/SHAKEN certificate company name is required.', 'stirName'); return false; }
    if (!req(r.ocnStirShakenHeader)) { validationFail('OCN for STIR/SHAKEN header is required.', 'ocn'); return false; }
    if (!req(r.fcc499FilerId)) { validationFail('FCC 499 Filer ID is required.', 'fcc499'); return false; }

    if (r.businessDescriptions.includes('other') && !req(r.businessDescriptionOtherText)) {
        validationFail('Please describe your business when Other is selected.', 'regOtherText'); return false;
    }

    const boolKeys = [
        'robocallMitigationRegistered', 'stirShakenRmdImplemented', 'signingAllCalls', 'complianceUsBankAccount',
        'originateConversationalTraffic', 'originateAutodialedTraffic', 'directAutodialClients', 'nonUsAutodialSources',
        'itgTracingEngaged', 'moreThanThreeTracebacksLastYear', 'moreThanFourGovImpersonationTracebacks',
        'nonCooperativeVspByUsTelecom', 'blockedFromNetworkLastTwoYears', 'adverseJudgementUnlawfulRobocalls',
    ];
    for (const k of boolKeys) {
        if (!yn(r[k])) {
            validationFail('Please answer all Yes / No compliance questions.', { radioName: k });
            return false;
        }
    }

    if (r.robocallMitigationRegistered === true) {
        if (!req(r.robocallMitigationListedCompanyName)) { validationFail('RoboCall Mitigation listed company name is required.', 'rmdListed'); return false; }
        if (!req(r.robocallMitigationDatabaseNumber)) { validationFail('RoboCall Mitigation database number is required.', 'rmdDb'); return false; }
    }

    const pct = (raw, label, fieldId) => {
        const n = parseFloat(String(raw ?? '').replace(',', '.'));
        if (Number.isNaN(n)) { validationFail(`${label} must be a number.`, fieldId); return null; }
        return n;
    };
    const asr = pct(r.estimatedAsrPercent, 'Estimated ASR %', 'asr');
    if (asr === null) return false;
    if (asr < 0 || asr > 100) { validationFail('ASR % must be between 0 and 100.', 'asr'); return false; }
    const aloc = pct(r.estimatedAloc, 'Estimated ALOC', 'aloc');
    if (aloc === null) return false;
    if (aloc < 0) { validationFail('ALOC must be zero or greater.', 'aloc'); return false; }
    for (const [key, label, fieldId] of [
        ['estimatedUnallocated404Percent', 'Unallocated 404 %', 'p404'],
        ['estimatedCancel487Percent', 'Cancel / 487 %', 'p487'],
        ['estimatedShortDurationPercent', 'Short duration %', 'pshort'],
    ]) {
        const v = pct(r[key], label, fieldId);
        if (v === null) return false;
        if (v < 0 || v > 100) { validationFail(`${label} must be between 0 and 100.`, fieldId); return false; }
    }
    return true;
}

function validateStep7Products() {
    clearFieldErrors();
    const sp = state.formData.products.selectedProducts;
    if (!sp.length) {
        validationFail('Select at least one product.', '__products_grid__');
        return false;
    }
    return true;
}

function validateStep8Technical() {
    clearFieldErrors();
    const t = state.formData.technical;
    const sp = state.formData.products.selectedProducts;
    const det = state.formData.products.details;
    
    // Dynamic logic
    const hasDiallerServer = sp.includes('dialler_server');
    const hasVoip = sp.includes('voip');
    const hasAiBots = sp.includes('ai_bots');
    const needsThirdPartyDialler = !hasDiallerServer && (hasVoip || hasAiBots);

    if (needsThirdPartyDialler) {
        if (t.diallerServerLink && !isHttpUrl(t.diallerServerLink)) {
            validationFail('Dialler server link must be a valid http(s) URL.', 'diallerLink');
            return false;
        }
        if (!isHttpUrl(t.validationLink)) {
            validationFail('Validation link must be a valid http(s) URL.', 'valLink');
            return false;
        }
        if (!String(t.serverIPs ?? '').trim()) {
            validationFail('Enter at least one server IP (one per line).', 'serverIps');
            return false;
        }
        if (!String(t.diallerLevel9AccessDetails ?? '').trim()) {
            validationFail('Dialler level 9 / access details are required.', 'l9access');
            return false;
        }
    }

    const reqNum = (pid, field, label) => {
        const n = parseInt(det[pid]?.[field], 10);
        if (!Number.isFinite(n) || n <= 0) {
            validationFail(`${label} is required.`, `${pid}-${field}`);
            return false;
        }
        return true;
    };
    const reqStr = (pid, field, label) => {
        if (!String(det[pid]?.[field] ?? '').trim()) {
            validationFail(`${label} is required.`, `${pid}-${field}`);
            return false;
        }
        return true;
    };

    for (const pid of sp) {
        if (pid === 'voip' && !reqNum(pid, 'numberOfPorts', 'Number of ports')) return false;
        if (pid === 'dialler_server') {
            if (!reqNum(pid, 'numberOfAgents', 'Number of agents')) return false;
            if (!reqNum(pid, 'numberOfCampaigns', 'Number of campaigns')) return false;
            if (!reqStr(pid, 'diallerSettings', 'Settings which should be done in dialler')) return false;
        }
        if (pid === 'inbound_did' && !reqNum(pid, 'numberOfDIDs', 'Number of DIDs')) return false;
        if (pid === 'toll_free' && !reqNum(pid, 'tfnQuantity', 'TFN quantity')) return false;
        if (pid === 'ai_bots') {
            if (!reqNum(pid, 'numberOfBots', 'Number of bots')) return false;
            if (!reqStr(pid, 'aiBotCampaign', 'Campaign')) return false;
        }
    }

    return true;
}

function validateStep9Attestation() {
    clearFieldErrors();
    if (state.formData.company.vendorType === 'Call Centre') {
        // Optional
        return true;
    }
    const a = state.formData.attestation;
    if (!String(a.officerName ?? '').trim()) {
        validationFail('Officer name is required.', 'officerName');
        return false;
    }
    if (!String(a.signatureText ?? '').trim()) {
        validationFail('Typed signature is required.', 'sigText');
        return false;
    }
    return true;
}

function validateStep3Banking() {
    clearFieldErrors();
    if (state.formData.company.vendorType === 'Call Centre') {
        // Banking is optional for Call Centre
        return true;
    }
    const bk = state.formData.banking;
    if (bk.hasUsBankAccount !== true && bk.hasUsBankAccount !== false) {
        validationFail('Please indicate whether your company has a U.S. bank account.', { radioName: 'hasUsBankAccount' });
        return false;
    }
    if (bk.hasUsBankAccount !== true) return true;

    const req = (v) => String(v ?? '').trim().length > 0;
    if (!req(bk.bankName)) { validationFail('Bank name is required.', 'bankName'); return false; }
    if (!req(bk.bankAddress)) { validationFail('Bank address is required.', 'bankAddress'); return false; }
    if (!req(bk.contactName)) { validationFail('Bank contact name is required.', 'bankContactName'); return false; }
    if (!req(bk.contactPhone)) { validationFail('Bank contact phone is required.', 'bankContactPhone'); return false; }
    if (!req(bk.contactEmail)) { validationFail('Bank contact email is required.', 'bankContactEmail'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(bk.contactEmail).trim())) {
        validationFail('Bank contact email must be valid.', 'bankContactEmail'); return false;
    }
    if (!req(bk.accountNumber)) { validationFail('Account number is required.', 'bankAccountNumber'); return false; }
    return true;
}

async function ensureUserRegistered() {
    const email = state.formData.user.email.trim().toLowerCase();
    if (state.registeredUserId && state.registeredEmail === email) {
        return true;
    }

    const btn = document.getElementById('btnNext');
    btn.disabled = true;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Creating account…`;

    try {
        const res = await fetch(`${getApiBase()}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: state.formData.user.email.trim(),
                password: state.formData.user.password,
                userName: state.formData.user.email.trim(),
            }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const msg = data.message || data.detail || data.title
                || (typeof data === 'string' ? data : null)
                || `Server error (${res.status})`;
            throw new Error(msg);
        }
        const uid = data.userId ?? data.UserId;
        if (!uid) throw new Error('No user id returned from registration.');
        state.registeredUserId = uid;
        state.registeredEmail = email;
        return true;
    } catch (err) {
        console.error('Registration error:', err);
        showToast(err.message || 'Registration failed.', 'error');
        return false;
    } finally {
        btn.disabled = false;
        updateButtons();
    }
}

function handleProductToggle(e) {
    const card = e.currentTarget || this;
    document.querySelector('.products-grid')?.classList.remove(FIELD_INVALID_CLS);
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

function handleVendorTypeToggle(e) {
    const card = e.currentTarget || this;
    document.querySelector('.products-grid')?.classList.remove(FIELD_INVALID_CLS);
    const vendorType = card.dataset.vendorType;
    if (!vendorType) return;

    state.formData.company.vendorType = vendorType;

    // Update UI for all cards in the grid
    const grid = card.closest('.products-grid');
    if (grid) {
        grid.querySelectorAll('.product-card').forEach(c => {
            const isThis = c.dataset.vendorType === vendorType;
            c.className = `product-card ${isThis ? 'selected border-blue-600' : ''}`;
            c.setAttribute('aria-pressed', isThis);
            
            const check = c.querySelector('.product-check');
            if (check) check.className = `product-check ${isThis ? 'checked' : ''}`;
            
            const radio = c.querySelector('input[type="radio"]');
            if (radio) radio.checked = isThis;
        });
    }
}

function handleProductDetailChange(e) {
    const input = e.target;
    stripFieldInvalid(input);
    document.querySelector('.products-grid')?.classList.remove(FIELD_INVALID_CLS);
    const productKey = input.dataset.productKey;
    const fieldName = input.dataset.fieldName;
    const value = input.value;

    if (!state.formData.products.details[productKey]) {
        state.formData.products.details[productKey] = {};
    }
    state.formData.products.details[productKey][fieldName] = value;
}

/* ======== NAVIGATION ======== */
async function goNext() {
    if (isAnimating) return;              // Ignore clicks during transition
    if (state.currentStep === 1) {
        if (!validateStep1()) return;
        const registered = await ensureUserRegistered();
        if (!registered) return;
    } else if (state.currentStep === 2) {
        if (!validateStep2Vendor()) return;
    } else if (state.currentStep === 3) {
        if (!validateStep2()) return;
    } else if (state.currentStep === 4) {
        if (!validateStep3Banking()) return;
    } else if (state.currentStep === 5) {
        if (!validateStep5TradeReferences()) return;
    } else if (state.currentStep === 6) {
        if (!validateStep6Regulatory()) return;
    } else if (state.currentStep === 7) {
        if (!validateStep7Products()) return;
    } else if (state.currentStep === 8) {
        if (!validateStep8Technical()) return;
    }
    if (state.currentStep < 9) {
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
    const fd = state.formData;
    if (!validateStep9Attestation()) return;

    // Build backend payload matching SubmitKycApplicationCommand
    const payload = {
        userId: state.registeredUserId || '',
        companyDetails: {
            companyName: fd.company.companyName,
            otherDesignatedNames: fd.company.otherDesignatedNames || null,
            address: fd.company.address,
            city: fd.company.city,
            state: fd.company.state,
            country: fd.company.country,
            zipCode: fd.company.zipCode,
            mailingAddress: fd.company.mailingAddress || null,
            mailingCityStateZip: fd.company.mailingCityStateZip || null,
            businessBasedInUs: !!fd.company.businessBasedInUs,
            stateOfIncorporation: fd.company.stateOfIncorporation || null,
            dateOfIncorporation: fd.company.dateOfIncorporation || null,
            businessLicenseNumber: fd.company.businessLicenseNumber || null,
            feinNumber: fd.company.feinNumber,
            frnNumber: fd.company.frnNumber,
            corporateType: mapCorporateType(fd.company.corporateType),
            businessLine: fd.company.businessLine,
            mobileNumber: fd.company.mobileNumber,
            teamsOrWhatsApp: fd.company.teamsOrWhatsApp,
            filerID499: fd.company.filerId499,
            businessContactName: fd.company.businessContactName,
            businessPhone: fd.company.businessPhone,
            mobilePhoneSeparate: fd.company.mobilePhoneSeparate || null,
            emailForRates: fd.company.emailForRates || null,
            emailForNotices: fd.company.emailForNotices || null,
            emailForBalances: fd.company.emailForBalances || null,
            voipPortalEmail: fd.company.voipPortalEmail || fd.user.email,
            customerMainPhone: fd.company.customerMainPhone || null,
            customerFax: fd.company.customerFax || null,
            customerUrl: fd.company.customerUrl || null,
            companyContactName: fd.company.companyContactName || null,
            primaryMainEmail: fd.company.primaryMainEmail || null,
            billingAccountingEmail: fd.company.billingAccountingEmail || null,
            supportNocEmail: fd.company.supportNocEmail || null,
            legalEmail: fd.company.legalEmail || null,
            complianceEmail: fd.company.complianceEmail || null,
            fraudReportEmail: fd.company.fraudReportEmail || null,
            skypeId: fd.company.skypeId || null,
            vendorType: fd.company.vendorType || null,
            campaign: fd.company.campaign || null,
            rmd: fd.company.rmd || null,
        },
        companyBanking: {
            hasUsBankAccount: fd.banking.hasUsBankAccount === true,
            bankName: fd.banking.hasUsBankAccount === true ? (fd.banking.bankName || null) : null,
            bankAddress: fd.banking.hasUsBankAccount === true ? (fd.banking.bankAddress || null) : null,
            contactName: fd.banking.hasUsBankAccount === true ? (fd.banking.contactName || null) : null,
            contactPhone: fd.banking.hasUsBankAccount === true ? (fd.banking.contactPhone || null) : null,
            contactEmail: fd.banking.hasUsBankAccount === true ? (fd.banking.contactEmail || null) : null,
            contactFax: fd.banking.hasUsBankAccount === true ? (fd.banking.contactFax || null) : null,
            accountNumber: fd.banking.hasUsBankAccount === true ? (fd.banking.accountNumber || null) : null,
        },
        productSelections: fd.products.selectedProducts.map(pid => {
            const d = fd.products.details[pid] || {};
            const sel = {
                productType: mapProductType(pid),
                numberOfPorts: null,
                numberOfAgents: null,
                numberOfCampaigns: null,
                diallerSettings: null,
                numberOfDIDs: null,
                specificAreaCodes: null,
                tfnQuantity: null,
                numberOfBots: null,
                botServerInformation: null,
                closerDiallerDetails: null,
                aiBotCampaign: null,
                aiBotScript: null,
            };
            if (pid === 'voip') sel.numberOfPorts = parseInt(d.numberOfPorts, 10) || null;
            if (pid === 'dialler_server') {
                sel.numberOfAgents = parseInt(d.numberOfAgents, 10) || null;
                sel.numberOfCampaigns = parseInt(d.numberOfCampaigns, 10) || null;
                sel.diallerSettings = d.diallerSettings || null;
            }
            if (pid === 'inbound_did') {
                sel.numberOfDIDs = parseInt(d.numberOfDIDs, 10) || null;
                sel.specificAreaCodes = d.specificAreaCodes || null;
            }
            if (pid === 'toll_free') sel.tfnQuantity = parseInt(d.tfnQuantity, 10) || null;
            if (pid === 'ai_bots') {
                sel.numberOfBots = parseInt(d.numberOfBots, 10) || null;
                sel.botServerInformation = d.botServerInformation || null;
                sel.closerDiallerDetails = d.closerDiallerDetails || null;
                sel.aiBotCampaign = d.aiBotCampaign || null;
                sel.aiBotScript = d.aiBotScript || null;
            }
            return sel;
        }),
        technicalInformation: {
            diallerServerLink: fd.technical.diallerServerLink || null,
            validationLink: fd.technical.validationLink || null,
            serverIPs: fd.technical.serverIPs || null,
            diallerLevel9AccessDetails: fd.technical.diallerLevel9AccessDetails || '',
        },
        tradeReferences: fd.tradeReferences.map(r => ({
            tradeReferenceName: r.tradeReferenceName,
            tradeReferenceAddress: r.tradeReferenceAddress,
            tradeReferenceNumber: r.tradeReferenceNumber || null,
            contactName: r.contactName,
            contactEmail: r.contactEmail,
            contactPhone: r.contactPhone,
        })),
        regulatoryCompliance: {
            businessDescriptions: fd.regulatory.businessDescriptions,
            businessDescriptionOtherText: fd.regulatory.businessDescriptionOtherText || null,
            intermediateProviderRegistryCompanyName: fd.regulatory.intermediateProviderRegistryCompanyName,
            stirShakenCertCompanyName: fd.regulatory.stirShakenCertCompanyName,
            ocnStirShakenHeader: fd.regulatory.ocnStirShakenHeader,
            fcc499FilerId: fd.regulatory.fcc499FilerId,
            robocallMitigationRegistered: fd.regulatory.robocallMitigationRegistered,
            robocallMitigationListedCompanyName: fd.regulatory.robocallMitigationRegistered ? (fd.regulatory.robocallMitigationListedCompanyName || null) : null,
            robocallMitigationDatabaseNumber: fd.regulatory.robocallMitigationRegistered ? (fd.regulatory.robocallMitigationDatabaseNumber || null) : null,
            stirShakenRmdImplemented: fd.regulatory.stirShakenRmdImplemented,
            signingAllCalls: fd.regulatory.signingAllCalls,
            complianceUsBankAccount: fd.regulatory.complianceUsBankAccount,
            originateConversationalTraffic: fd.regulatory.originateConversationalTraffic,
            originateAutodialedTraffic: fd.regulatory.originateAutodialedTraffic,
            directAutodialClients: fd.regulatory.directAutodialClients,
            nonUsAutodialSources: fd.regulatory.nonUsAutodialSources,
            itgTracingEngaged: fd.regulatory.itgTracingEngaged,
            moreThanThreeTracebacksLastYear: fd.regulatory.moreThanThreeTracebacksLastYear,
            moreThanFourGovImpersonationTracebacks: fd.regulatory.moreThanFourGovImpersonationTracebacks,
            nonCooperativeVspByUsTelecom: fd.regulatory.nonCooperativeVspByUsTelecom,
            blockedFromNetworkLastTwoYears: fd.regulatory.blockedFromNetworkLastTwoYears,
            adverseJudgementUnlawfulRobocalls: fd.regulatory.adverseJudgementUnlawfulRobocalls,
            estimatedAsrPercent: parseFloat(String(fd.regulatory.estimatedAsrPercent).replace(',', '.')) || 0,
            estimatedAloc: parseFloat(String(fd.regulatory.estimatedAloc).replace(',', '.')) || 0,
            estimatedUnallocated404Percent: parseFloat(String(fd.regulatory.estimatedUnallocated404Percent).replace(',', '.')) || 0,
            estimatedCancel487Percent: parseFloat(String(fd.regulatory.estimatedCancel487Percent).replace(',', '.')) || 0,
            estimatedShortDurationPercent: parseFloat(String(fd.regulatory.estimatedShortDurationPercent).replace(',', '.')) || 0,
        },
        attestation: {
            officerName: fd.attestation.officerName,
            signatureText: fd.attestation.signatureText,
        },
    };

    // Show loading state
    const btn = document.getElementById('btnNext');
    btn.disabled = true;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Submitting…`;

    try {
        const res = await fetch(`${getApiBase()}/kyc/submit-public`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.message || data.title || `Server Error (${res.status})`);
        }

        // ✅ Success — show success screen, then full reload so a new applicant can start at step 1
        showSuccessScreen();
        setTimeout(() => window.location.reload(), 5000);

    } catch (err) {
        console.error('KYC Submission Error:', err);
        btn.disabled = false;
        updateButtons();
        showToast('❌ Submission failed: ' + err.message, 'error');
    }
}

function mapCorporateType(val) {
    const map = {
        'Sole Proprietorship': 1,
        'LLC': 2,
        'Corporation': 3,
        'Partnership': 4,
        'Non-Profit': 6,
    };
    return map[val] ?? 2;
}

function mapProductType(pid) {
    const map = {
        voip: 1,
        dialler_server: 2,
        inbound_did: 3,
        toll_free: 4,
        ai_bots: 5,
    };
    return map[pid] ?? 1;
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
            <p style="font-size:.85rem; color:#7a9589; margin:-1rem auto 1.5rem; max-width:400px;">
                This page will refresh in a few seconds so you can submit another application if needed.
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
    document.getElementById('btnNext').addEventListener('click', () => { void goNext(); });
    document.getElementById('btnBack').addEventListener('click', goPrev);

    // Initial render
    update(1);
});
