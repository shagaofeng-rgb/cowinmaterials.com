import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cowin Materials silica aerogel material systems";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f6f2",
          color: "#17201d",
          padding: 64,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 70,
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0f5a52",
              color: "#fff",
              borderRadius: 8,
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            CM
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>Cowin Materials</span>
            <span style={{ fontSize: 18, color: "#5c6a63" }}>Silica Aerogel Material Systems</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 880 }}>
          <h1 style={{ fontSize: 68, lineHeight: 1.02, margin: 0 }}>
            Aerogel Coatings, Fire Protection and Thermal Insulation
          </h1>
          <p style={{ fontSize: 26, lineHeight: 1.35, margin: 0, color: "#42504a" }}>
            Engineered silica aerogel materials for global B2B projects.
          </p>
        </div>
      </div>
    ),
    size,
  );
}
