"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  RotateCw,
  Sparkles,
} from "lucide-react";

interface PengaturanViewProps {
  user: any;
  activePlan: any;
  subscription: any;
  transactions: any[];
}

export function PengaturanView({
  user,
  activePlan,
  subscription,
  transactions,
}: PengaturanViewProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "subscription">("profile");

  // Profile form state
  const [name, setName] = useState(user.name || "");
  const [userType, setUserType] = useState(user.userType || "MAHASISWA");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, userType }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  const tier = subscription?.tier || "FREE";
  const planName = activePlan?.name || "Free";
  const price = subscription?.cycle === "YEARLY" ? activePlan?.priceYearly : activePlan?.priceMonthly;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
          PENGATURAN AKUN &amp; LAYANAN
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
          Pengaturan<span className="text-[#3984f5]">.</span>
        </h1>
        <p className="text-[13.5px] text-[#57667c] mt-0.5">
          Kelola profil peneliti, preferensi akun, paket langganan, dan riwayat faktur Anda.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e9edf3] pb-3">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#3984f5] text-white shadow-xs"
              : "text-[#57667c] hover:bg-[#f8faff] hover:text-[#243149]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil Peneliti</span>
        </button>
        <button
          onClick={() => setActiveTab("subscription")}
          className={`flex items-center gap-2 px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer ${
            activeTab === "subscription"
              ? "bg-[#3984f5] text-white shadow-xs"
              : "text-[#57667c] hover:bg-[#f8faff] hover:text-[#243149]"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Langganan &amp; Paket</span>
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#243149] block mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 focus:outline-none focus:border-[#3984f5]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#243149] block mb-1">
                Alamat Email (Hanya baca)
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full text-xs rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 bg-[#f8faff] text-[#738196] cursor-not-allowed"
              />
              <p className="text-[11px] text-[#738196] mt-1">
                Email terverifikasi digunakan untuk login dan pengiriman invoice resmi.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#243149] block mb-1">
                Peran Peneliti
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full text-xs rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#3984f5]"
              >
                <option value="MAHASISWA">Mahasiswa (S1/S2/S3)</option>
                <option value="DOSEN">Dosen / Akademisi</option>
                <option value="PENELITI">Peneliti Mandiri / Profesional</option>
                <option value="INSTITUSI">Institusi / Lembaga Riset</option>
              </select>
            </div>

            {/* Privacy note */}
            <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2e8f0] flex items-start gap-3">
              <Lock className="w-4 h-4 text-[#3984f5] shrink-0 mt-0.5" />
              <div className="text-[11.5px] text-[#57667c] leading-relaxed">
                <b>Privasi Data:</b> Seluruh data dan proyek penelitian Anda dienkripsi dan hanya dapat diakses oleh Anda. Sesuai UU PDP Indonesia, Admin platform tidak memiliki akses ke isi data penelitian Anda.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {saveSuccess && (
                <div className="text-xs text-[#16a34a] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Perubahan profil berhasil disimpan!</span>
                </div>
              )}
              {!saveSuccess && <div />}

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: SUBSCRIPTION */}
      {activeTab === "subscription" && (
        <div className="space-y-6">
          {/* Active Plan Card */}
          <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#738196]">
                  Paket Langganan Aktif
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-2xl font-black text-[#243149]">
                    Bedah Data {planName}
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-[#3984f5]">
                    {tier}
                  </span>
                </div>
                <p className="text-xs text-[#57667c] mt-1">
                  Biaya: <b>Rp{(price || 0).toLocaleString("id-ID")}</b> / {subscription?.cycle === "YEARLY" ? "tahun" : "bulan"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/plans"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3984f5] hover:bg-[#2672df] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade Paket</span>
                </Link>
              </div>
            </div>

            {/* Quota Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#fafcff] rounded-xl border border-[#e2e8f0] text-xs space-y-1">
                <span className="text-[#738196]">Batas Proyek Aktif</span>
                <div className="font-bold text-[#243149]">
                  {activePlan?.maxProjects ? `${activePlan.maxProjects} Proyek` : "Tanpa Batas"}
                </div>
              </div>
              <div className="p-3 bg-[#fafcff] rounded-xl border border-[#e2e8f0] text-xs space-y-1">
                <span className="text-[#738196]">Maksimal Ukuran Data</span>
                <div className="font-bold text-[#243149]">
                  Sampai {(activePlan?.maxRows || 10000).toLocaleString("id-ID")} baris
                </div>
              </div>
              <div className="p-3 bg-[#fafcff] rounded-xl border border-[#e2e8f0] text-xs space-y-1">
                <span className="text-[#738196]">Kuota Tanya Bedah AI</span>
                <div className="font-bold text-[#243149]">
                  {activePlan?.maxChatPerDay ? `${activePlan.maxChatPerDay} pesan / hari` : "Unlimited (Fair Use)"}
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-sm overflow-hidden">
            <div className="p-4 bg-[#f8faff] border-b border-[#e9edf3] font-bold text-xs text-[#243149]">
              Riwayat Pembayaran &amp; Faktur
            </div>
            {transactions.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#738196]">
                Belum ada riwayat transaksi.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
                    <th className="py-2.5 px-4">Invoice</th>
                    <th className="py-2.5 px-4">Tanggal</th>
                    <th className="py-2.5 px-4">Sumber</th>
                    <th className="py-2.5 px-4 text-right">Nominal</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f3f8]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#fafcff]">
                      <td className="py-2.5 px-4 font-mono font-bold text-[#243149]">{tx.invoiceNo || tx.id.slice(0, 8)}</td>
                      <td className="py-2.5 px-4 text-[#57667c]">{new Date(tx.createdAt).toLocaleDateString("id-ID")}</td>
                      <td className="py-2.5 px-4 text-[#57667c]">{tx.source}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-[#243149]">
                        Rp{tx.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-green-50 text-green-700 border border-green-200">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

