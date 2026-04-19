# YOHAKU（余白）🌊

> 心にあるものを、そっと置いてください。

YOHAKU は、ToDo アプリではなく **「余白をつくるためのアプリ」** です。
タスクを完了すると真珠玉から光の粒がふわりと舞い、心に"余白"が生まれる感覚を大切にしています。

精神保健福祉士（PSW）の視点を参考にした、やさしい共感メッセージと、Claude による「今日の心の状態」のAI読み解き機能を備えています。

![YOHAKU](./docs/preview.png)

---

## ✦ 特徴

- **完了の儀式** — 真珠玉をタップすると光の粒が舞い、項目が静かに畳まれる
- **PSWの共感メッセージ** — 完了時に「一歩進みましたね」とやさしい声が浮かぶ
- **4つのカテゴリ** — 🌿からだ / 🫧こころ / ☁️くらし / 🌸たのしみ
- **AI 心の状態分析（🌊）** — Claude がメモから今の気持ちをやさしく読み解く
- **クライシス検知** — 深刻なキーワードを検出したとき、AI分析ではなく相談窓口を案内
- **localStorage 永続化** — ブラウザに自動保存、最大50件の完了履歴
- **水彩グラデーション背景** — 青・ピンク・黄のにじみがゆっくり揺れる

---

## 🌿 安全性について

このアプリは **治療・診断の代わりにはなりません**。
YOHAKU は以下の3つの原則で設計されています。

1. **診断しない** — AIは「〜症」「〜病」などの病名を使わず、気持ちに寄り添うことに徹します
2. **APIキーを露出しない** — Anthropic APIの呼び出しはすべて Cloudflare Workers 経由
3. **危機の兆しを見逃さない** — 「死にたい」等のキーワード検出時は、AI分析ではなく日本の相談窓口を即座に案内

詳しくは [SECURITY.md](./SECURITY.md) をご覧ください。

---

## 🛠 セットアップ

### 必要なもの
- Node.js 20 以上
- [Anthropic API キー](https://console.anthropic.com/)
- [Cloudflare アカウント](https://dash.cloudflare.com/sign-up)（無料プランでOK）

### 1. リポジトリをクローン
```bash
git clone https://github.com/YOUR_USERNAME/yohaku.git
cd yohaku
```

### 2. API プロキシ（Cloudflare Workers）を設定

```bash
cd worker
npm install

# ローカル開発用にAPIキーを設定
cp .dev.vars.example .dev.vars
# .dev.vars を開いてANTHROPIC_API_KEYを実際のキーに書き換え

# ローカルで Worker を起動
npm run dev
# → http://localhost:8787 で起動
```

### 3. フロントエンドを起動

別のターミナルで:

```bash
cd ..  # プロジェクトルートへ
npm install
npm run dev
# → http://localhost:5173 で起動
```

ブラウザで http://localhost:5173 を開くと YOHAKU が動きます。

---

## 🚀 本番デプロイ

### Worker をデプロイ

```bash
cd worker

# 本番用のAPIキーを Cloudflare の Secret に保存
npx wrangler secret put ANTHROPIC_API_KEY
# → プロンプトが出たら実際のAPIキーを貼り付け

# デプロイ
npm run deploy
# → https://yohaku-api.YOUR_SUBDOMAIN.workers.dev が発行される
```

### フロントエンドをデプロイ

Vercel / Netlify / Cloudflare Pages などお好きなホスティングで:

```bash
# ビルド
npm run build
# dist/ フォルダを配信
```

**重要**: 環境変数 `VITE_API_ENDPOINT` に、デプロイ済みWorkerのURLを設定してください。
例: `https://yohaku-api.YOUR_SUBDOMAIN.workers.dev/api/analyze`

---

## 📁 プロジェクト構成

```
yohaku/
├── src/
│   ├── Yohaku.jsx       # メインのReactコンポーネント
│   └── main.jsx         # エントリポイント
├── worker/
│   ├── index.js         # Cloudflare Workers のAPIプロキシ
│   ├── wrangler.toml    # Worker 設定
│   └── package.json
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
└── package.json
```

---

## 💡 なぜこの設計か

### なぜAPIキーをフロントに書かないのか

ブラウザに埋め込んだキーは DevTools から誰でも盗めます。そうなると:
- あなたの課金で見ず知らずの人がAPIを使える
- Anthropicからキーが停止されて、アプリが使えなくなる

Cloudflare Workers を挟むことで、キーはサーバー側にしか存在しない状態になります。

### なぜPSWを名乗らせないのか

初期版のプロンプトは AI を「精神保健福祉士」として振る舞わせていましたが、
AIは実際にはPSWではなく、診断や治療の責任を負えません。
「PSWの視点を参考にした寄り添い役」という表現に改め、
**診断しない・断定しない・病名を使わない** を明文化しました。

### なぜクライシス検知が必要か

心のケアアプリは、最悪の瞬間に触れられる可能性があります。
AIに判断を丸投げせず、**キーワードで即座に人間の相談窓口へ案内する** 仕組みを独立して持たせています。

---

## 📜 ライセンス

MIT License — 詳しくは [LICENSE](./LICENSE) をご覧ください。

---

## 🙏 謝辞

- Claude (Anthropic) — AI心の状態分析の実装パートナー
- M PLUS Rounded 1c — やさしい角丸フォント
- 日本の相談窓口のみなさま

---

もしこのアプリがあなたの、あるいは誰かの余白をつくる一助になれたら、これ以上の喜びはありません。🌊✦
