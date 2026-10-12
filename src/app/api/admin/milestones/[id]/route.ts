import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  // Supports two use-cases with one route:
  // { completed: true/false } → toggle done state
  // { title: "New name" } → rename
  const data: any = {};
  if (typeof body.completed === "boolean") {
    data.completed = body.completed;
    data.completedAt = body.completed ? new Date() : null;
  }
  if (typeof body.title === "string") {
    data.title = body.title;
  }

  const milestone = await prisma.projectMilestone.update({ where: { id }, data });
  return NextResponse.json({ milestone });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.projectMilestone.delete({ where: { id } });
  return NextResponse.json({ success: true });
}