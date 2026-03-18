import { useState, useRef, useCallback, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   AUTOTHUMB  ·  ULTRA PREMIUM
   Background : deep cosmic purple
   Loader     : radar sweep + orbiting dots
   Cards      : glassmorphism + gradient borders + hover lift + tilt
   Fonts      : Playfair Display · Syne
══════════════════════════════════════════════════════════════════════════ */

const MOCK_COMPETITORS = [
  { id:1,  title:"10 SECRETS YouTube Doesn't Want You to Know", views:"2.1M" },
  { id:2,  title:"How I Hit 1M Subs in 6 Months",              views:"984K" },
  { id:3,  title:"The PERFECT Thumbnail Formula (Proven)",      views:"1.7M" },
  { id:4,  title:"YouTube Algorithm EXPOSED 2024",              views:"3.2M" },
  { id:5,  title:"Why Your Videos Get NO Views (Fix This)",     views:"887K" },
  { id:6,  title:"Thumbnail Mistakes KILLING Your CTR",         views:"1.1M" },
  { id:7,  title:"I Tested 100 Thumbnails — Here's What Works", views:"756K" },
  { id:8,  title:"Stop Making These Errors NOW",                views:"2.4M" },
  { id:9,  title:"Color Psychology of High-CTR Thumbnails",     views:"612K" },
  { id:10, title:"My Thumbnail Process: 0 to 5% CTR",          views:"1.9M" },
];

async function analyzeWithClaude(b64, keyword) {
  const prompt = `You are AutoThumb — elite YouTube CTR intelligence engine.
Analyze this thumbnail for the keyword/title: "${keyword}"
Compare it against YouTube best practices from top creators with 1M+ views.
Return ONLY valid JSON (no markdown, no backticks, no extra text):
{
  "score": <0-100>,
  "grade": "<A+|A|B+|B|C+|C|D|F>",
  "summary": "<1 punchy verdict, max 15 words>",
  "breakdown": {
    "typography":    { "score": <0-25>, "note": "<specific 1-sentence observation>" },
    "colorContrast": { "score": <0-25>, "note": "<specific 1-sentence observation>" },
    "faceEmotion":   { "score": <0-25>, "note": "<specific 1-sentence observation>" },
    "standout":      { "score": <0-25>, "note": "<specific 1-sentence observation>" }
  },
  "fixes": [
    { "priority": "critical", "area": "<area>", "action": "<hyper-specific fix, max 14 words>" },
    { "priority": "critical", "area": "<area>", "action": "<hyper-specific fix, max 14 words>" },
    { "priority": "moderate", "area": "<area>", "action": "<hyper-specific fix, max 14 words>" },
    { "priority": "moderate", "area": "<area>", "action": "<hyper-specific fix, max 14 words>" },
    { "priority": "polish",   "area": "<area>", "action": "<hyper-specific fix, max 14 words>" }
  ],
  "strengths": ["<4 words max>","<4 words max>","<4 words max>"],
  "checklist": [
    { "category": "Text & Typography",  "item": "<what top YT thumbnails do, max 7 words>", "status": "<pass|fail|improve>", "detail": "<specific to THIS thumbnail, max 10 words>", "benchmark": "<what MrBeast/top creators do, max 10 words>" },
    { "category": "Color & Contrast",   "item": "<what top YT thumbnails do, max 7 words>", "status": "<pass|fail|improve>", "detail": "<specific to THIS thumbnail, max 10 words>", "benchmark": "<what MrBeast/top creators do, max 10 words>" },
    { "category": "Face & Emotion",     "item": "<what top YT thumbnails do, max 7 words>", "status": "<pass|fail|improve>", "detail": "<specific to THIS thumbnail, max 10 words>", "benchmark": "<what MrBeast/top creators do, max 10 words>" },
    { "category": "Composition",        "item": "<what top YT thumbnails do, max 7 words>", "status": "<pass|fail|improve>", "detail": "<specific to THIS thumbnail, max 10 words>", "benchmark": "<what MrBeast/top creators do, max 10 words>" },
    { "category": "Mobile Readability", "item": "<what top YT thumbnails do, max 7 words>", "status": "<pass|fail|improve>", "detail": "<specific to THIS thumbnail, max 10 words>", "benchmark": "<what MrBeast/top creators do, max 10 words>" },
    { "category": "Curiosity Gap",      "item": "<what top YT thumbnails do, max 7 words>", "status": "<pass|fail|improve>", "detail": "<specific to THIS thumbnail, max 10 words>", "benchmark": "<what MrBeast/top creators do, max 10 words>" },
    { "category": "Branding",           "item": "<what top YT thumbnails do, max 7 words>", "status": "<pass|fail|improve>", "detail": "<specific to THIS thumbnail, max 10 words>", "benchmark": "<what MrBeast/top creators do, max 10 words>" },
    { "category": "Competitor Edge",    "item": "<what top YT thumbnails do, max 7 words>", "status": "<pass|fail|improve>", "detail": "<specific to THIS thumbnail, max 10 words>", "benchmark": "<what MrBeast/top creators do, max 10 words>" }
  ]
}`;
  const res = await fetch("/api/analyze", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({image:b64, keyword, prompt})
  });
  if(!res.ok) throw new Error(await res.text());
  return await res.json();
}

/* ─── Palette ──────────────────────────────────────────────────────────── */
const C = {
  /* Deep purple cosmos */
  bg:    "#0B0718",
  bg1:   "#100D20",
  bg2:   "#16122A",
  bg3:   "#1E1A35",
  bg4:   "#261F42",
  /* Purple accents */
  purple:"#7C3AED",
  purpleL:"#A855F7",
  purpleD:"#4C1D95",
  purpleGlow:"rgba(124,58,237,0.35)",
  /* Gold */
  gold:  "#C9A84C",
  goldL: "#E8C96A",
  goldD: "#8A6B28",
  /* Glass */
  glassB:"rgba(255,255,255,0.04)",
  glassS:"rgba(255,255,255,0.07)",
  /* Borders */
  line:  "rgba(255,255,255,0.07)",
  lineP: "rgba(124,58,237,0.3)",
  lineG: "rgba(201,168,76,0.22)",
  /* Text */
  text:  "#F0EEFF",
  sub:   "#8B82AD",
  muted: "#4A4468",
};

/* ─── Global CSS ───────────────────────────────────────────────────────── */
const GCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#0B0718;color:#F0EEFF;font-family:'Inter',sans-serif;overflow-x:hidden}
::selection{background:rgba(124,58,237,.3);color:#fff}

/* Grain overlay */
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9998;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.032;mix-blend-mode:overlay}

/* Scrollbar */
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:#100D20}
::-webkit-scrollbar-thumb{background:linear-gradient(#7C3AED,#C9A84C);border-radius:2px}

/* ── Keyframes ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes shimmer{from{background-position:-300% 0}to{background-position:300% 0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes spinR{to{transform:rotate(-360deg)}}
@keyframes radarSweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes dotPulse{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}
@keyframes ringPulse{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.3;transform:scale(1.04)}}
@keyframes barGrow{from{width:0}to{width:var(--w,0%)}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes glowPulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.9;transform:scale(1.08)}}
@keyframes borderRotate{from{--angle:0deg}to{--angle:360deg}}
@keyframes progBar{from{width:2%}to{width:91%}}
@keyframes scanPing{0%{transform:scale(.2);opacity:1}100%{transform:scale(2.5);opacity:0}}
@keyframes scanLine{0%,100%{transform:translateY(-40px);opacity:0}50%{transform:translateY(40px);opacity:1}}
@keyframes gradeIn{from{opacity:0;transform:scale(.5) translateY(4px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes neonGlowAnim{
  0%,100%{opacity:.7;transform:scale(1)}
  50%{opacity:1;transform:scale(1.008)}
}
@keyframes neonCorner{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}

/* ── Utility ── */
.fu {animation:fadeUp .6s cubic-bezier(.16,1,.3,1) both}
.fu1{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .08s both}
.fu2{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .16s both}
.fu3{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .24s both}
.fu4{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .32s both}
.fu5{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .40s both}

.shimmer-gold{
  background:linear-gradient(90deg,#8A6B28 0%,#E8C96A 35%,#fff8e8 50%,#E8C96A 65%,#8A6B28 100%);
  background-size:300% auto;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  animation:shimmer 4s linear infinite}

.shimmer-purple{
  background:linear-gradient(90deg,#4C1D95 0%,#A855F7 40%,#E0BBFF 55%,#A855F7 70%,#4C1D95 100%);
  background-size:300% auto;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  animation:shimmer 3s linear infinite}

/* ── Glass card system ── */
.gcard{
  position:relative;
  background:linear-gradient(135deg,rgba(255,255,255,.055) 0%,rgba(124,58,237,.05) 50%,rgba(255,255,255,.02) 100%);
  border:1px solid rgba(255,255,255,.08);
  backdrop-filter:blur(20px) saturate(160%);
  -webkit-backdrop-filter:blur(20px) saturate(160%);
  border-radius:16px;
  transition:transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease, border-color .25s ease;
  will-change:transform}

.gcard:hover{
  transform:translateY(-4px) scale(1.012);
  box-shadow:0 24px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(124,58,237,.25), 0 0 40px rgba(124,58,237,.08) inset;
  border-color:rgba(124,58,237,.3)}

/* Gradient border pseudo glow on hover */
.gcard::before{
  content:'';position:absolute;inset:-1px;border-radius:17px;
  background:linear-gradient(135deg,rgba(124,58,237,0),rgba(201,168,76,0),rgba(124,58,237,0));
  z-index:-1;opacity:0;transition:opacity .3s}
.gcard:hover::before{
  background:linear-gradient(135deg,rgba(124,58,237,.5),rgba(201,168,76,.3),rgba(168,85,247,.4));
  opacity:1}

.gcard-gold{
  background:linear-gradient(135deg,rgba(201,168,76,.08) 0%,rgba(124,58,237,.04) 60%,rgba(201,168,76,.04) 100%);
  border:1px solid rgba(201,168,76,.2)}
.gcard-gold:hover{
  transform:translateY(-4px) scale(1.012);
  box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 0 1px rgba(201,168,76,.3),0 0 40px rgba(201,168,76,.06) inset;
  border-color:rgba(201,168,76,.4)}
.gcard-gold::before{display:none}

/* Fix cards */
.fix-critical{border-left:2.5px solid #FF5577 !important}
.fix-moderate{border-left:2.5px solid #FF9F45 !important}
.fix-polish{border-left:2.5px solid #C9A84C !important}

/* Tab underline */
.tab-btn{position:relative;transition:color .2s;border:none;background:none;cursor:pointer;font-family:'Inter',sans-serif;padding:10px 20px;font-size:13px;font-weight:600;letter-spacing:.04em}
.tab-btn::after{content:'';position:absolute;bottom:-1px;left:20px;right:20px;height:2px;
  background:linear-gradient(90deg,#7C3AED,#C9A84C);border-radius:1px;
  transform:scaleX(0);transition:transform .28s cubic-bezier(.4,0,.2,1)}
.tab-btn.active::after{transform:scaleX(1)}
.tab-btn.active{color:#E8C96A !important}

/* Inputs */
.at-input{
  width:100%;padding:15px 18px;border-radius:12px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.07);
  color:#F0EEFF;font-family:'Inter',sans-serif;font-size:14px;outline:none;
  transition:border-color .2s,box-shadow .2s,background .2s}
.at-input:focus{
  background:rgba(124,58,237,.06);
  border-color:rgba(124,58,237,.5);
  box-shadow:0 0 0 3px rgba(124,58,237,.1),0 0 20px rgba(124,58,237,.05) inset}
.at-input::placeholder{color:#4A4468}

/* CTA */
.cta-btn{
  width:100%;padding:17px 28px;border:none;border-radius:12px;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:14px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;
  background:linear-gradient(135deg,#6D28D9 0%,#7C3AED 30%,#A855F7 60%,#C9A84C 100%);
  background-size:200% 100%;
  color:#fff;position:relative;overflow:hidden;
  transition:transform .15s,box-shadow .2s,background-position .4s;
  box-shadow:0 4px 28px rgba(124,58,237,.35),0 1px 0 rgba(255,255,255,.12) inset}
.cta-btn::before{content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.15) 50%,transparent 100%);
  transform:translateX(-100%);transition:transform .6s}
.cta-btn:hover::before{transform:translateX(100%)}
.cta-btn:hover{transform:translateY(-2px);background-position:100% 0;
  box-shadow:0 8px 40px rgba(124,58,237,.45),0 0 0 1px rgba(168,85,247,.3),0 1px 0 rgba(255,255,255,.12) inset}
.cta-btn:active{transform:scale(.99)}

/* Ghost btn */
.ghost-btn{
  padding:12px 30px;border-radius:12px;cursor:pointer;
  background:rgba(124,58,237,.08);
  border:1px solid rgba(124,58,237,.25);
  color:#A855F7;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;
  letter-spacing:.05em;transition:all .22s}
.ghost-btn:hover{background:rgba(124,58,237,.16);border-color:rgba(168,85,247,.5);
  box-shadow:0 0 20px rgba(124,58,237,.15);color:#C084FC}

/* Metric bar */
.mbar-fill{height:100%;border-radius:3px;animation:barGrow .9s cubic-bezier(.4,0,.2,1) var(--del,.1s) both}

/* Ring arc */
.ring-arc{transition:stroke-dasharray 1.5s cubic-bezier(.4,0,.2,1) .25s}

/* Comp card */
.comp-card{transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s}
.comp-card:hover{transform:scale(1.06);box-shadow:0 8px 24px rgba(0,0,0,.4)}

/* Strength pill */
.s-pill{
  font-size:11px;padding:5px 13px;border-radius:20px;font-weight:600;
  background:linear-gradient(135deg,rgba(124,58,237,.15),rgba(201,168,76,.1));
  border:1px solid rgba(168,85,247,.2);color:#C084FC;
  transition:all .2s}
.s-pill:hover{background:linear-gradient(135deg,rgba(124,58,237,.25),rgba(201,168,76,.15));
  border-color:rgba(168,85,247,.4);transform:translateY(-1px)}
`;

function GlobalStyles(){
  useEffect(()=>{
    const el=document.createElement("style");
    el.textContent=GCSS;
    document.head.appendChild(el);
    return()=>el.remove();
  },[]);
  return null;
}

/* ─── Ambient background ───────────────────────────────────────────────── */
function AmbientBg(){
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {/* Main purple nebula */}
      <div style={{position:"absolute",top:"-15%",left:"30%",width:700,height:700,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(124,58,237,.18) 0%,rgba(76,29,149,.08) 40%,transparent 70%)",
        filter:"blur(40px)"}}/>
      {/* Gold accent bottom */}
      <div style={{position:"absolute",bottom:"-10%",right:"-5%",width:500,height:500,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(201,168,76,.08) 0%,transparent 60%)",
        filter:"blur(30px)"}}/>
      {/* Cool blue left */}
      <div style={{position:"absolute",top:"40%",left:"-8%",width:400,height:400,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(59,130,246,.06) 0%,transparent 60%)",
        filter:"blur(30px)"}}/>
      {/* Grid dots */}
      <div style={{position:"absolute",inset:0,
        backgroundImage:"radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px)",
        backgroundSize:"40px 40px",opacity:.6}}/>
    </div>
  );
}

/* ─── Corner marks ─────────────────────────────────────────────────────── */
function Corners({color="rgba(201,168,76,.4)",size=14}){
  const s=p=>({position:"absolute",width:size,height:size,...p});
  const b=`1px solid ${color}`;
  return(<>
    <span style={s({top:0,left:0,borderTop:b,borderLeft:b})}/>
    <span style={s({top:0,right:0,borderTop:b,borderRight:b})}/>
    <span style={s({bottom:0,left:0,borderBottom:b,borderLeft:b})}/>
    <span style={s({bottom:0,right:0,borderBottom:b,borderRight:b})}/>
  </>);
}

/* ─── THUMBNAIL SCANNER LOADER ──────────────────────────────────────────── */
function RadarLoader({image}){
  const STEPS=[
    "Fetching competitor data…",
    "Scanning text & typography…",
    "Detecting face & emotion…",
    "Analyzing color contrast…",
    "Computing CTR score…",
  ];
  const COLORS=["#A855F7","#E8A030","#E858A0","#5BA8E8","#C9A84C"];
  const [step,setStep]=useState(0);
  const [pct,setPct]=useState(0);
  const [lineY,setLineY]=useState(0);

  useEffect(()=>{
    const t1=setInterval(()=>setStep(s=>Math.min(s+1,4)),2500);
    const t2=setInterval(()=>setPct(p=>Math.min(p+1,93)),130);
    return()=>{clearInterval(t1);clearInterval(t2)};
  },[]);

  useEffect(()=>{
    let raf;
    const tick=(ts)=>{
      setLineY((ts/20)%100);
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[]);

  const color=COLORS[step];

  return(
    <div style={{minHeight:"78vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28,padding:"0 24px"}}>

      {/* Thumbnail frame */}
      <div style={{
        position:"relative",
        width:"100%",maxWidth:520,
        borderRadius:16,
        border:`2px solid ${color}`,
        boxShadow:`0 0 8px ${color}, 0 0 28px ${color}88, 0 0 60px ${color}33`,
        overflow:"hidden",
        aspectRatio:"16/9",
        background:"#0d0d1a",
        transition:"border-color .5s, box-shadow .5s",
      }}>

        {/* Image */}
        {image&&(
          <img src={image} alt="thumbnail"
            style={{width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"brightness(.8)"}}/>
        )}

        {/* Dark overlay */}
        <div style={{position:"absolute",inset:0,background:"rgba(8,7,24,.3)",pointerEvents:"none"}}/>

        {/* Scan line */}
        <div style={{
          position:"absolute",left:0,right:0,
          top:lineY+"%",height:"2px",
          background:`linear-gradient(90deg,transparent,${color},transparent)`,
          boxShadow:`0 0 10px ${color}, 0 0 20px ${color}`,
          zIndex:3,pointerEvents:"none",
          transition:"background .5s",
        }}/>

        {/* Corner marks — top left */}
        <div style={{position:"absolute",top:10,left:10,width:18,height:18,borderTop:`2px solid ${color}`,borderLeft:`2px solid ${color}`,borderRadius:2,zIndex:4}}/>
        {/* top right */}
        <div style={{position:"absolute",top:10,right:10,width:18,height:18,borderTop:`2px solid ${color}`,borderRight:`2px solid ${color}`,borderRadius:2,zIndex:4}}/>
        {/* bottom left */}
        <div style={{position:"absolute",bottom:10,left:10,width:18,height:18,borderBottom:`2px solid ${color}`,borderLeft:`2px solid ${color}`,borderRadius:2,zIndex:4}}/>
        {/* bottom right */}
        <div style={{position:"absolute",bottom:10,right:10,width:18,height:18,borderBottom:`2px solid ${color}`,borderRight:`2px solid ${color}`,borderRadius:2,zIndex:4}}/>

        {/* SCANNING badge */}
        <div style={{
          position:"absolute",top:12,right:12,zIndex:5,
          display:"flex",alignItems:"center",gap:5,
          background:"rgba(8,7,24,.85)",
          border:`1px solid ${color}55`,
          borderRadius:20,padding:"4px 11px",
        }}>
          <div style={{width:6,height:6,borderRadius:"50%",background:color,animation:"dotPulse 1s ease-in-out infinite"}}/>
          <span style={{fontSize:10,fontWeight:700,color,letterSpacing:".06em"}}>SCANNING</span>
        </div>
      </div>

      {/* Step text */}
      <div style={{textAlign:"center"}}>
        <p style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:4}}>{STEPS[step]}</p>
        <p style={{fontSize:12,color:C.muted}}>Step {step+1} of 5</p>
      </div>

      {/* Progress */}
      <div style={{width:"100%",maxWidth:520}}>
        <div style={{height:3,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
          <div style={{
            height:"100%",width:pct+"%",borderRadius:2,
            background:`linear-gradient(90deg,#7C3AED,${color})`,
            boxShadow:`0 0 8px ${color}`,
            transition:"width .13s linear, background .5s",
          }}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
          <span style={{fontSize:11,color:C.muted}}>Analyzing…</span>
          <span style={{fontSize:11,fontWeight:700,color}}>{pct}%</span>
        </div>
      </div>
    </div>
  );
}

/* ─── CountUpScore (inside ring) ───────────────────────────────────────── */
function CountUpScore({target,col,grade}){
  const val=useCountUp(target,1200,200);
  return(
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1}}>
      <span style={{fontSize:40,fontWeight:800,lineHeight:1,
        background:"linear-gradient(135deg,#A855F7,#C9A84C)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
        {val}
      </span>
      <span style={{fontSize:10,color:C.muted,letterSpacing:".1em",textTransform:"uppercase"}}>score</span>
      <span style={{fontSize:20,fontWeight:700,color:col,marginTop:3,
        animation:"gradeIn .4s cubic-bezier(.34,1.56,.64,1) 1.3s both"}}>{grade}</span>
    </div>
  );
}

/* ─── Score ring ────────────────────────────────────────────────────────── */
function ScoreRing({score}){
  const r=58, circ=2*Math.PI*r;
  const pct=Math.max(0,Math.min(100,score));
  const arc=(pct/100)*circ;
  const col=pct>=75?"#C9A84C":pct>=50?"#A855F7":pct>=30?"#FF9F45":"#FF5577";
  const grade=pct>=90?"A+":pct>=80?"A":pct>=70?"B+":pct>=60?"B":pct>=50?"C+":pct>=40?"C":pct>=30?"D":"F";
  return(
    <div style={{position:"relative",width:154,height:154,flexShrink:0}}>
      <svg width="154" height="154" style={{transform:"rotate(-90deg)"}}>
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED"/>
            <stop offset="60%" stopColor="#A855F7"/>
            <stop offset="100%" stopColor="#C9A84C"/>
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx="77" cy="77" r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="10"/>
        {/* Glow */}
        <circle cx="77" cy="77" r={r} fill="none" stroke={col} strokeWidth="16"
          strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" opacity=".12"/>
        {/* Arc */}
        <circle className="ring-arc" cx="77" cy="77" r={r} fill="none"
          stroke="url(#arcGrad)" strokeWidth="7"
          strokeDasharray={`${arc} ${circ}`} strokeLinecap="round"
          style={{filter:`drop-shadow(0 0 8px rgba(168,85,247,.7))`}}/>
      </svg>
      <CountUpScore target={pct} col={col} grade={grade}/>
    </div>
  );
}

/* ─── Metric bar ────────────────────────────────────────────────────────── */
function MetricBar({label,value,max=25,color,note,delay=0}){
  const pct=Math.round((value/max)*100);
  return(
    <div className="gcard" style={{borderRadius:12,padding:"13px 16px",animationDelay:`${delay}s`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:11}}>
        <span style={{fontSize:11,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",color:C.sub}}>{label}</span>
        <span style={{fontFamily:"'Inter',sans-serif",fontSize:22,fontWeight:700,
          background:`linear-gradient(135deg,${color},${color}99)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          {value}<span style={{fontSize:12,color:C.muted,WebkitTextFillColor:C.muted}}>/25</span>
        </span>
      </div>
      <div style={{height:5,background:"rgba(255,255,255,.05)",borderRadius:3,overflow:"hidden",marginBottom:11,position:"relative"}}>
        <div className="mbar-fill" style={{
          "--w":`${pct}%`,"--del":`${delay+.15}s`,
          background:`linear-gradient(90deg,${color}55,${color})`,
          boxShadow:`0 0 12px ${color}66`,
        }}/>
      </div>
    </div>
  );
}

/* ─── Priority badge ────────────────────────────────────────────────────── */
function Badge({p}){
  const m={
    critical:{bg:"rgba(255,85,119,.12)",color:"#FF7799",label:"Critical",border:"rgba(255,85,119,.25)"},
    moderate:{bg:"rgba(255,159,69,.12)", color:"#FFB347",label:"Moderate",border:"rgba(255,159,69,.25)"},
    polish:  {bg:"rgba(201,168,76,.12)", color:"#C9A84C",label:"Polish",  border:"rgba(201,168,76,.25)"},
  };
  const s=m[p]||m.polish;
  return(
    <span style={{fontSize:10,fontWeight:800,letterSpacing:".08em",textTransform:"uppercase",
      color:s.color,background:s.bg,border:`1px solid ${s.border}`,padding:"3px 8px",borderRadius:5}}>
      {s.label}
    </span>
  );
}

/* ─── Competitor grid ───────────────────────────────────────────────────── */
// Picsum IDs that look like real content (landscape, people, tech)
const PICSUM_IDS=[10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200];

function CompetitorGrid({userImage,keyword}){
  const [pos]=useState(()=>Math.floor(Math.random()*10));
  const [ids]=useState(()=>[...PICSUM_IDS].sort(()=>Math.random()-.5).slice(0,10));
  const comps=[...MOCK_COMPETITORS];
  comps.splice(pos,0,{id:"u",title:keyword||"Your Thumbnail",isUser:true});

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:C.gold,boxShadow:`0 0 10px ${C.gold}`,animation:"glowPulse 2s ease-in-out infinite"}}/>
        <span style={{fontSize:12,color:C.sub}}>
          Your thumbnail among top results for{" "}
          <strong style={{color:C.text,fontWeight:600}}>"{keyword}"</strong>
        </span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9}}>
        {comps.map((c,i)=>{
          const picsumId=ids[i%ids.length];
          return(
            <div key={c.id} className="comp-card" style={{
              borderRadius:9,overflow:"hidden",aspectRatio:"16/9",position:"relative",
              border:c.isUser?`2px solid ${C.gold}`:`1px solid rgba(255,255,255,.06)`,
              boxShadow:c.isUser?`0 0 28px rgba(201,168,76,.35), 0 0 60px rgba(201,168,76,.1)`:"none",
            }}>
              {c.isUser?(
                <>
                  <img src={userImage} alt="You" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  <div style={{position:"absolute",top:5,right:5,
                    background:"linear-gradient(135deg,#C9A84C,#E8C96A)",
                    borderRadius:4,padding:"2px 7px",fontSize:8,fontWeight:800,
                    color:"#0A0800",letterSpacing:".08em",
                    boxShadow:"0 0 10px rgba(201,168,76,.5)"}}>YOU</div>
                </>
              ):(
                <>
                  {/* Real photo from picsum */}
                  <img
                    src={`https://picsum.photos/id/${picsumId}/480/270`}
                    alt={c.title}
                    style={{width:"100%",height:"100%",objectFit:"cover",display:"block",
                      filter:"brightness(.75) saturate(1.1)"}}
                    onError={e=>{
                      e.target.style.display="none";
                      e.target.nextSibling.style.display="flex";
                    }}
                  />
                  {/* Fallback color block */}
                  <div style={{display:"none",position:"absolute",inset:0,
                    background:`linear-gradient(135deg,hsl(${i*36},50%,20%),hsl(${i*36+40},40%,15%))`}}/>
                  {/* Title overlay at bottom */}
                  <div style={{
                    position:"absolute",bottom:0,left:0,right:0,
                    padding:"18px 7px 6px",
                    background:"linear-gradient(to top,rgba(0,0,0,.82) 0%,transparent 100%)",
                  }}>
                    <p style={{fontSize:8,color:"rgba(255,255,255,.9)",lineHeight:1.3,fontWeight:600,
                      overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                      {c.title}
                    </p>
                    <p style={{fontSize:7,color:"rgba(255,255,255,.45)",marginTop:2}}>{c.views} views</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Platform preview ──────────────────────────────────────────────────── */
function PlatformPreview({image}){
  const [mode,setMode]=useState("mobile");
  const [dark,setDark]=useState(true);
  const bg=dark?"#0f0f0f":"#fff";
  const txt=dark?"#fff":"#0f0f0f";
  const sub=dark?"#aaa":"#606060";
  const card=dark?"#1a1a1a":"#f2f2f2";
  const bdr=dark?"rgba(255,255,255,.07)":"rgba(0,0,0,.08)";
  const modes=[{k:"mobile",l:"Mobile"},{k:"desktop",l:"Desktop"},{k:"tv",l:"Smart TV"}];
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:6}}>
          {modes.map(m=>(
            <button key={m.k} onClick={()=>setMode(m.k)} style={{
              padding:"7px 16px",borderRadius:8,fontSize:12,fontWeight:700,
              cursor:"pointer",fontFamily:"'Inter',sans-serif",letterSpacing:".04em",border:"none",
              transition:"all .2s",
              background:mode===m.k?"linear-gradient(135deg,#7C3AED,#C9A84C)":"rgba(255,255,255,.04)",
              color:mode===m.k?"#fff":C.muted,
              outline:mode!==m.k?`1px solid rgba(255,255,255,.07)`:"none",
              boxShadow:mode===m.k?"0 4px 16px rgba(124,58,237,.3)":"none",
            }}>{m.l}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,color:C.sub}}>
          <span>Dark</span>
          <div onClick={()=>setDark(d=>!d)} style={{
            width:40,height:22,borderRadius:11,cursor:"pointer",position:"relative",
            background:dark?"linear-gradient(135deg,#7C3AED,#A855F7)":"rgba(255,255,255,.07)",
            border:dark?"1px solid rgba(168,85,247,.4)":"1px solid rgba(255,255,255,.1)",
            transition:"all .2s",
          }}>
            <div style={{position:"absolute",top:3,left:dark?20:3,width:14,height:14,borderRadius:7,
              background:dark?"#fff":"rgba(255,255,255,.4)",transition:"left .2s",
              boxShadow:dark?"0 0 8px rgba(168,85,247,.5)":"none"}}/>
          </div>
          <span>Light</span>
        </div>
      </div>
      <div style={{background:bg,borderRadius:12,padding:18,border:`1px solid ${bdr}`,transition:"background .3s"}}>
        {mode==="mobile"&&(
          <div style={{maxWidth:260,margin:"0 auto"}}>
            <div style={{background:card,borderRadius:10,overflow:"hidden",border:`1px solid ${bdr}`}}>
              <img src={image} style={{width:"100%",aspectRatio:"16/9",objectFit:"cover",display:"block"}}/>
              <div style={{padding:"10px 12px"}}>
                <p style={{fontSize:12,fontWeight:600,color:txt,lineHeight:1.4}}>Your video title goes here</p>
                <p style={{fontSize:10,color:sub,marginTop:4}}>Your Channel · 1.2K views · 2 days ago</p>
              </div>
            </div>
          </div>
        )}
        {mode==="desktop"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{background:card,borderRadius:8,overflow:"hidden",border:`1px solid ${bdr}`}}>
                {i===1?<img src={image} style={{width:"100%",aspectRatio:"16/9",objectFit:"cover",display:"block"}}/>
                  :<div style={{width:"100%",aspectRatio:"16/9",background:dark?"#2a2a2a":"#ddd"}}/>}
                <div style={{padding:"8px 10px"}}>
                  <p style={{fontSize:11,fontWeight:600,color:txt,lineHeight:1.4}}>{i===1?"Your thumbnail":"Competitor video"}</p>
                  <p style={{fontSize:10,color:sub,marginTop:3}}>Channel · 12K views</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {mode==="tv"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:18}}>
            <div>
              <img src={image} style={{width:"100%",aspectRatio:"16/9",objectFit:"cover",borderRadius:6,display:"block"}}/>
              <p style={{color:txt,fontWeight:600,fontSize:15,marginTop:10}}>Your video title</p>
              <p style={{color:sub,fontSize:12,marginTop:4}}>Your Channel · 1.2K views</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[1,2,3,4].map(i=>(
                <div key={i} style={{display:"flex",gap:10}}>
                  <div style={{width:90,aspectRatio:"16/9",background:dark?"#2a2a2a":"#ddd",borderRadius:4,flexShrink:0}}/>
                  <div>
                    <p style={{fontSize:11,fontWeight:600,color:txt,lineHeight:1.3}}>Related video {i}</p>
                    <p style={{fontSize:10,color:sub,marginTop:2}}>Channel · 5K views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ─── Count-up hook ─────────────────────────────────────────────────────── */
function useCountUp(target, duration=1400, delay=300){
  const [val,setVal]=useState(0);
  useEffect(()=>{
    const timer=setTimeout(()=>{
      const start=performance.now();
      const step=ts=>{
        const p=Math.min((ts-start)/duration,1);
        const ease=1-Math.pow(1-p,3);
        setVal(Math.round(ease*target));
        if(p<1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },delay);
    return()=>clearTimeout(timer);
  },[target]);
  return val;
}

/* ─── YouTube Thumbnails — Picsum-backed, always visible ────────────────── */

/* ─── YouTube CTR Checklist ─────────────────────────────────────────────── */
// Calls Claude with the thumbnail image + keyword to generate a YouTube-standard
// checklist comparing against top thumbnail best practices.


const CAT_COLORS = {
  "Text & Typography":  "#E8A030",
  "Color & Contrast":   "#5BA8E8",
  "Face & Emotion":     "#E858A0",
  "Composition":        "#A855F7",
  "Mobile Readability": "#44CC88",
  "Curiosity Gap":      "#FF6B6B",
  "Branding":           "#C9A84C",
  "Competitor Edge":    "#60C8FF",
};

const STATUS_CFG = {
  pass:    {icon:"✓", color:"#44CC88", bg:"rgba(68,204,136,.12)",  border:"rgba(68,204,136,.28)",  label:"Pass"},
  fail:    {icon:"✕", color:"#FF5577", bg:"rgba(255,85,119,.12)",  border:"rgba(255,85,119,.28)",  label:"Fix"},
  improve: {icon:"◐", color:"#FFB347", bg:"rgba(255,179,71,.12)",  border:"rgba(255,179,71,.28)",  label:"Improve"},
};

function YouTubeCTRChecklist({checklist}){
  const [expanded,setExpanded]=useState(null);
  if(!checklist||checklist.length===0) return null;

  const CAT_ICON={
    "Text & Typography":"T",
    "Color & Contrast":"C",
    "Face & Emotion":"F",
    "Composition":"⊞",
    "Mobile Readability":"M",
    "Curiosity Gap":"?",
    "Branding":"B",
    "Competitor Edge":"★",
  };

  const pass=checklist.filter(c=>c.status==="pass").length;
  const fail=checklist.filter(c=>c.status==="fail").length;
  const improve=checklist.filter(c=>c.status==="improve").length;

  return(
    <div style={{marginTop:28}}>

      {/* Header — just a label + 3 counts */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:C.muted}}>
          CTR Checklist
        </span>
        <div style={{display:"flex",gap:16}}>
          <span style={{fontSize:13,color:"#44CC88",fontWeight:700}}>{pass} pass</span>
          <span style={{fontSize:13,color:"#FF5577",fontWeight:700}}>{fail} fix</span>
          <span style={{fontSize:13,color:"#FFB347",fontWeight:700}}>{improve} improve</span>
        </div>
      </div>

      {/* 2-column icon grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        {checklist.map((item,i)=>{
          const cfg=STATUS_CFG[item.status]||STATUS_CFG.improve;
          const catColor=CAT_COLORS[item.category]||C.sub;
          const icon=CAT_ICON[item.category]||"•";
          const isOpen=expanded===i;
          return(
            <div key={i} onClick={()=>setExpanded(isOpen?null:i)}
              style={{
                borderRadius:14,padding:"16px 16px",cursor:"pointer",
                background:isOpen?`${cfg.color}0E`:"rgba(255,255,255,.025)",
                border:`1px solid ${isOpen?cfg.color+"40":"rgba(255,255,255,.06)"}`,
                transition:"all .18s",
                animation:`fadeUp .35s cubic-bezier(.16,1,.3,1) ${i*.04}s both`,
              }}
              onMouseEnter={e=>{e.currentTarget.style.background=`${cfg.color}0E`;e.currentTarget.style.borderColor=`${cfg.color}30`;}}
              onMouseLeave={e=>{if(!isOpen){e.currentTarget.style.background="rgba(255,255,255,.025)";e.currentTarget.style.borderColor="rgba(255,255,255,.06)";}}}
            >
              {/* Top: icon circle + status dot */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                {/* Category icon */}
                <div style={{
                  width:36,height:36,borderRadius:9,
                  background:`${catColor}18`,
                  border:`1px solid ${catColor}30`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:15,fontWeight:800,color:catColor,
                }}>{icon}</div>

                {/* Status indicator */}
                <div style={{
                  width:26,height:26,borderRadius:7,
                  background:cfg.bg,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:12,fontWeight:800,color:cfg.color,
                }}>{cfg.icon}</div>
              </div>

              {/* Category label */}
              <p style={{fontSize:11,fontWeight:700,color:catColor,marginBottom:4,letterSpacing:"0"}}>
                {item.category}
              </p>

              {/* Item — short, readable */}
              <p style={{fontSize:14,fontWeight:600,color:C.text,lineHeight:1.4,margin:0}}>
                {item.item}
              </p>

              {/* Expanded detail */}
              {isOpen&&(
                <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,.06)",animation:"fadeIn .15s ease both"}}>
                  <p style={{fontSize:13,color:C.sub,lineHeight:1.55,margin:0}}>{item.detail}</p>
                  {item.benchmark&&(
                    <p style={{fontSize:13,color:cfg.color,marginTop:7,fontWeight:500}}>
                      ▶ {item.benchmark}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ─── Results page ──────────────────────────────────────────────────────── */
function ResultsPage({result,image,b64,keyword,onReUpload}){
  const [tab,setTab]=useState("analysis");
  const {score,summary,breakdown,fixes,strengths}=result;

  const metrics=[
    {key:"typography",    label:"Typography",       color:"#E8A030"},
    {key:"colorContrast", label:"Color & Contrast", color:"#5BA8E8"},
    {key:"faceEmotion",   label:"Face & Emotion",   color:"#E858A0"},
    {key:"standout",      label:"Stand-out Power",  color:"#A855F7"},
  ];
  const tabs=[
    {k:"analysis",    l:"AI Analysis"},
    {k:"competitors", l:"Competitor Grid"},
    {k:"preview",     l:"Platform Preview"},
  ];
  const pClass={critical:"fix-critical",moderate:"fix-moderate",polish:"fix-polish"};

  return(
    <div style={{animation:"fadeUp .6s cubic-bezier(.16,1,.3,1) both"}}>

      {/* ── Score hero ── */}
      <div className="gcard gcard-gold" style={{borderRadius:20,padding:32,marginBottom:22,position:"relative",overflow:"hidden"}}>
        <Corners color="rgba(201,168,76,.35)" size={18}/>
        {/* Purple glow top right */}
        <div style={{position:"absolute",top:-80,right:-80,width:280,height:280,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(124,58,237,.15),transparent 65%)",pointerEvents:"none"}}/>
        {/* Gold glow bottom left */}
        <div style={{position:"absolute",bottom:-60,left:-60,width:200,height:200,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(201,168,76,.1),transparent 65%)",pointerEvents:"none"}}/>

        <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap",position:"relative"}}>
          <ScoreRing score={score}/>
          <div style={{flex:1,minWidth:220}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <span style={{fontSize:10,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",
                background:"linear-gradient(90deg,#A855F7,#C9A84C)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                CTR Score
              </span>
              <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,rgba(168,85,247,.3),rgba(201,168,76,.2),transparent)"}}/>
            </div>
            <p style={{fontSize:13,color:C.sub,marginBottom:12,lineHeight:1.5}}>{summary}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {strengths?.map((s,i)=>(
                <span key={i} className="s-pill">✦ {s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{display:"flex",borderBottom:`1px solid rgba(255,255,255,.07)`,marginBottom:22}}>
        {tabs.map(t=>(
          <button key={t.k} className={`tab-btn ${tab===t.k?"active":""}`}
            onClick={()=>setTab(t.k)} style={{color:tab===t.k?C.goldL:C.muted}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* ── Analysis ── */}
      {tab==="analysis"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {metrics.map((m,i)=>{
            const d=breakdown?.[m.key];
            return <MetricBar key={m.key} label={m.label} value={d?.score??0} color={m.color} note={d?.note} delay={i*.09}/>;
          })}
        </div>
      )}

      {tab==="competitors"&&(
        <div className="gcard fu" style={{borderRadius:18,padding:24}}>
          <CompetitorGrid userImage={image} keyword={keyword}/>
        </div>
      )}

      {tab==="preview"&&(
        <div className="gcard fu" style={{borderRadius:18,padding:24}}>
          <PlatformPreview image={image}/>
        </div>
      )}

      <YouTubeCTRChecklist checklist={result.checklist}/>

      <div style={{marginTop:24,display:"flex",justifyContent:"center"}}>
        <button className="ghost-btn" onClick={onReUpload}>↩ Upload revised thumbnail</button>
      </div>
    </div>
  );
}

/* ─── Upload stage ──────────────────────────────────────────────────────── */
function UploadStage({onAnalyze}){
  const [image,setImage]=useState(null);
  const [b64,setB64]=useState(null);
  const [keyword,setKeyword]=useState("");
  const [dragging,setDragging]=useState(false);
  const [error,setError]=useState(null);
  const fileRef=useRef();

  const loadFile=f=>{
    if(!f||!f.type.match(/image\/(jpeg|png|webp)/)){setError("Please upload a JPEG, PNG, or WebP image.");return;}
    const r=new FileReader();
    r.onload=e=>{setImage(e.target.result);setB64(e.target.result.split(",")[1]);setError(null);};
    r.readAsDataURL(f);
  };
  const handleDrop=useCallback(e=>{e.preventDefault();setDragging(false);loadFile(e.dataTransfer.files[0]);},[]);
  const submit=()=>{
    if(!image){setError("Please upload a thumbnail first.");return;}
    if(!keyword.trim()){setError("Please enter a video title or keyword.");return;}
    onAnalyze(b64,keyword,image);
  };

  return(
    <div className="fu">

      {/* Drop zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={handleDrop}
        onClick={()=>!image&&fileRef.current?.click()}
        style={{
          borderRadius:18,marginBottom:16,position:"relative",overflow:"hidden",
          border:image
            ? `1px solid rgba(201,168,76,.25)`
            : dragging
            ? `1.5px dashed rgba(168,85,247,.6)`
            : `1.5px dashed rgba(255,255,255,.1)`,
          cursor:image?"default":"pointer",
          background:dragging
            ? "rgba(124,58,237,.07)"
            : image
            ? C.bg2
            : "rgba(255,255,255,.02)",
          minHeight:image?0:240,
          display:"flex",alignItems:"center",justifyContent:"center",
          transition:"border-color .2s,background .2s",
          boxShadow:dragging?"0 0 40px rgba(124,58,237,.12) inset":"none",
        }}>
        {image?(
          <div style={{position:"relative",width:"100%"}}>
            <img src={image} alt="uploaded"
              style={{width:"100%",maxHeight:380,objectFit:"contain",display:"block",borderRadius:16}}/>
            <button onClick={e=>{e.stopPropagation();setImage(null);setB64(null);}} style={{
              position:"absolute",top:12,right:12,width:34,height:34,borderRadius:17,
              background:"rgba(0,0,0,.75)",border:`1px solid rgba(255,255,255,.12)`,color:C.text,
              cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",
              transition:"all .2s",
            }}>×</button>
          </div>
        ):(
          <div style={{textAlign:"center",padding:"44px 24px"}}>
            <div style={{
              width:48,height:48,borderRadius:14,
              border:`1px solid rgba(168,85,247,.3)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 20px",
              background:"linear-gradient(135deg,rgba(124,58,237,.12),rgba(201,168,76,.06))",
              animation:"floatY 3s ease-in-out infinite",
              boxShadow:"0 8px 24px rgba(124,58,237,.15)",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                stroke="url(#uploadGrad)">
                <defs>
                  <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7"/>
                    <stop offset="100%" stopColor="#C9A84C"/>
                  </linearGradient>
                </defs>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{fontFamily:"'Inter',sans-serif",fontSize:20,color:C.text,marginBottom:9}}>Drop your thumbnail here</p>
            <p style={{fontSize:12,color:C.muted}}>JPEG · PNG · WebP · 1280×720 recommended</p>
          </div>
        )}
        {!image&&<Corners color="rgba(168,85,247,.3)" size={16}/>}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
        style={{display:"none"}} onChange={e=>loadFile(e.target.files[0])}/>

      <div style={{marginBottom:16}}>
        <label style={{fontSize:11,fontWeight:700,letterSpacing:".09em",textTransform:"uppercase",color:C.muted,display:"block",marginBottom:10}}>
          Video title or target keyword
        </label>
        <input className="at-input" value={keyword} onChange={e=>setKeyword(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&submit()}
          placeholder="e.g.  How to grow on YouTube in 2024"/>
      </div>

      {error&&(
        <div style={{background:"rgba(255,55,77,.07)",border:"1px solid rgba(255,55,77,.2)",
          borderRadius:10,padding:"11px 15px",marginBottom:14,fontSize:13,color:"#FF7799"}}>
          ⚠ {error}
        </div>
      )}

      <button className="cta-btn" onClick={submit}>
        Analyze Thumbnail
        <span style={{marginLeft:12,display:"inline-block"}}>→</span>
      </button>

      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:24,justifyContent:"center"}}>
        {["CTR Score","Typography","Color","Face AI","Competitors","Previews"].map(f=>(
          <span key={f} style={{fontSize:11,color:C.muted,padding:"4px 12px",borderRadius:20,
            border:`1px solid rgba(255,255,255,.06)`,transition:"all .2s",cursor:"default"}}>{f}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Root ──────────────────────────────────────────────────────────────── */
export default function AutoThumb(){
  const [stage,setStage]=useState("upload");
  const [ctx,setCtx]=useState({image:null,keyword:"",result:null});
  const handleAnalyze=async(b64,keyword,imageUrl)=>{
    setCtx({image:imageUrl,b64,keyword,result:null});
    setStage("loading");
    try{
      const result=await analyzeWithClaude(b64,keyword);
      setCtx(c=>({...c,result}));
      setStage("results");
    }catch(e){
      console.error(e);
      setStage("upload");
    }
  };
  const reset=()=>{setStage("upload");setCtx({image:null,b64:null,keyword:"",result:null});};

  return(
    <>
      <GlobalStyles/>
      <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Inter',sans-serif"}}>
        <AmbientBg/>

        {/* Premium top border */}
        <div style={{height:1,background:"linear-gradient(90deg,transparent,#7C3AED 30%,#A855F7 50%,#C9A84C 70%,transparent)",position:"relative",zIndex:2}}/>

        <div style={{position:"relative",zIndex:1,maxWidth:880,margin:"0 auto",padding:"0 24px 100px"}}>

          {/* Header */}
          <header style={{padding:"38px 0 30px",display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:7}}>
                {/* Logo mark */}
                <div style={{width:38,height:38,borderRadius:11,
                  background:"linear-gradient(135deg,#7C3AED,#A855F7 50%,#C9A84C)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:"0 4px 16px rgba(124,58,237,.4)"}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                </div>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:30,fontWeight:700,letterSpacing:".01em"}}>
                  Auto<span className="shimmer-gold">Thumb</span>
                </span>
                <span style={{fontSize:10,fontWeight:800,padding:"3px 9px",borderRadius:5,
                  background:"linear-gradient(135deg,rgba(124,58,237,.2),rgba(201,168,76,.15))",
                  color:C.gold,border:`1px solid rgba(201,168,76,.2)`,letterSpacing:".09em"}}>MVP</span>
              </div>
              <p style={{fontSize:12,color:C.muted,letterSpacing:".05em"}}>
                YouTube thumbnail CTR optimizer
              </p>
            </div>

            {stage!=="upload"&&(
              <button onClick={reset} style={{
                background:"rgba(255,255,255,.03)",border:`1px solid rgba(255,255,255,.08)`,
                color:C.sub,fontSize:12,padding:"8px 18px",borderRadius:9,
                cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .22s",letterSpacing:".04em"
              }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,.1)";e.currentTarget.style.borderColor="rgba(168,85,247,.3)";e.currentTarget.style.color="#C084FC";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.03)";e.currentTarget.style.borderColor="rgba(255,255,255,.08)";e.currentTarget.style.color=C.sub;}}>
                ← New analysis
              </button>
            )}
          </header>

          {/* Divider */}
          <div style={{height:"1px",
            background:"linear-gradient(90deg,rgba(124,58,237,.4),rgba(201,168,76,.2),transparent)",
            marginBottom:34}}/>

          {stage==="upload" &&<UploadStage onAnalyze={handleAnalyze}/>}
          {stage==="loading"&&<RadarLoader image={ctx.image}/>}
          {stage==="results"&&ctx.result&&(
            <ResultsPage result={ctx.result} image={ctx.image} b64={ctx.b64} keyword={ctx.keyword} onReUpload={reset}/>
          )}
        </div>

        {/* Footer */}
        <div style={{position:"relative",zIndex:1,
          borderTop:"1px solid rgba(255,255,255,.05)",
          padding:"20px 24px",display:"flex",justifyContent:"center",alignItems:"center",gap:14}}>
          <div style={{width:4,height:4,borderRadius:"50%",background:"linear-gradient(#7C3AED,#C9A84C)"}}/>
          <p style={{fontSize:11,color:C.muted,letterSpacing:".07em",textTransform:"uppercase"}}>
            AutoThumb · AI CTR Intelligence · MVP 1.0
          </p>
          <div style={{width:4,height:4,borderRadius:"50%",background:"linear-gradient(#C9A84C,#7C3AED)"}}/>
        </div>
      </div>
    </>
  );
}
