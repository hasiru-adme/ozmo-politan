import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const statusStyles: Record<string, string> = {
  PAID: "bg-sage/20 text-sage-dark",
  PENDING: "bg-gold-light text-gold-dark",
  OVERDUE: "bg-red-50 text-red-500",
  FAILED: "bg-red-50 text-red-500",
};

export default async function PaymentsPage() {
  const user = await getCurrentUser();

  const project = await prisma.project.findFirst({
    where: { clientId: user!.id },
    include: {
      paymentPlan: {
        include: { installments: { orderBy: { installmentNumber: "asc" } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const payments = await prisma.payment.findMany({
    where: { clientId: user!.id },
    orderBy: { createdAt: "desc" },
  });

  const plan = project?.paymentPlan;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Payments</h1>

      {!plan ? (
        <div className="p-8 rounded-xl bg-sage-light/40 text-center text-sage-dark">
          No payment plan has been set up yet.
        </div>
      ) : (
        <>
          {/* Installment schedule */}
          <div className="bg-white border border-sage-light rounded-xl p-6 mb-6">
            <h3 className="font-medium text-lg mb-4">Installment Schedule</h3>
            <div className="flex flex-col gap-2">
              {plan.installments.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium">Installment {i.installmentNumber}</p>
                    <p className="text-xs text-sage-dark">
                      Due {new Date(i.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">${Number(i.amount).toFixed(2)}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[i.status] || "bg-gray-100 text-gray-600"}`}>
                      {i.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment history */}
          <div className="bg-white border border-sage-light rounded-xl p-6">
            <h3 className="font-medium text-lg mb-4">Payment History</h3>
            {payments.length === 0 ? (
              <p className="text-sm text-sage-dark">No payments made yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-light text-left">
                    <th className="py-2 font-medium text-sage-dark">Date</th>
                    <th className="py-2 font-medium text-sage-dark">Amount</th>
                    <th className="py-2 font-medium text-sage-dark">Provider</th>
                    <th className="py-2 font-medium text-sage-dark">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-sage-light last:border-0">
                      <td className="py-2.5">
                        {p.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="py-2.5 font-medium">${Number(p.amount).toFixed(2)}</td>
                      <td className="py-2.5 text-sage-dark capitalize">{p.provider}</td>
                      <td className="py-2.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[p.status] || "bg-gray-100 text-gray-600"}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}