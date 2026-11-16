// App — 状態 (選択中のリスト / フィルター) を持ち、Store と各コンポーネントをつなぐ。
(() => {
  const LISTS = { inbox: 'インボックス', work: '仕事', home: 'プライベート' };
  const FILTERS = {
    active: t => !t.done,
    done: t => t.done,
    all: () => true,
  };
  const state = { list: 'inbox', filter: 'active' };
  const title = document.getElementById('title');

  function visible() {
    return Store.all().filter(t => t.list === state.list && FILTERS[state.filter](t));
  }

  function refresh(animate = true) {
    const all = Store.all();
    TaskList.render(visible(), animate);
    RollNumber.set(all.filter(t => t.list === state.list && !t.done).length);
    const counts = {};
    all.forEach(t => { if (!t.done) counts[t.list] = (counts[t.list] || 0) + 1; });
    Sidebar.setCounts(counts);
  }

  function setTitle(text) {
    title.classList.add('swap');
    setTimeout(() => { title.textContent = text; title.classList.remove('swap'); }, 180);
  }

  Sidebar.onPick(list => {
    if (list === state.list) return;
    state.list = list;
    setTitle(LISTS[list]);
    refresh(false);
  });
  TabPill.onPick(filter => { state.filter = filter; refresh(); });
  QuickAdd.onSubmit(text => Store.add(text, state.list));
  TaskList.on({
    toggle: (id, done) => Store.setDone(id, done),
    remove: id => Store.remove(id),
  });
  Store.subscribe(() => refresh());

  Sidebar.init(state.list);
  TabPill.init(state.filter);
  title.textContent = LISTS[state.list];
  refresh(false);
})();
