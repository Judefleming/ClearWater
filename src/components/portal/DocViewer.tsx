import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Doc = { n: number; title: string; file: string };

export default function DocViewer({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const url = `/docs/${doc.file}`;
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(() =>
    typeof window === "undefined" ? 800 : Math.min(900, window.innerWidth - 32)
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const el = scrollRef.current;
      if (!el) return;
      setPageWidth(Math.min(900, el.clientWidth - 32));
    };
    update();
    const ro = new ResizeObserver(update);
    if (scrollRef.current) ro.observe(scrollRef.current);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(10,25,47,0.85)",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute", inset: 0,
          background: "#fff",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          padding: "10px 14px", borderBottom: "1px solid var(--portal-border)", flexWrap: "wrap",
        }}>
          <div style={{ minWidth: 0 }}>
            <div className="section-label" style={{ color: "var(--portal-sky)" }}>Document {doc.n} of 7</div>
            <div style={{ fontWeight: 700, color: "var(--portal-navy-dark)", fontSize: 16, marginTop: 2 }}>{doc.title}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)))}
                className="portal-btn portal-btn-secondary"
                style={{ padding: "8px 12px", fontSize: 13, lineHeight: 1 }}
                aria-label="Zoom out"
              >
                −
              </button>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--portal-navy-dark)", minWidth: 40, textAlign: "center" }}>
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3, +(s + 0.15).toFixed(2)))}
                className="portal-btn portal-btn-secondary"
                style={{ padding: "8px 12px", fontSize: 13, lineHeight: 1 }}
                aria-label="Zoom in"
              >
                +
              </button>
            </div>
            <a
              href={url}
              download={`ClearWaterIreland-${doc.title.replace(/\s+/g, "-")}.pdf`}
              className="portal-btn portal-btn-secondary"
              style={{ padding: "8px 14px", fontSize: 13 }}
            >
              Download
            </a>
            <button type="button" onClick={onClose} className="portal-btn portal-btn-primary" style={{ padding: "8px 14px", fontSize: 13 }}>
              Close
            </button>
          </div>
        </header>
        <div
          ref={scrollRef}
          style={{
            flex: 1, background: "#1B2A3A", minHeight: 0, overflow: "auto",
            WebkitOverflowScrolling: "touch", display: "flex", justifyContent: "center",
            padding: 16,
          }}
        >
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div style={{ color: "#fff", padding: 24 }}>Loading document…</div>}
            error={
              <div style={{ color: "#fff", padding: 24, textAlign: "center" }}>
                Couldn't display PDF.{" "}
                <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--portal-sky)", fontWeight: 600 }}>
                  Open in new tab →
                </a>
              </div>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array.from({ length: numPages }, (_, i) => (
                <Page
                  key={i}
                  pageNumber={i + 1}
                  width={pageWidth * scale}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              ))}
            </div>
          </Document>
        </div>
      </div>
    </div>,
    document.body,
  );
}
