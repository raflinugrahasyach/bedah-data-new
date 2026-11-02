"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { KeyRound, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate reset link dispatch
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#243149] flex flex-col justify-between selection:bg-brand selection:text-white">
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <BrandLogo size="md" />
        <Link
          href="/login"
          className="text-[14px] font-medium text-[#57667c] hover:text-[#243149] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Login</span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto px-6 py-8">
        <div className="w-full bg-white rounded-[24px] border border-[#e9edf3] shadow-[0_10px_35px_rgba(36,49,73,0.06)] p-8 sm:p-10">
          <div className="w-12 h-12 rounded-2xl bg-[#edf5ff] text-[#3984f5] flex items-center justify-center mx-auto mb-5">
            <KeyRound className="w-6 h-6" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-[#243149]">Reset Kata Sandi</h2>
            <p className="text-[13px] text-[#738196] mt-1.5">
              Masukkan email yang terdaftar untuk menerima tautan pemulihan sandi.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Instruksi terkirim</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Jika email <strong>{email}</strong> terdaftar di sistem kami, instruksi pemulihan telah dikirimkan.
                  </p>
                </div>
              </div>

              <Link
                href="/login"
                className="w-full py-2.5 px-4 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] font-semibold text-[13px] rounded-xl flex items-center justify-center gap-2 transition-all block text-center"
              >
                Kembali ke Halaman Masuk
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#243149] mb-1.5">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@kampus.ac.id"
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
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Tautan Pemulihan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center mt-6 pt-5 border-t border-[#edf2f9]">
            <p className="text-[13px] text-[#57667c]">
              Ingat kata sandi Anda?{" "}
              <Link href="/login" className="font-semibold text-[#3984f5] hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#92a0b3] gap-2 border-t border-[#edf2f9]/70">
        <p>&copy; 2026 Bedah Data. Dibuat untuk rasa ingin tahu.</p>
        <p>Dibuat di Indonesia.</p>
      </footer>
    </div>
  );
}
