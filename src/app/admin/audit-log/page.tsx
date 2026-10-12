import { prisma } from "@/lib/prisma";

const actionStyles: Record<string, string> = {
  PROJECT_UPDATED: "bg-blue-50 text-blue-600",
  PROJECT_DELETED: "bg-red-50 text-red-500",
  PAYMENT_PLAN_CREATED: "bg-gold-light text-gold-dark",
  DOCUMENT_UPLOADED: "bg-sage/20 text-sage-dark",
};

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>;
}) {
  const { action, page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const pageSize = 30;

  const where = action ? { action } : {};

  const [logs, total, actionTypes] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      distinct: ["action"],
      select: { action: true },
    }),
  ]);

  // Fetch actor names in one batch (avoid N+1)
  const actorIds = [...new Set(logs.map((l) => l.actorId).filter(Boolean))] as string[];
  const actors = await prisma.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, name: true, email: true },
  });
  const actorMap = new Map(actors.map((a) => [a.id, a.name || a.email]));

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Audit Log</h1>

      <div className="flex gap-2 mb-5">
        <a
          href="/admin/audit-log"
          className={`text-xs px-3 py-1.5 rounded-lg border ${!action ? "bg-sage-dark text-white border-sage-dark" : "border-sage-light text-sage-dark"}`}
        >
          All
        </a>
        {actionTypes.map((a) => (
          <a
            key={a.action}
            href={`/admin/audit-log?action=${a.action}`}
            className={`text-xs px-3 py-1.5 rounded-lg border ${action === a.action ? "bg-sage-dark text-white border-sage-dark" : "border-sage-light text-sage-dark"}`}
          >
            {a.action.replace(/_/g, " ")}
          </a>
        ))}
      </div>

      {logs.length === 0 ? (
        <div className="p-8 rounded-xl bg-sage-light/30 text-center text-sm text-sage-dark">
          No audit log entries found.
        </div>
      ) : (
        <>
          <div className="bg-white border border-sage-light rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sage-light bg-sage-light/20 text-left">
                  <th className="px-4 py-3 font-medium text-sage-dark">Actor</th>
                  <th className="px-4 py-3 font-medium text-sage-dark">Action</th>
                  <th className="px-4 py-3 font-medium text-sage-dark">Target</th>
                  <th className="px-4 py-3 font-medium text-sage-dark">Details</th>
                  <th className="px-4 py-3 font-medium text-sage-dark">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-sage-light last:border-0 hover:bg-sage-light/10">
                    <td className="px-4 py-3">
                      {log.actorId ? actorMap.get(log.actorId) || "Unknown" : <span className="text-gray-400">System</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${actionStyles[log.action] || "bg-gray-100 text-gray-600"}`}>
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sage-dark">
                      {log.targetType ? `${log.targetType} · ${log.targetId?.slice(0, 8)}...` : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sage-dark whitespace-nowrap">
                      {log.createdAt.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/admin/audit-log?${action ? `action=${action}&` : ""}page=${p}`}
                  className={`text-xs px-3 py-1.5 rounded-lg border ${p === currentPage ? "bg-sage-dark text-white border-sage-dark" : "border-sage-light text-sage-dark"}`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}