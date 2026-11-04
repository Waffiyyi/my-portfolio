import { ImageResponse } from "next/og";
export const alt =
  "Waffiyyi Fashola — Thoughtful interfaces. Dependable systems.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f4f1ea",
        color: "#16130f",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 60,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
        }}
      >
        <span>WAFFIYYI FASHOLA</span>
        <span>LAGOS / SOFTWARE ENGINEER</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontWeight: 900,
          fontSize: 105,
          lineHeight: 1,
          letterSpacing: -6,
          marginTop: 95,
        }}
      >
        <span>CRAFT THE FRONT.</span>
        <span style={{ color: "#ea1d0f" }}>ENGINEER THE BACK.</span>
      </div>
      <div style={{ display: "flex", marginTop: 65, fontSize: 25 }}>
        TypeScript + Java / Surface + System
      </div>
    </div>,
    size,
  );
}
