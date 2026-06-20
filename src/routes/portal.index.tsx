import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/portal.functions";

export const Route = createFileRoute("/portal/")({
  component: Dashboard,
});

const PACKAGE_LABEL: Record<string, string> = {
  essential: "Essential",
  complete: "Complete",
  premium: "Premium",
};
const WARRANTY_TEXT: Record<string, string> = {
  essential: "2-year unit + 1-year workmanship",
  complete: "10-year parts + 2-year workmanship",
  premium: "10-year parts + 3-year workmanship",
};
const STATUS_STEPS = ["lead", "quoted", "deposit_paid", "scheduled", "installed", "completed"];
const STATUS_MESSAGE: Record<string, string> = {
  lead: "We're preparing your quote — we'll be in touch shortly.",
  quoted: "Your quote is ready. Pay your deposit to lock in your installation date.",
  deposit_paid: "Deposit received — we're scheduling your installation now.",
  scheduled: "You're booked in. We'll confirm the day before.",
  installed: "Installation complete. Your balance is due — we'll be in touch.",
  completed: "All done. Your warranty is active. Thank you for choosing ClearWater.",
};

function fmtDate(d?: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IE", { day: "2-digit", month: "long", year: "numeric" });
}

function Dashboard() {
  const fetchDashboard = useServerFn(getDashboard);
  const { data, isLoading, error } = useQuery({
    queryKey: ["portal", "dashboard"],
    queryFn: () => fetchDashboard(),
    retry: false,
  });

  if (isLoading) return <div style={{ color: "var(--grey-2)" }}>Loading your dashboard…</div>;
  if (error) return <div style={{ color: "var(--red)" }}>Couldn't load dashboard: {(error as Error).message}</div>;

  const customer = data?.customer;
  const job = data?.job;
  const installation = data?.installation;
  const warranty = data?.warranty;

  const firstName = customer?.name?.split(" ")[0] || "there";

  // Account exists but no job yet
  if (customer && !job) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <header>
          <div className="section-label" style={{ marginBottom: 8 }}>Dashboard</div>
          <h1 className="portal-display" style={{ fontSize: 38, color: "var(--portal-navy-dark)", margin: 0 }}>
            Welcome, {firstName}
          </h1>
        </header>
        <div className="portal-card">
          <p style={{ margin: 0, color: "var(--grey-2)" }}>
            Your account is set up and we're preparing your job details. They'll appear here shortly.
            Any questions, call us on <strong>(1) 726 7941</strong>.
          </p>
        </div>
      </div>
    );
  }

  const pkg = (job?.package ?? "") as string;
  const pkgLabel = PACKAGE_LABEL[pkg] ?? "Your";
  const warrantyText = WARRANTY_TEXT[pkg] ?? "Cover begins once your unit is installed";
  const saltEligible = pkg === "complete" || pkg === "premium";
  const stepIndex = job ? STATUS_STEPS.indexOf(job.status as string) : -1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <header>
        <div className="section-label" style={{ marginBottom: 8 }}>Dashboard</div>
        <h1 className="portal-display" style={{ fontSize: 38, color: "var(--portal-navy-dark)", margin: 0 }}>
          Welcome back, {firstName}
        </h1>
        <p style={{ color: "var(--grey-2)", marginTop: 8 }}>
          {STATUS_MESSAGE[job?.status as string] ?? "Here's the latest on your installation."}
        </p>
      </header>

      {/* status progress */}
      <div className="portal-card">
        <div className="section-label" style={{ color: "var(--grey-2)", marginBottom: 14 }}>Your progress</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {STATUS_STEPS.map((s, i) => {
            const done = stepIndex >= 0 && i <= stepIndex;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 999,
                  background: done ? "var(--portal-sky)" : "var(--portal-surface)",
                  color: done ? "#fff" : "var(--grey-2)",
                  border: done ? "none" : "1px solid var(--portal-border)",
                }}>
                  {s.replace("_", " ")}
                </span>
                {i < STATUS_STEPS.length - 1 && <span style={{ color: "var(--portal-border)" }}>›</span>}
              </div>
            );
          })}
        </div>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <div className="portal-card">
          <div className="section-label" style={{ color: "var(--grey-2)", marginBottom: 10 }}>Your system</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--portal-navy-dark)" }}>{pkgLabel} package</div>
          <div style={{ marginTop: 8, color: "var(--grey-2)", fontSize: 13 }}>Ref {job?.job_ref}</div>
          {installation?.serial_number && (
            <div style={{ marginTop: 4, color: "var(--grey-2)", fontSize: 13 }}>Serial {installation.serial_number}</div>
          )}
          {installation?.scheduled_date && (
            <div style={{ marginTop: 4, color: "var(--grey-2)", fontSize: 13 }}>
              Install {fmtDate(installation.scheduled_date)}
            </div>
          )}
        </div>

        <div className="portal-card">
          <div className="section-label" style={{ color: "var(--grey-2)", marginBottom: 10 }}>Warranty</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: warranty ? "var(--portal-green)" : "var(--grey-2)" }}>
            {warranty ? "Active" : "Pending install"}
          </div>
          <div style={{ marginTop: 8, color: "var(--grey-2)", fontSize: 14 }}>{warrantyText}</div>
          {warranty && (
            <Link to="/portal/warranty" className="portal-link" style={{ display: "inline-block", marginTop: 10, fontSize: 13 }}>
              View & raise a claim →
            </Link>
          )}
        </div>

        <div className="portal-card">
          <div className="section-label" style={{ color: "var(--grey-2)", marginBottom: 10 }}>Salt delivery</div>
          {saltEligible ? (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--portal-navy-dark)" }}>Included</div>
              <Link to="/portal/salt" className="portal-link" style={{ display: "inline-block", marginTop: 10, fontSize: 13 }}>
                Request a top-up →
              </Link>
            </>
          ) : (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--grey-2)" }}>Complete & Premium only</div>
              <div style={{ marginTop: 8, color: "var(--grey-2)", fontSize: 13 }}>
                Salt delivery is part of the Complete and Premium packages.
              </div>
            </>
          )}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div className="portal-card">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--portal-navy-dark)", margin: 0, marginBottom: 12 }}>Recent warranty claims</h2>
          {data?.recentClaims?.length ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {data.recentClaims.map((c: any) => (
                <li key={c.claim_id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, color: "var(--grey-1)" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.description}</span>
                  <span style={{ color: "var(--grey-2)", flexShrink: 0 }}>{c.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "var(--grey-2)", fontSize: 14, margin: 0 }}>No claims raised — that's a good sign.</p>
          )}
        </div>

        <div className="portal-card">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--portal-navy-dark)", margin: 0, marginBottom: 12 }}>Recent salt requests</h2>
          {data?.recentSalt?.length ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {data.recentSalt.map((s: any) => (
                <li key={s.order_id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--grey-1)" }}>
                  <span>{s.bags_quantity} {s.bags_quantity === 1 ? "bag" : "bags"}</span>
                  <span style={{ color: "var(--grey-2)" }}>{s.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "var(--grey-2)", fontSize: 14, margin: 0 }}>No salt requests yet.</p>
          )}
        </div>
      </section>

      <section className="portal-card" style={{ background: "var(--portal-navy)", color: "#fff", borderColor: "transparent" }}>
        <div className="section-label" style={{ color: "var(--portal-sky)", marginBottom: 8 }}>Need a hand?</div>
        <h3 className="portal-display" style={{ fontSize: 24, margin: 0, marginBottom: 6, color: "#fff" }}>Call us on (1) 726 7941</h3>
        <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, fontSize: 14 }}>
          Or ask our assistant about salt, regeneration, and getting the most from your softener.
        </p>
        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="portal-btn portal-btn-cta" href="tel:017267941">Call support</a>
          <Link className="portal-btn portal-btn-primary" to="/portal/chat">Ask the assistant →</Link>
        </div>
      </section>
    </div>
  );
}
