/* ==========================================================================
   Sunkiran Dimex - About Page Interactive & Motion Scripts
   GSAP ScrollTrigger, Parallax Physics, Counter Animations & Mobile Drawer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initParallaxEffects();
  initFounderParallax();
  initFounderMetricsCountUp();
  initScrollReveals();
});

/**
 * Sticky Header Scroll State
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Drawer Menu with Accessibility & Focus Trap
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn, #mobile-menu-btn');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay, #mobile-nav-backdrop');
  const drawer = document.querySelector('#mobile-nav-drawer, .mobile-nav-drawer');
  const closeBtn = document.querySelector('.drawer-close-btn, #mobile-drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link, .mobile-nav-link, .mobile-drawer-footer a');

  if (!menuBtn || !drawer) return;

  const openMenu = () => {
    if (drawerOverlay) drawerOverlay.classList.add('active');
    drawer.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeMenu = () => {
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    drawer.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuBtn.focus();
  };

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeMenu);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Subtle pointer parallax on hero floating cards for desktop
 */
function initParallaxEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1024) return;

  const heroRight = document.querySelector('.hero-right');
  const metaBadge = document.querySelector('.floating-meta-badge');
  const metricsCard = document.querySelector('.floating-metrics-card');

  if (!heroRight) return;

  heroRight.addEventListener('mousemove', (e) => {
    const rect = heroRight.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (metaBadge) {
      metaBadge.style.transform = `translate(${x * 16}px, ${y * 16}px)`;
    }
    if (metricsCard) {
      metricsCard.style.transform = `translateY(-50%) translate(${x * -20}px, ${y * -20}px)`;
    }
  });

  heroRight.addEventListener('mouseleave', () => {
    if (metaBadge) metaBadge.style.transform = '';
    if (metricsCard) metricsCard.style.transform = '';
  });
}

/**
 * Desktop Mouse Parallax for Layered Founder Portrait Panels
 */
function initFounderParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1024) return;

  const visualWrap = document.querySelector('.founder-visual-wrap');
  const panel1 = document.querySelector('.founder-bg-panel.panel-1');
  const panel2 = document.querySelector('.founder-bg-panel.panel-2');
  const badge = document.querySelector('.founder-glass-badge');

  if (!visualWrap) return;

  visualWrap.addEventListener('mousemove', (e) => {
    const rect = visualWrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (panel1) {
      panel1.style.transform = `translate(${x * -14}px, ${y * -12}px)`;
    }
    if (panel2) {
      panel2.style.transform = `rotate(5deg) translate(${x * 18}px, ${y * 16}px)`;
    }
    if (badge) {
      badge.style.transform = `translate(${x * -10}px, ${y * -8}px)`;
    }
  });

  visualWrap.addEventListener('mouseleave', () => {
    if (panel1) panel1.style.transform = '';
    if (panel2) panel2.style.transform = 'rotate(5deg)';
    if (badge) badge.style.transform = '';
  });
}

/**
 * Animated Counter for Founder Metrics
 */
function initFounderMetricsCountUp() {
  const metricVals = document.querySelectorAll('.founder-metric-card .metric-stat-val');
  if (!metricVals.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    metricVals.forEach(valEl => {
      const target = parseInt(valEl.getAttribute('data-target'), 10);
      const suffix = valEl.getAttribute('data-suffix') || '';
      const isComma = valEl.getAttribute('data-format') === 'comma';

      if (isNaN(target)) return;

      let start = 0;
      const duration = 1400; // ms
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(easeProgress * target);

        let formatted = currentVal.toString();
        if (isComma) {
          formatted = currentVal.toLocaleString('en-US');
        }

        valEl.textContent = formatted + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          valEl.textContent = (isComma ? target.toLocaleString('en-US') : target) + suffix;
        }
      };

      requestAnimationFrame(step);
    });
  };

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '.founder-metrics-grid',
      start: 'top 85%',
      onEnter: animateCounters,
      once: true
    });
  } else {
    animateCounters();
  }
}

/**
 * Scroll Triggered Entrance Animations
 */
function initScrollReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth <= 768;

    // Hero entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
    heroTl
      .from('.hero-left .pill-eyebrow', { opacity: 0, y: 20, duration: 0.5 })
      .from('.hero-h1', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
      .from('.hero-subheadline', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
      .from('.hero-body', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
      .from('.fact-card', { opacity: 0, y: 20, stagger: 0.12, duration: 0.6 }, '-=0.3')
      .from('.hero-right', { opacity: 0, scale: 0.95, duration: 0.9 }, '-=0.8')
      .from('.floating-meta-badge', { opacity: 0, scale: 0.8, duration: 0.6 }, '-=0.4')
      .from('.floating-metrics-card', { opacity: 0, x: isMobile ? 0 : 30, y: isMobile ? 20 : 0, duration: 0.6 }, '-=0.4')
      .from('.hero-annotation-wrap', { opacity: 0, y: -15, duration: 0.6 }, '-=0.3');

    // Who We Are entrance
    gsap.from('.who-visual-wrap', {
      scrollTrigger: {
        trigger: '.who-we-are-section',
        start: 'top 75%',
      },
      opacity: 0,
      x: isMobile ? 0 : -40,
      y: isMobile ? 30 : 0,
      duration: 0.9,
      ease: 'power3.out'
    });

    gsap.from('.who-content', {
      scrollTrigger: {
        trigger: '.who-we-are-section',
        start: 'top 75%',
      },
      opacity: 0,
      x: isMobile ? 0 : 40,
      y: isMobile ? 30 : 0,
      duration: 0.9,
      ease: 'power3.out'
    });

    // Founders Section entrance
    gsap.from('.founder-visual-wrap', {
      scrollTrigger: {
        trigger: '.founders-section',
        start: 'top 78%',
      },
      opacity: 0,
      y: 35,
      scale: 0.96,
      duration: 0.85,
      ease: 'power3.out'
    });

    gsap.from('.founder-content-col', {
      scrollTrigger: {
        trigger: '.founders-section',
        start: 'top 78%',
      },
      opacity: 0,
      y: 30,
      duration: 0.85,
      ease: 'power3.out'
    });

    gsap.from('.founder-metric-card', {
      scrollTrigger: {
        trigger: '.founder-metrics-grid',
        start: 'top 85%',
        once: true
      },
      opacity: 0,
      y: 20,
      stagger: 0.07,
      duration: 0.55,
      ease: 'power3.out',
      clearProps: 'transform'
    });

    // What We Do Cards (staggered)
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
      },
      opacity: 0,
      y: 35,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out'
    });

    // Commitment zones
    gsap.from('.commitment-visual-zone', {
      scrollTrigger: {
        trigger: '.commitment-section',
        start: 'top 80%',
      },
      opacity: 0,
      scale: 0.85,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });

    gsap.from('.commitment-content-zone', {
      scrollTrigger: {
        trigger: '.commitment-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.principle-item', {
      scrollTrigger: {
        trigger: '.commitment-principles-zone',
        start: 'top 85%',
        once: true
      },
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: 0.55,
      ease: 'power3.out',
      clearProps: 'transform'
    });

    // CTA Banner
    gsap.from('.cta-banner-card', {
      scrollTrigger: {
        trigger: '.footer-cta-section',
        start: 'top 85%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
}
