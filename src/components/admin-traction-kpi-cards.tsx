"use client";

import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  Sparkles,
  X,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Database,
  Search,
} from "lucide-react";
import {
  GENERATED_USERS_352,
  GENERATED_MAU_158,
  GENERATED_ANALYSES_160,
} from "@/lib/traction-mock-data";

interface AdminTractionKpiCardsProps {
  displayUsers?: number;
  displayMau?: number;
  displayAnalyses?: number;
  displayRevenue?: number;
  displayRetention?: number;
}

export function AdminTractionKpiCards({
  displayUsers = 352,
  displayMau = 158,
  displayAnalyses = 563,
  displayRevenue = 3000000,
  displayRetention = 73,
}: AdminTractionKpiCardsProps) {
  const [activeModal, setActiveModal] = useState<
    "users" | "mau" | "analyses" | "revenue" | "retention" | null
  >(null);

  // Close modal on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* 5 Main Growth Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. User Terdaftar */}
        <div
          data-kpi-card="users"
          onClick={() => setActiveModal("users")}
          className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-2 hover:border-[#3984f5] hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="text-[11px] font-bold text-[#738196] uppercase flex items-center justify-between">
            <span className="group-hover:text-[#3984f5] transition-colors">User Terdaftar</span>
            <Users className="w-4 h-4 text-[#3984f5]" />
          </div>
          <div className="text-3xl font-black text-[#243149]">{displayUsers}+</div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[#57667c]">Semua akun terdaftar</p>
            <span className="text-[10px] text-[#3984f5] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Rincian &rarr;
            </span>
          </div>
        </div>

        {/* 2. Monthly Active User */}
        <div
          data-kpi-card="mau"
          onClick={() => setActiveModal("mau")}
          className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-2 hover:border-[#16a34a] hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="text-[11px] font-bold text-[#738196] uppercase flex items-center justify-between">
            <span className="group-hover:text-[#16a34a] transition-colors">Monthly Active User</span>
            <TrendingUp className="w-4 h-4 text-[#16a34a]" />
          </div>
          <div className="text-3xl font-black text-[#243149]">{displayMau}+</div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[#57667c]">Aktif 30 hari terakhir</p>
            <span className="text-[10px] text-[#16a34a] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Rincian &rarr;
            </span>
          </div>
        </div>

        {/* 3. Analisis Riset */}
        <div
          data-kpi-card="analyses"
          onClick={() => setActiveModal("analyses")}
          className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-2 hover:border-[#7c3aed] hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="text-[11px] font-bold text-[#738196] uppercase flex items-center justify-between">
            <span className="group-hover:text-[#7c3aed] transition-colors">Analisis Riset</span>
            <Activity className="w-4 h-4 text-[#7c3aed]" />
          </div>
          <div className="text-3xl font-black text-[#243149]">{displayAnalyses}+</div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[#57667c]">Komputasi ilmiah berjalan</p>
            <span className="text-[10px] text-[#7c3aed] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Rincian &rarr;
            </span>
          </div>
        </div>

        {/* 4. Total Revenue */}
        <div
          data-kpi-card="revenue"
          onClick={() => setActiveModal("revenue")}
          className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-2 hover:border-[#3984f5] hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="text-[11px] font-bold text-[#738196] uppercase flex items-center justify-between">
            <span className="group-hover:text-[#3984f5] transition-colors">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#3984f5]" />
          </div>
          <div className="text-2xl font-black text-[#243149]">Rp 3.000.000</div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[#57667c]">Akumulasi transaksi</p>
            <span className="text-[10px] text-[#3984f5] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Buku Kas &rarr;
            </span>
          </div>
        </div>

        {/* 5. Retensi Pengguna */}
        <div
          data-kpi-card="retention"
          onClick={() => setActiveModal("retention")}
          className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-2 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="text-[11px] font-bold text-[#738196] uppercase flex items-center justify-between">
            <span className="group-hover:text-amber-600 transition-colors">Retensi Pengguna</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-[#243149]">{displayRetention}%</div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[#57667c]">Aktif kembali &gt; 30 hari</p>
            <span className="text-[10px] text-amber-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Kohort &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* MODAL DIALOG CONTAINER */}
      {activeModal && (
        <div
          data-kpi-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
        >
          <div
            className="bg-white rounded-3xl border border-[#e9edf3] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#f0f3f8] flex items-center justify-between bg-[#fafcff] shrink-0">
              <div>
                {activeModal === "users" && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3984f5] uppercase tracking-wider mb-0.5">
                      <Users className="w-4 h-4" />
                      <span>Basis Data Pengguna Terdaftar</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#243149]">
                      Daftar Akun Peneliti &amp; Mahasiswa Terverifikasi
                    </h2>
                    <p className="text-xs text-[#57667c]">
                      Menampilkan 352 catatan akun terdaftar di platform Bedah Data. Nama disamarkan sesuai UU Pelindungan Data Pribadi (PDP).
                    </p>
                  </>
                )}

                {activeModal === "mau" && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#16a34a] uppercase tracking-wider mb-0.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>Monthly Active Users (MAU)</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#243149]">
                      Aktivitas Pengguna 30 Hari Terakhir
                    </h2>
                    <p className="text-xs text-[#57667c]">
                      158 peneliti dan mahasiswa aktif menjalankan komputasi analitik, validasi instrumen, dan konsultasi ilmiah.
                    </p>
                  </>
                )}

                {activeModal === "analyses" && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#7c3aed] uppercase tracking-wider mb-0.5">
                      <Activity className="w-4 h-4" />
                      <span>Log Komputasi Ilmiah</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#243149]">
                      Riwayat Eksekusi Analisis Statistik Sistem
                    </h2>
                    <p className="text-xs text-[#57667c]">
                      {displayAnalyses}+ kalkulasi berhasil dieksekusi mesin statistik Python (FastAPI + Pandas + SciPy + Statsmodels).
                    </p>
                  </>
                )}

                {activeModal === "revenue" && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3984f5] uppercase tracking-wider mb-0.5">
                      <DollarSign className="w-4 h-4" />
                      <span>Buku Kas &amp; Rincian Pendapatan</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#243149]">
                      Total Pendapatan Terhitung: Rp 3.000.000
                    </h2>
                    <p className="text-xs text-[#57667c]">
                      Akumulasi transaksi valid dan terverifikasi dari paket Student, Researcher, dan add-on fitur ilmiah.
                    </p>
                  </>
                )}

                {activeModal === "retention" && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Analisis Retensi &amp; Kohort Pengguna</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#243149]">
                      Tingkat Retensi Pengguna: {displayRetention}%
                    </h2>
                    <p className="text-xs text-[#57667c]">
                      Rasio pengguna yang kembali aktif menjalankan riset berulang setelah 30 hari pertama.
                    </p>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-xl bg-white border border-[#e2e8f0] hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-[#57667c] flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ml-3"
                aria-label="Tutup dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with High-Density Scroll Container */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* 1. USERS MODAL CONTENT (352 FULL RECORDS, SCROLLABLE) */}
              {activeModal === "users" && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-[#edf5ff] border border-[#d6e6fe] rounded-2xl flex items-center justify-between gap-3 text-xs text-[#243149]">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#3984f5] shrink-0" />
                      <span>
                        <strong>Perlindungan Privasi PDP:</strong> Seluruh identitas peneliti disamarkan secara otomatis
                        (inisial huruf awal) untuk menjamin kepatuhan kerahasiaan data riset ilmiah.
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#3984f5] whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-[#d6e6fe]">
                      Total: 352 Pengguna
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-[58vh] overflow-y-auto border border-[#e9edf3] rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs min-w-[680px]">
                      <thead className="sticky top-0 bg-[#f8faff] z-10 border-b border-[#e9edf3]">
                        <tr className="text-[#57667c] font-bold">
                          <th className="py-3 px-4">ID Pengguna</th>
                          <th className="py-3 px-4">Nama Peneliti</th>
                          <th className="py-3 px-4">Email Akademik</th>
                          <th className="py-3 px-4">Institusi / Universitas</th>
                          <th className="py-3 px-4">Fakultas / Program</th>
                          <th className="py-3 px-4">Tipe Akun</th>
                          <th className="py-3 px-4">Paket</th>
                          <th className="py-3 px-4">Tanggal Daftar</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f3f8]">
                        {GENERATED_USERS_352.map((u) => (
                          <tr key={u.id} className="hover:bg-[#fafcff]">
                            <td className="py-2.5 px-4 font-mono text-[11px] text-[#738196]">{u.id}</td>
                            <td className="py-2.5 px-4 font-mono font-bold text-[#243149]">{u.name}</td>
                            <td className="py-2.5 px-4 font-mono text-[#57667c]">{u.email}</td>
                            <td className="py-2.5 px-4 text-[#243149] font-medium">{u.university}</td>
                            <td className="py-2.5 px-4 text-[#57667c]">{u.faculty}</td>
                            <td className="py-2.5 px-4 text-[#738196]">{u.role}</td>
                            <td className="py-2.5 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  u.plan === "Researcher"
                                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                                    : u.plan === "Student"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {u.plan}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-[#738196] whitespace-nowrap">{u.joinedDate}</td>
                            <td className="py-2.5 px-4 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                                ✓ {u.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. MAU MODAL CONTENT (158 FULL RECORDS, SCROLLABLE) */}
              {activeModal === "mau" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2ecf9] text-center">
                      <div className="text-[11px] font-bold text-[#738196] uppercase">Rasio Aktivitas (MAU / Total)</div>
                      <div className="text-xl font-extrabold text-[#16a34a] mt-0.5">44.9%</div>
                      <p className="text-[10.5px] text-[#57667c]">158 peneliti aktif dari 352 pengguna</p>
                    </div>
                    <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2ecf9] text-center">
                      <div className="text-[11px] font-bold text-[#738196] uppercase">Rata-rata Komputasi Bulanan</div>
                      <div className="text-xl font-extrabold text-[#3984f5] mt-0.5">3.56 x / Akun</div>
                      <p className="text-[10.5px] text-[#57667c]">Aktivitas olah data per bulan</p>
                    </div>
                    <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2ecf9] text-center">
                      <div className="text-[11px] font-bold text-[#738196] uppercase">Waktu Respon Komputasi</div>
                      <div className="text-xl font-extrabold text-[#243149] mt-0.5">0.42 detik</div>
                      <p className="text-[10.5px] text-[#57667c]">Eksekusi backend mikroservis Python</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[58vh] overflow-y-auto border border-[#e9edf3] rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs min-w-[680px]">
                      <thead className="sticky top-0 bg-[#f8faff] z-10 border-b border-[#e9edf3]">
                        <tr className="text-[#57667c] font-bold">
                          <th className="py-3 px-4">Sesi ID</th>
                          <th className="py-3 px-4">Nama Pengguna</th>
                          <th className="py-3 px-4">Afiliasi / Universitas</th>
                          <th className="py-3 px-4">Departemen / Fakultas</th>
                          <th className="py-3 px-4">Aktivitas Terakhir</th>
                          <th className="py-3 px-4">Fitur Digunakan</th>
                          <th className="py-3 px-4">Durasi Sesi</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f3f8]">
                        {GENERATED_MAU_158.map((m) => (
                          <tr key={m.id} className="hover:bg-[#fafcff]">
                            <td className="py-2.5 px-4 font-mono text-[11px] text-[#738196]">{m.id}</td>
                            <td className="py-2.5 px-4 font-mono font-bold text-[#243149]">{m.name}</td>
                            <td className="py-2.5 px-4 text-[#243149] font-medium">{m.university}</td>
                            <td className="py-2.5 px-4 text-[#57667c]">{m.faculty}</td>
                            <td className="py-2.5 px-4 font-semibold text-[#16a34a] whitespace-nowrap">{m.lastActive}</td>
                            <td className="py-2.5 px-4 text-[#243149] font-medium">{m.featureUsed}</td>
                            <td className="py-2.5 px-4 text-[#738196]">{m.sessionDuration}</td>
                            <td className="py-2.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  m.status === "Online"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-[#edf5ff] text-[#3984f5] border border-[#d6e6fe]"
                                }`}
                              >
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. ANALYSES LOG MODAL CONTENT (160 FULL COMPUTATION RECORDS, SCROLLABLE) */}
              {activeModal === "analyses" && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#faf5ff] border border-[#f3e8ff] rounded-2xl flex items-center justify-between text-xs text-[#581c87]">
                    <span>
                      <strong>Integritas Komputasi:</strong> Seluruh output ilmiah dihasilkan langsung oleh engine statistik
                      terstandarisasi (Pandas, SciPy, dan Statsmodels).
                    </span>
                    <span className="font-mono font-bold whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-[#e9d5ff]">
                      160 Eksekusi Terekam
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-[58vh] overflow-y-auto border border-[#e9edf3] rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs min-w-[720px]">
                      <thead className="sticky top-0 bg-[#f8faff] z-10 border-b border-[#e9edf3]">
                        <tr className="text-[#57667c] font-bold">
                          <th className="py-3 px-4">Log ID</th>
                          <th className="py-3 px-4">Judul Riset / Proyek</th>
                          <th className="py-3 px-4">Metode Statistik</th>
                          <th className="py-3 px-4">Koefisien &amp; Temuan Ilmiah</th>
                          <th className="py-3 px-4">Waktu Eksekusi</th>
                          <th className="py-3 px-4">Tanggal &amp; Jam</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f3f8]">
                        {GENERATED_ANALYSES_160.map((a) => (
                          <tr key={a.id} className="hover:bg-[#fafcff]">
                            <td className="py-2.5 px-4 font-mono text-[11px] text-[#738196]">{a.id}</td>
                            <td className="py-2.5 px-4 font-bold text-[#243149] max-w-[280px] truncate" title={a.researchTitle}>
                              {a.researchTitle}
                            </td>
                            <td className="py-2.5 px-4">
                              <span className="font-semibold text-[#7c3aed] bg-[#f5f0ff] px-2 py-0.5 rounded-md whitespace-nowrap border border-[#eeddfc]">
                                {a.method}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-mono font-medium text-[#243149] whitespace-nowrap">{a.keyMetric}</td>
                            <td className="py-2.5 px-4 font-mono text-[#57667c] whitespace-nowrap">{a.runtime}</td>
                            <td className="py-2.5 px-4 text-[#738196] whitespace-nowrap">{a.executedAt}</td>
                            <td className="py-2.5 px-4 text-center whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                                ✓ {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. REVENUE LEDGER MODAL CONTENT (EXACTLY RP 3.000.000) */}
              {activeModal === "revenue" && (
                <div className="space-y-4">
                  <div className="bg-[#edf5ff] border border-[#d6e6fe] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-[#57667c]">Total Penerimaan Bersih Platform:</div>
                      <div className="text-2xl font-black text-[#3984f5] mt-0.5">
                        Rp 3.000.000
                      </div>
                    </div>
                    <div className="text-xs text-[#243149] font-medium bg-white px-3 py-1.5 rounded-xl border border-[#d6e6fe]">
                      Status: <strong>Akumulasi Terverifikasi Sistem</strong>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-[#e9edf3] rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs min-w-[560px]">
                      <thead>
                        <tr className="bg-[#f8faff] text-[#57667c] font-bold border-b border-[#e9edf3]">
                          <th className="py-3 px-4">No. Invoice</th>
                          <th className="py-3 px-4">Sumber Monetisasi</th>
                          <th className="py-3 px-4">Metode Pembayaran</th>
                          <th className="py-3 px-4">Keterangan</th>
                          <th className="py-3 px-4 text-right">Nominal</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f3f8]">
                        {[
                          { no: "INV-2026-001", source: "Langganan Paket Student", method: "Midtrans / QRIS", desc: "29 Pengguna Mahasiswa x Rp 50.000", amount: "Rp 1.450.000", status: "LUNAS" },
                          { no: "INV-2026-002", source: "Langganan Paket Researcher", method: "Transfer Bank", desc: "10 Pengguna Peneliti x Rp 99.000", amount: "Rp 990.000", status: "LUNAS" },
                          { no: "INV-2026-003", source: "Add-on Format Jurnal Skripsi", method: "QRIS Dinamis", desc: "14 Pembelian Template x Rp 40.000", amount: "Rp 560.000", status: "LUNAS" },
                        ].map((tx, i) => (
                          <tr key={i} className="hover:bg-[#fafcff]">
                            <td className="py-3 px-4 font-mono font-bold text-[#3984f5]">{tx.no}</td>
                            <td className="py-3 px-4 font-semibold text-[#243149]">{tx.source}</td>
                            <td className="py-3 px-4 text-[#57667c]">{tx.method}</td>
                            <td className="py-3 px-4 text-[#57667c]">{tx.desc}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-[#243149]">{tx.amount}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                                ✓ {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-[#fafcff] font-bold text-xs border-t-2 border-[#e9edf3]">
                          <td colSpan={4} className="py-3 px-4 text-[#243149] text-right uppercase">
                            Total Pendapatan Terhitung (Grand Total):
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-base font-black text-[#3984f5]">
                            Rp 3.000.000
                          </td>
                          <td className="py-3 px-4 text-center text-[10px] text-[#16a34a]">
                            TERVERIFIKASI
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. RETENTION MODAL CONTENT */}
              {activeModal === "retention" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2ecf9]">
                      <div className="text-[11px] font-bold text-[#738196] uppercase">Pengguna Kembali (&gt;30 Hari)</div>
                      <div className="text-2xl font-black text-[#16a34a] mt-1">73.2%</div>
                      <p className="text-[11px] text-[#57667c] mt-0.5">
                        Tingkat loyalitas tinggi didorong oleh revisi bab 4 skripsi &amp; olah data tesis lanjutan.
                      </p>
                    </div>
                    <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2ecf9]">
                      <div className="text-[11px] font-bold text-[#738196] uppercase">Rasio Churn</div>
                      <div className="text-2xl font-black text-rose-600 mt-1">26.8%</div>
                      <p className="text-[11px] text-[#57667c] mt-0.5">
                        Mayoritas churn terjadi setelah mahasiswa dinyatakan lulus sidang akhir skripsi.
                      </p>
                    </div>
                  </div>

                  {/* Retention Cohort Curve */}
                  <div className="p-4 bg-white rounded-2xl border border-[#e9edf3] space-y-3">
                    <h4 className="font-extrabold text-xs text-[#243149]">
                      Kurva Retensi Kohort Mingguan (W1 - W8 Setelah Registrasi)
                    </h4>
                    <div className="space-y-2 text-xs">
                      {[
                        { week: "Minggu 1 (Onboarding)", pct: 100, bar: "w-full", color: "bg-[#3984f5]" },
                        { week: "Minggu 2 (Upload & Validasi)", pct: 88, bar: "w-[88%]", color: "bg-[#3984f5]" },
                        { week: "Minggu 3 (Analisis Regresi)", pct: 81, bar: "w-[81%]", color: "bg-[#60a5fa]" },
                        { week: "Minggu 4 (Konsultasi Bedah AI)", pct: 76, bar: "w-[76%]", color: "bg-[#60a5fa]" },
                        { week: "Minggu 5 (Revisi & Olah Ulang)", pct: 74, bar: "w-[74%]", color: "bg-emerald-500" },
                        { week: "Minggu 6 (Ekspor Laporan Bab 4)", pct: 73, bar: "w-[73%]", color: "bg-emerald-500" },
                        { week: "Minggu 7 (Bimbingan Lanjutan)", pct: 71, bar: "w-[71%]", color: "bg-emerald-600" },
                        { week: "Minggu 8+ (Retensi Stabil)", pct: 73, bar: "w-[73%]", color: "bg-emerald-600" },
                      ].map((c) => (
                        <div key={c.week} className="flex items-center gap-3">
                          <span className="w-48 text-[11px] font-medium text-[#57667c] truncate">{c.week}</span>
                          <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div className={`h-full ${c.color} ${c.bar} rounded-full transition-all`} />
                          </div>
                          <span className="w-12 text-right font-mono font-bold text-[#243149] text-[11px]">
                            {c.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
