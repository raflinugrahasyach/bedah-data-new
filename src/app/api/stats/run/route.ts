import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AnalysisMethod } from "@prisma/client";

export const dynamic = "force-dynamic";

const PYTHON_API_URL = process.env.PYTHON_API_URL || process.env.STATS_ENGINE_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const body = await req.json();
    const { datasetId, projectId, method, params } = body;

    if (!datasetId || !method) {
      return NextResponse.json({ error: "datasetId dan method wajib disertakan." }, { status: 400 });
    }

    const dataset = await db.dataset.findUnique({
      where: { id: datasetId },
      include: { project: true },
    });

    if (!dataset) {
      return NextResponse.json({ error: "Dataset tidak ditemukan." }, { status: 404 });
    }

    // Ownership check (Super Admin cannot compute on user raw datasets directly)
    if (dataset.ownerId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    // Map method to FastAPI endpoint and payload
    let endpoint = "";
    let payload: any = {
      file_path: dataset.storageKey,
      sheet_name: dataset.sheetName,
    };

    switch (method) {
      case "DESCRIPTIVE":
        endpoint = "/api/stats/descriptive";
        payload.variables = params?.variables || null;
        break;

      case "PEARSON":
      case "CORRELATION":
        endpoint = "/api/stats/correlation";
        payload.variables = params?.variables || [];
        payload.method = params?.corrMethod || "pearson";
        break;

      case "VALIDITY":
        endpoint = "/api/stats/validity";
        payload.item_vars = params?.itemVars || [];
        payload.total_var = params?.totalVar || null;
        payload.alpha = params?.alpha || 0.05;
        break;

      case "RELIABILITY":
        endpoint = "/api/stats/reliability";
        payload.item_vars = params?.itemVars || [];
        break;

      case "SIMPLE_REGRESSION":
        endpoint = "/api/stats/regression/simple";
        payload.x_var = params?.xVar;
        payload.y_var = params?.yVar;
        break;

      case "MULTIPLE_REGRESSION":
        endpoint = "/api/stats/regression/multiple";
        payload.x_vars = params?.xVars || [];
        payload.y_var = params?.yVar;
        break;

      case "CLASSICAL_ASSUMPTIONS":
        endpoint = "/api/stats/assumptions";
        payload.x_vars = params?.xVars || (params?.xVar ? [params.xVar] : []);
        payload.y_var = params?.yVar;
        break;

      case "VISUALIZATION":
        // Visualization calls descriptive engine to generate distribution data
        endpoint = "/api/stats/descriptive";
        payload.variables = params?.variables || null;
        break;

      default:
        return NextResponse.json({ error: `Metode ${method} belum didukung.` }, { status: 400 });
    }

    const startTime = Date.now();
    let engineRes: Response;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 seconds tolerance for Render cold start

    try {
      engineRes = await fetch(`${PYTHON_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          error: `Gagal terhubung ke mesin analisis statistik. Pastikan layanan backend aktif (${fetchErr.message}).`,
        },
        { status: 503 }
      );
    }
    clearTimeout(timeoutId);

    if (!engineRes.ok) {
      const errData = await engineRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.detail || "Gagal menjalankan perhitungan di mesin Python." },
        { status: engineRes.status }
      );
    }

    const resultData = await engineRes.json();
    const durationMs = Date.now() - startTime;

    // Persist to database if attached to a project or projectId provided
    const targetProjectId = projectId || dataset.projectId;
    let savedRecord = null;

    if (targetProjectId) {
      // Map frontend method string to Prisma enum
      let prismaMethod: AnalysisMethod = "DESCRIPTIVE";
      if (method === "PEARSON" || method === "CORRELATION") prismaMethod = "PEARSON";
      else if (method === "VALIDITY") prismaMethod = "VALIDITY";
      else if (method === "RELIABILITY") prismaMethod = "RELIABILITY";
      else if (method === "SIMPLE_REGRESSION") prismaMethod = "SIMPLE_REGRESSION";
      else if (method === "MULTIPLE_REGRESSION") prismaMethod = "MULTIPLE_REGRESSION";
      else if (method === "CLASSICAL_ASSUMPTIONS") prismaMethod = "CLASSICAL_ASSUMPTIONS";
      else if (method === "VISUALIZATION") prismaMethod = "VISUALIZATION";

      savedRecord = await db.analysisResult.create({
        data: {
          projectId: targetProjectId,
          datasetId: dataset.id,
          method: prismaMethod,
          status: "DONE",
          params: params || {},
          result: resultData,
          durationMs,
        },
      });

      // Update project status to COMPLETED if it was IN_PROGRESS
      await db.project.update({
        where: { id: targetProjectId },
        data: { status: "COMPLETED", updatedAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      analysisId: savedRecord?.id,
      method,
      datasetName: dataset.fileName,
      durationMs,
      result: resultData,
    });
  } catch (err: any) {
    console.error("Analysis execution error:", err);
    return NextResponse.json(
      { error: `Terjadi kesalahan saat memproses analisis: ${err.message}` },
      { status: 500 }
    );
  }
}

