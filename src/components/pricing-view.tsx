"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import {
  Check,
  Sparkles,
  Building2,
  GraduationCap,
  Microscope,
  HelpCircle,
  ChevronDown,
  Lock,
  ArrowRight,
  Send,
  RotateCw,
  CheckCircle2,
  Code2,
} from "lucide-react";

export function PricingView() {
  const [cycle, setCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");

  // Campus modal state
  const [showCampusModal, setShowCampusModal] = useState(false);
  const [instName, setInstName] = useState("");
  const [userCount, setUserCount] = useState("50");
  const [picName, setPicName] = useState("");
  const [picContact, setPicContact] = useState("");
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSendQuote(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmittingQuote(true);
    try {
      const res = await fetch("/api/campus-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionName: instName,
          userCount,
          picName,
          picContact,
        }),
      });
      if (res.ok) {
        setQuoteSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingQuote(false);
    }
  }

  const faqs = [
    {
      q: "Bisa coba dulu sebelum berlangganan?",
      a: "Tentu bisa! Akun baru otomatis masuk ke paket Free (Gratis selamanya). Anda bisa mencoba seluruh workflow inti: upload data, statistik deskriptif, visualisasi, konsultasi Bedah AI, dan validasi dengan limit hingga 500 baris data.",
    },
    {
      q: "Bagaimana cara pindah paket?",
      a: "Anda dapat melakukan upgrade paket kapan saja melalui menu Pengaturan di dashboard akun Anda. Paket baru akan langsung aktif secara instan begitu pembayaran terverifikasi.",
    },
    {
      q: "Apakah ada komitmen jangka panjang?",
      a: "Tidak ada komitmen jangka panjang untuk langganan bulanan. Anda bebas membatalkan langganan kapan saja, dan akses Anda tetap aktif hingga akhir periode penagihan berjalan.",
    },
    {
      q: "Metode pembayaran apa saja yang diterima?",
      a: "Kami menerima pembayaran melalui payment gateway terpercaya di Indonesia: QRIS (GoPay, OVO, Dana, ShopeePay), Virtual Account semua bank utama (BCA, Mandiri, BNI, BRI), serta transfer bank resmi untuk institusi.",
    },
    {
      q: "Bagaimana dengan keamanan dan privasi data penelitian saya?",
      a: "Data penelitian Anda adalah milik Anda sepenuhnya dan bersifat rahasia. Kami mematuhi standar UU Pelindungan Data Pribadi (UU PDP). Super Admin platform secara teknis tidak memiliki akses ke isi raw dataset Anda—hanya metadata nama file dan ukuran data.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#243149] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#e9edf3] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <BrandLogo />
          </Link>

          <nav className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/plans"
              className="text-[#3984f5] font-bold"
            >
              Paket &amp; Harga
            </Link>
            <Link
              href="/login"
              className="text-[#57667c] hover:text-[#243149] transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-[#3984f5] hover:bg-[#2672df] text-white font-bold rounded-xl shadow-xs transition-all"
            >
              Mulai Gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12 w-full">
        {/* Title & Toggle */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase">
            TRANSPARAN &amp; TANPA BIAYA TERSEMBUNYI
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#243149] tracking-tight">
            Satu platform riset, untuk setiap tahap penelitian<span className="text-[#3984f5]">.</span>
          </h1>
          <p className="text-sm text-[#57667c] leading-relaxed">
            Pilih paket yang paling tepat untuk kebutuhan skripsi, tesis, penelitian dosen, hingga lisensi terintegrasi satu fakultas.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="bg-white p-1 rounded-2xl border border-[#e2e8f0] inline-flex items-center shadow-xs">
              <button
                type="button"
                onClick={() => setCycle("MONTHLY")}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  cycle === "MONTHLY"
                    ? "bg-[#3984f5] text-white shadow-xs"
                    : "text-[#57667c] hover:text-[#243149]"
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setCycle("YEARLY")}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  cycle === "YEARLY"
                    ? "bg-[#3984f5] text-white shadow-xs"
                    : "text-[#57667c] hover:text-[#243149]"
                }`}
              >
                <span>Tahunan</span>
                <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.2 rounded-md font-extrabold">
                  Hemat ~2 bulan
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. FREE */}
          <div className="bg-white rounded-3xl border border-[#e9edf3] p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#738196] uppercase tracking-wider">
                  Mencoba Platform
                </span>
                <h3 className="text-xl font-extrabold text-[#243149]">Free (Gratis)</h3>
                <p className="text-xs text-[#57667c]">Untuk user baru mencoba alur analisis utama.</p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-black text-[#243149]">Rp0</span>
                <span className="text-xs text-[#738196]"> / selamanya</span>
              </div>

              <div className="border-t border-[#f0f3f8] pt-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>1 Proyek aktif</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Sampai 500 baris data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Statistik deskriptif &amp; visualisasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Korelasi &amp; regresi sederhana (terbatas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>5 pesan Bedah AI / hari</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Research Validation dasar</span>
                </div>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full text-center py-2.5 px-4 rounded-xl border border-[#e2e8f0] font-bold text-xs text-[#243149] hover:bg-[#f8faff] transition-all block"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* 2. STUDENT */}
          <div className="bg-white rounded-3xl border border-[#e9edf3] p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#3984f5] uppercase tracking-wider">
                  Mahasiswa
                </span>
                <h3 className="text-xl font-extrabold text-[#243149]">Student</h3>
                <p className="text-xs text-[#57667c]">Akses fitur lengkap untuk tugas akhir &amp; skripsi.</p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-black text-[#243149]">
                  {cycle === "YEARLY" ? "Rp490.000" : "Rp49.000"}
                </span>
                <span className="text-xs text-[#738196]">
                  {cycle === "YEARLY" ? " / tahun" : " / bulan"}
                </span>
              </div>

              <div className="border-t border-[#f0f3f8] pt-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span><b>5 Proyek</b> penelitian aktif</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Sampai <b>5.000 baris</b> dataset</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Korelasi, Validitas &amp; Reliabilitas penuh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Regresi Linier Berganda + Asumsi Klasik</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span><b>30 pesan</b> Bedah AI / hari</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Export laporan <b>PDF &amp; DOCX</b></span>
                </div>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full text-center py-2.5 px-4 rounded-xl bg-[#3984f5] hover:bg-[#2672df] text-white font-bold text-xs shadow-xs transition-all block"
            >
              Pilih Paket Student
            </Link>
          </div>

          {/* 3. RESEARCHER (POPULAR) */}
          <div className="bg-gradient-to-b from-[#edf5ff] to-white rounded-3xl border-2 border-[#3984f5] p-6 shadow-md flex flex-col justify-between space-y-6 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3984f5] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
              Paling Populer
            </span>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#3984f5] uppercase tracking-wider">
                  Peneliti Individual &amp; Dosen
                </span>
                <h3 className="text-xl font-extrabold text-[#243149]">Researcher</h3>
                <p className="text-xs text-[#57667c]">Kapasitas maksimal untuk tesis &amp; riset publikasi.</p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-black text-[#243149]">
                  {cycle === "YEARLY" ? "Rp990.000" : "Rp99.000"}
                </span>
                <span className="text-xs text-[#738196]">
                  {cycle === "YEARLY" ? " / tahun" : " / bulan"}
                </span>
              </div>

              <div className="border-t border-[#d6e6fe] pt-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span><b>Unlimited</b> proyek penelitian</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Sampai <b>10.000 baris</b> data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Semua 8 modul analisis statistik</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span><b>Unlimited pesan</b> Bedah AI (Fair use)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Validation Engine penuh + Stempel</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Export PDF/Word + <b>Template Premium</b></span>
                </div>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full text-center py-2.5 px-4 rounded-xl bg-[#3984f5] hover:bg-[#2672df] text-white font-bold text-xs shadow-md transition-all block"
            >
              Pilih Paket Researcher
            </Link>
          </div>

          {/* 4. CAMPUS */}
          <div className="bg-white rounded-3xl border border-[#e9edf3] p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#738196] uppercase tracking-wider">
                  Kampus &amp; Institusi
                </span>
                <h3 className="text-xl font-extrabold text-[#243149]">Campus</h3>
                <p className="text-xs text-[#57667c]">Lisensi multi-user universitas &amp; onboarding tim.</p>
              </div>

              <div className="pt-2">
                <span className="text-2xl font-black text-[#243149]">Mulai Rp15 Juta</span>
                <span className="text-xs text-[#738196]"> / tahun</span>
              </div>

              <div className="border-t border-[#f0f3f8] pt-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Semua fitur Researcher</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Dashboard multi-user &amp; analitik prodi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Template laporan kustom institusi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Workshop &amp; pelatihan onboarding</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span>Dukungan prioritas &amp; dedicated PIC</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCampusModal(true)}
              className="w-full text-center py-2.5 px-4 rounded-xl border border-[#3984f5] text-[#3984f5] hover:bg-[#edf5ff] font-bold text-xs transition-all cursor-pointer block"
            >
              Hubungi Kami / Minta Penawaran
            </button>
          </div>
        </div>

        {/* API Coming Soon Banner */}
        <div className="bg-white rounded-3xl border border-[#e9edf3] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#edf5ff] text-[#3984f5] flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-[#243149]">Akses API Bedah Data</h4>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-[#57667c]">
                Integrasikan calculation engine Bedah Data langsung ke sistem informasi akademik (SIAKAD) universitas Anda.
              </p>
            </div>
          </div>
          <button
            disabled
            className="text-xs font-semibold px-4 py-2 border border-[#e2e8f0] rounded-xl text-[#94a3b8] cursor-not-allowed shrink-0"
          >
            Segera Hadir
          </button>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4 pt-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-extrabold text-[#243149]">Pertanyaan Sering Diajukan (FAQ)</h3>
            <p className="text-xs text-[#57667c]">Hal-hal penting yang perlu Anda ketahui mengenai paket dan pembayaran.</p>
          </div>

          <div className="space-y-3 pt-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#e9edf3] rounded-2xl overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4.5 flex items-center justify-between gap-4 font-bold text-xs text-[#243149] hover:bg-[#fafcff]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#738196] transition-transform ${
                        isOpen ? "rotate-180 text-[#3984f5]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4.5 pb-4.5 pt-1 text-xs text-[#57667c] leading-relaxed border-t border-[#f0f3f8]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Campus Modal */}
      {showCampusModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e9edf3] max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-[#f0f3f8] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#3984f5]" />
                <h3 className="font-extrabold text-sm text-[#243149]">
                  Minta Penawaran Lisensi Kampus
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCampusModal(false);
                  setQuoteSuccess(false);
                }}
                className="text-[#94a3b8] hover:text-[#243149] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {quoteSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto" />
                <h4 className="font-bold text-sm text-[#243149]">Permintaan Berhasil Terkirim!</h4>
                <p className="text-xs text-[#57667c] leading-relaxed">
                  Terima kasih. Proposal penawaran resmi dan rincian lisensi kampus akan dikirimkan ke kontak PIC Anda dalam 1x24 jam kerja.
                </p>
                <button
                  onClick={() => setShowCampusModal(false)}
                  className="px-5 py-2 bg-[#3984f5] text-white text-xs font-bold rounded-xl"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#243149] block mb-1">
                    Nama Kampus / Institusi
                  </label>
                  <input
                    type="text"
                    required
                    value={instName}
                    onChange={(e) => setInstName(e.target.value)}
                    placeholder="Contoh: Universitas Airlangga / ITS"
                    className="w-full text-xs rounded-xl border border-[#e2e8f0] px-3.5 py-2 focus:outline-none focus:border-[#3984f5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#243149] block mb-1">
                    Perkiraan Jumlah Pengguna (User / Mahasiswa)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={userCount}
                    onChange={(e) => setUserCount(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#e2e8f0] px-3.5 py-2 focus:outline-none focus:border-[#3984f5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#243149] block mb-1">
                    Nama Lengkap PIC
                  </label>
                  <input
                    type="text"
                    required
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    placeholder="Contoh: Dr. Budi Santoso, M.Si"
                    className="w-full text-xs rounded-xl border border-[#e2e8f0] px-3.5 py-2 focus:outline-none focus:border-[#3984f5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#243149] block mb-1">
                    Kontak PIC (Email &amp; No. WhatsApp)
                  </label>
                  <input
                    type="text"
                    required
                    value={picContact}
                    onChange={(e) => setPicContact(e.target.value)}
                    placeholder="budi@kampus.ac.id / 08123456789"
                    className="w-full text-xs rounded-xl border border-[#e2e8f0] px-3.5 py-2 focus:outline-none focus:border-[#3984f5]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCampusModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#738196] border border-[#e2e8f0] rounded-xl hover:bg-[#fafcff]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingQuote}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#3984f5] hover:bg-[#2672df] text-white text-xs font-bold rounded-xl disabled:opacity-50"
                  >
                    {isSubmittingQuote ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Kirim Permintaan</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#e9edf3] py-8 text-xs text-[#738196]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <span>&middot;</span>
            <span>&copy; 2026 Bedah Data. Dibuat untuk rasa ingin tahu. Dibuat di Indonesia.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/plans" className="hover:text-[#243149]">
              Paket dan Harga
            </Link>
            <Link href="/dashboard" className="hover:text-[#243149]">
              Dashboard
            </Link>
            <Link href="/bantuan" className="hover:text-[#243149]">
              Pusat Bantuan
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

