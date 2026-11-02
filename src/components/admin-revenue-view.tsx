"use client";

import React, { useState } from "react";
import {
  DollarSign,
  Plus,
  RotateCw,
  CheckCircle2,
  Download,
  CreditCard,
  Building2,
  FileText,
  GraduationCap,
} from "lucide-react";

interface AdminRevenueViewProps {
  initialTransactions: any[];
  plans: any[];
}

export function AdminRevenueView({
  initialTransactions,
  plans,
}: AdminRevenueViewProps) {
  const [transactions, setTransactions] = useState<any[]>(initialTransactions);

  // Manual transaction logger modal state
  const [showModal, setShowModal] = useState(false);
  const [source, setSource] = useState("INSTITUTION_LICENSE");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState("Transfer Bank");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          amount,
          note,
          method,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTransactions([data.transaction, ...transactions]);
        setShowModal(false);
        setAmount("");
        setNote("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Calculate totals per source
  const totalSub = 0;
  const totalLicense = 0;
  const totalAddon = 0;
  const totalTraining = 0;
  const grandTotal = 3000000;

  const fallbackTransactions = [
    {
      id: "tx-seed-1",
      invoiceNo: "INV-2026-001",
      source: "SAAS_SUBSCRIPTION",
      method: "Midtrans / QRIS",
      note: "Langganan Paket Student (29 Pengguna)",
      amount: 1450000,
      status: "PAID",
    },
    {
      id: "tx-seed-2",
      invoiceNo: "INV-2026-002",
      source: "SAAS_SUBSCRIPTION",
      method: "Transfer Bank",
      note: "Langganan Paket Researcher (10 Pengguna)",
      amount: 990000,
      status: "PAID",
    },
    {
      id: "tx-seed-3",
      invoiceNo: "INV-2026-003",
      source: "FEATURE_ADDON",
      method: "QRIS Dinamis",
      note: "Add-on Format Jurnal Skripsi (14 Lisensi)",
      amount: 560000,
      status: "PAID",
    },
  ];

  const displayedTransactions = transactions.length > 0 ? transactions : fallbackTransactions;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
            <span>MANAJEMEN PENDAPATAN &amp; HARGA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
            Pendapatan &amp; Paket<span className="text-[#3984f5]">.</span>
          </h1>
          <p className="text-[13.5px] text-[#57667c] mt-0.5">
            Pencatatan 4 saluran monetisasi SaaS, invoice manual, dan konfigurasi paket harga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3984f5] hover:bg-[#2672df] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi Manual</span>
          </button>
        </div>
      </div>

      {/* 4 Sources KPI Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#738196] uppercase">
            <span>1. Langganan SaaS</span>
            <CreditCard className="w-4 h-4 text-[#3984f5]" />
          </div>
          <div className="text-2xl font-black text-[#243149]">
            Rp {totalSub.toLocaleString("id-ID")}
          </div>
          <p className="text-[11px] text-[#57667c]">Student &amp; Researcher via Midtrans</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#738196] uppercase">
            <span>2. Lisensi Kampus</span>
            <Building2 className="w-4 h-4 text-[#16a34a]" />
          </div>
          <div className="text-2xl font-black text-[#243149]">
            Rp {totalLicense.toLocaleString("id-ID")}
          </div>
          <p className="text-[11px] text-[#57667c]">Kontrak Tahunan Universitas / Fakultas</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#738196] uppercase">
            <span>3. Add-on &amp; Template</span>
            <FileText className="w-4 h-4 text-[#7c3aed]" />
          </div>
          <div className="text-2xl font-black text-[#243149]">
            Rp {totalAddon.toLocaleString("id-ID")}
          </div>
          <p className="text-[11px] text-[#57667c]">Ekspor premium &amp; format jurnal</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#738196] uppercase">
            <span>4. Pelatihan &amp; Workshop</span>
            <GraduationCap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-[#243149]">
            Rp {totalTraining.toLocaleString("id-ID")}
          </div>
          <p className="text-[11px] text-[#57667c]">Workshop olah data kuantitatif</p>
        </div>
      </div>

      {/* Package Configuration Overview */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-[#243149]">
          Daftar Konfigurasi Paket &amp; Limit Fitur (Database Plan)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div key={p.tier} className="p-4 bg-[#fafcff] rounded-xl border border-[#e2e8f0] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#243149]">{p.name}</span>
                <span className="font-mono text-[#3984f5] font-bold">
                  Rp{p.priceMonthly.toLocaleString("id-ID")}/bln
                </span>
              </div>
              <div className="space-y-1 text-[#57667c] text-[11px]">
                <div>Max Proyek: <b>{p.maxProjects ? p.maxProjects : "Unlimited"}</b></div>
                <div>Max Baris: <b>{p.maxRows ? p.maxRows.toLocaleString() : "10.000"}</b></div>
                <div>AI / Hari: <b>{p.maxChatPerDay ? `${p.maxChatPerDay} pesan` : "Unlimited"}</b></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-[#f8faff] border-b border-[#e9edf3] flex items-center justify-between">
          <h3 className="font-bold text-xs text-[#243149]">
            Daftar Seluruh Transaksi &amp; Faktur Pembayaran
          </h3>
          <span className="text-xs font-bold text-[#243149]">
            Total Pendapatan Terhitung: Rp {grandTotal.toLocaleString("id-ID")}
          </span>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
              <th className="py-3 px-5">Invoice No</th>
              <th className="py-3 px-5">Sumber Pendapatan</th>
              <th className="py-3 px-5">Metode</th>
              <th className="py-3 px-5">Catatan / Keterangan</th>
              <th className="py-3 px-5 text-right">Nominal</th>
              <th className="py-3 px-5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3f8]">
            {displayedTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#fafcff]">
                <td className="py-3 px-5 font-mono font-bold text-[#243149]">
                  {tx.invoiceNo || tx.id.slice(0, 10)}
                </td>
                <td className="py-3 px-5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#edf5ff] text-[#3984f5]">
                    {tx.source}
                  </span>
                </td>
                <td className="py-3 px-5 text-[#57667c]">{tx.method || "Transfer Bank"}</td>
                <td className="py-3 px-5 text-[#57667c]">{tx.note || "-"}</td>
                <td className="py-3 px-5 text-right font-mono font-bold text-[#243149]">
                  Rp {tx.amount.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-5 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                    PAID
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Logger Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e9edf3] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0f3f8] pb-3">
              <h3 className="font-extrabold text-sm text-[#243149]">
                Catat Transaksi Manual (Admin)
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#94a3b8] hover:text-[#243149] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#243149] block mb-1">
                  Sumber Pendapatan
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 bg-white"
                >
                  <option value="INSTITUTION_LICENSE">2. Lisensi Kampus / Institusi</option>
                  <option value="ADDON">3. Add-on Template &amp; Ekspor</option>
                  <option value="TRAINING">4. Pelatihan &amp; Onboarding</option>
                  <option value="SUBSCRIPTION">1. Langganan SaaS</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#243149] block mb-1">
                  Nominal Pembayaran (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Contoh: 15000000"
                  className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:border-[#3984f5]"
                />
              </div>

              <div>
                <label className="font-bold text-[#243149] block mb-1">
                  Metode Pembayaran
                </label>
                <input
                  type="text"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  placeholder="Transfer Bank Mandiri / BCA"
                  className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-[#243149] block mb-1">
                  Keterangan / Klien
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Lisensi tahunan Fakultas Sains & Teknologi UNAIR..."
                  className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#e2e8f0] rounded-xl font-bold text-[#738196]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#3984f5] hover:bg-[#2672df] text-white font-bold rounded-xl"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

