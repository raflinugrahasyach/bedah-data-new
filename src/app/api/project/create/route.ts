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

    // Check project quota for user tier
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          where: { status: "ACTIVE" },
          include: { plan: true },
        },
        projects: true,
      },
    });

    const activeSub = user?.subscriptions?.[0];
    
    // Determine project limit (null = UNLIMITED)
    let maxProjects: number | null = null;
    if (!activeSub) {
      maxProjects = 1; // Free tier default
    } else if (activeSub.tier === "RESEARCHER" || activeSub.tier === "CAMPUS") {
      maxProjects = null; // Researcher & Campus tiers are 100% UNLIMITED
    } else {
      maxProjects = activeSub.plan?.maxProjects !== undefined ? activeSub.plan.maxProjects : 5;
    }

    // Always bypass paywall for Demo accounts and Admins
    const isBypassed =
      user?.isDemo ||
      user?.email === "peneliti@bedahdata.id" ||
      user?.role === "ADMIN" ||
      (session.user as any).role === "ADMIN" ||
      activeSub?.tier === "RESEARCHER" ||
      activeSub?.tier === "CAMPUS";

    if (!isBypassed && maxProjects !== null && (user?.projects?.length || 0) >= maxProjects) {
      return NextResponse.json(
        {
          error: `Batas paket ${activeSub?.tier || "Free"} tercapai (Maksimal ${maxProjects} proyek). Silakan upgrade paket untuk membuat lebih banyak proyek.`,
        },
        { status: 403 }
      );
    }

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

