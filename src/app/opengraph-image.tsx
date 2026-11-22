import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.fullName} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Read at module scope from the repo (traced into the deployment bundle).
const regular = await readFile(join(process.cwd(), "assets/fonts/inter-latin-400-normal.woff"));
const semibold = await readFile(join(process.cwd(), "assets/fonts/inter-latin-600-normal.woff"));
const portrait = await readFile(join(process.cwd(), "public/images/portrait.png"), "base64");

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f7f6f2",
          color: "#111111",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, color: "#6b6a66" }}>
            <div style={{ width: 10, height: 10, borderRadius: 10, background: "#2b4cff" }} />
            {profile.siteUrl.replace("https://", "")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 112, fontWeight: 600, letterSpacing: -6, lineHeight: 0.9 }}>{profile.name}</div>
            <div style={{ display: "flex", fontSize: 34, color: "#6b6a66", letterSpacing: -1 }}>
              {`${profile.role} · Chulalongkorn University`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#6b6a66" }}>
            {["Airflow", "dbt", "PySpark", "Databricks", "SQL"].map((t) => (
              <div key={t} style={{ display: "flex", border: "1px solid #dcd9d2", borderRadius: 999, padding: "8px 18px" }}>
                {t}
              </div>
            ))}
          </div>
        </div>
        <img
          src={`data:image/png;base64,${portrait}`}
          alt=""
          width={420}
          height={560}
          style={{ position: "absolute", right: 30, bottom: -20, opacity: 1 }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 480,
            height: 260,
            background: "linear-gradient(to bottom, rgba(247,246,242,0), #f7f6f2)",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, style: "normal", weight: 400 },
        { name: "Inter", data: semibold, style: "normal", weight: 600 },
      ],
    },
  );
}
