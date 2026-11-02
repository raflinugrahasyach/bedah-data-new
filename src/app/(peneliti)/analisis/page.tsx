import React from "react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AnalysisWorkbench } from "@/components/analysis-workbench";
import Link from "next/link";
import { Upload } from "lucide-react";

export const dynamic = "force-dynamic";

interface AnalisisPageProps {
  searchParams: Promise<{
    datasetId?: string;
    projectId?: string;
  }>;
}

export default async function AnalisisPage(props: AnalisisPageProps) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Silakan masuk terlebih dahulu.</div>;
  }

  // Fetch projects and datasets
  const [projects, datasets] = await Promise.all([
    db.project.findMany({
      where: { ownerId: userId },
      include: {
        datasets: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    db.dataset.findMany({
      where: { ownerId: userId },
      include: {
        project: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (datasets.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
            WORKBENCH STATISTIKA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
            Analisis Statistik<span className="text-[#3984f5]">.</span>
          </h1>
          <p className="text-[13.5px] text-[#57667c] mt-0.5">
            Mulai dengan satu dataset untuk menjalankan uji statistik.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e9edf3] p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#edf5ff] text-[#3984f5] flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#243149]">
            Belum ada dataset penelitian
          </h3>
          <p className="text-xs text-[#57667c] leading-relaxed">
            Upload file CSV atau Excel (.xlsx/.xls) terlebih dahulu agar mesin statistik dapat membaca variabel penelitian Anda.
          </p>
          <div className="pt-2">
            <Link
              href="/dataset/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload dataset sekarang</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnalysisWorkbench
      projects={projects as any}
      datasets={datasets as any}
      initialDatasetId={searchParams.datasetId}
      initialProjectId={searchParams.projectId}
    />
  );
}

