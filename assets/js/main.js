(function () {
  'use strict';

  const fmt = (n) => new Intl.NumberFormat('fr-FR').format(n);

  /* ---------------------------------------------------------------- Toast */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3800);
  }

  /* ---------------------------------------------------------------- Modal */
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML =
    '<div class="modal-backdrop" data-close-modal></div>' +
    '<div class="modal-card"><div class="modal-head p-6 text-white"></div>' +
    '<div class="modal-body p-6 text-on-surface"></div>' +
    '<div class="px-6 pb-6 flex justify-end"><button type="button" data-close-modal class="px-6 py-3 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold">Fermer</button></div></div>';
  document.body.appendChild(modal);
  let lastFocus = null;

  function openModal({ head, body, color }) {
    lastFocus = document.activeElement;
    const h = modal.querySelector('.modal-head');
    h.style.background = color || '#003820';
    h.innerHTML = head;
    modal.querySelector('.modal-body').innerHTML = body;
    modal.hidden = false;
    modal.querySelector('button[data-close-modal]').focus();
  }
  function closeModal() {
    modal.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-modal]')) closeModal();
  });

  /* ---------------------------------------------------------- Mobile menu */
  const menu = document.getElementById('mobile-menu');
  const menuToggle = document.getElementById('menu-toggle');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('hidden', !open);
    document.body.classList.toggle('menu-open', open);
    if (menuToggle) menuToggle.setAttribute('aria-expanded', String(open));
  }
  if (menuToggle) menuToggle.addEventListener('click', () => setMenu(true));
  if (menu) {
    menu.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-menu]') || e.target.closest('a[href^="#"]')) setMenu(false);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeModal();
    setMenu(false);
  });

  /* ------------------------------------- Links to pages not yet designed */
  const pageNames = {
    'our-team': 'Notre équipe',
    'sdg-cote-divoire': "Rapport ODD Côte d'Ivoire",
    'sdg-africa': 'Observatoire Panafricain',
    'services-and-advisory': 'Études & Conseil',
    'legal-notice': 'Mentions légales',
    'privacy-policy': 'Politique de confidentialité',
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (id && document.getElementById(id)) return; // real on-page anchor
    e.preventDefault();
    const label = a.cloneNode(true);
    label.querySelectorAll('.material-symbols-outlined, img').forEach((n) => n.remove());
    const name = pageNames[id] || label.textContent.replace(/\s+/g, ' ').trim();
    toast(`« ${name} » — page bientôt disponible.`);
  });

  /* -------------------------------------------------------- Language pills */
  document.querySelectorAll('[data-lang="en"]').forEach((btn) =>
    btn.addEventListener('click', () => toast('English version coming soon — version anglaise en préparation.'))
  );

  /* -------------------------------------------------------------- Donation */
  const tierButtons = document.querySelectorAll('.donation-tier');
  const freqButtons = document.querySelectorAll('.freq-btn');
  const customInput = document.getElementById('custom-donation-input');
  const displaySpan = document.getElementById('selected-amount-display');
  const confirmBtn = document.getElementById('confirm-donation-btn');
  const SELECTED = ['ring-2', 'ring-secondary-container', 'bg-secondary-container/15'];
  let amount = 25000;
  let freq = 'once';

  function updateDisplay() {
    if (displaySpan) displaySpan.textContent = `${fmt(amount)} FCFA${freq === 'monthly' ? '/mois' : ''}`;
  }
  function clearTiers() {
    tierButtons.forEach((b) => {
      b.classList.remove(...SELECTED);
      b.classList.add('bg-surface-card');
      b.setAttribute('aria-pressed', 'false');
    });
  }

  tierButtons.forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.classList.contains('ring-2') ? 'true' : 'false');
    btn.addEventListener('click', () => {
      clearTiers();
      btn.classList.add(...SELECTED);
      btn.classList.remove('bg-surface-card');
      btn.setAttribute('aria-pressed', 'true');
      amount = parseInt(btn.dataset.amount, 10);
      if (customInput) customInput.value = '';
      updateDisplay();
    });
  });

  if (customInput) {
    customInput.min = '500';
    customInput.step = '500';
    customInput.addEventListener('input', () => {
      const val = parseInt(customInput.value, 10);
      if (!isNaN(val) && val > 0) {
        clearTiers();
        amount = val;
        updateDisplay();
      }
    });
  }

  freqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      freqButtons.forEach((b) => {
        b.classList.remove('bg-primary-container', 'text-on-primary', 'shadow-sm');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.add('bg-primary-container', 'text-on-primary', 'shadow-sm');
      btn.classList.remove('text-on-surface-variant');
      freq = btn.dataset.freq;
      updateDisplay();
    });
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (amount < 500) {
        toast('Le montant minimum est de 500 FCFA.');
        if (customInput) customInput.focus();
        return;
      }
      const eur = (amount / 655.957).toFixed(2).replace('.', ',');
      openModal({
        head: '<div class="font-label-sm text-label-sm uppercase tracking-wider opacity-80">Récapitulatif du don</div>' +
          `<div class="font-headline-lg text-headline-lg font-bold mt-1">${fmt(amount)} FCFA</div>` +
          `<div class="font-body-sm text-body-sm opacity-80">≈ ${eur} € · ${freq === 'monthly' ? 'Don mensuel' : 'Don ponctuel'}</div>`,
        body: '<p class="font-body-md text-body-md">Merci pour votre générosité ! Vous allez être redirigé·e vers notre passerelle de paiement sécurisée.</p>' +
          '<p class="font-body-sm text-body-sm text-text-muted mt-3">Modes acceptés : Orange Money, MTN MoMo, Wave, Moov Money, Visa / Mastercard, PayPal.</p>' +
          '<p class="font-body-sm text-body-sm text-secondary mt-3 font-semibold">Version de démonstration : la passerelle de paiement n\'est pas encore connectée.</p>',
      });
    });
  }

  /* --------------------------------------------------------- Filter chips */
  function setupFilter(section, activeOn, activeOff) {
    if (!section) return;
    const cards = section.querySelectorAll('[data-tags]');
    const buttons = [...section.querySelectorAll('button')].filter((b) => !b.closest('[data-tags]'));
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const label = btn.textContent.trim();
        buttons.forEach((b) => {
          b.classList.remove(...activeOn);
          b.classList.add(...activeOff);
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.remove(...activeOff);
        btn.classList.add(...activeOn);
        btn.setAttribute('aria-pressed', 'true');
        cards.forEach((card) => {
          const show = label === 'Tous' || card.dataset.tags.split('|').includes(label);
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  }
  setupFilter(document.getElementById('publications'), ['bg-primary', 'text-on-primary'], ['bg-surface-card', 'text-on-surface-variant']);
  setupFilter(document.getElementById('agenda'), ['bg-primary', 'text-on-primary'], ['bg-surface-container', 'text-on-surface-variant']);

  /* --------------------------------------------------- Event registration */
  document.querySelectorAll('#agenda [data-tags] button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.closest('[data-tags]').querySelector('h3, h4');
      openModal({
        head: '<div class="font-label-sm text-label-sm uppercase tracking-wider opacity-80">Inscription</div>' +
          `<div class="font-headline-sm text-headline-sm font-bold mt-1">${title ? title.textContent.trim() : ''}</div>`,
        body: '<form class="flex flex-col gap-3" data-form="event" novalidate>' +
          '<label class="font-label-sm text-label-sm text-text-muted">Nom complet<input name="name" required class="mt-1 w-full px-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container"/></label>' +
          '<label class="font-label-sm text-label-sm text-text-muted">E-mail<input name="email" type="email" required class="mt-1 w-full px-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container"/></label>' +
          '<button type="submit" class="mt-2 py-3 rounded-full bg-secondary-container hover:bg-cta-hover text-text-primary font-label-md text-label-md font-bold">Confirmer mon inscription</button></form>',
      });
    });
  });

  /* ---------------------------------------------------------------- Forms */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const formMessages = {
    barometre: 'Merci ! Le Baromètre ODD 2024 vous sera envoyé par e-mail.',
    newsletter: 'Inscription confirmée — à bientôt dans votre boîte mail !',
    event: 'Inscription enregistrée. Un e-mail de confirmation va suivre.',
  };
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    const email = form.querySelector('input[type="email"]');
    const missing = [...form.querySelectorAll('input[required]')].find((i) => !i.value.trim());
    if (missing) {
      toast('Merci de remplir tous les champs.');
      missing.focus();
      return;
    }
    if (email && !EMAIL_RE.test(email.value.trim())) {
      toast('Adresse e-mail invalide.');
      email.focus();
      return;
    }
    form.reset();
    if (form.dataset.form === 'event') closeModal();
    toast(formMessages[form.dataset.form]);
  });

  /* ------------------------------------------------------------ SDG tiles */
  const sdgTargets = [
    "Éliminer la pauvreté sous toutes ses formes et partout dans le monde.",
    "Éliminer la faim, assurer la sécurité alimentaire, améliorer la nutrition et promouvoir l'agriculture durable.",
    "Permettre à tous de vivre en bonne santé et promouvoir le bien-être de tous à tout âge.",
    "Assurer l'accès de tous à une éducation de qualité, sur un pied d'égalité, et promouvoir les possibilités d'apprentissage tout au long de la vie.",
    "Parvenir à l'égalité des sexes et autonomiser toutes les femmes et les filles.",
    "Garantir l'accès de tous à l'eau et à l'assainissement et assurer une gestion durable des ressources en eau.",
    "Garantir l'accès de tous à des services énergétiques fiables, durables et modernes, à un coût abordable.",
    "Promouvoir une croissance économique soutenue, partagée et durable, le plein emploi productif et un travail décent pour tous.",
    "Bâtir une infrastructure résiliente, promouvoir une industrialisation durable qui profite à tous et encourager l'innovation.",
    "Réduire les inégalités dans les pays et d'un pays à l'autre.",
    "Faire en sorte que les villes et les établissements humains soient ouverts à tous, sûrs, résilients et durables.",
    "Établir des modes de consommation et de production durables.",
    "Prendre d'urgence des mesures pour lutter contre les changements climatiques et leurs répercussions.",
    "Conserver et exploiter de manière durable les océans, les mers et les ressources marines.",
    "Préserver et restaurer les écosystèmes terrestres, gérer durablement les forêts, lutter contre la désertification et enrayer la perte de biodiversité.",
    "Promouvoir l'avènement de sociétés pacifiques et ouvertes, assurer l'accès de tous à la justice et mettre en place des institutions efficaces.",
    "Renforcer les moyens de mettre en œuvre le Partenariat mondial pour le développement durable et le revitaliser.",
  ];
  const odd = document.getElementById('odd');
  if (odd) {
    odd.querySelectorAll('div[style*="background-color"]').forEach((tile) => {
      const spans = tile.querySelectorAll('span');
      const num = parseInt(spans[0] && spans[0].textContent, 10);
      if (!num || !sdgTargets[num - 1]) return;
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');
      const open = () =>
        openModal({
          color: tile.style.backgroundColor,
          head: `<div class="font-label-sm text-label-sm uppercase tracking-wider opacity-90">Objectif ${String(num).padStart(2, '0')}</div>` +
            `<div class="font-headline-md text-headline-md font-bold mt-1">${spans[1].textContent.trim()}</div>`,
          body: `<p class="font-body-md text-body-md">${sdgTargets[num - 1]}</p>` +
            '<p class="font-body-sm text-body-sm text-text-muted mt-3">Goodwill Afrika suit cet objectif à travers ses baromètres territoriaux en Côte d\'Ivoire et en Afrique de l\'Ouest.</p>',
        });
      tile.addEventListener('click', open);
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  }

  /* --------------------------------------------------- Header scroll shade */
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => header.classList.toggle('shadow-md', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
