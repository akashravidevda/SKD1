/**
 * Sunkiran Dimex - Production Application Logic
 * Interactive canvas particles, animated counters, live pipeline feeds, 3D card tilt & modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Scroll Transition
  const header = document.querySelector('.header-sticky');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Drawer Toggle, Backdrop & Escape Handler
  const mobileToggleBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  const openDrawer = () => {
    if (mobileNavDrawer) mobileNavDrawer.classList.add('active');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = (keepScrollLocked = false) => {
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('active');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('active');
    if (!keepScrollLocked && !document.querySelector('.modal-backdrop.active')) {
      document.body.style.overflow = '';
    }
  };

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openDrawer);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', () => closeDrawer(false));
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', () => closeDrawer(false));

  // Escape key closes mobile drawer and any active modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('active')) {
        closeDrawer(false);
      }
      document.querySelectorAll('.modal-backdrop.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

  if (mobileNavDrawer) {
    mobileNavDrawer.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        const isOpeningModal = el.classList.contains('open-consultation-btn') || 
                               el.classList.contains('open-privacy-btn') || 
                               el.classList.contains('open-terms-btn');
        closeDrawer(isOpeningModal);
      });
    });
  }

  // 3. Hero Canvas Interactive Particle Network
  const canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.parentElement) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    window.addEventListener('resize', () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
      }
    }, { passive: true });

    const particles = [];
    const particleCount = Math.min(45, Math.floor(width / 35));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? 'rgba(77, 157, 255, 0.45)' : 'rgba(255, 106, 0, 0.35)'
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect near particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(77, 157, 255, ${0.22 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle points
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 4. Smooth Number Count-Up on Viewport Entry
  const countUpElements = document.querySelectorAll('.count-up');
  const runCountAnimation = (el) => {
    if (el.getAttribute('data-counted') === 'true') return;
    el.setAttribute('data-counted', 'true');

    const target = parseInt(el.getAttribute('data-target'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * target);

      el.innerText = prefix + currentVal.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.innerText = prefix + target.toLocaleString() + suffix;
      }
    };
    requestAnimationFrame(updateCount);
  };

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('count-up')) {
          runCountAnimation(entry.target);
        } else {
          entry.target.querySelectorAll('.count-up').forEach(runCountAnimation);
        }
      }
    });
  }, { threshold: 0.15 });

  countUpElements.forEach(el => countObserver.observe(el));
  const dashboardCard = document.querySelector('.analytics-dashboard-card');
  const metricsBar = document.querySelector('.bottom-metrics-bar');
  if (dashboardCard) countObserver.observe(dashboardCard);
  if (metricsBar) countObserver.observe(metricsBar);

  // 5. Cyclic Live Lead Notification Feed
  const liveLeadPill = document.querySelector('.live-lead-pill');
  if (liveLeadPill) {
    const leads = [
      '◉ New Lead: Baner, Pune (School Admissions)',
      '◉ New Lead: Hinjewadi, Pune (Real Estate 3BHK)',
      '◉ New Lead: Kothrud, Pune (Salon Booking Engine)',
      '◉ New Lead: Viman Nagar, Pune (Custom ERP Web App)',
      '◉ New Lead: Wakad, Pune (Meta Ads E-Commerce)'
    ];
    let leadIndex = 0;

    setInterval(() => {
      leadIndex = (leadIndex + 1) % leads.length;
      liveLeadPill.style.opacity = '0';
      liveLeadPill.style.transform = 'translateY(6px)';
      
      setTimeout(() => {
        const textSpan = liveLeadPill.querySelector('span');
        if (textSpan) textSpan.innerText = leads[leadIndex];
        liveLeadPill.style.transition = 'all 0.35s ease';
        liveLeadPill.style.opacity = '1';
        liveLeadPill.style.transform = 'translateY(0)';
      }, 350);
    }, 4500);
  }

  // 6. Subtle Interactive 3D Card Tilt for Analytics Dashboard
  if (dashboardCard && window.innerWidth > 1024) {
    dashboardCard.addEventListener('mousemove', (e) => {
      const rect = dashboardCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      dashboardCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    dashboardCard.addEventListener('mouseleave', () => {
      dashboardCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }

  // 7. Consultation Modal Handlers
  const consultationModal = document.getElementById('consultation-modal');
  const openConsultationBtns = document.querySelectorAll('.open-consultation-btn');
  const closeConsultationBtns = document.querySelectorAll('.close-modal-btn');

  openConsultationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prefillService = btn.getAttribute('data-service');
      if (prefillService) {
        const select = document.getElementById('modal-requirement-select');
        if (select) select.value = prefillService;
      }
      if (consultationModal) consultationModal.classList.add('active');
    });
  });

  closeConsultationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('active');
    }
  });

  // 8. Lead Form Submission to WhatsApp
  const leadForm = document.getElementById('lead-consultation-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('lead-name').value;
      const business = document.getElementById('lead-business').value;
      const phone = document.getElementById('lead-phone').value;
      const service = document.getElementById('modal-requirement-select').value;
      const message = document.getElementById('lead-message').value;

      const waMsg = `Hi Sunkiran Dimex team, my name is ${encodeURIComponent(name)} from ${encodeURIComponent(business)}. I am interested in ${encodeURIComponent(service)}. Phone: ${encodeURIComponent(phone)}. Note: ${encodeURIComponent(message || 'Looking for digital growth solutions.')}`;
      const waUrl = `https://wa.me/918668203310?text=${waMsg}`;

      triggerConfetti();

      const formContainer = document.getElementById('modal-form-content');
      const successContainer = document.getElementById('modal-success-content');
      if (formContainer && successContainer) {
        formContainer.style.display = 'none';
        successContainer.style.display = 'block';

        const waLinkBtn = document.getElementById('modal-wa-redirect');
        if (waLinkBtn) {
          waLinkBtn.href = waUrl;
        }
      }
    });
  }

  // 9. Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast('🎉 Thank you! ' + emailInput.value + ' has been added to our Growth Insights list.');
        emailInput.value = '';
      }
    });
  }

  // 10. Story Video Modal
  const videoModal = document.getElementById('video-modal');
  const openVideoBtns = document.querySelectorAll('.open-video-btn');
  openVideoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (videoModal) videoModal.classList.add('active');
    });
  });

  // 11. Toast Notification
  function showToast(message) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.style.cssText = 'position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px); background: #0B1B3A; color: #FFFFFF; padding: 14px 24px; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); border: 1px solid rgba(77,157,255,0.35); font-weight: 600; font-size: 0.92rem; z-index: 3000; transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); display: flex; align-items: center; gap: 10px;';
      document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 4000);
  }

  // 12. Confetti Burst
  function triggerConfetti() {
    for (let i = 0; i < 50; i++) {
      const conf = document.createElement('div');
      const colors = ['#1264FF', '#FF6A00', '#12C98B', '#FBBF24', '#35D6FF'];
      conf.style.cssText = `position: fixed; top: 40%; left: 50%; width: ${Math.random() * 8 + 6}px; height: ${Math.random() * 8 + 6}px; background: ${colors[Math.floor(Math.random() * colors.length)]}; border-radius: 2px; z-index: 9999; pointer-events: none; transform: translate(-50%, -50%); opacity: 1; transition: all ${Math.random() * 1.5 + 1}s cubic-bezier(0.25, 1, 0.5, 1);`;
      document.body.appendChild(conf);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 250 + 100;
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity - 100;

      setTimeout(() => {
        conf.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${Math.random() * 720}deg)`;
        conf.style.opacity = '0';
      }, 20);

      setTimeout(() => conf.remove(), 2500);
    }
  }

  
  // 13. Industry Item Click Router (Supports both .csi-industry-card and .industry-item)
  const industryItems = document.querySelectorAll('.csi-industry-card, .industry-item');
  industryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const name = item.getAttribute('data-industry') || item.innerText.trim();
      if (name && name !== 'View All' && name !== 'All Industries') {
        e.preventDefault();
        const select = document.getElementById('modal-requirement-select');
        if (select) select.value = 'Complete Digital Growth System';
        const leadMsg = document.getElementById('lead-message');
        if (leadMsg) leadMsg.value = 'Interested in digital growth solutions specifically for ' + name + ' business.';
        if (consultationModal) consultationModal.classList.add('active');
      }
    });
  });

  // 14. Portfolio Category Filter
  const portfolioFilterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  if (portfolioFilterBtns.length && portfolioCards.length) {
    portfolioFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        portfolioFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        portfolioCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 15. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        if (isActive) {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          faqItems.forEach(other => {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // 16. Legal Modals (Privacy & Terms)
  const privacyModal = document.getElementById('privacy-modal');
  const termsModal = document.getElementById('terms-modal');
  document.querySelectorAll('a[href="#privacy"], .open-privacy-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (privacyModal) privacyModal.classList.add('active');
    });
  });
  document.querySelectorAll('a[href="#terms"], .open-terms-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (termsModal) termsModal.classList.add('active');
    });
  });

});
