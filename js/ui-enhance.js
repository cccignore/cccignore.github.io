(function () {
  var revealObserver;
  var TRANSPARENT_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  var REVEAL_SELECTOR = [
    '.recent-post-item',
    '.learning-card',
    '.quick-link-card',
    '.info-panel',
    '.path-article-card',
    '.resource-card',
    '.link-guideline-card',
    '.friend-card',
    '.series-navigation__action',
    '.series-navigation__track-item'
  ].join(',');

  function markPageReady() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('site-motion-ready');
        document.body.classList.remove('is-pjax-transitioning');
      });
    });
  }

  function resetPageMotion() {
    document.body.classList.remove('site-motion-ready');
    markPageReady();
  }

  function handlePjaxSend() {
    document.body.classList.add('is-pjax-transitioning');
    document.body.classList.remove('site-motion-ready');
  }

  function bindReveal() {
    var elements = document.querySelectorAll(REVEAL_SELECTOR);

    if (revealObserver) revealObserver.disconnect();

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (element) {
        element.classList.add('is-visible');
      });
      return;
    }

    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    elements.forEach(function (element, index) {
      element.classList.remove('is-visible');
      element.style.setProperty('--reveal-delay', Math.min(index, 10) * 55 + 'ms');
      revealObserver.observe(element);
    });
  }

  function isRealImageLoaded(image) {
    var lazySrc = image.getAttribute('data-lazy-src');
    var currentSrc = image.currentSrc || image.getAttribute('src') || '';

    if (!lazySrc) return image.complete && image.naturalWidth > 0;
    if (!currentSrc || currentSrc === TRANSPARENT_GIF) return false;

    return currentSrc === lazySrc || currentSrc.indexOf(lazySrc) !== -1 || !image.hasAttribute('data-lazy-src');
  }

  function enhanceImage(image) {
    if (image.dataset.enhanced === 'true') return;

    image.dataset.enhanced = 'true';
    image.classList.add('image-fade');

    var onLoad = function () {
      if (!isRealImageLoaded(image)) return;
      image.classList.add('is-loaded');
    };

    if (isRealImageLoaded(image)) {
      onLoad();
    } else {
      image.addEventListener('load', onLoad);
      image.addEventListener('error', function () {
        image.classList.add('is-loaded');
      });
    }
  }

  function bindImageMotion() {
    document.querySelectorAll('#article-container img, .recent-post-item img, .learning-card img, .friend-card img').forEach(enhanceImage);
  }

  // --- Count-up animation for .home-status__stat[data-target] ---
  var countUpObserver;

  function bindCountUp() {
    var stats = document.querySelectorAll('.home-status__stat[data-target]');
    if (!stats.length) return;

    if (countUpObserver) countUpObserver.disconnect();

    if (!('IntersectionObserver' in window)) {
      stats.forEach(function (el) {
        var numEl = el.querySelector('.home-status__stat-num');
        if (numEl) numEl.textContent = el.dataset.target;
      });
      return;
    }

    countUpObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUpObserver.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.dataset.target, 10) || 0;
        var numEl = el.querySelector('.home-status__stat-num');
        if (!numEl) return;
        var duration = 1100;
        var startTime = null;
        function step(now) {
          if (!startTime) startTime = now;
          var elapsed = now - startTime;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          numEl.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.3 });

    stats.forEach(function (el) { countUpObserver.observe(el); });
  }

  // --- Progress bar animation for .home-status__bar-fill ---
  var barObserver;

  function bindStatusBars() {
    var bars = document.querySelectorAll('.home-status__bar-fill');
    if (!bars.length) return;

    if (barObserver) barObserver.disconnect();

    if (!('IntersectionObserver' in window)) {
      bars.forEach(function (el) { el.classList.add('is-animated'); });
      return;
    }

    barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        barObserver.unobserve(entry.target);
        entry.target.classList.add('is-animated');
      });
    }, { threshold: 0.5 });

    bars.forEach(function (el) {
      el.classList.remove('is-animated');
      barObserver.observe(el);
    });
  }

  function initUiEnhance() {
    resetPageMotion();
    bindReveal();
    bindImageMotion();
    bindCountUp();
    bindStatusBars();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUiEnhance);
  } else {
    initUiEnhance();
  }

  document.addEventListener('pjax:send', handlePjaxSend);
  document.addEventListener('pjax:complete', initUiEnhance);
})();
