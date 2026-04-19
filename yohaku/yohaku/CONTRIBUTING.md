# コントリビューションガイド

YOHAKU への貢献に興味を持ってくださってありがとうございます 🌊

## まず読んでほしいこと

YOHAKU は **心に触れるアプリ** です。
単なる機能の正しさだけでなく、**ユーザーの心が傷つかない** ことを最優先します。

[SECURITY.md](./SECURITY.md) の "心の安全性に関する設計原則" にも目を通してください。

## 開発の流れ

```bash
# 1. Fork & Clone
git clone https://github.com/YOUR_USERNAME/yohaku.git
cd yohaku

# 2. ブランチを切る
git checkout -b feature/your-feature-name

# 3. Worker & フロントを起動
cd worker && npm install && npm run dev   # ターミナルA
cd .. && npm install && npm run dev       # ターミナルB

# 4. 実装してコミット
git commit -m "feat: 新機能の説明"

# 5. プッシュしてPR
git push origin feature/your-feature-name
```

## 避けてほしいこと

- ユーザーを評価・ランク付けするUI（ポイント、レベル、連続日数ストリークなど）
- 「〜しなさい」「〜すべき」という命令調の文言
- 過度な励まし（「頑張って」「もっと」「絶対に」など）
- 広告・アフィリエイト・トラッキング
- ユーザー本文のサーバー側永続化

## 歓迎すること

- アクセシビリティの改善（スクリーンリーダー対応、キーボード操作など）
- パフォーマンス最適化
- アニメーションの品質向上
- 相談窓口の情報の正確性チェック
- 他の言語対応（英語、簡体字、繁体字、韓国語…）
- テストコード

## 質問は Issues へ

気軽に Discussions / Issues で聞いてください 🐋
