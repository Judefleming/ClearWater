import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const PAGE_HTML = String.raw`<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

*{margin:0;padding:0;box-sizing:border-box}
:root{
 --navy:#003366;--navy-d:#00264D;--navy-l:#0a4d8c;--teal:#007A7C;--teal-l:#0a9aa0;--teal-x:#3fd0c9;
 --ink:#1f2933;--muted:#5a6b7b;--faint:#8a98a6;--line:#e2e9f0;--soft:#f4f8fb;--soft-2:#eaf2f8;
 --maxw:1140px;--ok:#1e9e63;
}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;color:var(--ink);background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
h1,h2,h3,h4,.disp{font-family:'Poppins',sans-serif;color:var(--navy-d);letter-spacing:-.015em;line-height:1.13}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--teal);margin-bottom:14px}
.eyebrow::before{content:"";width:24px;height:2px;background:var(--teal);border-radius:2px}
.center{text-align:center}.center .eyebrow::before{display:none}
.sec{padding:84px 0}
.sec-head{max-width:60ch;margin-bottom:14px}
.center .sec-head{margin:0 auto 14px}
h2.big{font-size:clamp(1.75rem,3.6vw,2.6rem);margin-bottom:14px}
.lead-p{color:var(--muted);font-size:1.08rem;max-width:54ch}
.center .lead-p{margin:0 auto}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:'Poppins',sans-serif;font-weight:600;font-size:15px;padding:14px 24px;border-radius:12px;cursor:pointer;border:1px solid transparent;transition:transform .16s,box-shadow .16s,background .16s}
.btn-primary{background:linear-gradient(150deg,var(--teal-l),var(--teal));color:#fff;box-shadow:0 10px 26px rgba(0,122,124,.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,122,124,.42)}
.btn-navy{background:linear-gradient(150deg,var(--navy-l),var(--navy));color:#fff;box-shadow:0 10px 26px rgba(0,51,102,.28)}
.btn-navy:hover{transform:translateY(-2px)}
.btn-ghost{background:#fff;border-color:var(--line);color:var(--navy-d)}
.btn-ghost:hover{border-color:var(--teal);color:var(--teal)}
.btn-sm{padding:10px 16px;font-size:14px}

/* nav */
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.nav-in{max-width:var(--maxw);margin:0 auto;padding:11px 24px;display:flex;align-items:center;gap:26px}
.nav-in>a:first-child{flex:0 0 auto;display:flex;align-items:center}
.nav-in .logo{height:42px;width:auto;display:block}
.nav-links{display:flex;gap:24px;margin-left:6px}
.nav-links a{font-size:14.5px;color:var(--muted);font-weight:500}
.nav-links a:hover{color:var(--navy)}
.nav-cta{margin-left:auto;display:flex;align-items:center;gap:12px}
.nav-phone{font-family:'Poppins',sans-serif;font-weight:600;color:var(--navy);font-size:15px}
@media(max-width:1040px){.nav-links{display:none}}
@media(max-width:640px){
 .nav-in{gap:8px;padding:10px 14px}
 .nav-in .logo{height:30px}
 .nav-phone{display:none}
 .nav-cta{gap:7px}
 .nav-cta .btn-sm{padding:8px 12px;font-size:12.5px}
}
@media(max-width:380px){
 .nav-in .logo{height:27px}
 .nav-cta .btn-sm{padding:7px 10px;font-size:11.5px}
}

/* hero */
.hero{background:linear-gradient(170deg,#f3f9fc 0%,#fff 60%);padding:60px 0 72px;position:relative;overflow:hidden}
.hero::before{content:"";position:absolute;top:-160px;right:-120px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(0,122,124,.10),transparent 65%);pointer-events:none}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center;position:relative}
.hero .badge{display:inline-flex;align-items:center;gap:8px;background:#e7f3f3;color:var(--teal);font-weight:600;font-size:13px;padding:7px 14px;border-radius:30px;margin-bottom:20px}
.hero h1{font-size:clamp(2.2rem,4.6vw,3.4rem);margin-bottom:18px}
.hero h1 .hl{color:var(--teal)}
.hero p.sub{font-size:1.15rem;color:var(--muted);max-width:44ch;margin-bottom:24px}
.hardness{display:flex;align-items:center;gap:16px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin-bottom:26px;box-shadow:0 8px 24px rgba(0,51,102,.05)}
.hardness .num{font-family:'Poppins',sans-serif;font-weight:700;font-size:2.4rem;color:#c0392b;line-height:1}
.hardness .meta{font-size:12.5px;color:var(--muted)}
.hardness .meta b{color:var(--ink);display:block;font-size:13.5px}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:22px}
.trust-chips{display:flex;gap:20px;flex-wrap:wrap}
.trust-chips span{display:flex;align-items:center;gap:7px;font-size:13.5px;color:var(--muted);font-weight:500}

/* before/after slider */
.ba{position:relative;border-radius:18px;overflow:hidden;box-shadow:0 26px 60px rgba(0,51,102,.18);aspect-ratio:4/3;background:#dfe7ee;user-select:none}
.ba img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.ba .ba-top{clip-path:inset(0 50% 0 0)}
.ba .handle{position:absolute;top:0;bottom:0;left:50%;width:44px;transform:translateX(-50%);cursor:ew-resize;display:flex;align-items:center;justify-content:center;z-index:3}
.ba .handle::before{content:"";position:absolute;top:0;bottom:0;width:3px;background:#fff;box-shadow:0 0 8px rgba(0,0,0,.3)}
.ba .knob{width:40px;height:40px;border-radius:50%;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.3);display:grid;place-items:center;color:var(--navy)}
.ba .lbl{position:absolute;bottom:12px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:rgba(0,38,77,.7);padding:5px 10px;border-radius:6px;z-index:2}
.ba .lbl.b{left:12px}.ba .lbl.a{right:12px}
.ba-cap{text-align:center;font-size:13px;color:var(--faint);margin-top:12px}

/* why us */
.why{background:var(--soft);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.compare{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:34px}
.col{border-radius:16px;padding:30px;border:1px solid var(--line)}
.col.them{background:#fff}
.col.us{background:linear-gradient(165deg,var(--navy-l),var(--navy-d));border:none;box-shadow:0 24px 50px rgba(0,51,102,.22)}
.col h3{font-size:1.18rem;margin-bottom:3px}.col.us h3{color:#fff}
.col .csub{font-size:12px;letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin-bottom:20px}
.col.them .csub{color:#9aa7b4}.col.us .csub{color:var(--teal-x)}
.col ul{list-style:none;display:flex;flex-direction:column;gap:14px}
.col li{display:flex;gap:12px;font-size:14.5px;align-items:flex-start}
.col.them li{color:var(--muted)}.col.us li{color:#eaf3f8}
.col li .ic{flex:none;margin-top:2px}

/* cost cards */
.cost-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:36px}
.cost{background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px;transition:transform .18s,box-shadow .18s}
.cost:hover{transform:translateY(-4px);box-shadow:0 16px 36px rgba(0,51,102,.08)}
.cost .big{font-family:'Poppins',sans-serif;font-weight:700;font-size:2rem;color:#c0392b;margin-bottom:4px}
.cost h4{font-size:1.02rem;margin-bottom:6px}
.cost p{font-size:13px;color:var(--muted)}
.cost .src{font-size:11px;color:var(--faint);margin-top:8px}
.tap-pair{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:28px}
.tap{border-radius:14px;overflow:hidden;border:1px solid var(--line);position:relative}
.tap img{aspect-ratio:4/3;object-fit:cover;width:100%}
.tap .cap{padding:14px 16px;background:#fff}
.tap .cap b{font-family:'Poppins',sans-serif;font-size:14px;color:var(--navy-d)}
.tap .cap.bad b{color:#c0392b}
.tap .cap span{display:block;font-size:12.5px;color:var(--muted)}

/* packages */
.pkgs{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:40px;align-items:start}
.pkg{background:#fff;border:1px solid var(--line);border-radius:18px;padding:30px;position:relative;transition:transform .18s,box-shadow .18s}
.pkg:hover{transform:translateY(-5px);box-shadow:0 24px 50px rgba(0,51,102,.12)}
.pkg.feat{border:2px solid var(--teal);box-shadow:0 24px 56px rgba(0,122,124,.16)}
.pkg .ribbon{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--teal);color:#fff;font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:6px 14px;border-radius:20px;white-space:nowrap}
.pkg .tier{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--teal);margin-bottom:6px}
.pkg h3{font-size:1.5rem;margin-bottom:4px}
.pkg .desc{font-size:13.5px;color:var(--muted);margin-bottom:18px;min-height:38px}
.pkg .price{font-family:'Poppins',sans-serif;font-weight:700;font-size:2.4rem;color:var(--navy-d)}
.pkg .price small{display:block;font-size:12.5px;font-weight:500;color:var(--faint);letter-spacing:0}
.pkg ul{list-style:none;margin:20px 0;display:flex;flex-direction:column;gap:10px}
.pkg li{display:flex;gap:10px;font-size:13.7px;color:var(--ink);align-items:flex-start}
.pkg li .ic{flex:none;margin-top:3px}
.pkg .plus{font-size:12px;font-weight:700;color:var(--teal);text-transform:uppercase;letter-spacing:.05em;margin:6px 0 2px}
.pkg .btn{width:100%;margin-top:6px}
.pkg-note{text-align:center;margin-top:26px;color:var(--muted);font-size:14.5px}

/* calculator */
.calc{background:var(--navy-d);color:#fff;border-radius:22px;padding:40px;display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:36px}
.calc h3{color:#fff;font-size:1.3rem;margin-bottom:6px}
.calc .ctrl{margin-bottom:18px}
.calc label{display:flex;justify-content:space-between;font-size:13.5px;color:#c8d6e2;margin-bottom:7px;font-weight:500}
.calc label b{color:var(--teal-x);font-family:'Poppins',sans-serif}
.calc input[type=range]{width:100%;-webkit-appearance:none;height:6px;border-radius:6px;background:rgba(255,255,255,.18);outline:none}
.calc input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--teal-x);cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.3)}
.calc input[type=range]::-moz-range-thumb{width:20px;height:20px;border:none;border-radius:50%;background:var(--teal-x);cursor:pointer}
.calc .hint{font-size:11px;color:#8ba3b8;margin-top:5px}
.calc .apps{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.calc .app{font-size:12.5px;padding:7px 11px;border-radius:20px;border:1px solid rgba(255,255,255,.2);cursor:pointer;color:#c8d6e2;user-select:none;transition:.15s}
.calc .app.on{background:var(--teal);border-color:var(--teal);color:#fff}
.calc .result{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:28px;display:flex;flex-direction:column}
.calc .saving{text-align:center;margin-bottom:18px}
.calc .saving .n{font-family:'Poppins',sans-serif;font-weight:700;font-size:3rem;color:var(--teal-x);line-height:1}
.calc .saving span{font-size:13px;color:#c8d6e2}
.calc .brk{display:flex;justify-content:space-between;font-size:13px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.1)}
.calc .brk:last-of-type{border:none}
.calc .brk span{color:#c8d6e2}.calc .brk b{color:#fff;font-family:'Poppins',sans-serif}
.calc .foot{display:flex;justify-content:space-between;margin-top:16px;gap:12px}
.calc .foot .box{flex:1;background:rgba(0,122,124,.18);border-radius:10px;padding:12px;text-align:center}
.calc .foot .box .n{font-family:'Poppins',sans-serif;font-weight:700;font-size:1.3rem;color:var(--teal-x)}
.calc .foot .box span{font-size:11px;color:#c8d6e2}
.calc .disc{font-size:10.5px;color:#7e93a6;margin-top:14px;text-align:center}

/* process */
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:38px}
.step{background:#fff;border:1px solid var(--line);border-radius:16px;padding:30px;position:relative}
.step .n{width:42px;height:42px;border-radius:12px;background:var(--soft-2);color:var(--navy);font-family:'Poppins',sans-serif;font-weight:700;display:grid;place-items:center;margin-bottom:16px;font-size:1.1rem}
.step h3{font-size:1.2rem;margin-bottom:8px}
.step p{font-size:14px;color:var(--muted);margin-bottom:12px}
.step .tag{font-size:12px;font-weight:600;color:var(--teal)}

/* about */
.about{background:var(--soft);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.about-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:46px;align-items:center}
.about p{color:var(--muted);font-size:1.04rem;margin-bottom:15px}
.about p strong{color:var(--ink)}
.about .lead{font-size:1.12rem;color:var(--ink)}
.pledges{background:#fff;border:1px solid var(--line);border-radius:18px;padding:28px}
.pledges h3{font-size:1.05rem;margin-bottom:16px;color:var(--navy)}
.pledge{display:flex;gap:13px;padding:13px 0;border-bottom:1px solid var(--line)}
.pledge:last-child{border-bottom:none;padding-bottom:0}
.pledge .ic{flex:none;width:38px;height:38px;border-radius:10px;background:var(--soft-2);display:grid;place-items:center}
.pledge b{display:block;font-family:'Poppins',sans-serif;font-size:14px;color:var(--navy-d)}
.pledge span{font-size:12.7px;color:var(--muted)}

/* salt + area */
.split2{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
.salt-steps{display:flex;flex-direction:column;gap:14px;margin-top:8px}
.salt-step{display:flex;gap:14px;align-items:flex-start}
.salt-step .nn{flex:none;width:30px;height:30px;border-radius:8px;background:var(--teal);color:#fff;font-family:'Poppins',sans-serif;font-weight:700;font-size:13px;display:grid;place-items:center}
.salt-step b{font-family:'Poppins',sans-serif;font-size:14.5px;color:var(--navy-d);display:block}
.salt-step span{font-size:13.5px;color:var(--muted)}
.jobs{display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px}
.jobs h4{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--teal);margin-bottom:10px}
.jobs ul{list-style:none;display:flex;flex-direction:column;gap:8px}
.jobs li{font-size:13px;color:var(--muted);display:flex;gap:8px}

/* founding band */
.founding{background:linear-gradient(160deg,var(--navy),var(--navy-d));color:#fff;border-radius:22px;padding:48px;text-align:center;position:relative;overflow:hidden}
.founding::before{content:"";position:absolute;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(0,122,124,.4),transparent 65%);top:-160px;left:50%;transform:translateX(-50%)}
.founding h2{color:#fff;font-size:clamp(1.6rem,3.2vw,2.3rem);margin-bottom:12px;position:relative}
.founding p{color:#c8d6e2;max-width:52ch;margin:0 auto 24px;position:relative}
.founding .pills{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:28px;position:relative}
.founding .pill{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:30px;padding:9px 16px;font-size:13.5px;display:flex;align-items:center;gap:8px}

/* faq */
.faq-list{max-width:780px;margin:32px auto 0}
details{background:#fff;border:1px solid var(--line);border-radius:12px;margin-bottom:12px;overflow:hidden}
details[open]{border-color:var(--teal)}
summary{padding:18px 22px;font-family:'Poppins',sans-serif;font-weight:600;font-size:15.5px;color:var(--navy-d);cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px}
summary::-webkit-details-marker{display:none}
summary .chev{transition:transform .2s;flex:none;color:var(--teal)}
details[open] summary .chev{transform:rotate(180deg)}
details .body{padding:0 22px 20px;color:var(--muted);font-size:14.5px}

/* contact */
.contact-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:36px;margin-top:36px}
.contact-card{background:linear-gradient(160deg,var(--teal),var(--teal-l));color:#fff;border-radius:18px;padding:34px}
.contact-card h3{color:#fff;font-size:1.4rem;margin-bottom:10px}
.contact-card p{color:rgba(255,255,255,.9);font-size:14.5px;margin-bottom:20px}
.contact-card .phone{font-family:'Poppins',sans-serif;font-weight:700;font-size:1.8rem;color:#fff;display:block;margin-bottom:6px}
.contact-card .btn{background:#fff;color:var(--teal);margin-top:8px}
.contact-card .note{font-size:12.5px;color:rgba(255,255,255,.8);margin-top:16px}
.qform{background:#fff;border:1px solid var(--line);border-radius:18px;padding:30px}
.qform h3{font-size:1.25rem;margin-bottom:18px}
.qform .field{margin-bottom:14px}
.qform label{font-size:13px;font-weight:600;color:var(--navy-d);display:block;margin-bottom:6px}
.qform input,.qform select{width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:10px;font-size:14.5px;font-family:inherit;color:var(--ink);outline:none}
.qform input:focus,.qform select:focus{border-color:var(--teal)}
.qform .btn{width:100%;margin-top:6px}
.qform .fine{font-size:12px;color:var(--faint);text-align:center;margin-top:12px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap}

/* portal */
.portal{background:var(--navy-d);color:#fff;border-radius:20px;padding:40px;display:flex;align-items:center;gap:30px;flex-wrap:wrap;justify-content:space-between}
.portal h3{color:#fff;font-size:1.4rem;margin-bottom:8px}
.portal p{color:#c8d6e2;font-size:14.5px;max-width:50ch}
.portal .btn{background:var(--teal-x);color:var(--navy-d)}

/* footer */
footer{background:#0a1722;color:#9fb0bf;padding:54px 0 30px;margin-top:0}
.foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:30px;margin-bottom:34px}
footer .logo{height:46px;margin-bottom:14px;filter:brightness(0) invert(1);opacity:.95}
footer p{font-size:13.5px;line-height:1.6}
footer h4{color:#fff;font-family:'Poppins',sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px}
footer ul{list-style:none;display:flex;flex-direction:column;gap:9px}
footer ul a{font-size:13.5px;color:#9fb0bf}
footer ul a:hover{color:var(--teal-x)}
.foot-bottom{border-top:1px solid rgba(255,255,255,.1);padding-top:20px;font-size:12.5px;color:#6b7d8c;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}

/* chat widget */
#cw-launch{position:fixed;right:20px;bottom:20px;width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;background:linear-gradient(150deg,var(--teal-l),var(--teal));box-shadow:0 10px 28px rgba(0,122,124,.45);display:grid;place-items:center;z-index:998}
#cw-launch:hover{transform:translateY(-2px) scale(1.04)}
#cw-panel{position:fixed;right:20px;bottom:88px;width:350px;max-width:calc(100vw - 28px);height:480px;max-height:calc(100vh - 130px);background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 26px 60px rgba(0,38,77,.28);display:none;flex-direction:column;overflow:hidden;z-index:999}
#cw-panel.open{display:flex}
.cw-head{padding:16px 18px;background:linear-gradient(150deg,var(--navy-l),var(--navy-d));color:#fff;display:flex;align-items:center;gap:11px}
.cw-head .av{width:34px;height:34px;border-radius:9px;background:rgba(255,255,255,.15);display:grid;place-items:center;flex:none}
.cw-head b{font-family:'Poppins',sans-serif;font-size:14.5px;display:block}
.cw-head span{font-size:11.5px;color:#bcd0e0;display:flex;align-items:center;gap:6px}
.cw-head .dot{width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block}
.cw-x{margin-left:auto;background:none;border:none;color:#bcd0e0;font-size:22px;cursor:pointer;line-height:1}
.cw-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:var(--soft)}
.cw-msg{max-width:86%;padding:10px 13px;border-radius:13px;font-size:13.5px;line-height:1.5}
.cw-bot{align-self:flex-start;background:#fff;border:1px solid var(--line);color:var(--ink);border-bottom-left-radius:4px}
.cw-user{align-self:flex-end;background:var(--teal);color:#fff;border-bottom-right-radius:4px}
.cw-chips{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 10px;background:var(--soft)}
.cw-chip{background:#e7f3f3;border:1px solid #bfe2e2;color:var(--teal);font-size:12px;padding:7px 11px;border-radius:18px;cursor:pointer}
.cw-foot{display:flex;gap:8px;padding:11px;border-top:1px solid var(--line)}
.cw-foot input{flex:1;border:1px solid var(--line);border-radius:10px;padding:10px 12px;font-size:13.5px;outline:none;font-family:inherit}
.cw-foot input:focus{border-color:var(--teal)}
.cw-send{background:var(--teal);border:none;color:#fff;border-radius:10px;padding:0 14px;cursor:pointer;font-size:16px}

/* reveal */
.js .reveal{opacity:0;transform:translateY(18px)}
.js .reveal.in{opacity:1;transform:none;transition:opacity .6s ease,transform .6s ease}

@media(max-width:900px){
 .hero-grid,.compare,.cost-grid,.pkgs,.steps,.about-grid,.split2,.contact-grid,.tap-pair,.calc{grid-template-columns:1fr}
 .cost-grid{grid-template-columns:1fr 1fr}
 .foot-grid{grid-template-columns:1fr 1fr}
 .sec{padding:62px 0}
 .calc{padding:28px}
}
@media(max-width:560px){
 .cost-grid,.foot-grid{grid-template-columns:1fr}
}

</style>
<!-- NAV -->
<nav>
 <div class="nav-in">
  <a href="#home"><img class="logo" src="https://clear-water-nine.vercel.app/assets/clearwater-logo-C_XgsMZZ.png" alt="ClearWater Ireland"/></a>
  <div class="nav-links">
   <a href="#why">Why Us</a>
   <a href="#packages">Packages</a>
   <a href="#calculator">Savings</a>
   <a href="#how">How It Works</a>
   <a href="#about">About</a>
   <a href="#faq">FAQ</a>
  </div>
  <div class="nav-cta">
   <a href="tel:017267941" class="nav-phone">(1) 726 7941</a>
   <a href="https://clear-water-nine.vercel.app/portal" class="btn btn-ghost btn-sm nav-portal">Customer Portal</a>
   <a href="#contact" class="btn btn-primary btn-sm">Get a Quote</a>
  </div>
 </div>
</nav>

<!-- HERO -->
<header class="hero" id="home">
 <div class="wrap hero-grid">
  <div class="reveal">
   <span class="badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Serving Dublin &amp; surrounding areas</span>
   <h1>Hard water is quietly <span class="hl">destroying your home.</span></h1>
   <p class="sub">Dublin tap water runs 4–5× over the recommended limit. A softener stops the damage at the source — fixed price, installed within the week.</p>
   <div class="hardness">
    <div class="num">280</div>
    <div class="meta"><b>mg/L — Dublin water hardness</b>Recommended max: 60 mg/L · Source: Irish Water 2023</div>
   </div>
   <div class="hero-cta">
    <a href="#contact" class="btn btn-primary">Get a Free Quote →</a>
    <a href="tel:017267941" class="btn btn-ghost">Call (1) 726 7941</a>
   </div>
   <div class="trust-chips">
    <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5z"/></svg> Up to 10-yr warranty</span>
    <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> Same-week install</span>
    <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Fixed price, in writing</span>
   </div>
  </div>
  <div class="reveal">
   <div class="ba" id="ba">
    <img class="ba-base" src="https://clear-water-nine.vercel.app/assets/after-clean-yHdygtGt.jpg" alt="After — soft, clean water" onerror="this.style.background='#e8f3f3';this.removeAttribute('src')"/>
    <img class="ba-top" id="baTop" src="https://clear-water-nine.vercel.app/assets/before-limescale-DiDa5cmu.jpg" alt="Before — limescale damage" onerror="this.style.background='#cdd8e2';this.removeAttribute('src')"/>
    <span class="lbl b">Before</span>
    <span class="lbl a">After</span>
    <div class="handle" id="baHandle"><div class="knob"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg></div></div>
   </div>
   <p class="ba-cap">Drag to compare — limescale damage vs. softened water</p>
  </div>
 </div>
</header>

<!-- WHY US -->
<section class="why sec" id="why">
 <div class="wrap">
  <div class="sec-head reveal">
   <span class="eyebrow">Why ClearWater</span>
   <h2 class="big">Straight answers, fixed prices, no sales runaround.</h2>
   <p class="lead-p">Most water-treatment companies make you book a consultation just to find out what it costs. We do it differently — clear pricing up front, a fast professional install, and warranties you can actually read.</p>
  </div>
  <div class="compare reveal">
   <div class="col them">
    <h3>The usual experience</h3>
    <span class="csub">Most water-treatment firms</span>
    <ul>
     <li><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b9c4ce" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span> Book a consultation just to get a price</li>
     <li><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b9c4ce" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span> Weeks of waiting and chasing call-backs</li>
     <li><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b9c4ce" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span> Unclear who actually turns up to install</li>
     <li><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b9c4ce" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span> Warranty only if you keep paying for service</li>
    </ul>
   </div>
   <div class="col us">
    <h3>With ClearWater</h3>
    <span class="csub">How we work</span>
    <ul>
     <li><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3fd0c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Fixed, transparent pricing — published up front</li>
     <li><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3fd0c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Fast, scheduled installs — usually within the week</li>
     <li><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3fd0c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Vetted, fully insured, contracted plumbers — every time</li>
     <li><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3fd0c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Clear written warranties that are yours to keep</li>
    </ul>
   </div>
  </div>
 </div>
</section>

<!-- COST OF HARD WATER -->
<section class="sec" id="problem">
 <div class="wrap">
  <div class="sec-head center reveal">
   <span class="eyebrow">The hidden cost</span>
   <h2 class="big">What hard water is silently costing you</h2>
   <p class="lead-p">Most homeowners only find out when the boiler fails. Here's what the data says it's doing in the meantime.</p>
  </div>
  <div class="cost-grid reveal">
   <div class="cost"><div class="big">−40%</div><h4>Boiler efficiency</h4><p>Just 1.6mm of scale cuts boiler efficiency by up to 40%.</p><div class="src">Source: HHIC</div></div>
   <div class="cost"><div class="big">−50%</div><h4>Appliance lifespan</h4><p>Hard-water appliances can fail up to 50% sooner.</p><div class="src">Source: WQRF 2009</div></div>
   <div class="cost"><div class="big">€1,000+</div><h4>Pipe &amp; fixture damage</h4><p>Scale builds inside pipes, leading to costly repairs.</p><div class="src">Source: Irish plumbing costs</div></div>
  </div>
  <div class="tap-pair reveal">
   <div class="tap"><img src="https://clear-water-nine.vercel.app/assets/before-tap-BfAyg5vV.jpg" alt="Tap with limescale" onerror="this.style.background='#cdd8e2';this.style.aspectRatio='4/3';this.removeAttribute('src')"/><div class="cap bad"><b>Before — hard water</b><span>Limescale crust on taps, shower-heads &amp; appliances</span></div></div>
   <div class="tap"><img src="https://clear-water-nine.vercel.app/assets/after-tap-CyeF4nHN.jpg" alt="Clean tap after softening" onerror="this.style.background='#e8f3f3';this.style.aspectRatio='4/3';this.removeAttribute('src')"/><div class="cap"><b>After — softened water</b><span>Spotless fixtures, longer appliance life &amp; better skin</span></div></div>
  </div>
 </div>
</section>

<!-- PACKAGES -->
<section class="sec" id="packages" style="background:var(--soft);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
 <div class="wrap">
  <div class="sec-head center reveal">
   <span class="eyebrow">Packages</span>
   <h2 class="big">Three ways to never see limescale again.</h2>
   <p class="lead-p">Fixed price, fully installed. Choose the level of protection that fits your home.</p>
  </div>
  <div class="pkgs reveal">
   <!-- Essential -->
   <div class="pkg">
    <div class="tier">Foundation</div>
    <h3>Essential</h3>
    <div class="desc">Limescale removal &amp; whole-home protection.</div>
    <div class="price">€1,450<small>fixed price · fully installed</small></div>
    <ul>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Professional supply &amp; installation</li>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Whole-home limescale protection</li>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Water hardness test before &amp; after</li>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Bypass valve fitted &amp; tested</li>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Customer portal &amp; digital document pack</li>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> 2-year unit + 1-year workmanship warranty</li>
    </ul>
    <a href="#contact" class="btn btn-ghost">Book Essential</a>
   </div>
   <!-- Complete -->
   <div class="pkg feat">
    <div class="ribbon">★ Most popular</div>
    <div class="tier">Recommended</div>
    <h3>Complete</h3>
    <div class="desc">Long-term protection with managed salt &amp; priority support.</div>
    <div class="price">€1,895<small>fixed price · fully installed</small></div>
    <ul>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Everything in Essential</li>
    </ul>
    <div class="plus">Plus</div>
    <ul>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Salt management programme access</li>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Priority support &amp; digital service history</li>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> 10-year parts + 2-year workmanship warranty</li>
    </ul>
    <a href="#contact" class="btn btn-primary">Book Complete</a>
   </div>
   <!-- Premium -->
   <div class="pkg">
    <div class="tier">Top tier</div>
    <h3>Premium</h3>
    <div class="desc">Complete protection plus filtered drinking water.</div>
    <div class="price">€2,200<small>fixed price · fully installed</small></div>
    <ul>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Everything in Complete</li>
    </ul>
    <div class="plus">Plus</div>
    <ul>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Integrated drinking water filtration</li>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> Filtered tap supplied &amp; fitted at the kitchen sink</li>
     <li><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> 10-year parts + 3-year workmanship warranty</li>
    </ul>
    <a href="#contact" class="btn btn-ghost">Book Premium</a>
   </div>
  </div>
  <p class="pkg-note">Still deciding? We'll match you to the right unit in 60 seconds — no hard sell, just an honest recommendation. <a href="tel:017267941" style="color:var(--teal);font-weight:600">Call (1) 726 7941</a></p>
 </div>
</section>

<!-- CALCULATOR -->
<section class="sec" id="calculator">
 <div class="wrap">
  <div class="sec-head center reveal">
   <span class="eyebrow">Savings calculator</span>
   <h2 class="big">See exactly what hard water is costing you</h2>
   <p class="lead-p">Based on verified data from Irish Water, the HHIC and the Water Quality Research Foundation.</p>
  </div>
  <div class="calc reveal">
   <div>
    <h3>Your household</h3>
    <p style="color:#c8d6e2;font-size:13.5px;margin-bottom:20px">Adjust to match your home.</p>
    <div class="ctrl"><label>People in your home <b id="vPeople">3</b></label><input type="range" id="people" min="1" max="6" value="3"></div>
    <div class="ctrl"><label>Number of bathrooms <b id="vBath">2</b></label><input type="range" id="bath" min="1" max="5" value="2"></div>
    <div class="ctrl"><label>Boiler age (years) <b id="vBoiler">7</b></label><input type="range" id="boiler" min="0" max="20" value="7"><div class="hint">HHIC: 1.6mm scale = 12% efficiency loss; 5mm = 24%+.</div></div>
    <div class="ctrl"><label>Water hardness (mg/L) <b id="vHard">300</b></label><input type="range" id="hard" min="150" max="350" value="300"><div class="hint">Dublin &amp; most of Leinster: 280–320 mg/L (very hard).</div></div>
    <div class="ctrl"><label>Appliances in your home</label>
     <div class="apps" id="apps">
      <span class="app on">Dishwasher</span>
      <span class="app on">Washing Machine</span>
      <span class="app">Electric Shower</span>
      <span class="app on">Kettle</span>
      <span class="app">Coffee Machine</span>
      <span class="app">Steam Iron</span>
      <span class="app">Toilet cisterns</span>
     </div>
    </div>
    <div class="ctrl"><label>Cleaning product spend</label>
     <div class="apps" id="clean">
      <span class="app" data-c="180">Under €150</span>
      <span class="app on" data-c="297">€150–€300</span>
      <span class="app" data-c="420">Over €300</span>
     </div>
    </div>
   </div>
   <div class="result">
    <div class="saving"><div class="n" id="total">€0</div><span>estimated annual saving</span></div>
    <div class="brk"><span>Boiler &amp; heating</span><b id="bBoiler">€0</b></div>
    <div class="brk"><span>Appliance lifespan</span><b id="bApp">€0</b></div>
    <div class="brk"><span>Cleaning products</span><b id="bClean">€0</b></div>
    <div class="brk"><span>Plumbing call-outs</span><b id="bPlumb">€0</b></div>
    <div class="brk"><span>Energy overhead</span><b id="bEnergy">€0</b></div>
    <div class="foot">
     <div class="box"><div class="n" id="payback">—</div><span>pays for itself</span></div>
     <div class="box"><div class="n" id="tenyr">€0</div><span>10-year saving</span></div>
    </div>
    <div class="disc">Estimates based on industry data. Actual savings depend on usage and local hardness.</div>
   </div>
  </div>
  <div class="center" style="margin-top:26px"><a href="#contact" class="btn btn-primary reveal">Get Your System Installed →</a></div>
 </div>
</section>

<!-- HOW IT WORKS -->
<section class="sec" id="how" style="background:var(--soft);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
 <div class="wrap">
  <div class="sec-head center reveal">
   <span class="eyebrow">The process</span>
   <h2 class="big">From first call to soft water — in days.</h2>
   <p class="lead-p">Straightforward and honest. No surprises.</p>
  </div>
  <div class="steps reveal">
   <div class="step"><div class="n">1</div><h3>Get in touch</h3><p>Call or text (1) 726 7941. We confirm the right package and a firm price — no site visit needed.</p><span class="tag">Same-day response</span></div>
   <div class="step"><div class="n">2</div><h3>We install</h3><p>Your insured installer arrives on the agreed date, fits everything in 2–4 hours, tests it, and leaves spotless.</p><span class="tag">Within the week</span></div>
   <div class="step"><div class="n">3</div><h3>Soft water. Done.</h3><p>100% soft water throughout your home from day one — with your warranty starting immediately.</p><span class="tag">Warranty starts day one</span></div>
  </div>
 </div>
</section>

<!-- ABOUT -->
<section class="about sec" id="about">
 <div class="wrap about-grid">
  <div class="reveal">
   <span class="eyebrow">About us</span>
   <h2 class="big">Born from how hard Irish water really is.</h2>
   <p class="lead">ClearWater Ireland started with a simple realisation: most Irish homes are quietly dealing with some of the hardest water in Europe — and most people have no idea of the damage it's doing.</p>
   <p>The more we looked into it, the clearer it became. Limescale was quietly wrecking boilers and appliances, driving up energy bills, and costing Dublin households real money — year after year. <strong>So we set out to build something better:</strong> a straightforward, honest water-softening service, with none of the call-centres and opaque "get a quote" runaround the industry is known for.</p>
   <p>Every installation is carried out by <strong>vetted, fully insured and tax-compliant plumbers, working under formal contract with us.</strong> That means qualified hands on the job, full accountability, and complete peace of mind for you — from the first call to the final test.</p>
   <p>We're a local Dublin business doing one thing properly: protecting your home from hard water, the right way.</p>
  </div>
  <div class="pledges reveal">
   <h3>What we stand for</h3>
   <div class="pledge"><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5z"/><path d="M9 12l2 2 4-4"/></svg></span><div><b>Fully insured &amp; contracted</b><span>Insured, tax-compliant plumbers under formal contract.</span></div></div>
   <div class="pledge"><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg></span><div><b>Transparent pricing</b><span>Fixed prices, shown up front — no surprises.</span></div></div>
   <div class="pledge"><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><div><b>Fast, local service</b><span>Dublin-based, with installs usually within the week.</span></div></div>
   <div class="pledge"><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007A7C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div><b>Warranties in writing</b><span>Clear cover you keep — not tied to upsells.</span></div></div>
  </div>
 </div>
</section>

<!-- SALT PLAN -->
<section class="sec" id="salt">
 <div class="wrap split2">
  <div class="reveal">
   <span class="eyebrow">Salt supply plan</span>
   <h2 class="big">Never run out of salt again.</h2>
   <p class="lead-p" style="margin-bottom:8px">We track it, deliver it, and sort it — no contract, pay per delivery.</p>
   <div class="salt-steps">
    <div class="salt-step"><div class="nn">1</div><div><b>We check in</b><span>We track your usage and message you before you run low.</span></div></div>
    <div class="salt-step"><div class="nn">2</div><div><b>We deliver</b><span>The right salt for your softener, brought to your door on a date that suits.</span></div></div>
    <div class="salt-step"><div class="nn">3</div><div><b>You're sorted</b><span>Pay per delivery. No contract. Cancel any time.</span></div></div>
   </div>
  </div>
  <div class="jobs reveal">
   <div>
    <h4>Your job</h4>
    <ul>
     <li>• Tell us if your location changes</li>
     <li>• Be home or tell us where to leave it</li>
     <li>• Pay per delivery</li>
    </ul>
   </div>
   <div>
    <h4>Our job</h4>
    <ul>
     <li>• Track when you're low</li>
     <li>• Message before every delivery</li>
     <li>• Correct salt for your unit</li>
     <li>• Keep delivery records</li>
    </ul>
   </div>
  </div>
 </div>
</section>

<!-- FOUNDING CUSTOMER BAND (honest replacement for fake reviews/counts) -->
<section class="sec" style="padding-top:0">
 <div class="wrap">
  <div class="founding reveal">
   <span class="eyebrow" style="color:var(--teal-x);justify-content:center">Now booking</span>
   <h2>Be one of our first Dublin installs.</h2>
   <p>We're a new local business building our reputation one honest install at a time. Book early and you get our full attention, the same fixed pricing, and the peace of mind of insured, contracted plumbers.</p>
   <div class="pills">
    <span class="pill"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3fd0c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Fixed price, in writing</span>
    <span class="pill"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3fd0c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Insured &amp; contracted plumbers</span>
    <span class="pill"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3fd0c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Up to 10-year warranty</span>
    <span class="pill"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3fd0c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Full document pack &amp; 14-day cooling-off</span>
   </div>
   <a href="#contact" class="btn btn-primary" style="position:relative">Book your install →</a>
  </div>
 </div>
</section>

<!-- FAQ -->
<section class="sec" id="faq" style="background:var(--soft);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
 <div class="wrap">
  <div class="sec-head center reveal">
   <span class="eyebrow">FAQ</span>
   <h2 class="big">Questions, answered.</h2>
   <p class="lead-p">Everything you might want to know before booking.</p>
  </div>
  <div class="faq-list reveal">
   <details><summary>How long does installation take? <span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></summary><div class="body">2–4 hours. An adult (18+) must be present. There's a brief water interruption, and we leave the space completely clean.</div></details>
   <details><summary>Do I need a plumber beforehand? <span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></summary><div class="body">No. Our insured installer handles everything — fittings, bypass valve, drain connection and the initial salt charge.</div></details>
   <details><summary>What salt does my softener need? <span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></summary><div class="body">Essential &amp; Complete: tablet or block salt. Premium: tablet salt only. Never cooking salt or road grit.</div></details>
   <details><summary>Is softened water safe to drink? <span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></summary><div class="body">Safe for most adults. Not recommended for infant formula or low-sodium diets due to added sodium. Premium customers get a filtered drinking tap at the kitchen sink — no added sodium, suitable for everyone.</div></details>
   <details><summary>What if something goes wrong? <span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></summary><div class="body">Call (1) 726 7941. Active leaks: same-day. System faults: within 2 working days. Genuine warranty fixes are at no charge.</div></details>
   <details><summary>What does the warranty cover? <span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></summary><div class="body">Essential: 2-year unit + 1-year workmanship. Complete: 10-year parts + 2-year workmanship. Premium: 10-year parts + 3-year workmanship. All in addition to your Consumer Rights Act 2022 rights.</div></details>
   <details><summary>Can I cancel after booking? <span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></summary><div class="body">Yes — a 14-day cooling-off period applies if booked remotely (a text is fine). After 14 days, the deposit may be retained to cover costs incurred.</div></details>
   <details><summary>Do you cover my area? <span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></summary><div class="body">Dublin and surrounding areas. Call (1) 726 7941 and we'll confirm in 30 seconds.</div></details>
  </div>
 </div>
</section>

<!-- CONTACT -->
<section class="sec" id="contact">
 <div class="wrap">
  <div class="sec-head center reveal">
   <span class="eyebrow">Get started</span>
   <h2 class="big">Ready to protect your home?</h2>
   <p class="lead-p">Clear price. Installed within the week. No hard sell, ever.</p>
  </div>
  <div class="contact-grid">
   <div class="contact-card reveal">
    <h3>Speak to us now</h3>
    <p>Call or text — same-day response. Mon–Fri business hours. Urgent leaks, call any time.</p>
    <span class="phone">(1) 726 7941</span>
    <a href="tel:017267941" class="btn">Tap to Call Now</a>
    <div class="note">Price confirmed in writing · Full document pack included · No obligation</div>
   </div>
   <div class="qform reveal">
    <h3>Get a free quote</h3>
    <div class="field"><label>Your name</label><input type="text" id="qName" placeholder="Full name"></div>
    <div class="field"><label>Email</label><input type="email" id="qEmail" placeholder="So we can confirm your enquiry"></div>
    <div class="field"><label>Phone</label><input type="tel" id="qPhone" placeholder="Best number to reach you"></div>
    <div class="field" style="position:absolute;left:-9999px" aria-hidden="true"><label>Company</label><input type="text" id="qCompany" tabindex="-1" autocomplete="off"></div>
    <div class="field"><label>Which package?</label>
     <select id="qPkg">
      <option>Not sure — recommend one</option>
      <option>Essential — €1,450</option>
      <option>Complete — €1,895 (Recommended)</option>
      <option>Premium — €2,200</option>
     </select>
    </div>
    <div class="field"><label>When suits you?</label>
     <select id="qWhen"><option>This week</option><option>Within 2 weeks</option><option>Just researching</option></select>
    </div>
    <button class="btn btn-primary" id="qSend">Send My Enquiry →</button>
    <div id="qMsg" style="display:none;font-size:13.5px;margin-top:12px;padding:11px 14px;border-radius:10px"></div>
    <div class="fine"><span>✓ No obligation</span><span>✓ Price in writing</span><span>✓ Document pack included</span></div>
   </div>
  </div>
 </div>
</section>

<!-- PORTAL -->
<section class="sec" style="padding-top:0">
 <div class="wrap">
  <div class="portal reveal">
   <div>
    <h3>Already a ClearWater customer?</h3>
    <p>Log in to your customer portal to view your documents, check your warranty, request a salt top-up, and chat with our assistant.</p>
   </div>
   <a href="https://clear-water-nine.vercel.app/portal" class="btn">Go to Customer Portal →</a>
  </div>
 </div>
</section>

<!-- FOOTER -->
<footer>
 <div class="wrap">
  <div class="foot-grid">
   <div>
    <img class="logo" src="https://clear-water-nine.vercel.app/assets/clearwater-logo-C_XgsMZZ.png" alt="ClearWater Ireland"/>
    <p>Soft water. Sorted.<br>Water softener supply &amp; installation across Dublin and surrounding areas.</p>
    <p style="margin-top:12px"><a href="tel:017267941" style="color:var(--teal-x);font-weight:600">(1) 726 7941</a></p>
   </div>
   <div><h4>Services</h4><ul>
    <li><a href="#packages">Water Softener Installation</a></li>
    <li><a href="#packages">Essential — €1,450</a></li>
    <li><a href="#packages">Complete — €1,895</a></li>
    <li><a href="#packages">Premium — €2,200</a></li>
    <li><a href="#salt">Salt Supply Plan</a></li>
   </ul></div>
   <div><h4>Information</h4><ul>
    <li><a href="#how">How It Works</a></li>
    <li><a href="#calculator">Savings Calculator</a></li>
    <li><a href="#faq">FAQ</a></li>
    <li><a href="#why">Why ClearWater</a></li>
    <li><a href="#about">About Us</a></li>
   </ul></div>
   <div><h4>Customers</h4><ul>
    <li><a href="https://clear-water-nine.vercel.app/portal">Customer Portal</a></li>
    <li><a href="#contact">Get a Quote</a></li>
    <li><a href="tel:017267941">Call Us</a></li>
   </ul></div>
  </div>
  <div class="foot-bottom">
   <span>© 2026 ClearWater Ireland. All rights reserved.</span>
   <span style="display:flex;align-items:center;gap:14px">Governed by the laws of Ireland. <a href="https://automate-iq-two.vercel.app" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;color:#6b7d8c;font-size:11.5px">Powered by <b style="color:#9fb0bf;font-family:'Poppins',sans-serif;font-weight:600">AutomateIQ</b><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2E80F2" stroke-width="2"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke-linecap="round"/></svg></a></span>
  </div>
 </div>
</footer>

<!-- CHAT WIDGET -->
<button id="cw-launch" aria-label="Chat with ClearWater">
 <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.2 7.6L3 21l1.9-5.8A8.5 8.5 0 1 1 21 11.5z"/></svg>
</button>
<div id="cw-panel" role="dialog" aria-label="ClearWater assistant">
 <div class="cw-head">
  <span class="av"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s7 6 7 12a7 7 0 0 1-14 0c0-6 7-12 7-12z"/></svg></span>
  <div><b>ClearWater Assistant</b><span><span class="dot"></span> Online now</span></div>
  <button class="cw-x" aria-label="Close">&times;</button>
 </div>
 <div class="cw-body" id="cwBody"></div>
 <div class="cw-chips" id="cwChips"></div>
 <div class="cw-foot"><input id="cwInput" type="text" placeholder="Ask about packages, install, salt..." autocomplete="off"><button class="cw-send" id="cwSend" aria-label="Send">&#8594;</button></div>
</div>`;

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  useEffect(() => {

/* reveal */
try{(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.1});document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});})();}catch(e){document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});}

/* before/after slider (clip-path) */
try{(function(){
 var ba=document.getElementById('ba'),top=document.getElementById('baTop'),handle=document.getElementById('baHandle'),drag=false;
 if(!ba||!top||!handle)return;
 function set(x){var r=ba.getBoundingClientRect();var p=Math.max(0,Math.min(1,(x-r.left)/r.width));top.style.clipPath='inset(0 '+((1-p)*100)+'% 0 0)';handle.style.left=(p*100)+'%';}
 function down(){drag=true;} function up(){drag=false;}
 function move(e){if(!drag)return;var x=e.touches?e.touches[0].clientX:e.clientX;set(x);}
 handle.addEventListener('mousedown',down);window.addEventListener('mouseup',up);window.addEventListener('mousemove',move);
 handle.addEventListener('touchstart',down,{passive:true});window.addEventListener('touchend',up);window.addEventListener('touchmove',move,{passive:true});
 ba.addEventListener('click',function(e){set(e.clientX);});
})();}catch(e){}

/* savings calculator (with appliances) */
try{(function(){
 var people=document.getElementById('people'),bath=document.getElementById('bath'),boiler=document.getElementById('boiler'),hard=document.getElementById('hard');
 var clean=document.getElementById('clean'),apps=document.getElementById('apps'),cleanVal=297;
 if(!people)return;
 function euro(n){return '€'+Math.round(n).toLocaleString();}
 function appCount(){return apps?apps.querySelectorAll('.app.on').length:3;}
 function calc(){
  var p=+people.value,b=+bath.value,bo=+boiler.value,h=+hard.value,ac=appCount();
  document.getElementById('vPeople').textContent=p;document.getElementById('vBath').textContent=b;
  document.getElementById('vBoiler').textContent=bo;document.getElementById('vHard').textContent=h;
  var hf=h/300, pf=p/3;
  var cBoiler=320*hf*(1+Math.max(-0.3,Math.min(0.6,(bo-5)*0.04)));
  var cApp=120*ac*hf*(0.7+0.3*pf);
  var cClean=cleanVal*(0.7+pf*0.3);
  var cPlumb=150*hf;
  var cEnergy=95*hf*pf;
  var raw=cBoiler+cApp+cClean+cPlumb+cEnergy;
  var total=Math.max(200,Math.min(1600,raw));
  var k=raw>0?total/raw:1;
  document.getElementById('bBoiler').textContent=euro(cBoiler*k);
  document.getElementById('bApp').textContent=euro(cApp*k);
  document.getElementById('bClean').textContent=euro(cClean*k);
  document.getElementById('bPlumb').textContent=euro(cPlumb*k);
  document.getElementById('bEnergy').textContent=euro(cEnergy*k);
  document.getElementById('total').textContent=euro(total)+' / yr';
  document.getElementById('payback').textContent=(1895/total).toFixed(1)+' yrs';
  document.getElementById('tenyr').textContent=euro(total*10);
 }
 [people,bath,boiler,hard].forEach(function(s){s.addEventListener('input',calc);});
 if(clean)clean.addEventListener('click',function(e){if(!e.target.dataset.c)return;clean.querySelectorAll('.app').forEach(function(a){a.classList.remove('on');});e.target.classList.add('on');cleanVal=+e.target.dataset.c;calc();});
 if(apps)apps.addEventListener('click',function(e){if(!e.target.classList.contains('app'))return;e.target.classList.toggle('on');calc();});
 calc();
})();}catch(e){}

/* quote form -> Supabase edge function (saves lead + emails) */
try{(function(){
 var LEAD_ENDPOINT='https://jkevaiflwnodrhkdvtmm.supabase.co/functions/v1/submit-lead';
 var btn=document.getElementById('qSend');if(!btn)return;
 var msg=document.getElementById('qMsg');
 function show(text,ok){if(!msg)return;msg.style.display='block';msg.textContent=text;
  msg.style.background=ok?'rgba(0,122,124,.08)':'rgba(192,57,43,.08)';
  msg.style.color=ok?'#007A7C':'#c0392b';
  msg.style.border='1px solid '+(ok?'rgba(0,122,124,.3)':'rgba(192,57,43,.3)');}
 btn.addEventListener('click',function(){
  var name=(document.getElementById('qName').value||'').trim();
  var email=(document.getElementById('qEmail').value||'').trim();
  var phone=(document.getElementById('qPhone').value||'').trim();
  var company=(document.getElementById('qCompany')||{}).value||'';
  var pkg=document.getElementById('qPkg').value, when=document.getElementById('qWhen').value;
  if(!name||(!email&&!phone)){show('Please add your name and an email or phone so we can reach you.',false);return;}
  btn.disabled=true;var old=btn.textContent;btn.textContent='Sending…';
  fetch(LEAD_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({name:name,email:email,phone:phone,company:company,package:pkg,timeframe:when})})
  .then(function(r){return r.json().catch(function(){return {ok:r.ok};});})
  .then(function(d){
    if(d&&d.ok){show("Thanks "+name+" — we've got your enquiry and we'll be in touch shortly. Check your email for confirmation.",true);
     ['qName','qEmail','qPhone'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
     btn.textContent='Sent ✓';}
    else{show('Something went wrong sending that. Please call or text (1) 726 7941 and we’ll sort it.',false);btn.disabled=false;btn.textContent=old;}
  })
  .catch(function(){show('Couldn’t send right now. Please call or text (1) 726 7941.',false);btn.disabled=false;btn.textContent=old;});
 });
})();}catch(e){}

/* chat widget */
try{(function(){
 var launch=document.getElementById('cw-launch'),panel=document.getElementById('cw-panel'),body=document.getElementById('cwBody'),
     chips=document.getElementById('cwChips'),input=document.getElementById('cwInput'),send=document.getElementById('cwSend'),
     x=panel?panel.querySelector('.cw-x'):null,started=false;
 if(!launch||!panel)return;
 var KB=[
  {k:['which package','recommend','need','suit','best'],a:"Most homes go for Complete (\u20ac1,895) \u2014 it adds salt management, priority support and a 10-year parts warranty. Essential (\u20ac1,450) covers whole-home limescale protection; Premium (\u20ac2,200) adds a filtered drinking tap. Call (1) 726 7941 and we'll match you in 60 seconds."},
  {k:['cost','price','how much','pricing'],a:"Fixed prices, fully installed: Essential \u20ac1,450 \u00b7 Complete \u20ac1,895 \u00b7 Premium \u20ac2,200. No hidden costs, confirmed in writing."},
  {k:['how long','install take','time','hours'],a:"Installation takes 2\u20134 hours. An adult (18+) needs to be home, there's a brief water interruption, and we leave everything spotless."},
  {k:['warranty','cover','guarantee'],a:"Essential: 2-yr unit + 1-yr workmanship. Complete: 10-yr parts + 2-yr workmanship. Premium: 10-yr parts + 3-yr workmanship \u2014 all on top of your Consumer Rights Act 2022 rights."},
  {k:['salt','top up','top-up','refill'],a:"Our Salt Supply Plan tracks your usage and delivers the right salt to your door \u2014 no contract, pay per delivery. Roughly: 1\u20132 people monthly, 3\u20134 every 2\u20133 weeks, 5+ weekly."},
  {k:['drink','drinking','safe'],a:"Softened water is safe for most adults, but not for infant formula or low-sodium diets. Premium includes a filtered drinking tap at the kitchen sink \u2014 suitable for everyone."},
  {k:['area','cover','dublin','where','location'],a:"We cover Dublin and surrounding areas, usually with same-week availability. Call (1) 726 7941 and we'll confirm your area in 30 seconds."},
  {k:['book','quote','contact','get started','install'],a:"Easiest way: call or text (1) 726 7941 for a free quote, or fill in the 'Get a free quote' form on this page. Same-day response."}
 ];
 var FB="I can help with packages, pricing, installation, warranties or salt supply. For anything else, call or text (1) 726 7941 \u2014 same-day response.";
 var CH=[["Which package do I need?","which package do i need"],["How much does it cost?","how much does it cost"],["How long does install take?","how long does install take"],["What does the warranty cover?","what does the warranty cover"]];
 function add(t,w){var d=document.createElement('div');d.className='cw-msg '+(w==='u'?'cw-user':'cw-bot');d.textContent=t;body.appendChild(d);body.scrollTop=body.scrollHeight;}
 function ans(q){var s=q.toLowerCase();for(var i=0;i<KB.length;i++)for(var j=0;j<KB[i].k.length;j++)if(s.indexOf(KB[i].k[j])>-1)return KB[i].a;return FB;}
 function resp(q){add(q,'u');input.value='';setTimeout(function(){add(ans(q),'b');},340);}
 function rc(){chips.innerHTML='';CH.forEach(function(c){var b=document.createElement('button');b.className='cw-chip';b.textContent=c[0];b.onclick=function(){resp(c[1]);};chips.appendChild(b);});}
 function open(){panel.classList.add('open');launch.style.display='none';if(!started){started=true;add("Hi there \u2014 I'm the ClearWater assistant. I can help with packages, pricing, installation, warranties or salt supply. What would you like to know?",'b');rc();}setTimeout(function(){input.focus();},50);}
 function close(){panel.classList.remove('open');launch.style.display='grid';}
 launch.onclick=open;if(x)x.onclick=close;
 if(send)send.onclick=function(){var v=input.value.trim();if(v)resp(v);};
 if(input)input.addEventListener('keydown',function(e){if(e.key==='Enter'){var v=input.value.trim();if(v)resp(v);}});
})();}catch(e){}

  }, []);
  return <div className="cw-site js" dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />;
}
