"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Loader2,
  ArrowRight,
  Database,
  Table as TableIcon,
  Sparkles,
} from "lucide-react";

export function DatasetUploadView() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Analysis state
  const [calculating, setCalculating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setErrorMsg("");
    setAnalysisResult(null);

    // Reject .sav on client side immediately with prompt message
    const name = file.name.toLowerCase();
    if (name.endsWith(".sav")) {
      setErrorMsg(
        "File SPSS (.sav) tidak didukung. Silakan ekspor data Anda ke format Excel (.xlsx/.xls) atau CSV terlebih dahulu."
      );
      return;
    }

    if (!name.endsWith(".csv") && !name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      setErrorMsg("Format file tidak didukung. Mohon upload file CSV, XLSX, atau XLS.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Ukuran file melebihi batas 10 MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/dataset/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal mengunggah dataset.");
      } else {
        setUploadResult(data);
      }
    } catch (err: any) {
      setErrorMsg(`Terjadi kesalahan jaringan: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const runDescriptiveAnalysis = async () => {
    if (!uploadResult?.dataset?.id) return;

    setCalculating(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/stats/descriptive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetId: uploadResult.dataset.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menjalankan analisis statistik deskriptif.");
      } else {
        setAnalysisResult(data.result);
      }
    } catch (err: any) {
      setErrorMsg(`Gagal memanggil mesin statistik: ${err.message}`);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div>
        <div className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
          RUANG UNGGAH DATASET
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
          Upload Dataset Penelitian<span className="text-[#3984f5]">.</span>
        </h1>
        <p className="text-[13.5px] text-[#57667c] mt-0.5">
          Satu alur untuk validasi format, kualitas observasi, dan perhitungan statistik otomatis.
        </p>
      </div>

      {/* 2. Format Notice & Guidelines Banner */}
      <div className="bg-[#edf5ff] border border-[#d6e6fe] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
        <AlertCircle className="w-5 h-5 text-[#3984f5] shrink-0 mt-0.5" />
        <div className="text-[13px] text-[#243149] space-y-1">
          <div className="font-bold flex items-center gap-2">
            <span>Aturan Format Dataset</span>
            <span className="text-[10.5px] bg-[#fff] text-[#e11d48] px-2 py-0.5 rounded-full border border-red-200 font-semibold">
              SPSS (.sav) Tidak Didukung
            </span>
          </div>
          <p className="text-[#57667c] leading-relaxed">
            Format yang diterima: <strong>CSV, XLSX, dan XLS</strong>. Maksimal <strong>10 MB</strong>,{" "}
            <strong>50 kolom</strong>, dan <strong>10.000 baris</strong>. Baris pertama harus berisi nama
            variabel unik. Jangan sertakan data sensitif (ganti nama responden dengan kode kode R-001, dst).
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3. Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-[#3984f5] bg-[#edf5ff]"
            : "border-[#d8e2ee] bg-white hover:border-[#3984f5] hover:bg-[#fafcff]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-[#edf5ff] text-[#3984f5] flex items-center justify-center mx-auto mb-4 shadow-sm">
          {uploading ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : (
            <Upload className="w-7 h-7" />
          )}
        </div>

        <h3 className="text-lg font-bold text-[#243149]">
          {uploading ? "Sedang memproses & memvalidasi data..." : "Pilih file atau tarik ke sini"}
        </h3>
        <p className="text-[13px] text-[#738196] mt-1 max-w-sm mx-auto">
          Mendukung format .CSV, .XLSX, dan .XLS hingga 10.000 baris data riset.
        </p>

        <button
          type="button"
          disabled={uploading}
          className="mt-5 px-5 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-semibold text-[13px] rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memvalidasi...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Telusuri File</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Uploaded Dataset Review & Data Quality */}
      {uploadResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Success Banner */}
          <div className="bg-white rounded-2xl border border-[#d6e6fe] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e8f7ee] text-[#16a34a] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-[#243149]">
                    {uploadResult.dataset.fileName}
                  </h3>
                  <span className="text-[11px] font-bold uppercase bg-[#edf5ff] text-[#3984f5] px-2 py-0.5 rounded-full">
                    {uploadResult.dataset.fileType}
                  </span>
                </div>
                <p className="text-[12px] text-[#738196] mt-0.5">
                  Berhasil diunggah dan disimpan ke server riset yang terenkripsi.
                </p>
              </div>
            </div>

            <button
              onClick={runDescriptiveAnalysis}
              disabled={calculating}
              className="px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-[13.5px] rounded-xl shadow-md shadow-[#16a34a]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {calculating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menghitung di Mesin Python...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  <span>Jalankan Analisis Statistik Deskriptif</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* 5 Quality Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white rounded-xl border border-[#e9edf3] p-4 text-center">
              <div className="text-[11px] font-semibold text-[#738196] uppercase">Total Baris</div>
              <div className="text-2xl font-extrabold text-[#243149] mt-1">
                {uploadResult.dataset.rowCount}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e9edf3] p-4 text-center">
              <div className="text-[11px] font-semibold text-[#738196] uppercase">Total Kolom</div>
              <div className="text-2xl font-extrabold text-[#243149] mt-1">
                {uploadResult.dataset.columnCount}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e9edf3] p-4 text-center">
              <div className="text-[11px] font-semibold text-[#738196] uppercase">Missing Values</div>
              <div
                className={`text-2xl font-extrabold mt-1 ${
                  uploadResult.dataset.missingCount > 0 ? "text-amber-600" : "text-[#16a34a]"
                }`}
              >
                {uploadResult.dataset.missingCount}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e9edf3] p-4 text-center">
              <div className="text-[11px] font-semibold text-[#738196] uppercase">Duplikat</div>
              <div className="text-2xl font-extrabold text-[#243149] mt-1">
                {uploadResult.dataset.duplicateCount}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e9edf3] p-4 text-center">
              <div className="text-[11px] font-semibold text-[#738196] uppercase">Outlier (IQR)</div>
              <div
                className={`text-2xl font-extrabold mt-1 ${
                  uploadResult.dataset.outlierCount > 0 ? "text-amber-600" : "text-[#16a34a]"
                }`}
              >
                {uploadResult.dataset.outlierCount}
              </div>
            </div>
          </div>

          {/* Variable Metadata Scheme */}
          <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm">
            <h4 className="text-[15px] font-bold text-[#243149] mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#3984f5]" />
              <span>Struktur &amp; Tipe Variabel Terdeteksi Otomatis</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {uploadResult.dataset.variables.map((v: any) => (
                <div
                  key={v.name}
                  className="p-3 rounded-xl border border-[#e9edf3] bg-[#fafcff] flex items-center justify-between"
                >
                  <span className="font-mono text-xs font-bold text-[#243149]">{v.name}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      v.type === "NUMERIC"
                        ? "bg-[#edf5ff] text-[#3984f5]"
                        : v.type === "ORDINAL"
                        ? "bg-[#fff6e5] text-[#b45309]"
                        : "bg-[#f3e8ff] text-[#7c3aed]"
                    }`}
                  >
                    {v.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Table Preview */}
          <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#f0f3f8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-[#3984f5]" />
                <h4 className="text-[14px] font-bold text-[#243149]">Pratinjau Data</h4>
              </div>
              <span className="text-xs text-[#738196]">{uploadResult.note}</span>
            </div>

            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f8faff] text-[#57667c] font-semibold border-b border-[#e9edf3]">
                    {Object.keys(uploadResult.previewRows[0] || {}).map((col) => (
                      <th key={col} className="p-3 font-mono">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f3f8]">
                  {uploadResult.previewRows.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-[#fafcff]">
                      {Object.keys(row).map((k) => (
                        <td key={k} className="p-3 text-[#243149]">
                          {row[k] !== null ? String(row[k]) : <span className="text-gray-300">null</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Python Engine Descriptive Statistics Result Display */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border border-[#3984f5]/30 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#f0f3f8] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#edf5ff] text-[#3984f5] flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#243149]">
                  Hasil Analisis Statistik Deskriptif (Python Engine)
                </h3>
                <p className="text-xs text-[#16a34a] font-medium flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dihitung secara presisi menggunakan pandas &amp; scipy di backend</span>
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-[#f0f3f8] text-[#57667c] px-3 py-1 rounded-lg">
              N = {analysisResult.row_count} observasi
            </span>
          </div>

          {/* Academic Interpretation Banner */}
          <div className="p-4 rounded-xl bg-[#f8faff] border border-[#e2ecf9] text-[13px] text-[#243149]">
            <div className="font-bold mb-1 flex items-center gap-1.5 text-[#3984f5]">
              <Sparkles className="w-4 h-4" />
              <span>Ringkasan Akademik Bedah Data:</span>
            </div>
            <p className="text-[#57667c] leading-relaxed">{analysisResult.summary}</p>
          </div>

          {/* Numeric Table */}
          {analysisResult.numeric?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#e9edf3] rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#f0f4fb] text-[#243149] font-bold border-b border-[#e9edf3]">
                    <th className="p-3">Variabel</th>
                    <th className="p-3">N</th>
                    <th className="p-3">Mean</th>
                    <th className="p-3">Median</th>
                    <th className="p-3">Std. Dev</th>
                    <th className="p-3">Varians</th>
                    <th className="p-3">Min</th>
                    <th className="p-3">Max</th>
                    <th className="p-3">Range</th>
                    <th className="p-3">Skewness</th>
                    <th className="p-3">Kurtosis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f3f8]">
                  {analysisResult.numeric.map((row: any) => (
                    <tr key={row.variable} className="hover:bg-[#fafcff]">
                      <td className="p-3 font-bold font-mono text-[#3984f5]">{row.variable}</td>
                      <td className="p-3 font-semibold">{row.n}</td>
                      <td className="p-3">{row.mean !== null ? row.mean.toFixed(2) : "-"}</td>
                      <td className="p-3">{row.median !== null ? row.median.toFixed(2) : "-"}</td>
                      <td className="p-3">{row.std !== null ? row.std.toFixed(2) : "-"}</td>
                      <td className="p-3">{row.variance !== null ? row.variance.toFixed(2) : "-"}</td>
                      <td className="p-3">{row.min}</td>
                      <td className="p-3">{row.max}</td>
                      <td className="p-3">{row.range}</td>
                      <td className="p-3">{row.skewness !== null ? row.skewness.toFixed(3) : "-"}</td>
                      <td className="p-3">{row.kurtosis !== null ? row.kurtosis.toFixed(3) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

