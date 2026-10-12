import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ReplyBox from "./ReplyBox";

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" }, include: { author: true } } },
  });

  if (!ticket) notFound();
  if (ticket.clientId !== user!.id) redirect("/dashboard/tickets");

  return (
    <div className="p-6 max-w-2xl">
      <a href="/dashboard/tickets" className="text-sm text-sage-dark hover:underline">← Back to tickets</a>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{ticket.subject}</h1>
        <span className="text-xs px-2.5 py-1 rounded-full bg-gold-light text-gold-dark font-medium">
          {ticket.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {ticket.messages.map((m) => {
          const isMine = m.authorId === user!.id;
          return (
            <div key={m.id} className={`max-w-[80%] rounded-xl p-3.5 text-sm ${isMine ? "self-end bg-sage-dark text-white" : "self-start bg-white border border-sage-light"}`}>
              <p>{m.body}</p>
              <p className={`text-xs mt-1.5 ${isMine ? "text-white/70" : "text-gray-400"}`}>
                {m.author.name || m.author.email} · {new Date(m.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          );
        })}
      </div>

      {ticket.status !== "CLOSED" && <ReplyBox ticketId={ticket.id} />}
    </div>
  );
}