// Checkbox List — https://designbookmark.com/motion#db-checkbox-list
// チェックでボックスが緑に満ち、チェックが描かれ、取り消し線が左から走る。
// 行はタスク id ごとに使い回し、増減は enter / leave アニメーションで出し入れする。
window.TaskList = (({ S, step, clamp, after }) => {
  const list = document.getElementById('list');
  const empty = document.getElementById('empty');
  const rows = new Map();          // id -> row
  const COMMIT_DELAY = .6;         // チェックのアニメーションを見せてから保存する秒数
  let handlers = { toggle: () => {}, remove: () => {} };

  const ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4 4L18 8"/></svg>';
  const ICON_DEL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>';

  function createRow(task) {
    const li = document.createElement('li');
    li.className = 'row enter';
    li.innerHTML = `<button class="cb" role="checkbox">${ICON_CHECK}</button><span class="t"><span class="tt"></span><i class="strike"></i></span><button class="del" aria-label="削除">${ICON_DEL}</button>`;
    li.querySelector('.tt').textContent = task.title;
    li.querySelector('.cb').setAttribute('aria-label', task.title);
    const r = {
      id: task.id, li, on: false, pending: null,
      cb: li.querySelector('.cb'), path: li.querySelector('.cb path'), strike: li.querySelector('.strike'),
      f: S(0, 300, 24), p: S(1, 520, 13), c: S(0, 160, 20), k: S(0, 140, 22),
    };
    r.path.style.strokeDasharray = 18;
    setOn(r, task.done, true);
    li.addEventListener('animationend', () => li.classList.remove('enter'), { once: true });
    li.addEventListener('click', e => {
      if (e.target.closest('.del')) return;
      setOn(r, !r.on);
      if (r.pending) r.pending.cancelled = true;
      const p = { cancelled: false };
      r.pending = p;
      after(COMMIT_DELAY, () => { if (!p.cancelled) { r.pending = null; handlers.toggle(r.id, r.on); } });
    });
    li.querySelector('.del').addEventListener('click', () => handlers.remove(r.id));
    return r;
  }

  function setOn(r, on, snap) {
    r.on = on;
    r.cb.setAttribute('aria-checked', on);
    r.li.classList.toggle('done', on);
    r.f.t = on ? 1 : 0;
    if (snap) { [r.f, r.c, r.k].forEach(s => { s.x = s.t = on ? 1 : 0; }); return; }
    r.p.x = on ? .7 : .85; r.p.v = 5;
    if (on) { after(.08, () => { if (r.on) r.c.t = 1; }); after(.16, () => { if (r.on) r.k.t = 1; }); }
    else { r.c.t = 0; r.k.t = 0; }
  }

  function leave(r) {
    rows.delete(r.id);
    r.li.classList.remove('enter');
    r.li.classList.add('leave');
    r.li.addEventListener('animationend', () => r.li.remove(), { once: true });
  }

  // tasks: 表示するタスク (順番どおり)。animate=false なら一気に差し替える (リスト切替時)
  function render(tasks, animate = true) {
    const ids = new Set(tasks.map(t => t.id));
    for (const r of [...rows.values()]) {
      if (ids.has(r.id)) continue;
      if (animate) leave(r); else { rows.delete(r.id); r.li.remove(); }
    }
    let ref = list.firstChild;
    tasks.forEach(t => {
      let r = rows.get(t.id);
      if (!r) {
        r = createRow(t);
        if (!animate) r.li.classList.remove('enter');
        rows.set(t.id, r);
      } else if (!r.pending && r.on !== t.done) {
        setOn(r, t.done);
      }
      while (ref && ref.classList.contains('leave')) ref = ref.nextSibling;
      if (r.li !== ref) list.insertBefore(r.li, ref); else ref = ref.nextSibling;
    });
    const isEmpty = tasks.length === 0;
    if (isEmpty !== empty.classList.contains('show')) empty.classList.toggle('show', isEmpty);
  }

  Motion.register({
    frame(dt) { rows.forEach(r => { step(r.f, dt); step(r.p, dt); step(r.c, dt); step(r.k, dt); }); },
    render() {
      rows.forEach(r => {
        const f = clamp(r.f.x, 0, 1);
        r.cb.style.background = f > .01 ? `color-mix(in srgb, var(--green) ${(f * 100).toFixed(1)}%, var(--fill-3))` : '';
        r.cb.style.transform = `scale(${r.p.x.toFixed(4)})`;
        r.path.style.strokeDashoffset = (18 * (1 - clamp(r.c.x, 0, 1))).toFixed(2);
        r.strike.style.width = (clamp(r.k.x, 0, 1) * 100).toFixed(2) + '%';
      });
    },
  });

  return { render, on(h) { handlers = { ...handlers, ...h }; } };
})(Motion);
