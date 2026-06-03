# superpowers の中で、何が起きているのか

[obra/superpowers](https://github.com/obra/superpowers) の14スキルを、Git・開発初心者向けに用語ゼロから読み解く概念ガイドです。スマホでも読みやすいよう整えた解説ページ（`index.html`）と、元の Markdown（`superpowers.md`）を収めています。

## 開き方

ビルド不要。`index.html` をブラウザで開くだけで読めます。

- 公開URL（Pages有効時）: `https://kajisaden.github.io/glossary/superpowers/`

## 構成

- `index.html` — Markdownをブラウザ上で整形して表示する読み物ページ。読み進めバー・目次ジャンプ・横スクロール対応テーブル付き。
- `superpowers.md` — 元になった解説テキスト（こちらを編集すれば内容を更新できます）。

## メモ

- HTML側は本文Markdownを `<script type="text/markdown">` に直接埋め込み、[marked.js](https://marked.js.org/)（CDN）で描画しています。オフラインでCDNが読めない場合も、素のテキストで内容は読めるようフォールバックしています。
- 内容を直したいときは `superpowers.md` と `index.html` 内の埋め込みテキスト、両方をそろえて更新してください。
