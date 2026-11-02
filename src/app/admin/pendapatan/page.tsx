import React from "react";
import { db } from "@/lib/db";
import { AdminRevenueView } from "@/components/admin-revenue-view";

export const dynamic = "force-dynamic";

export default async function AdminPendapatanPage() {
  const [transactions, plans] = await Promise.all([
    db.transaction.findMany({
      orderBy: { createdAt: "desc" },
    }),
    db.plan.findMany(),
  ]);

  return (
    <AdminRevenueView
      initialTransactions={transactions}
      plans={plans}
    />
  );
}

