import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { projectId, type, totalAmount, numberOfMonths } = await req.json();

  if (!projectId || !type || !totalAmount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const months = type === "FULL" ? 1 : numberOfMonths;
  const installmentAmount = Math.round((totalAmount / months) * 100) / 100;

  const now = new Date();
  const installments = Array.from({ length: months }, (_, i) => {
    const dueDate = new Date(now);
    dueDate.setMonth(dueDate.getMonth() + i);
    // Last installment absorbs any rounding difference
    const amount = i === months - 1
      ? totalAmount - installmentAmount * (months - 1)
      : installmentAmount;
    return {
      installmentNumber: i + 1,
      amount,
      dueDate,
    };
  });

  const plan = await prisma.paymentPlan.create({
    data: {
      projectId,
      type,
      totalAmount,
      numberOfMonths: months,
      installments: { create: installments },
    },
    include: { installments: { orderBy: { installmentNumber: "asc" } } },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "PAYMENT_PLAN_CREATED",
      targetType: "PaymentPlan",
      targetId: plan.id,
      metadata: { projectId, type, totalAmount, months },
    },
  });

  return NextResponse.json({ plan });
}