/* =========================================================
   Dust la Stella — interaksi & logika toko
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const rp = (n) => "Rp" + n.toLocaleString("id-ID");
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- Bintang empat sudut (SVG, material via CSS var) ---------- */
const MATERIALS = {
  chrome: ["#ffffff", "#a9b5cf", "#39414f", "#9aa6bf", "#d5dcea", "#5c6780"],
  blue: ["#b5c4ff", "#2a48d8", "#06166e", "#2e48c8", "#5a74ee", "#0b2394"],
  ink: ["#7a7a7a", "#1a1a1a", "#000000", "#2b2b2b", "#4a4a4a", "#0d0d0d"],
  stone: ["#f1ece2", "#c9bfae", "#8d8373", "#c2b8a6", "#ddd5c6", "#a39985"],
};
let starUid = 0;
function starSVG(mat = "chrome", wire = false) {
  const id = "st" + ++starUid;
  const C = "140 150", T = "140 0", R = "280 148", B = "140 410", L = "0 148";
  const TR = "156 132", BR = "156 168", BL = "124 168", TL = "124 132";
  const faces = [
    [T, TL, "a"], [T, TR, "b"], [R, TR, "a"], [R, BR, "b"],
    [B, BR, "b"], [B, BL, "c"], [L, BL, "c"], [L, TL, "a"],
  ];
  if (wire) {
    return `<svg class="star-svg" viewBox="-4 -4 288 418" aria-hidden="true"><g fill="none" stroke="#9c9c9c" stroke-width="2" stroke-linejoin="round">
      ${faces.map(([p, q]) => `<path d="M${p} L${q} L${C} Z"/>`).join("")}
      <path d="M124 132 L156 168 M156 132 L124 168" /></g></svg>`;
  }
  const m = MATERIALS[mat];
  return `<svg class="star-svg" viewBox="0 0 280 410" aria-hidden="true">
    <defs>
      <linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m[0]}"/><stop offset="1" stop-color="${m[1]}"/></linearGradient>
      <linearGradient id="${id}b" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m[2]}"/><stop offset="1" stop-color="${m[3]}"/></linearGradient>
      <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m[4]}"/><stop offset="1" stop-color="${m[5]}"/></linearGradient>
    </defs>
    ${faces.map(([p, q, g]) => `<path d="M${p} L${q} L${C} Z" fill="url(#${id}${g})"/>`).join("")}
  </svg>`;
}

/* ---------- Logo Dust la Stella ---------- */
const logoMark = (mat = "chrome") => `<div class="lmark lmark--${mat}"></div>`;

/* ---------- Ilustrasi pakaian ---------- */
const SHAPES = {
  kaos: (c, a) => `<path d="M62 28 L84 18 Q100 34 116 18 L138 28 L176 58 L156 86 L140 76 L140 196 L60 196 L60 76 L44 86 L24 58 Z" fill="${c}"/><path d="M84 18 Q100 34 116 18" fill="none" stroke="${a}" stroke-width="4"/><path d="M92 96 L96 108 L108 112 L96 116 L92 128 L88 116 L76 112 L88 108 Z" fill="${a}" opacity=".85"/>`,
  kemeja: (c, a) => `<path d="M64 28 L86 18 L100 32 L114 18 L136 28 L172 62 L184 176 L162 180 L148 100 L144 100 L144 198 L56 198 L56 100 L52 100 L38 180 L16 176 L28 62 Z" fill="${c}"/><path d="M86 18 L100 44 L114 18 L106 14 L100 28 L94 14 Z" fill="${a}" opacity=".85"/><line x1="100" y1="44" x2="100" y2="198" stroke="${a}" stroke-width="2" opacity=".5"/><g fill="${a}"><circle cx="100" cy="64" r="2.5"/><circle cx="100" cy="94" r="2.5"/><circle cx="100" cy="124" r="2.5"/><circle cx="100" cy="154" r="2.5"/></g>`,
  hoodie: (c, a) => `<path d="M62 40 L78 28 Q100 4 122 28 L138 40 L170 70 L182 172 L160 175 L150 100 L146 100 L146 198 L54 198 L54 100 L50 100 L40 175 L18 172 L30 70 Z" fill="${c}"/><path d="M78 28 Q100 60 122 28" fill="none" stroke="${a}" stroke-width="4"/><line x1="92" y1="44" x2="90" y2="76" stroke="${a}" stroke-width="2.5"/><line x1="108" y1="44" x2="110" y2="76" stroke="${a}" stroke-width="2.5"/><path d="M70 140 L130 140 L138 176 L62 176 Z" fill="none" stroke="${a}" stroke-width="2.5" opacity=".6"/>`,
  jaket: (c, a) => `<path d="M60 30 L84 18 L100 26 L116 18 L140 30 L172 64 L184 176 L162 180 L150 104 L148 104 L148 200 L52 200 L52 104 L50 104 L38 180 L16 176 L28 64 Z" fill="${c}"/><path d="M84 18 L74 54 L100 40 L126 54 L116 18 L100 26 Z" fill="${a}" opacity=".8"/><line x1="100" y1="40" x2="100" y2="200" stroke="${a}" stroke-width="3"/><rect x="62" y="120" width="28" height="24" rx="2" fill="none" stroke="${a}" stroke-width="2.5" opacity=".7"/><rect x="110" y="120" width="28" height="24" rx="2" fill="none" stroke="${a}" stroke-width="2.5" opacity=".7"/>`,
  celana: (c, a) => `<path d="M56 16 L144 16 L154 200 L112 200 L100 78 L88 200 L46 200 Z" fill="${c}"/><rect x="56" y="16" width="88" height="14" fill="${a}" opacity=".35"/><path d="M64 30 Q72 50 92 46" fill="none" stroke="${a}" stroke-width="2.5" opacity=".6"/><path d="M136 30 Q128 50 108 46" fill="none" stroke="${a}" stroke-width="2.5" opacity=".6"/><line x1="100" y1="30" x2="100" y2="72" stroke="${a}" stroke-width="2" opacity=".6"/>`,
  topi: (c, a) => `<path d="M42 128 Q44 54 100 50 Q156 54 158 128 Z" fill="${c}"/><path d="M36 126 L186 122 Q190 142 152 144 L36 138 Z" fill="${a}" opacity=".9"/><circle cx="100" cy="50" r="5" fill="${a}"/><path d="M100 72 L105 92 L120 96 L105 100 L100 120 L95 100 L80 96 L95 92 Z" fill="${a}"/>`,
  tas: (c, a) => `<path d="M70 70 Q70 22 100 22 Q130 22 130 70" fill="none" stroke="${a}" stroke-width="7"/><path d="M44 64 L156 64 L166 200 L34 200 Z" fill="${c}"/><path d="M100 110 L106 132 L124 136 L106 140 L100 166 L94 140 L76 136 L94 132 Z" fill="${a}"/>`,
};
const garment = (type, color, accent = "#0d0d0d") =>
  `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${SHAPES[type](color, accent)}</svg>`;


const hero = $("#hero");

/* =========================================================
   2. LOGO 3D — menempel di layar seperti bintang di referensi
   ========================================================= */
// #globeStar = titik tujuan logo 3D.

const logo3d = $("#logo3d");
(() => {
  const N = 16, DEPTH = 26; // jumlah lapisan & ketebalan (px)
  let html = '<div class="logo3d__shadow"></div><div class="logo3d__rot">';
  for (let i = 0; i < N; i++) {
    const z = (i / (N - 1) - 0.5) * DEPTH;
    const face = i === 0 || i === N - 1;
    html += face
      ? `<div class="logo3d__faceset" style="transform:translateZ(${z.toFixed(2)}px)"><div class="lmark lmark--chrome"></div><div class="lmark lmark--blue f-blue"></div><div class="lmark lmark--ink f-ink"></div></div>`
      : `<div class="lmark logo3d__edge" style="transform:translateZ(${z.toFixed(2)}px)"></div>`;
  }
  logo3d.innerHTML = html + "</div>";
})();
const logoRot = $(".logo3d__rot", logo3d), logoShadow = $(".logo3d__shadow", logo3d), anchorBrand = $("#anchorBrand");
const lerp = (a, b, t) => a + (b - a) * t;
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// campuran warna halus: {c: perak, b: biru, i: hitam} (jumlah = 1)
const MIX = { chrome: { c: 1, b: 0, i: 0 }, blue: { c: 0, b: 1, i: 0 }, ink: { c: 0, b: 0, i: 1 } };
const EDGE = { c: [90, 100, 118], b: [19, 37, 154], i: [21, 21, 21] };
const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const fBlue = () => $$(".f-blue", logo3d);
const fInk = () => $$(".f-ink", logo3d);
let blueEls, inkEls;
function setMix(m) {
  blueEls ||= fBlue(); inkEls ||= fInk();
  const aI = m.i, aB = m.i >= 0.999 ? 0 : m.b / (1 - m.i);
  blueEls.forEach((el) => (el.style.opacity = aB.toFixed(3)));
  inkEls.forEach((el) => (el.style.opacity = aI.toFixed(3)));
  const rgb = [0, 1, 2].map((k) => Math.round(EDGE.c[k] * m.c + EDGE.b[k] * m.b + EDGE.i[k] * m.i));
  logo3d.style.setProperty("--edge", `rgb(${rgb.join(",")})`);
}
const mixLerp = (a, b, t) => ({ c: lerp(a.c, b.c, t), b: lerp(a.b, b.b, t), i: lerp(a.i, b.i, t) });

/* =========================================================
   3. INTRO: hero → "Satu Tanda" (scroll-driven)
   ========================================================= */
const heroText = $("#heroText"), heroSky = $("#heroSky");
const intro = $("#intro"), mark = $("#mark"), words = $$(".orbit-word"), brandBox = $("#markBrand"), markTag = $("#markTag");
$("#brandLetters").innerHTML = "Dust la Stella".split("").map((ch) => `<span>${ch === " " ? "&nbsp;" : ch}</span>`).join("");
const letters = $$("#brandLetters span");

let mouseX = 0, mouseY = 0, smx = 0, smy = 0;
window.addEventListener("mousemove", (e) => { mouseX = e.clientX / innerWidth - 0.5; mouseY = e.clientY / innerHeight - 0.5; });
const t0 = performance.now();
let curMat = "chrome";

function updateMark(now = performance.now()) {
  const H = innerHeight, W = innerWidth;
  const rel = -intro.getBoundingClientRect().top;
  const introScroll = intro.offsetHeight - H;
  const baseW = logo3d.offsetWidth;
  if (rel > introScroll) return flyLogo(now, baseW);
  logoShadow.style.opacity = 1;
  const heroH = hero.offsetHeight;
  const heroP = clamp(rel / heroH);
  const p = clamp((rel - heroH) / (mark.offsetHeight - H));

  // teks hero: muncul saat mulai scroll, hilang sebelum bagian berikutnya
  const tIn = clamp((heroP - 0.03) / 0.22), tOut = clamp((heroP - 0.62) / 0.25);
  heroText.style.opacity = tIn * (1 - tOut);
  heroText.style.transform = `translateY(${(1 - tIn) * 40 - tOut * 60}px)`;
  heroText.classList.toggle("show", tIn > 0.02);
  heroSky.style.opacity = 1 - clamp((heroP - 0.55) / 0.4);
  const t = (now - t0) / 1000;

  // animasi masuk saat halaman dibuka
  const enter = clamp(t / 1.8);
  const ease = 1 - Math.pow(1 - enter, 4);

  // kata-kata mengorbit
  const appear = clamp(p / 0.08);
  const rx = Math.min(W * 0.3, 380), ry = Math.min(H * 0.32, 300);
  const wordsOut = clamp((p - 0.6) / 0.12);
  words.forEach((w, i) => {
    const a = (i * Math.PI) / 2 - Math.PI / 2 + p * Math.PI * 2.2;
    const x = Math.cos(a) * rx, y = Math.sin(a) * ry;
    const front = (Math.sin(a) + 1) / 2;
    const speed = Math.abs(p - (w._lp ?? p)) * 400;
    w._lp = p;
    w.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${0.9 + front * 0.2})`;
    w.style.filter = `blur(${Math.min(4, (1 - front) * 2 + speed)}px)`;
    w.style.opacity = (0.35 + front * 0.65) * appear * (1 - wordsOut);
  });

  // logo: posisi, putaran, ukuran
  const shrink = clamp((p - 0.66) / 0.14);
  const free = 1 - shrink; // seberapa bebas logo bergoyang
  smx += (mouseX - smx) * 0.06; smy += (mouseY - smy) * 0.06;
  const wobbleY = (Math.sin(t * 0.7) * 22 + smx * 30) * free;
  const wobbleX = (Math.sin(t * 0.5) * 6 - smy * 16) * free;
  const spin = heroP * 360 + Math.min(p / 0.8, 1) * 720 + (1 - ease) * -540; // selalu berakhir menghadap depan
  logoRot.style.transform = `rotateX(${wobbleX}deg) rotateY(${spin + wobbleY}deg)`;

  const textH = $("#brandLetters").offsetHeight, logoH = logo3d.offsetHeight;
  const targetY = -(textH / 2 + 40 + (logoH * 0.6) / 2);
  // awal: tepat di tengah layar; saat teks muncul, naik ke tengah ruang di atas judul
  const gapCenter = (72 + heroText.offsetTop) / 2;
  const heroY = (gapCenter - H / 2) * tIn * (1 - tOut);
  const floatY = Math.sin(t * 1.1) * 8 * free;
  const scale = (0.55 + ease * 0.45) * (1 - shrink * 0.4);
  logo3d.style.transform = `translate(-50%, -50%) translateY(${heroY + shrink * targetY + floatY}px) scale(${scale})`;
  // titik akhir intro (logo di atas tulisan brand) — jadi awal penerbangan
  anchorBrand.style.width = baseW * 0.6 + "px";
  anchorBrand.style.transform = `translate(-50%, -50%) translateY(${targetY}px)`;
  logo3d.style.opacity = ease;
  logo3d.style.filter = enter < 1 ? `blur(${(1 - ease) * 12}px)` : "";

  // ganti material: perak → biru → hitam
  const tb = smooth((p - 0.22) / 0.2), ti = smooth((p - 0.52) / 0.2);
  setMix({ c: (1 - tb) * (1 - ti), b: tb * (1 - ti), i: ti });

  // label atas
  markTag.style.opacity = appear * (1 - clamp((shrink - 0.1) / 0.2));

  // huruf brand
  const lp = clamp((p - 0.7) / 0.22);
  letters.forEach((l, i) => {
    const k = clamp(lp * letters.length * 0.6 - i * 0.5);
    l.style.opacity = k;
    l.style.transform = `translateY(${(1 - k) * 40}px)`;
  });
  brandBox.classList.toggle("show", lp > 0.85);
}

/* ---------- Logo terbang: bagian 2 → 3 (berhenti di bola dunia) ---------- */
const STOPS = [
  { el: anchorBrand, mat: "ink", rot: 0 },
  { el: $("#globeStar"), mat: "chrome", rot: 0 },
];
function flyLogo(now, baseW) {
  const H = innerHeight, W = innerWidth, t = (now - t0) / 1000;
  const pts = STOPS.map((s, i) => {
    const r = s.el.getBoundingClientRect();
    // scrollY saat titik ini berada di tengah layar
    // mendarat saat section tujuannya berada di tengah layar (bukan menunggu titiknya di tengah)
    const sec = s.el.closest("section");
    const sr = sec ? sec.getBoundingClientRect() : r;
    const focus = i === 0 ? intro.offsetTop + intro.offsetHeight - H : sr.top + scrollY + Math.min(sr.height, H * 1.2) / 2 - H / 2;
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, focus, ...s };
  });
  let a = pts[0], b = pts[0], k = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    if (scrollY >= pts[i].focus) { a = pts[i]; b = pts[i + 1]; k = clamp((scrollY - a.focus) / (b.focus - a.focus)); }
  }
  if (scrollY >= pts[pts.length - 1].focus) { a = b = pts[pts.length - 1]; k = 0; }
  // animasi selesai di section 3: logo menempel di bola dunia, lalu disembunyikan setelah lewat layar
  const last = pts[pts.length - 1];
  logo3d.style.visibility = last.cy < -last.w ? "hidden" : "";
  const e = easeIO(k), arc = Math.sin(Math.PI * e);
  const cx = lerp(a.cx, b.cx, e) + arc * W * 0.08 * (b.cx > a.cx ? -1 : 1);
  const cy = lerp(a.cy, b.cy, e);
  const w = lerp(a.w, b.w, e) * (1 + arc * 0.35);
  const rotZ = lerp(a.rot, b.rot, e) + arc * -12;
  logo3d.style.transform = `translate(-50%, -50%) translate(${cx - W / 2}px, ${cy - H / 2}px) rotate(${rotZ}deg) scale(${w / baseW})`;
  logo3d.style.opacity = 1;
  logo3d.style.filter = "";
  const wob = Math.sin(t * 0.8) * 14 * (1 - arc);
  logoRot.style.transform = `rotateX(${Math.sin(t * 0.6) * 5 * (1 - arc)}deg) rotateY(${e * 360 + wob}deg)`;
  logoShadow.style.opacity = 0.25 + arc * 0.5;
  setMix(mixLerp(MIX[a.mat], MIX[b.mat], smooth((e - 0.2) / 0.6)));
}

(function logoLoop(now) { updateMark(now); requestAnimationFrame(logoLoop); })(performance.now());

/* =========================================================
   4. PERJALANAN BRAND
   ========================================================= */
const CHAPTERS = [
  { key: "/DUST", year: "2021", mat: "wire", title: "DUST",
    text: "It all started with a single screen print in a rented room and a four-pointed star doodled on the back of a notebook. No name, no plan — just a belief that clothes can carry the story of the people who wear them." },
  { key: "/STAR", year: "2023", mat: "stone", title: "STAR",
    text: "The name Dust la Stella was born. Our first hoodie with the puff-print script sold out in three days. That taught us something: people aren't looking for new clothes, they're looking for clothes they can wear for years." },
  { key: "/EVOLUTION", year: "2026", mat: "chrome", title: "EVOLUTION",
    text: "Today Dust la Stella has grown into a full label — tees, shirts, outerwear, pants, and limited drops — still sewn locally, still made in small batches. Not perfect yet, but fully committed." },
];
let jIndex = 0, jTimer;
const jCards = $("#jCards");
jCards.innerHTML = CHAPTERS.map((c, i) => `
  <div class="jcard" data-i="${i}">
    <span class="jcard__tag">${c.key}</span>
    <span class="jcard__year">${c.year}</span>
    <div class="jcard__img">${logoMark(c.mat)}</div>
  </div>`).join("");
const jEls = $$(".jcard", jCards);

function layoutJourney() {
  const W = jCards.clientWidth;
  const s = Math.min(1, W / 1000);
  const sizes = [[240, 298], [140, 174], [100, 124]]; // kartu aktif, berikutnya, terakhir
  const aLeft = (W - 580 * s) / 2; // ketiga kartu sebagai satu grup di tengah
  const lefts = [aLeft, aLeft + 240 * s + 70 * s, aLeft + 240 * s + 70 * s + 140 * s + 30 * s];
  jEls.forEach((el, i) => {
    const rel = (i - jIndex + 3) % 3;
    const [w, h] = sizes[rel];
    el.style.width = w * s + "px";
    el.style.height = h * s + "px";
    el.style.left = lefts[rel] + "px";
    el.style.zIndex = 3 - rel;
    el.classList.toggle("active", rel === 0);
  });
  $("#jNum").textContent = String(jIndex + 1).padStart(2, "0");
  const c = CHAPTERS[jIndex];
  $("#jText").innerHTML = `<div><h4>${c.title} — ${c.year}</h4><p>${c.text}</p></div>`;
}
function goJourney(i) { jIndex = (i + 3) % 3; layoutJourney(); restartJourney(); }
function restartJourney() { clearInterval(jTimer); jTimer = setInterval(() => { jIndex = (jIndex + 1) % 3; layoutJourney(); }, 7000); }
jCards.addEventListener("click", (e) => { const c = e.target.closest(".jcard"); if (c) goJourney(+c.dataset.i); });
jCards.addEventListener("mouseenter", () => clearInterval(jTimer));
jCards.addEventListener("mouseleave", restartJourney);
layoutJourney(); restartJourney();

/* =========================================================
   5. SHOWCASE — kartu mengalir melengkung
   ========================================================= */
(() => {
  const stage = $("#showStage"), track = $("#showTrack");
  const ITEMS = [
    { label: "Signature", html: `<img src="img/hoodie-dust-la-stella.png" alt="" />`, open: 13 },
    { label: "Tee", html: `<img src="img/tee-dls.png" alt="" />` },
    { label: "Trucker Cap", html: `<img src="img/cap-dls.png" alt="" />` },
    { label: "Varsity Jacket", html: `<img src="img/jacket-dls.png" alt="" />` },
    { label: "Black Knitwear", html: `<img src="img/knit-black-dls.png" alt="" />` },
    { label: "Bags", html: `<img src="img/bags-dls.png" alt="" />` },
    { label: "Brush Hoodie", html: `<img src="img/hoodie-brush-dls.png" alt="" />` },
    { label: "Limited Edition", html: `<div style="width:82%">${logoMark("chrome")}</div>`, drop: true },
  ];
  let cards = [], W = 0, H = 0, cw = 0, step = 0, loop = 0;
  function build() {
    W = stage.clientWidth; H = stage.clientHeight;
    cw = parseFloat(getComputedStyle(stage).getPropertyValue("--card-w")) || 146;
    step = cw * 0.89;
    let n = ITEMS.length;
    while (n * step < W + cw * 2) n += ITEMS.length;
    loop = n * step;
    track.innerHTML = Array.from({ length: n }, (_, i) => {
      const it = ITEMS[i % ITEMS.length];
      return `<div class="sc-card" data-i="${i % ITEMS.length}">${it.html}<span>${it.label}</span></div>`;
    }).join("");
    cards = $$(".sc-card", track);
  }
  track.addEventListener("click", (e) => {
    const c = e.target.closest(".sc-card");
    if (!c) return;
    const it = ITEMS[c.dataset.i];
    if (it.drop) $("#drop").scrollIntoView({ behavior: "smooth" });
  });
  let offset = 0, boost = 0, lastY = scrollY, last = performance.now(), visible = false, hover = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(stage);
  stage.addEventListener("mouseenter", () => (hover = true));
  stage.addEventListener("mouseleave", () => (hover = false));
  window.addEventListener("scroll", () => { boost += (scrollY - lastY) * 0.9; lastY = scrollY; }, { passive: true });
  window.addEventListener("resize", build);
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (visible) {
      offset += (hover ? 10 : 38) * dt + boost * dt * 4;
      boost *= 0.9;
      const top = H * 0.04, depth = H * 1.05;
      for (let i = 0; i < cards.length; i++) {
        const x = ((((i * step + offset) % loop) + loop) % loop) - cw;
        const u = clamp((x + cw / 2 - W / 2) / (W / 2), -1, 1);
        const y = top + depth * (1 - Math.abs(u)) ** 2;
        cards[i].style.transform = `translate3d(${x}px, ${y}px, 0)`;
        cards[i].style.zIndex = Math.round((1 - Math.abs(u)) * 40);
      }
    }
    requestAnimationFrame(frame);
  }
  build();
  requestAnimationFrame(frame);
})();

/* =========================================================
   6. DROP COUNTDOWN & FORM
   ========================================================= */
const dropDate = (() => {
  let d = store.get("dls_drop", null);
  if (!d || d < Date.now()) { d = Date.now() + 864e5 * 6 + 36e5 * 7; store.set("dls_drop", d); }
  return d;
})();
function tick() {
  const diff = Math.max(0, dropDate - Date.now()), pad = (n) => String(Math.floor(n)).padStart(2, "0");
  $("#cdD").textContent = pad(diff / 864e5);
  $("#cdH").textContent = pad((diff / 36e5) % 24);
  $("#cdM").textContent = pad((diff / 6e4) % 60);
  $("#cdS").textContent = pad((diff / 1e3) % 60);
}
tick(); setInterval(tick, 1000);
["#notifyForm", "#newsForm"].forEach((id) => $(id).addEventListener("submit", (e) => {
  e.preventDefault(); e.target.reset();
  toast(id === "#notifyForm" ? "You're on the list! We'll let you know when Drop 05 opens." : "You're in! Your discount code: DUST10");
}));

/* ---------- Footer: tulisan brand selebar footer (kiri ke kanan) ---------- */
function fitFooterMark() {
  const el = $(".footer__mark");
  el.style.fontSize = "100px";
  const w = el.scrollWidth, box = el.clientWidth;
  // ukur lebar teks sebenarnya lewat span sementara
  const probe = document.createElement("span");
  probe.textContent = el.textContent; probe.style.whiteSpace = "nowrap"; probe.style.display = "inline-block";
  el.textContent = ""; el.appendChild(probe);
  const tw = probe.getBoundingClientRect().width || w;
  el.textContent = probe.textContent;
  if (!tw || !box) return;
  el.style.fontSize = (100 * box / tw).toFixed(2) + "px";
}
fitFooterMark();
window.addEventListener("resize", fitFooterMark);
document.fonts && document.fonts.ready.then(fitFooterMark);

/* =========================================================
   7. REVEAL
   ========================================================= */
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: 0.15 });
$$(".reveal").forEach((el) => io.observe(el));

window.addEventListener("resize", layoutJourney);

