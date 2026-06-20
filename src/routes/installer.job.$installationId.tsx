import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getInstallationDetail, saveChecklist, completeInstallation } from "@/lib/installer.functions";

export const Route = createFileRoute("/installer/job/$installationId")({
  component: InstallerJob,
});

const BASE_CHECKS: { key: string; label: string }[] = [
  { key: "checklist_mains", label: "Mains connected" },
  { key: "checklist_bypass", label: "Bypass valve fitted" },
  { key: "checklist_drain", label: "Drain connected" },
  { key: "checklist_powered", label: "Powered on" },
  { key: "checklist_salt", label: "Salt added" },
  { key: "checklist_regen", label: "Regeneration tested" },
  { key: "checklist_leaks", label: "No leaks" },
  { key: "checklist_hardness_test", label: "Hardness tested" },
];
const PREMIUM_CHECKS: { key: string; label: string }[] = [
  { key: "checklist_filter_tap", label: "Filter tap fitted" },
  { key: "checklist_filter_line", label: "Filter line connected" },
];

function InstallerJob() {
  const { installationId } = Route.useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const fetchDetail = useServerFn(getInstallationDetail);
  const save = useServerFn(saveChecklist);
  const complete = useServerFn(completeInstallation);

  const { data, isLoading, error } = useQuery({
    queryKey: ["installer", "job", installationId],
    queryFn: () => fetchDetail({ data: { installationId } }),
    retry: false,
  });

  const inst = data?.installation;
  const job = inst?.jobs ?? {};
  const cust = job.customers ?? {};
  const isPremium = job.package === "premium";

  const [f, setF] = useState<Record<string, any>>({});
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // init local form once detail loads
  useEffect(() => {
    if (!inst) return;
    setF({
      checklist_mains: !!inst.checklist_mains,
      checklist_bypass: !!inst.checklist_bypass,
      checklist_drain: !!inst.checklist_drain,
      checklist_powered: !!inst.checklist_powered,
      checklist_salt: !!inst.checklist_salt,
      checklist_regen: !!inst.checklist_regen,
      checklist_leaks: !!inst.checklist_leaks,
      checklist_hardness_test: !!inst.checklist_hardness_test,
      checklist_filter_tap: inst.checklist_filter_tap ?? false,
      checklist_filter_line: inst.checklist_filter_line ?? false,
      hardness_before: inst.hardness_before ?? "",
      hardness_after: inst.hardness_after ?? "",
      serial_number: inst.serial_number ?? "",
      installation_notes: inst.installation_notes ?? "",
      customer_signature_url: inst.customer_signature_url ?? null,
    });
  }, [inst]);

  const saveMut = useMutation({
    mutationFn: async (fields: Record<string, any>) =>
      save({ data: { installationId, fields: normalize(fields, isPremium) } }),
    onSuccess: () => {
      setMsg({ kind: "ok", text: "Progress saved." });
      qc.invalidateQueries({ queryKey: ["installer", "job", installationId] });
    },
    onError: (e: any) => setMsg({ kind: "err", text: e?.message ?? "Couldn't save." }),
  });

  const completeMut = useMutation({
    mutationFn: async () => {
      // save latest first, then complete
      await save({ data: { installationId, fields: normalize(f, isPremium) } });
      return complete({ data: { installationId } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["installer", "jobs"] });
      router.navigate({ to: "/installer" });
    },
    onError: (e: any) => setMsg({ kind: "err", text: e?.message ?? "Couldn't complete installation." }),
  });

  if (isLoading) return <div style={{ color: "var(--inst-muted)" }}>Loading job…</div>;
  if (error) return <div style={{ color: "var(--inst-red)" }}>Couldn't load job: {(error as Error).message}</div>;
  if (!inst) return <div style={{ color: "var(--inst-red)" }}>Job not found.</div>;

  const isComplete = inst.status === "complete";
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));
  const checks = isPremium ? [...BASE_CHECKS, ...PREMIUM_CHECKS] : BASE_CHECKS;
  const addr = [cust.address_line1, cust.address_line2, cust.town, cust.county, cust.eircode].filter(Boolean).join(", ");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Link to="/installer" className="inst-link" style={{ fontSize: 14 }}>← All jobs</Link>

      {/* customer card */}
      <div className="inst-card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div className="section-label" style={{ marginBottom: 6 }}>{job.job_ref} · {label(job.package)}</div>
            <h1 className="inst-display" style={{ fontSize: 22, margin: 0 }}>{cust.name ?? "Customer"}</h1>
            <div style={{ color: "var(--inst-muted)", fontSize: 14, marginTop: 4 }}>{addr || "Address on file"}</div>
          </div>
          {cust.phone && <a className="inst-btn inst-btn-secondary" href={`tel:${cust.phone}`}>Call</a>}
        </div>
        {cust.access_notes && (
          <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--inst-surface)", borderRadius: 10, fontSize: 13, color: "var(--inst-text)" }}>
            <strong>Access:</strong> {cust.access_notes}
          </div>
        )}
      </div>

      {isComplete ? (
        <div className="inst-card" style={{ borderTop: "4px solid var(--inst-green)" }}>
          <h2 className="inst-display" style={{ fontSize: 18, margin: 0, color: "var(--inst-green)" }}>Installation complete ✓</h2>
          <p style={{ color: "var(--inst-muted)", marginTop: 8, marginBottom: 0, fontSize: 14 }}>
            This job is done and the warranty has been created. Nothing more to do here.
          </p>
        </div>
      ) : (
        <>
          {/* checklist */}
          <div className="inst-card">
            <h2 className="inst-display" style={{ fontSize: 17, margin: "0 0 14px" }}>Installation checklist</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {checks.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => set(c.key, !f[c.key])}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 11,
                    border: `1.5px solid ${f[c.key] ? "var(--inst-green)" : "var(--inst-border)"}`,
                    background: f[c.key] ? "rgba(46,158,91,0.08)" : "#fff", cursor: "pointer",
                    font: "inherit", textAlign: "left", color: "var(--inst-text)",
                  }}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: 7, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: f[c.key] ? "var(--inst-green)" : "transparent", border: `2px solid ${f[c.key] ? "var(--inst-green)" : "var(--inst-border)"}`,
                    color: "#fff", fontWeight: 900, fontSize: 14,
                  }}>{f[c.key] ? "✓" : ""}</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* measurements */}
          <div className="inst-card">
            <h2 className="inst-display" style={{ fontSize: 17, margin: "0 0 14px" }}>Measurements & unit</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              <div>
                <label className="inst-label">Hardness before (ppm)</label>
                <input className="inst-input" inputMode="numeric" value={f.hardness_before ?? ""} onChange={(e) => set("hardness_before", e.target.value)} />
              </div>
              <div>
                <label className="inst-label">Hardness after (ppm)</label>
                <input className="inst-input" inputMode="numeric" value={f.hardness_after ?? ""} onChange={(e) => set("hardness_after", e.target.value)} />
              </div>
              <div>
                <label className="inst-label">Unit serial number</label>
                <input className="inst-input" value={f.serial_number ?? ""} onChange={(e) => set("serial_number", e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label className="inst-label">Notes (optional)</label>
              <textarea className="inst-input" rows={3} value={f.installation_notes ?? ""} onChange={(e) => set("installation_notes", e.target.value)} placeholder="Anything worth recording about the install." />
            </div>
          </div>

          {/* photos */}
          <PhotoSection jobId={inst.job_id} installationId={installationId} onMsg={setMsg} />

          {/* signature */}
          <SignatureSection
            installationId={installationId}
            jobId={inst.job_id}
            existing={f.customer_signature_url}
            onSaved={(path) => { set("customer_signature_url", path); setMsg({ kind: "ok", text: "Signature saved." }); }}
            onMsg={setMsg}
          />

          {msg && <Banner kind={msg.kind}>{msg.text}</Banner>}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", position: "sticky", bottom: 0, padding: "12px 0", background: "linear-gradient(0deg, var(--inst-surface) 70%, transparent)" }}>
            <button className="inst-btn inst-btn-secondary" disabled={saveMut.isPending} onClick={() => { setMsg(null); saveMut.mutate(f); }}>
              {saveMut.isPending ? "Saving…" : "Save progress"}
            </button>
            <button className="inst-btn inst-btn-go" disabled={completeMut.isPending} onClick={() => { setMsg(null); completeMut.mutate(); }} style={{ flex: 1, minWidth: 180 }}>
              {completeMut.isPending ? "Completing…" : "Complete installation"}
            </button>
          </div>
          <p style={{ color: "var(--inst-muted)", fontSize: 12, margin: 0 }}>
            Completion requires every checklist item ticked, hardness before/after, the serial number, and the customer signature. The system checks this before finishing.
          </p>
        </>
      )}
    </div>
  );
}

function normalize(f: Record<string, any>, isPremium: boolean) {
  const num = (v: any) => (v === "" || v == null ? null : Number(v));
  const out: Record<string, any> = {
    checklist_mains: !!f.checklist_mains,
    checklist_bypass: !!f.checklist_bypass,
    checklist_drain: !!f.checklist_drain,
    checklist_powered: !!f.checklist_powered,
    checklist_salt: !!f.checklist_salt,
    checklist_regen: !!f.checklist_regen,
    checklist_leaks: !!f.checklist_leaks,
    checklist_hardness_test: !!f.checklist_hardness_test,
    checklist_filter_tap: isPremium ? !!f.checklist_filter_tap : null,
    checklist_filter_line: isPremium ? !!f.checklist_filter_line : null,
    hardness_before: num(f.hardness_before),
    hardness_after: num(f.hardness_after),
    serial_number: f.serial_number ? String(f.serial_number) : null,
    installation_notes: f.installation_notes ? String(f.installation_notes) : null,
  };
  if (f.customer_signature_url) out.customer_signature_url = f.customer_signature_url;
  return out;
}

function PhotoSection({ jobId, installationId, onMsg }: { jobId: string; installationId: string; onMsg: (m: any) => void }) {
  const [busy, setBusy] = useState<string | null>(null);

  async function upload(file: File, type: "before" | "after") {
    setBusy(type);
    try {
      const path = `${jobId}/${type}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
      const { error: upErr } = await supabase.storage.from("job-photos").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { error: insErr } = await supabase.from("photos").insert({
        job_id: jobId, installation_id: installationId, type, url: path,
      });
      if (insErr) throw insErr;
      onMsg({ kind: "ok", text: `${type === "before" ? "Before" : "After"} photo uploaded.` });
    } catch (e: any) {
      onMsg({ kind: "err", text: e?.message ?? "Photo upload failed." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="inst-card">
      <h2 className="inst-display" style={{ fontSize: 17, margin: "0 0 14px" }}>Photos</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        {(["before", "after"] as const).map((type) => (
          <label key={type} className="inst-btn inst-btn-secondary" style={{ cursor: "pointer", justifyContent: "center" }}>
            {busy === type ? "Uploading…" : `Add ${type} photo`}
            <input
              type="file" accept="image/*" capture="environment" style={{ display: "none" }}
              onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(file, type); e.currentTarget.value = ""; }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function SignatureSection({
  installationId, jobId, existing, onSaved, onMsg,
}: { installationId: string; jobId: string; existing: string | null; onSaved: (p: string) => void; onMsg: (m: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [busy, setBusy] = useState(false);
  const [hasInk, setHasInk] = useState(false);

  function pos(e: React.PointerEvent) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  }
  function start(e: React.PointerEvent) {
    drawing.current = true; setHasInk(true);
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y);
  }
  function move(e: React.PointerEvent) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#11233A";
    const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke();
  }
  function end() { drawing.current = false; }
  function clear() {
    const c = canvasRef.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); setHasInk(false);
  }

  async function saveSig() {
    const c = canvasRef.current!;
    setBusy(true);
    try {
      const blob: Blob = await new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Couldn't read signature"))), "image/png"));
      const path = `${jobId}/signature-${Date.now()}.png`;
      const { error } = await supabase.storage.from("signatures").upload(path, blob, { upsert: true, contentType: "image/png" });
      if (error) throw error;
      onSaved(path);
    } catch (e: any) {
      onMsg({ kind: "err", text: e?.message ?? "Couldn't save signature." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inst-card">
      <h2 className="inst-display" style={{ fontSize: 17, margin: "0 0 6px" }}>Customer signature</h2>
      {existing && <p style={{ color: "var(--inst-green)", fontSize: 13, margin: "0 0 10px", fontWeight: 600 }}>✓ Signature on file</p>}
      <p style={{ color: "var(--inst-muted)", fontSize: 13, margin: "0 0 10px" }}>Ask the customer to sign below to confirm the work is complete.</p>
      <canvas
        ref={canvasRef}
        width={600}
        height={180}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        style={{ width: "100%", height: 180, border: "1.5px dashed var(--inst-border)", borderRadius: 11, touchAction: "none", background: "#fff" }}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button type="button" className="inst-btn inst-btn-secondary" onClick={clear}>Clear</button>
        <button type="button" className="inst-btn inst-btn-primary" disabled={busy || !hasInk} onClick={saveSig}>
          {busy ? "Saving…" : "Save signature"}
        </button>
      </div>
    </div>
  );
}

function Banner({ kind, children }: { kind: "ok" | "err"; children: React.ReactNode }) {
  const ok = kind === "ok";
  return (
    <div style={{ padding: "11px 14px", borderRadius: 11, fontSize: 14, fontWeight: 600, background: ok ? "rgba(46,158,91,0.12)" : "rgba(199,48,48,0.10)", border: `1px solid ${ok ? "rgba(46,158,91,0.4)" : "rgba(199,48,48,0.35)"}`, color: ok ? "var(--inst-green)" : "var(--inst-red)" }}>{children}</div>
  );
}

function label(pkg?: string) {
  return ({ essential: "Essential", complete: "Complete", premium: "Premium" } as Record<string, string>)[pkg ?? ""] ?? "Package";
}
