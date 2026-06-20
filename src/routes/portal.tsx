import { createFileRoute, Outlet, Link, useRouter, useLocation, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/clearwater-logo.png";

export const Route = createFileRoute("/portal")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/portal/login") return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/portal/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Customer Portal — ClearWaterIreland" },
      { name: "description", content: "ClearWaterIreland customer portal: warranty, salt deliveries, documents and support." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PortalLayout,
});

const NAV = [
  { to: "/portal", label: "Dashboard", exact: true },
  { to: "/portal/documents", label: "Documents" },
  { to: "/portal/warranty", label: "Warranty" },
  { to: "/portal/salt", label: "Request Salt" },
  { to: "/portal/chat", label: "AI Assistant" },
];

function PortalLayout() {
  const router = useRouter();
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "in" | "out">("loading");
  const [email, setEmail] = useState<string | null>(null);

  const isLogin = location.pathname === "/portal/login";

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
      <div style={{ minHeight: "100vh", background: "var(--portal-surface)" }} className="portal-root">
        <Outlet />
        <PortalStyles />
      </div>
    );
  }

  if (status !== "in") {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--portal-surface)" }}>
        <div style={{ color: "var(--grey-2)", fontSize: 14 }}>Loading…</div>
        <PortalStyles />
      </div>
    );
  }

  return (
    <div className="portal-root" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "280px 1fr", background: "var(--portal-surface)" }}>
      <aside className="portal-sidebar" style={{ background: "linear-gradient(180deg, #1B4F8A 0%, #173F70 100%)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 26, position: "sticky", top: 0, height: "100vh", color: "#fff" }}>
        <Link to="/portal" style={{ display: "inline-flex", padding: "10px 14px", background: "#fff", borderRadius: 12, alignSelf: "flex-start", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}>
          <img src={logo} alt="ClearWaterIreland" width={160} style={{ display: "block", height: "auto" }} />
        </Link>
        <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>Customer Portal</div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="portal-nav-link"
              activeProps={{ "data-active": "true" } as any}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", wordBreak: "break-all" }}>{email}</div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.navigate({ to: "/portal/login" });
            }}
            className="portal-btn portal-btn-sidebar"
          >
            Sign out
          </button>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "10px 16px",
              borderRadius: 10,
              background: "#fff",
              color: "var(--portal-navy)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              border: "1.5px solid transparent",
            }}
          >
            ← Back to main site
          </Link>
        </div>
      </aside>

      <main className="portal-main" style={{ padding: "40px max(20px, 4vw) 80px", maxWidth: 1180, width: "100%" }}>
        <Outlet />
      </main>

      <PortalStyles />
    </div>
  );
}


function PortalStyles() {
  return (
    <style>{`
      .portal-root {
        /* Brand palette derived from ClearWaterIreland logo */
        --portal-navy: #1B4F8A;
        --portal-navy-dark: #133A66;
        --portal-sky: #29ABE2;
        --portal-sky-soft: #E7F4FB;
        --portal-green: #4CAF34;
        --portal-amber: #E0A458;
        --portal-surface: #F4F8FC;          /* page background — bright */
        --portal-card: #FFFFFF;
        --portal-card-alt: #F4F8FC;
        --portal-text: #122238;             /* primary text on light surfaces */
        --portal-text-muted: #5A7796;       /* secondary text */
        --portal-border: #DCE6F1;           /* hairline divider */
        --portal-red: #C73030;
        font-family: 'Inter', 'Plus Jakarta Sans', system-ui, sans-serif;
        color: var(--portal-text);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
      }
      .portal-root .portal-display {
        font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.15;
        color: var(--portal-navy-dark);
      }
      .portal-root .section-label {
        font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
        text-transform: uppercase; color: var(--portal-sky);
      }
      .portal-main { animation: portalFade 220ms ease-out both; }
      @keyframes portalFade {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .portal-nav-link {
        display: block;
        padding: 11px 14px 11px 16px;
        border-radius: 10px;
        color: rgba(255,255,255,0.78);
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        border-left: 3px solid transparent;
        transition: background 150ms, color 150ms, border-color 150ms;
      }
      .portal-nav-link:hover { background: rgba(255,255,255,0.08); color: #fff; }
      .portal-nav-link[data-active="true"] {
        background: rgba(41,171,226,0.22);
        color: #fff;
        border-left-color: var(--portal-sky);
      }

      .portal-btn {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 11px 20px; border-radius: 10px; font-weight: 600; font-size: 14px;
        cursor: pointer; border: 1.5px solid transparent; transition: all 150ms;
        font-family: inherit; letter-spacing: 0.01em; text-decoration: none;
      }
      .portal-btn-primary { background: var(--portal-sky); color: #fff; box-shadow: 0 4px 14px rgba(41,171,226,0.30); }
      .portal-btn-primary:hover { filter: brightness(1.06); transform: translateY(-1px); }
      .portal-btn-cta { background: var(--portal-sky); color: #fff; box-shadow: 0 4px 14px rgba(41,171,226,0.30); }
      .portal-btn-cta:hover { filter: brightness(1.06); transform: translateY(-1px); }
      .portal-btn-secondary {
        background: #fff; border-color: var(--portal-sky); color: var(--portal-sky);
      }
      .portal-btn-secondary:hover { background: var(--portal-sky-soft); }
      .portal-btn-sidebar {
        background: rgba(255,255,255,0.10); border: 1.5px solid rgba(255,255,255,0.25);
        color: #fff; padding: 10px 16px; border-radius: 10px; font-weight: 600;
        font-size: 13px; cursor: pointer; font-family: inherit; transition: all 150ms;
      }
      .portal-btn-sidebar:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.45); }

      .portal-card {
        background: var(--portal-card);
        border: 1px solid var(--portal-border);
        border-radius: 14px;
        padding: 28px;
        box-shadow: 0 1px 2px rgba(19,58,102,0.04), 0 8px 24px -12px rgba(19,58,102,0.10);
        color: var(--portal-text);
      }

      .portal-input {
        width: 100%; padding: 12px 14px; border-radius: 10px;
        border: 1.5px solid var(--portal-border); font-size: 15px; font-family: inherit;
        background: #fff; color: var(--portal-text);
        transition: border-color 150ms, box-shadow 150ms;
      }
      .portal-input::placeholder { color: #95AABF; }
      .portal-input:focus { outline: none; border-color: var(--portal-sky); box-shadow: 0 0 0 3px rgba(41,171,226,0.18); }
      .portal-label {
        display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--portal-text-muted); margin-bottom: 8px;
      }
      .portal-link { color: var(--portal-sky); text-decoration: none; font-weight: 500; }
      .portal-link:hover { text-decoration: underline; text-underline-offset: 3px; }

      .portal-root select.portal-input {
        appearance: none;
        background-image: linear-gradient(45deg, transparent 50%, var(--portal-text-muted) 50%), linear-gradient(135deg, var(--portal-text-muted) 50%, transparent 50%);
        background-position: calc(100% - 18px) 50%, calc(100% - 13px) 50%;
        background-size: 5px 5px, 5px 5px;
        background-repeat: no-repeat;
        padding-right: 36px;
      }

      /* Re-scope the shared site Chatbot inside the portal back to readable values */
      .portal-main {
        --grey-1: #2D3748;
        --grey-2: #64748B;
        --grey-3: #CBD5E1;
        --navy: #003E7E;
        --navy-dark: #002C5A;
        --navy-mid: #1B5598;
        --blue: #1E78AE;
        --sky: #3EB3DE;
        --surface: #F5F8FC;
        --red: #C73030;
      }

      @media (max-width: 880px) {
        .portal-root { grid-template-columns: 1fr !important; }
        .portal-sidebar { position: static !important; height: auto !important; flex-direction: row !important; flex-wrap: wrap; align-items: center; gap: 16px !important; padding: 18px !important; }
        .portal-sidebar nav { flex-direction: row !important; flex-wrap: wrap; width: 100%; }
        .portal-main { padding: 24px 18px 60px !important; }
        .portal-card { padding: 20px !important; }
      }
    `}</style>
  );
}
