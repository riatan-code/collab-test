// Springy Input — https://designbookmark.com/motion#db-springy-input
// 本物の <input> の文字は透明にして、1 文字ずつの span をミラー層に描く。
// 入力した文字は弾んで着地し、送信で上へ飛んでいく。空のまま送信すると揺れる。
window.QuickAdd = (({ S, step, spring, after }) => {
  const $ = id => document.getElementById(id);
  const field = $('field'), input = $('q'), layer = $('layer'), caret = $('caret');
  const label = $('flabel'), go = $('go');

  const C = S(0, ...spring('--input-caret', '700 32'));  // caret x
  const LB = S(0, 420, 26);                               // label float 0..1
  const shake = S(0, 700, 10);
  let spans = [], prev = '', scroll = 0, lastMove = 0, focused = false, busy = false;
  let onSubmit = () => {};

  function sync() {
    const next = input.value;
    if (next === prev) return;
    let a = 0; while (a < prev.length && a < next.length && prev[a] === next[a]) a++;
    let b = 0; while (b < prev.length - a && b < next.length - a && prev[prev.length - 1 - b] === next[next.length - 1 - b]) b++;
    spans.splice(a, prev.length - a - b).forEach(s => {
      const left = s.offsetLeft;
      s.classList.remove('in', 'nope');
      s.style.left = left + 'px';
      s.classList.add('out');
      setTimeout(() => s.remove(), 360);
    });
    const ref = spans[a] || null;
    const fresh = [...next.slice(a, next.length - b)].map((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch in'; s.textContent = ch;
      s.style.setProperty('--d', Math.min(i, 30) * 18 + 'ms');
      layer.insertBefore(s, ref);
      return s;
    });
    spans.splice(a, 0, ...fresh);
    prev = next;
    lastMove = performance.now();
    go.classList.toggle('idle', !next.trim());
  }

  function caretTarget() {
    const i = input.selectionEnd ?? spans.length;
    if (!spans.length) return 0;
    if (i < spans.length) return spans[i].offsetLeft;
    const l = spans[spans.length - 1];
    return l.offsetLeft + l.offsetWidth;
  }

  input.addEventListener('input', sync);
  input.addEventListener('focus', () => { focused = true; });
  input.addEventListener('blur', () => { focused = false; });
  ['keydown', 'keyup', 'click', 'select'].forEach(ev => input.addEventListener(ev, () => { lastMove = performance.now(); }));

  field.addEventListener('submit', e => {
    e.preventDefault();
    if (busy) return;
    const v = input.value.trim();
    if (!v) {
      spans.forEach((s, i) => { s.classList.remove('in', 'nope'); void s.offsetWidth; s.style.setProperty('--d', i * 14 + 'ms'); s.classList.add('nope'); });
      shake.v += 420;
      input.focus();
      return;
    }
    busy = true;
    spans.forEach((s, i) => { s.classList.remove('in', 'nope'); void s.offsetWidth; s.style.setProperty('--d', Math.min(i, 20) * 16 + 'ms'); s.classList.add('fly'); });
    onSubmit(v);
    after(.25 + Math.min(spans.length, 20) * .016, () => {
      input.value = ''; prev = '';
      spans.forEach(s => s.remove()); spans = [];
      go.classList.add('idle');
      busy = false;
    });
  });

  // "n" キーで入力欄へ、Esc で抜ける
  addEventListener('keydown', e => {
    if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey && document.activeElement === document.body) {
      e.preventDefault(); input.focus();
    }
    if (e.key === 'Escape' && document.activeElement === input) input.blur();
  });

  Motion.register({
    frame(dt) {
      C.t = caretTarget();
      LB.t = focused || input.value ? 1 : 0;
      step(C, dt); step(LB, dt); step(shake, dt);
    },
    render() {
      const box = layer.parentElement.clientWidth;
      const want = Math.max(0, C.t - box + 6);
      scroll += (want - scroll) * .25;
      if (Math.abs(want - scroll) < .3) scroll = want;
      layer.style.transform = `translateX(${-scroll}px)`;
      input.scrollLeft = scroll;

      const speed = Math.abs(C.v);
      const stretch = Math.min(speed / 80, 7);
      caret.style.width = 2 + stretch + 'px';
      caret.style.transform = `translateX(${C.x - scroll - (C.v > 0 ? stretch : 0)}px)`;
      const idle = performance.now() - lastMove > 550 && speed < 5;
      caret.style.opacity = focused && !busy ? 1 : 0;
      caret.classList.toggle('blink', focused && idle);

      const f = LB.x;
      label.style.transform = `translateY(${-13 * f}px) scale(${1 - .3 * f})`;
      field.style.transform = `translateX(${shake.x}px)`;
    },
  });

  return { onSubmit(fn) { onSubmit = fn; } };
})(Motion);
