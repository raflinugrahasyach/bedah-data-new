import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  FolderOpen,
  Database,
  BarChart3,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
  CheckCircle2,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import { ProjectStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || "Peneliti Riset";
  const userId = session?.user?.id;

  // Query database for user's metrics & projects
  let totalProjects = 4;
  let totalDatasets = 4;
  let completedAnalyses = 3;
  let validatedResults = 2;
  let projects: any[] = [];

  if (userId) {
    const [projCount, dataCount, analysisCount, validCount, recentProjects] = await Promise.all([
      db.project.count({ where: { ownerId: userId } }),
      db.dataset.count({ where: { ownerId: userId } }),
      db.analysisResult.count({
        where: { project: { ownerId: userId }, status: "DONE" },
      }),
      db.validation.count({
        where: { analysis: { project: { ownerId: userId } }, status: "PASSED" },
      }),
      db.project.findMany({
        where: { ownerId: userId },
        include: { datasets: true, analyses: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

    if (projCount > 0) {
      totalProjects = projCount;
      totalDatasets = dataCount;
      completedAnalyses = analysisCount;
      validatedResults = validCount;
      projects = recentProjects;
    }
  }

  // Format method string into readable Indonesian
  const getMethodName = (m: string | null) => {
    switch (m) {
      case "SIMPLE_REGRESSION":
        return "Regresi Linear Sederhana";
      case "MULTIPLE_REGRESSION":
        return "Regresi Linear Berganda";
      case "PEARSON":
        return "Korelasi Pearson";
      case "DESCRIPTIVE":
        return "Statistik Deskriptif";
      case "VALIDITY":
        return "Uji Validitas";
      case "RELIABILITY":
        return "Uji Reliabilitas";
      case "CLASSICAL_ASSUMPTIONS":
        return "Uji Asumsi Klasik";
      default:
        return "Regresi Linear Sederhana";
    }
  };

  // Calculate percentage of validated results
  const validationPct =
    totalProjects > 0 ? Math.round((validatedResults / totalProjects) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
            <span>RUANG UNTUK TEMUAN BARU</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
            Selamat datang, {userName}.
          </h1>
          <p className="text-[13.5px] text-[#57667c] mt-0.5">
            Ide besar Anda dimulai dari data. Yuk, lanjutkan penelitian hari ini.
          </p>
        </div>

        <Link
          href="/proyek/baru"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-semibold text-[13.5px] rounded-xl shadow-sm transition-all shrink-0"
        >
          <span>+ Proyek baru</span>
        </Link>
      </div>

      {/* 2. Hero Card: Partner Cerdas Penelitian Anda */}
      <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[#edf5ff] via-[#f4f8ff] to-[#e8f1fc] border border-[#d8e6fa] p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_20px_rgba(57,132,245,0.05)]">
        {/* Left Text */}
        <div className="max-w-md z-10">
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] text-[#3984f5] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PARTNER CERDAS PENELITIAN ANDA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243149] leading-[1.25]">
            Riset lebih mudah.
            <br />
            Insight lebih bermakna.
          </h2>
          <p className="mt-2.5 text-[13px] text-[#57667c] leading-relaxed">
            Dari data mentah hingga temuan yang berarti. Mulai perjalanan penelitian Anda bersama AI.
          </p>
          <Link
            href="/proyek/baru"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-semibold text-[13.5px] rounded-xl shadow-md shadow-[#3984f5]/25 transition-all"
          >
            <span>Mulai penelitian</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right Graphic Preview */}
        <div className="relative w-full max-w-sm md:w-[320px] h-[160px] hidden sm:block shrink-0">
          {/* Top floating card */}
          <div className="absolute right-0 top-0 bg-white/95 backdrop-blur-sm rounded-xl border border-[#dce6f2] shadow-sm p-3.5 w-64 z-10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#243149]">Data menjadi cerita.</span>
              <span className="text-[9px] font-semibold text-[#3984f5] bg-[#edf5ff] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Didukung AI
              </span>
            </div>
            <p className="text-[10px] text-[#738196]">Setiap insight, satu langkah maju</p>
            {/* Mini wave chart line */}
            <div className="h-6 mt-2 flex items-end gap-1">
              <div className="w-3 bg-[#dbeafe] h-[30%] rounded-t" />
              <div className="w-3 bg-[#93c5fd] h-[50%] rounded-t" />
              <div className="w-3 bg-[#60a5fa] h-[75%] rounded-t" />
              <div className="w-3 bg-[#3984f5] h-[100%] rounded-t" />
              <div className="w-3 bg-[#60a5fa] h-[60%] rounded-t" />
              <div className="w-3 bg-[#93c5fd] h-[85%] rounded-t" />
            </div>
          </div>

          {/* Bottom floating card */}
          <div className="absolute left-0 bottom-0 bg-white/95 backdrop-blur-sm rounded-xl border border-[#dce6f2] shadow-sm p-3 w-60 z-20 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#e8f7ee] text-[#16a34a] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#243149]">Lebih yakin dengan hasil Anda</div>
              <div className="text-[9.5px] text-[#738196]">Analisis terstruktur &amp; tervalidasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ringkasan Penelitian Anda (4 KPI Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-[16px] font-bold text-[#243149]">Ringkasan penelitian Anda</h3>
          <span className="text-[12px] font-medium text-[#16a34a] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ruang kerja pribadi</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Proyek */}
          <Link
            href="/proyek"
            className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-[0_2px_8px_rgba(36,49,73,0.03)] hover:border-[#3984f5] transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#57667c]">Total Proyek</span>
              <div className="w-8 h-8 rounded-lg bg-[#f0f4fb] text-[#3984f5] flex items-center justify-center group-hover:bg-[#3984f5] group-hover:text-white transition-colors">
                <FolderOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#243149]">
                {String(totalProjects).padStart(2, "0")}
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#a0abba] group-hover:text-[#3984f5] transition-colors" />
            </div>
            <p className="mt-2 text-[11px] text-[#738196] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
              <span>Penelitian dalam satu ruang</span>
            </p>
          </Link>

          {/* Card 2: Dataset Tersimpan */}
          <Link
            href="/dataset"
            className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-[0_2px_8px_rgba(36,49,73,0.03)] hover:border-[#3984f5] transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#57667c]">Dataset Tersimpan</span>
              <div className="w-8 h-8 rounded-lg bg-[#f0f4fb] text-[#3984f5] flex items-center justify-center group-hover:bg-[#3984f5] group-hover:text-white transition-colors">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#243149]">
                {String(totalDatasets).padStart(2, "0")}
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#a0abba] group-hover:text-[#3984f5] transition-colors" />
            </div>
            <p className="mt-2 text-[11px] text-[#738196] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
              <span>Data siap untuk dianalisis</span>
            </p>
          </Link>

          {/* Card 3: Analisis Selesai */}
          <Link
            href="/analisis"
            className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-[0_2px_8px_rgba(36,49,73,0.03)] hover:border-[#3984f5] transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#57667c]">Analisis Selesai</span>
              <div className="w-8 h-8 rounded-lg bg-[#f0f4fb] text-[#3984f5] flex items-center justify-center group-hover:bg-[#3984f5] group-hover:text-white transition-colors">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#243149]">
                {String(completedAnalyses).padStart(2, "0")}
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#a0abba] group-hover:text-[#3984f5] transition-colors" />
            </div>
            <p className="mt-2 text-[11px] text-[#738196] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
              <span>Dari angka menjadi insight</span>
            </p>
          </Link>

          {/* Card 4: Hasil Tervalidasi */}
          <Link
            href="/validasi"
            className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-[0_2px_8px_rgba(36,49,73,0.03)] hover:border-[#16a34a] transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#57667c]">Hasil Tervalidasi</span>
              <div className="w-8 h-8 rounded-lg bg-[#e8f7ee] text-[#16a34a] flex items-center justify-center group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#243149]">
                {String(validatedResults).padStart(2, "0")}
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#a0abba] group-hover:text-[#16a34a] transition-colors" />
            </div>
            <p className="mt-2 text-[11px] text-[#738196] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              <span>Lolos pemeriksaan komputasi</span>
            </p>
          </Link>
        </div>
      </div>

      {/* 4. Proyek Penelitian Terbaru */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-[0_2px_8px_rgba(36,49,73,0.03)] overflow-hidden">
        {/* Table Top Header */}
        <div className="p-5 pb-3 border-b border-[#f0f3f8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold text-[#243149]">Proyek penelitian terbaru</h3>
            <span className="text-[11px] font-semibold bg-[#f0f3f8] text-[#57667c] px-2 py-0.5 rounded-full">
              {projects.length}
            </span>
          </div>
          <Link
            href="/proyek"
            className="text-[13px] font-semibold text-[#3984f5] hover:underline flex items-center gap-1"
          >
            <span>Lihat semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter sub-tabs */}
        <div className="px-5 pt-3 pb-2 flex items-center gap-6 border-b border-[#f8faff] text-[13px]">
          <button className="font-bold text-[#3984f5] border-b-2 border-[#3984f5] pb-2">
            Semua proyek
          </button>
          <button className="text-[#738196] hover:text-[#243149] pb-2">Dalam proses</button>
          <button className="text-[#738196] hover:text-[#243149] pb-2">Tervalidasi</button>
        </div>

        {/* Project Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="text-[11px] font-semibold text-[#738196] uppercase border-b border-[#f0f3f8] bg-[#fafcff]">
                <th className="py-3 px-5">Nama proyek &darr;</th>
                <th className="py-3 px-5">Metode analisis</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3f8]">
              {projects.map((p) => {
                const dataset = p.datasets?.[0];
                const rowCount = dataset?.rowCount || 120;
                const colCount = dataset?.columnCount || 4;

                let statusBadge = (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0f4fb] text-[#3984f5]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
                    Selesai
                  </span>
                );

                if (p.status === ProjectStatus.VALIDATED) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e8f7ee] text-[#15803d]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                      Tervalidasi
                    </span>
                  );
                } else if (p.status === ProjectStatus.IN_PROGRESS) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff6e5] text-[#b45309]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                      Dalam proses
                    </span>
                  );
                }

                return (
                  <tr key={p.id} className="hover:bg-[#fafcff] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#edf5ff] text-[#3984f5] flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div>
                          <Link
                            href={`/proyek/${p.id}`}
                            className="font-semibold text-[#243149] hover:text-[#3984f5] transition-colors"
                          >
                            {p.title}
                          </Link>
                          <p className="text-[11.5px] text-[#738196]">
                            {rowCount} responden &middot; {colCount} variabel
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[#57667c]">
                      {getMethodName(p.method)}
                    </td>
                    <td className="py-3.5 px-5">{statusBadge}</td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        className="p-1 text-[#a0abba] hover:text-[#243149] rounded hover:bg-[#f0f3f8] transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-center border-t border-[#f0f3f8] text-[12px] text-[#738196]">
          Setiap proyek, selangkah lebih dekat ke temuan baru.
        </div>
      </div>

      {/* 5. Asisten Riset Anda (Bedah AI Shortcuts) */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-[0_2px_8px_rgba(36,49,73,0.03)]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[16px] font-bold text-[#243149]">Asisten riset Anda</h3>
          <span className="text-[11px] font-bold text-[#3984f5] bg-[#edf5ff] px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bedah AI</span>
          </span>
        </div>
        <p className="text-[13px] text-[#738196] mb-5">Lebih terarah di setiap langkah.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/advisor?prompt=Metode%20apa%20yang%20tepat%20untuk%20penelitian%20saya%3F"
            className="p-4 rounded-xl border border-[#e9edf3] hover:border-[#3984f5] hover:bg-[#fafcff] transition-all group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#edf5ff] text-[#3984f5] flex items-center justify-center mb-3 group-hover:bg-[#3984f5] group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-[13.5px] font-bold text-[#243149]">Temukan metode yang tepat</h4>
            <p className="text-[12px] text-[#738196] mt-0.5 leading-snug">
              Diskusikan desain riset bersama AI
            </p>
          </Link>

          <Link
            href="/analisis"
            className="p-4 rounded-xl border border-[#e9edf3] hover:border-[#3984f5] hover:bg-[#fafcff] transition-all group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#edf5ff] text-[#3984f5] flex items-center justify-center mb-3 group-hover:bg-[#3984f5] group-hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h4 className="text-[13.5px] font-bold text-[#243149]">Biar data yang berbicara</h4>
            <p className="text-[12px] text-[#738196] mt-0.5 leading-snug">
              Jalankan analisis statistik Anda
            </p>
          </Link>

          <Link
            href="/validasi"
            className="p-4 rounded-xl border border-[#e9edf3] hover:border-[#16a34a] hover:bg-[#fafcff] transition-all group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#e8f7ee] text-[#16a34a] flex items-center justify-center mb-3 group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-[13.5px] font-bold text-[#243149]">Pastikan hasilnya konsisten</h4>
            <p className="text-[12px] text-[#738196] mt-0.5 leading-snug">
              Periksa ulang hasil perhitungan
            </p>
          </Link>
        </div>
      </div>

      {/* 6. Two-Column Row: Data Anda dalam Perspektif & Perjalanan Penelitian */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Data Distribution Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-[0_2px_8px_rgba(36,49,73,0.03)] flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#243149]">Data Anda, dalam perspektif</h3>
            <p className="text-[13px] text-[#738196] mt-0.5">Distribusi hasil belajar</p>

            {/* Histogram bars */}
            <div className="mt-8 h-44 flex items-end justify-between gap-3 px-2 border-b border-[#e9edf3] pb-2">
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#738196]">1</span>
                <div className="w-full bg-[#bfdbfe] hover:bg-[#3984f5] transition-colors rounded-t h-20" />
                <span className="text-[10.5px] text-[#738196] mt-1">50</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-transparent">-</span>
                <div className="w-full bg-[#e2ecf9] rounded-t h-1" />
                <span className="text-[10.5px] text-[#738196] mt-1">56</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-transparent">-</span>
                <div className="w-full bg-[#e2ecf9] rounded-t h-1" />
                <span className="text-[10.5px] text-[#738196] mt-1">61</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#738196]">2</span>
                <div className="w-full bg-[#3984f5] rounded-t h-36" />
                <span className="text-[10.5px] text-[#738196] mt-1">67</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#738196]">1</span>
                <div className="w-full bg-[#bfdbfe] hover:bg-[#3984f5] transition-colors rounded-t h-20" />
                <span className="text-[10.5px] text-[#738196] mt-1">73</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-transparent">-</span>
                <div className="w-full bg-[#e2ecf9] rounded-t h-1" />
                <span className="text-[10.5px] text-[#738196] mt-1">79</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#738196]">2</span>
                <div className="w-full bg-[#bfdbfe] hover:bg-[#3984f5] transition-colors rounded-t h-36" />
                <span className="text-[10.5px] text-[#738196] mt-1">84</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-[#738196]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
              6 observasi valid
            </span>
            <span>Nilai variabel &rarr;</span>
          </div>
        </div>

        {/* Right: Perjalanan Penelitian (Donut / Progress) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-[0_2px_8px_rgba(36,49,73,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#243149]">Perjalanan penelitian</h3>
              <BarChart3 className="w-4 h-4 text-[#a0abba]" />
            </div>
            <p className="text-[13px] text-[#738196] mt-0.5">Satu langkah pada satu waktu.</p>

            <div className="mt-6 flex items-center justify-center gap-8">
              {/* Donut graphic */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background ring */}
                  <path
                    className="text-[#f0f3f8]"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress ring */}
                  <path
                    className="text-[#3984f5]"
                    strokeDasharray={`${validationPct}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold text-[#243149] block leading-none">
                    {validationPct}%
                  </span>
                  <span className="text-[10px] text-[#738196] font-medium uppercase tracking-wider block mt-0.5">
                    tervalidasi
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3 text-[12.5px]">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3984f5]" />
                    <span className="text-[#57667c]">Tervalidasi</span>
                  </div>
                  <span className="font-bold text-[#243149]">{validatedResults}</span>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#93c5fd]" />
                    <span className="text-[#57667c]">Analisis selesai</span>
                  </div>
                  <span className="font-bold text-[#243149]">
                    {completedAnalyses - validatedResults > 0 ? completedAnalyses - validatedResults : 1}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d8e1ee]" />
                    <span className="text-[#57667c]">Dalam proses</span>
                  </div>
                  <span className="font-bold text-[#243149]">
                    {totalProjects - completedAnalyses > 0 ? totalProjects - completedAnalyses : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#f0f3f8] text-[11.5px] text-[#738196] flex items-center gap-2">
            <span>📄 Riset yang terstruktur, hasil yang lebih jelas.</span>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="pt-8 border-t border-[#edf2f9] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#92a0b3]">
        <p>&copy; 2026 Bedah Data. Dibuat untuk rasa ingin tahu.</p>
        <button className="flex items-center gap-1.5 text-[#57667c] hover:text-[#243149]">
          <span>Panduan &bull; Ruang penelitian Anda</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </footer>
    </div>
  );
}
