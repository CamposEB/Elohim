/* ==========================================================
   Padaria Elohim — js/main.js
   Lê os dados de js/config.js (window.SITE) e monta a página.
   ========================================================== */
(function () {
  'use strict';

  var S = window.SITE;
  if (!S) return;

  var NS = 'http://www.w3.org/2000/svg';
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function icon(name) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', 'ic');
    s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS(NS, 'use');
    u.setAttribute('href', '#i-' + name);
    s.appendChild(u);
    return s;
  }
  function waLink(msg) {
    return 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(msg || S.messages.general);
  }
  function setLink(a, href, external) {
    a.href = href;
    if (external) { a.target = '_blank'; a.rel = 'noopener'; }
  }

  /* ---------- Imagens: fallback quando a foto não carrega ---------- */
  function guardImage(img) {
    var holder = img.closest('.ph');
    if (!holder) return;
    function fail() { holder.classList.add('img-fail'); }
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
    img.addEventListener('error', fail);
  }
  function makePhoto(data, cls, w, h, lazy) {
    var box = el('div', 'ph' + (cls ? ' ' + cls : ''));
    var img = el('img');
    img.src = data.src;
    img.alt = data.alt || '';
    img.width = w;
    img.height = h;
    img.decoding = 'async';
    if (lazy !== false) img.loading = 'lazy';
    if (data.pos) img.style.objectPosition = data.pos;
    box.appendChild(img);
    guardImage(img);
    return box;
  }

  /* ---------- Links de WhatsApp e dados de contato ---------- */
  $$('[data-wa]').forEach(function (a) {
    var key = a.getAttribute('data-wa');
    var msg = typeof S.messages[key] === 'string' ? S.messages[key] : S.messages.general;
    setLink(a, waLink(msg), true);
  });
  $$('[data-bind="phone"]').forEach(function (n) { n.textContent = S.phoneLabel; });
  $$('[data-bind="tel"]').forEach(function (a) { a.href = 'tel:+' + S.whatsapp; });
  $$('[data-bind="maps"]').forEach(function (a) { setLink(a, S.mapsUrl, true); });
  $$('[data-bind="address"]').forEach(function (n) {
    n.textContent = '';
    S.addressLines.forEach(function (line, i) {
      if (i) n.appendChild(document.createElement('br'));
      n.appendChild(document.createTextNode(line));
    });
  });

  var frame = $('#mapFrame');
  if (frame && S.addressFull) {
    frame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(S.addressFull) + '&output=embed';
  } else if (frame) {
    frame.closest('.map').hidden = true;
  }

  /* horário (oculto se vazio) */
  var hoursItem = $('#hoursItem');
  if (hoursItem) {
    if (S.hours && S.hours.length) {
      var box = $('#hoursList');
      S.hours.forEach(function (h) {
        var row = el('div', 'hours-row');
        row.appendChild(el('span', '', h[0]));
        row.appendChild(el('span', '', h[1]));
        box.appendChild(row);
      });
      hoursItem.hidden = false;
    } else { hoursItem.hidden = true; }
  }

  /* instagram (oculto se vazio) */
  var igUrl = S.instagram ? 'https://instagram.com/' + S.instagram.replace(/^@/, '') : '';
  $$('[data-ig]').forEach(function (n) {
    if (igUrl && n.tagName === 'A') setLink(n, igUrl, true);
    n.hidden = !igUrl;
  });

  /* história (oculta se vazia) */
  var story = $('#aboutStory');
  if (story) {
    if (S.story) { story.textContent = S.story; story.hidden = false; } else { story.hidden = true; }
  }

  /* ---------- Produtos + filtros ---------- */
  var cardsEl = $('#cards');
  var tabsEl = $('#tabs');
  var noteEl = $('#productsNote');
  if (noteEl) { if (S.productsNote) noteEl.textContent = S.productsNote; else noteEl.hidden = true; }

  function catLabel(id) {
    for (var i = 0; i < S.categories.length; i++) if (S.categories[i].id === id) return S.categories[i].label;
    return '';
  }

  if (cardsEl && tabsEl) {
    var cards = [];
    S.products.forEach(function (p) {
      var card = el('article', 'card');
      card.dataset.category = p.category;
      card.appendChild(makePhoto(p.image, '', 800, 600));

      var body = el('div', 'card-body');
      body.appendChild(el('span', 'card-tag', catLabel(p.category)));
      body.appendChild(el('h3', '', p.name));
      body.appendChild(el('p', '', p.description));

      var foot = el('div', 'card-foot');
      if (p.price) foot.appendChild(el('span', 'card-price', 'R$ ' + p.price));
      var a = el('a', 'card-btn');
      setLink(a, waLink(S.messages.product(p.name)), true);
      a.setAttribute('aria-label', 'Consultar ' + p.name + ' pelo WhatsApp');
      a.appendChild(icon('whatsapp'));
      a.appendChild(document.createTextNode(p.price ? 'Pedir' : 'Consultar'));
      foot.appendChild(a);
      body.appendChild(foot);
      card.appendChild(body);
      cardsEl.appendChild(card);
      cards.push(card);
    });

    var used = {};
    S.products.forEach(function (p) { used[p.category] = true; });
    var filters = [{ id: 'all', label: 'Todos' }].concat(S.categories.filter(function (c) { return used[c.id]; }));

    var timer = null;
    function applyFilter(id) {
      $$('.tab', tabsEl).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === id)); });
      clearTimeout(timer);
      var show = [], hide = [];
      cards.forEach(function (c) { (id === 'all' || c.dataset.category === id ? show : hide).push(c); });
      hide.forEach(function (c) { c.classList.add('out'); });
      timer = setTimeout(function () {
        hide.forEach(function (c) { c.hidden = true; });
        show.forEach(function (c) { c.classList.add('out'); c.hidden = false; });
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { show.forEach(function (c) { c.classList.remove('out'); }); });
        });
      }, 240);
    }

    filters.forEach(function (f, i) {
      var b = el('button', 'tab', f.label);
      b.type = 'button';
      b.dataset.filter = f.id;
      b.setAttribute('aria-pressed', String(i === 0));
      b.addEventListener('click', function () { applyFilter(f.id); });
      tabsEl.appendChild(b);
    });
    if (filters.length <= 2) tabsEl.hidden = true;
  }

  /* ---------- Galeria ---------- */
  var galleryEl = $('#galleryGrid');
  if (galleryEl) {
    if (S.gallery && S.gallery.length) {
      S.gallery.forEach(function (g) { galleryEl.appendChild(makePhoto(g, '', 800, 800)); });
    } else { galleryEl.closest('section').hidden = true; }
  }

  /* imagens estáticas do HTML (hero, destaque, sobre) */
  $$('.ph > img').forEach(guardImage);

  /* ---------- Menu mobile ---------- */
  var toggle = $('#navToggle');
  var nav = $('#nav');
  var lastFocused = null;

  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    var use = toggle.querySelector('use');
    if (use) use.setAttribute('href', open ? '#i-xmark' : '#i-bars');
    if (open) {
      lastFocused = document.activeElement;
      var first = nav.querySelector('a, button');
      if (first) first.focus({ preventScroll: true });
    } else if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
      lastFocused = null;
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); toggle.focus(); }
      // Focus trap simples
      if (e.key === 'Tab' && nav.classList.contains('open')) {
        var focusables = $$('a, button', nav).filter(function (n) { return !n.hidden && n.offsetParent !== null; });
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) setNav(false); });
  }

  /* ---------- Header com sombra ---------- */
  var header = $('#header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-spy: link ativo do menu ---------- */
  (function scrollSpy() {
    var links = $$('.nav a[href^="#"]').filter(function (a) { return !a.classList.contains('btn'); });
    if (!links.length) return;
    var pairs = links.map(function (a) {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      return target ? { el: target, link: a } : null;
    }).filter(Boolean);
    if (!pairs.length) return;

    var ticking = false;
    function update() {
      ticking = false;
      var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
      var pos = window.scrollY + headerH + 40;
      var current = pairs[0];
      pairs.forEach(function (p) { if (p.el.offsetTop <= pos) current = p; });
      pairs.forEach(function (p) {
        if (p === current) p.link.setAttribute('aria-current', 'true');
        else p.link.removeAttribute('aria-current');
        p.link.classList.toggle('active', p === current);
      });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ---------- Animações de entrada ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  /* ---------- Ano ---------- */
  $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
})();