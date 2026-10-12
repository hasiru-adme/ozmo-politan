import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { completed } = await req.json();

  const milestone = await prisma.projectMilestone.update({
    where: { id },
    data: { completed, completedAt: completed ? new Date() : null },
  });

  return NextResponse.json({ milestone });
}