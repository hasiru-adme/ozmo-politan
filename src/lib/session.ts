// lib/session.ts
import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();        // ← await added
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(token, true);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    return user;
  } catch {
    return null;
  }
}