import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const SESSION_EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days, in ms

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    // Verify the token is fresh (issued in the last 5 minutes) before creating a long-lived cookie
    await adminAuth.verifyIdToken(idToken);

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("session", sessionCookie, {
      maxAge: SESSION_EXPIRES_IN / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Session creation error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}