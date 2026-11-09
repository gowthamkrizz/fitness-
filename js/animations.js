/**
 * STACKLY FITNESS - GSAP & AOS ANIMATION ENGINE
 * Delivers content-related animations across Home, About Us, Trainers, Blog, and Contact pages.
 * Powered by GreenSock GSAP 3 + ScrollTrigger & AOS (Animate On Scroll).
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initScrollProgressBar();
    initMagneticElements();
    initHeroEntrances();
    initContentAnimations();
  });

  /* =========================================================================
     1. AOS (ANIMATE ON SCROLL) INITIALIZATION
     ========================================================================= */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 750,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 50,
        disable: false
      });

      window.addEventListener('load', () => {
        AOS.refresh();
      });
    }
  }

  /* =========================================================================
     2. DYNAMIC TOP READING / SCROLL PROGRESS BAR (GSAP + SCROLLTRIGGER)
     ========================================================================= */
  function initScrollProgressBar() {
    let bar = document.getElementById('scrollProgressBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'scrollProgressBar';
      bar.className = 'scroll-progress-bar';
      document.body.prepend(bar);
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.15
        }
      });
    }
  }

  /* =========================================================================
     3. MAGNETIC BUTTONS & INTERACTIVE ELEMENTS (GSAP ELASTIC PHYSICS)
     ========================================================================= */
  function initMagneticElements() {
    if (typeof gsap === 'undefined' || window.innerWidth < 1024) return;

    const magneticElements = document.querySelectorAll('.btn-guidy-capsule, .btn-primary, .btn-header-cta, .facility-explore-btn, .scroll-to-top-btn');

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
          x: x * 0.28,
          y: y * 0.28,
          duration: 0.35,
          ease: 'power2.out'
        });

        const icon = el.querySelector('.capsule-circle-icon, i');
        if (icon) {
          gsap.to(icon, {
            x: x * 0.18,
            y: y * 0.18,
            duration: 0.35,
            ease: 'power2.out'
          });
        }
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1.1, 0.4)'
        });

        const icon = el.querySelector('.capsule-circle-icon, i');
        if (icon) {
          gsap.to(icon, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1.1, 0.4)'
          });
        }
      });
    });
  }

  /* =========================================================================
     4. HERO ENTRANCE SEQUENCES (CONTENT-SPECIFIC)
     ========================================================================= */
  function initHeroEntrances() {
    if (typeof gsap === 'undefined') return;

    // A. HOME HERO (ThemeForest 01. Fitness Trainers)
    const homeHero = document.querySelector('.guidy-hero-section');
    if (homeHero) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const headline = homeHero.querySelector('.guidy-hero-headline');
      const capsuleBtn = homeHero.querySelector('.btn-guidy-capsule');
      const athleteImg = homeHero.querySelector('.guidy-hero-athlete-img');
      const marquee = homeHero.querySelector('.guidy-hero-marquee');

      if (marquee) {
        tl.fromTo(marquee, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0);
      }

      if (athleteImg) {
        tl.fromTo(athleteImg, 
          { y: 80, opacity: 0, scale: 0.95 }, 
          { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, 
          0.1
        );

        // Continuous subtle breathing animation
        gsap.to(athleteImg, {
          y: -10,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.3
        });
      }

      if (headline) {
        tl.fromTo(headline, 
          { y: 40, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.9 }, 
          0.3
        );
      }

      if (capsuleBtn) {
        tl.fromTo(capsuleBtn, 
          { y: 30, opacity: 0, scale: 0.92 }, 
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)' }, 
          0.5
        );
      }
    }

    // B. INNER PAGE HERO BANNERS (About, Trainers, Blog, Contact)
    const innerHero = document.querySelector('.page-hero');
    if (innerHero) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const badge = innerHero.querySelector('.section-tag, .page-hero-tag');
      const title = innerHero.querySelector('.page-hero-title, .page-title, h1');
      const desc = innerHero.querySelector('.page-hero-desc, .page-desc, p');
      const breadcrumb = innerHero.querySelector('.page-hero-breadcrumb, .breadcrumb');

      if (badge) {
        tl.fromTo(badge, { opacity: 0, y: -20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, 0);
      }
      if (title) {
        tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.15);
      }
      if (desc) {
        tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3);
      }
      if (breadcrumb) {
        tl.fromTo(breadcrumb, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.45);
      }
    }
  }

  /* =========================================================================
     5. PAGE-SPECIFIC CONTENT ANIMATIONS
     ========================================================================= */
  function initContentAnimations() {
    if (typeof gsap === 'undefined') return;

    // ----------------------------------------------------
    // 5A. HOME PAGE SPECIFIC ANIMATIONS
    // ----------------------------------------------------
    // 3D Tilt on Program & Service Cards
    const tiltCards = document.querySelectorAll('.service-card, .program-card, .why-card');
    if (tiltCards.length && window.innerWidth >= 1024) {
      tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            rotationY: x * 10,
            rotationX: -y * 10,
            transformPerspective: 900,
            duration: 0.35,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.6,
            ease: 'power2.out'
          });
        });
      });
    }

    // Exact Guidy Section 5 Floating Dumbbell Parallax
    const dumbbell = document.querySelector('.guidy-cta-floating-dumbbell');
    if (dumbbell && typeof ScrollTrigger !== 'undefined') {
      gsap.to(dumbbell, {
        y: -50,
        rotation: 18,
        scrollTrigger: {
          trigger: '.guidy-cta-section-exact',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // ----------------------------------------------------
    // 5B. ABOUT US: ROADMAP TIMELINE ENERGY LINE & MILESTONES
    // ----------------------------------------------------
    const timeline = document.querySelector('.timeline-roadmap');
    if (timeline && typeof ScrollTrigger !== 'undefined') {
      const milestoneItems = timeline.querySelectorAll('.timeline-item');
      
      milestoneItems.forEach((item, index) => {
        const dot = item.querySelector('.timeline-dot');
        const card = item.querySelector('.timeline-card');

        if (dot && card) {
          gsap.fromTo(card, 
            { opacity: 0, x: index % 2 === 0 ? -40 : 40 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );

          gsap.fromTo(dot,
            { scale: 0.5, boxShadow: '0 0 0 rgba(186, 238, 38, 0)' },
            {
              scale: 1,
              boxShadow: '0 0 25px rgba(186, 238, 38, 0.8)',
              duration: 0.6,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      });
    }

    // ----------------------------------------------------
    // 5C. TRAINERS: BIOMETRIC PROGRESS BARS & CARDS
    // ----------------------------------------------------
    const transBars = document.querySelectorAll('.trans-stat-bar-fill');
    if (transBars.length && typeof ScrollTrigger !== 'undefined') {
      transBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-fill-percent') || '85%';
        gsap.fromTo(bar,
          { width: '0%' },
          {
            width: targetWidth,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }

    // Trainer Cards 3D Interactive Hover
    const trainerCards = document.querySelectorAll('.trainer-card');
    trainerCards.forEach(card => {
      const img = card.querySelector('img');
      const badge = card.querySelector('.trainer-role, .badge');

      card.addEventListener('mouseenter', () => {
        if (img) gsap.to(img, { scale: 1.06, duration: 0.5, ease: 'power2.out' });
        if (badge) gsap.to(badge, { scale: 1.05, duration: 0.3, ease: 'back.out(2)' });
      });

      card.addEventListener('mouseleave', () => {
        if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
        if (badge) gsap.to(badge, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });

    // ----------------------------------------------------
    // 5D. BLOG: LIVE AUDIO EQUALIZER WAVEFORM (PODCAST)
    // ----------------------------------------------------
    const waveformBars = document.querySelectorAll('.waveform-bar');
    if (waveformBars.length) {
      waveformBars.forEach((bar, i) => {
        const randomScale = 0.25 + Math.random() * 0.75;
        const randomDuration = 0.35 + Math.random() * 0.45;

        gsap.to(bar, {
          scaleY: randomScale,
          transformOrigin: 'bottom',
          duration: randomDuration,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: i * 0.04
        });
      });
    }

    // Blog Article Cards Stagger Lift on Hover
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
      const img = card.querySelector('.blog-thumb img, .blog-card-img img');
      const tag = card.querySelector('.blog-category, .badge');

      card.addEventListener('mouseenter', () => {
        if (img) gsap.to(img, { scale: 1.08, duration: 0.5, ease: 'power2.out' });
        if (tag) gsap.to(tag, { y: -3, duration: 0.25, ease: 'power2.out' });
      });

      card.addEventListener('mouseleave', () => {
        if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
        if (tag) gsap.to(tag, { y: 0, duration: 0.25, ease: 'power2.out' });
      });
    });

    // ----------------------------------------------------
    // 5E. CONTACT: FORM FOCUS MICRO-INTERACTIONS & MAP PIN
    // ----------------------------------------------------
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(input => {
      const parent = input.closest('.form-group');
      const label = parent ? parent.querySelector('.form-label') : null;

      input.addEventListener('focus', () => {
        gsap.to(input, {
          borderColor: '#BAEE26',
          boxShadow: '0 0 16px rgba(186, 238, 38, 0.25)',
          duration: 0.3
        });
        if (label) {
          gsap.to(label, { color: '#BAEE26', duration: 0.25 });
        }
      });

      input.addEventListener('blur', () => {
        gsap.to(input, {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: 'none',
          duration: 0.3
        });
        if (label) {
          gsap.to(label, { color: '', duration: 0.25 });
        }
      });
    });

    // Contact Information Cards Hover Kinetic Spin
    const contactCards = document.querySelectorAll('.contact-info-card');
    contactCards.forEach(card => {
      const icon = card.querySelector('.contact-info-icon');
      card.addEventListener('mouseenter', () => {
        if (icon) {
          gsap.to(icon, {
            rotation: 12,
            scale: 1.15,
            backgroundColor: '#BAEE26',
            color: '#070808',
            boxShadow: '0 0 25px rgba(186, 238, 38, 0.6)',
            duration: 0.35,
            ease: 'back.out(2)'
          });
        }
      });
      card.addEventListener('mouseleave', () => {
        if (icon) {
          gsap.to(icon, {
            rotation: 0,
            scale: 1,
            backgroundColor: '',
            color: '',
            boxShadow: '',
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });
    });
  }

  // Expose for external calls if needed
  window.StacklyAnimations = {
    initAOS,
    initScrollProgressBar,
    initMagneticElements,
    initHeroEntrances,
    initContentAnimations
  };

})();
