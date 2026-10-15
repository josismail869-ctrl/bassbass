const toast = document.querySelector('#toast');
const backdrop = document.querySelector('#modal-backdrop');
const modalTitle = document.querySelector('#modal-title');
const modalContent = document.querySelector('#modal-content');
const modalClose = document.querySelector('#modal-close');
let toastTimer;

function announce(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

function isLoggedIn() { return Boolean(localStorage.getItem('pv_demo_user')); }
function closeModal() { backdrop.hidden = true; document.body.classList.remove('modal-open'); }
function openModal(title, html) {
  modalTitle.textContent = title;
  modalContent.innerHTML = html;
  backdrop.hidden = false;
  document.body.classList.add('modal-open');
  modalContent.querySelector('input')?.focus();
}
function authForm(mode = 'login') {
  if (mode === 'forgot') return `<form class="modal-form" id="forgot-form"><label>Email address<input type="email" id="forgot-email" required placeholder="you@example.com"></label><button class="modal-primary" type="submit">Send reset instructions</button><button class="modal-link" type="button" data-auth="login">Back to Login</button></form>`;
  return `<form class="modal-form" id="login-form"><label>Email address<input type="email" id="login-email" required placeholder="you@example.com"></label><label>Password<input type="password" id="login-password" required minlength="6" placeholder="At least 6 characters"></label><button class="modal-primary" type="submit">Login</button><button class="modal-link" type="button" data-auth="forgot">Forgot password?</button><p class="modal-hint">Demo check: enter any valid email and a 6+ character password.</p></form>`;
}
function openLogin() {
  if (isLoggedIn()) {
    openModal('Account', `<p class="modal-copy">You are signed in as <strong>${localStorage.getItem('pv_demo_user')}</strong>.</p><button class="modal-primary" id="logout-button">Logout</button>`);
    document.querySelector('#logout-button').addEventListener('click', () => { localStorage.removeItem('pv_demo_user'); closeModal(); announce('You have been logged out successfully.'); });
    return;
  }
  openModal('Login', authForm());
}
function openPrediction(type) {
  if (type === 'VIP Prediction' && !isLoggedIn()) {
    openModal('VIP access', `<p class="modal-copy">VIP Prediction is available after login. Sign in to continue.</p><button class="modal-primary" data-auth="login">Login to continue</button>`);
    return;
  }
  const label = type === 'VIP Prediction' ? 'VIP Prediction' : 'Free Prediction';
  openModal(label, `<div class="prediction-card"><span class="prediction-badge">${type === 'VIP Prediction' ? 'VIP ACCESS' : 'FREE TODAY'}</span><strong>${type === 'VIP Prediction' ? 'Premium insight room is ready.' : 'Today’s free prediction room is ready.'}</strong><p>Choose a country room to continue and view the latest update.</p><select id="prediction-country"><option>Malaysia</option><option>Thailand</option><option>Saudi Arabia</option><option>UAE</option><option>Qatar</option><option>Oman</option><option>Kuwait</option><option>Bahrain</option></select><button class="modal-primary" id="prediction-open">Open prediction room</button></div>`);
  document.querySelector('#prediction-open').addEventListener('click', () => { const country = document.querySelector('#prediction-country').value; closeModal(); announce(`${label} opened for ${country}.`); });
}
function openOption(action) {
  const content = {
    Results: ['Results', 'Latest verified updates are available here.', 'Choose a country room below to continue.'],
    Membership: ['Membership', 'Membership options are ready.', 'Select a plan to unlock member benefits and updates.'],
    Community: ['Community', 'Welcome to the Probashi Voice community.', 'Connect with members and stay updated through the official channels.']
  }[action];
  if (!content) return announce(`${action} is ready for your journey.`);
  openModal(content[0], `<p class="modal-copy"><strong>${content[1]}</strong></p><p class="modal-hint">${content[2]}</p><select id="option-country"><option>Malaysia</option><option>Thailand</option><option>Saudi Arabia</option><option>UAE</option><option>Qatar</option><option>Oman</option><option>Kuwait</option><option>Bahrain</option></select><button class="modal-primary" id="option-continue">Continue</button>`);
  document.querySelector('#option-continue').addEventListener('click', () => { const country = document.querySelector('#option-country').value; closeModal(); announce(`${action} opened for ${country}.`); });
}
function handleAction(action) {
  if (action === 'Login') return openLogin();
  if (action === 'Free Prediction' || action === 'VIP Prediction') return openPrediction(action);
  return openOption(action);
}

document.querySelectorAll('[data-action]').forEach((control) => control.addEventListener('click', () => handleAction(control.dataset.action)));
document.querySelectorAll('[data-room]').forEach((control) => control.addEventListener('click', () => {
  const country = control.dataset.room;
  openModal(`${country} room`, `<p class="modal-copy"><strong>${country}</strong> room is active and ready.</p><p class="modal-hint">Work · Study · Future${country === 'Saudi Arabia' ? ' · Hajj' : ''}</p><button class="modal-primary" id="room-continue">Continue to ${country}</button>`);
  document.querySelector('#room-continue').addEventListener('click', () => { closeModal(); announce(`${country} room selected — opportunities are coming your way.`); });
}));

document.addEventListener('click', (event) => {
  const authButton = event.target.closest('[data-auth]');
  if (authButton) {
    if (authButton.dataset.auth === 'forgot') openModal('Forgot password', authForm('forgot'));
    else openModal('Login', authForm());
  }
});
document.addEventListener('submit', (event) => {
  if (event.target.id === 'login-form') {
    event.preventDefault();
    const email = document.querySelector('#login-email').value.trim();
    localStorage.setItem('pv_demo_user', email);
    closeModal();
    announce(`Login successful. Welcome back, ${email}.`);
  }
  if (event.target.id === 'forgot-form') {
    event.preventDefault();
    closeModal();
    announce('If the email is registered, reset instructions have been requested.');
  }
});

function wireSearch(formSelector, inputSelector, resultSelector) {
  const form = document.querySelector(formSelector);
  const input = document.querySelector(inputSelector);
  const result = resultSelector ? document.querySelector(resultSelector) : null;
  if (!form || !input) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) { if (result) result.textContent = 'Enter a number to begin your search.'; announce('Please enter a number first.'); input.focus(); return; }
    if (result) result.textContent = 'Searching trusted global listings…';
    announce(`Searching for ${value}…`);
    window.setTimeout(() => { const message = `Your search for “${value}” is queued — fresh results will appear here.`; if (result) result.textContent = message; announce('Search request received.'); }, 650);
  });
}
wireSearch('#reference-search-form', '#reference-search-input');
wireSearch('#mobile-search-form', '#mobile-search-input', '#mobile-search-result');

modalClose?.addEventListener('click', closeModal);
backdrop?.addEventListener('click', (event) => { if (event.target === backdrop) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !backdrop.hidden) closeModal(); });

const menuToggle = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
menuToggle?.addEventListener('click', () => { const open = mobileNav.classList.toggle('is-open'); menuToggle.setAttribute('aria-expanded', String(open)); });
document.querySelectorAll('.mobile-nav button').forEach((button) => button.addEventListener('click', () => { mobileNav.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); }));
