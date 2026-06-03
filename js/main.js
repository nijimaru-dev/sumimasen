/* Sumimasen — main.js */

/* ---- Mobile nav ---- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.site-nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navLinks.classList.toggle('is-open', !open);
  });

  /* Close on outside click */
  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    }
  });
}

/* ---- Phrase tabs ---- */
const tabs   = document.querySelectorAll('.tab-btn[data-tab]');
const cards  = document.querySelectorAll('.phrase-card[data-category]');

if (tabs.length) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.tab;

      tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');

      cards.forEach(card => {
        const visible = card.dataset.category === cat;
        card.classList.toggle('is-visible', visible);
      });
    });
  });
}

/* ---- Copy to clipboard ---- */
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-copy');
  if (!btn) return;

  const text = btn.dataset.copy;
  navigator.clipboard.writeText(text).then(() => {
    /* Use textContent — never innerHTML — to avoid any XSS surface */
    const iconSpan = btn.querySelector('span[aria-hidden]');
    const textNode = Array.from(btn.childNodes)
      .find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());

    const origIcon = iconSpan?.textContent ?? '📋';
    const origText = textNode?.textContent ?? ' Copy';

    if (iconSpan) iconSpan.textContent = '✓';
    if (textNode) textNode.textContent = ' Copied';
    btn.classList.add('is-copied');

    setTimeout(() => {
      if (iconSpan) iconSpan.textContent = origIcon;
      if (textNode) textNode.textContent = origText;
      btn.classList.remove('is-copied');
    }, 1800);
  });
});

/* ---- Web Speech API (voice) ---- */
if (!window.speechSynthesis) {
  document.documentElement.classList.add('no-speech');
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-speak');
  if (!btn) return;
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const text  = btn.dataset.speak;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang  = 'ja-JP';
  utter.rate  = 0.85;

  btn.classList.add('is-speaking');
  utter.onend = utter.onerror = () => btn.classList.remove('is-speaking');
  window.speechSynthesis.speak(utter);
});

/* ---- Favorites (localStorage — keyed by fixed data-fav ID, not DOM text) ---- */
const FAV_KEY = 'sumimasen_favs';

function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
  catch { return []; }
}

function saveFavs(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function applyFavState() {
  const favs = getFavs();
  document.querySelectorAll('.btn-fav[data-fav]').forEach(btn => {
    btn.classList.toggle('is-fav', favs.includes(btn.dataset.fav));
    btn.setAttribute('aria-pressed', String(favs.includes(btn.dataset.fav)));
  });
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-fav');
  if (!btn) return;

  const id   = btn.dataset.fav;
  const favs = getFavs();
  const idx  = favs.indexOf(id);

  if (idx === -1) favs.push(id);
  else favs.splice(idx, 1);

  saveFavs(favs);
  applyFavState();
});

applyFavState();

/* ---- Favourites panel ---- */
const favTrigger = document.getElementById('favs-trigger');
const favPanel   = document.getElementById('favs-panel');

function buildFavPanel() {
  if (!favPanel) return;
  const favs    = getFavs();
  const list    = favPanel.querySelector('.favs-panel__list');
  const empty   = favPanel.querySelector('.favs-panel__empty');
  const counter = document.querySelectorAll('.favs-trigger__count');

  counter.forEach(el => { el.textContent = favs.length; });
  if (favTrigger) favTrigger.hidden = favs.length === 0;

  if (!list) return;
  list.innerHTML = '';

  if (favs.length === 0) {
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  favs.forEach(id => {
    const card = document.querySelector(`.phrase-card[data-id="${id}"]`);
    if (!card) return;
    const jp  = card.querySelector('.phrase-card__japanese')?.textContent ?? '';
    const en  = card.querySelector('.phrase-card__english')?.textContent ?? '';
    const spk = card.querySelector('.btn-speak')?.dataset.speak ?? jp;

    const item = document.createElement('div');
    item.className = 'fav-item';

    const jpDiv = document.createElement('div');
    jpDiv.className = 'fav-item__jp';
    jpDiv.setAttribute('translate', 'no');
    jpDiv.setAttribute('lang', 'ja');
    jpDiv.textContent = jp;
    const enSpan = document.createElement('span');
    enSpan.className = 'fav-item__en';
    enSpan.textContent = en;
    jpDiv.appendChild(enSpan);

    const acts = document.createElement('div');
    acts.className = 'fav-item__actions';

    if (window.speechSynthesis) {
      const spkBtn = document.createElement('button');
      spkBtn.className = 'fav-item__btn';
      spkBtn.setAttribute('aria-label', 'Hear');
      spkBtn.dataset.speak = spk;
      spkBtn.textContent = '🔊';
      acts.appendChild(spkBtn);
    }

    const rmBtn = document.createElement('button');
    rmBtn.className = 'fav-item__btn fav-item__btn--remove';
    rmBtn.setAttribute('aria-label', 'Remove');
    rmBtn.dataset.remove = id;
    rmBtn.textContent = '✕';
    acts.appendChild(rmBtn);

    item.appendChild(jpDiv);
    item.appendChild(acts);
    list.appendChild(item);
  });
}

if (favTrigger) {
  favTrigger.addEventListener('click', () => {
    buildFavPanel();
    if (favPanel) favPanel.hidden = false;
  });
}

if (favPanel) {
  favPanel.addEventListener('click', e => {
    if (e.target.closest('.favs-panel__scrim') || e.target.closest('.favs-panel__close')) {
      favPanel.hidden = true;
      return;
    }
    const spkBtn = e.target.closest('[data-speak]');
    if (spkBtn && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(spkBtn.dataset.speak);
      utter.lang = 'ja-JP'; utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
      return;
    }
    const rmBtn = e.target.closest('[data-remove]');
    if (rmBtn) {
      const id   = rmBtn.dataset.remove;
      saveFavs(getFavs().filter(f => f !== id));
      applyFavState();
      buildFavPanel();
      return;
    }
    if (e.target.closest('.favs-clear-btn')) {
      saveFavs([]);
      applyFavState();
      buildFavPanel();
      favPanel.hidden = true;
    }
  });
}

buildFavPanel();

/* ---- Dark mode toggle ---- */
const THEME_KEY = 'sumimasen_theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    const isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    const moon = btn.querySelector('.icon-moon');
    const sun  = btn.querySelector('.icon-sun');
    if (moon) moon.style.display = isDark ? 'none' : '';
    if (sun)  sun.style.display  = isDark ? '' : 'none';
  });
}

(function initTheme() {
  const saved  = localStorage.getItem(THEME_KEY);
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || system);
})();

document.addEventListener('click', e => {
  const btn = e.target.closest('.theme-toggle');
  if (!btn) return;
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

/* ---- PWA service worker ---- */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
