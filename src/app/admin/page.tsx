import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [projectCount, clientCount, projects] = await Promise.all([
    prisma.project.count(),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.project.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const statusStyles: Record<string, string> = {
    DISCOVERY: "bg-gray-100 text-gray-600",
    DESIGN: "bg-blue-50 text-blue-600",
    DEVELOPMENT: "bg-gold-light text-gold-dark",
    TESTING: "bg-orange-50 text-orange-600",
    LAUNCHED: "bg-sage/20 text-sage-dark",
    COMPLETED: "bg-green-50 text-green-600",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin Overview</h1>

      <div className="grid grid-cols-2 gap-4 mt-6 max-w-md">
        <div className="p-5 rounded-xl bg-white border border-sage-light">
          <p className="text-xs text-sage-dark mb-1">Active Projects</p>
          <p className="text-3xl font-semibold">{projectCount}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-sage-light">
          <p className="text-xs text-sage-dark mb-1">Clients</p>
          <p className="text-3xl font-semibold">{clientCount}</p>
        </div>
      </div>

      <h3 className="text-lg font-medium mt-10 mb-4">Recent Projects</h3>

      {projects.length === 0 ? (
        <div className="p-8 rounded-xl bg-sage-light/30 text-center text-sm text-sage-dark">
          No projects yet. Create one from the Projects tab.
        </div>
      ) : (
        <div className="bg-white border border-sage-light rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sage-light bg-sage-light/20 text-left">
                <th className="px-4 py-3 font-medium text-sage-dark">Client</th>
                <th className="px-4 py-3 font-medium text-sage-dark">Project</th>
                <th className="px-4 py-3 font-medium text-sage-dark">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-sage-light last:border-0 hover:bg-sage-light/10">
                  <td className="px-4 py-3">{p.client.name || p.client.email}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[p.status] || "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
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