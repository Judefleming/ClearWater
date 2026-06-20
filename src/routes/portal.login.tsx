import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/clearwater-logo.png";

export const Route = createFileRoute("/portal/login")({
  component: PortalLogin,
});

function PortalLogin() {
  const router = useRouter();

  useEffect(() => {
    // If already signed in, go straight in.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.navigate({ to: "/portal" });
    });
  }, [router]);

  return (
    <CenteredCard>
      <Header />
      <h1 className="portal-display" style={{ fontSize: 28, color: "var(--portal-navy-dark)", margin: "8px 0 6px" }}>
        Customer Portal
      </h1>
      <p style={{ color: "var(--grey-2)", fontSize: 14, marginBottom: 20 }}>
        Sign in to track your installation, warranty, salt deliveries and documents.
      </p>
      <SignInForm />
    </CenteredCard>
  );
}

function Header() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <Link to="/">
        <img src={logo} alt="ClearWaterIreland" width={170} style={{ display: "block", height: "auto" }} />
      </Link>
      <Link
        to="/"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10,
          background: "#fff", border: "1.5px solid var(--portal-border)", color: "var(--portal-navy)",
          fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: "0 2px 8px rgba(19,58,102,0.06)",
        }}
      >
        ← Back to website
      </Link>
    </div>
  );
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "40px 18px" }}>
      <div className="portal-card" style={{ maxWidth: 460, width: "100%" }}>{children}</div>
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(199,48,48,0.08)", border: "1px solid rgba(199,48,48,0.25)", color: "var(--red)", padding: "10px 12px", borderRadius: 10, fontSize: 13 }}>
      {children}
    </div>
  );
}

function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
          setError(error.message);
          return;
        }
        router.navigate({ to: "/portal" });
      }}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div>
        <label className="portal-label">Email</label>
        <input className="portal-input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="portal-label">Password</label>
        <input className="portal-input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      <button className="portal-btn portal-btn-primary" disabled={loading} type="submit">
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p style={{ fontSize: 12, color: "var(--grey-2)", margin: 0, lineHeight: 1.6 }}>
        Don't have portal access yet? We set up your account after your installation is booked — call
        us on <strong>(1) 726 7941</strong> and we'll get you sorted.
      </p>
    </form>
  );
}
