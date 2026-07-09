const STORAGE_KEY = 'ske-legal-consent';

function getConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* ignore quota / private mode */
  }
}

function createConsentUI() {
  const root = document.createElement('div');
  root.id = 'consentRoot';
  root.innerHTML = `
    <section class="consent-banner" id="consentBanner" aria-label="Terms and privacy notice" hidden>
      <div class="consent-banner-inner">
        <p class="consent-banner-text">
          By using this website, you agree to our
          <a href="/terms" target="_blank" rel="noopener noreferrer">Terms</a>
          and
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>
        <div class="consent-actions">
          <button type="button" class="consent-btn consent-btn-accept" id="consentAccept">Accept</button>
          <button type="button" class="consent-btn consent-btn-decline" id="consentDecline">Decline</button>
        </div>
      </div>
    </section>
  `;

  document.body.appendChild(root);

  const banner = document.getElementById('consentBanner');
  const acceptBtn = document.getElementById('consentAccept');
  const declineBtn = document.getElementById('consentDecline');

  const show = () => {
    banner.hidden = false;
  };

  const hide = () => {
    banner.hidden = true;
  };

  const accept = () => {
    setConsent('accepted');
    hide();
  };

  const decline = () => {
    setConsent('declined');
    hide();
  };

  acceptBtn.addEventListener('click', accept);
  declineBtn.addEventListener('click', decline);

  return { show, hide };
}

export function initConsent() {
  const status = getConsent();
  if (status === 'accepted' || status === 'declined') return;

  const ui = createConsentUI();
  window.setTimeout(() => {
    const latest = getConsent();
    if (latest === 'accepted' || latest === 'declined') return;
    ui.show();
  }, 3000);
}
