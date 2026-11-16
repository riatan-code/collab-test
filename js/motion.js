// Spring engine — DesignBookmark Motion Studies (https://designbookmark.com/motion) を元に簡略化
// 全コンポーネントで共有する 1 本の rAF ループ・バネ・タイマー。
window.Motion = (() => {
  // テーマ: OS 設定に追従
  const mq = matchMedia('(prefers-color-scheme: light)');
  const applyTheme = () => { document.documentElement.dataset.theme = mq.matches ? 'light' : 'dark'; };
  applyTheme();
  mq.addEventListener('change', applyTheme);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const S = (x, k = 400, c = 30) => ({ x, v: 0, t: x, k, c });
  const tune = (s, k, c) => { s.k = k; s.c = reduce ? 2 * Math.sqrt(k) : c; };
  const step = (s, dt) => { const a = -s.k * (s.x - s.t) - s.c * s.v; s.v += a * dt; s.x += s.v * dt; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const token = (name, fallback = '') =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const spring = (name, fallback) => token(name, fallback).split(/\s+/).map(Number);

  const timers = [];
  const after = (sec, fn) => { const t = { t: sec, fn }; timers.push(t); return t; };

  const comps = [];
  let last = performance.now();
  function loop(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
    for (let i = timers.length - 1; i >= 0; i--) {
      if ((timers[i].t -= dt) <= 0) timers.splice(i, 1)[0].fn();
    }
    const sub = 4;
    for (let k = 0; k < sub; k++) comps.forEach(c => c.frame(dt / sub));
    comps.forEach(c => c.render());
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  return {
    S, tune, step, clamp, token, spring, after,
    register: c => comps.push(c),
    unregister: c => { const i = comps.indexOf(c); if (i > -1) comps.splice(i, 1); },
  };
})();
