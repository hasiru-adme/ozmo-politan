import { prisma } from "@/lib/prisma";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  OPEN: "bg-gold-light text-gold-dark",
  IN_PROGRESS: "bg-blue-50 text-blue-600",
  RESOLVED: "bg-sage/20 text-sage-dark",
  CLOSED: "bg-gray-100 text-gray-500",
};

export default async function AdminTicketsPage() {
  const tickets = await prisma.supportTicket.findMany({
    include: { client: true, project: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Support Tickets</h1>

      {tickets.length === 0 ? (
        <div className="p-8 rounded-xl bg-sage-light/30 text-center text-sm text-sage-dark">
          No tickets yet.
        </div>
      ) : (
        <div className="bg-white border border-sage-light rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sage-light bg-sage-light/20 text-left">
                <th className="px-4 py-3 font-medium text-sage-dark">Client</th>
                <th className="px-4 py-3 font-medium text-sage-dark">Subject</th>
                <th className="px-4 py-3 font-medium text-sage-dark">Priority</th>
                <th className="px-4 py-3 font-medium text-sage-dark">Status</th>
                <th className="px-4 py-3 font-medium text-sage-dark">Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-sage-light last:border-0 hover:bg-sage-light/10">
                  <td className="px-4 py-3">
                    <Link href={`/admin/tickets/${t.id}`} className="hover:underline">
                      {t.client.name || t.client.email}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium">{t.subject}</td>
                  <td className="px-4 py-3 text-sage-dark">{t.priority}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[t.status]}`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sage-dark">
                    {new Date(t.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}