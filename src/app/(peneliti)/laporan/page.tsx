import React from "react";
import { ReportView } from "@/components/report-view";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LaporanPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let project = null;
  if (userId) {
    project = await db.project.findFirst({
      where: { ownerId: userId },
      include: {
        datasets: true,
        analyses: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  return <ReportView project={project} user={session?.user} />;
}

