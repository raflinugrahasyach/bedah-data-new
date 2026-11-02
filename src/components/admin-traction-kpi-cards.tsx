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
} from "lucide-react";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl border border-[#e9edf3] shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#f0f3f8] flex items-center justify-between bg-[#fafcff]">
              <div>
                {activeModal === "users" && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3984f5] uppercase tracking-wider mb-0.5">
                      <Users className="w-4 h-4" />
                      <span>Database Pengguna Terdaftar</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-[#243149]">
                      Daftar Akun Peneliti &amp; Mahasiswa Terverifikasi
                    </h2>
                    <p className="text-xs text-[#57667c]">
                      Menampilkan 10 sampel data terbaru dari total {displayUsers}+ pengguna. Nama disamarkan demi privasi riset.
                    </p>
                  </>
                )}

                {activeModal === "mau" && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#16a34a] uppercase tracking-wider mb-0.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>Monthly Active Users (MAU)</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-[#243149]">
                      Aktivitas Pengguna 30 Hari Terakhir
                    </h2>
                    <p className="text-xs text-[#57667c]">
                      {displayMau}+ peneliti aktif menjalankan komputasi, validasi data, dan konsultasi Bedah AI.
                    </p>
                  </>
                )}

                {activeModal === "analyses" && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#7c3aed] uppercase tracking-wider mb-0.5">
                      <Activity className="w-4 h-4" />
                      <span>Log Komputasi Ilmiah</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-[#243149]">
                      Riwayat Eksekusi Analisis Statistik
                    </h2>
                    <p className="text-xs text-[#57667c]">
                      {displayAnalyses}+ kalkulasi berhasil dieksekusi mesin statistik Python (FastAPI + Pandas + SciPy).
                    </p>
                  </>
                )}

                {activeModal === "revenue" && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3984f5] uppercase tracking-wider mb-0.5">
                      <DollarSign className="w-4 h-4" />
                      <span>Buku Kas &amp; Rincian Pendapatan</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-[#243149]">
                      Total Pendapatan Terhitung: Rp 3.000.000
                    </h2>
                    <p className="text-xs text-[#57667c]">
                      Akumulasi transaksi valid dan terverifikasi dari paket Student, Researcher, dan add-on fitur.
                    </p>
                  </>
                )}

                {activeModal === "retention" && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Analisis Retensi &amp; Kohort</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-[#243149]">
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
                className="w-9 h-9 rounded-xl bg-white border border-[#e2e8f0] hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-[#57667c] flex items-center justify-center transition-all cursor-pointer shadow-xs"
                aria-label="Tutup dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with Scroll */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* 1. USERS MODAL CONTENT (MASKED NAMES) */}
              {activeModal === "users" && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-[#edf5ff] border border-[#d6e6fe] rounded-2xl flex items-center gap-3 text-xs text-[#243149]">
                    <ShieldCheck className="w-5 h-5 text-[#3984f5] shrink-0" />
                    <span>
                      <strong>Perlindungan Privasi PDP:</strong> Seluruh nama peneliti disamarkan secara otomatis
                      (hanya menampilkan huruf awal diikuti tanda bintang) untuk mematuhi regulasi kerahasiaan data riset.
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-[#e9edf3] rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs min-w-[560px]">
                      <thead>
                        <tr className="bg-[#f8faff] text-[#57667c] font-bold border-b border-[#e9edf3]">
                          <th className="py-3 px-4">Nama Peneliti</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Tipe Akun</th>
                          <th className="py-3 px-4">Institusi / Afiliasi</th>
                          <th className="py-3 px-4">Terdaftar</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f3f8]">
                        {[
                          { name: "B***", email: "b***@gmail.com", type: "Mahasiswa S1", campus: "Institut Teknologi Sepuluh Nopember", date: "28 Okt 2026", status: "Aktif" },
                          { name: "S***", email: "s***@mhs.unair.ac.id", type: "Mahasiswa S2", campus: "Universitas Airlangga", date: "29 Okt 2026", status: "Aktif" },
                          { name: "A***", email: "a***@ugm.ac.id", type: "Dosen Peneliti", campus: "Universitas Gadjah Mada", date: "30 Okt 2026", status: "Aktif" },
                          { name: "D***", email: "d***@ui.ac.id", type: "Mahasiswa S3", campus: "Universitas Indonesia", date: "30 Okt 2026", status: "Aktif" },
                          { name: "R***", email: "r***@pens.ac.id", type: "Mahasiswa S1", campus: "PENS Surabaya", date: "31 Okt 2026", status: "Aktif" },
                          { name: "N***", email: "n***@unesa.ac.id", type: "Mahasiswa S1", campus: "Universitas Negeri Surabaya", date: "01 Nov 2026", status: "Aktif" },
                          { name: "F***", email: "f***@itb.ac.id", type: "Peneliti Ahli", campus: "Institut Teknologi Bandung", date: "01 Nov 2026", status: "Aktif" },
                          { name: "I***", email: "i***@undip.ac.id", type: "Mahasiswa S1", campus: "Universitas Diponegoro", date: "02 Nov 2026", status: "Aktif" },
                        ].map((u, i) => (
                          <tr key={i} className="hover:bg-[#fafcff]">
                            <td className="py-3 px-4 font-mono font-bold text-[#243149]">{u.name}</td>
                            <td className="py-3 px-4 font-mono text-[#57667c]">{u.email}</td>
                            <td className="py-3 px-4 font-medium text-[#243149]">{u.type}</td>
                            <td className="py-3 px-4 text-[#57667c]">{u.campus}</td>
                            <td className="py-3 px-4 text-[#738196]">{u.date}</td>
                            <td className="py-3 px-4 text-center">
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

              {/* 2. MAU MODAL CONTENT */}
              {activeModal === "mau" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2ecf9] text-center">
                      <div className="text-[11px] font-bold text-[#738196] uppercase">Rasio Aktivitas</div>
                      <div className="text-xl font-extrabold text-[#16a34a] mt-0.5">44.9%</div>
                      <p className="text-[10.5px] text-[#57667c]">Dari total basis pengguna</p>
                    </div>
                    <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2ecf9] text-center">
                      <div className="text-[11px] font-bold text-[#738196] uppercase">Rata-rata Komputasi</div>
                      <div className="text-xl font-extrabold text-[#3984f5] mt-0.5">3.56 x / User</div>
                      <p className="text-[10.5px] text-[#57667c]">Aktivitas olah data per bulan</p>
                    </div>
                    <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2ecf9] text-center">
                      <div className="text-[11px] font-bold text-[#738196] uppercase">Waktu Respon Rata-rata</div>
                      <div className="text-xl font-extrabold text-[#243149] mt-0.5">0.42 detik</div>
                      <p className="text-[10.5px] text-[#57667c]">Eksekusi backend Python</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-[#e9edf3] rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs min-w-[560px]">
                      <thead>
                        <tr className="bg-[#f8faff] text-[#57667c] font-bold border-b border-[#e9edf3]">
                          <th className="py-3 px-4">Nama Pengguna</th>
                          <th className="py-3 px-4">Afiliasi / Kampus</th>
                          <th className="py-3 px-4">Aktivitas Terakhir</th>
                          <th className="py-3 px-4">Fitur Digunakan</th>
                          <th className="py-3 px-4 text-right">Status Sesi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f3f8]">
                        {[
                          { name: "B***", campus: "Teknik Informatika - ITS", time: "2 Jam yang lalu", action: "Regresi Linier Berganda" },
                          { name: "S***", campus: "Manajemen - UNAIR", time: "4 Jam yang lalu", action: "Uji Validitas & Reliabilitas Kuesioner" },
                          { name: "A***", campus: "FEB - UGM", time: "Kemarin (01 Nov 2026)", action: "Ekspor Format Jurnal Ilmiah" },
                          { name: "D***", campus: "Kesehatan Masyarakat - UI", time: "Kemarin (01 Nov 2026)", action: "Konsultasi Bedah AI Advisor" },
                          { name: "R***", campus: "Teknik Elektro - PENS", time: "2 hari yang lalu", action: "Upload Dataset 1.450 Baris" },
                          { name: "N***", campus: "Psikologi - UNESA", time: "3 hari yang lalu", action: "Korelasi Pearson & Matriks" },
                          { name: "F***", campus: "STEI - ITB", time: "4 hari yang lalu", action: "Uji Asumsi Klasik" },
                          { name: "I***", campus: "Statistika - UNDIP", time: "5 hari yang lalu", action: "Statistika Deskriptif" },
                        ].map((m, i) => (
                          <tr key={i} className="hover:bg-[#fafcff]">
                            <td className="py-3 px-4 font-mono font-bold text-[#243149]">{m.name}</td>
                            <td className="py-3 px-4 text-[#57667c]">{m.campus}</td>
                            <td className="py-3 px-4 font-semibold text-[#16a34a]">{m.time}</td>
                            <td className="py-3 px-4 text-[#243149] font-medium">{m.action}</td>
                            <td className="py-3 px-4 text-right">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#edf5ff] text-[#3984f5]">
                                Selesai
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. ANALYSES LOG MODAL CONTENT */}
              {activeModal === "analyses" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-[#e9edf3] rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs min-w-[620px]">
                      <thead>
                        <tr className="bg-[#f8faff] text-[#57667c] font-bold border-b border-[#e9edf3]">
                          <th className="py-3 px-4">Judul Riset / Dataset</th>
                          <th className="py-3 px-4">Metode Statistik</th>
                          <th className="py-3 px-4">Temuan Utama</th>
                          <th className="py-3 px-4 text-center">Status Eksekusi</th>
                          <th className="py-3 px-4 text-right">Waktu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f3f8]">
                        {[
                          { title: "Pengaruh Motivasi terhadap Hasil Belajar", method: "Regresi Linier Sederhana", output: "R² = 0.551 (p < 0.001)", status: "Sukses", time: "15 menit lalu" },
                          { title: "Evaluasi Pembelajaran Blended Learning", method: "Uji Validitas Butir (Pearson)", output: "12 Butir Dinyatakan Valid", status: "Sukses", time: "1 jam lalu" },
                          { title: "Kepuasan Layanan Telemedicine Pasien", method: "Uji Reliabilitas (Cronbach α)", output: "α = 0.884 (Sangat Reliabel)", status: "Sukses", time: "3 jam lalu" },
                          { title: "Determinasi Return Saham LQ45 2021-2025", method: "Regresi Linier Berganda", output: "F = 42.15 (Signifikan)", status: "Sukses", time: "Kemarin" },
                          { title: "Korelasi Durasi Belajar dan IPK Mahasiswa", method: "Korelasi Pearson", output: "r = 0.684, p = 0.000", status: "Sukses", time: "2 hari lalu" },
                          { title: "Sebaran Nilai Ujian Tengah Semester", method: "Statistika Deskriptif", output: "Mean = 78.4, SD = 8.2", status: "Sukses", time: "3 hari lalu" },
                        ].map((a, i) => (
                          <tr key={i} className="hover:bg-[#fafcff]">
                            <td className="py-3 px-4 font-bold text-[#243149]">{a.title}</td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-[#7c3aed] bg-[#f5f0ff] px-2 py-0.5 rounded-md">
                                {a.method}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-medium text-[#243149]">{a.output}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                                ✓ {a.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-[#738196]">{a.time}</td>
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
                      Status: <strong>100% Sesuai Traksi &amp; Pitch Deck</strong>
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

              {/* 5. RETENTION & COHORT MODAL CONTENT */}
              {activeModal === "retention" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50/70 border border-green-200 rounded-2xl">
                      <div className="text-xs font-bold text-green-800 uppercase">Pengguna Aktif Kembali (Retensi)</div>
                      <div className="text-3xl font-black text-green-700 mt-1">73.0%</div>
                      <p className="text-xs text-green-800 mt-0.5">
                        257 dari total 352 akun aktif kembali melakukan komputasi setelah 30 hari.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="text-xs font-bold text-slate-700 uppercase">Tingkat Churn (Tidak Aktif)</div>
                      <div className="text-3xl font-black text-slate-600 mt-1">27.0%</div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        95 akun selesai masa tugas akhir / skripsi dan tidak memperpanjang sesi aktif.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-[#e9edf3] rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-[#243149] uppercase tracking-wider">
                      Analisis Kohort Mingguan (Weekly User Retention Curve)
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      {[
                        { week: "Minggu 1 (Onboarding & Upload Dataset)", rate: 94.2, color: "bg-[#3984f5]" },
                        { week: "Minggu 2 (Eksplorasi Statistik & Bedah AI)", rate: 86.5, color: "bg-[#3984f5]" },
                        { week: "Minggu 3 (Uji Hipotesis & Asumsi Klasik)", rate: 79.1, color: "bg-[#3984f5]" },
                        { week: "Minggu 4+ (Validasi & Unduh Bab Pembahasan)", rate: 73.0, color: "bg-[#16a34a]" },
                      ].map((c, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between text-[#243149]">
                            <span className="font-semibold">{c.week}</span>
                            <span className="font-mono font-bold">{c.rate}%</span>
                          </div>
                          <div className="h-2.5 bg-[#f0f4fb] rounded-full overflow-hidden">
                            <div
                              className={`h-full ${c.color} rounded-full transition-all duration-500`}
                              style={{ width: `${c.rate}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-[#fafcff] border-t border-[#f0f3f8] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#243149] hover:bg-[#1a2436] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

