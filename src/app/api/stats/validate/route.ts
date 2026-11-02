import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const PYTHON_API_URL = process.env.PYTHON_API_URL || process.env.STATS_ENGINE_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Parameter projectId wajib diisi." }, { status: 400 });
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        datasets: true,
        analyses: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!project || project.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
    }

    const dataset = project.datasets?.[0];
    if (!dataset) {
      return NextResponse.json(
        { error: "Proyek belum memiliki dataset untuk divalidasi." },
        { status: 400 }
      );
    }

    const latestAnalysis = project.analyses?.[0];

    // Call Python FastAPI validation endpoint
    const engineRes = await fetch(`${PYTHON_API_URL}/api/stats/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_path: dataset.storageKey,
        sheet_name: dataset.sheetName,
        method: project.method || "SIMPLE_REGRESSION",
        params: latestAnalysis?.params || { x: "motivasi_belajar", y: "hasil_belajar" },
      }),
    });

    if (!engineRes.ok) {
      const err = await engineRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail || "Gagal menjalankan validasi komputasi di mesin Python." },
        { status: engineRes.status }
      );
    }

    const valData = await engineRes.json();

    // If validation passed, update project status to VALIDATED (Green Badge)
    if (valData.validation_passed) {
      await db.project.update({
        where: { id: project.id },
        data: { status: "VALIDATED" },
      });

      if (latestAnalysis) {
        await db.validation.upsert({
          where: { analysisId: latestAnalysis.id },
          update: {
            status: "PASSED",
            tolerance: valData.tolerance,
            checks: valData.checks,
            discrepancies: valData.discrepancies,
          },
          create: {
            analysisId: latestAnalysis.id,
            status: "PASSED",
            tolerance: valData.tolerance,
            checks: valData.checks,
            discrepancies: valData.discrepancies,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      projectTitle: project.title,
      validation: valData,
    });
  } catch (err: any) {
    console.error("Validation API error:", err);
    return NextResponse.json(
      { error: `Kesalahan server: ${err.message}` },
      { status: 500 }
    );
  }
}

