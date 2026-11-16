// Rolling number — Checkbox List の件数ロールを複数桁に拡張したもの
// https://designbookmark.com/motion#db-checkbox-list
window.RollNumber = (({ S, step }) => {
  const MAX_DIGITS = 3, H = 16;
  const el = document.getElementById('count');
  const cols = [];
  for (let d = 0; d < MAX_DIGITS; d++) {
    const col = document.createElement('span');
    col.className = 'digit';
    for (let i = 0; i <= 9; i++) { const s = document.createElement('span'); s.textContent = i; col.appendChild(s); }
    el.appendChild(col);
    cols.push({ col, s: S(0, 260, 22) });
  }
  let value = 0;

  function set(n) {
    value = Math.max(0, Math.min(10 ** MAX_DIGITS - 1, n));
    const str = String(value).padStart(MAX_DIGITS, ' ');
    cols.forEach((c, i) => {
      const ch = str[i];
      c.col.style.width = ch === ' ' ? '0px' : '';
      c.s.t = ch === ' ' ? 0 : Number(ch);
    });
    el.setAttribute('aria-label', String(value));
  }

  Motion.register({
    frame(dt) { cols.forEach(c => step(c.s, dt)); },
    render() {
      cols.forEach(c => {
        const y = (-H * c.s.x).toFixed(2);
        for (const s of c.col.children) s.style.transform = `translateY(${y}px)`;
      });
    },
  });

  return { set };
})(Motion);
