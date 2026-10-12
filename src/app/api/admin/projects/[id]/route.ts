import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { name, description, status, totalValue, expectedLaunch } = await req.json();

  const project = await prisma.project.update({
    where: { id },
    data: {
      name,
      description,
      status,
      totalValue,
      expectedLaunch: expectedLaunch ? new Date(expectedLaunch) : null,
    },
  });

  await prisma.auditLog.create({
    data: { actorId: admin.id, action: "PROJECT_UPDATED", targetType: "Project", targetId: id },
  });

  return NextResponse.json({ project });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.project.delete({ where: { id } });

  await prisma.auditLog.create({
    data: { actorId: admin.id, action: "PROJECT_DELETED", targetType: "Project", targetId: id },
  });

  return NextResponse.json({ success: true });
}