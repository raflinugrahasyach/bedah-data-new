"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { BrandLogo } from "@/components/brand-logo";
import {
  BarChart3,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  User,
  Crown,
  ArrowRight,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const submitEmail = (customEmail ?? email).trim().toLowerCase();
    const submitPassword = customPassword ?? password;

    try {
      const res = await signIn("credentials", {
        email: submitEmail,
        password: submitPassword,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("Email atau kata sandi belum sesuai. Silakan coba lagi atau gunakan akun demo di samping.");
        setLoading(false);
      } else {
        // Successful login, determine redirect based on email or fetch session
        const target = submitEmail.includes("admin")
          ? "/admin"
          : (callbackUrl && callbackUrl.startsWith("/") && callbackUrl !== "/login" ? callbackUrl : "/dashboard");
        window.location.href = target;
      }
    } catch (err) {
      setErrorMsg("Terjadi kendala pada sistem. Silakan coba sesaat lagi.");
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    handleLogin(undefined, demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#243149] flex flex-col justify-between selection:bg-brand selection:text-white">
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <BrandLogo size="md" />
        <nav className="flex items-center gap-6">
          <Link
            href="/plans"
            className="text-[14px] font-medium text-[#57667c] hover:text-[#243149] transition-colors"
          >
            Paket &amp; Harga
          </Link>
          <Link
            href="/plans"
            className="text-[14px] font-semibold bg-[#3984f5] hover:bg-[#2672df] text-white px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            Mulai gratis
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-6 py-4 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Left Column: Hero & Intro */}
        <section className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
          <div>
            <span className="text-[11px] font-bold tracking-[0.18em] text-[#3984f5] uppercase block mb-3">
              PLATFORM RISET BERBANTUAN AI
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#243149] leading-[1.2] tracking-tight">
              Dari data mentah, menjadi temuan yang berarti.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#57667c] max-w-xl">
              Bedah Data membantu mahasiswa, dosen, dan peneliti mengolah data, memilih metode statistik, memvalidasi
              hasil, dan menyusun laporan penelitian yang dapat dipertanggungjawabkan.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f0f3f9] text-[#57667c] flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-[#3984f5]" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-[#243149]">Analisis statistik otomatis</h4>
                <p className="text-[12px] text-[#738196] leading-snug mt-0.5">
                  Deskriptif, korelasi Pearson, dan regresi linear sederhana.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f0f3f9] text-[#57667c] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#3984f5]" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-[#243149]">AI Methodology Advisor</h4>
                <p className="text-[12px] text-[#738196] leading-snug mt-0.5">
                  Temukan metode dan arah riset yang tepat bersama Bedah AI.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f0f3f9] text-[#57667c] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#3984f5]" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-[#243149]">Research Validation Engine</h4>
                <p className="text-[12px] text-[#738196] leading-snug mt-0.5">
                  Periksa konsistensi perhitungan sebelum melaporkan temuan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f0f3f9] text-[#57667c] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-[#3984f5]" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-[#243149]">Visualisasi &amp; laporan</h4>
                <p className="text-[12px] text-[#738196] leading-snug mt-0.5">
                  Ubah angka menjadi insight yang siap dibagikan.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Accounts Card */}
          <div className="mt-2 bg-[#edf5ff] border border-[#d6e6fe] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[#3984f5] text-[13px] font-semibold mb-3">
              <Mail className="w-4 h-4" />
              <span>Akun demo — klik untuk mencoba langsung</span>
            </div>

            <div className="space-y-3">
              {/* Peneliti Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin("peneliti@bedahdata.id", "BedahDataPeneliti2026!")}
                disabled={loading}
                className="w-full text-left bg-white hover:bg-[#fafcff] border border-[#e2ecf9] hover:border-[#3984f5] rounded-xl p-3.5 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#edf5ff] text-[#3984f5] flex items-center justify-center shrink-0 group-hover:bg-[#3984f5] group-hover:text-white transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#243149]">Peneliti</span>
                      <span className="text-[11px] font-semibold bg-[#e4efff] text-[#3984f5] px-2 py-0.5 rounded-full">
                        Riset
                      </span>
                    </div>
                    <p className="text-[12px] text-[#738196]">
                      Dashboard riset: proyek, analisis statistik &amp; validasi penelitian.
                    </p>
                    <div className="mt-1 font-mono text-[11px] text-[#57667c] bg-[#f8faff] px-2 py-0.5 rounded border border-[#edf2f9] inline-block">
                      peneliti@bedahdata.id &middot; BedahDataPeneliti2026!
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#9cb1c9] group-hover:text-[#3984f5] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Super Admin Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@bedahdata.id", "BedahDataAdmin2026!")}
                disabled={loading}
                className="w-full text-left bg-white hover:bg-[#fafcff] border border-[#e2ecf9] hover:border-[#3984f5] rounded-xl p-3.5 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#edf5ff] text-[#3984f5] flex items-center justify-center shrink-0 group-hover:bg-[#3984f5] group-hover:text-white transition-colors">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#243149]">Super Admin</span>
                      <span className="text-[11px] font-semibold bg-[#e4efff] text-[#3984f5] px-2 py-0.5 rounded-full">
                        SaaS
                      </span>
                    </div>
                    <p className="text-[12px] text-[#738196]">
                      Panel penjualan: pendapatan, pelanggan &amp; performa paket SaaS.
                    </p>
                    <div className="mt-1 font-mono text-[11px] text-[#57667c] bg-[#f8faff] px-2 py-0.5 rounded border border-[#edf2f9] inline-block">
                      admin@bedahdata.id &middot; BedahDataAdmin2026!
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#9cb1c9] group-hover:text-[#3984f5] group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Login Card */}
        <section className="lg:col-span-6 xl:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-[24px] border border-[#e9edf3] shadow-[0_10px_35px_rgba(36,49,73,0.06)] p-8 sm:p-10">
            {/* Top Star Icon */}
            <div className="w-12 h-12 rounded-2xl bg-[#edf5ff] text-[#3984f5] flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-[#243149]">Masuk ke ruang penelitian</h2>
              <p className="text-[13px] text-[#738196] mt-1.5">
                Satu akun untuk proyek, analisis, dan Bedah AI.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#243149] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@universitas.ac.id"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d8e1ee] text-[14px] text-[#243149] placeholder:text-[#a0abba] focus:outline-none focus:ring-2 focus:ring-[#3984f5]/30 focus:border-[#3984f5] transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[13px] font-semibold text-[#243149]">Kata sandi</label>
                  <Link
                    href="/forgot-password"
                    className="text-[12px] font-medium text-[#3984f5] hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d8e1ee] text-[14px] text-[#243149] placeholder:text-[#a0abba] focus:outline-none focus:ring-2 focus:ring-[#3984f5]/30 focus:border-[#3984f5] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#3984f5] hover:bg-[#2672df] text-white font-semibold text-[14px] rounded-xl shadow-md shadow-[#3984f5]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Masuk</span>
                )}
              </button>
            </form>

            <div className="text-center mt-6 pt-5 border-t border-[#edf2f9]">
              <p className="text-[13px] text-[#57667c]">
                Baru di Bedah Data?{" "}
                <Link href="/register" className="font-semibold text-[#3984f5] hover:underline">
                  Daftar gratis
                </Link>
              </p>
              <p className="text-[11px] text-[#92a0b3] leading-relaxed mt-4">
                Dengan masuk, Anda menyetujui ketentuan Bedah Data. Data penelitian Anda bersifat pribadi.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#92a0b3] gap-2 border-t border-[#edf2f9]/70">
        <p>&copy; 2026 Bedah Data. Dibuat untuk rasa ingin tahu.</p>
        <p>Dibuat di Indonesia.</p>
      </footer>
    </div>
  );
}

