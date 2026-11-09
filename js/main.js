/**
 * STACKLY FITNESS - MAIN JAVASCRIPT
 * Full interactive functionality: Cart Drawer, Mobile Navigation,
 * Scroll Reveal Animations, Animated Stats Counters, FAQ Accordion,
 * Schedule Filters, Shop Filters, Pricing Toggle & Toast Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initCart();
  initFaqAccordion();
  initCounters();
  initTransformationBars();
  initPricingToggle();
  initScheduleFilter();
  initShopFilters();
  initDealCountdown();
  initCalculator();
  initForms();
  initScrollToTop();
  initCtaParallax();
});

/* ---------------- 1. STICKY / FIXED HEADER ENGINE ---------------- */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  const topBar = document.querySelector('.top-bar');
  if (!header) return;

  // Insert a spacer right after header to maintain layout geometry when header becomes position:fixed
  let spacer = document.querySelector('.header-spacer');
  if (!spacer) {
    spacer = document.createElement('div');
    spacer.className = 'header-spacer';
    spacer.style.display = 'none';
    header.parentNode.insertBefore(spacer, header.nextSibling);
  }

  const handleScroll = () => {
    // If mobile (<= 991px), header is already fixed via CSS and body has padding-top
    if (window.innerWidth <= 991) {
      if (spacer) spacer.style.display = 'none';
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      return;
    }

    const topBarHeight = (topBar && window.getComputedStyle(topBar).display !== 'none') 
      ? topBar.offsetHeight 
      : 0;

    const fixThreshold = Math.max(35, topBarHeight);
    const unfixThreshold = 5;

    if (window.scrollY >= fixThreshold) {
      if (!header.classList.contains('is-fixed')) {
        spacer.style.height = `${header.offsetHeight}px`;
        spacer.style.display = 'block';
        header.classList.add('is-fixed', 'scrolled');
      }
    } else if (window.scrollY <= unfixThreshold) {
      if (header.classList.contains('is-fixed')) {
        header.classList.remove('is-fixed', 'scrolled');
        spacer.style.display = 'none';
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();
}

/* ---------------- 2. MOBILE MENU DRAWER ---------------- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const links = document.querySelectorAll('.drawer-link');

  if (!hamburger || !drawer || !overlay) return;

  const openDrawer = () => {
    hamburger.classList.add('active');
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    hamburger.classList.remove('active');
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  const toggleDrawer = () => {
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  hamburger.addEventListener('click', toggleDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* ---------------- 3. SCROLL REVEAL ANIMATIONS (GUIDY PAVO-MOVE ENGINE) ---------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .pavo-move-up, .pavo-move-left, .pavo-move-right');
  if (!revealElements.length) return;

  const revealItem = (el) => {
    el.classList.add('reveal-visible');
    el.classList.add('animated');
  };

  // Immediate reveal for elements visible or near the viewport on load
  const checkInitialVisibility = () => {
    const windowH = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowH + 80 && rect.bottom >= -80) {
        revealItem(el);
      }
    });
  };

  checkInitialVisibility();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealItem(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px 80px 0px',
      threshold: 0.01
    });

    revealElements.forEach(el => {
      if (!el.classList.contains('reveal-visible')) {
        observer.observe(el);
      }
    });
  }

  // Safety scroll & resize handlers
  window.addEventListener('scroll', checkInitialVisibility, { passive: true });
  window.addEventListener('resize', checkInitialVisibility, { passive: true });

  // Fallback timer: ensure everything reveals smoothly after short delay so no content is ever hidden
  setTimeout(() => {
    revealElements.forEach(el => revealItem(el));
  }, 900);
}

/* ---------------- 4. STATS COUNTER ANIMATION ---------------- */
function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start = 0;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * ease);

      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    };

    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
  } else {
    counterElements.forEach(el => animateCounter(el));
  }
}

/* ---------------- 4B. TRANSFORMATION PROGRESS BARS ANIMATION ---------------- */
function initTransformationBars() {
  const bars = document.querySelectorAll('.trans-stat-bar-fill');
  if (!bars.length) return;

  const animateBar = (bar) => {
    const target = bar.getAttribute('data-fill-percent') || '100%';
    setTimeout(() => {
      bar.style.width = target;
      bar.classList.add('animated');
    }, 150);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateBar(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    bars.forEach(b => {
      b.style.width = '0%';
      observer.observe(b);
    });
  } else {
    bars.forEach(animateBar);
  }
}

/* ---------------- 5. SHOPPING CART SYSTEM ---------------- */
let cartItems = [
  {
    id: 'prod-whey',
    name: 'Stackly 100% Whey Isolate',
    price: 54.99,
    qty: 1,
    image: 'images/product-whey.webp'
  }
];

function initCart() {
  const cartBtn = document.querySelector('.header-cart-btn');
  const cartDrawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.cart-close');
  const checkoutBtn = document.querySelector('.btn-checkout');

  if (cartBtn && cartDrawer) {
    cartBtn.addEventListener('click', (e) => {
      if (cartBtn.tagName === 'A' && cartBtn.getAttribute('href')) {
        return; // Allow direct navigation to 404.html
      }
      e.preventDefault();
      openCartDrawer();
    });
  }

  if (closeBtn && cartDrawer) {
    closeBtn.addEventListener('click', closeCartDrawer);
  }

  // Handle Add to Cart button clicks on page
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-cart]');
    if (addBtn) {
      e.preventDefault();
      const id = addBtn.getAttribute('data-id');
      const name = addBtn.getAttribute('data-name');
      const price = parseFloat(addBtn.getAttribute('data-price'));
      const image = addBtn.getAttribute('data-image');

      addToCart({ id, name, price, image, qty: 1 });
      showToast(`Added "${name}" to your cart!`);
      openCartDrawer();
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

  renderCart();
}

function openCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function addToCart(product) {
  const existing = cartItems.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push(product);
  }
  renderCart();
}

function updateCartQty(id, delta) {
  const item = cartItems.find(it => it.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cartItems = cartItems.filter(it => it.id !== id);
  }
  renderCart();
}

function removeCartItem(id) {
  cartItems = cartItems.filter(it => it.id !== id);
  renderCart();
  showToast('Item removed from cart.');
}

function calculateCartTotal() {
  return cartItems.reduce((acc, it) => acc + (it.price * it.qty), 0);
}

function renderCart() {
  const listEl = document.querySelector('.cart-items-list');
  const countBadges = document.querySelectorAll('.cart-counter');
  const subtotalEl = document.querySelector('.cart-subtotal-val');

  const totalCount = cartItems.reduce((acc, it) => acc + it.qty, 0);
  countBadges.forEach(b => b.textContent = totalCount);

  const totalAmount = calculateCartTotal();
  if (subtotalEl) {
    subtotalEl.textContent = `$${totalAmount.toFixed(2)}`;
  }

  if (!listEl) return;

  if (cartItems.length === 0) {
    listEl.innerHTML = `
      <div class="cart-empty-message">
        <i class="fa-solid fa-basket-shopping"></i>
        <h4>YOUR CART IS EMPTY</h4>
        <p>Explore our shop for performance supplements and premium workout apparel.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h5 class="cart-item-name">${item.name}</h5>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeCartItem('${item.id}')" title="Remove item">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');
}

// Attach to window so inline onclick works
window.updateCartQty = updateCartQty;
window.removeCartItem = removeCartItem;

/* ---------------- 6. FAQ ACCORDION ---------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

/* ---------------- 7. MEMBERSHIP PRICING TOGGLE ---------------- */
function initPricingToggle() {
  const toggle = document.querySelector('.pricing-billing-toggle');
  if (!toggle) return;

  const prices = document.querySelectorAll('[data-monthly-price]');
  const monthlyLabel = document.querySelector('.label-monthly');
  const yearlyLabel = document.querySelector('.label-yearly');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('yearly');
    const isYearly = toggle.classList.contains('yearly');

    if (monthlyLabel && yearlyLabel) {
      if (isYearly) {
        monthlyLabel.classList.remove('active');
        yearlyLabel.classList.add('active');
      } else {
        monthlyLabel.classList.add('active');
        yearlyLabel.classList.remove('active');
      }
    }

    prices.forEach(p => {
      const monthly = p.getAttribute('data-monthly-price');
      const yearly = p.getAttribute('data-yearly-price');
      p.textContent = isYearly ? yearly : monthly;
    });
  });
}

/* ---------------- 8. SCHEDULE FILTER ---------------- */
function initScheduleFilter() {
  const tabBtns = document.querySelectorAll('.schedule-tab-btn');
  const rows = document.querySelectorAll('.schedule-row');
  if (!tabBtns.length || !rows.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      rows.forEach(row => {
        if (filter === 'all' || row.getAttribute('data-day') === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* ---------------- 9. SHOP FILTERS & SEARCH ---------------- */
function initShopFilters() {
  const pills = document.querySelectorAll('.shop-pill');
  const cards = document.querySelectorAll('.product-card');
  const searchInput = document.querySelector('.shop-search-input');
  const sortSelect = document.querySelector('.shop-sort-select');

  if (!cards.length) return;

  let currentCategory = 'all';
  let currentSearch = '';

  const applyFilters = () => {
    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      const name = (card.getAttribute('data-name') || '').toLowerCase();

      const matchesCat = currentCategory === 'all' || category === currentCategory;
      const matchesSearch = !currentSearch || name.includes(currentSearch);

      if (matchesCat && matchesSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  };

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      const container = document.querySelector('.products-grid');
      if (!container) return;

      const cardArray = Array.from(cards);

      if (val === 'price-low') {
        cardArray.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
      } else if (val === 'price-high') {
        cardArray.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
      } else if (val === 'rating') {
        cardArray.sort((a, b) => parseFloat(b.dataset.rating || 5) - parseFloat(a.dataset.rating || 5));
      }

      cardArray.forEach(card => container.appendChild(card));
    });
  }
}

/* ---------------- 10. DEAL COUNTDOWN TIMER ---------------- */
function initDealCountdown() {
  const hoursEl = document.querySelector('.countdown-hours');
  const minsEl = document.querySelector('.countdown-mins');
  const secsEl = document.querySelector('.countdown-secs');

  if (!hoursEl || !minsEl || !secsEl) return;

  let remaining = 28 * 3600 + 44 * 60 + 12; // 28 hours 44 mins

  setInterval(() => {
    if (remaining <= 0) return;
    remaining -= 1;

    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

/* ---------------- 11. TRIAL CALCULATOR ---------------- */
function initCalculator() {
  const daysSlider = document.querySelector('#calc-days');
  const targetSlider = document.querySelector('#calc-weight');
  const weeksDisplay = document.querySelector('#calc-result-weeks');
  const costDisplay = document.querySelector('#calc-result-cost');

  if (!daysSlider || !targetSlider || !weeksDisplay || !costDisplay) return;

  const calculate = () => {
    const days = parseInt(daysSlider.value, 10);
    const weightLoss = parseInt(targetSlider.value, 10);

    document.querySelector('#calc-days-val').textContent = `${days} Days/Week`;
    document.querySelector('#calc-weight-val').textContent = `${weightLoss} kg`;

    // Rough realistic formula: ~0.6kg loss per week per high consistency
    const estimatedWeeks = Math.max(4, Math.round(weightLoss / (0.2 + (days * 0.12))));
    const estimatedCost = Math.round(estimatedWeeks * (29 - (days * 1.5)));

    weeksDisplay.textContent = `${estimatedWeeks} Weeks`;
    costDisplay.textContent = `$${estimatedCost}`;
  };

  daysSlider.addEventListener('input', calculate);
  targetSlider.addEventListener('input', calculate);
  calculate();
}

/* ---------------- 12. FORMS & JAVASCRIPT VALIDATION ---------------- */
function initForms() {
  // Ensure every form on the page disables native browser validation popups
  document.querySelectorAll('form').forEach(form => {
    form.setAttribute('novalidate', 'true');
  });

  // --- 1. Contact Page Consultation Booking Form ---
  const consultForm = document.getElementById('contact-consult-form');
  if (consultForm) {
    const fnInput = document.getElementById('consult-firstname');
    const lnInput = document.getElementById('consult-lastname');
    const emInput = document.getElementById('consult-email');
    const phInput = document.getElementById('consult-phone');
    const goalSelect = document.getElementById('consult-goal');

    const fnErr = document.getElementById('consult-firstname-error');
    const lnErr = document.getElementById('consult-lastname-error');
    const emErr = document.getElementById('consult-email-error');
    const phErr = document.getElementById('consult-phone-error');
    const goalErr = document.getElementById('consult-goal-error');

    const setFieldError = (input, errEl, message) => {
      if (input) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
      }
      if (errEl) {
        errEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
        errEl.classList.add('active');
      }
    };

    const clearFieldError = (input, errEl) => {
      if (input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      }
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('active');
      }
    };

    // Live validation on user typing / changing
    if (fnInput) {
      fnInput.addEventListener('input', () => {
        if (fnInput.value.trim().length >= 2) clearFieldError(fnInput, fnErr);
      });
    }
    if (lnInput) {
      lnInput.addEventListener('input', () => {
        if (lnInput.value.trim().length >= 2) clearFieldError(lnInput, lnErr);
      });
    }
    if (emInput) {
      emInput.addEventListener('input', () => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emInput.value.trim())) clearFieldError(emInput, emErr);
      });
    }
    if (phInput) {
      phInput.addEventListener('input', () => {
        if (phInput.value.replace(/\D/g, '').length >= 7) clearFieldError(phInput, phErr);
      });
    }
    if (goalSelect) {
      goalSelect.addEventListener('change', () => {
        if (goalSelect.value) clearFieldError(goalSelect, goalErr);
      });
    }

    const submitBtn = consultForm.querySelector('button[type="submit"]');

    const validateAndSubmitConsultation = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      let isValid = true;
      let firstInvalid = null;

      // Validate First Name
      const fnVal = fnInput ? fnInput.value.trim() : '';
      if (!fnVal || fnVal.length < 2) {
        setFieldError(fnInput, fnErr, 'Please enter your first name (minimum 2 characters).');
        isValid = false;
        if (!firstInvalid) firstInvalid = fnInput;
      } else {
        clearFieldError(fnInput, fnErr);
      }

      // Validate Last Name
      const lnVal = lnInput ? lnInput.value.trim() : '';
      if (!lnVal || lnVal.length < 2) {
        setFieldError(lnInput, lnErr, 'Please enter your last name (minimum 2 characters).');
        isValid = false;
        if (!firstInvalid) firstInvalid = lnInput;
      } else {
        clearFieldError(lnInput, lnErr);
      }

      // Validate Email
      const emVal = emInput ? emInput.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      if (!emVal || !emailRegex.test(emVal)) {
        setFieldError(emInput, emErr, 'Please enter a valid email address (e.g. name@example.com).');
        isValid = false;
        if (!firstInvalid) firstInvalid = emInput;
      } else {
        clearFieldError(emInput, emErr);
      }

      // Validate Phone
      const phVal = phInput ? phInput.value.replace(/\D/g, '') : '';
      if (!phVal || phVal.length < 7) {
        setFieldError(phInput, phErr, 'Please enter a valid phone number (at least 7 digits).');
        isValid = false;
        if (!firstInvalid) firstInvalid = phInput;
      } else {
        clearFieldError(phInput, phErr);
      }

      // Validate Goal
      const goalVal = goalSelect ? goalSelect.value : '';
      if (!goalVal) {
        setFieldError(goalSelect, goalErr, 'Please select your primary training goal.');
        isValid = false;
        if (!firstInvalid) firstInvalid = goalSelect;
      } else {
        clearFieldError(goalSelect, goalErr);
      }

      if (!isValid) {
        showToast('Please correct the highlighted fields in the consultation form.', 'error');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }

      // Form is valid: redirect into 404 error page ONLY after all valid details are entered
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="capsule-text"><i class="fa-solid fa-spinner fa-spin"></i> Processing Request...</span><span class="capsule-circle-icon"><i class="fa-solid fa-arrow-right"></i></span>';
      }

      window.location.href = '404.html';
      return false;
    };

    consultForm.addEventListener('submit', validateAndSubmitConsultation);
    if (submitBtn) {
      submitBtn.addEventListener('click', validateAndSubmitConsultation);
    }
  }

  // --- 2. Newsletter Forms Across All Pages ---
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.setAttribute('novalidate', 'true');
    const input = form.querySelector('input[type="email"], input[type="text"]');
    const inputGroup = form.querySelector('.newsletter-input-group');
    const submitBtn = form.querySelector('button[type="submit"], button');
    let errEl = form.querySelector('.newsletter-error');

    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'field-error newsletter-error';
      form.appendChild(errEl);
    }

    if (input) {
      input.removeAttribute('required');
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        if (inputGroup) inputGroup.classList.remove('is-invalid');
        errEl.textContent = '';
        errEl.classList.remove('active');
      });
    }

    const validateAndSubmitNewsletter = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const val = input ? input.value.trim() : '';

      // 1. Check if empty
      if (!val) {
        if (input) input.classList.add('is-invalid');
        if (inputGroup) inputGroup.classList.add('is-invalid');
        errEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please enter your email address to subscribe.';
        errEl.classList.add('active');
        showToast('Please enter your email address.', 'error');
        if (input) input.focus();
        return false;
      }

      // 2. Validate valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(val)) {
        if (input) input.classList.add('is-invalid');
        if (inputGroup) inputGroup.classList.add('is-invalid');
        errEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please enter a valid email address (e.g. name@example.com).';
        errEl.classList.add('active');
        showToast('Please enter a valid email address.', 'error');
        if (input) input.focus();
        return false;
      }

      // 3. Email is valid: clear all error states
      if (input) input.classList.remove('is-invalid');
      if (inputGroup) inputGroup.classList.remove('is-invalid');
      errEl.textContent = '';
      errEl.classList.remove('active');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      }

      // 4. Redirect into 404 error page ONLY after valid mail id is entered
      window.location.href = '404.html';
      return false;
    };

    form.addEventListener('submit', validateAndSubmitNewsletter);
    if (submitBtn) {
      submitBtn.addEventListener('click', validateAndSubmitNewsletter);
    }
  });

  // --- 3. Generic Fallback for Any Other AJAX Forms ---
  const genericForms = document.querySelectorAll('form[data-ajax-form]:not(#contact-consult-form):not(.newsletter-form)');
  genericForms.forEach(form => {
    form.setAttribute('novalidate', 'true');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
      }

      setTimeout(() => {
        showToast('Success! Your submission was received.', 'success');
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }
      }, 800);
    });
  });
}

/* ---------------- 13. TOAST NOTIFICATIONS ---------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = 'fa-circle-info';
  let iconColor = '#40a9ff';
  let borderColor = 'rgba(64, 169, 255, 0.35)';

  if (type === 'success') {
    icon = 'fa-circle-check';
    iconColor = 'var(--color-primary)';
    borderColor = 'rgba(186, 238, 38, 0.35)';
  } else if (type === 'warning') {
    icon = 'fa-triangle-exclamation';
    iconColor = '#faad14';
    borderColor = 'rgba(250, 173, 20, 0.35)';
  } else if (type === 'danger' || type === 'error') {
    icon = 'fa-circle-xmark';
    iconColor = '#ff4d4f';
    borderColor = 'rgba(255, 77, 79, 0.35)';
  }

  toast.style.borderColor = borderColor;
  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="color: ${iconColor}; font-size: 1.2rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

window.showToast = showToast;

/* ---------------- 13. SCROLL TO TOP BUTTON ---------------- */
function initScrollToTop() {
  let btn = document.getElementById('scrollToTopBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'scrollToTopBtn';
    btn.className = 'scroll-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.setAttribute('title', 'Scroll to top');
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(btn);
  }

  const handleScroll = () => {
    if (window.scrollY > 80) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ---------------- 14. CTA 3D DUMBBELL PARALLAX ---------------- */
function initCtaParallax() {
  const section = document.querySelector('.guidy-cta-section-exact');
  const dumbbell = document.querySelector('.guidy-cta-floating-dumbbell');
  if (!section || !dumbbell) return;

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    dumbbell.style.transform = `translate3d(${x * 35}px, ${y * 35}px, 0) rotate(${x * 12}deg)`;
  });

  section.addEventListener('mouseleave', () => {
    dumbbell.style.transform = '';
  });
}

