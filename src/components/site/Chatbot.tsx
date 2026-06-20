import { useEffect, useRef, useState } from "react";
import logo from "@/assets/clearwater-logo.png";

// ---------------------------------------------------------------------------
// Local FAQ assistant — no AI, no API key, no network. Answers the standard
// questions instantly and points anything else to a call / the quote form.
// To add an answer, add an entry to KB. Earlier entries win ties.
// ---------------------------------------------------------------------------

type Intent = { triggers: string[]; answer: string };

const FALLBACK =
  "I'm best with the basics — packages, pricing, installation, warranty, salt supply, and the areas we cover. For anything more specific, call us on (1) 726 7941 or pop your details in the quote form on this page and we'll come back to you.";

const KB: Intent[] = [
  {
    triggers: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    answer:
      "Hi! I can help with packages, pricing, installation, warranty, and salt supply. What would you like to know?",
  },
  {
    triggers: ["thank", "thanks", "cheers", "appreciate"],
    answer:
      "You're welcome! Anything else I can help with? For a quote, the form on this page is the quickest way — or call (1) 726 7941.",
  },
  {
    triggers: ["cost", "costs", "price", "prices", "pricing", "how much", "expensive", "afford", "cheapest"],
    answer:
      "All our packages are fixed-price and fully installed, with no hidden charges:\n• Essential — €1,450\n• Complete — €1,895 (most popular)\n• Premium — €2,395\nThe price includes the unit and professional installation.",
  },
  {
    triggers: ["which package", "what package", "recommend", "best package", "should i choose", "which one", "not sure which", "help me choose", "which is best"],
    answer:
      "It depends on what you're after:\n• Essential (€1,450) — whole-home limescale protection.\n• Complete (€1,895) — most popular: adds salt deliveries, priority support and a 10-year parts warranty.\n• Premium (€2,395) — adds filtered drinking water at the kitchen tap.\nMost households pick Complete. Happy to talk it through on (1) 726 7941.",
  },
  {
    triggers: ["drinking water", "drinking", "filter", "filtered", "filtration", "premium", "kitchen tap", "drink"],
    answer:
      "The Premium package (€2,395) adds integrated drinking water filtration with a dedicated filtered tap fitted at your kitchen sink, on top of everything in the Complete package.",
  },
  {
    triggers: ["salt", "top up", "topup", "top-up", "refill", "how often", "salt supply", "bags", "bag of salt"],
    answer:
      "Salt management is included with Complete and Premium — we keep an eye on your usage and deliver to your door. No contract, you just pay per delivery. Essential customers can order salt per bag. How often you need it depends on household size and water use. You can request a top-up anytime in your Customer Portal.",
  },
  {
    triggers: ["warranty", "guarantee", "guaranteed", "cover", "covered", "workmanship", "parts warranty"],
    answer:
      "Warranty depends on the package:\n• Essential — 2 years on the unit + 1 year workmanship\n• Complete — 10 years on parts + 2 years workmanship\n• Premium — 10 years on parts + 3 years workmanship\nYou can raise a claim anytime in your Customer Portal.",
  },
  {
    triggers: ["how long", "install take", "installation take", "process", "fitting", "disruption", "water off", "take to install", "long does"],
    answer:
      "Installation usually happens within the week of booking and takes about 2–4 hours. There's a brief water interruption while we connect everything, and an adult needs to be home. All installs are carried out by insured plumbers.",
  },
  {
    triggers: ["area", "cover my area", "do you cover", "location", "near me", "serve", "where do you", "outside dublin", "county"],
    answer:
      "We install across Dublin and surrounding areas. Call us on (1) 726 7941 and we'll confirm your area in about 30 seconds.",
  },
  {
    triggers: ["book", "booking", "deposit", "pay", "payment", "stripe", "bank transfer", "get started", "order", "sign up", "next step"],
    answer:
      "A 50% deposit confirms your booking (card, bank transfer, or cash), and the balance is due on installation day. To get started, use the quote form on this page or call (1) 726 7941.",
  },
  {
    triggers: ["cancel", "cooling off", "cooling-off", "refund", "change my mind", "cancellation"],
    answer:
      "If you book remotely you have a 14-day cooling-off period under the Consumer Rights Act 2022. Just let us know — a text is fine.",
  },
  {
    triggers: ["hard water", "limescale", "scale", "boiler", "appliance", "appliances", "why do i need", "benefit", "benefits", "skin", "hair"],
    answer:
      "Dublin has some of the hardest water in Ireland, which causes limescale build-up in boilers, pipes and appliances. A softener stops that from day one — protecting your heating system and appliances, and giving softer water for washing.",
  },
  {
    triggers: ["how does it work", "how it works", "how do water softeners", "regenerate", "regeneration", "how does a softener"],
    answer:
      "A water softener removes the minerals that cause limescale, using salt to regenerate periodically. Once installed you get softened water throughout the home. We test your water hardness before and after to confirm it's working.",
  },
  {
    triggers: ["maintenance", "service", "servicing", "upkeep", "look after", "maintain"],
    answer:
      "There's very little upkeep beyond keeping the salt topped up — and on Complete and Premium we handle salt deliveries for you. We also test hardness before and after install so you know it's set up correctly.",
  },
  {
    triggers: ["contact", "phone", "call", "number", "email", "talk to someone", "speak to", "human", "callback"],
    answer:
      "You can reach us on (1) 726 7941 or clearwaterireland@gmail.com. Prefer a callback? Pop your details in the quote form and we'll get back to you.",
  },
  {
    triggers: ["package", "packages", "what do you offer", "included", "difference", "essential", "complete", "options"],
    answer:
      "We offer three fully-installed packages:\n• Essential (€1,450) — whole-home limescale protection, 2-year unit + 1-year workmanship.\n• Complete (€1,895) — adds salt deliveries, priority support, 10-year parts + 2-year workmanship.\n• Premium (€2,395) — adds filtered drinking water at the kitchen tap, 10-year parts + 3-year workmanship.",
  },
];

function normalize(s: string): string {
  return " " + s.toLowerCase().replace(/[^a-z0-9€ ]/g, " ").replace(/\s+/g, " ").trim() + " ";
}

function scoreIntent(text: string, triggers: string[]): number {
  let s = 0;
  for (const t of triggers) {
    if (t.includes(" ")) {
      if (text.includes(t)) s += 2;
    } else if (text.includes(" " + t + " ")) {
      s += 1;
    }
  }
  return s;
}

function matchAnswer(input: string): string {
  const text = normalize(input);
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of KB) {
    const sc = scoreIntent(text, intent.triggers);
    if (sc > bestScore) {
      bestScore = sc;
      best = intent;
    }
  }
  return best ? best.answer : FALLBACK;
}

const CHIPS = [
  "Which package do I need?",
  "How much does it cost?",
  "How long does install take?",
  "What does the warranty cover?",
];

type Msg = { id: string; role: "assistant" | "user"; text: string };

const INTRO: Msg = {
  id: "intro-1",
  role: "assistant",
  text: "Hi there — I'm the ClearWaterIreland assistant. I can help with packages, pricing, installation, warranties, or salt supply. What would you like to know?",
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  useEffect(() => {
    if (!thinking) inputRef.current?.focus();
  }, [thinking]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    const answer = matchAnswer(trimmed);
    // small, natural pause
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", text: answer }]);
      setThinking(false);
    }, 420);
  };

  const showChips = messages.length <= 1 && !thinking;

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", borderRadius: 20, boxShadow: "0 8px 48px rgba(11,61,110,0.13)", overflow: "hidden", background: "#fff" }}>
      <div style={{ background: "var(--navy)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#fff", padding: "8px 12px", borderRadius: 10, display: "flex", alignItems: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
            <img src={logo} alt="ClearWaterIreland" style={{ height: 30, display: "block" }} loading="lazy" />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>ClearWater Assistant</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, background: "#3DDC97", borderRadius: "50%", display: "inline-block" }} />
              Online now
            </div>
          </div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>Here to help</div>
      </div>

      <div ref={scrollRef} style={{ background: "var(--surface)", height: 420, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m) =>
          m.role === "assistant" ? (
            <div key={m.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", maxWidth: "85%" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--sky)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 700 }}>C</div>
              <div style={{ background: "#fff", border: "1px solid var(--grey-3)", borderRadius: "4px 16px 16px 16px", padding: "12px 16px", fontSize: 14, color: "var(--grey-1)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{m.text}</div>
            </div>
          ) : (
            <div key={m.id} style={{ alignSelf: "flex-end", maxWidth: "75%", background: "var(--navy)", color: "#fff", borderRadius: "16px 4px 16px 16px", padding: "12px 16px", fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.text}</div>
          ),
        )}

        {thinking && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--sky)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 700 }}>C</div>
            <div style={{ background: "#fff", border: "1px solid var(--grey-3)", borderRadius: "4px 16px 16px 16px", padding: "14px 16px", display: "flex", gap: 4 }}>
              <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sky)" }} />
              <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sky)" }} />
              <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sky)" }} />
            </div>
          </div>
        )}

        {showChips && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4, paddingLeft: 42 }}>
            {CHIPS.map((c) => (
              <button key={c} onClick={() => send(c)} style={{ background: "#fff", border: "1px solid var(--sky)", color: "var(--blue)", padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 200ms" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sky)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "var(--blue)"; }}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} style={{ display: "flex", gap: 8, padding: 14, borderTop: "1px solid var(--grey-3)", background: "#fff" }}>
        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." disabled={thinking}
          style={{ flex: 1, padding: "12px 14px", border: "1px solid var(--grey-3)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", opacity: thinking ? 0.7 : 1 }} />
        <button type="submit" aria-label="Send" disabled={thinking || !input.trim()} style={{ width: 44, height: 44, borderRadius: 8, background: "var(--navy)", color: "#fff", border: 0, cursor: thinking ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: thinking || !input.trim() ? 0.5 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </form>
    </div>
  );
}
