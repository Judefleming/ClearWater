import { createFileRoute, Outlet, Link, useRouter, useLocation, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/clearwater-logo.png";

export const Route = createFileRoute("/installer")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/installer/login") return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/installer/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Installer — ClearWaterIreland" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: InstallerLayout,
});

function InstallerLayout() {
  const router = useRouter();
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "in" | "out">("loading");
  const [email, setEmail] = useState<string | null>(null);

  const isLogin = location.pathname === "/installer/login";

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setStatus(data.session ? "in" : "out");
      setEmail(data.session?.user.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setStatus(session ? "in" : "out");
      setEmail(session?.user.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (isLogin) {
    return (
      <div className="inst-root" style={{ minHeight: "100vh", background: "var(--inst-surface)" }}>
        <Outlet />
        <InstallerStyles />
      </div>
    );
  }

  if (status !== "in") {
    return (
      <div className="inst-root" style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--inst-surface)" }}>
        <div style={{ color: "var(--inst-muted)", fontSize: 14 }}>Loading…</div>
        <InstallerStyles />
      </div>
    );
  }

  return (
    <div className="inst-root" style={{ minHeight: "100vh", background: "var(--inst-surface)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "linear-gradient(90deg,#0E2E4D,#123E63)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px max(16px,3vw)" }}>
        <Link to="/installer" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#fff" }}>
          <span style={{ background: "#fff", borderRadius: 9, padding: "6px 8px", display: "inline-flex" }}>
            <img src={logo} alt="ClearWaterIreland" width={120} style={{ display: "block", height: "auto" }} />
          </span>
          <span style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>Installer</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</span>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.navigate({ to: "/installer/login" }); }}
            className="inst-btn inst-btn-ghost"
          >
            Sign out
          </button>
        </div>
      </header>

      <main style={{ padding: "28px max(16px,3vw) 80px", maxWidth: 980, margin: "0 auto", width: "100%" }}>
        <Outlet />
      </main>

      <InstallerStyles />
    </div>
  );
}

function InstallerStyles() {
  return (
    <style>{`
      .inst-root {
        --inst-navy: #0E2E4D;
        --inst-navy-dark: #0A2236;
        --inst-teal: #16A6B6;
        --inst-green: #2E9E5B;
        --inst-amber: #E0A458;
        --inst-red: #C73030;
        --inst-surface: #EEF4F8;
        --inst-card: #FFFFFF;
        --inst-border: #D7E3EC;
        --inst-text: #11233A;
        --inst-muted: #5A748C;
        font-family: 'Inter', system-ui, sans-serif;
        color: var(--inst-text);
        line-height: 1.55;
        -webkit-font-smoothing: antialiased;
      }
      .inst-root .section-label { font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--inst-teal); }
      .inst-display { font-weight: 800; letter-spacing: -0.02em; color: var(--inst-navy-dark); }
      .inst-card { background: var(--inst-card); border: 1px solid var(--inst-border); border-radius: 14px; padding: 20px; box-shadow: 0 1px 2px rgba(16,46,77,0.05), 0 10px 26px -16px rgba(16,46,77,0.18); }
      .inst-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 18px; border-radius: 11px; font-weight: 700; font-size: 15px; cursor: pointer; border: 1.5px solid transparent; transition: all 140ms; font-family: inherit; text-decoration: none; }
      .inst-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      .inst-btn-primary { background: var(--inst-teal); color: #fff; box-shadow: 0 4px 14px rgba(22,166,182,0.32); }
      .inst-btn-primary:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); }
      .inst-btn-go { background: var(--inst-green); color: #fff; box-shadow: 0 4px 14px rgba(46,158,91,0.32); }
      .inst-btn-go:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); }
      .inst-btn-ghost { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); color: #fff; padding: 8px 14px; font-size: 13px; }
      .inst-btn-ghost:hover { background: rgba(255,255,255,0.2); }
      .inst-btn-secondary { background: #fff; border-color: var(--inst-teal); color: var(--inst-teal); }
      .inst-input { width: 100%; padding: 12px 14px; border-radius: 11px; border: 1.5px solid var(--inst-border); font-size: 16px; font-family: inherit; background: #fff; color: var(--inst-text); }
      .inst-input:focus { outline: none; border-color: var(--inst-teal); box-shadow: 0 0 0 3px rgba(22,166,182,0.18); }
      .inst-label { display: block; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--inst-muted); margin-bottom: 7px; }
      .inst-link { color: var(--inst-teal); text-decoration: none; font-weight: 600; }
      .inst-link:hover { text-decoration: underline; }
    `}</style>
  );
}
