import { createFileRoute } from "@tanstack/react-router";
import Chatbot from "@/components/site/Chatbot";

export const Route = createFileRoute("/portal/chat")({
  component: PortalChat,
});

function PortalChat() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <header>
        <div className="section-label" style={{ color: "var(--portal-sky)", marginBottom: 8 }}>Assistant</div>
        <h1 className="portal-display" style={{ fontSize: 32, color: "var(--portal-navy-dark)", margin: 0 }}>
          Ask the ClearWater Assistant
        </h1>
        <p style={{ color: "var(--grey-2)", marginTop: 8, maxWidth: 620 }}>
          Same assistant as on our website — ask about packages, warranty cover, salt, regeneration, drinking softened water, or how to get a call-out.
        </p>
      </header>
      <Chatbot />
    </div>
  );
}
