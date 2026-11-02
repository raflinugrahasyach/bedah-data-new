import React from "react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PengaturanView } from "@/components/pengaturan-view";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Silakan masuk terlebih dahulu.</div>;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
        include: { plan: true },
        take: 1,
      },
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) {
    return <div>Pengguna tidak ditemukan.</div>;
  }

  const activeSub = user.subscriptions[0] || null;
  const activePlan = activeSub?.plan || null;

  return (
    <PengaturanView
      user={user}
      activePlan={activePlan}
      subscription={activeSub}
      transactions={user.transactions}
    />
  );
}

