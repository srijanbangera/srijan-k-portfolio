(function () {
  'use strict';

  /* Flip this on before anything else: CSS only hides .reveal/.work-card
     elements when this class is present, so if JS never runs, every
     page still shows its full content by default. */
  document.documentElement.classList.add('js-ready');

  /* ---------- sticky header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- homepage hero: cursor spotlight + photo tilt ----------
     Pure progressive enhancement. --mx/--my default to a fixed value in
     CSS (see .hero), so touch devices and reduced-motion users just get
     a static glow/tilt at that resting position — never broken, never
     hidden content, just no motion. Only wires up pointermove on
     hover-capable, fine-pointer devices with no reduced-motion preference. */
  var heroSection = document.getElementById('heroSection');
  var heroPhotoTilt = document.getElementById('heroPhotoTilt');
  if (heroSection) {
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var heroReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canHover && !heroReduceMotion) {
      heroSection.addEventListener('pointermove', function (e) {
        var rect = heroSection.getBoundingClientRect();
        var mx = ((e.clientX - rect.left) / rect.width) * 100;
        var my = ((e.clientY - rect.top) / rect.height) * 100;
        heroSection.style.setProperty('--mx', mx + '%');
        heroSection.style.setProperty('--my', my + '%');

        if (heroPhotoTilt) {
          var cardRect = heroPhotoTilt.getBoundingClientRect();
          var cx = cardRect.left + cardRect.width / 2;
          var cy = cardRect.top + cardRect.height / 2;
          var dx = (e.clientX - cx) / (rect.width / 2);
          var dy = (e.clientY - cy) / (rect.height / 2);
          var rotateY = Math.max(-10, Math.min(10, dx * 14));
          var rotateX = Math.max(-10, Math.min(10, -dy * 14));
          heroPhotoTilt.style.transform = 'rotate(-5deg) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
        }
      });
      heroSection.addEventListener('pointerleave', function () {
        heroSection.style.removeProperty('--mx');
        heroSection.style.removeProperty('--my');
        if (heroPhotoTilt) heroPhotoTilt.style.transform = 'rotate(-5deg)';
      });
    }
  }

  /* ---------- scroll reveal ----------
     .reveal elements are only hidden once .js-ready is present (see CSS),
     so this can never leave content invisible if JS doesn't run. On top
     of that: reduced-motion users and browsers without IntersectionObserver
     get everything revealed immediately, and a timeout force-reveals
     anything the observer misses (fast programmatic scrolls, fragment
     links) so nothing can get permanently stuck hidden. */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
      revealEls.forEach(function (el) { io.observe(el); });

      window.setTimeout(function () {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      }, 2000);
    }
  }

  /* ---------- work page: filters ---------- */
  var filterBar = document.getElementById('filters');
  var workGrid = document.getElementById('workGrid');
  if (filterBar && workGrid) {
    var cards = workGrid.querySelectorAll('.work-card');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      cards.forEach(function (card) {
        var cats = (card.dataset.category || '').split(' ');
        var show = filter === 'all' || cats.indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !show);
        /* A card newly shown by a filter click might never have crossed the
           IntersectionObserver's threshold (e.g. it was display:none since
           load). Reveal it immediately rather than leaving it invisible
           until the next scroll. */
        if (show) card.classList.add('is-visible');
      });
    });
  }

  /* ---------- work page: lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && workGrid) {
    var lbImg = document.getElementById('lightboxImg');
    var lbCaption = document.getElementById('lightboxCaption');
    var lbClose = document.getElementById('lightboxClose');

    function openLightbox(href, caption) {
      lbImg.src = href;
      lbImg.alt = caption || '';
      lbCaption.textContent = caption || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    workGrid.querySelectorAll('.thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(thumb.getAttribute('href'), thumb.dataset.caption);
      });
    });
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------- contact page: mailto form ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();
      var status = document.getElementById('formStatus');

      var subject = encodeURIComponent('New project inquiry from ' + name);
      var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      var mailto = 'mailto:srijanbangerak@gmail.com?subject=' + subject + '&body=' + body;

      window.location.href = mailto;
      if (status) status.textContent = 'Opening your email app…';
    });
  }
})();
