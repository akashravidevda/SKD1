/* ==========================================================================
   Sunkiran Dimex - Grow My Customers Live Workshop Interactive Engine
   Countdown Timer, Registration Form, Calendar Sync & GSAP ScrollTrigger
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initRegistrationForm();
  initCalendarSync();
  initScrollAnimations();
});

/**
 * 1. Live Countdown Timer with Timezone Precision & Auto-Rollover
 * Target: Next upcoming Sunday, 8:00 PM IST (Asia/Kolkata)
 */
function initCountdownTimer() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function getNextSunday8PM() {
    const now = new Date();
    const resultDate = new Date(now.getTime());
    
    // Day of week: 0 is Sunday
    const dayOfWeek = now.getDay();
    let daysUntilSunday = (7 - dayOfWeek) % 7;
    
    // If today is Sunday and already past 8:00 PM IST, jump to next Sunday
    const targetHourIST = 20;
    if (dayOfWeek === 0 && now.getHours() >= targetHourIST) {
      daysUntilSunday = 7;
    }

    resultDate.setDate(now.getDate() + daysUntilSunday);
    resultDate.setHours(targetHourIST, 0, 0, 0);
    return resultDate.getTime();
  }

  const targetDate = getNextSunday8PM();

  function updateTimer() {
    const now = new Date().getTime();
    let distance = targetDate - now;

    if (distance <= 0) {
      // Fallback preview distance: 1 day, 23 hours, 6 minutes, 12 seconds
      distance = (1 * 24 * 60 * 60 + 23 * 60 * 60 + 6 * 60 + 12) * 1000;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 2. Frictionless Registration Form & Instant Confirmation
 */
function initRegistrationForm() {
  const form = document.getElementById('workshop-registration-form');
  const formWrap = document.getElementById('form-inputs-wrap');
  const successState = document.getElementById('form-success-state');
  const submitBtn = document.getElementById('submit-reg-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const business = document.getElementById('reg-business')?.value.trim();

    if (!name || !phone || !email || !business) {
      alert('Please fill out all required fields to reserve your seat.');
      return;
    }

    // Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Securing Your Seat...</span>`;
    }

    setTimeout(() => {
      if (formWrap) formWrap.style.display = 'none';
      if (successState) {
        successState.style.display = 'flex';
      }

      // Smooth scroll into view
      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  });
}

/**
 * 3. Calendar Sync Quick Actions
 */
function initCalendarSync() {
  const quickCalBtns = document.querySelectorAll('.quick-calendar-btn');
  quickCalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = encodeURIComponent("Grow My Customers - Live Meta Ads Workshop");
      const details = encodeURIComponent("Live 90-minute Meta Ads Customer Acquisition Masterclass with Kiran Hajare (Sunkiran Dimex). Zoom link sent via WhatsApp & Email.");
      const location = encodeURIComponent("Live on Zoom");
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20260920T143000Z/20260920T160000Z`;
      window.open(gcalUrl, '_blank');
    });
  });
}

/**
 * 4. GSAP ScrollTrigger Motion & Visual Stagger
 */
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero timeline entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.75 } });
    
    if (document.querySelector('.hero-content')) {
      heroTl
        .from('.workshop-hero-section .pill-eyebrow', { opacity: 0, y: 18, duration: 0.5 })
        .from('.hero-h1', { opacity: 0, y: 24, duration: 0.7 }, '-=0.3')
        .from('.hero-body-text', { opacity: 0, y: 16, duration: 0.5 }, '-=0.4')
        .from('.session-meta-strip .meta-item', { opacity: 0, y: 15, stagger: 0.08, duration: 0.45 }, '-=0.3')
        .from('.hero-action-group', { opacity: 0, y: 15, duration: 0.5 }, '-=0.2')
        .from('.social-proof-strip', { opacity: 0, y: 12, duration: 0.4 }, '-=0.2')
        .from('.hero-preview-col', { opacity: 0, scale: 0.96, duration: 0.75 }, '-=0.5');
    }

    // Countdown bar reveal
    if (document.querySelector('.countdown-bar')) {
      gsap.from('.countdown-bar', {
        scrollTrigger: {
          trigger: '.countdown-bar-section',
          start: 'top 85%',
        },
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power3.out'
      });
    }

    // Topics bento grid stagger
    if (document.querySelector('.topics-grid')) {
      gsap.from('.topic-card', {
        scrollTrigger: {
          trigger: '.topics-grid',
          start: 'top 82%',
        },
        opacity: 0,
        y: 28,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power3.out'
      });
    }

    // Audience cards stagger
    if (document.querySelector('.audience-grid')) {
      gsap.from('.audience-card', {
        scrollTrigger: {
          trigger: '.audience-grid',
          start: 'top 82%',
        },
        opacity: 0,
        y: 25,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out'
      });
    }

    // Host card reveal
    if (document.querySelector('.host-card')) {
      gsap.from('.host-card', {
        scrollTrigger: {
          trigger: '.host-card',
          start: 'top 82%',
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out'
      });
    }

    // Registration card reveal
    if (document.querySelector('.register-card')) {
      gsap.from('.register-card', {
        scrollTrigger: {
          trigger: '.register-section',
          start: 'top 82%',
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out'
      });
    }

    // Closing banner reveal
    if (document.querySelector('.closing-banner-card')) {
      gsap.from('.closing-banner-card', {
        scrollTrigger: {
          trigger: '.closing-banner-section',
          start: 'top 85%',
        },
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power3.out'
      });
    }
  }
}
