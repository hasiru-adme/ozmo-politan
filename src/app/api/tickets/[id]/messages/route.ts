import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Message is empty" }, { status: 400 });

  const ticket = await prisma.supportTicket.findUnique({ where: { id } });
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Client can only reply to their own ticket; admin can reply to any
  if (user.role !== "ADMIN" && ticket.clientId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const message = await prisma.ticketMessage.create({
    data: { ticketId: id, authorId: user.id, body },
  });

  // Reopen if it was resolved/closed and client replies again
  if (user.role !== "ADMIN" && (ticket.status === "RESOLVED" || ticket.status === "CLOSED")) {
    await prisma.supportTicket.update({ where: { id }, data: { status: "OPEN" } });
  }

  // Notify the other party
  const notifyUserId = user.role === "ADMIN" ? ticket.clientId : null; // client always gets notified on admin reply
  if (user.role === "ADMIN") {
    await prisma.notification.create({
      data: {
        userId: ticket.clientId,
        type: "TICKET_REPLY",
        title: `Reply on: ${ticket.subject}`,
        body: body.slice(0, 100),
        link: `/dashboard/tickets/${id}`,
      },
    });
  } else {
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    await prisma.notification.createMany({
      data: admins.map((a) => ({
        userId: a.id,
        type: "TICKET_REPLY" as const,
        title: `Reply on: ${ticket.subject}`,
        body: body.slice(0, 100),
        link: `/admin/tickets/${id}`,
      })),
    });
  }

  return NextResponse.json({ message });
}