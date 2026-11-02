import React from "react";
import { db } from "@/lib/db";
import { AdminUsersView } from "@/components/admin-users-view";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    include: {
      subscriptions: true,
      projects: true,
      datasets: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <AdminUsersView initialUsers={users} />;
}

