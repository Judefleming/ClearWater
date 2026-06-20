import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getWarranty, raiseWarrantyClaim } from "@/lib/portal.functions";

export const Route = createFileRoute("/portal/warranty")({
  component: PortalWarranty,
});

const PACKAGE_META: Record<string, { label: string; price: string; tagline: string; coverage: string[] }> = {
  essential: {
    label: "Essential",
    price: "€1,450",
    tagline: "2-year unit cover + 1-year workmanship",
    coverage: [
      "Softener unit: 2 years parts & labour",
      "Workmanship & installation: 1 year",
      "Same-day response for active leaks",
      "Advice line: (1) 726 7941",
    ],
  },
  complete: {
    label: "Complete",
    price: "€1,895",
    tagline: "10-year parts warranty + 2-year workmanship",
    coverage: [
      "Core parts (tank, valve body): 10 years",
      "Workmanship & installation: 2 years",
      "Priority same-day response for active leaks",
      "Advice line: (1) 726 7941",
    ],
  },
  premium: {
    label: "Premium",
    price: "€2,395",
    tagline: "10-year parts warranty + 3-year workmanship",
    coverage: [
      "Core parts (tank, valve body): 10 years",
      "Drinking-water tap & filter: covered",
      "Workmanship & installation: 3 years",
      "Priority same-day response for active leaks",
    ],
  },
};

const NOT_COVERED = [
  "Damage from third-party plumbing changes",
  "Use of an incorrect salt type",
  "Power surges from unprotected mains",
];

function fmt(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IE", { year: "numeric", month: "short", day: "numeric" });
}

function PortalWarranty() {
  const fetchWarranty = useServerFn(getWarranty);
  const { data, isLoading, error } = useQuery({
    queryKey: ["portal", "warranty"],
    queryFn: () => fetchWarranty(),
    retry: false,
  });

  if (isLoading) return <div style={{ color: "var(--grey-2)" }}>Loading your warranty…</div>;
  if (error) return <div style={{ color: "var(--red)" }}>Couldn't load warranty: {(error as Error).message}</div>;

  const pkg = (data?.package ?? "") as string;
  const meta = PACKAGE_META[pkg];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <header>
        <div className="section-label" style={{ marginBottom: 8 }}>Warranty</div>
        <h1 className="portal-display" style={{ fontSize: 32, color: "var(--portal-navy-dark)", margin: 0 }}>
          Your warranty cover
        </h1>
        <p style={{ color: "var(--grey-2)", marginTop: 8, maxWidth: 640 }}>
          Keep this certificate for your records. Active leaks always get a same-day response.
        </p>
      </header>

      <WarrantyCertificate data={data} meta={meta} />

      <ClaimForm hasWarranty={!!data?.warranty} />

      <RecentClaims claims={data?.claims ?? []} />
    </div>
  );
}

function WarrantyCertificate({ data, meta }: { data: any; meta: any }) {
  const w = data?.warranty;
  const accent = data?.package === "complete" ? "#c9a84c" : data?.package === "premium" ? "#1a3a6b" : "var(--portal-sky)";
  const installed = data?.installation?.completion_time ?? data?.installation?.scheduled_date ?? null;

  return (
    <article className="portal-card" style={{ borderTop: `4px solid ${accent}`, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: accent }}>
            Warranty certificate
          </div>
          <h2 style={{ fontSize: 22, margin: "4px 0 0", color: "var(--portal-navy-dark)" }}>
            {meta ? `ClearWater ${meta.label} — ${meta.price}` : "ClearWater Warranty"}
          </h2>
          <p style={{ margin: "4px 0 0", color: "var(--grey-2)", fontSize: 13 }}>
            {meta?.tagline ?? "Cover begins once your unit is installed."}
          </p>
        </div>
        <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: w ? "var(--portal-green)" : "var(--grey-2)", color: "#fff", whiteSpace: "nowrap" }}>
          {w ? (w.status === "active" ? "Active" : w.status) : "Pending install"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, padding: 12, background: "var(--portal-surface)", borderRadius: 10 }}>
        <Detail label="Customer" value={data?.customerName ?? "—"} />
        <Detail label="Serial" value={data?.installation?.serial_number ?? "—"} />
        <Detail label="Installed" value={fmt(installed)} />
        <Detail label="Workmanship until" value={fmt(w?.work_expiry)} />
        <Detail label="Parts until" value={fmt(w?.mfr_expiry)} />
      </div>

      {meta && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--portal-navy-dark)", marginBottom: 6 }}>What's covered</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--grey-1)", fontSize: 13, lineHeight: 1.6 }}>
            {meta.coverage.map((c: string) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      )}

      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--portal-navy-dark)", marginBottom: 6 }}>Not covered</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--grey-2)", fontSize: 13, lineHeight: 1.6 }}>
          {NOT_COVERED.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </div>

      <div style={{ padding: 12, background: "var(--portal-surface)", borderRadius: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--grey-2)", marginBottom: 8 }}>
          All packages at a glance
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--grey-1)", fontSize: 12.5, lineHeight: 1.6 }}>
          <li><strong>Essential €1,450</strong> — 2-year unit cover + 1-year workmanship</li>
          <li><strong>Complete €1,895</strong> — 10-year parts + 2-year workmanship</li>
          <li><strong>Premium €2,395</strong> — 10-year parts + 3-year workmanship</li>
        </ul>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
        <button type="button" onClick={() => window.print()} className="portal-btn portal-btn-secondary" style={{ fontSize: 13 }}>
          Print / save PDF
        </button>
        <a href="/customer-pack.pdf" target="_blank" rel="noreferrer" className="portal-btn portal-btn-secondary" style={{ fontSize: 13 }}>
          Full T&Cs
        </a>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--grey-2)" }}>{label}</div>
      <div style={{ fontSize: 13, color: "var(--portal-navy-dark)", fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function ClaimForm({ hasWarranty }: { hasWarranty: boolean }) {
  const raise = useServerFn(raiseWarrantyClaim);
  const qc = useQueryClient();
  const [issueType, setIssueType] = useState("Leak");
  const [urgency, setUrgency] = useState("Normal");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      const full = `${issueType} (${urgency}): ${description}`.trim();
      return raise({ data: { description: full } });
    },
    onSuccess: () => {
      setMsg({ kind: "ok", text: "Claim submitted. We'll be in touch within one working day." });
      setDescription("");
      qc.invalidateQueries({ queryKey: ["portal", "warranty"] });
      qc.invalidateQueries({ queryKey: ["portal", "dashboard"] });
    },
    onError: (e: any) => setMsg({ kind: "err", text: e?.message ?? "Couldn't submit claim." }),
  });

  if (!hasWarranty) {
    return (
      <div className="portal-card">
        <h2 style={{ fontSize: 18, margin: 0, color: "var(--portal-navy-dark)" }}>Raise a claim</h2>
        <p style={{ color: "var(--grey-2)", fontSize: 14, marginTop: 8, marginBottom: 0 }}>
          Your warranty becomes active once your installation is complete. For anything urgent before
          then, call us on <a href="tel:017267941" style={{ color: "var(--portal-navy)", fontWeight: 600 }}>(1) 726 7941</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="portal-card" onSubmit={(e) => { e.preventDefault(); setMsg(null); submit.mutate(); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ fontSize: 18, margin: 0, color: "var(--portal-navy-dark)" }}>Raise a warranty claim</h2>

      <Row>
        <Field label="Issue type">
          <select className="portal-input" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
            <option>Leak</option>
            <option>Unit not regenerating</option>
            <option>Hard water returning</option>
            <option>Salt cabinet issue</option>
            <option>Drinking water tap (Premium)</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Urgency">
          <select className="portal-input" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option>Normal</option>
            <option>Active leak — urgent</option>
            <option>Low</option>
          </select>
        </Field>
      </Row>

      <Field label="Describe what's happening">
        <textarea className="portal-input" rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="When did it start? Any sounds, leaks, or changes in your water?" />
      </Field>

      {msg && <Banner kind={msg.kind}>{msg.text}</Banner>}

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" className="portal-btn portal-btn-primary" disabled={submit.isPending}>
          {submit.isPending ? "Submitting…" : "Submit claim"}
        </button>
        <a className="portal-btn portal-btn-secondary" href="tel:017267941">Or call (1) 726 7941</a>
      </div>
    </form>
  );
}

function RecentClaims({ claims }: { claims: any[] }) {
  return (
    <section className="portal-card">
      <h2 style={{ fontSize: 16, margin: 0, marginBottom: 14, color: "var(--portal-navy-dark)" }}>Your recent claims</h2>
      {!claims.length ? (
        <p style={{ color: "var(--grey-2)", fontSize: 14, margin: 0 }}>No claims raised yet.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {claims.map((c) => (
            <li key={c.claim_id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 12px", background: "var(--portal-surface)", borderRadius: 10, fontSize: 13 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: "var(--portal-navy-dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.description}</div>
                <div style={{ color: "var(--grey-2)", fontSize: 12, marginTop: 2 }}>{fmt(c.created_at)}</div>
              </div>
              <span style={{ alignSelf: "center", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(41,171,226,0.14)", border: "1px solid rgba(41,171,226,0.35)", color: "var(--portal-sky)", flexShrink: 0 }}>
                {c.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="portal-label">{label}</label>{children}</div>;
}
function Banner({ kind, children }: { kind: "ok" | "err"; children: React.ReactNode }) {
  const ok = kind === "ok";
  return (
    <div style={{ padding: "10px 12px", borderRadius: 10, fontSize: 13, background: ok ? "rgba(76,175,52,0.12)" : "rgba(229,72,77,0.10)", border: `1px solid ${ok ? "rgba(76,175,52,0.40)" : "rgba(229,72,77,0.35)"}`, color: ok ? "var(--portal-green)" : "var(--red)" }}>{children}</div>
  );
}
