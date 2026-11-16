// Tab Pill — https://designbookmark.com/motion#db-tab-pill
// 両端を別々のバネで動かし、進行方向の端を硬く・反対側を柔らかくして伸び縮みさせる。
window.TabPill = (({ S, step, tune }) => {
  const pill = document.getElementById('pill');
  const tabs = [...document.querySelectorAll('#tabs button')];
  const A = S(0), B = S(0);
  let cur = -1, onPick = () => {};

  function pick(i, snap) {
    const dir = i > cur ? 1 : -1;
    cur = i;
    tabs.forEach((t, k) => t.setAttribute('aria-selected', k === i));
    const el = tabs[i];
    A.t = el.offsetLeft; B.t = el.offsetLeft + el.offsetWidth;
    if (dir > 0) { tune(B, 620, 40); tune(A, 170, 19); } else { tune(A, 620, 40); tune(B, 170, 19); }
    if (snap) { A.x = A.t; B.x = B.t; }
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => {
    if (i === cur) return;
    pick(i);
    onPick(t.dataset.filter);
  }));
  // フォント読み込み後に幅が変わるので合わせ直す
  document.fonts?.ready.then(() => pick(cur, true));

  Motion.register({
    frame(dt) { step(A, dt); step(B, dt); },
    render() {
      pill.style.transform = `translateX(${A.x.toFixed(2)}px)`;
      pill.style.width = Math.max(0, B.x - A.x).toFixed(2) + 'px';
    },
  });

  return {
    init(filter) { pick(Math.max(0, tabs.findIndex(t => t.dataset.filter === filter)), true); },
    onPick(fn) { onPick = fn; },
  };
})(Motion);
