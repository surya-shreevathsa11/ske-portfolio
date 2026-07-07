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

function lockScroll() {
  document.body.classList.add('consent-locked');
}

function unlockScroll() {
  document.body.classList.remove('consent-locked');
}

function createConsentUI() {
  const root = document.createElement('div');
  root.id = 'consentRoot';
  root.innerHTML = `
    <div class="consent-modal" id="consentModal" role="dialog" aria-modal="true" aria-labelledby="consentTitle" aria-describedby="consentDesc" hidden>
      <div class="consent-modal-panel">
        <span class="eyebrow eyebrow-light">Before you continue</span>
        <h2 class="consent-title" id="consentTitle">Terms &amp; Privacy</h2>
        <p class="consent-desc" id="consentDesc">
          We use this website to share our services and help you get in touch. By continuing, you agree to our
          <a href="/terms" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
          and
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>
        <div class="consent-actions">
          <button type="button" class="consent-btn consent-btn-accept" id="consentAccept">Accept</button>
          <button type="button" class="consent-btn consent-btn-decline" id="consentDecline">Decline</button>
        </div>
      </div>
    </div>

    <div class="consent-blocker" id="consentBlocker" role="dialog" aria-modal="true" aria-labelledby="consentBlockerTitle" hidden>
      <div class="consent-blocker-panel">
        <span class="eyebrow eyebrow-light">Access restricted</span>
        <h2 class="consent-title" id="consentBlockerTitle">You declined our terms</h2>
        <p class="consent-desc">
          You chose not to accept our
          <a href="/terms" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
          and
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
          To use this website, please accept them or leave the site.
        </p>
        <div class="consent-actions">
          <button type="button" class="consent-btn consent-btn-accept" id="consentReaccept">Accept &amp; Continue</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  const modal = document.getElementById('consentModal');
  const blocker = document.getElementById('consentBlocker');
  const acceptBtn = document.getElementById('consentAccept');
  const declineBtn = document.getElementById('consentDecline');
  const reacceptBtn = document.getElementById('consentReaccept');

  const showModal = () => {
    modal.hidden = false;
    blocker.hidden = true;
    lockScroll();
    acceptBtn.focus();
  };

  const showBlocker = () => {
    modal.hidden = true;
    blocker.hidden = false;
    lockScroll();
    reacceptBtn.focus();
  };

  const hideAll = () => {
    modal.hidden = true;
    blocker.hidden = true;
    unlockScroll();
  };

  const accept = () => {
    setConsent('accepted');
    hideAll();
  };

  const decline = () => {
    setConsent('declined');
    showBlocker();
  };

  acceptBtn.addEventListener('click', accept);
  reacceptBtn.addEventListener('click', accept);
  declineBtn.addEventListener('click', decline);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      decline();
    }
  });

  return { showModal, showBlocker, hideAll };
}

export function initConsent() {
  const status = getConsent();
  if (status === 'accepted') return;

  const ui = createConsentUI();

  if (status === 'declined') {
    ui.showBlocker();
  } else {
    ui.showModal();
  }
}
