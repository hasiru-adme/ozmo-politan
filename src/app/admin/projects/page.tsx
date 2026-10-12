import { prisma } from "@/lib/prisma";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";

export default async function ProjectsPage() {
  const [clients, projects] = await Promise.all([
    prisma.user.findMany({ where: { role: "CLIENT" }, orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({
      include: {
        client: true,
        milestones: { orderBy: { order: "asc" } },
        paymentPlan: true,
        documents: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

const serializable = projects.map((p) => ({
  ...p,
  totalValue: p.totalValue.toString(),
  paymentPlan: p.paymentPlan
    ? { ...p.paymentPlan, totalAmount: p.paymentPlan.totalAmount.toString() }
    : null,
  documents: p.documents.map((d) => ({ ...d, createdAt: d.createdAt.toISOString() })),
}));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Projects</h1>
      <ProjectForm clients={clients} />
      <ProjectList projects={serializable} />
    </div>
  );
}