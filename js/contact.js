/* ==========================================================================
   Sunkiran Dimex - Contact Page Interactive Scripts
   Form Validation, Submission State, FAQ Accordion, GSAP Motion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initContactForm();
  initFaqAccordion();
  initGsapAnimations();
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
 * Mobile Drawer Menu
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta-btn');

  if (!menuBtn || !drawerOverlay) return;

  const openMenu = () => {
    drawerOverlay.classList.add('open');
    drawerOverlay.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeMenu = () => {
    drawerOverlay.classList.remove('open');
    drawerOverlay.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuBtn.focus();
  };

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) closeMenu();
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerOverlay.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Interactive Consultation Form Validation & Submission
 */
function initContactForm() {
  const form = document.getElementById('contact-inquiry-form');
  const submitBtn = document.getElementById('submit-inquiry-btn');
  const successState = document.getElementById('form-success-state');
  const successId = document.getElementById('success-id');

  if (!form || !submitBtn || !successState) return;

  const nameInput = document.getElementById('contact-name');
  const whatsappInput = document.getElementById('contact-whatsapp');
  const emailInput = document.getElementById('contact-email');
  const businessInput = document.getElementById('contact-business');

  const messageInput = document.getElementById('contact-message');
  const topicChips = document.querySelectorAll('.topic-chip');

  // Input sanitization and error clearance on input
  [nameInput, whatsappInput, emailInput, businessInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      const parent = input.closest('.form-field-group');
      if (parent) parent.classList.remove('has-error');
    });
  });

  // Interactive Quick Topic Chips
  topicChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.getAttribute('data-topic');
      if (!messageInput || !topic) return;

      if (!messageInput.value.includes(topic)) {
        messageInput.value = messageInput.value.trim() 
          ? `${messageInput.value.trim()}\n- ${topic}` 
          : `Goal: ${topic}`;
      }
      chip.style.borderColor = 'var(--cyan)';
      chip.style.background = 'rgba(17, 200, 255, 0.2)';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.closest('.form-field-group').classList.add('has-error');
      isValid = false;
    }

    // Validate WhatsApp (digits, spaces, plus, min 8 digits)
    const phoneClean = whatsappInput.value.replace(/[^0-9]/g, '');
    if (!whatsappInput.value.trim() || phoneClean.length < 8) {
      whatsappInput.closest('.form-field-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailInput.closest('.form-field-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Business
    if (!businessInput.value.trim() || businessInput.value.trim().length < 2) {
      businessInput.closest('.form-field-group').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate submission state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      
      // Generate random confirmation ID
      const randomId = Math.floor(1000 + Math.random() * 9000);
      if (successId) successId.textContent = `#SD-${randomId}`;

      successState.classList.add('active');
      successState.setAttribute('aria-hidden', 'false');

      // Scroll smoothly into view
      form.closest('.form-panel-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 900);
  });
}

/**
 * FAQ Accordion Expansion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');

    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all other panels
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherPanel = otherItem.querySelector('.faq-answer-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isExpanded) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/**
 * GSAP Scroll Reveals
 */
function initGsapAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Hero section timeline
  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } })
    .from('.hero-content-block .pill-eyebrow', { opacity: 0, y: 15, delay: 0.1 })
    .from('.hero-h1', { opacity: 0, y: 20 }, '-=0.4')
    .from('.hero-subtext', { opacity: 0, y: 15 }, '-=0.4')
    .from('.hero-quick-channels', { opacity: 0, y: 15 }, '-=0.4');

  // Bento Sidebar Cards
  gsap.utils.toArray('.bento-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true
      },
      opacity: 0,
      y: 25,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out'
    });
  });

  // Form Panel
  gsap.from('.form-panel-card', {
    scrollTrigger: {
      trigger: '.form-panel-card',
      start: 'top 85%',
      toggleActions: 'play none none none',
      once: true
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    ease: 'power3.out'
  });

  // FAQ Items
  gsap.utils.toArray('.faq-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none none',
        once: true
      },
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: i * 0.08,
      ease: 'power2.out'
    });
  });
}
