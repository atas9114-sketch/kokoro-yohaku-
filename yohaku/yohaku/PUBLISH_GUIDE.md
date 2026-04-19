# GitHub 公開手順 🐙

このファイルは、YOHAKU を初めてGitHubで公開するあなた向けのガイドです。

---

## 📋 事前準備

### 1. GitHub アカウントを作る
https://github.com/signup （まだの場合）

### 2. Git をインストール
- **Windows**: https://git-scm.com/download/win
- **Mac**: ターミナルで `git --version` と打つと自動でインストールが始まります
- **Linux**: `sudo apt install git`

### 3. Git に自分の情報を教える
ターミナルで一度だけ実行:
```bash
git config --global user.name "あなたの名前"
git config --global user.email "your@email.com"
```

---

## 🚀 手順

### Step 1: GitHubで空のリポジトリを作る

1. https://github.com/new を開く
2. 以下を入力:
   - **Repository name**: `yohaku`
   - **Description**: 心にあるものを、そっと置いてください。
   - **Public** を選択（誰でも見られる） / または **Private**
   - ✅ **README, .gitignore, License は追加しない**（既に同梱してあるため）
3. 「Create repository」をクリック

### Step 2: このフォルダをGitリポジトリ化

ダウンロードして解凍した `yohaku/` フォルダの中で:

```bash
cd yohaku
git init
git add .
git commit -m "Initial commit: YOHAKU v1.0"
```

### Step 3: GitHubにプッシュ

作ったリポジトリのURLをコピーして（例: `https://github.com/YOUR_NAME/yohaku.git`）:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_NAME/yohaku.git
git push -u origin main
```

> **認証を求められたら**:
> GitHub は 2021年からパスワード認証を廃止し、代わりに **Personal Access Token (PAT)** を使います。
> https://github.com/settings/tokens から Classic トークンを作成し、パスワード欄に貼り付けてください。
> または GitHub CLI (`gh`) を使うのが一番ラクです: https://cli.github.com/

### Step 4: 完了！

ブラウザで `https://github.com/YOUR_NAME/yohaku` を開くと、コードが公開されています 🎉

---

## 🎨 公開後にやるといいこと

### README のスクリーンショットを差し替える

`docs/preview.png` を作って、実際のアプリの見た目を貼ると伝わりやすくなります。

### Topics（タグ）を追加

リポジトリ画面右上の ⚙ から、以下のようなタグを追加:
- `mental-health`, `selfcare`, `react`, `ai`, `claude`, `japanese`

### About欄を記入

リポジトリ画面右上の ⚙ から、説明・ウェブサイト（Vercelなどでデプロイしたら）を入力。

---

## 🛡 公開前チェックリスト

- [ ] `.env.local` / `.dev.vars` をコミットしていない（APIキーが漏れていない）
- [ ] `README.md` の `YOUR_USERNAME` を自分のユーザー名に置換した
- [ ] `LICENSE` の著作者名を自分の名前に置換した（お好みで）
- [ ] 自分のスクリーンショット等、公開したくない情報が混ざっていない

---

## 🚀 ついでに Vercel / Cloudflare Pages にデプロイする

### Vercel の場合（フロントエンド）

1. https://vercel.com/ に GitHub でログイン
2. 「Add New → Project」→ 作ったリポジトリを選ぶ
3. Framework Preset: **Vite** を選択
4. Environment Variables に `VITE_API_ENDPOINT` を追加（Worker の URL）
5. Deploy

### Cloudflare Workers の場合（API）

README.md の「本番デプロイ」セクションを参照してください。

---

不明な点があれば、ChatGPT や Claude に聞いてもOKです 💬
`git push でエラーが出た` などは、エラーメッセージをそのまま貼って聞くと即答してくれます。

公開、応援しています 🌊✦
