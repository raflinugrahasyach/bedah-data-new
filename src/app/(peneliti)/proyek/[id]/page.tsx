import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProjectWorkspaceView } from "@/components/project-workspace-view";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage(props: ProjectDetailPageProps) {
  const params = await props.params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Silakan masuk terlebih dahulu.</div>;
  }

  const project = await db.project.findUnique({
    where: { id: params.id },
    include: {
      datasets: true,
      analyses: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project || (project.ownerId !== userId && (session.user as any).role !== "ADMIN")) {
    notFound();
  }

  return <ProjectWorkspaceView project={project} />;
}

