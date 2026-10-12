import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const projectId = formData.get("projectId") as string | null;

  if (!file || !projectId) {
    return NextResponse.json({ error: "Missing file or projectId" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const projectDir = path.join(UPLOAD_DIR, projectId);
  await mkdir(projectDir, { recursive: true });

  const uniqueName = `${randomUUID()}-${file.name}`;
  const filePath = path.join(projectDir, uniqueName);
  const storagePath = `${projectId}/${uniqueName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const document = await prisma.document.create({
    data: {
      projectId,
      uploadedById: admin.id,
      fileName: file.name,
      fileUrl: `/api/documents/${encodeURIComponent(storagePath)}`,
      storagePath,
      fileSize: file.size,
      mimeType: file.type,
    },
  });

  await prisma.auditLog.create({
    data: { actorId: admin.id, action: "DOCUMENT_UPLOADED", targetType: "Document", targetId: document.id },
  });

  return NextResponse.json({ document });
}

export async function DELETE(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await req.json();
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { unlink } = await import("fs/promises");
  await unlink(path.join(UPLOAD_DIR, doc.storagePath)).catch(() => {});
  await prisma.document.delete({ where: { id } });

  return NextResponse.json({ success: true });
}