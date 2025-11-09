const screenContainer = document.getElementById('screen-container');
const screens = Array.from(screenContainer.querySelectorAll('.screen'));
const bottomNav = document.querySelector('.bottom-nav');
const sideMenu = document.getElementById('side-menu');
const backdrop = document.getElementById('backdrop');
let historyStack = ['welcome'];

function showScreen(id, pushHistory = true) {
  const next = screens.find((screen) => screen.dataset.screen === id);
  if (!next) return;

  const current = historyStack[historyStack.length - 1];
  if (current === id) {
    pushHistory = false;
  }

  screens.forEach((screen) => screen.classList.remove('active'));
  next.classList.add('active');

  document
    .querySelectorAll('.nav-item')
    .forEach((btn) => btn.classList.toggle('active', btn.dataset.target === id));

  if (pushHistory) {
    historyStack.push(id);
  }
}

function goBack() {
  if (historyStack.length <= 1) return;
  historyStack.pop();
  const previous = historyStack[historyStack.length - 1];
  showScreen(previous, false);
}

function toggleMenu(forceState) {
  const shouldOpen =
    typeof forceState === 'boolean' ? forceState : !sideMenu.classList.contains('open');

  if (shouldOpen) {
    sideMenu.classList.add('open');
    backdrop.hidden = false;
    sideMenu.setAttribute('aria-hidden', 'false');
  } else {
    sideMenu.classList.remove('open');
    backdrop.hidden = true;
    sideMenu.setAttribute('aria-hidden', 'true');
  }
}

function updateRangeValue(input) {
  const value = input.value;
  const unit = input.dataset.unit ? ` ${input.dataset.unit}` : '%';
  const holder = input.closest('.slider-card, .form-field');
  const span = holder?.querySelector('.range-value');
  if (span) {
    span.textContent = `${value}${unit}`;
  }
}

function handleAction(target) {
  const action = target.dataset.action;
  if (!action) return;

  if (action === 'go') {
    const screenId = target.dataset.target;
    if (screenId) showScreen(screenId);
    toggleMenu(false);
    return;
  }

  if (action === 'back') {
    goBack();
    return;
  }

  if (action === 'toggle-menu') {
    toggleMenu();
    return;
  }

  if (action === 'toggle-alarm') {
    const alarmState = document.getElementById('alarm-state');
    const isActive = alarmState.textContent.trim() === 'Activada';
    alarmState.textContent = isActive ? 'Desactivada' : 'Activada';
    return;
  }
}

screenContainer.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (target) handleAction(target);
});

bottomNav.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (target) handleAction(target);
});

sideMenu.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (target) handleAction(target);
});

backdrop.addEventListener('click', () => toggleMenu(false));

document.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  if (action === 'back') {
    event.preventDefault();
  }
});

screenContainer.addEventListener('input', (event) => {
  const target = event.target;
  if (target.matches("input[type='range']")) {
    updateRangeValue(target);
  }
});

const rangeInputs = screenContainer.querySelectorAll("input[type='range']");
rangeInputs.forEach(updateRangeValue);

const tempDisplay = document.getElementById('target-temp');
const currentTemp = document.getElementById('current-temp');

document.querySelectorAll('[data-temp-change]').forEach((button) => {
  button.addEventListener('click', () => {
    const delta = parseFloat(button.dataset.tempChange);
    const next = Math.max(16, Math.min(28, parseFloat(tempDisplay.textContent) + delta));
    tempDisplay.textContent = next.toFixed(1);
    currentTemp.textContent = (next - 1.5).toFixed(1);
  });
});

const chips = document.querySelectorAll('.chip');
chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
  })
);

const palette = document.getElementById('color-palette');
const preview = document.querySelector('#color-preview .preview-circle');

if (palette && preview) {
  palette.addEventListener('click', (event) => {
    const swatch = event.target.closest('button[data-color]');
    if (!swatch) return;
    palette.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
    swatch.classList.add('active');
    preview.style.background = swatch.style.background || swatch.dataset.color;
  });
}

showScreen('welcome', false);
