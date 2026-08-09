import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cowin Materials silica aerogel material systems";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logo = await fetch(new URL("./icon.png", import.meta.url)).then((response) => response.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#06213A",
          color: "#ffffff",
          padding: 64,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img
            src={logo as unknown as string}
            alt=""
            style={{
              width: 78,
              height: 78,
              objectFit: "contain",
              background: "#ffffff",
              borderRadius: 8,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>Cowin Materials</span>
            <span style={{ fontSize: 18, color: "#8EE5E7" }}>Silica Aerogel Material Systems</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 880 }}>
          <h1 style={{ fontSize: 68, lineHeight: 1.02, margin: 0 }}>
            Aerogel Coatings, Fire Protection and Thermal Insulation
          </h1>
          <p style={{ fontSize: 26, lineHeight: 1.35, margin: 0, color: "#C6DBE0" }}>
            Engineered silica aerogel materials for global B2B projects.
          </p>
        </div>
      </div>
    ),
    size,
  );
}
