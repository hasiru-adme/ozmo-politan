import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import PayButton from "./PayButton";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const project = await prisma.project.findFirst({
    where: { clientId: user!.id },
    include: {
      milestones: { orderBy: { order: "asc" } },
      paymentPlan: { include: { installments: { orderBy: { installmentNumber: "asc" } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!project) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Welcome, {user!.name || user!.email}</h1>
        <div className="mt-6 p-8 rounded-xl bg-sage-light/40 text-center text-sage-dark">
          No project has been set up for your account yet.
        </div>
      </div>
    );
  }

  const completedCount = project.milestones.filter((m) => m.completed).length;
  const progress = project.milestones.length
    ? Math.round((completedCount / project.milestones.length) * 100)
    : 0;

  const plan = project.paymentPlan;
  const paidTotal = plan?.installments.filter((i) => i.status === "PAID").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const nextDue = plan?.installments.find((i) => i.status !== "PAID");

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Welcome, {user!.name || user!.email}</h1>

      {/* Project card (unchanged) */}
      <div className="mt-6 p-6 rounded-xl bg-white border border-sage-light">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-medium text-lg">{project.name}</h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gold-light text-gold-dark font-medium">{project.status}</span>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-xs text-sage-dark mb-1">
            <span>Progress</span><span>{progress}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-sage-light overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          {project.milestones.map((m) => (
            <div key={m.id} className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg ${m.completed ? "bg-sage/15 text-sage-dark" : "bg-gray-50 text-gray-500"}`}>
              <span>{m.completed ? "✓" : "○"}</span>{m.title}
            </div>
          ))}
        </div>
      </div>

      {/* Payment card */}
      {plan && (
        <div className="mt-4 p-6 rounded-xl bg-white border border-sage-light">
          <h3 className="font-medium text-lg mb-4">Payment</h3>

          <div className="flex justify-between text-sm mb-1">
            <span className="text-sage-dark">Total Project Value</span>
            <span className="font-medium">${Number(plan.totalAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-sage-dark">Paid</span>
            <span className="font-medium text-sage-dark">${paidTotal.toFixed(2)}</span>
          </div>

          <div className="h-2 rounded-full bg-sage-light overflow-hidden mb-5">
            <div className="h-full bg-sage-dark" style={{ width: `${(paidTotal / Number(plan.totalAmount)) * 100}%` }} />
          </div>

          {nextDue ? (
            <div className="flex items-center justify-between bg-gold-light/40 rounded-lg px-4 py-3">
              <div>
                <p className="text-xs text-sage-dark">Next payment</p>
                <p className="font-medium">${Number(nextDue.amount).toFixed(2)} — due {new Date(nextDue.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
              </div>
              <PayButton installmentId={nextDue.id} />
            </div>
          ) : (
            <div className="text-center text-sm text-sage-dark py-2">✓ Fully paid</div>
          )}

          <div className="mt-4 flex flex-col gap-1.5">
            {plan.installments.map((i) => (
              <div key={i.id} className="flex justify-between text-xs text-sage-dark px-1">
                <span>Installment {i.installmentNumber}</span>
                <span className={i.status === "PAID" ? "text-sage-dark font-medium" : ""}>
                  {i.status === "PAID" ? "✓ Paid" : new Date(i.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}