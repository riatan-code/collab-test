# collab-test

共同開発フローを試すためのサンプル — シンプルなタスク管理ツールです。

## 動かし方

`index.html` をブラウザで開くだけ（ビルド・インストール不要）。

## 機能

- リスト切り替え（インボックス / 仕事 / プライベート）
- タスクの追加（`N` キーで入力欄へ、`Enter` で追加）
- 完了 / 未完了の切り替え、削除
- フィルター（未完了 / 完了 / すべて）
- ブラウザ（localStorage）に保存
- ダーク / ライトは OS 設定に追従

## 使用コンポーネント

[DesignBookmark Motion](https://designbookmark.com/motion) のコンポーネントを移植しています。

| コンポーネント | 使っている場所 | ファイル |
| --- | --- | --- |
| [Sidebar Collapse](https://designbookmark.com/motion#db-sidebar-collapse) | 左のリスト切り替え | `js/components/sidebar.js` |
| [Springy Input](https://designbookmark.com/motion#db-springy-input) | タスク追加欄 | `js/components/quick-add.js` |
| [Tab Pill](https://designbookmark.com/motion#db-tab-pill) | フィルター | `js/components/tab-pill.js` |
| [Checkbox List](https://designbookmark.com/motion#db-checkbox-list) | タスク一覧・残り件数 | `js/components/task-list.js`, `roll-number.js` |

## 共同開発

参加方法・ブランチ・PR・レビューのルールは [CONTRIBUTING.md](CONTRIBUTING.md) を見てください。
