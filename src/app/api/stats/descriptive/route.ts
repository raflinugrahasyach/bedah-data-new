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

    const body = await req.json();
    const { datasetId, variables } = body;

    if (!datasetId) {
      return NextResponse.json({ error: "Parameter datasetId wajib diisi." }, { status: 400 });
    }

    const dataset = await db.dataset.findUnique({
      where: { id: datasetId },
      include: { project: true },
    });

    if (!dataset) {
      return NextResponse.json({ error: "Dataset tidak ditemukan." }, { status: 404 });
    }

    // Ownership check (Admin cannot read user raw datasets)
    if (dataset.ownerId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    // Call Python FastAPI engine with timeout tolerance for cold starts
    let engineRes: Response;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      engineRes = await fetch(`${PYTHON_API_URL}/api/stats/descriptive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_path: dataset.storageKey,
          sheet_name: dataset.sheetName,
          variables: variables || null,
        }),
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr.name === "AbortError") {
        return NextResponse.json(
          {
            error:
              "Layanan komputasi statistik memerlukan waktu lebih lama untuk merespons (proses inisialisasi cold start). Silakan coba jalankan kembali.",
          },
          { status: 504 }
        );
      }
      return NextResponse.json(
        {
          error: `Gagal terhubung ke mesin analisis statistik (${fetchErr.message}). Pastikan layanan backend aktif.`,
        },
        { status: 503 }
      );
    }
    clearTimeout(timeoutId);

    if (!engineRes.ok) {
      const errData = await engineRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.detail || "Gagal menghitung statistik di mesin Python." },
        { status: engineRes.status }
      );
    }

    const statsData = await engineRes.json();

    // If attached to a project, save or update analysis result
    if (dataset.projectId) {
      await db.analysisResult.create({
        data: {
          projectId: dataset.projectId,
          datasetId: dataset.id,
          method: "DESCRIPTIVE",
          status: "DONE",
          params: { variables: variables || "ALL" },
          result: statsData,
        },
      });

      // Update project status if currently IN_PROGRESS
      await db.project.update({
        where: { id: dataset.projectId },
        data: { status: "COMPLETED" },
      });
    }

    return NextResponse.json({
      success: true,
      datasetName: dataset.fileName,
      result: statsData,
    });
  } catch (err: any) {
    console.error("Descriptive statistics API error:", err);
    return NextResponse.json(
      { error: `Kesalahan server: ${err.message}` },
      { status: 500 }
    );
  }
}

