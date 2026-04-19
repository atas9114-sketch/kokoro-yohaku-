import React from "react";
import ReactDOM from "react-dom/client";
import Yohaku from "./Yohaku.jsx";

// 全体の余白を消し、タッチハイライトを抑える
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  * { -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; background: #f0f7ff; }
  body { -webkit-font-smoothing: antialiased; }
`;
document.head.appendChild(globalStyle);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Yohaku />
  </React.StrictMode>
);
