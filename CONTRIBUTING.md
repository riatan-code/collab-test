# 共同開発ガイド

このリポジトリは **共同開発フローのテスト** を目的としたサンプルです。
役割は次の 2 つだけです。

| 役割 | 担当 | やること |
| --- | --- | --- |
| **オーナー（レビュアー / 承認者）** | `riatan-code` | Issue の作成・PR のレビュー・承認・マージ |
| **コントリビューター（実装者）** |`Nishimura-So`| ブランチを切って実装し、PR を送る |

> `main` へ直接 push するのは禁止です。すべての変更は PR → オーナーの承認 → マージ の順で `main` に入ります。

---

## 全体の流れ

```
 コントリビューター                         オーナー (riatan-code)
 ───────────────────                       ───────────────────────
 1. Issue を確認 / 担当を宣言  ◀──────────  0. Issue を作成
 2. main から作業ブランチを作成
 3. 実装・動作確認・コミット
 4. push して PR を作成  ─────────────────▶  5. レビュー
                                             ├─ 修正依頼 → 6. 修正して push（4 に戻る）
                                             └─ Approve → 7. Squash and merge
 8. ローカルの main を更新・ブランチ削除  ◀──
```

---

## 1. はじめての準備（コントリビューター）

1. オーナーから届く招待（GitHub の通知 / メール）を承認する
2. クローンする

   ```bash
   git clone https://github.com/riatan-code/collab-test.git
   cd collab-test
   ```

3. 動かす：`index.html` をブラウザで開くだけです（ビルド不要）。
   ローカルサーバーを使う場合は `npx serve .` などで OK。

## 2. 作業の始め方

```bash
git switch main
git pull origin main
git switch -c feature/12-due-date   # <種類>/<Issue番号>-<短い説明>
```

### ブランチ名

| 種類 | 用途 | 例 |
| --- | --- | --- |
| `feature/` | 機能追加 | `feature/12-due-date` |
| `fix/` | バグ修正 | `fix/15-count-off-by-one` |
| `docs/` | ドキュメント | `docs/update-readme` |
| `refactor/` | 動作を変えない整理 | `refactor/split-store` |

## 3. コミット

1 コミット = 1 つの意味のある変更。メッセージは次の形式です。

```
<type>: <要約（日本語OK）>

feat:     機能追加
fix:      バグ修正
style:    見た目・CSS のみの変更
refactor: 動作を変えないコード整理
docs:     ドキュメント
chore:    その他（設定など）
```

例：`feat: タスクに期限日を追加`

## 4. PR を送る

```bash
git push -u origin feature/12-due-date
gh pr create --base main --fill      # またはGitHub上で「Compare & pull request」
```

- PR テンプレートの項目を埋める（`Closes #12` で Issue と紐づけ）
- 見た目が変わる場合は **スクリーンショット / GIF** を貼る
- レビュアーに `riatan-code` を指定する（CODEOWNERS で自動指定されます）
- 1 PR はなるべく小さく（目安：変更 300 行以内）

## 5. レビューとマージ（オーナー）

| 結果 | オーナーの操作 | コントリビューターの対応 |
| --- | --- | --- |
| 問題なし | **Approve** → **Squash and merge** → ブランチ削除 | 下記「マージ後」へ |
| 修正が必要 | **Request changes** でコメント | 同じブランチに修正コミットを push（PR は自動更新） |
| 質問のみ | **Comment** | 返信する |

レビュー観点：

- [ ] PR の目的どおりに動くか（`index.html` を開いて確認）
- [ ] コンソールにエラーが出ていないか
- [ ] ダーク / ライト両方、スマホ幅で崩れていないか
- [ ] 下の「コーディングルール」を守っているか

## 6. マージ後（コントリビューター）

```bash
git switch main
git pull origin main
git branch -d feature/12-due-date
```

## 7. コンフリクトしたら

```bash
git switch feature/12-due-date
git fetch origin
git rebase origin/main        # 競合を解消 → git add → git rebase --continue
git push --force-with-lease
```

迷ったら PR にコメントしてオーナーに相談してください。

---

## コーディングルール

### 構成

```
index.html              画面の骨組み
css/tokens.css          色・文字・角丸・モーションの定義（唯一の定義元）
css/app.css             レイアウトとコンポーネントのスタイル
js/motion.js            バネアニメーションのエンジン（全コンポーネント共通）
js/store.js             タスクデータ（localStorage）
js/components/*.js      UI コンポーネント（1 ファイル 1 コンポーネント）
js/app.js               状態管理とコンポーネントの接続
```

### UI のルール

1. **コンポーネントは [DesignBookmark Motion](https://designbookmark.com/motion) から選ぶ。**
   各コンポーネントのページで「Copy code」したコードを元に `js/components/` へ移植し、
   ファイル先頭に元コンポーネントの URL をコメントで書く。
2. **説明文を画面に置かない。** アイコン・ラベル・動きで伝わる UI にする（ツールチップ / `aria-label` は可）。
3. **既存サービスの定番パターンを参考にする。**（例：Todoist / Things / Linear のクイック追加・サイドバー・フィルター）
4. 色やサイズは `css/tokens.css` の変数を使い、値を直書きしない。
5. ダークとライト（OS 設定）両方で確認する。

### JS のルール

- ビルドなし・ライブラリなしの素の JavaScript（`index.html` を直接開いて動くこと）
- データの読み書きは必ず `Store` 経由
- アニメーションは `Motion`（`js/motion.js`）のバネを使う

---

## Issue の書き方（オーナー）

Issue テンプレートを使い、「やること」と「完了条件」を書きます。
コントリビューターは着手するときに Issue に「やります」とコメントし、Assignee を自分にします。

## 困ったとき

PR / Issue のコメントで気軽に質問してください。
