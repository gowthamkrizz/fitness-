/**
 * STACKLY FITNESS - DASHBOARD SCRIPTS (ADMIN & CUSTOMER)
 * Interactive charts, filterable member tables with live search, meal checklist,
 * coach chat simulation, interactive modals (Add Member & Book Session),
 * dynamic user session greeting, and mobile navigation support.
 */

document.addEventListener('DOMContentLoaded', () => {
  initUserProfile();
  initDashboardCharts();
  initDashboardTabs();
  initTableFilters();
  initDashboardSearch();
  initMealChecklist();
  initCoachChat();
  initDashboardModals();
  initNotificationBells();
  initMobileSidebar();
  initLogoutHandler();
});

function initLogoutHandler() {
  document.querySelectorAll('a[href="login.html"]').forEach(link => {
    if (link.textContent.includes('Log Out')) {
      link.addEventListener('click', () => {
        try {
          localStorage.removeItem('stackly_current_user');
        } catch (e) {}
      });
    }
  });
}

/* ---------------- 0. DYNAMIC USER PROFILE ---------------- */
function initUserProfile() {
  let currentUser = null;
  try {
    const raw = localStorage.getItem('stackly_current_user');
    if (raw) currentUser = JSON.parse(raw);
  } catch (e) {
    currentUser = null;
  }

  // Customer Dashboard Profile Elements
  const custGreeting = document.getElementById('customer-greeting');
  const custStreak = document.getElementById('customer-streak');
  const custProfName = document.getElementById('customer-profile-name');
  const custProfEmail = document.getElementById('customer-profile-email') || document.getElementById('customer-profile-tier');

  // Admin Dashboard Profile Elements
  const adminProfName = document.getElementById('admin-profile-name');
  const adminProfEmail = document.getElementById('admin-profile-email') || document.getElementById('admin-profile-role');

  if (currentUser) {
    const enteredName = currentUser.fullName || 
      [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ') || 
      currentUser.name || 
      (currentUser.email ? currentUser.email.split('@')[0] : 'Member');
    const enteredEmail = currentUser.email || '';

    // Update Customer Dashboard Profile Area (Name & Email ID only)
    if (custGreeting) {
      const firstName = currentUser.firstName || (enteredName ? enteredName.split(' ')[0] : 'Member');
      custGreeting.textContent = `WELCOME BACK, ${firstName.toUpperCase()}!`;
    }
    if (custStreak && currentUser.plan) {
      custStreak.textContent = `${currentUser.plan} • 4 Days Streak 🔥`;
    }
    if (custProfName && enteredName) {
      custProfName.textContent = enteredName;
    }
    if (custProfEmail && enteredEmail) {
      custProfEmail.textContent = enteredEmail;
    }

    // Update Admin Dashboard Profile Area (Name & Email ID only)
    if (adminProfName && enteredName) {
      adminProfName.textContent = enteredName;
    }
    if (adminProfEmail && enteredEmail) {
      adminProfEmail.textContent = enteredEmail;
    }
  } else {
    // Default fallback values showing Name & Email ID only
    if (custProfName && !custProfName.textContent.trim()) {
      custProfName.textContent = 'Alex Mercer';
    }
    if (custProfEmail && !custProfEmail.textContent.trim()) {
      custProfEmail.textContent = 'alex.athlete@stackly.com';
    }

    if (adminProfName && !adminProfName.textContent.trim()) {
      adminProfName.textContent = 'Marcus Vance';
    }
    if (adminProfEmail && !adminProfEmail.textContent.trim()) {
      adminProfEmail.textContent = 'admin@stacklyfitness.com';
    }
  }
}

/* ---------------- 1. DASHBOARD CHARTS ---------------- */
function initDashboardCharts() {
  // Admin Revenue & Attendance SVG Chart
  const adminChartWrap = document.querySelector('#admin-analytics-chart');
  if (adminChartWrap) {
    adminChartWrap.innerHTML = createSvgBarChart([
      { label: 'Jan', val1: 42, val2: 55 },
      { label: 'Feb', val1: 58, val2: 68 },
      { label: 'Mar', val1: 65, val2: 80 },
      { label: 'Apr', val1: 78, val2: 92 },
      { label: 'May', val1: 82, val2: 105 },
      { label: 'Jun', val1: 95, val2: 120 },
      { label: 'Jul', val1: 110, val2: 135 }
    ]);
  }

  // Customer Progression Chart
  const customerChartWrap = document.querySelector('#customer-progression-chart');
  if (customerChartWrap) {
    customerChartWrap.innerHTML = createSvgLineChart([
      { week: 'W1', weight: 78.0, strength: 60 },
      { week: 'W2', weight: 77.4, strength: 65 },
      { week: 'W3', weight: 76.8, strength: 70 },
      { week: 'W4', weight: 76.1, strength: 72 },
      { week: 'W5', weight: 75.5, strength: 77 },
      { week: 'W6', weight: 74.9, strength: 82 },
      { week: 'W7', weight: 74.4, strength: 85 },
      { week: 'W8', weight: 74.0, strength: 90 }
    ]);
  }
}

function createSvgBarChart(data) {
  const width = 800;
  const height = 240;
  const padBottom = 30;
  const padLeft = 40;
  const barWidth = 24;
  const chartHeight = height - padBottom;
  const maxVal = 150;
  const stepX = (width - padLeft) / data.length;

  let bars = '';
  data.forEach((d, i) => {
    const x = padLeft + (i * stepX) + 20;
    const h1 = (d.val1 / maxVal) * (chartHeight - 20);
    const h2 = (d.val2 / maxVal) * (chartHeight - 20);
    const y1 = chartHeight - h1;
    const y2 = chartHeight - h2;

    bars += `
      <!-- Bar 1: Secondary -->
      <rect x="${x}" y="${y1}" width="${barWidth}" height="${h1}" fill="#333838" rx="2" />
      <!-- Bar 2: Primary Lime -->
      <rect x="${x + barWidth + 4}" y="${y2}" width="${barWidth}" height="${h2}" fill="#BAEE26" rx="2" />
      <!-- Label -->
      <text x="${x + barWidth}" y="${height - 8}" fill="#979E9E" font-size="12" text-anchor="middle" font-family="'Big Shoulders Display', sans-serif" font-weight="700">${d.label}</text>
    `;
  });

  return `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%;">
      <!-- Grid lines -->
      <line x1="${padLeft}" y1="20" x2="${width}" y2="20" stroke="#1f2323" stroke-dasharray="4" />
      <line x1="${padLeft}" y1="80" x2="${width}" y2="80" stroke="#1f2323" stroke-dasharray="4" />
      <line x1="${padLeft}" y1="140" x2="${width}" y2="140" stroke="#1f2323" stroke-dasharray="4" />
      <line x1="${padLeft}" y1="${chartHeight}" x2="${width}" y2="${chartHeight}" stroke="#2e3434" />
      ${bars}
    </svg>
  `;
}

function createSvgLineChart(data) {
  const width = 800;
  const height = 240;
  const pad = 40;
  const chartW = width - (pad * 2);
  const chartH = height - (pad * 2);
  const stepX = chartW / (data.length - 1);

  const strengthPoints = data.map((d, i) => {
    const x = pad + (i * stepX);
    const y = pad + chartH - ((d.strength - 50) / 50) * chartH;
    return `${x},${y}`;
  }).join(' ');

  const weightPoints = data.map((d, i) => {
    const x = pad + (i * stepX);
    const y = pad + chartH - ((d.weight - 70) / 10) * chartH;
    return `${x},${y}`;
  }).join(' ');

  let labels = '';
  data.forEach((d, i) => {
    const x = pad + (i * stepX);
    labels += `<text x="${x}" y="${height - 10}" fill="#979E9E" font-size="12" text-anchor="middle" font-family="'Big Shoulders Display', sans-serif" font-weight="700">${d.week}</text>`;
  });

  return `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%;">
      <line x1="${pad}" y1="${pad}" x2="${width - pad}" y2="${pad}" stroke="#1f2323" stroke-dasharray="4" />
      <line x1="${pad}" y1="${pad + (chartH/2)}" x2="${width - pad}" y2="${pad + (chartH/2)}" stroke="#1f2323" stroke-dasharray="4" />
      <line x1="${pad}" y1="${pad + chartH}" x2="${width - pad}" y2="${pad + chartH}" stroke="#2e3434" />
      
      <!-- Strength Line (Lime) -->
      <polyline fill="none" stroke="#BAEE26" stroke-width="3" stroke-linecap="round" points="${strengthPoints}" />
      
      <!-- Weight Line (White) -->
      <polyline fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="5" stroke-linecap="round" points="${weightPoints}" />

      ${labels}
    </svg>
  `;
}

/* ---------------- 2. DASHBOARD TABS NAVIGATION ---------------- */
let activeTabId = 'overview-section';

const tabPlaceholders = {
  'overview-section': 'Search across all club content, members, schedules...',
  'members-section': 'Search members by name, email, tier, or coach...',
  'schedules-section': 'Search schedules by class, coach, or studio...',
  'trainers-section': 'Search trainers by coach name, specialty, rating...',
  'blog-section': 'Search blog articles by title, topic, or author...',
  'orders-section': 'Search store orders by ID, member, item, or status...'
};

function switchDashboardTab(rawTabId) {
  if (!rawTabId) rawTabId = 'overview-section';
  let targetId = rawTabId.replace(/^#/, '');

  // Alias mappings for clean navigation
  if (targetId === 'schedule-section' || targetId === 'schedules' || targetId === 'schedule') {
    targetId = 'schedules-section';
  } else if (targetId === 'overview') {
    targetId = 'overview-section';
  } else if (targetId === 'members') {
    targetId = 'members-section';
  } else if (targetId === 'trainers') {
    targetId = 'trainers-section';
  } else if (targetId === 'blog' || targetId === 'articles') {
    targetId = 'blog-section';
  } else if (targetId === 'orders' || targetId === 'shop') {
    targetId = 'orders-section';
  }

  const tabContents = document.querySelectorAll('.dash-tab-content');
  const menuItems = document.querySelectorAll('.dashboard-sidebar .dash-menu-item[data-tab]');
  if (!tabContents.length) return;

  let found = false;
  tabContents.forEach(tab => {
    if (tab.id === targetId) {
      tab.classList.add('active');
      found = true;
    } else {
      tab.classList.remove('active');
    }
  });

  if (!found && tabContents[0]) {
    tabContents[0].classList.add('active');
    targetId = tabContents[0].id;
  }

  activeTabId = targetId;

  menuItems.forEach(item => {
    const itemTab = item.getAttribute('data-tab');
    if (itemTab === targetId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Dynamically update search input placeholder based on the active content section
  const searchInput = document.getElementById('admin-search-input');
  if (searchInput && tabPlaceholders[targetId]) {
    searchInput.placeholder = tabPlaceholders[targetId];
  }

  // Hide search dropdown if open
  const dropdown = document.getElementById('admin-search-dropdown');
  if (dropdown) dropdown.style.display = 'none';

  // Apply search query to the newly opened tab
  applyActiveTabFilters();
}

function initDashboardTabs() {
  const menuItems = document.querySelectorAll('.dashboard-sidebar .dash-menu-item[data-tab]');
  const tabContents = document.querySelectorAll('.dash-tab-content');
  if (!menuItems.length || !tabContents.length) return;

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');
      if (targetTab) {
        history.replaceState(null, '', `#${targetTab}`);
        switchDashboardTab(targetTab);
      }
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) switchDashboardTab(hash);
  });

  // Initial tab from URL hash or default to overview
  const initialHash = window.location.hash ? window.location.hash.substring(1) : 'overview-section';
  switchDashboardTab(initialHash);
}

/* ---------------- 3. MULTI-SECTION TABLE FILTERING ---------------- */
const filterGroupState = {
  members: 'all',
  schedules: 'all',
  trainers: 'all',
  blog: 'all',
  orders: 'all'
};

let currentSearchQuery = '';

function applyActiveTabFilters() {
  const query = currentSearchQuery.trim().toLowerCase();

  // 1. Members Table Filter
  const memberRows = document.querySelectorAll('#members-table-body .member-data-row');
  const memberStatus = filterGroupState.members;
  memberRows.forEach(row => {
    const status = row.getAttribute('data-status') || '';
    const text = row.textContent.toLowerCase();
    const matchesStatus = (memberStatus === 'all' || status === memberStatus);
    const matchesQuery = (!query || text.includes(query));
    row.style.display = (matchesStatus && matchesQuery) ? '' : 'none';
  });

  // 2. Schedules Table Filter
  const scheduleRows = document.querySelectorAll('#schedules-table-body .schedule-data-row');
  const scheduleStatus = filterGroupState.schedules;
  scheduleRows.forEach(row => {
    const status = row.getAttribute('data-status') || '';
    const text = row.textContent.toLowerCase();
    const matchesStatus = (scheduleStatus === 'all' || status === scheduleStatus);
    const matchesQuery = (!query || text.includes(query));
    row.style.display = (matchesStatus && matchesQuery) ? '' : 'none';
  });

  // 3. Trainers Table Filter
  const trainerRows = document.querySelectorAll('#trainers-table-body .trainer-data-row');
  const trainerStatus = filterGroupState.trainers;
  trainerRows.forEach(row => {
    const status = row.getAttribute('data-status') || '';
    const text = row.textContent.toLowerCase();
    const matchesStatus = (trainerStatus === 'all' || status === trainerStatus);
    const matchesQuery = (!query || text.includes(query));
    row.style.display = (matchesStatus && matchesQuery) ? '' : 'none';
  });

  // 4. Blog Table Filter
  const blogRows = document.querySelectorAll('#blog-table-body .blog-data-row');
  const blogStatus = filterGroupState.blog;
  blogRows.forEach(row => {
    const status = row.getAttribute('data-status') || '';
    const text = row.textContent.toLowerCase();
    const matchesStatus = (blogStatus === 'all' || status === blogStatus);
    const matchesQuery = (!query || text.includes(query));
    row.style.display = (matchesStatus && matchesQuery) ? '' : 'none';
  });

  // 5. Orders Table Filter
  const orderRows = document.querySelectorAll('#orders-table-body .order-data-row');
  const orderStatus = filterGroupState.orders;
  orderRows.forEach(row => {
    const status = row.getAttribute('data-status') || '';
    const text = row.textContent.toLowerCase();
    const matchesStatus = (orderStatus === 'all' || status === orderStatus);
    const matchesQuery = (!query || text.includes(query));
    row.style.display = (matchesStatus && matchesQuery) ? '' : 'none';
  });
}

function initTableFilters() {
  const filterBtns = document.querySelectorAll('.dash-filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-filter-group') || 'members';
      const status = btn.getAttribute('data-status') || 'all';

      // Update active style among siblings in same filter group
      const siblingBtns = document.querySelectorAll(`.dash-filter-btn[data-filter-group="${group}"]`);
      siblingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filterGroupState[group] = status;
      applyActiveTabFilters();
    });
  });

  // Delete row button delegation - redirect to 404 error
  document.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.btn-delete-row');
    if (delBtn) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });

  // Trigger Add Member button delegation - redirect to 404 error
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-trigger-add-member');
    if (trigger) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });
}

/* ---------------- 4. CONTENT-RELATED SEARCH & LIVE DROPDOWN ---------------- */
function initDashboardSearch() {
  const searchInput = document.getElementById('admin-search-input');
  const clearBtn = document.getElementById('admin-search-clear');
  const dropdown = document.getElementById('admin-search-dropdown');
  if (!searchInput) return;

  function performContentSearch() {
    currentSearchQuery = searchInput.value.trim().toLowerCase();

    // Toggle clear button
    if (clearBtn) {
      clearBtn.style.display = currentSearchQuery.length > 0 ? 'inline-block' : 'none';
    }

    // Live filter current active view
    applyActiveTabFilters();

    // Build global cross-content search dropdown
    if (!dropdown) return;

    if (!currentSearchQuery) {
      dropdown.style.display = 'none';
      dropdown.innerHTML = '';
      return;
    }

    const query = currentSearchQuery;
    const results = [];

    // 1. Scan Members
    const memberRows = document.querySelectorAll('#members-table-body .member-data-row');
    memberRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        const nameEl = row.querySelector('strong');
        const emailEl = row.querySelectorAll('td')[1];
        const tierEl = row.querySelector('.badge');
        results.push({
          category: 'Members',
          categoryIcon: 'fa-users',
          tabId: 'members-section',
          title: nameEl ? nameEl.textContent.trim() : 'Member',
          sub: (emailEl ? emailEl.textContent.trim() : '') + (tierEl ? ' • ' + tierEl.textContent.trim() : ''),
          tag: 'Member'
        });
      }
    });

    // 2. Scan Schedules
    const scheduleRows = document.querySelectorAll('#schedules-table-body .schedule-data-row');
    scheduleRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        const timeEl = row.querySelector('td:nth-child(1) strong');
        const nameEl = row.querySelector('td:nth-child(2) strong');
        const coachEl = row.querySelector('td:nth-child(4) span');
        results.push({
          category: 'Schedules',
          categoryIcon: 'fa-calendar-days',
          tabId: 'schedules-section',
          title: nameEl ? nameEl.textContent.trim() : 'Class',
          sub: (timeEl ? timeEl.textContent.trim() : '') + (coachEl ? ' • Coach ' + coachEl.textContent.trim() : ''),
          tag: 'Class Slot'
        });
      }
    });

    // 3. Scan Trainers
    const trainerRows = document.querySelectorAll('#trainers-table-body .trainer-data-row');
    trainerRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        const nameEl = row.querySelector('strong');
        const specEl = row.querySelectorAll('td')[1];
        results.push({
          category: 'Trainers',
          categoryIcon: 'fa-dumbbell',
          tabId: 'trainers-section',
          title: nameEl ? nameEl.textContent.trim() : 'Coach',
          sub: specEl ? specEl.textContent.trim() : 'Performance Coach',
          tag: 'Coach'
        });
      }
    });

    // 4. Scan Blog Articles
    const blogRows = document.querySelectorAll('#blog-table-body .blog-data-row');
    blogRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        const titleEl = row.querySelector('strong');
        const catEl = row.querySelector('.badge');
        results.push({
          category: 'Blog Articles',
          categoryIcon: 'fa-newspaper',
          tabId: 'blog-section',
          title: titleEl ? titleEl.textContent.trim() : 'Article',
          sub: catEl ? catEl.textContent.trim() : 'Health & Training',
          tag: 'Editorial'
        });
      }
    });

    // 5. Scan Store Orders
    const orderRows = document.querySelectorAll('#orders-table-body .order-data-row');
    orderRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        const idEl = row.querySelector('td:nth-child(1) strong');
        const custEl = row.querySelector('td:nth-child(2) strong');
        const itemEl = row.querySelector('td:nth-child(3) strong');
        results.push({
          category: 'Store Orders',
          categoryIcon: 'fa-cart-shopping',
          tabId: 'orders-section',
          title: (idEl ? idEl.textContent.trim() + ' • ' : '') + (custEl ? custEl.textContent.trim() : 'Order'),
          sub: itemEl ? itemEl.textContent.trim() : '',
          tag: 'Order'
        });
      }
    });

    if (results.length === 0) {
      dropdown.innerHTML = `
        <div class="dash-search-empty-msg">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 1.6rem; color: var(--color-primary); margin-bottom: 8px; display: block;"></i>
          No club content found matching "<strong>${escapeHtml(query)}</strong>"
          <div style="font-size: 0.8rem; margin-top: 4px; color: var(--color-text-light);">Try searching for members, coach names, class times, orders, or article titles.</div>
        </div>
      `;
      dropdown.style.display = 'block';
      return;
    }

    // Group results by category
    const grouped = {};
    results.forEach(res => {
      if (!grouped[res.category]) grouped[res.category] = [];
      if (grouped[res.category].length < 3) {
        grouped[res.category].push(res);
      }
    });

    let html = '';
    for (const [catName, items] of Object.entries(grouped)) {
      const icon = items[0].categoryIcon || 'fa-tag';
      html += `<div class="dash-search-category-title"><i class="fa-solid ${icon}"></i> ${catName} (${items.length})</div>`;
      items.forEach((item, idx) => {
        html += `
          <div class="dash-search-result-item" data-tab-id="${item.tabId}">
            <div class="dash-search-result-info">
              <span class="dash-search-result-name">${highlightMatch(escapeHtml(item.title), query)}</span>
              <span class="dash-search-result-desc">${escapeHtml(item.sub)}</span>
            </div>
            <span class="dash-search-result-tag">${item.tag}</span>
          </div>
        `;
      });
    }

    dropdown.innerHTML = html;
    dropdown.style.display = 'block';

    // Click handler for dropdown results
    dropdown.querySelectorAll('.dash-search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const targetTab = el.getAttribute('data-tab-id');
        const matchTitle = el.querySelector('.dash-search-result-name').textContent;
        dropdown.style.display = 'none';

        // Switch to the target tab
        switchDashboardTab(targetTab);

        // Highlight matching item row in that tab
        setTimeout(() => {
          let targetRow = null;
          const rowsInTab = document.querySelectorAll(`#${targetTab} tbody tr`);
          rowsInTab.forEach(r => {
            if (r.textContent.includes(matchTitle.replace(/…/g, ''))) {
              targetRow = r;
            }
          });
          if (targetRow) {
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetRow.classList.add('row-highlight-flash');
            setTimeout(() => targetRow.classList.remove('row-highlight-flash'), 2000);
          }
        }, 150);
      });
    });
  }

  searchInput.addEventListener('input', performContentSearch);

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) {
      performContentSearch();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      clearBtn.style.display = 'none';
      dropdown.style.display = 'none';
      applyActiveTabFilters();
      searchInput.focus();
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dash-search')) {
      if (dropdown) dropdown.style.display = 'none';
    }
  });

  // Close dropdown on Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (dropdown) dropdown.style.display = 'none';
    }
  });
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<span class="search-highlight">$1</span>');
}

function updateActiveMemberCount() {
  const countEl = document.getElementById('admin-active-members-count');
  if (!countEl) return;
  const activeRows = document.querySelectorAll('.member-data-row[data-status="active"]');
  // Baseline count + visible additions
  countEl.textContent = (3420 + activeRows.length).toLocaleString();
}

/* ---------------- 3. CUSTOMER MEAL CHECKLIST ---------------- */
function initMealChecklist() {
  const checkboxes = document.querySelectorAll('.meal-checkbox');
  const calCountEl = document.querySelector('#calories-consumed');
  if (!checkboxes.length || !calCountEl) return;

  const updateCalories = () => {
    let sum = 0;
    checkboxes.forEach(cb => {
      const parent = cb.closest('.meal-item');
      const cals = parseInt(cb.getAttribute('data-cals') || 0, 10);
      if (cb.checked) {
        sum += cals;
        if (parent) parent.style.opacity = '0.5';
      } else {
        if (parent) parent.style.opacity = '1';
      }
    });
    calCountEl.textContent = `${sum} kcal`;
  };

  checkboxes.forEach(cb => cb.addEventListener('change', updateCalories));
}

/* ---------------- 4. COACH CHAT SIMULATION ---------------- */
function initCoachChat() {
  const chatForm = document.querySelector('#coach-chat-form');
  const chatInput = document.querySelector('#coach-chat-input');
  const messagesBox = document.querySelector('#coach-messages-box');

  if (!chatForm || !chatInput || !messagesBox) return;

  chatInput.addEventListener('input', () => {
    chatInput.classList.remove('is-invalid');
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = '404.html';
  });
}

/* ---------------- 5. INTERACTIVE DASHBOARD MODALS & 404 REDIRECTS ---------------- */
function initDashboardModals() {
  // --- Admin: Add Member Modal ---
  const addMemberBtn = document.getElementById('btn-add-member-modal');
  const addMemberModal = document.getElementById('add-member-modal');
  const closeMemberModalBtn = document.getElementById('close-member-modal-btn');
  const cancelMemberModalBtn = document.getElementById('cancel-member-modal-btn');
  const addMemberForm = document.getElementById('add-member-form');

  if (addMemberBtn) {
    addMemberBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

  if (addMemberModal) {
    if (closeMemberModalBtn) {
      closeMemberModalBtn.addEventListener('click', () => addMemberModal.classList.remove('active'));
    }
    if (cancelMemberModalBtn) {
      cancelMemberModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
    if (addMemberForm) {
      addMemberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
  }

  // --- Customer: Book Session Modal ---
  const bookSessionBtn = document.getElementById('btn-book-session-modal');
  const bookSessionModal = document.getElementById('book-session-modal');
  const closeBookModalBtn = document.getElementById('close-book-modal-btn');
  const cancelBookModalBtn = document.getElementById('cancel-book-modal-btn');
  const bookSessionForm = document.getElementById('book-session-form');

  if (bookSessionBtn) {
    bookSessionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

  if (bookSessionModal) {
    if (closeBookModalBtn) {
      closeBookModalBtn.addEventListener('click', () => bookSessionModal.classList.remove('active'));
    }
    if (cancelBookModalBtn) {
      cancelBookModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
    if (bookSessionForm) {
      bookSessionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
  }

  // Global delegation for all section content action buttons to guarantee 404 redirect
  document.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('.dashboard-content .btn, .dashboard-content button, .dash-modal-footer .btn');
    if (!actionBtn) return;

    // Do NOT redirect table filter buttons or mobile sidebar toggle
    if (actionBtn.classList.contains('dash-filter-btn') || actionBtn.classList.contains('shop-pill') || actionBtn.id === 'sidebar-toggle-btn') {
      return;
    }

    e.preventDefault();
    window.location.href = '404.html';
  });
}

/* ---------------- 6. NOTIFICATION BELL INTERACTIONS ---------------- */
function initNotificationBells() {
  const customerBell = document.getElementById('customer-bell-btn');
  const adminBell = document.getElementById('admin-bell-btn');

  if (customerBell) {
    customerBell.addEventListener('click', () => {
      if (window.showToast) {
        window.showToast('You have 2 upcoming sessions this week and 1 coach note from Rory Webster!', 'info');
      }
    });
  }

  if (adminBell) {
    adminBell.addEventListener('click', () => {
      if (window.showToast) {
        window.showToast('3 new membership registrations received today. Floor capacity is 84%.', 'info');
      }
    });
  }
}

/* ---------------- 7. MOBILE SIDEBAR TOGGLE ---------------- */
function initMobileSidebar() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = sidebar.style.display === 'none';
    sidebar.style.display = isHidden ? 'flex' : 'none';
    toggleBtn.innerHTML = isHidden ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  // Responsive reset on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
      sidebar.style.display = 'flex';
      toggleBtn.style.display = 'none';
    } else {
      toggleBtn.style.display = 'inline-block';
    }
  });

  if (window.innerWidth <= 991) {
    toggleBtn.style.display = 'inline-block';
  } else {
    toggleBtn.style.display = 'none';
  }
}

// Utility HTML escaper
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
