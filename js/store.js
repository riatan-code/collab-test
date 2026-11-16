// Store — タスクの保存 (localStorage)。UI からはこのオブジェクト経由でのみデータを触る。
window.Store = (() => {
  const KEY = 'collab-test.tasks.v1';
  const SEED = [
    { title: 'デザインを確認する', list: 'inbox', done: false },
    { title: 'README を読む', list: 'inbox', done: true },
    { title: '週次ミーティング', list: 'work', done: false },
    { title: 'PR をレビューする', list: 'work', done: false },
    { title: '牛乳を買う', list: 'home', done: false },
  ];

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  let tasks = load();
  const subs = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ストレージ不可でも動かす */ }
    return SEED.map(t => ({ id: uid(), ...t }));
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch { /* noop */ }
    subs.forEach(fn => fn(tasks));
  }

  return {
    all: () => tasks.slice(),
    add(title, list) { tasks.unshift({ id: uid(), title, list, done: false }); save(); },
    setDone(id, done) { const t = tasks.find(x => x.id === id); if (t && t.done !== done) { t.done = done; save(); } },
    remove(id) { tasks = tasks.filter(x => x.id !== id); save(); },
    subscribe: fn => subs.push(fn),
  };
})();
