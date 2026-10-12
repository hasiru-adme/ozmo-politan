import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const DEFAULT_MILESTONES = ["Discovery", "Design", "Development", "Testing", "Launch"];

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { clientId, name, description, totalValue, expectedLaunch } = await req.json();

  if (!clientId || !name || !totalValue) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      clientId,
      name,
      description,
      totalValue,
      expectedLaunch: expectedLaunch ? new Date(expectedLaunch) : null,
      milestones: {
        create: DEFAULT_MILESTONES.map((title, i) => ({ title, order: i })),
      },
    },
    include: { milestones: true },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "PROJECT_CREATED",
      targetType: "Project",
      targetId: project.id,
      metadata: { name, clientId },
    },
  });

  return NextResponse.json({ project });
}