import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/portfolio";

export const alt = `${profile.name} — ${profile.roles[0]}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public/images/profileraju7.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#000",
          color: "#eceefa",
          fontFamily: "sans-serif",
        }}
      >
        {/* The portrait has a black backdrop, so it melts into the canvas. Satori needs a plain <img>. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={814} height={630} style={{ position: "absolute", right: -60, top: 0, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(600px 400px at 0% 100%, rgba(139,92,246,0.45), transparent), radial-gradient(500px 300px at 10% 0%, rgba(34,228,255,0.25), transparent), linear-gradient(90deg, #000 38%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, width: 760 }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#22e4ff", textTransform: "uppercase" }}>Portfolio</div>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1, marginTop: 24, letterSpacing: -3 }}>Afzal Hossain</div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
              backgroundImage: "linear-gradient(90deg, #22e4ff, #8b5cf6, #f472b6)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Raju.
          </div>
          <div style={{ fontSize: 30, marginTop: 32, color: "#b9bbd6" }}>
            {profile.roles[0]} · {profile.roles[1]}
          </div>
          <div style={{ fontSize: 22, marginTop: 12, color: "#8a8cab" }}>{profile.location}</div>
        </div>
      </div>
    ),
    size,
  );
}
