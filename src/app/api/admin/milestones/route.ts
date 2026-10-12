import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { projectId, title } = await req.json();
  if (!projectId || !title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const count = await prisma.projectMilestone.count({ where: { projectId } });

  const milestone = await prisma.projectMilestone.create({
    data: { projectId, title, order: count },
  });

  return NextResponse.json({ milestone });
}