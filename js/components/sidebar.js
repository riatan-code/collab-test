// Sidebar Collapse — https://designbookmark.com/motion#db-sidebar-collapse
// 幅のバネ + ラベルを順番にフェードイン。ハイライトは選択中の項目へバネで移動。
window.Sidebar = (({ S, step, clamp, after }) => {
  const OPEN_W = 212, CLOSED_W = 64;
  const side = document.getElementById('side');
  const btn = document.getElementById('collapse');
  const hl = document.getElementById('hl');
  const logo = side.querySelector('.logo');
  const items = [...side.querySelectorAll('.it')];
  const labels = [...side.querySelectorAll('.lb')].map(el => ({ el, s: S(1, 300, 26) }));
  const W = S(OPEN_W, 260, 24), R = S(0, 300, 22), Y = S(0, 380, 28);
  let open = true, onPick = () => {};

  function setOpen(o, snap) {
    open = o;
    btn.setAttribute('aria-expanded', o);
    btn.setAttribute('aria-label', o ? 'サイドバーを閉じる' : 'サイドバーを開く');
    W.t = o ? OPEN_W : CLOSED_W; R.t = o ? 0 : 1;
    labels.forEach((l, i) => o ? after(.06 + i * .04, () => { if (open) l.s.t = 1; }) : (l.s.t = 0));
    if (snap) { W.x = W.t; R.x = R.t; labels.forEach(l => { l.s.x = l.s.t = o ? 1 : 0; }); }
  }

  function pick(list) {
    const el = items.find(b => b.dataset.list === list) || items[0];
    items.forEach(b => b.classList.toggle('on', b === el));
    Y.t = el.offsetTop;
  }

  btn.addEventListener('click', () => setOpen(!open));
  items.forEach(b => b.addEventListener('click', () => { pick(b.dataset.list); onPick(b.dataset.list); }));

  Motion.register({
    frame(dt) { [W, R, Y].forEach(s => step(s, dt)); labels.forEach(l => step(l.s, dt)); },
    render() {
      side.style.width = W.x.toFixed(2) + 'px';
      btn.firstElementChild.style.transform = `rotate(${(180 * R.x).toFixed(2)}deg)`;
      btn.style.right = (clamp(R.x, 0, 1) * 4).toFixed(2) + 'px';
      logo.style.opacity = clamp(1 - R.x * 2, 0, 1).toFixed(3);
      labels.forEach(l => {
        const o = clamp(l.s.x, 0, 1);
        l.el.style.opacity = o.toFixed(3);
        l.el.style.transform = `translateX(${((1 - o) * -10).toFixed(2)}px)`;
      });
      hl.style.transform = `translateY(${Y.x.toFixed(2)}px)`;
    },
  });

  return {
    init(list) { setOpen(innerWidth > 720, true); pick(list); Y.x = Y.t; },
    onPick(fn) { onPick = fn; },
    setCounts(counts) {
      items.forEach(b => { b.querySelector('.n').textContent = counts[b.dataset.list] || ''; });
    },
  };
})(Motion);
