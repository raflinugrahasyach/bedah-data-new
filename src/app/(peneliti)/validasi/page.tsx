import React from "react";
import { ValidationView } from "@/components/validation-view";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ValidasiPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let projects: any[] = [];
  if (userId) {
    projects = await db.project.findMany({
      where: { ownerId: userId },
      include: {
        datasets: true,
        analyses: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  return <ValidationView initialProjects={projects} />;
}

