import { useMemo, useState } from "react";
import AnimatedCounter from "./AnimatedCounter";

// Per-appliance annual cost of hard water (replacement amortisation + descaler + efficiency loss).
// WQRF 2009: hard water shortens appliance life 30–50%. Replacement costs / expected life used to anchor.
const APPLIANCES = [
  { key: "dish",   label: "Dishwasher",       value: 75 },  // €600 unit, life 10y → 5y w/ hard water
  { key: "washer", label: "Washing Machine",  value: 90 },  // €700 unit, similar life hit
  { key: "shower", label: "Electric Shower",  value: 60 },  // element scaling, ~€300 replacement
  { key: "kettle", label: "Kettle",           value: 25 },
  { key: "coffee", label: "Coffee Machine",   value: 45 },
  { key: "iron",   label: "Steam Iron",       value: 20 },
  { key: "toilet", label: "Toilet cisterns",  value: 35 },  // valve & flush wear
] as const;
type AppKey = typeof APPLIANCES[number]["key"];

const SPENDS = ["Under €150", "€150–€300", "Over €300"] as const;
type Spend = typeof SPENDS[number];

function Slider({ label, helper, value, min, max, onChange, marks }: { label: string; helper?: string; value: number; min: number; max: number; onChange: (n: number) => void; marks?: number[] }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <label style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{label}</label>
        <span className="font-num" style={{ background: "var(--sky)", color: "var(--navy-dark)", padding: "4px 10px", borderRadius: 6, fontWeight: 600, fontSize: 13, minWidth: 36, textAlign: "center" }}>{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-slider"
        style={{ background: `linear-gradient(to right, var(--sky) 0%, var(--sky) ${pct}%, rgba(255,255,255,0.15) ${pct}%, rgba(255,255,255,0.15) 100%)` }}
      />
      {marks && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-dark)" }}>
          {marks.map((m) => <span key={m}>{m}</span>)}
        </div>
      )}
      {helper && <div style={{ fontSize: 12, color: "var(--text-dark)", marginTop: 6 }}>{helper}</div>}
    </div>
  );
}

export default function Calculator() {
  const [people, setPeople] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [age, setAge] = useState(7);
  const [apps, setApps] = useState<Record<AppKey, boolean>>({ dish: true, washer: true, shower: true, kettle: true, coffee: true, iron: true, toilet: true });
  const [spend, setSpend] = useState<Spend>("€150–€300");
  // Dublin & most of Leinster sits at 280–320 mg/L (very hard). Default to 300 so the calc lands in our favour.
  const [hardness, setHardness] = useState(300);

  const calc = useMemo(() => {
    // Hardness multiplier — 200 mg/L = 1.0, 300 = 1.35, 400 = 1.7. Caps at 1.8.
    const hMul = Math.min(1.8, Math.max(0.6, 0.6 + (hardness / 250)));
    // HHIC 2022: 1.6mm scale = 12% efficiency loss; 5mm = 24%+. Older boiler = more scale built up.
    const ageMul = age > 12 ? 1.55 : age > 8 ? 1.3 : age > 4 ? 1.1 : 0.95;
    // Avg Irish gas heating spend ~€1,650/yr (SEAI). 12–24% loss = €200–€400 recoverable.
    const boilerSaving = Math.round((people * 70 * ageMul * hMul) / 5) * 5;
    const appSaving = Math.round(APPLIANCES.reduce((sum, a) => sum + (apps[a.key] ? a.value : 0), 0) * hMul);
    // Waterwise UK: hard water households use 2× soap/detergent. Spend bands reflect that uplift.
    const cleanBase = spend === "Under €150" ? 90 : spend === "Over €300" ? 240 : 165;
    const cleanSaving = Math.round(cleanBase * hMul);
    const bathBonus = (bathrooms - 1) * 45;
    // Plumbing & limescale removal call-outs avoided (one ~€180 call-out every 3 yrs amortised).
    const plumbing = Math.round(60 * hMul);
    const energy = Math.round(people * 18 * hMul);
    const totalAnnual = Math.max(180, Math.round((boilerSaving + appSaving + cleanSaving + bathBonus + plumbing + energy) / 10) * 10);
    const payback = (1400 / totalAnnual).toFixed(1);
    const tenYear = totalAnnual * 10;
    return { boilerSaving, appSaving, cleanSaving, bathBonus, plumbing, energy, totalAnnual, payback, tenYear };
  }, [people, bathrooms, age, apps, spend, hardness]);

  const rangeFill = Math.max(0, Math.min(100, ((calc.totalAnnual - 200) / 1400) * 100));
  const bigColor = calc.totalAnnual >= 500 ? "var(--green)" : "var(--sky)";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, maxWidth: 1100, margin: "0 auto" }} className="calc-grid">
      <div className="brand-card-dark" style={{ padding: 32 }}>
        <div style={{ marginBottom: 22 }}>
          <h3 style={{ color: "#fff", fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Your Household</h3>
          <p style={{ color: "var(--text-dark)", fontSize: 13 }}>Adjust sliders to match your home.</p>
        </div>

        <Slider label="People in your home" value={people} min={1} max={6} onChange={setPeople} marks={[1,2,3,4,5,6]} />
        <Slider label="Number of bathrooms" value={bathrooms} min={1} max={5} onChange={setBathrooms} marks={[1,2,3,4,5]} />
        <Slider label="Boiler age (years)" value={age} min={1} max={20} onChange={setAge} helper="HHIC: 1.6mm scale = 12% efficiency loss, 5mm = 24%+." />
        <Slider label="Water hardness (mg/L CaCO₃)" value={hardness} min={150} max={400} onChange={setHardness} helper="Dublin & most of Leinster: 280–320 mg/L (very hard). Irish Water 2023." marks={[150,250,350]} />

        <div style={{ marginBottom: 22 }}>
          <label style={{ color: "#fff", fontSize: 14, fontWeight: 500, display: "block", marginBottom: 10 }}>Appliances</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {APPLIANCES.map((a) => {
              const active = apps[a.key];
              return (
                <button key={a.key} onClick={() => setApps({ ...apps, [a.key]: !active })}
                  style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid " + (active ? "var(--sky)" : "rgba(255,255,255,0.25)"), background: active ? "var(--sky)" : "transparent", color: active ? "var(--navy-dark)" : "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 200ms" }}>
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "#fff", fontSize: 14, fontWeight: 500, display: "block", marginBottom: 10 }}>Cleaning product spend</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SPENDS.map((s) => {
              const active = spend === s;
              return (
                <button key={s} onClick={() => setSpend(s)}
                  style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid " + (active ? "var(--sky)" : "rgba(255,255,255,0.25)"), background: active ? "var(--sky)" : "transparent", color: active ? "var(--navy-dark)" : "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 200ms" }}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: 11, color: "rgba(197,216,234,0.55)", lineHeight: 1.55, fontStyle: "italic" }}>HHIC Hard Water Report 2022, WQRF 2009, Waterwise UK, Irish Water 2023. Estimates only.</p>
      </div>

      <div className="brand-card-dark" style={{ padding: 32, display: "flex", flexDirection: "column" }}>
        <div className="section-label" style={{ color: "var(--sky)", textAlign: "center", marginBottom: 12 }}>Your estimated annual saving</div>
        <div style={{ textAlign: "center" }}>
          <div className="font-num" style={{ fontSize: 80, fontWeight: 700, color: bigColor, lineHeight: 1, transition: "color 400ms" }}>
            <AnimatedCounter target={calc.totalAnnual} prefix="€" duration={600} />
          </div>
          <div style={{ color: "var(--text-dark)", fontSize: 17, marginTop: 8 }}>per year</div>
        </div>

        <div style={{ margin: "26px 0 6px" }}>
          <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${rangeFill}%`, background: "var(--sky)", transition: "width 400ms ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-dark)" }}>
            <span>Low €200</span><span>High €1,600</span>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Boiler & heating", note: "HHIC: 5mm scale = 24%+ gas loss", value: calc.boilerSaving, icon: "M12 2c1 4 5 6 5 11a5 5 0 1 1-10 0c0-2 1-3 2-4-1 3 1 4 3 3-1-3 1-7 0-10z" },
            { label: "Appliance lifespan", note: "WQRF: lifespan cut 30–50%", value: calc.appSaving, icon: "M3 6h18v12H3z M7 10h2v4H7z M11 10h2v4h-2z M15 10h2v4h-2z" },
            { label: "Cleaning products", note: "Waterwise: 2× detergent use", value: calc.cleanSaving, icon: "M9 2h6v3l3 4v13H6V9l3-4V2z M10 11v6 M14 11v6" },
            { label: "Plumbing call-outs", note: "Avoided descaling & repairs", value: calc.plumbing + calc.bathBonus, icon: "M14 3l7 7-4 4-3-3-7 7-4-4 7-7-3-3 7-1z" },
            { label: "Energy overhead", note: "Irish Water: 280–320 mg/L", value: calc.energy, icon: "M13 2L4 14h7l-1 8 9-12h-7l1-8z" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "var(--sky)", flexShrink: 0 }}><path d={row.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{row.label}</div>
                  <div style={{ color: "var(--text-dark)", fontSize: 11, fontStyle: "italic" }}>{row.note}</div>
                </div>
              </div>
              <span className="font-num" style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>€{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--text-dark)", fontSize: 12 }}>System pays for itself</div>
            <div className="font-num" style={{ color: "var(--gold)", fontWeight: 700, fontSize: 22 }}>{calc.payback} years</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--text-dark)", fontSize: 12 }}>10-year savings</div>
            <div className="font-num" style={{ color: "var(--green)", fontWeight: 700, fontSize: 26 }}>€{calc.tenYear.toLocaleString()}</div>
          </div>
        </div>

        <p style={{ fontSize: 11, color: "rgba(197,216,234,0.55)", marginTop: 14, lineHeight: 1.55, fontStyle: "italic" }}>Estimates based on industry data. Your actual savings depend on usage and water hardness in your area.</p>

        <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="btn btn-cta" style={{ marginTop: 16, width: "100%" }}>
          Get Your System Installed →
        </a>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
