export type PlanAnswer = { step: string; question: string; choice: string };

type RGB = [number, number, number];

const WHITE: RGB = [255, 255, 255];
const INK: RGB = [20, 20, 20];
const GRAY: RGB = [115, 115, 108];
const SOFT: RGB = [240, 240, 235];
const LINE: RGB = [220, 220, 214];
const MID: RGB = [170, 170, 164];

const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

/* ---------------------------------------------------------
   Step 3 (Plan focus) decides the colour theme of the PDF
---------------------------------------------------------- */
const THEMES: Record<string, { accent: RGB; dark: RGB; on: RGB }> = {
  Website: { accent: [243, 181, 27], dark: [24, 22, 16], on: INK },
  Automation: { accent: [20, 184, 166], dark: [8, 36, 38], on: INK },
  "AI + data": { accent: [139, 92, 246], dark: [26, 17, 50], on: WHITE },
};

const RECOMMEND: Record<string, { title: string; text: string }> = {
  Website: {
    title: "Website & Platform",
    text: "A fast, conversion-focused website or platform is the best first piece for your business. It becomes the base we connect everything else to.",
  },
  Automation: {
    title: "Automation",
    text: "Automating your repetitive tasks gives you the quickest win. Your team gets hours back every week and fewer things slip through.",
  },
  "AI + data": {
    title: "AI & Data",
    text: "AI assistants and simple dashboards help you respond faster and see what is actually working in your business.",
  },
};

/* Step 2 (Understand) decides the kickoff card */
const KICKOFF: Record<string, { title: string; text: string }> = {
  "A quick call": {
    title: "Discovery call",
    text: "A focused 30 minute call within 48 hours, so we understand your goals and what is slowing you down.",
  },
  "Share our workflow": {
    title: "Workflow review",
    text: "You send us your current process. We map it, then come back with sharp questions within 3 days.",
  },
  "Visit and observe": {
    title: "On-site visit",
    text: "We spend a day with your team and see how the work really happens before we design anything.",
  },
};

/* Step 4 (Build) decides the roadmap */
const BUILD: Record<string, { label: string; weeks: number; phases: { name: string; start: number; end: number }[] }> = {
  "Fast launch": {
    label: "Fast launch",
    weeks: 4,
    phases: [
      { name: "Discover", start: 0, end: 1 },
      { name: "Design", start: 1, end: 2 },
      { name: "Build", start: 1.5, end: 3.5 },
      { name: "Launch", start: 3.5, end: 4 },
    ],
  },
  "Step by step": {
    label: "Step by step",
    weeks: 12,
    phases: [
      { name: "Discover", start: 0, end: 2 },
      { name: "Design", start: 1.5, end: 4 },
      { name: "Build: phase 1", start: 4, end: 8 },
      { name: "Build: phase 2", start: 8, end: 11 },
      { name: "Launch", start: 11, end: 12 },
    ],
  },
  "Full system": {
    label: "Full system",
    weeks: 20,
    phases: [
      { name: "Discover", start: 0, end: 3 },
      { name: "Architecture", start: 2, end: 6 },
      { name: "Build", start: 6, end: 16 },
      { name: "Test & refine", start: 14, end: 19 },
      { name: "Launch", start: 18, end: 20 },
    ],
  },
};

/* Step 5 (Manage) decides the care radar */
const AXES = ["Security", "Updates", "Support", "Speed", "Insights"];
const MANAGE: Record<string, { axis: number; text: string }> = {
  Security: { axis: 0, text: "SSL, monitoring and security patches handled by our team, so you never have to think about it." },
  Updates: { axis: 1, text: "Regular updates, fixes and improvements shipped for you, so your system never goes stale." },
  "Ongoing support": { axis: 2, text: "A real team on call whenever something needs help, with quick answers and fast fixes." },
};
const FOCUS_BOOST: Record<string, { axis: number; value: number }> = {
  Website: { axis: 3, value: 8 },
  Automation: { axis: 1, value: 8 },
  "AI + data": { axis: 4, value: 9 },
};

/* tiny seeded random, so the cover art is unique for each set of answers */
function seedFrom(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function makeRng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);

export async function generatePlanPdf(answers: PlanAnswer[], name: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const W = 210;
  const H = 297;
  const M = 18;
  const CW = W - M * 2;

  const fill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const stroke = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
  const color = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);

  const poly = (pts: { x: number; y: number }[], style: "S" | "F" | "FD") => {
    const segs = pts.slice(1).map((p, i) => [p.x - pts[i].x, p.y - pts[i].y]);
    doc.lines(segs, pts[0].x, pts[0].y, [1, 1], style, true);
  };

  /* ---------- the 6 answers ---------- */
  const choice = (i: number) => answers[i]?.choice ?? "";
  const pain = choice(0);
  const learn = choice(1);
  const focus = choice(2);
  const build = choice(3);
  const manage = choice(4);
  const grow = choice(5);

  const theme = THEMES[focus] ?? THEMES.Website;
  const A = theme.accent;
  const D = theme.dark;
  const ON = theme.on;

  const first = name.trim().split(" ")[0] || "your business";
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* ---------- shared: header + footer ---------- */
  const header = (onDark: boolean) => {
    fill(A);
    doc.circle(M + 1.5, 16, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    color(onDark ? WHITE : INK);
    doc.text("Ozmo", M + 6, 17);
  };

  const footer = (page: number, total: number) => {
    stroke(LINE);
    doc.setLineWidth(0.2);
    doc.line(M, H - 16, W - M, H - 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    color(GRAY);
    doc.text("Ozmo  |  Digital solutions built around your business", M, H - 10);
    doc.text(`${page} / ${total}`, W - M, H - 10, { align: "right" });
  };

  const sectionLabel = (label: string, y: number, title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    color(GRAY);
    doc.text(label, M, y);
    fill(A);
    doc.rect(M, y + 3, 14, 0.9, "F");
    doc.setFontSize(20);
    color(INK);
    doc.text(title, M, y + 16);
  };

  /* =====================================================
     PAGE 1: cover (unique art) + your answers
  ====================================================== */
  fill(D);
  doc.rect(0, 0, W, 130, "F");
  fill(A);
  doc.rect(0, 130, W, 1.6, "F");

  // cover art, generated from the answers
  const rng = makeRng(seedFrom(answers.map((a) => a.choice).join("|")));
  const cols = 6;
  const rows = 9;
  const gap = 7.5;
  const ax = W - M - (cols - 1) * gap - 3;
  const ay = 30;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const roll = rng();
      const size = 0.6 + rng() * 2.6;
      const bright = rng() > 0.55;
      if (roll < 0.15) continue;
      fill(bright ? A : mix(A, D, 0.65));
      doc.circle(ax + c * gap, ay + r * gap, size, "F");
    }
  }

  header(true);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  color(A);
  doc.text("YOUR PERSONAL PLAN", M, 52);
  fill(A);
  doc.rect(M, 55, 14, 0.9, "F");

  doc.setFontSize(32);
  color(WHITE);
  doc.text("Your digital", M, 72);
  doc.text("growth plan.", M, 84);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  color([200, 200, 195]);
  doc.text(`Prepared for ${name.trim() || "you"}  |  ${date}`, M, 95);

  const intro = doc.splitTextToSize(
    `Thanks for playing through our process, ${first}. Here is what you told us, and how a connected digital system could take shape around it.`,
    108
  );
  doc.text(intro, M, 106);

  // answers
  let y = 142;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  color(GRAY);
  doc.text("WHAT YOU TOLD US", M, y);
  y += 7;

  answers.forEach((a, i) => {
    fill(SOFT);
    doc.roundedRect(M, y, CW, 15, 2.5, 2.5, "F");
    fill(A);
    doc.roundedRect(M, y, 2.2, 15, 1, 1, "F");

    fill(a.choice ? A : LINE);
    doc.circle(M + 10, y + 7.5, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    color(a.choice ? ON : INK);
    doc.text(String(i + 1), M + 10, y + 8.7, { align: "center" });

    doc.setFontSize(7.5);
    color(GRAY);
    doc.text(`${a.step.toUpperCase()}  -  ${a.question}`, M + 18, y + 6);

    doc.setFontSize(11);
    color(INK);
    doc.text(a.choice || "-", M + 18, y + 11.8);

    y += 18;
  });

  footer(1, 3);

  /* =====================================================
     PAGE 2: impact charts (change with pain + grow) + kickoff
  ====================================================== */
  doc.addPage();
  header(false);
  sectionLabel("WHAT COULD CHANGE", 38, "Before and after your system");

  // chart 1: before vs after bars. Your biggest pain gets the biggest win.
  const painIndex = pain === "Slow replies" ? 0 : pain === "Too much manual work" ? 1 : pain === "Not enough customers" ? 2 : -1;
  const enqAfter = painIndex === 2 ? 150 : 128;

  const metrics = [
    { label: "Response time", note: "lower is better", after: painIndex === 0 ? 28 : 48 },
    { label: "Manual work", note: "lower is better", after: painIndex === 1 ? 45 : 68 },
    { label: "Customer enquiries", note: "higher is better", after: enqAfter },
  ];
  const MAXV = 160;
  const barW = CW - 28;

  let cy = 68;
  metrics.forEach((m, i) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    color(INK);
    doc.text(m.label, M, cy);

    if (i === painIndex) {
      const tx = M + doc.getTextWidth(m.label) + 3;
      fill(A);
      doc.roundedRect(tx, cy - 3.6, 30, 5, 2.5, 2.5, "F");
      doc.setFontSize(6.5);
      color(ON);
      doc.text("YOUR PRIORITY", tx + 15, cy - 0.3, { align: "center" });
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    color(GRAY);
    doc.text(m.note, W - M, cy, { align: "right" });

    fill(SOFT);
    doc.roundedRect(M, cy + 3, barW, 5, 1.5, 1.5, "F");
    fill(MID);
    doc.roundedRect(M, cy + 3, (100 / MAXV) * barW, 5, 1.5, 1.5, "F");
    doc.setFontSize(8);
    color(GRAY);
    doc.text("100", M + barW + 3, cy + 6.8);

    fill(SOFT);
    doc.roundedRect(M, cy + 10, barW, 5, 1.5, 1.5, "F");
    fill(A);
    doc.roundedRect(M, cy + 10, (m.after / MAXV) * barW, 5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    color(INK);
    doc.text(String(m.after), M + barW + 3, cy + 13.8);

    cy += 24;
  });

  // legend
  fill(MID);
  doc.rect(M, cy - 2, 4, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  color(GRAY);
  doc.text("Today (index = 100)", M + 6, cy + 0.5);
  fill(A);
  doc.rect(M + 48, cy - 2, 4, 3, "F");
  doc.text("With your connected system", M + 54, cy + 0.5);

  // chart 2: depends on your growth goal (step 6)
  const gx = M + 10;
  const gw = CW - 14;
  const gh = 44;
  const gy = cy + 22;

  const monthLabels = (labels: string[]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    color(GRAY);
    labels.forEach((t, i) => {
      doc.text(t, gx + (i / (labels.length - 1)) * gw, gy + gh + 6, { align: "center" });
    });
  };

  const grid = (vals: number[], lo: number, hi: number, suffix = "") => {
    stroke(LINE);
    doc.setLineWidth(0.2);
    vals.forEach((v) => {
      const yy = gy + gh - ((v - lo) / (hi - lo)) * gh;
      doc.line(gx, yy, gx + gw, yy);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      color(GRAY);
      doc.text(`${v}${suffix}`, gx - 2, yy + 1, { align: "right" });
    });
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  color(INK);

  if (grow === "Save time") {
    // BAR chart: hours saved per week
    const endH = painIndex === 1 ? 12 : 8;
    doc.text("Hours saved per week, first 6 months", M, gy - 8);
    const hi = endH * 1.15;
    grid([0, Math.round(endH / 2), endH], 0, hi, "h");

    const slot = gw / 6;
    const bw = slot * 0.55;
    for (let i = 0; i < 6; i++) {
      const v = Math.round(endH * easeOut((i + 1) / 6));
      const h = (v / hi) * gh;
      const bx = gx + i * slot + (slot - bw) / 2;
      fill(i === 5 ? A : mix(A, WHITE, 0.45));
      doc.roundedRect(bx, gy + gh - h, bw, h, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      color(INK);
      doc.text(`${v}h`, bx + bw / 2, gy + gh - h - 1.5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      color(GRAY);
      doc.text(`M${i + 1}`, bx + bw / 2, gy + gh + 6, { align: "center" });
    }
  } else if (grow === "Scale up") {
    // STEP chart: capacity grows in stages
    const levels = [100, 135, 175];
    const lo = 90;
    const hi = 190;
    doc.text("Business capacity over your first 6 months (index)", M, gy - 8);
    grid([100, 135, 175], lo, hi);

    const seg = gw / 6;
    const yOf = (v: number) => gy + gh - ((v - lo) / (hi - lo)) * gh;
    levels.forEach((lv, li) => {
      const sx = gx + li * 2 * seg;
      fill(mix(A, WHITE, 0.72));
      doc.rect(sx, yOf(lv), seg * 2, gy + gh - yOf(lv), "F");
      stroke(A);
      doc.setLineWidth(1);
      doc.line(sx, yOf(lv), sx + seg * 2, yOf(lv));
      if (li > 0) doc.line(sx, yOf(levels[li - 1]), sx, yOf(lv));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      color(INK);
      doc.text(String(lv), sx + seg, yOf(lv) - 2, { align: "center" });
    });
    monthLabels(["Now", "M1", "M2", "M3", "M4", "M5", "M6"]);
  } else {
    // LINE chart: enquiries (default, "More leads")
    doc.text("Enquiries over your first 6 months (index)", M, gy - 8);
    const lo = 90;
    const hi = enqAfter + 10;
    grid([lo, 100, Math.round((100 + enqAfter) / 2), enqAfter], lo, hi);

    const pts = Array.from({ length: 7 }, (_, m) => {
      const v = 100 + (enqAfter - 100) * easeOut(m / 6);
      return { x: gx + (m / 6) * gw, y: gy + gh - ((v - lo) / (hi - lo)) * gh };
    });
    stroke(A);
    doc.setLineWidth(1);
    for (let i = 0; i < pts.length - 1; i++) {
      doc.line(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
    }
    pts.forEach((p) => {
      fill(A);
      doc.circle(p.x, p.y, 1.4, "F");
    });
    monthLabels(["Now", "M1", "M2", "M3", "M4", "M5", "M6"]);
  }

  // kickoff card (from step 2)
  const kick = KICKOFF[learn] ?? KICKOFF["A quick call"];
  const ky = gy + gh + 18;
  fill(SOFT);
  doc.roundedRect(M, ky, CW, 30, 3, 3, "F");
  fill(A);
  doc.roundedRect(M, ky, 2.2, 30, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  color(GRAY);
  doc.text("HOW WE START", M + 8, ky + 8);
  doc.setFontSize(13);
  color(INK);
  doc.text(kick.title, M + 8, ky + 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  color(GRAY);
  doc.text(doc.splitTextToSize(kick.text, CW - 16), M + 8, ky + 21);

  footer(2, 3);

  /* =====================================================
     PAGE 3: roadmap (build) + care radar (manage) + next step
  ====================================================== */
  doc.addPage();
  header(false);

  const plan = BUILD[build] ?? BUILD["Step by step"];
  sectionLabel("YOUR ROADMAP", 38, `${plan.label}: ${plan.weeks} weeks`);

  // gantt
  const labelW = 34;
  const gX = M + labelW;
  const gW = CW - labelW;
  const rowH = 9;
  let gyy = 62;

  // week axis
  const ticks = [0, plan.weeks / 2, plan.weeks];
  ticks.forEach((t) => {
    const tx = gX + (t / plan.weeks) * gW;
    stroke(LINE);
    doc.setLineWidth(0.2);
    doc.line(tx, gyy - 3, tx, gyy + plan.phases.length * rowH);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    color(GRAY);
    doc.text(`Week ${Math.round(t)}`, tx, gyy - 5, { align: t === 0 ? "left" : t === plan.weeks ? "right" : "center" });
  });

  plan.phases.forEach((p, i) => {
    const isLast = i === plan.phases.length - 1;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    color(INK);
    doc.text(p.name, M, gyy + 5.5);

    fill(SOFT);
    doc.roundedRect(gX, gyy + 1.5, gW, 5, 2.5, 2.5, "F");
    fill(isLast ? D : mix(A, WHITE, 0.5 - (i / plan.phases.length) * 0.5));
    const bx = gX + (p.start / plan.weeks) * gW;
    const bw = ((p.end - p.start) / plan.weeks) * gW;
    doc.roundedRect(bx, gyy + 1.5, Math.max(bw, 4), 5, 2.5, 2.5, "F");
    gyy += rowH;
  });

  // care radar (from step 5)
  const care = MANAGE[manage] ?? MANAGE["Ongoing support"];
  const boost = FOCUS_BOOST[focus] ?? FOCUS_BOOST.Website;
  const scores = AXES.map(() => 5);
  scores[boost.axis] = Math.max(scores[boost.axis], boost.value);
  scores[care.axis] = 9.5;

  const rcx = M + 44;
  const rcy = 166;
  const rr = 27;
  const at = (i: number, frac: number) => {
    const ang = ((-90 + i * 72) * Math.PI) / 180;
    return { x: rcx + Math.cos(ang) * rr * frac, y: rcy + Math.sin(ang) * rr * frac };
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  color(GRAY);
  doc.text("YOUR CARE PLAN", M, 122);
  fill(A);
  doc.rect(M, 125, 14, 0.9, "F");

  // rings + spokes
  stroke(LINE);
  doc.setLineWidth(0.2);
  [0.25, 0.5, 0.75, 1].forEach((f) => {
    poly(AXES.map((_, i) => at(i, f)), "S");
  });
  AXES.forEach((_, i) => {
    const p = at(i, 1);
    doc.line(rcx, rcy, p.x, p.y);
  });

  // data shape
  fill(mix(A, WHITE, 0.6));
  stroke(A);
  doc.setLineWidth(0.9);
  poly(scores.map((s, i) => at(i, s / 10)), "FD");
  scores.forEach((s, i) => {
    const p = at(i, s / 10);
    fill(i === care.axis ? D : A);
    doc.circle(p.x, p.y, i === care.axis ? 1.6 : 1.1, "F");
  });

  // axis labels
  AXES.forEach((label, i) => {
    const p = at(i, 1.22);
    doc.setFont("helvetica", i === care.axis ? "bold" : "normal");
    doc.setFontSize(8);
    color(i === care.axis ? INK : GRAY);
    const align = Math.abs(p.x - rcx) < 3 ? "center" : p.x > rcx ? "left" : "right";
    doc.text(label, p.x, p.y + 1, { align });
  });

  // care text (right side)
  const tx = M + 96;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  color(GRAY);
  doc.text("YOU CHOSE TO PROTECT", tx, 146);
  doc.setFontSize(18);
  color(INK);
  doc.text(manage || "Ongoing support", tx, 156);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  color(GRAY);
  doc.text(doc.splitTextToSize(care.text, W - M - tx), tx, 164);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  color(GRAY);
  doc.text("FIRST 3 MONTHS OF SUPPORT CAN BE FREE", tx, 186);

  // recommendation
  const rec = RECOMMEND[focus] ?? {
    title: "A connected digital system",
    text: "We will map the right pieces for your business and build them step by step.",
  };
  const ry = 205;
  fill(D);
  doc.roundedRect(M, ry, CW, 42, 4, 4, "F");
  fill(A);
  doc.rect(M + 8, ry + 8, 10, 0.9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  color(WHITE);
  doc.text("RECOMMENDED STARTING POINT", M + 8, ry + 6);
  doc.setFontSize(15);
  doc.text(rec.title, M + 8, ry + 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  color([200, 200, 195]);
  doc.text(doc.splitTextToSize(rec.text, CW - 16), M + 8, ry + 24);

  // goal line
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  color(A);
  doc.text(
    `GOAL: ${(grow || "grow").toUpperCase()}   |   ${plan.label.toUpperCase()}   |   ${plan.weeks} WEEKS`,
    M + 8,
    ry + 37
  );

  // CTA + disclaimer
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  color(INK);
  doc.text("Ready to talk? Reply to our email or use Let's Talk on our website.", M, ry + 56);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  color(GRAY);
  doc.text(
    doc.splitTextToSize(
      "Illustrative estimates based on your answers and typical outcomes. Not a guarantee. Real results depend on your business, market and how the system is used.",
      CW
    ),
    M,
    ry + 63
  );

  footer(3, 3);

  doc.save("Ozmo-growth-plan.pdf");
}