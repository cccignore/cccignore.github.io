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

  function initUiEnhance() {
    resetPageMotion();
    bindReveal();
    bindImageMotion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUiEnhance);
  } else {
    initUiEnhance();
  }

  document.addEventListener('pjax:send', handlePjaxSend);
  document.addEventListener('pjax:complete', initUiEnhance);
})();
