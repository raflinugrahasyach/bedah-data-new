"use client";

import React, { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  RotateCw,
  ArrowRight,
  Shield,
} from "lucide-react";

interface AdminQuotesViewProps {
  initialQuotes: any[];
}

export function AdminQuotesView({ initialQuotes }: AdminQuotesViewProps) {
  const [quotes, setQuotes] = useState<any[]>(initialQuotes);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleUpdateStatus(quoteId: string, status: string, convert = false) {
    setLoadingId(quoteId);
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId,
          status,
          convertToClient: convert,
          contractValue: 15000000,
        }),
      });

      if (res.ok) {
        setQuotes(
          quotes.map((q) => (q.id === quoteId ? { ...q, status: convert ? "DEAL" : status } : q))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
          <span>INCOMING CAMPUS LEADS &amp; PIPELINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
          Permintaan Penawaran Kampus<span className="text-[#3984f5]">.</span>
        </h1>
        <p className="text-[13.5px] text-[#57667c] mt-0.5">
          Kelola prospek lisensi institusi perguruan tinggi dari form paket Campus di halaman harga.
        </p>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-sm overflow-hidden">
        {quotes.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#738196]">
            Belum ada permintaan penawaran kampus yang masuk.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
                <th className="py-3 px-5">Nama Kampus / Institusi</th>
                <th className="py-3 px-5">Perkiraan Pengguna</th>
                <th className="py-3 px-5">Nama PIC</th>
                <th className="py-3 px-5">Kontak PIC</th>
                <th className="py-3 px-5">Status Pipeline</th>
                <th className="py-3 px-5 text-right">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3f8]">
              {quotes.map((q) => {
                const isLoading = loadingId === q.id;

                return (
                  <tr key={q.id} className="hover:bg-[#fafcff]">
                    <td className="py-3.5 px-5 font-bold text-[#243149]">
                      {q.institutionName}
                    </td>
                    <td className="py-3.5 px-5 text-[#57667c]">
                      {q.userCount} Mahasiswa / User
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#243149]">
                      {q.picName}
                    </td>
                    <td className="py-3.5 px-5 text-[#3984f5]">
                      {q.picContact}
                    </td>
                    <td className="py-3.5 px-5">
                      <select
                        value={q.status}
                        disabled={isLoading}
                        onChange={(e) => handleUpdateStatus(q.id, e.target.value)}
                        className="text-xs font-bold border border-[#e2e8f0] rounded-lg px-2 py-1 bg-white cursor-pointer"
                      >
                        <option value="NEW">Baru (New)</option>
                        <option value="CONTACTED">Dihubungi</option>
                        <option value="NEGOTIATION">Negosiasi</option>
                        <option value="DEAL">Deal (Aktif)</option>
                        <option value="CANCELLED">Batal</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {q.status !== "DEAL" ? (
                        <button
                          onClick={() => handleUpdateStatus(q.id, "DEAL", true)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all cursor-pointer"
                        >
                          Tandai Deal &amp; Buat Klien
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                          ✓ Lisensi Aktif
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

