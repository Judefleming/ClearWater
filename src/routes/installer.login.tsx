import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/clearwater-logo.png";

export const Route = createFileRoute("/installer/login")({
  component: InstallerLogin,
});

function InstallerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.navigate({ to: "/installer" });
    });
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "40px 18px" }}>
      <div className="inst-card" style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <Link to="/"><img src={logo} alt="ClearWaterIreland" width={160} style={{ display: "block", height: "auto" }} /></Link>
          <div className="section-label">Installer access</div>
        </div>
        <h1 className="inst-display" style={{ fontSize: 24, margin: "0 0 6px" }}>Sign in</h1>
        <p style={{ color: "var(--inst-muted)", fontSize: 14, margin: "0 0 18px" }}>
          Sign in to see your assigned jobs and complete installations on site.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            setLoading(false);
            if (error) { setError(error.message); return; }
            router.navigate({ to: "/installer" });
          }}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div>
            <label className="inst-label">Email</label>
            <input className="inst-input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="inst-label">Password</label>
            <input className="inst-input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && (
            <div style={{ background: "rgba(199,48,48,0.08)", border: "1px solid rgba(199,48,48,0.25)", color: "var(--inst-red)", padding: "10px 12px", borderRadius: 10, fontSize: 13 }}>
              {error}
            </div>
          )}
          <button className="inst-btn inst-btn-primary" disabled={loading} type="submit">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
