import React from "react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProjectCreateWizard } from "@/components/project-create-wizard";

export const dynamic = "force-dynamic";

export default async function ProyekBaruPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let datasets: any[] = [];
  if (userId) {
    datasets = await db.dataset.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  return <ProjectCreateWizard datasets={datasets} />;
}

