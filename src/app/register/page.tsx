"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Sparkles, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, institution }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat akun.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#243149] flex flex-col justify-between selection:bg-brand selection:text-white">
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <BrandLogo size="md" />
        <nav className="flex items-center gap-4">
          <span className="text-[14px] text-[#57667c]">Sudah punya akun?</span>
          <Link
            href="/login"
            className="text-[14px] font-semibold text-[#3984f5] hover:text-[#2672df] transition-colors"
          >
            Masuk
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto px-6 py-8">
        <div className="w-full bg-white rounded-[24px] border border-[#e9edf3] shadow-[0_10px_35px_rgba(36,49,73,0.06)] p-8 sm:p-10">
          <div className="w-12 h-12 rounded-2xl bg-[#edf5ff] text-[#3984f5] flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-[#243149]">Daftar Akun Peneliti</h2>
            <p className="text-[13px] text-[#738196] mt-1.5">
              Mulai olah data dan validasi skripsi secara presisi dengan Bedah Data.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
              <span>Akun berhasil didaftarkan! Mengarahkan ke halaman login...</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#243149] mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Budi Pratama, S.Si"
                className="w-full px-4 py-2.5 rounded-xl border border-[#d8e1ee] text-[14px] text-[#243149] placeholder:text-[#a0abba] focus:outline-none focus:ring-2 focus:ring-[#3984f5]/30 focus:border-[#3984f5] transition-all"
              />
            </div>

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

            <div>
              <label className="block text-[13px] font-semibold text-[#243149] mb-1.5">
                Universitas / Instansi
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="cth. Universitas Indonesia"
                className="w-full px-4 py-2.5 rounded-xl border border-[#d8e1ee] text-[14px] text-[#243149] placeholder:text-[#a0abba] focus:outline-none focus:ring-2 focus:ring-[#3984f5]/30 focus:border-[#3984f5] transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#243149] mb-1.5">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full px-4 py-2.5 rounded-xl border border-[#d8e1ee] text-[14px] text-[#243149] placeholder:text-[#a0abba] focus:outline-none focus:ring-2 focus:ring-[#3984f5]/30 focus:border-[#3984f5] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-2 py-3 px-4 bg-[#3984f5] hover:bg-[#2672df] text-white font-semibold text-[14px] rounded-xl shadow-md shadow-[#3984f5]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span>Buat Akun Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-[#edf2f9]">
            <p className="text-[13px] text-[#57667c]">
              Sudah memiliki akun?{" "}
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
