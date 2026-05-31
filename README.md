# glossary

初心者向けの学習コンテンツ集。すべて静的HTMLなので、ブラウザ（スマホ含む）で開くだけで動きます。

## 公開ページ（GitHub Pages）

GitHub Pages を有効化すると、以下のURLで公開されます。

- トップ: `https://kajisaden.github.io/glossary/`
- パーセプトロン学習ページ: `https://kajisaden.github.io/glossary/perceptron/`

### Pages の有効化手順

リポジトリの **Settings → Pages** で、**Source** を `Deploy from a branch`、
ブランチを `main`（フォルダは `/ (root)`）に設定して保存します。数十秒〜数分で上記URLが有効になります。

> スマホでは、Safari/Chrome で上記URLを開き「ホーム画面に追加」すると、アプリのように起動できます。

## コンテンツ

- [`perceptron/`](perceptron/) — 初心者がパーセプトロンを体験して学べるインタラクティブなページ（スマホ対応）
- [`fe_vocab_mobile_viewer/`](fe_vocab_mobile_viewer/) — FE頻出英語の単語帳ビューア

## ローカルで開く

```
python3 -m http.server
# → http://localhost:8000/ にアクセス
```
