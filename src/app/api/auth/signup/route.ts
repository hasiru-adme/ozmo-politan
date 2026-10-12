import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { uid, email, name } = await req.json();

  if (!uid || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    // Every signup through this public form becomes a CLIENT.
    // Admin accounts are created manually (see note below) — never via public signup.
    await adminAuth.setCustomUserClaims(uid, { role: "CLIENT" });

    const user = await prisma.user.create({
      data: {
        firebaseUid: uid,
        email,
        name: name || null,
        role: "CLIENT",
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}