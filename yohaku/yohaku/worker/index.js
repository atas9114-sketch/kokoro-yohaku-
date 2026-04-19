/**
 * YOHAKU API Proxy — Cloudflare Workers
 *
 * ブラウザから安全にAnthropic APIを叩くためのプロキシサーバー。
 * APIキーは Workers の環境変数（Secret）に保管し、クライアントには絶対に露出させない。
 *
 * エンドポイント:
 *   POST /api/analyze  — ユーザーのメモから心の状態を読み解く
 *
 * デプロイ手順:
 *   1. npm install -g wrangler
 *   2. wrangler login
 *   3. wrangler secret put ANTHROPIC_API_KEY
 *   4. wrangler deploy
 */

// ── 🔐 安全に再設計されたシステムプロンプト ────────────────────────────────
const SYSTEM_PROMPT = `あなたは「YOHAKU（余白）」という心のケアアプリの、やさしい読み手です。

【あなたの役割】
- 日本の精神保健福祉士（PSW）の視点を参考にした、共感的な"寄り添い役"です。
- ユーザーの気持ちに静かに寄り添い、ありのままを受け止めます。

【絶対に守ること】
1. 診断をしない。「〜症」「〜障害」「〜病」などの病名・症状名を一切使わない。
2. 治療的アドバイスをしない。医療行為の代替ではないことを意識する。
3. 断定を避け、提案はやさしく、小さく、具体的に。「〜してください」より「〜してみてもいいかもしれません」。
4. ユーザーの気持ちを否定・評価しない。励ましすぎない。
5. 「頑張って」「もっと」という言葉は使わない。ユーザーはすでに頑張っている。
6. スピリチュアル・占い・非科学的な助言はしない。
7. ユーザーの言葉をそのまま引用しない。要約・言い換えで受け止める。

【出力形式】
必ず以下のJSON形式のみで返答してください。前後に説明やMarkdownを一切付けないこと。

{
  "mood": "今の気持ちを表す短い日本語（例: おだやかです / 少しお疲れのようです / 揺れています）",
  "moodEmoji": "気持ちに合う絵文字1つ",
  "moodColor": "パステル系CSS色（例: rgba(180,215,245,0.4)）",
  "summary": "今の心の状態を2〜3文で、やさしく言い換えて受け止める。断定しない。",
  "strength": "メモから見える、あなたが今日できていたこと・大切にしていることを1文で。",
  "advice": "よかったら試してみてほしい、小さく具体的なセルフケアを1文で。強制せず、選択肢として。",
  "affirmation": "20文字以内のやさしい肯定的な言葉。"
}

【moodの語彙例（参考）】
- おだやかです / 少しお疲れのようです / ほっとしています
- 頑張っている時間です / ゆれています / 立ち止まっています
※ 決して「不安症」「うつ気味」などの症状名は使わないこと。`;

// ── 🚨 クライシスワード（サーバー側でも二重チェック）──────────────────────
const CRISIS_PATTERNS = [
  /死に(たい|ます)/,
  /しに(たい|ます)/,
  /消えたい/,
  /きえたい/,
  /自殺/,
  /じさつ/,
  /リストカット/,
  /リスカ/,
  /自傷/,
  /終わりにしたい/,
  /生きていたくない/,
  /生きる意味がない/,
];

function detectCrisis(text) {
  return CRISIS_PATTERNS.some(p => p.test(text));
}

// ── CORS ヘッダ ────────────────────────────────────────────────────────────
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // 本番では自分のドメインに絞る
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

// ── ハンドラ ──────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // ヘルスチェック
    if (url.pathname === "/" || url.pathname === "/health") {
      return jsonResponse({ status: "ok", service: "yohaku-api" });
    }

    // 分析エンドポイント
    if (url.pathname === "/api/analyze" && request.method === "POST") {
      return handleAnalyze(request, env);
    }

    return jsonResponse({ error: "Not found" }, 404);
  },
};

async function handleAnalyze(request, env) {
  if (!env.ANTHROPIC_API_KEY) {
    return jsonResponse({ error: "API key not configured" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const { items = [], completed = [] } = body;

  if (!Array.isArray(items) || !Array.isArray(completed)) {
    return jsonResponse({ error: "Invalid shape" }, 400);
  }

  // 🆕 サーバー側でもクライシス検知（二重の安全網）
  const allText = [...items, ...completed].map(i => i?.text || "").join(" ");
  if (detectCrisis(allText)) {
    return jsonResponse({
      error: "crisis_detected",
      message: "専門家への相談をおすすめします",
    }, 409);
  }

  // プロンプト本文を組み立てる
  const itemsText = items
    .slice(0, 30) // 長すぎる入力を防ぐ
    .map(i => `・${String(i.text || "").slice(0, 200)}`)
    .join("\n");
  const doneText = completed
    .slice(-10)
    .map(i => `・${String(i.text || "").slice(0, 200)}`)
    .join("\n");

  const userPrompt = `【今日のメモ（未完了）】
${itemsText || "（なし）"}

【最近完了したこと】
${doneText || "（なし）"}

上記から、今の心の状態をやさしく読み解いて、指定のJSON形式で返してください。`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error:", res.status, errText);
      return jsonResponse({ error: "upstream_error", status: res.status }, 502);
    }

    const data = await res.json();
    const text = (data.content || []).map(b => b.text || "").join("").trim();
    const clean = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error("JSON parse failed:", clean);
      return jsonResponse({ error: "invalid_model_output" }, 502);
    }

    // 🆕 出力の健全性チェック
    const required = ["mood", "moodEmoji", "summary"];
    for (const key of required) {
      if (!parsed[key] || typeof parsed[key] !== "string") {
        return jsonResponse({ error: "missing_field", field: key }, 502);
      }
    }

    return jsonResponse(parsed);
  } catch (err) {
    console.error("Unexpected error:", err);
    return jsonResponse({ error: "internal_error" }, 500);
  }
}
