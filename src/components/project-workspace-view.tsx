"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  TrendingUp,
  ShieldCheck,
  FileText,
  Play,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Layers,
  Table,
} from "lucide-react";

interface ProjectWorkspaceViewProps {
  project: any;
}

export function ProjectWorkspaceView({ project }: ProjectWorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "dataset" | "analyses" | "validation" | "report"
  >("overview");

  const dataset = project.datasets?.[0];
  const analyses = project.analyses || [];
  const latestValidation = project.validations?.[0] || project.analyses?.[0]?.validation;

  return (
    <div className="space-y-6">
      {/* Project Header Banner */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-[0_2px_8px_rgba(36,49,73,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase">
                RUANG RISET AKTIF
              </span>
              <span>&middot;</span>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  project.status === "VALIDATED"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : project.status === "COMPLETED"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                {project.status === "VALIDATED"
                  ? "Tervalidasi"
                  : project.status === "COMPLETED"
                  ? "Selesai"
                  : "Dalam proses"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
              {project.title}
            </h1>
            <p className="text-xs text-[#57667c]">
              Diperbarui pada: {new Date(project.updatedAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/analisis?projectId=${project.id}&datasetId=${dataset?.id || ""}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3984f5] hover:bg-[#2672df] text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Jalankan Analisis</span>
            </Link>
            <Link
              href={`/validasi?projectId=${project.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#edf5ff] hover:bg-[#d6e6fe] text-[#3984f5] font-semibold text-xs rounded-xl transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Validasi</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-t border-[#f0f3f8] pt-4 overflow-x-auto text-xs">
          {[
            { id: "overview", label: "Ringkasan Riset" },
            { id: "dataset", label: `Dataset (${dataset ? dataset.fileName : "0"})` },
            { id: "analyses", label: `Riwayat Analisis (${analyses.length})` },
            { id: "validation", label: "Audit Validasi" },
            { id: "report", label: "Laporan Riset" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-bold rounded-xl transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#3984f5] text-white shadow-xs"
                  : "text-[#57667c] hover:bg-[#f8faff] hover:text-[#243149]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: RINGKASAN */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Hypothesis Box */}
            <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 space-y-2 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#738196] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3984f5]" />
                Hipotesis &amp; Pertanyaan Penelitian
              </div>
              <p className="text-xs text-[#243149] font-medium leading-relaxed">
                {project.hypothesis || "Belum ada hipotesis spesifik yang dicatat."}
              </p>
            </div>

            {/* Description Box */}
            {project.description && (
              <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 space-y-2 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#738196]">
                  Latar Belakang &amp; Catatan
                </div>
                <p className="text-xs text-[#57667c] leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* Workflow Progress */}
            <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 space-y-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#738196]">
                Alur Tahapan Riset (Research Roadmap)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 space-y-1">
                  <div className="font-bold text-green-800">1. Data Siap</div>
                  <div className="text-[11px] text-green-700">Dataset ditautkan</div>
                </div>
                <div
                  className={`p-3 rounded-xl border space-y-1 ${
                    analyses.length > 0
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-[#fafcff] border-[#e9edf3] text-[#738196]"
                  }`}
                >
                  <div className="font-bold">2. Analisis</div>
                  <div className="text-[11px]">{analyses.length} komputasi selesai</div>
                </div>
                <div
                  className={`p-3 rounded-xl border space-y-1 ${
                    project.status === "VALIDATED"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-[#fafcff] border-[#e9edf3] text-[#738196]"
                  }`}
                >
                  <div className="font-bold">3. Validasi</div>
                  <div className="text-[11px]">
                    {project.status === "VALIDATED" ? "Lolos uji komputasi" : "Belum divalidasi"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#fafcff] border border-[#e9edf3] text-[#738196] space-y-1">
                  <div className="font-bold">4. Laporan</div>
                  <div className="text-[11px]">Siap ekspor PDF/Word</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#738196]">
                Ringkasan Data
              </div>
              {dataset ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-[#f0f3f8]">
                    <span className="text-[#57667c]">Nama File:</span>
                    <span className="font-bold text-[#243149] truncate max-w-[140px]">{dataset.fileName}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#f0f3f8]">
                    <span className="text-[#57667c]">Jumlah Responden:</span>
                    <span className="font-bold text-[#243149]">{dataset.rowCount} baris</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#f0f3f8]">
                    <span className="text-[#57667c]">Jumlah Variabel:</span>
                    <span className="font-bold text-[#243149]">{dataset.columnCount} kolom</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#57667c]">Format:</span>
                    <span className="font-bold text-[#3984f5] uppercase">{dataset.fileType}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#738196]">Belum ada dataset yang ditautkan ke proyek ini.</div>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#edf5ff] to-[#f4f8ff] border border-[#d6e6fe] rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#3984f5]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Tanya Bedah AI
              </div>
              <p className="text-[11.5px] text-[#57667c]">
                Konsultasikan interpretasi hasil atau pilihan metode riset untuk proyek ini bersama Methodology Advisor.
              </p>
              <Link
                href="/advisor"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#3984f5] hover:underline pt-1"
              >
                <span>Buka chat Bedah AI</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATASET */}
      {activeTab === "dataset" && (
        <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#243149]">Dataset Riset Terhubung</h3>
              <p className="text-xs text-[#57667c]">Informasi skema variabel yang dianalisis pada proyek ini.</p>
            </div>
            <Link
              href="/dataset/upload"
              className="text-xs font-semibold text-[#3984f5] hover:underline"
            >
              Ganti / Upload baru &rarr;
            </Link>
          </div>

          {dataset ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#fafcff] rounded-xl border border-[#e9edf3]">
                  <div className="text-[#738196]">Responden</div>
                  <div className="text-lg font-black text-[#243149]">{dataset.rowCount}</div>
                </div>
                <div className="p-3 bg-[#fafcff] rounded-xl border border-[#e9edf3]">
                  <div className="text-[#738196]">Variabel</div>
                  <div className="text-lg font-black text-[#243149]">{dataset.columnCount}</div>
                </div>
                <div className="p-3 bg-[#fafcff] rounded-xl border border-[#e9edf3]">
                  <div className="text-[#738196]">Missing Values</div>
                  <div className="text-lg font-black text-[#16a34a]">{dataset.missingCount}</div>
                </div>
                <div className="p-3 bg-[#fafcff] rounded-xl border border-[#e9edf3]">
                  <div className="text-[#738196]">Ukuran File</div>
                  <div className="text-lg font-black text-[#243149]">
                    {(dataset.fileSize / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>

              {/* Variables List */}
              <div className="border border-[#e9edf3] rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-[#f8faff] border-b border-[#e9edf3] text-xs font-bold text-[#243149]">
                  Daftar Variabel Terdeteksi
                </div>
                <div className="p-4 flex flex-wrap gap-2 text-xs">
                  {Array.isArray(dataset.variables) &&
                    dataset.variables.map((v: any, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-[#f0f4f9] rounded-lg border border-[#e2e8f0] font-medium text-[#243149]"
                      >
                        {typeof v === "string" ? v : `${v.name} (${v.type || "NUMERIC"})`}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#738196]">Tidak ada dataset.</p>
          )}
        </div>
      )}

      {/* TAB 3: RIWAYAT ANALISIS */}
      {activeTab === "analyses" && (
        <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-sm overflow-hidden">
          <div className="p-4 bg-[#f8faff] border-b border-[#e9edf3] flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#243149]">Riwayat Analisis Statistik</h3>
            <Link
              href={`/analisis?projectId=${project.id}`}
              className="text-xs font-semibold text-[#3984f5] hover:underline"
            >
              + Jalankan Analisis Baru
            </Link>
          </div>

          {analyses.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#738196] space-y-2">
              <p>Belum ada hasil analisis yang disimpan pada proyek ini.</p>
              <Link
                href={`/analisis?projectId=${project.id}`}
                className="inline-block text-[#3984f5] font-bold hover:underline"
              >
                Jalankan komputasi sekarang &rarr;
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
                  <th className="py-3 px-5">Metode</th>
                  <th className="py-3 px-5">Waktu Komputasi</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3f8]">
                {analyses.map((a: any) => (
                  <tr key={a.id} className="hover:bg-[#fafcff]">
                    <td className="py-3 px-5 font-bold text-[#243149]">{a.method}</td>
                    <td className="py-3 px-5 text-[#57667c]">
                      {new Date(a.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-green-50 text-green-700 border border-green-200">
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <Link
                        href={`/analisis?projectId=${project.id}`}
                        className="text-[#3984f5] font-semibold hover:underline"
                      >
                        Buka &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT VALIDASI */}
      {activeTab === "validation" && (
        <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#243149]">Research Validation Engine Stamp</h3>
              <p className="text-xs text-[#57667c]">
                Verifikasi independen dual-engine (Statsmodels vs Scipy) dengan toleransi selisih &lt; 10⁻⁶.
              </p>
            </div>
            <Link
              href={`/validasi?projectId=${project.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3984f5] text-white text-xs font-bold rounded-xl"
            >
              <span>Uji Ulang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2e8f0] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#243149]">Status Validasi Proyek:</div>
              <div className="text-lg font-black text-[#16a34a] mt-0.5">
                {project.status === "VALIDATED" ? "TERVALIDASI (Lolos Uji)" : "MENUNGGU VALIDASI"}
              </div>
            </div>
            <ShieldCheck className="w-8 h-8 text-[#16a34a]" />
          </div>
        </div>
      )}

      {/* TAB 5: LAPORAN */}
      {activeTab === "report" && (
        <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#243149]">Laporan Akademik Siap Pakai</h3>
              <p className="text-xs text-[#57667c]">Format standar untuk skripsi, tesis, atau publikasi ilmiah.</p>
            </div>
            <Link
              href="/laporan"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3984f5] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Buka Builder Laporan &amp; Ekspor</span>
            </Link>
          </div>
          <p className="text-xs text-[#57667c]">
            Laporan menyertakan bab pendahuluan, tinjauan data, tabel ANOVA, koefisien regresi, interpretasi otomatis Bedah AI, dan stempel validasi komputasi.
          </p>
        </div>
      )}
    </div>
  );
}

