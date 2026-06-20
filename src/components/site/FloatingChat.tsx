import { useState, useEffect } from "react";
import Chatbot from "./Chatbot";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 96,
            right: 20,
            zIndex: 1001,
            width: "min(380px, calc(100vw - 32px))",
            maxHeight: "min(620px, calc(100vh - 140px))",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 12px 48px rgba(0,0,0,0.25)",
            borderRadius: 20,
            overflow: "hidden",
            animation: "fcSlideUp 240ms ease-out",
          }}
        >
          <Chatbot />
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: 24,
          right: 20,
          zIndex: 1002,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "var(--navy)",
          color: "#fff",
          border: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(0,62,126,0.45)",
          transition: "transform 200ms ease, background 200ms ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.background = "var(--navy-mid)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "var(--navy)"; }}
      >
        {pulse && !open && (
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid var(--sky)", animation: "fcPulse 1.8s infinite" }} />
        )}
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </button>

      <style>{`
        @keyframes fcPulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes fcSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
