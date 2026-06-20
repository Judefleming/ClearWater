import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getInstallerJobs } from "@/lib/installer.functions";

export const Route = createFileRoute("/installer/")({
  component: InstallerJobs,
});

const PKG: Record<string, string> = { essential: "Essential", complete: "Complete", premium: "Premium" };

function statusStyle(s: string) {
  if (s === "complete") return { bg: "rgba(46,158,91,0.14)", bd: "rgba(46,158,91,0.4)", fg: "var(--inst-green)" };
  if (s === "in_progress") return { bg: "rgba(224,164,88,0.16)", bd: "rgba(224,164,88,0.45)", fg: "#9a6a1f" };
  return { bg: "rgba(22,166,182,0.12)", bd: "rgba(22,166,182,0.35)", fg: "var(--inst-teal)" };
}
function fmt(d?: string | null) {
  if (!d) return "Not scheduled";
  return new Date(d).toLocaleDateString("en-IE", { weekday: "short", day: "2-digit", month: "short" });
}

function InstallerJobs() {
  const fetchJobs = useServerFn(getInstallerJobs);
  const { data, isLoading, error } = useQuery({
    queryKey: ["installer", "jobs"],
    queryFn: () => fetchJobs(),
    retry: false,
  });

  if (isLoading) return <div style={{ color: "var(--inst-muted)" }}>Loading your jobs…</div>;
  if (error) return <div style={{ color: "var(--inst-red)" }}>Couldn't load jobs: {(error as Error).message}</div>;

  if (!data?.installer) {
    return (
      <div className="inst-card">
        <h1 className="inst-display" style={{ fontSize: 20, margin: 0 }}>No installer access</h1>
        <p style={{ color: "var(--inst-muted)", marginTop: 8, marginBottom: 0 }}>
          This account isn't set up as an installer. If that's a mistake, contact the office on (1) 726 7941.
        </p>
      </div>
    );
  }

  const jobs = data.jobs ?? [];
  const open = jobs.filter((j: any) => j.status !== "complete");
  const done = jobs.filter((j: any) => j.status === "complete");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <header>
        <div className="section-label" style={{ marginBottom: 6 }}>Your jobs</div>
        <h1 className="inst-display" style={{ fontSize: 28, margin: 0 }}>Hi {data.installer.name?.split(" ")[0] || "there"}</h1>
        <p style={{ color: "var(--inst-muted)", marginTop: 6 }}>
          {open.length ? `${open.length} job${open.length === 1 ? "" : "s"} to do.` : "No open jobs right now."}
        </p>
      </header>

      {open.length > 0 && (
        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {open.map((j: any) => <JobCard key={j.installation_id} j={j} />)}
        </section>
      )}

      {done.length > 0 && (
        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="section-label" style={{ color: "var(--inst-muted)" }}>Completed</div>
          {done.map((j: any) => <JobCard key={j.installation_id} j={j} />)}
        </section>
      )}

      {jobs.length === 0 && (
        <div className="inst-card">
          <p style={{ color: "var(--inst-muted)", margin: 0 }}>No jobs assigned to you yet. New jobs will appear here.</p>
        </div>
      )}
    </div>
  );
}

function JobCard({ j }: { j: any }) {
  const job = j.jobs ?? {};
  const cust = job.customers ?? {};
  const ss = statusStyle(j.status);
  const addr = [cust.address_line1, cust.town, cust.eircode].filter(Boolean).join(", ");

  return (
    <Link
      to="/installer/job/$installationId"
      params={{ installationId: j.installation_id }}
      className="inst-card"
      style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", textDecoration: "none", color: "inherit" }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 800, color: "var(--inst-navy-dark)", fontSize: 16 }}>{cust.name ?? "Customer"}</span>
          <span style={{ fontSize: 12, color: "var(--inst-muted)" }}>{job.job_ref}</span>
        </div>
        <div style={{ color: "var(--inst-muted)", fontSize: 13, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{addr || "Address on file"}</div>
        <div style={{ color: "var(--inst-muted)", fontSize: 13, marginTop: 3 }}>
          {PKG[job.package] ?? "Package"} · {fmt(j.scheduled_date)}
        </div>
      </div>
      <span style={{ flexShrink: 0, padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: ss.bg, border: `1px solid ${ss.bd}`, color: ss.fg }}>
        {(j.status as string).replace("_", " ")}
      </span>
    </Link>
  );
}
