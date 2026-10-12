import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// ⚠️ TEMPORARY — simulates a successful payment.
// This will be replaced by PayPal order creation + webhook confirmation in the real integration.
// It exists only so we can build/test the rest of the payment UI and data flow first.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { installmentId } = await req.json();

  const installment = await prisma.paymentInstallment.findUnique({
    where: { id: installmentId },
    include: { plan: { include: { project: true } } },
  });

  if (!installment) {
    return NextResponse.json({ error: "Installment not found" }, { status: 404 });
  }

  // Make sure this installment actually belongs to the logged-in client's project
  if (installment.plan.project.clientId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (installment.status === "PAID") {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        installmentId: installment.id,
        clientId: user.id,
        projectId: installment.plan.projectId,
        amount: installment.amount,
        provider: "mock",
        providerOrderId: `MOCK-${Date.now()}`,
        status: "COMPLETED",
      },
    });

    await tx.paymentInstallment.update({
      where: { id: installment.id },
      data: { status: "PAID", paidAt: new Date() },
    });

    return payment;
  });

  return NextResponse.json({ payment: result });
}