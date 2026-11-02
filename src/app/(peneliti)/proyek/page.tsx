import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { FileSpreadsheet, Plus, Search, MoreHorizontal } from "lucide-react";
import { ProjectStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ProyekPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let projects: any[] = [];
  if (userId) {
    projects = await db.project.findMany({
      where: { ownerId: userId },
      include: { datasets: true, analyses: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
            MANAJEMEN RISET
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
            Proyek Penelitian<span className="text-[#3984f5]">.</span>
          </h1>
          <p className="text-[13.5px] text-[#57667c] mt-0.5">
            Setiap pertanyaan punya tempat. Kelola semua penelitian Anda di sini.
          </p>
        </div>

        <Link
          href="/proyek/baru"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-semibold text-[13.5px] rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Proyek baru</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_2px_8px_rgba(36,49,73,0.02)]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul proyek..."
            className="w-full pl-9 pr-4 py-2 text-[13px] rounded-xl border border-[#e2e8f0] focus:outline-none focus:border-[#3984f5]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#738196]">Status:</span>
          <select className="text-xs border border-[#e2e8f0] rounded-lg px-2.5 py-1.5 bg-white text-[#243149] focus:outline-none">
            <option>Semua status</option>
            <option>Dalam proses</option>
            <option>Selesai</option>
            <option>Tervalidasi</option>
          </select>
        </div>
      </div>

      {/* Project List Table */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-[0_2px_8px_rgba(36,49,73,0.03)] overflow-hidden">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="text-[11px] font-semibold text-[#738196] uppercase border-b border-[#f0f3f8] bg-[#fafcff]">
              <th className="py-3 px-5">Nama proyek</th>
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
                    {p.method ? p.method.replace("_", " ") : "Regresi Linear Sederhana"}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e8f7ee] text-[#15803d]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      className="p-1 text-[#a0abba] hover:text-[#243149] rounded hover:bg-[#f0f3f8]"
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
    </div>
  );
}
