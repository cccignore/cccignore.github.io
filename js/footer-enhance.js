(function () {
  var BLOG_START = new Date('2025-06-16T00:00:00+08:00')
  var VOYAGER_START = new Date('1977-09-05T12:56:00Z')
  var VOYAGER_SPEED_KM_S = 17
  var AU_KM = 149597870.7

  function pad(n) {
    return String(n).padStart(2, '0')
  }

  function updateRuntime() {
    var el = document.getElementById('footer-runtime')
    if (!el) return
    var now = new Date()
    var diff = Math.max(0, now - BLOG_START)
    var day = Math.floor(diff / 86400000)
    var hour = Math.floor((diff % 86400000) / 3600000)
    var min = Math.floor((diff % 3600000) / 60000)
    var sec = Math.floor((diff % 60000) / 1000)
    el.textContent = '本站居然运行了 ' + day + ' 天 ' + pad(hour) + ' 小时 ' + pad(min) + ' 分 ' + pad(sec) + ' 秒'
  }

  function updateVoyager() {
    var el = document.getElementById('footer-voyager')
    if (!el) return
    var now = new Date()
    var diffSec = Math.max(0, (now - VOYAGER_START) / 1000)
    var km = diffSec * VOYAGER_SPEED_KM_S
    var au = km / AU_KM
    el.textContent =
      '旅行者1号当前距离地球约 ' +
      Math.floor(km).toLocaleString('en-US') +
      ' 千米，约为 ' +
      au.toFixed(6) +
      ' 个天文单位'
  }

  var fpsFrames = 0
  var fpsLast = performance.now()
  var fpsValue = 0

  function ensureFpsBadge() {
    var badge = document.getElementById('fps-badge')
    if (badge) return badge
    badge = document.createElement('div')
    badge.id = 'fps-badge'
    badge.textContent = 'FPS: --'
    document.body.appendChild(badge)
    return badge
  }

  function tickFps(ts) {
    fpsFrames += 1
    if (ts - fpsLast >= 1000) {
      fpsValue = Math.round((fpsFrames * 1000) / (ts - fpsLast))
      fpsFrames = 0
      fpsLast = ts
      var badge = ensureFpsBadge()
      badge.textContent = 'FPS: ' + fpsValue + (fpsValue >= 50 ? ' 很流畅' : fpsValue >= 30 ? ' 还不错' : ' 可优化')
    }
    requestAnimationFrame(tickFps)
  }

  function initFooterEnhance() {
    updateRuntime()
    updateVoyager()
    setInterval(updateRuntime, 1000)
    setInterval(updateVoyager, 10000)
    requestAnimationFrame(tickFps)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterEnhance)
  } else {
    initFooterEnhance()
  }

  document.addEventListener('pjax:complete', function () {
    updateRuntime()
    updateVoyager()
    ensureFpsBadge()
  })
})()
