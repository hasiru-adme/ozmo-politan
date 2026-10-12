import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReplyBox from "@/app/dashboard/tickets/[id]/ReplyBox";
import StatusSelect from "./StatusSelect";

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      client: true,
      messages: { orderBy: { createdAt: "asc" }, include: { author: true } },
    },
  });

  if (!ticket) notFound();

  return (
    <div className="p-6 max-w-2xl">
      <a href="/admin/tickets" className="text-sm text-sage-dark hover:underline">← Back to tickets</a>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{ticket.subject}</h1>
          <p className="text-sm text-sage-dark">{ticket.client.name || ticket.client.email}</p>
        </div>
        <StatusSelect ticketId={ticket.id} currentStatus={ticket.status} />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {ticket.messages.map((m) => {
          const isAdmin = m.authorId !== ticket.clientId;
          return (
            <div key={m.id} className={`max-w-[80%] rounded-xl p-3.5 text-sm ${isAdmin ? "self-end bg-sage-dark text-white" : "self-start bg-white border border-sage-light"}`}>
              <p>{m.body}</p>
              <p className={`text-xs mt-1.5 ${isAdmin ? "text-white/70" : "text-gray-400"}`}>
                {m.author.name || m.author.email} · {new Date(m.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          );
        })}
      </div>

      <ReplyBox ticketId={ticket.id} />
    </div>
  );
}