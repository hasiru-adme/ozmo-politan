import { prisma } from "@/lib/prisma";

export default async function ClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: { projects: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Clients</h1>

      {clients.length === 0 ? (
        <div className="p-8 rounded-xl bg-sage-light/30 text-center text-sm text-sage-dark">
          No clients have signed up yet.
        </div>
      ) : (
        <div className="bg-white border border-sage-light rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sage-light bg-sage-light/20 text-left">
                <th className="px-4 py-3 font-medium text-sage-dark">Name</th>
                <th className="px-4 py-3 font-medium text-sage-dark">Email</th>
                <th className="px-4 py-3 font-medium text-sage-dark">Projects</th>
                <th className="px-4 py-3 font-medium text-sage-dark">Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-sage-light last:border-0 hover:bg-sage-light/10">
                  <td className="px-4 py-3 font-medium">{c.name || "—"}</td>
                  <td className="px-4 py-3 text-sage-dark">{c.email}</td>
                  <td className="px-4 py-3">
                    {c.projects.length > 0 ? (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gold-light text-gold-dark font-medium">
                        {c.projects.length} project{c.projects.length > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No projects</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sage-dark">
                    {c.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
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