"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Cpu,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";

interface ValidationViewProps {
  initialProjects: any[];
}

export function ValidationView({ initialProjects }: ValidationViewProps) {
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjects[0]?.id || ""
  );
  const [validating, setValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleRunValidation = async () => {
    if (!selectedProjectId) return;

    setValidating(true);
    setErrorMsg("");
    setValidationResult(null);

    try {
      const res = await fetch("/api/stats/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: selectedProjectId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal memproses validasi.");
      } else {
        setValidationResult(data.validation);
        // Update local status of project to VALIDATED
        if (data.validation.validation_passed) {
          setProjects((prev) =>
            prev.map((p) =>
              p.id === selectedProjectId ? { ...p, status: "VALIDATED" } : p
            )
          );
        }
      }
    } catch (err: any) {
      setErrorMsg(`Kendala jaringan: ${err.message}`);
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div>
        <div className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
          RESEARCH VALIDATION ENGINE
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
          Validasi Penelitian<span className="text-[#3984f5]">.</span>
        </h1>
        <p className="text-[13.5px] text-[#57667c] mt-0.5">
          Periksa konsistensi perhitungan sebelum melangkah lebih jauh.
        </p>
      </div>

      {/* 2. Engine Description Banner */}
      <div className="bg-[#edf5ff] border border-[#d6e6fe] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
        <Cpu className="w-6 h-6 text-[#3984f5] shrink-0 mt-0.5" />
        <div className="text-[13px] text-[#243149] space-y-1">
          <div className="font-bold flex items-center gap-2">
            <span>Mesin Verifikasi Dual-Engine</span>
            <span className="text-[10.5px] bg-[#16a34a] text-white px-2 py-0.5 rounded-full font-bold">
              Toleransi &lt; 10⁻⁶
            </span>
          </div>
          <p className="text-[#57667c] leading-relaxed">
            Mesin validasi Bedah Data menghitung ulang data Anda menggunakan dua jalur komputasi independen
            (Statsmodels OLS &amp; Scipy Linregress), mengaudit kecukupan sampel ($N \ge 30$), serta memastikan
            kelengkapan nilai tanpa missing values.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3. Project Selection & Trigger */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#243149]">Pilih Proyek Penelitian untuk Divalidasi:</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projects.map((p) => {
            const isSelected = p.id === selectedProjectId;
            const isValidated = p.status === "VALIDATED";

            return (
              <div
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-[#3984f5] bg-[#f4f8ff] shadow-sm"
                    : "border-[#e9edf3] hover:border-[#3984f5] bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isValidated
                        ? "bg-[#e8f7ee] text-[#16a34a]"
                        : "bg-[#edf5ff] text-[#3984f5]"
                    }`}
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#243149] leading-tight">
                      {p.title}
                    </h4>
                    <p className="text-[11.5px] text-[#738196] mt-0.5">
                      {p.datasets?.[0]?.rowCount || 120} responden &middot; {p.method || "Regresi Linear"}
                    </p>
                  </div>
                </div>

                <div>
                  {isValidated ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e8f7ee] text-[#15803d]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tervalidasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#fff6e5] text-[#b45309]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {p.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedProject && (
          <div className="pt-4 border-t border-[#f0f3f8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-[#57667c]">
                Proyek terpilih: <strong className="text-[#243149]">{selectedProject.title}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunValidation}
              disabled={validating}
              className="px-6 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-[13.5px] rounded-xl shadow-md shadow-[#16a34a]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
            >
              {validating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menjalankan Dual-Engine Verification...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Jalankan Validasi Komputasi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 4. Validation Engine Output */}
      {validationResult && (
        <div className="bg-white rounded-2xl border border-[#16a34a]/40 p-6 sm:p-8 space-y-6 shadow-md animate-fadeIn">
          {/* Verdict Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#f0f3f8]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f7ee] text-[#16a34a] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-[#243149]">
                    Hasil Pemeriksaan Komputasi
                  </h3>
                  <span className="text-[11px] font-bold bg-[#e8f7ee] text-[#15803d] border border-[#bbf7d0] px-3 py-0.5 rounded-full">
                    {validationResult.badge}
                  </span>
                </div>
                <p className="text-xs text-[#738196] mt-0.5">
                  Lolos pengujian toleransi selisih komputasi (&lt; {validationResult.tolerance}).
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-center">
              <span className="text-[11px] font-bold text-[#15803d] uppercase tracking-wider block">
                Status Proyek
              </span>
              <span className="text-sm font-extrabold text-[#15803d]">Tervalidasi</span>
            </div>
          </div>

          {/* Checklist Cards */}
          <div className="space-y-3">
            <h4 className="text-[13.5px] font-bold text-[#243149]">Daftar Cek Lulus/Gagal:</h4>

            {validationResult.checks?.map((check: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-[#e8edf5] bg-[#fafcff] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      check.passed
                        ? "bg-[#e8f7ee] text-[#16a34a]"
                        : "bg-[#fef2f2] text-[#dc2626]"
                    }`}
                  >
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#243149]">{check.check}</div>
                    <div className="text-[11.5px] text-[#738196]">{check.detail}</div>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    check.passed
                      ? "bg-[#e8f7ee] text-[#15803d]"
                      : "bg-[#fef2f2] text-[#dc2626]"
                  }`}
                >
                  {check.passed ? "LULUS" : "GAGAL"}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[12px] text-[#738196] flex items-center justify-between border-t border-[#f0f3f8]">
            <span>Audit komputasi dicatat dan siap dimasukkan ke laporan akhir.</span>
            <a href="/laporan" className="text-[#3984f5] font-bold hover:underline">
              Buka Laporan Riset &rarr;
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

