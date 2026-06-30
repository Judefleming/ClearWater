import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import logo from "@/assets/clearwater-logo.png";
import beforeImg from "@/assets/before-limescale.jpg";
import afterImg from "@/assets/after-clean.jpg";
import beforeTap from "@/assets/before-tap.jpg";
import afterTap from "@/assets/after-tap.jpg";
import Nav from "@/components/site/Nav";
import BeforeAfterSlider from "@/components/site/BeforeAfterSlider";
import Calculator from "@/components/site/Calculator";
import Chatbot from "@/components/site/Chatbot";
import FloatingChat from "@/components/site/FloatingChat";
const ServiceMap = lazy(() => import("@/components/site/ServiceMap"));
import Accordion from "@/components/site/Accordion";
import AnimatedCounter from "@/components/site/AnimatedCounter";
import WaveDivider from "@/components/site/WaveDivider";
import { useInView } from "@/components/site/useInView";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { submitEnquiry } from "@/lib/site.functions";

export const Route = createFileRoute("/")({ component: Index });

const NAVY_DARK = "#002C5A";
const SURFACE = "#F5F8FC";
const NAVY = "#003E7E";

function Section({ id, bg, children, label, h2, sub, labelColor, h2Color, subColor }: { id?: string; bg: string; children: React.ReactNode; label?: string; h2?: string; sub?: string; labelColor?: string; h2Color?: string; subColor?: string }) {
  const { ref, isInView } = useInView<HTMLDivElement>(0.1);
  return (
    <section id={id} style={{ background: bg, padding: "100px max(24px, 5vw)", position: "relative" }} className={bg === NAVY_DARK ? "dark-texture" : ""}>
      <div ref={ref} className={`in-view ${isInView ? "visible" : ""}`} style={{ maxWidth: 1200, margin: "0 auto" }}>
        {(label || h2 || sub) && (
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            {label && <div className="section-label" style={{ color: labelColor || "var(--sky)", marginBottom: 14 }}>{label}</div>}
            {h2 && <h2 className="font-display" style={{ fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: 700, color: h2Color || "var(--navy-dark)", marginBottom: 16 }}>{h2}</h2>}
            {sub && <p style={{ fontSize: 17, color: subColor || "var(--grey-2)", maxWidth: 640, margin: "0 auto", lineHeight: 1.65 }}>{sub}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

const Tick = ({ color = "var(--green)" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color }}><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const X = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: "var(--grey-3)" }}><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
);
const Star = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--gold)" style={{ flexShrink: 0 }}><path d="M12 2l3 7 7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5 9 9z" /></svg>
);

function Hero() {
  return (
    <section id="home" style={{ background: NAVY_DARK, minHeight: "100vh", display: "grid", gridTemplateColumns: "55fr 45fr", position: "relative" }} className="hero-grid">
      <div style={{ position: "relative", padding: "130px 52px 80px max(28px, 4vw)", display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid rgba(255,255,255,0.08)" }} className="dark-texture hero-left">
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} aria-hidden>
          {[0, 2, 4, 6].map((d) => (
            <circle key={d} cx="20%" cy="60%" r="0" fill="none" stroke="var(--sky)" strokeWidth="1.2" className="ripple-circle" style={{ animationDelay: `${d}s` }} />
          ))}
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 700px 500px at 30% 50%, rgba(62,179,222,0.12), transparent 65%)", pointerEvents: "none" }} aria-hidden />

        <div className="hero-stagger" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", maxWidth: 540 }}>
          <div style={{ alignSelf: "flex-start", background: "#fff", padding: "12px 18px", borderRadius: 12, marginBottom: 28, boxShadow: "0 4px 16px rgba(0,0,0,0.18)" }}>
            <img src={logo} alt="ClearWaterIreland" width={160} loading="eager" style={{ display: "block", height: "auto" }} />
          </div>

          <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, border: "1px solid rgba(62,179,222,0.45)", background: "rgba(62,179,222,0.09)", padding: "7px 16px", borderRadius: 100, marginBottom: 28 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ color: "var(--sky)" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ color: "var(--sky)", fontSize: 13, fontWeight: 500 }}>Serving Dublin &amp; surrounding areas</span>
          </div>

          <h1 className="font-display" style={{ color: "#fff", fontSize: "clamp(40px, 7vw, 88px)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: 24 }}>
            Hard water<br />is <span style={{ color: "var(--sky)" }}>destroying</span><br />your home.
          </h1>

          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, maxWidth: 420, lineHeight: 1.68, marginBottom: 28 }}>
            Dublin tap water is 4–5× over the safe limit. A softener stops the damage — installed within the week.
          </p>

          <div style={{ display: "inline-flex", alignSelf: "flex-start", gap: 18, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.11)", borderRadius: 12, padding: "16px 22px", marginBottom: 32, alignItems: "center" }}>
            <div className="font-num" style={{ color: "var(--sky)", fontSize: 44, fontWeight: 700, lineHeight: 1 }}>280</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>mg/L — Dublin water hardness</span>
              <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 12 }}>Recommended max: 60 mg/L</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontStyle: "italic" }}>Source: Irish Water 2023</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="btn btn-cta">Get a Free Quote →</a>
            <a href="tel:017267941" className="btn btn-secondary-light">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Call (1) 726 7941
            </a>
          </div>

          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {["2-Year Warranty", "Same-Week Install", "No Hidden Costs"].map((t) => (
              <div key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.62)", fontSize: 13, fontWeight: 500 }}>
                <Tick /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }} className="hero-right">
        <div style={{ position: "absolute", inset: 0 }}>
          <BeforeAfterSlider beforeSrc={beforeImg} afterSrc={afterImg} borderRadius="0" />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "linear-gradient(to top, rgba(0,44,90,0.75), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 24, bottom: 20, color: "#fff", pointerEvents: "none" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>Drag to compare</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>Before and after softener installation — Dublin</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr !important; min-height: auto !important; }
          .hero-left { padding: 110px 24px 60px !important; }
          .hero-right { min-height: 320px !important; height: 320px; }
        }
      `}</style>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: "M12 2l9 4v6c0 5-3.5 9-9 10-5.5-1-9-5-9-10V6l9-4z", text: "Dublin water is 4–5× too hard" },
    { icon: "M12 2c1 4 5 6 5 11a5 5 0 1 1-10 0c0-2 1-3 2-4-1 3 1 4 3 3-1-3 1-7 0-10z", text: "40% boiler efficiency lost to scale" },
    { icon: "M3 6h18v12H3z M7 10h2v4H7z M11 10h2v4h-2z M15 10h2v4h-2z", text: "Appliances fail 30–50% sooner" },
    { icon: "M12 2v6 M12 22v-4 M4.93 4.93l4.24 4.24 M14.83 14.83l4.24 4.24 M2 12h6 M16 12h6 M4.93 19.07l4.24-4.24 M14.83 9.17l4.24-4.24", text: "One softener fixes all of it" },
  ];
  return (
    <div style={{ background: NAVY, padding: "22px max(24px, 5vw)", display: "flex", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap", gap: 20 }} className="trustbar">
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontSize: 14, fontWeight: 500 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "var(--sky)", flexShrink: 0 }}><path d={it.icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>{it.text}</span>
          {i < items.length - 1 && <span style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", marginLeft: 20 }} className="trust-divider" />}
        </div>
      ))}
      <style>{`@media (max-width: 700px) { .trust-divider { display: none; } .trustbar { gap: 14px !important; } }`}</style>
    </div>
  );
}

const DAMAGE = [
  { icon: "M12 2c1 4 5 6 5 11a5 5 0 1 1-10 0c0-2 1-3 2-4-1 3 1 4 3 3-1-3 1-7 0-10z", stat: "–40%", title: "Boiler Efficiency", desc: "1.6mm of scale reduces boiler efficiency 40%.", source: "HHIC" },
  { icon: "M12 2v4 M12 18v4 M4 12H0 M24 12h-4 M19 5l-3 3 M8 16l-3 3 M19 19l-3-3 M8 8L5 5 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", stat: "–50%", title: "Appliance Lifespan", desc: "Hard water appliances fail up to 50% sooner.", source: "WQRF 2009" },
  { icon: "M9 2h6v3l3 4v13H6V9l3-4V2z M10 11v6 M14 11v6", stat: "2× more", title: "Cleaning Products", desc: "Hard water households use twice as much detergent.", source: "Waterwise UK" },
  { icon: "M3 12c0-3 2-5 5-5h8c3 0 5 2 5 5s-2 5-5 5H8c-3 0-5-2-5-5z M7 12h10", stat: "€1,000+", title: "Pipe & Fixture Damage", desc: "Scale builds inside pipes requiring expensive repair.", source: "Irish plumbing costs" },
];

function ProblemSection() {
  return (
    <Section id="problem" bg={SURFACE} label="The Problem" h2="What hard water is silently costing you" sub="Most homeowners only find out when the boiler fails.">


      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 960, margin: "0 auto" }}>
        {DAMAGE.map((d) => (
          <div key={d.title} className="brand-card-light" style={{ padding: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(0,62,126,0.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ color: "var(--navy)" }}><path d={d.icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div className="font-num" style={{ color: "var(--sky)", fontSize: 38, fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>{d.stat}</div>
            <div style={{ color: "var(--navy-dark)", fontWeight: 600, fontSize: 17, marginBottom: 8 }}>{d.title}</div>
            <div style={{ color: "var(--grey-1)", fontSize: 15, lineHeight: 1.6, marginBottom: 14 }}>{d.desc}</div>
            <div style={{ borderTop: "1px solid var(--grey-3)", paddingTop: 10, color: "var(--grey-2)", fontSize: 12, fontStyle: "italic" }}>Source: {d.source}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 52, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, maxWidth: 960, margin: "52px auto 0", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }} className="problem-compare">
        <div style={{ position: "relative", height: 340 }}>
          <img src={beforeTap} alt="Same tap with heavy limescale buildup" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
          <span style={{ position: "absolute", bottom: 20, left: 20, background: "rgba(199,48,48,0.92)", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", padding: "6px 14px", borderRadius: 999, textTransform: "uppercase" }}>Before — Hard Water</span>
          <div style={{ position: "absolute", bottom: 52, left: 20, right: 20, color: "#fff", fontSize: 14, fontWeight: 500, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>Limescale crust on taps, shower-heads &amp; appliances</div>
        </div>
        <div style={{ position: "relative", height: 340 }}>
          <img src={afterTap} alt="Same tap completely clean after softener" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
          <span style={{ position: "absolute", bottom: 20, left: 20, background: "rgba(39,122,39,0.92)", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", padding: "6px 14px", borderRadius: 999, textTransform: "uppercase" }}>After — Softened Water</span>
          <div style={{ position: "absolute", bottom: 52, left: 20, right: 20, color: "#fff", fontSize: 14, fontWeight: 500, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>Spotless fixtures, longer appliance life &amp; better skin</div>
        </div>
      </div>
      <p style={{ textAlign: "center", marginTop: 16, color: "var(--grey-2)", fontSize: 13, fontStyle: "italic" }}>Real results from a Dublin home after ClearWaterIreland installation</p>

      <style>{`@media (max-width: 700px) { .problem-compare { grid-template-columns: 1fr !important; } .problem-compare > div { height: 260px !important; } }`}</style>

      <div style={{ marginTop: 52, background: NAVY_DARK, borderRadius: 16, padding: 40, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }} className="dark-texture">
        <div style={{ flex: "1 1 360px" }}>
          <div className="font-display" style={{ color: "#fff", fontWeight: 600, fontSize: 26, lineHeight: 1.2 }}>The average Dublin home loses €450–€650 per year to hard water.</div>
          <div style={{ color: "var(--text-dark)", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>Based on HHIC and Irish Water data.</div>
        </div>
        <a href="#calculator" onClick={(e) => { e.preventDefault(); document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" }); }} className="btn btn-cta">See Your Savings →</a>
      </div>

    </Section>
  );
}

const ESSENTIAL_FEATURES = [
  "Professional supply and installation",
  "Whole-home limescale protection",
  "Protection for appliances and plumbing",
  "Water hardness test before and after installation",
  "Bypass valve fitted and tested",
  "Customer portal access",
  "Digital documentation pack",
  "2-year unit warranty + 1-year workmanship",
];
const COMPLETE_EXTRAS = [
  "Salt management programme access",
  "Priority support",
  "Digital service history",
  "10-year manufacturer parts warranty",
  "10-year parts warranty + 2-year workmanship",
];
const PREMIUM_EXTRAS = [
  "Integrated drinking water filtration",
  "Filtered drinking water tap supplied and fitted at the kitchen sink",
  "10-year parts warranty + 3-year workmanship",
];

function PriceCard({
  tier, subtitle, price, features, extras, badgeText, accent, ctaHref, ctaLabel, ribbonText,
}: {
  tier: string; subtitle: string; price: number;
  features: string[]; extras?: { title: string; items: string[] };
  badgeText: string; accent: "navy" | "gold";
  ctaHref: string; ctaLabel: string; ribbonText?: string;
}) {
  const isGold = accent === "gold";
  const headerBg = isGold
    ? "linear-gradient(155deg, var(--navy-dark) 0%, var(--navy) 60%, #1a3d6b 100%)"
    : "linear-gradient(155deg, var(--navy) 0%, var(--navy-mid) 100%)";
  const accentColor = isGold ? "var(--gold)" : "var(--sky)";
  return (
    <div className="brand-card-light" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", border: isGold ? "2px solid var(--gold)" : "1px solid var(--grey-3)", position: "relative", boxShadow: isGold ? "0 20px 50px -20px rgba(201,168,76,0.45)" : "0 10px 30px -15px rgba(15,35,75,0.25)" }}>
      {ribbonText && (
        <div style={{ position: "absolute", top: 22, right: -42, transform: "rotate(35deg)", background: "var(--gold)", color: "var(--navy-dark)", padding: "6px 48px", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>{ribbonText}</div>
      )}
      <div style={{ background: headerBg, padding: "32px 32px 28px", color: "#fff", position: "relative" }}>
        <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: `1px solid ${isGold ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.15)"}`, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: accentColor, marginBottom: 12 }}>{badgeText}</div>
        <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: isGold ? "var(--gold)" : "#fff" }}>{tier}</div>
        <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 13, marginTop: 4 }}>{subtitle}</div>

        <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <div className="font-num" style={{ fontSize: 42, fontWeight: 700, color: accentColor, lineHeight: 1 }}>€{price.toLocaleString()}</div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 6 }}>
          fixed price · fully installed
        </div>
      </div>

      <div style={{ padding: 28, display: "flex", flexDirection: "column", flex: 1 }}>
        <div className="section-label" style={{ color: "var(--navy)", marginBottom: 14 }}>What's included</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {features.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--grey-1)" }}><Tick /> {f}</div>
          ))}
        </div>

        {extras && (
          <>
            <div className="section-label" style={{ color: "var(--gold)", marginTop: 24, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 2l2.39 7.36H22l-6.18 4.49L18.21 21 12 16.5 5.79 21l2.39-7.15L2 9.36h7.61z"/></svg>
              {extras.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {extras.items.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--grey-1)", background: "linear-gradient(90deg, rgba(201,168,76,0.10), transparent)", borderLeft: "3px solid var(--gold)", paddingLeft: 12, paddingTop: 6, paddingBottom: 6, borderRadius: "0 6px 6px 0" }}><Star /> {f}</div>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          <a href={ctaHref} onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className={isGold ? "btn btn-gold" : "btn btn-navy"} style={{ width: "100%" }}>{ctaLabel}</a>
        </div>
      </div>
    </div>
  );
}

function Packages() {
  return (
    <Section id="packages" bg="#fff" label="Packages" h2="Three ways to never see limescale again." sub="Choose the level of protection that fits your home.">

      {/* Trust badge strip */}
      <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", marginBottom: 36, padding: "16px 24px", background: "var(--surface)", borderRadius: 12, maxWidth: 760, margin: "0 auto 36px", border: "1px solid var(--grey-3)" }}>
        {[
          { icon: "M9 12l2 2 4-4M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z", text: "100+ Dublin installs" },
          { icon: "M12 2L4 14h7l-1 8 9-12h-7l1-8z", text: "Installed in 2–4 hrs" },
          { icon: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z", text: "Up to 10-yr warranty" },
          { icon: "M20 6L9 17l-5-5", text: "Fixed price in writing" },
        ].map((b) => (
          <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--navy-dark)", fontWeight: 600 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={b.icon}/></svg>
            {b.text}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, maxWidth: 1200, margin: "0 auto", alignItems: "stretch" }} className="pkg-grid">
        <PriceCard
          tier="Essential"
          subtitle="Limescale Removal & Home Protection"
          price={1450}
          features={ESSENTIAL_FEATURES}
          badgeText="Foundation"
          accent="navy"
          ctaHref="#contact"
          ctaLabel="Book Essential"
        />
        <PriceCard
          tier="Complete"
          subtitle="Long-Term Limescale Protection"
          price={1895}
          features={ESSENTIAL_FEATURES}
          extras={{ title: "Everything in Essential, plus:", items: COMPLETE_EXTRAS }}
          badgeText="Recommended"
          accent="gold"
          ribbonText="Most popular"
          ctaHref="#contact"
          ctaLabel="Book Complete"
        />
        <PriceCard
          tier="Premium"
          subtitle="Complete Water Protection & Filtration"
          price={2395}
          features={ESSENTIAL_FEATURES}
          extras={{ title: "Everything in Complete, plus:", items: [...COMPLETE_EXTRAS.slice(0, 4), ...PREMIUM_EXTRAS] }}
          badgeText="Top tier"
          accent="navy"
          ctaHref="#contact"
          ctaLabel="Book Premium"
        />
      </div>

      <div style={{ textAlign: "center", marginTop: 32, padding: "20px 28px", background: "linear-gradient(135deg, var(--surface) 0%, #fff 100%)", border: "1px solid var(--grey-3)", borderRadius: 12, maxWidth: 720, margin: "32px auto 0" }}>
        <div style={{ fontSize: 15, color: "var(--navy-dark)", fontWeight: 600, marginBottom: 4 }}>
          Still deciding? We'll match you to the right unit in 60 seconds.
        </div>
        <div style={{ fontSize: 14, color: "var(--grey-2)" }}>
          No hard sell — just an honest recommendation. <a href="tel:017267941" style={{ color: "var(--blue)", fontWeight: 700 }}>Call (1) 726 7941</a>
        </div>
      </div>

      <style>{`@media (max-width: 1024px) { .pkg-grid { grid-template-columns: 1fr !important; max-width: 520px !important; } }`}</style>
    </Section>
  );
}

function HowItWorks() {
  const steps = [
    { n: 1, icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z", title: "Get in Touch", desc: "Call or text (1) 726 7941. Right package, firm price, no site visit needed.", pill: "Same-day response" },
    { n: 2, icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z", title: "We Install", desc: "Installer arrives on agreed date, 2–4 hours, tests everything, leaves spotless.", pill: "Within the week" },
    { n: 3, icon: "M12 2C8 8 4 12 4 16a8 8 0 0 0 16 0c0-4-4-8-8-14z", title: "Soft Water. Done.", desc: "100% soft water throughout your home from day one.", pill: "Warranty starts immediately" },
  ];
  return (
    <Section id="how-it-works" bg={SURFACE} label="The Process" h2="From first call to soft water — in days." sub="Straightforward and honest. No surprises.">
      <div style={{ display: "flex", gap: 20, maxWidth: 1000, margin: "0 auto", alignItems: "stretch", flexWrap: "wrap", justifyContent: "center" }} className="how-row">
        {steps.map((s, i) => (
          <div key={s.n} style={{ flex: "1 1 260px", maxWidth: 320, position: "relative" }}>
            <div className="brand-card-light" style={{ padding: 32, borderRadius: 24, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--navy)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, fontFamily: "'Cormorant Garamond', serif", marginBottom: 16 }}>{s.n}</div>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: "var(--sky)", marginBottom: 14 }}><path d={s.icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div style={{ color: "var(--navy-dark)", fontWeight: 600, fontSize: 20, marginBottom: 10 }}>{s.title}</div>
              <div style={{ color: "var(--grey-1)", fontSize: 15, lineHeight: 1.6, maxWidth: 240 }}>{s.desc}</div>
              {s.n === 3 && (
                <>
                  <img src={afterImg} alt="Clean tap after softener installation" style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover", margin: "16px auto 6px", display: "block" }} loading="lazy" />
                  <div style={{ fontSize: 11, color: "var(--grey-2)" }}>The result — from day one.</div>
                </>
              )}
              <div style={{ marginTop: 16, padding: "6px 14px", borderRadius: 999, background: "var(--sky-tint)", border: "1px solid var(--sky-light)", color: "var(--sky)", fontSize: 12, fontWeight: 600 }}>{s.pill}</div>
            </div>

          </div>
        ))}
      </div>

      <div style={{ marginTop: 52, background: NAVY_DARK, borderRadius: 16, padding: 32, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }} className="dark-texture">
        <div className="font-display" style={{ color: "#fff", fontWeight: 600, fontSize: 28 }}>Ready to book?</div>
        <a href="tel:017267941" className="font-num" style={{ color: "#fff", fontWeight: 700, fontSize: 26 }}>(1) 726 7941</a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="btn btn-cta">Book Now</a>
      </div>

      <style>{`@media (max-width: 900px) { .how-connector { display: none; } }`}</style>
    </Section>
  );
}

function SocialProof() {
  const stats = [
    { v: 100, suffix: "+", label: "Customers" },
    { v: 4, prefix: "2–", suffix: " hrs", label: "Install" },
    { v: 100, suffix: "%", label: "Limescale Removed" },
    { v: 10, suffix: "yr", label: "Max Warranty" },
  ];
  const reviews = [
    { quote: "Had our softener installed last Tuesday. Liam was on time, professional, and left the place spotless. The kettle is clean for the first time in years.", name: "Sarah M.", loc: "Lucan" },
    { quote: "Got the Premium with the filtered tap. Genuinely one of the best things we've done for the house. The smart app tells you exactly when to top up.", name: "David K.", loc: "Dublin 15" },
    { quote: "Called Monday, installed Wednesday. Explained everything clearly, all documents ready. Straightforward honest service.", name: "Aoife B.", loc: "Dublin 6" },
  ];
  return (
    <Section id="reviews" bg={NAVY} label="Trusted Across Dublin" h2="Real homes. Real results." labelColor="var(--gold)" h2Color="#fff" subColor="var(--text-dark)">
      <div style={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: "center", minWidth: 140 }}>
            <div className="font-num" style={{ color: "#fff", fontWeight: 700, fontSize: 56, lineHeight: 1 }}>
              <AnimatedCounter target={s.v} prefix={s.prefix || ""} suffix={s.suffix || ""} />
            </div>
            <div style={{ color: "rgba(168,216,240,0.8)", fontSize: 14, fontWeight: 500, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {reviews.map((r) => (
          <div key={r.name} style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}
            </div>
            <div className="font-display" style={{ color: "var(--grey-1)", fontStyle: "italic", fontSize: 17, lineHeight: 1.65, marginBottom: 18 }}>"{r.quote}"</div>
            <div style={{ color: "var(--navy-dark)", fontWeight: 600, fontSize: 14 }}>{r.name}</div>
            <div style={{ color: "var(--grey-2)", fontSize: 13 }}>{r.loc}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <a href="https://www.google.com/search?q=ClearWaterIreland" target="_blank" rel="noopener noreferrer" style={{ color: "var(--sky)", fontWeight: 500, fontSize: 14 }}>Leave us a review on Google →</a>
      </div>
    </Section>
  );
}

function SaltPlan() {
  const steps = [
    { n: "01", title: "We Check In", desc: "Track usage so you never run out. We message before you're empty." },
    { n: "02", title: "We Deliver", desc: "Right salt for your softener, brought to your door on a date that suits you." },
    { n: "03", title: "You're Sorted", desc: "Pay per delivery. No contract. Cancel any time." },
  ];
  return (
    <Section id="salt-plan" bg={SURFACE} label="Salt Supply Plan" h2="Never run out of salt again." sub="We track it, deliver it, sort it. No contract, pay per delivery.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 960, margin: "0 auto 44px" }}>
        {steps.map((s) => (
          <div key={s.n} className="brand-card-light" style={{ padding: 28 }}>
            <div className="font-num" style={{ color: "var(--sky)", fontSize: 52, fontWeight: 700, lineHeight: 1, marginBottom: 12 }}>{s.n}</div>
            <div style={{ color: "var(--navy-dark)", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{s.title}</div>
            <div style={{ color: "var(--grey-1)", fontSize: 15, lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 880, margin: "0 auto 36px" }} className="salt-grid">
        <div className="brand-card-light" style={{ padding: 28 }}>
          <div className="section-label" style={{ color: "var(--navy)", marginBottom: 14 }}>Your job</div>
          {["Tell us if location changes", "Be home or tell us where to leave it", "Pay per delivery"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--grey-1)", marginBottom: 10 }}><Tick /> {t}</div>
          ))}
        </div>
        <div className="brand-card-light" style={{ padding: 28 }}>
          <div className="section-label" style={{ color: "var(--navy)", marginBottom: 14 }}>Our job</div>
          {["Track when you're low", "Message before every delivery", "Correct salt for your unit", "Keep delivery records"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--grey-1)", marginBottom: 10 }}><Tick /> {t}</div>
          ))}
        </div>
      </div>

      <div style={{ background: NAVY_DARK, borderRadius: 16, padding: 32, textAlign: "center" }} className="dark-texture">
        <div className="font-display" style={{ color: "#fff", fontWeight: 600, fontSize: 24, marginBottom: 8 }}>No contract. No minimum order. Cancel any time.</div>
        <a href="tel:017267941" className="font-num" style={{ color: "var(--sky)", fontWeight: 600, fontSize: 20 }}>(1) 726 7941</a>
      </div>

      <style>{`@media (max-width: 700px) { .salt-grid { grid-template-columns: 1fr !important; } }`}</style>
    </Section>
  );
}

const FAQS = [
  { question: "How long does installation take?", answer: "2–4 hours. Adult 18+ must be present. Brief water interruption. We leave completely clean." },
  { question: "Do I need a plumber beforehand?", answer: "No. Our installer handles everything — fittings, bypass valve, drain connection, salt charge." },
  { question: "What salt does my softener need?", answer: "Essential & Complete: tablet or block salt. Premium: tablet salt only. Never cooking salt or road grit." },
  { question: "Is softened water safe to drink?", answer: "Safe for most adults. Not for infant formula or low-sodium diets due to added sodium. Premium customers have a filtered drinking tap at the kitchen sink — no added sodium, suitable for everyone." },
  { question: "What if something goes wrong?", answer: "Call (1) 726 7941. Active leaks: same-day. System faults: 2 working days. Warranty fixes at no charge." },
  { question: "What does the warranty cover?", answer: "Essential: 2-year unit + 1-year workmanship. Complete: 10-year parts + 2-year workmanship. Premium: 10-year parts + 3-year workmanship. All in addition to Consumer Rights Act 2022 rights." },
  { question: "Can I cancel after booking?", answer: "14-day cooling-off period if booked remotely. Text is fine. After 14 days deposit may be retained." },
  { question: "How often do I top up salt?", answer: "1–2 people monthly. 3–4 people every 2–3 weeks. 5+ people weekly. Salt Supply Plan handles this for you." },
  { question: "Do you cover my area?", answer: "Dublin and surrounding areas. Call (1) 726 7941 to confirm in 30 seconds." },
  { question: "Which package should I choose?", answer: "Essential €1,450: whole-home limescale protection with 2-year unit + 1-year workmanship warranty. Complete €1,895 (most popular): adds salt management, priority support, digital service history and a 10-year parts warranty. Premium €2,395: adds integrated drinking water filtration with a filtered tap fitted at the kitchen sink." },
];

function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", pkg: "Not sure", location: "", timing: "Within 2 weeks" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const submit = useServerFn(submitEnquiry);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "This field is required";
    if (!form.phone.trim()) errs.phone = "This field is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await submit({
        data: {
          name: form.name,
          phone: form.phone,
          location: form.location,
          pkg: form.pkg,
          timing: form.timing,
        },
      });
    } catch {
      // best-effort: still show success so the visitor isn't blocked
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ color: "var(--green)", margin: "0 auto 16px", display: "block" }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="font-display" style={{ color: "var(--navy-dark)", fontWeight: 600, fontSize: 24, marginBottom: 8 }}>Thanks — we'll call you back within the hour.</div>
        <div style={{ color: "var(--grey-2)", fontSize: 14 }}>If urgent, <a href="tel:017267941" style={{ color: "var(--blue)", fontWeight: 600 }}>call (1) 726 7941</a> now.</div>
      </div>
    );
  }

  const inputStyle = (field: string) => ({
    width: "100%", padding: "13px 16px", borderRadius: 10, border: `1px solid ${errors[field] ? "var(--red)" : "var(--grey-3)"}`,
    fontSize: 14, fontFamily: "inherit", outline: "none", transition: "all 200ms",
  });

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="section-label" style={{ color: "var(--green)" }}>Get a free quote</div>
      <div>
        <input style={inputStyle("name")} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        {errors.name && <div style={{ color: "var(--red)", fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
      </div>
      <div>
        <input type="tel" style={inputStyle("phone")} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        {errors.phone && <div style={{ color: "var(--red)", fontSize: 12, marginTop: 4 }}>{errors.phone}</div>}
      </div>
      <select style={inputStyle("pkg")} value={form.pkg} onChange={(e) => setForm({ ...form, pkg: e.target.value })}>
        <option>Essential — €1,450</option>
        <option>Complete — €1,895 (Recommended)</option>
        <option>Premium — €2,395</option>
        <option>Not sure</option>
      </select>
      <input style={inputStyle("location")} placeholder="Location (e.g. Lucan, Dublin 6)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <select style={inputStyle("timing")} value={form.timing} onChange={(e) => setForm({ ...form, timing: e.target.value })}>
        <option>This week</option>
        <option>Within 2 weeks</option>
        <option>Just researching</option>
      </select>
      <button type="submit" className="btn btn-navy" style={{ width: "100%", marginTop: 8 }} disabled={submitting}>
        {submitting ? "Sending…" : "Send My Enquiry →"}
      </button>
    </form>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#07192F", padding: "64px max(24px, 5vw) 0", color: "rgba(255,255,255,0.7)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40 }} className="footer-grid">
        <div>
          <div style={{ alignSelf: "flex-start", background: "#fff", padding: "10px 14px", borderRadius: 12, display: "inline-flex", boxShadow: "0 4px 16px rgba(0,0,0,0.14)", marginBottom: 16 }}>
            <img src={logo} alt="ClearWaterIreland" width={170} loading="lazy" style={{ display: "block", height: "auto" }} />
          </div>
          <div className="font-display" style={{ fontStyle: "italic", color: "var(--sky)", fontSize: 15, marginBottom: 12 }}>Soft water. Sorted.</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, maxWidth: 220, marginBottom: 16, lineHeight: 1.6 }}>Water softener installation across Dublin and surrounding areas.</div>
          <a href="tel:017267941" className="font-num" style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>(1) 726 7941</a>
        </div>

        {[
          { h: "Services", links: ["Water Softener Installation", "Essential — €1,450", "Complete — €1,895", "Premium — €2,395", "Salt Supply Plan", "Aftercare & Support"] },
          { h: "Information", links: ["How It Works", "Savings Calculator", "FAQ", "Service Areas", "About Us"] },
          { h: "Legal", links: ["Terms & Conditions", "Privacy Policy", "Warranty Policy", "Cookie Policy"] },
        ].map((col) => (
          <div key={col.h}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>{col.h}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((l) => (
                <li key={l}><a href="#" style={{ color: "rgba(255,255,255,0.52)", fontSize: 14, transition: "color 200ms" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.52)")}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "48px auto 0", padding: "24px 0", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 13 }}>© 2026 ClearWaterIreland. All rights reserved.</div>
        <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 13 }}>Governed by the laws of Ireland.</div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 540px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

function Index() {
  // Smooth scroll on hash mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, []);

  return (
    <>
      <Nav />

      <Hero />
      <TrustBar />

      <WaveDivider fill={SURFACE} />
      <ProblemSection />

      <WaveDivider fill="#fff" />
      <Packages />

      <WaveDivider fill={NAVY_DARK} />
      <Section id="calculator" bg={NAVY_DARK} label="Savings Calculator" h2="See exactly what hard water is costing you" sub="Based on verified data from Irish Water, the HHIC, and the Water Quality Research Foundation." labelColor="var(--gold)" h2Color="#fff" subColor="var(--text-dark)">
        <Calculator />
      </Section>

      <WaveDivider fill={SURFACE} />
      <HowItWorks />

      <WaveDivider fill="#fff" />
      <Section id="chatbot" bg="#fff" label="Ask Us Anything" h2="Instant answers from our Water Softener Expert" sub="Ask below — our assistant knows everything about ClearWaterIreland.">
        <Chatbot />
        <p style={{ textAlign: "center", marginTop: 24, color: "var(--grey-2)", fontSize: 14 }}>
          Prefer to speak to someone? <a href="tel:017267941" style={{ color: "var(--blue)", fontWeight: 600 }}>Call (1) 726 7941</a> — same-day response.
        </p>
      </Section>

      <WaveDivider fill={NAVY} />
      <SocialProof />

      <WaveDivider fill={SURFACE} />
      <SaltPlan />

      <WaveDivider fill="#fff" />
      <Section id="service-area" bg="#fff" label="Where We Work" h2="Dublin & surrounding areas — same-week availability." sub="Based locally.">
        <Suspense fallback={<div style={{ height: 420, maxWidth: 640, margin: "0 auto", borderRadius: 16, background: "var(--surface)" }} />}>
          <ServiceMap />
        </Suspense>
        <p style={{ textAlign: "center", marginTop: 24, color: "var(--grey-2)", fontSize: 15 }}>
          Not sure if we cover your area? <a href="tel:017267941" style={{ color: "var(--blue)", fontWeight: 600 }}>Call (1) 726 7941</a> — confirmed in 30 seconds.
        </p>
      </Section>

      <WaveDivider fill={SURFACE} />
      <Section id="faq" bg={SURFACE} label="FAQ" h2="Questions, answered." sub="Everything you might want to know before booking.">
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <Accordion items={FAQS} />
        </div>
      </Section>

      <WaveDivider fill={NAVY_DARK} />
      <section id="contact" style={{ background: NAVY_DARK, padding: "100px max(24px, 5vw)", position: "relative", overflow: "hidden" }} className="dark-texture">
        <div style={{ maxWidth: 980, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 className="font-display" style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(40px, 6vw, 60px)" }}>Ready to protect your home?</h2>
            <p style={{ color: "var(--text-dark)", fontSize: 18, maxWidth: 560, margin: "16px auto 0", lineHeight: 1.6 }}>Clear price. Installed within the week. No hard sell, ever.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 860, margin: "0 auto" }} className="contact-grid">
            <div style={{ background: "#fff", borderRadius: 24, padding: 36 }}>
              <div className="section-label" style={{ color: "var(--sky)", marginBottom: 14 }}>Speak to us now</div>
              <a href="tel:017267941" className="font-num" style={{ display: "block", color: "var(--navy-dark)", fontWeight: 700, fontSize: 44, marginBottom: 8, lineHeight: 1.05 }}>(1) 726 7941</a>
              <div style={{ color: "var(--grey-2)", fontSize: 14, marginBottom: 18 }}>Call or text — same-day response</div>
              <div style={{ borderTop: "1px solid var(--grey-3)", paddingTop: 18, marginBottom: 18, color: "var(--grey-2)", fontSize: 13, lineHeight: 1.5 }}>Mon–Fri business hours. Urgent leaks — call any time.</div>
              <a href="tel:017267941" className="btn btn-cta" style={{ width: "100%" }}>Tap to Call Now</a>
            </div>

            <div style={{ background: "#fff", borderRadius: 24, padding: 36 }}>
              <ContactForm />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", marginTop: 36 }}>
            {[
              { icon: "M12 11V7a4 4 0 1 1 8 0v4 M5 11h14v10H5z", text: "No obligation." },
              { icon: "M5 12l5 5L20 7", text: "Price confirmed in writing." },
              { icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z M14 2v6h6 M9 13h6 M9 17h4", text: "Full document pack included." },
            ].map((t) => (
              <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(197,216,234,0.8)", fontSize: 14 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d={t.icon} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t.text}
              </div>
            ))}
          </div>
        </div>

        <style>{`@media (max-width: 760px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      <WaveDivider fill={NAVY} />
      <section style={{ background: NAVY, padding: "90px max(24px, 5vw)", position: "relative", overflow: "hidden" }} className="dark-texture">
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="section-label" style={{ color: "var(--sky)", marginBottom: 14 }}>Existing Customers</div>
          <h2 className="font-display" style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(36px, 5vw, 52px)", lineHeight: 1.1 }}>Already a ClearWaterIreland customer?</h2>
          <p style={{ color: "var(--text-dark)", fontSize: 17, maxWidth: 520, margin: "18px auto 32px", lineHeight: 1.6 }}>
            Log in to your customer portal to view your documents, check your warranty, request a salt top-up, and chat with our assistant.
          </p>
          <Link to="/portal" className="btn btn-cta" style={{ padding: "14px 28px" }}>Go to Customer Portal →</Link>
          <div style={{ marginTop: 20, color: "rgba(197,216,234,0.75)", fontSize: 14 }}>
            New customer? Call <a href="tel:017267941" style={{ color: "var(--sky)", fontWeight: 600 }}>(1) 726 7941</a> for a free quote.
          </div>
        </div>
      </section>

      <Footer />
      <FloatingChat />
    </>
  );
}
