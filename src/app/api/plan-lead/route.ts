import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const submissions = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const stamps = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (stamps.length >= MAX_PER_WINDOW) return true;
  stamps.push(now);
  submissions.set(ip, stamps);
  return false;
}

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { name, email, answers, hpField } = body;

  // honeypot: pretend success for bots
  if (hpField) return NextResponse.json({ success: true });

  const cleanName = clean(name, 100);
  const cleanEmail = clean(email, 150).toLowerCase();

  if (!cleanName || !cleanEmail) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }
  if (!isValidEmail(cleanEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const lines = (Array.isArray(answers) ? answers.slice(0, 6) : []).map(
    (a: { step?: string; choice?: string }) => `- ${clean(a?.step, 30)}: ${clean(a?.choice, 60)}`
  );

  await prisma.contactSubmission.create({
    data: {
      name: cleanName,
      email: cleanEmail,
      message: `[PDF PLAN DOWNLOAD]\n${lines.join("\n")}`,
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") || null,
    },
  });

  return NextResponse.json({ success: true });
}