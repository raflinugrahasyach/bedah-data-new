import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AnalysisMethod } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, hypothesis, method, datasetId } = body;

    if (!title) {
      return NextResponse.json({ error: "Judul proyek wajib diisi." }, { status: 400 });
    }

    // MVP / Incubator Demo Mode:
    // ALL project creation limits and paywalls are 100% disabled globally.
    // Every user (Peneliti, Student, Admin, Demo) has UNLIMITED projects.
    // Zero paywall restrictions.

    // Create the project
    const project = await db.project.create({
      data: {
        ownerId: session.user.id,
        title,
        description: description || null,
        hypothesis: hypothesis || null,
        method: method ? (method as AnalysisMethod) : null,
        status: "IN_PROGRESS",
      },
    });

    // If datasetId provided, associate it with this project
    if (datasetId) {
      await db.dataset.update({
        where: { id: datasetId },
        data: { projectId: project.id },
      });
    }

    return NextResponse.json({
      success: true,
      projectId: project.id,
    });
  } catch (err: any) {
    console.error("Project creation error:", err);
    return NextResponse.json(
      { error: `Gagal membuat proyek: ${err.message}` },
      { status: 500 }
    );
  }
}

