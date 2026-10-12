import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple in-memory rate limiter — resets on server restart, fine for a contact form.
// For production/multi-instance, swap this for Redis or Upstash.
const submissions = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_PER_WINDOW) return true;
  timestamps.push(now);
  submissions.set(ip, timestamps);
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, phone, message, hpField } = body; // "hpField" = honeypot field

  // TEMPORARY DEBUG — remove once confirmed fixed
  console.log("Honeypot value:", JSON.stringify(hpField));

  // Honeypot: real users never fill this hidden field. Bots often do.
  if (hpField) {
    console.log("Submission blocked by honeypot");
    return NextResponse.json({ success: true }); // silently pretend success, don't tip off the bot
  }

  // Server-side validation — never trust client-side checks alone
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
  }
  if (name.length > 100 || email.length > 150 || message.length > 2000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const submission = await prisma.contactSubmission.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      message: message.trim(),
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") || null,
    },
  });

  return NextResponse.json({ success: true, id: submission.id });
}