import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NewTicketForm from "./NewTicketForm";

const statusStyles: Record<string, string> = {
  OPEN: "bg-gold-light text-gold-dark",
  IN_PROGRESS: "bg-blue-50 text-blue-600",
  RESOLVED: "bg-sage/20 text-sage-dark",
  CLOSED: "bg-gray-100 text-gray-500",
};

export default async function TicketsPage() {
  const user = await getCurrentUser();

  const project = await prisma.project.findFirst({
    where: { clientId: user!.id },
    orderBy: { createdAt: "desc" },
  });

  const tickets = project
    ? await prisma.supportTicket.findMany({
        where: { projectId: project.id },
        include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Support Tickets</h1>

      {!project ? (
        <div className="p-8 rounded-xl bg-sage-light/40 text-center text-sage-dark">
          No project has been set up for your account yet.
        </div>
      ) : (
        <>
          <NewTicketForm projectId={project.id} />

          <div className="mt-6 flex flex-col gap-2">
            {tickets.length === 0 ? (
              <p className="text-sm text-sage-dark text-center py-6">No tickets yet.</p>
            ) : (
              tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/dashboard/tickets/${t.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-sage-light hover:border-gold/50 transition"
                >
                  <div>
                    <p className="font-medium text-sm">{t.subject}</p>
                    <p className="text-xs text-sage-dark mt-0.5">
                      {new Date(t.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[t.status]}`}>
                    {t.status.replace("_", " ")}
                  </span>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}