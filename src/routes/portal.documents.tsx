import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const DocViewer = lazy(() => import("@/components/portal/DocViewer"));

export const Route = createFileRoute("/portal/documents")({
  component: PortalDocuments,
});

const DOCS = [
  { n: 1, title: "Welcome Guide", desc: "What to expect before, during, and after your installation.", file: "01-welcome-guide.pdf" },
  { n: 2, title: "Installation Agreement", desc: "Signed on installation day — both parties retain a copy.", file: "02-installation-agreement.pdf" },
  { n: 3, title: "Terms and Conditions", desc: "Our agreement with you, written in plain English.", file: "03-terms-and-conditions.pdf" },
  { n: 4, title: "Your Warranty", desc: "What is covered, for how long, and how to make a claim.", file: "04-warranty.pdf" },
  { n: 5, title: "Aftercare Guide", desc: "How to look after your system day to day.", file: "05-aftercare-guide.pdf" },
  { n: 6, title: "Privacy Notice", desc: "How we handle and protect your personal information.", file: "06-privacy-notice.pdf" },
  { n: 7, title: "Quotation", desc: "Your price breakdown and acceptance form.", file: "07-quotation.pdf" },
];

export type PortalDoc = (typeof DOCS)[number];

function PortalDocuments() {
  const [open, setOpen] = useState<null | PortalDoc>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <header>
        <div className="section-label" style={{ color: "var(--portal-sky)", marginBottom: 8 }}>Documents</div>
        <h1 className="portal-display" style={{ fontSize: 32, color: "var(--portal-navy-dark)", margin: 0 }}>
          Your customer document pack
        </h1>
        <p style={{ color: "var(--portal-text-muted)", marginTop: 8, maxWidth: 640 }}>
          Tap any document below to read it right here. Or download the full pack as a single PDF.
        </p>
      </header>

      <div className="portal-card" style={{ background: "var(--portal-navy)", color: "#fff", borderColor: "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Full Customer Pack (PDF)</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 }}>All 7 documents in one file — 15 pages</div>
        </div>
        <a className="portal-btn portal-btn-cta" href="/customer-pack.pdf" download="ClearWaterIreland-Customer-Pack.pdf">
          Download pack
        </a>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {DOCS.map((d) => (
          <li key={d.n}>
            <button
              type="button"
              onClick={() => setOpen(d)}
              className="portal-card"
              style={{
                width: "100%", textAlign: "left", cursor: "pointer", font: "inherit", color: "inherit",
                display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: "var(--portal-sky-soft)",
                color: "var(--portal-navy-dark)", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, flexShrink: 0,
              }}>{d.n}</div>
              <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "var(--portal-navy-dark)", fontSize: 15 }}>{d.title}</div>
                <div style={{ color: "var(--portal-text-muted)", fontSize: 13, marginTop: 4 }}>{d.desc}</div>
              </div>
              <span className="portal-link" style={{ fontSize: 13, fontWeight: 600 }}>Open →</span>
            </button>
          </li>
        ))}
      </ul>

      <div style={{ color: "var(--portal-text-muted)", fontSize: 13 }}>
        Lost your pack? Call <a href="tel:017267941" style={{ color: "var(--portal-navy)", fontWeight: 600 }}>(1) 726 7941</a> any time and we'll resend.
      </div>

      {mounted && open && (
        <Suspense fallback={null}>
          <DocViewer doc={open} onClose={() => setOpen(null)} />
        </Suspense>
      )}
    </div>
  );
}
