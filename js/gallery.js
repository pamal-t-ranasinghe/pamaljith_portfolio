/* Gallery data and behaviour.
   To add a screenshot: put the image in images/gallery/ and add one entry below.
   group is "personal" or "industrial". Filter tabs appear automatically for the groups that have images. */
(function () {
  var GALLERY = [
    { src: 'images/gallery/classhub-teacher-profile-wizard.png', project: 'ClassHub', group: 'personal',
      title: 'Teacher profile wizard',
      caption: 'Step-by-step profile setup for teachers and institutes: details, advertisement banner and subscription plan.' },
    { src: 'images/gallery/classhub-signup.png', project: 'ClassHub', group: 'personal',
      title: 'Create account',
      caption: 'Sign-up with district and city lookups for Sri Lankan students and teachers.' },
    { src: 'images/gallery/classhub-signin.png', project: 'ClassHub', group: 'personal',
      title: 'Sign in',
      caption: 'Token-based sign-in with role-aware redirects for students, teachers and institutes.' },
    { src: 'images/gallery/billbook-billing.png', project: 'BillBook', group: 'personal',
      title: 'Billing',
      caption: 'Keyboard-first billing: search or scan items, quantity prompt, discounts, credit sales and print, all from shortcuts.' },
    { src: 'images/gallery/billbook-inventory.png', project: 'BillBook', group: 'personal',
      title: 'Inventory',
      caption: 'Stock value, low-stock and expiry alerts, margins and suppliers, with Sinhala item names supported.' },
    { src: 'images/gallery/billbook-reports.png', project: 'BillBook', group: 'personal',
      title: 'Reports',
      caption: 'A catalogue of sales, profit, stock and customer reports with charts and Excel export. Shown with demo data.' },
    { src: 'images/gallery/billbook-profit.png', project: 'BillBook', group: 'personal',
      title: 'Profit',
      caption: 'Pure profit after cost of goods, gifts, losses, expenses and cash differences, by day. Shown with demo data.' },
    { src: 'images/gallery/billbook-login.png', project: 'BillBook', group: 'personal',
      title: 'Sign in',
      caption: 'Desktop POS sign-in, with an offline mode for when the shop internet is down.' },
    { src: 'images/gallery/hitad-home.png', project: 'Hitad.lk', group: 'industrial',
      title: 'Classified ads home',
      caption: 'Sri Lanka classified marketplace with category browsing and keyword search.' },
    { src: 'images/gallery/hitad-print-booking.png', project: 'Hitad Print', group: 'industrial',
      title: 'Print ad booking',
      caption: 'Multi-step booking for newspaper ads: details, confirmation and payment, with a live price summary.' }
  ];

  var LABELS = { all: 'All', personal: 'Personal projects', industrial: 'Industrial projects' };
  var grid = document.getElementById('gallery-grid');
  var filters = document.getElementById('gallery-filters');
  var box = document.getElementById('lightbox');
  if (!grid || !filters || !box || !GALLERY.length) return;

  var current = 'all';
  var shown = [];
  var index = 0;
  var lastFocus = null;

  function visible() {
    return GALLERY.filter(function (g) { return current === 'all' || g.group === current; });
  }

  function renderFilters() {
    var groups = ['all'];
    ['personal', 'industrial'].forEach(function (g) {
      if (GALLERY.some(function (x) { return x.group === g; })) groups.push(g);
    });
    filters.innerHTML = '';
    if (groups.length < 3) return;                     // only one kind of project: no tabs needed
    groups.forEach(function (g) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip-btn' + (g === current ? ' active' : '');
      b.textContent = LABELS[g];
      b.addEventListener('click', function () { current = g; renderFilters(); renderGrid(); });
      filters.appendChild(b);
    });
  }

  function renderGrid() {
    shown = visible();
    grid.innerHTML = '';
    shown.forEach(function (g, i) {
      var fig = document.createElement('button');
      fig.type = 'button';
      fig.className = 'shot';
      fig.setAttribute('aria-label', 'Open ' + g.project + ': ' + g.title);
      var img = document.createElement('img');
      img.src = g.src; img.alt = g.project + ' - ' + g.title; img.loading = 'lazy';
      var cap = document.createElement('span');
      cap.className = 'shot-cap';
      cap.innerHTML = '<b></b><i></i>';
      cap.firstChild.textContent = g.project;
      cap.lastChild.textContent = g.title;
      fig.appendChild(img); fig.appendChild(cap);
      fig.addEventListener('click', function () { open(i); });
      grid.appendChild(fig);
    });
  }

  var lbImg = box.querySelector('.lb-img');
  var lbTitle = box.querySelector('.lb-title');
  var lbText = box.querySelector('.lb-text');

  function show(i) {
    index = (i + shown.length) % shown.length;
    var g = shown[index];
    lbImg.src = g.src; lbImg.alt = g.project + ' - ' + g.title;
    lbTitle.textContent = g.project + ' · ' + g.title;
    lbText.textContent = g.caption || '';
    box.classList.toggle('single', shown.length < 2);
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i); box.hidden = false; document.body.classList.add('no-scroll');
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.hidden = true; document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });

  renderFilters();
  renderGrid();
})();
