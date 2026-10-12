import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, subject, message, priority } = await req.json();
  if (!projectId || !subject || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Make sure the project belongs to this client
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.clientId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ticket = await prisma.supportTicket.create({
    data: {
      projectId,
      clientId: user.id,
      subject,
      priority: priority || "MEDIUM",
      messages: { create: { authorId: user.id, body: message } },
    },
    include: { messages: true },
  });

  // Notify admins (all of them) — simple loop, fine for small teams
  // Notify admins (all of them) — simple loop, fine for small teams
  const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
  await prisma.notification.createMany({
    data: admins.map((a) => ({
      userId: a.id,
      type: "TICKET_CREATED" as const,
      title: `New ticket: ${subject}`,
      body: message.slice(0, 100),
      link: `/admin/tickets/${ticket.id}`,
    })),
  });
  

  return NextResponse.json({ ticket });
}