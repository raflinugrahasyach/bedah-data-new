"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderPlus,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  Check,
  RotateCw,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface DatasetOption {
  id: string;
  fileName: string;
  rowCount: number;
  columnCount: number;
  fileType: string;
}

interface ProjectCreateWizardProps {
  datasets: DatasetOption[];
}

const METHODS = [
  { id: "SIMPLE_REGRESSION", name: "Regresi Linier Sederhana", desc: "Menguji pengaruh 1 variabel bebas terhadap 1 variabel terikat" },
  { id: "MULTIPLE_REGRESSION", name: "Regresi Linier Berganda", desc: "Menguji pengaruh simultan 2 atau lebih variabel prediktor" },
  { id: "PEARSON", name: "Korelasi Pearson", desc: "Mengukur derajat dan arah keeratan hubungan antar variabel" },
  { id: "DESCRIPTIVE", name: "Statistik Deskriptif", desc: "Menyajikan ringkasan nilai tengah, sebaran, dan frekuensi data" },
  { id: "VALIDITY", name: "Uji Validitas & Reliabilitas", desc: "Menguji ketepatan dan konsistensi butir kuesioner" },
];

export function ProjectCreateWizard({ datasets }: ProjectCreateWizardProps) {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<number>(1);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(
    datasets[0]?.id || ""
  );
  const [selectedMethod, setSelectedMethod] = useState<string>("SIMPLE_REGRESSION");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (!title.trim()) {
      setErrorMessage("Judul proyek penelitian wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/project/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          hypothesis,
          method: selectedMethod,
          datasetId: selectedDatasetId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Completely bypass and suppress any legacy paywall messages
        if (data.error && (data.error.includes("Batas paket") || data.error.includes("upgrade paket"))) {
          console.warn("Legacy paywall warning suppressed:", data.error);
        } else {
          setErrorMessage(data.error || "Gagal membuat proyek.");
        }
      } else {
        router.push(`/proyek/${data.projectId}`);
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Wizard Header */}
      <div>
        <div className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
          LANGKAH AWAL RISET
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
          Buat Proyek Penelitian Baru<span className="text-[#3984f5]">.</span>
        </h1>
        <p className="text-[13.5px] text-[#57667c] mt-0.5">
          Atur pertanyaan riset, tautkan dataset, dan tentukan arah analisis ilmiah Anda.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2 border-b border-[#e9edf3] pb-4">
        {[
          { num: 1, label: "Identitas Riset" },
          { num: 2, label: "Tautkan Dataset" },
          { num: 3, label: "Rencana Metode" },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 text-xs font-semibold ${
              step === s.num
                ? "text-[#3984f5]"
                : step > s.num
                ? "text-[#16a34a]"
                : "text-[#94a3b8]"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === s.num
                  ? "bg-[#3984f5] text-white"
                  : step > s.num
                  ? "bg-green-100 text-green-700"
                  : "bg-[#f1f5f9] text-[#738196]"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </span>
            <span>{s.label}</span>
            {s.num < 3 && <span className="text-[#cbd5e1] mx-2">&rarr;</span>}
          </div>
        ))}
      </div>

      {/* Step 1: Research Identity */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-bold text-[#243149] block mb-1">
              Judul Penelitian <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Pengaruh Motivasi Belajar terhadap Hasil Ujian Mahasiswa"
              className="w-full text-sm rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 focus:outline-none focus:border-[#3984f5]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#243149] block mb-1">
              Pertanyaan Riset / Hipotesis (Opsional)
            </label>
            <textarea
              rows={3}
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="Terdapat pengaruh positif yang signifikan antara motivasi belajar terhadap hasil ujian..."
              className="w-full text-xs rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 focus:outline-none focus:border-[#3984f5]"
            />
            <p className="text-[11px] text-[#738196] mt-1">
              Bedah AI akan membaca hipotesis ini untuk memberikan saran metodologi yang tepat.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-[#243149] block mb-1">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan latar belakang penelitian, populasi responden, atau bidang ilmu..."
              className="w-full text-xs rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 focus:outline-none focus:border-[#3984f5]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                if (!title.trim()) {
                  setErrorMessage("Silakan isi judul penelitian.");
                  return;
                }
                setErrorMessage(null);
                setStep(2);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-bold text-xs rounded-xl transition-all"
            >
              <span>Lanjut: Tautkan Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Dataset Selection */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#243149] block">
              Pilih Dataset Penelitian
            </label>
            <Link
              href="/dataset/upload"
              target="_blank"
              className="text-xs font-semibold text-[#3984f5] hover:underline"
            >
              + Upload dataset baru
            </Link>
          </div>

          {datasets.length === 0 ? (
            <div className="p-5 bg-[#f8faff] rounded-xl border border-[#e2e8f0] text-center text-xs text-[#57667c] space-y-2">
              <p>Belum ada dataset yang tersimpan di akun Anda.</p>
              <Link
                href="/dataset/upload"
                className="inline-block text-[#3984f5] font-bold hover:underline"
              >
                Upload file CSV atau Excel sekarang &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {datasets.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDatasetId(d.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedDatasetId === d.id
                      ? "bg-[#edf5ff] border-[#3984f5] shadow-xs"
                      : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f0f4f9] text-[#3984f5] flex items-center justify-center">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#243149]">{d.fileName}</div>
                      <div className="text-[11px] text-[#738196]">
                        {d.rowCount} baris &middot; {d.columnCount} kolom &middot; {d.fileType.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  {selectedDatasetId === d.id && (
                    <span className="w-5 h-5 rounded-full bg-[#3984f5] text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#e2e8f0] text-xs font-semibold text-[#57667c] rounded-xl hover:bg-[#fafcff]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-bold text-xs rounded-xl transition-all"
            >
              <span>Lanjut: Rencana Metode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Analysis Method Selection */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
          <label className="text-xs font-bold text-[#243149] block">
            Pilih Rencana Metode Analisis
          </label>

          <div className="space-y-2">
            {METHODS.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === m.id
                    ? "bg-[#edf5ff] border-[#3984f5] shadow-xs"
                    : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1]"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#243149]">{m.name}</div>
                  <div className="text-[11px] text-[#738196]">{m.desc}</div>
                </div>
                {selectedMethod === m.id && (
                  <span className="w-5 h-5 rounded-full bg-[#3984f5] text-white flex items-center justify-center text-xs">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#e2e8f0] text-xs font-semibold text-[#57667c] rounded-xl hover:bg-[#fafcff]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Membuat Proyek Riset...</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  <span>Buat &amp; Buka Ruang Riset</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

