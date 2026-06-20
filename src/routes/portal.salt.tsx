import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSaltOrders, createSaltOrder } from "@/lib/portal.functions";

export const Route = createFileRoute("/portal/salt")({
  component: PortalSalt,
});

const PRICE_PER_BAG_EUR = 18; // placeholder — confirmed per delivery

function fmt(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IE", { year: "numeric", month: "short", day: "numeric" });
}
function euro(cents?: number | null) {
  if (cents == null) return "—";
  return "€" + (cents / 100).toFixed(2);
}

function PortalSalt() {
  const fetchOrders = useServerFn(getSaltOrders);
  const { data, isLoading, error } = useQuery({
    queryKey: ["portal", "salt"],
    queryFn: () => fetchOrders(),
    retry: false,
  });

  if (isLoading) return <div style={{ color: "var(--grey-2)" }}>Loading…</div>;
  if (error) return <div style={{ color: "var(--red)" }}>Couldn't load salt deliveries: {(error as Error).message}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <header>
        <div className="section-label" style={{ marginBottom: 8 }}>Salt supply</div>
        <h1 className="portal-display" style={{ fontSize: 32, color: "var(--portal-navy-dark)", margin: 0 }}>
          Request a salt top-up
        </h1>
        <p style={{ color: "var(--grey-2)", marginTop: 8, maxWidth: 640 }}>
          We bring salt to your door. A typical household uses a bag every few weeks.
        </p>
      </header>

      {data?.eligible ? (
        <OrderForm />
      ) : (
        <div className="portal-card" style={{ borderTop: "4px solid var(--portal-amber)" }}>
          <h2 style={{ fontSize: 18, margin: 0, color: "var(--portal-navy-dark)" }}>Salt delivery is a Complete & Premium feature</h2>
          <p style={{ color: "var(--grey-2)", fontSize: 14, marginTop: 8 }}>
            Managed salt delivery is included with the <strong>Complete (€1,895)</strong> and{" "}
            <strong>Premium (€2,395)</strong> packages. If you'd like to add it, we're happy to help.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="portal-btn portal-btn-secondary" href="tel:017267941">Call (1) 726 7941</a>
            <Link className="portal-btn portal-btn-secondary" to="/portal">Back to dashboard</Link>
          </div>
        </div>
      )}

      <OrderHistory orders={data?.orders ?? []} />
    </div>
  );
}

function OrderForm() {
  const create = useServerFn(createSaltOrder);
  const qc = useQueryClient();
  const [bags, setBags] = useState(1);
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const submit = useMutation({
    mutationFn: async () => create({ data: { bags, notes } }),
    onSuccess: () => {
      setMsg({ kind: "ok", text: "Salt request received. We'll text you to confirm the delivery slot and price." });
      setNotes("");
      setBags(1);
      qc.invalidateQueries({ queryKey: ["portal", "salt"] });
      qc.invalidateQueries({ queryKey: ["portal", "dashboard"] });
    },
    onError: (e: any) => setMsg({ kind: "err", text: e?.message ?? "Couldn't submit request." }),
  });

  return (
    <form className="portal-card" onSubmit={(e) => { e.preventDefault(); setMsg(null); submit.mutate(); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ fontSize: 18, margin: 0, color: "var(--portal-navy-dark)" }}>New request</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <div>
          <label className="portal-label">Number of bags</label>
          <select className="portal-input" value={bags} onChange={(e) => setBags(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "bag" : "bags"}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="portal-label">Estimated total</label>
          <div className="portal-input" style={{ display: "flex", alignItems: "center", color: "var(--portal-navy-dark)", fontWeight: 700 }}>
            €{(bags * PRICE_PER_BAG_EUR).toFixed(2)}
          </div>
          <p style={{ fontSize: 11, color: "var(--grey-2)", marginTop: 6 }}>Indicative — we confirm the price per delivery.</p>
        </div>
      </div>

      <div>
        <label className="portal-label">Delivery notes (optional)</label>
        <textarea className="portal-input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferred day, where to leave it, access notes, salt type if you have a preference…" />
      </div>

      {msg && <Banner kind={msg.kind}>{msg.text}</Banner>}

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" className="portal-btn portal-btn-cta" disabled={submit.isPending}>
          {submit.isPending ? "Submitting…" : "Request top-up"}
        </button>
        <a className="portal-btn portal-btn-secondary" href="tel:017267941">Or call (1) 726 7941</a>
      </div>
    </form>
  );
}

function OrderHistory({ orders }: { orders: any[] }) {
  return (
    <section className="portal-card">
      <h2 style={{ fontSize: 16, margin: 0, marginBottom: 14, color: "var(--portal-navy-dark)" }}>Recent salt requests</h2>
      {!orders.length ? (
        <p style={{ color: "var(--grey-2)", fontSize: 14, margin: 0 }}>No salt requests yet.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((s) => (
            <li key={s.order_id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 12px", background: "var(--portal-surface)", borderRadius: 10, fontSize: 13 }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--portal-navy-dark)" }}>
                  {s.bags_quantity} {s.bags_quantity === 1 ? "bag" : "bags"} · {euro(s.total_price)}
                </div>
                <div style={{ color: "var(--grey-2)", fontSize: 12, marginTop: 2 }}>
                  Requested {fmt(s.created_at)}{s.delivery_date ? ` · delivery ${fmt(s.delivery_date)}` : ""}
                </div>
              </div>
              <span style={{ alignSelf: "center", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(41,171,226,0.14)", border: "1px solid rgba(41,171,226,0.35)", color: "var(--portal-sky)" }}>
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Banner({ kind, children }: { kind: "ok" | "err"; children: React.ReactNode }) {
  const ok = kind === "ok";
  return (
    <div style={{ padding: "10px 12px", borderRadius: 10, fontSize: 13, background: ok ? "rgba(76,175,52,0.12)" : "rgba(229,72,77,0.10)", border: `1px solid ${ok ? "rgba(76,175,52,0.40)" : "rgba(229,72,77,0.35)"}`, color: ok ? "var(--portal-green)" : "var(--red)" }}>{children}</div>
  );
}
