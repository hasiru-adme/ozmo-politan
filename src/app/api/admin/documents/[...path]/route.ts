import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path: pathParts } = await params;
  const storagePath = pathParts.join("/");

  const doc = await prisma.document.findFirst({
    where: { storagePath },
    include: { project: true },
  });

  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Client can only access documents from their own project; admin can access all
  if (user.role !== "ADMIN" && doc.project.clientId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const filePath = path.join(UPLOAD_DIR, storagePath);
  const buffer = await readFile(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `inline; filename="${doc.fileName}"`,
    },
  });
}