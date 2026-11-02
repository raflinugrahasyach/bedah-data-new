"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Key,
  ToggleLeft,
  ToggleRight,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [demoAccountsActive, setDemoAccountsActive] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  function handleToggleDemo() {
    setDemoAccountsActive(!demoAccountsActive);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
          <span>KONFIGURASI SISTEM SAAS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
          Pengaturan Admin<span className="text-[#3984f5]">.</span>
        </h1>
        <p className="text-[13.5px] text-[#57667c] mt-0.5">
          Kontrol saklar fitur global, otentikasi akun demo investor, dan keamanan sistem.
        </p>
      </div>

      {saveToast && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3.5 rounded-xl flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>Pengaturan sistem berhasil diperbarui.</span>
        </div>
      )}

      {/* Demo Switch Box */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-[#243149]">
              Saklar Cepat Akun Demo (Investor / Mitra)
            </h3>
            <p className="text-xs text-[#57667c] max-w-xl">
              Mengontrol apakah card &quot;Masuk Cepat Demo&quot; (Peneliti &amp; Super Admin) ditampilkan di halaman Login publik. Matikan saklar ini saat website dipublikasikan secara komersial luas.
            </p>
          </div>

          <button
            onClick={handleToggleDemo}
            className="cursor-pointer text-[#3984f5] transition-transform active:scale-95"
          >
            {demoAccountsActive ? (
              <ToggleRight className="w-10 h-10 text-[#3984f5]" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-[#94a3b8]" />
            )}
          </button>
        </div>

        <div className="pt-2 text-xs font-semibold text-[#57667c] flex items-center gap-2">
          <span>Status saat ini:</span>
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
              demoAccountsActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {demoAccountsActive ? "Aktif (Card Demo Tampil)" : "Nonaktif (Card Demo Tersembunyi)"}
          </span>
        </div>
      </div>

      {/* Security & Audit Info */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-extrabold text-[#243149]">
          <Shield className="w-4 h-4 text-[#3984f5]" />
          <span>Keamanan &amp; Integritas Akses Admin</span>
        </div>
        <p className="text-xs text-[#57667c] leading-relaxed">
          Semua sesi autentikasi dilindungi dengan JWT terenkripsi dan role-based access control (RBAC). Setiap percobaan akses ke endpoint terlarang dicatat ke dalam audit log PostgreSQL.
        </p>
      </div>
    </div>
  );
}

