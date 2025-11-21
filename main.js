let currentLang = 'es';

function switchLanguage(lang) {
  // Asegurarse de que el objeto 'translations' exista (de translations.js)
  if (typeof translations === 'undefined') {
    console.error('Error: El archivo translations.js no se cargó correctamente.');
    return;
  }
  
  if (!lang || !translations[lang]) lang = 'es';
  currentLang = lang;
  const t = translations[lang];
  
  // Update HTML lang attribute
  document.documentElement.lang = lang;
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });
  
  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Save preference
  try {
    localStorage.setItem('preferredLang', lang);
  } catch (e) {
    console.warn('Could not save language preference to localStorage.', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // --- LANGUAGE ---
  // Load saved language preference
  let savedLang = 'es';
  try {
    savedLang = localStorage.getItem('preferredLang') || 'es';
  } catch (e) {
    console.warn('Could not read language preference from localStorage.', e);
  }
  switchLanguage(savedLang);
  
  // Language toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.dataset.lang);
    });
  });

  // --- Acordeón: solo una link-card abierta por sección ---
  const cards = document.querySelectorAll('.link-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // si clickeás en un <a> o su contenido, no colapsar
      if (e.target.closest('a')) return;

      const section = card.closest('.section');
      if (!section) return;

      section.querySelectorAll('.link-card.active').forEach(other => {
        if (other !== card) other.classList.remove('active');
      });

      card.classList.toggle('active');
    });
  });

  // --- Stack 3D de secciones (desktop) ---
  const sections = Array.from(document.querySelectorAll('.sections-container > .section'));
  const total = sections.length;
  let currentIndex = 0;

  function isDesktop() {
    return window.innerWidth >= 900;
  }

  function updateBodyHeight() {
    if (isDesktop() && total > 0) {
      document.body.style.height = (window.innerHeight * total) + 'px';
    } else {
      document.body.style.height = 'auto';
    }
  }

  function applyStack() {
    sections.forEach((sec, i) => {
      sec.classList.remove('is-main', 'is-prev', 'is-next');
      if (!isDesktop()) return;
      if (i === currentIndex) {
        sec.classList.add('is-main');
      } else if (i === currentIndex - 1) {
        sec.classList.add('is-prev');
      } else if (i === currentIndex + 1) {
        sec.classList.add('is-next');
      }
    });
  }

  function handleScroll() {
    if (!isDesktop() || total === 0) return;
    const viewport = window.innerHeight || 1;
    const newIndex = Math.round(window.scrollY / viewport);
    const clamped = Math.max(0, Math.min(total - 1, newIndex));
    if (clamped !== currentIndex) {
      currentIndex = clamped;
      applyStack();
    }
  }

  updateBodyHeight();
  applyStack();

  window.addEventListener('resize', () => {
    updateBodyHeight();
    applyStack();
  });

  window.addEventListener('scroll', handleScroll);

  // --- Toggles de donaciones ---
  const donationToggles = document.querySelectorAll('.donation-toggle');
  const donationBlocks = document.querySelectorAll('.donation-hidden');

  donationToggles.forEach(tog => {
    tog.addEventListener('click', () => {
      const targetId = tog.dataset.target;
      const target = document.getElementById(targetId);
      if (!target) return;

      const isOpen = target.style.display === 'block';

      // cerrar todos
      donationBlocks.forEach(block => {
        block.style.display = 'none';
      });

      // reabrir solo el clickeado si estaba cerrado
      if (!isOpen) {
        target.style.display = 'block';
      }
    });
  });
});