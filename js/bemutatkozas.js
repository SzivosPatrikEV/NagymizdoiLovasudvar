(() => {
  const loader = document.querySelector('.page-loader');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Branded intro loader
  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('done'), 450);
  });
  // Fallback in case load event already fired
  if (document.readyState === 'complete') setTimeout(() => loader?.classList.add('done'), 450);

  // Sticky header and subtle scroll response
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 35);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile navigation
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.classList.remove('active');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  // Reveal elements as they enter the viewport
  const revealTargets = document.querySelectorAll('.reveal, .service-card, .feature-tile');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    revealTargets.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  // Gentle parallax on hero background (disabled on small screens / reduced motion)
  const hero = document.querySelector('.hero-image');
  if (hero && !prefersReduced && window.innerWidth > 720) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY * 0.16, 100);
      hero.style.backgroundPosition = `center calc(48% + ${y}px)`;
    }, { passive: true });
  }

  // Gallery lightbox
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const close = () => {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector('img')?.alt || 'Galériakép';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }));
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', close);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Current year
  const year = document.querySelector('.year');
  if (year) year.textContent = new Date().getFullYear();
})();