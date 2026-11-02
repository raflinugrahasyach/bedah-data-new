import React from "react";
import { db } from "@/lib/db";
import {
  Database,
  Lock,
  FileSpreadsheet,
  AlertCircle,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDataPlatformPage() {
  // Query metadata ONLY - strict projection, no raw rows or chat content
  const [projects, datasets] = await Promise.all([
    db.project.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        method: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            analyses: true,
            datasets: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    db.dataset.findMany({
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        rowCount: true,
        columnCount: true,
        missingCount: true,
        createdAt: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
          <span>METADATA PLATFORM OPERASIONAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
          Data Platform (Metadata Only)<span className="text-[#3984f5]">.</span>
        </h1>
        <p className="text-[13.5px] text-[#57667c] mt-0.5">
          Monitoring aktivitas proyek dan dataset seluruh pengguna. Privasi data pengguna terlindungi secara mutlak.
        </p>
      </div>

      {/* Zero Knowledge Privacy Notice */}
      <div className="bg-[#edf5ff] border border-[#d6e6fe] rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white border border-[#d6e6fe] flex items-center justify-center text-[#3984f5] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-[#243149]">
          <div className="font-bold flex items-center gap-2">
            <span>Standar Kepatuhan UU PDP: Zero-Knowledge Dataset Content</span>
            <span className="bg-[#3984f5] text-white px-2 py-0.2 rounded-full text-[10px]">
              Strict Enforcement
            </span>
          </div>
          <p className="text-[#57667c] leading-relaxed">
            Super Admin hanya memiliki akses melihat metadata teknis (nama file, jumlah baris, ukuran file, judul riset).
            Sistem secara arsitektural <b>tidak memiliki API maupun tombol</b> untuk mengintip isi baris data mentah, jawaban responden, maupun percakapan konsultasi Bedah AI milik pengguna.
          </p>
        </div>
      </div>

      {/* Metadata Datasets Table */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8faff] border-b border-[#e9edf3] flex items-center justify-between">
          <h3 className="font-bold text-xs text-[#243149]">
            Metadata Dataset Tersimpan ({datasets.length} Dataset)
          </h3>
          <span className="text-[11px] text-[#738196] flex items-center gap-1">
            <EyeOff className="w-3.5 h-3.5 text-[#94a3b8]" />
            <span>Isi data tidak dapat diakses admin</span>
          </span>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
              <th className="py-3 px-5">Nama File Dataset</th>
              <th className="py-3 px-5">Pemilik (Peneliti)</th>
              <th className="py-3 px-5">Terkait Proyek</th>
              <th className="py-3 px-5">Ukuran Baris &amp; Kolom</th>
              <th className="py-3 px-5">Format</th>
              <th className="py-3 px-5 text-right">Tanggal Upload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3f8]">
            {datasets.map((d) => (
              <tr key={d.id} className="hover:bg-[#fafcff]">
                <td className="py-3.5 px-5 font-bold text-[#243149]">
                  {d.fileName}
                </td>
                <td className="py-3.5 px-5">
                  <div className="font-semibold text-[#243149]">{d.owner.name}</div>
                  <div className="text-[11px] text-[#738196]">{d.owner.email}</div>
                </td>
                <td className="py-3.5 px-5 text-[#57667c]">
                  {d.project?.title || "-"}
                </td>
                <td className="py-3.5 px-5 font-mono text-[#243149]">
                  {d.rowCount} baris &middot; {d.columnCount} kolom
                </td>
                <td className="py-3.5 px-5">
                  <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-[#f1f5f9] text-[#57667c] uppercase">
                    {d.fileType}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right text-[#57667c]">
                  {new Date(d.createdAt).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Metadata Projects Table */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8faff] border-b border-[#e9edf3]">
          <h3 className="font-bold text-xs text-[#243149]">
            Metadata Proyek Penelitian Seluruh Pengguna ({projects.length} Proyek)
          </h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
              <th className="py-3 px-5">Judul Proyek</th>
              <th className="py-3 px-5">Pemilik</th>
              <th className="py-3 px-5">Metode</th>
              <th className="py-3 px-5">Total Komputasi</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Diperbarui</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3f8]">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-[#fafcff]">
                <td className="py-3.5 px-5 font-bold text-[#243149]">{p.title}</td>
                <td className="py-3.5 px-5 text-[#57667c]">{p.owner.name}</td>
                <td className="py-3.5 px-5 text-[#57667c]">{p.method || "Regresi Linier"}</td>
                <td className="py-3.5 px-5 text-[#57667c]">
                  {p._count.analyses} Analisis
                </td>
                <td className="py-3.5 px-5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                      p.status === "VALIDATED"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right text-[#57667c]">
                  {new Date(p.updatedAt).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

