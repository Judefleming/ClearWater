import { useRef, useState, useCallback } from "react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  borderRadius?: string;
  className?: string;
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, borderRadius = "20px", className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(35);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(5, Math.min(95, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", borderRadius, width: "100%", height: "100%", touchAction: "none", userSelect: "none", cursor: "ew-resize", background: "var(--navy-dark)" }}
      onPointerDown={(e) => {
        draggingRef.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current) return;
        updateFromClientX(e.clientX);
      }}
      onPointerUp={() => { draggingRef.current = false; }}
      onPointerCancel={() => { draggingRef.current = false; }}
    >
      <img src={beforeSrc} alt="Before water softener installation" loading="lazy"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
      <img src={afterSrc} alt="After water softener installation" loading="lazy"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", clipPath: `inset(0 0 0 ${pos}%)` }} draggable={false} />

      <span style={{ position: "absolute", top: 14, left: 14, background: "rgba(199,48,48,0.88)", color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", padding: "5px 10px", borderRadius: 999, textTransform: "uppercase" }}>Before</span>
      <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(39,122,39,0.88)", color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", padding: "5px 10px", borderRadius: 999, textTransform: "uppercase" }}>After</span>

      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "rgba(255,255,255,0.85)", boxShadow: "0 0 12px rgba(0,0,0,0.4)", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 52, height: 52, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 18px rgba(0,0,0,0.35)", color: "var(--navy-dark)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}
