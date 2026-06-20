import { useState } from "react";

export interface FAQItem { question: string; answer: string; }

export default function Accordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ background: "#fff", border: "1px solid var(--grey-3)", borderRadius: 14, overflow: "hidden", transition: "border-color 200ms" }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{ width: "100%", padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "none", border: 0, cursor: "pointer", textAlign: "left", color: "var(--navy-dark)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 16 }}
            >
              <span>{item.question}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transition: "transform 300ms", transform: isOpen ? "rotate(180deg)" : "rotate(0)", flexShrink: 0, color: "var(--sky)" }}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div style={{ maxHeight: isOpen ? 600 : 0, overflow: "hidden", transition: "max-height 350ms ease" }}>
              <div style={{ padding: "0 22px 22px", color: "var(--grey-1)", fontSize: 15, lineHeight: 1.7, whiteSpace: "pre-line" }}>{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
