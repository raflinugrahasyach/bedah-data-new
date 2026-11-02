import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Database, Upload, FileSpreadsheet, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DatasetPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let datasets: any[] = [];
  if (userId) {
    datasets = await db.dataset.findMany({
      where: { ownerId: userId },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
            DATA MENTAH RISET
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
            Dataset Saya<span className="text-[#3984f5]">.</span>
          </h1>
          <p className="text-[13.5px] text-[#57667c] mt-0.5">
            Format yang didukung: CSV, XLSX, dan XLS (Excel). File SPSS (.sav) tidak didukung.
          </p>
        </div>

        <Link
          href="/dataset/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-semibold text-[13.5px] rounded-xl shadow-sm transition-all shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload dataset</span>
        </Link>
      </div>

      {/* Dataset Guidelines Box */}
      <div className="bg-[#edf5ff] border border-[#d6e6fe] rounded-2xl p-5 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-[#3984f5] shrink-0 mt-0.5" />
        <div className="text-[13px] text-[#243149] space-y-1">
          <div className="font-bold">Aturan Data Penelitian:</div>
          <p className="text-[#57667c]">
            Baris pertama = nama variabel. Satu baris = satu responden. Maksimal 10 MB, 50 kolom, dan 10.000 baris.
            Jangan sertakan nama asli/identitas pribadi responden (gunakan kode anonim).
          </p>
        </div>
      </div>

      {/* Datasets Table */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-[0_2px_8px_rgba(36,49,73,0.03)] overflow-hidden">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="text-[11px] font-semibold text-[#738196] uppercase border-b border-[#f0f3f8] bg-[#fafcff]">
              <th className="py-3 px-5">File dataset</th>
              <th className="py-3 px-5">Terkait proyek</th>
              <th className="py-3 px-5">Ukuran data</th>
              <th className="py-3 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3f8]">
            {datasets.map((d) => (
              <tr key={d.id} className="hover:bg-[#fafcff] transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#edf5ff] text-[#3984f5] flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#243149]">{d.fileName}</div>
                      <div className="text-[11.5px] text-[#738196] uppercase">{d.fileType}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-[#57667c]">
                  {d.project?.title || "Belum ditautkan"}
                </td>
                <td className="py-3.5 px-5 text-[#57667c]">
                  {d.rowCount} baris &middot; {d.columnCount} kolom
                </td>
                <td className="py-3.5 px-5 text-right">
                  <Link
                    href={`/analisis?datasetId=${d.id}`}
                    className="text-[12px] font-semibold text-[#3984f5] hover:underline"
                  >
                    Analisis dataset &rarr;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
