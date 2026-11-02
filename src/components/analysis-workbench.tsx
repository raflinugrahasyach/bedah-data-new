"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
  Play,
  RotateCw,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Sliders,
  Check,
  ArrowRight,
  Info,
  Layers,
  PieChart,
  Table,
} from "lucide-react";

interface ProjectOption {
  id: string;
  title: string;
  hypothesis?: string | null;
  status: string;
  datasets: DatasetOption[];
}

interface DatasetOption {
  id: string;
  fileName: string;
  rowCount: number;
  columnCount: number;
  variables: any;
  projectId?: string | null;
}

interface AnalysisWorkbenchProps {
  projects: ProjectOption[];
  datasets: DatasetOption[];
  initialDatasetId?: string;
  initialProjectId?: string;
}

const METHODS = [
  {
    id: "DESCRIPTIVE",
    name: "Statistik Deskriptif",
    desc: "Mean, median, modus, standar deviasi, kuartil, dan distribusi frekuensi.",
    badge: "Eksplorasi Dasar",
    icon: Table,
  },
  {
    id: "VISUALIZATION",
    name: "Visualisasi Data",
    desc: "Histogram sebaran, diagram batang, boxplot interaktif, dan scatter plot.",
    badge: "Grafik & Chart",
    icon: BarChart3,
  },
  {
    id: "VALIDITY",
    name: "Uji Validitas Butir",
    desc: "Korelasi Pearson butir-total kuesioner dibandingkan dengan R-Tabel (df = N - 2).",
    badge: "Kuesioner",
    icon: ShieldCheck,
  },
  {
    id: "RELIABILITY",
    name: "Uji Reliabilitas",
    desc: "Konsistensi internal Cronbach's Alpha (benchmark ≥ 0.70) & Alpha jika butir dihapus.",
    badge: "Kuesioner",
    icon: CheckCircle2,
  },
  {
    id: "PEARSON",
    name: "Korelasi Pearson",
    desc: "Arah dan kekuatan keeratan hubungan linier antar 2 variabel atau matriks korelasi.",
    badge: "Hubungan",
    icon: TrendingUp,
  },
  {
    id: "SIMPLE_REGRESSION",
    name: "Regresi Linier Sederhana",
    desc: "Pengaruh 1 variabel bebas (X) terhadap 1 variabel terikat (Y), uji t, dan ANOVA F.",
    badge: "Pengaruh (1 Variabel)",
    icon: Sliders,
  },
  {
    id: "MULTIPLE_REGRESSION",
    name: "Regresi Linier Berganda",
    desc: "Pengaruh simultan beberapa variabel X terhadap Y, standardized Beta, dan VIF.",
    badge: "Pengaruh Berganda",
    icon: Layers,
  },
  {
    id: "CLASSICAL_ASSUMPTIONS",
    name: "Uji Asumsi Klasik",
    desc: "Normalitas residual (Shapiro-Wilk), heteroskedastisitas, autokorelasi, dan multikolinearitas.",
    badge: "Syarat Regresi",
    icon: AlertCircle,
  },
];

export function AnalysisWorkbench({
  projects,
  datasets,
  initialDatasetId,
  initialProjectId,
}: AnalysisWorkbenchProps) {
  // Selection states
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || projects[0]?.id || ""
  );
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(
    initialDatasetId ||
      datasets.find((d) => d.projectId === selectedProjectId)?.id ||
      datasets[0]?.id ||
      ""
  );
  const [selectedMethod, setSelectedMethod] = useState<string>("SIMPLE_REGRESSION");

  // Dataset columns state
  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const variablesList: string[] = React.useMemo(() => {
    if (!selectedDataset || !selectedDataset.variables) return [];
    if (Array.isArray(selectedDataset.variables)) {
      return selectedDataset.variables.map((v: any) =>
        typeof v === "string" ? v : v.name
      );
    }
    return Object.keys(selectedDataset.variables);
  }, [selectedDataset]);

  // Method specific parameters
  const [paramXVar, setParamXVar] = useState<string>("");
  const [paramYVar, setParamYVar] = useState<string>("");
  const [paramXMultiple, setParamXMultiple] = useState<string[]>([]);
  const [paramItemVars, setParamItemVars] = useState<string[]>([]);
  const [paramTotalVar, setParamTotalVar] = useState<string>("");
  const [paramCorrMethod, setParamCorrMethod] = useState<string>("pearson");

  // Execution & result state
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [lastAnalysisId, setLastAnalysisId] = useState<string | null>(null);

  // AI Recommendation state
  const [isRecommending, setIsRecommending] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<any | null>(null);

  // Initialize default variable choices when variables load
  useEffect(() => {
    if (variablesList.length >= 2) {
      if (!paramXVar) setParamXVar(variablesList[0]);
      if (!paramYVar) setParamYVar(variablesList[1]);
      if (paramXMultiple.length === 0) setParamXMultiple([variablesList[0]]);
      if (paramItemVars.length === 0) setParamItemVars(variablesList.slice(0, Math.min(5, variablesList.length)));
    }
  }, [variablesList]);

  // Handle AI Method Recommendation
  async function handleRecommendMethod() {
    setIsRecommending(true);
    setAiRecommendation(null);
    try {
      const res = await fetch("/api/ai/recommend-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: selectedProject?.title,
          hypothesis: selectedProject?.hypothesis,
          variables: variablesList,
          rowCount: selectedDataset?.rowCount,
        }),
      });
      const data = await res.json();
      setAiRecommendation(data);
      if (data.recommendedMethod) {
        setSelectedMethod(data.recommendedMethod);
        if (data.suggestedX && variablesList.includes(data.suggestedX)) {
          setParamXVar(data.suggestedX);
        }
        if (data.suggestedY && variablesList.includes(data.suggestedY)) {
          setParamYVar(data.suggestedY);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecommending(false);
    }
  }

  // Handle executing analysis
  async function handleRunAnalysis() {
    if (!selectedDatasetId) {
      setExecutionError("Pilih dataset terlebih dahulu.");
      return;
    }

    setIsExecuting(true);
    setExecutionError(null);
    setAnalysisResult(null);

    // Build params based on method
    let params: any = {};
    if (selectedMethod === "DESCRIPTIVE" || selectedMethod === "VISUALIZATION") {
      params.variables = variablesList;
    } else if (selectedMethod === "SIMPLE_REGRESSION") {
      if (!paramXVar || !paramYVar) {
        setExecutionError("Pilih variabel X dan Y terlebih dahulu.");
        setIsExecuting(false);
        return;
      }
      params.xVar = paramXVar;
      params.yVar = paramYVar;
    } else if (selectedMethod === "MULTIPLE_REGRESSION") {
      if (paramXMultiple.length < 2 || !paramYVar) {
        setExecutionError("Pilih minimal 2 variabel bebas (X) dan 1 variabel terikat (Y).");
        setIsExecuting(false);
        return;
      }
      params.xVars = paramXMultiple;
      params.yVar = paramYVar;
    } else if (selectedMethod === "PEARSON") {
      if (paramItemVars.length < 2) {
        setExecutionError("Pilih minimal 2 variabel untuk korelasi.");
        setIsExecuting(false);
        return;
      }
      params.variables = paramItemVars;
      params.corrMethod = paramCorrMethod;
    } else if (selectedMethod === "VALIDITY") {
      if (paramItemVars.length < 2) {
        setExecutionError("Pilih minimal 2 butir kuesioner.");
        setIsExecuting(false);
        return;
      }
      params.itemVars = paramItemVars;
      params.totalVar = paramTotalVar || null;
      params.alpha = 0.05;
    } else if (selectedMethod === "RELIABILITY") {
      if (paramItemVars.length < 2) {
        setExecutionError("Pilih minimal 2 butir kuesioner.");
        setIsExecuting(false);
        return;
      }
      params.itemVars = paramItemVars;
    } else if (selectedMethod === "CLASSICAL_ASSUMPTIONS") {
      if (!paramYVar) {
        setExecutionError("Pilih variabel terikat (Y).");
        setIsExecuting(false);
        return;
      }
      params.xVars = paramXMultiple.length > 0 ? paramXMultiple : [paramXVar];
      params.yVar = paramYVar;
    }

    try {
      const res = await fetch("/api/stats/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetId: selectedDatasetId,
          projectId: selectedProjectId || selectedDataset?.projectId,
          method: selectedMethod,
          params,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setExecutionError(data.error || "Gagal menjalankan analisis.");
      } else {
        setAnalysisResult(data.result);
        setLastAnalysisId(data.analysisId);
      }
    } catch (err: any) {
      setExecutionError(`Koneksi terputus: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  }

  // Toggle item in multiple selection
  function toggleMultiVar(varName: string) {
    if (paramXMultiple.includes(varName)) {
      setParamXMultiple(paramXMultiple.filter((v) => v !== varName));
    } else {
      setParamXMultiple([...paramXMultiple, varName]);
    }
  }

  function toggleItemVar(varName: string) {
    if (paramItemVars.includes(varName)) {
      setParamItemVars(paramItemVars.filter((v) => v !== varName));
    } else {
      setParamItemVars([...paramItemVars, varName]);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
            WORKBENCH STATISTIKA ILMIAH
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
            Analisis Statistik<span className="text-[#3984f5]">.</span>
          </h1>
          <p className="text-[13.5px] text-[#57667c] mt-0.5">
            Komputasi presisi tinggi menggunakan library Python terpercaya (scipy, statsmodels, pingouin).
          </p>
        </div>

        {/* AI Method Recommendation Trigger Button */}
        <button
          onClick={handleRecommendMethod}
          disabled={isRecommending || !selectedDataset}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3984f5] to-[#5a9cff] hover:from-[#2c78ea] hover:to-[#438bf5] text-white font-semibold text-[13px] rounded-xl shadow-sm transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isRecommending ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          <span>Rekomendasikan Metode</span>
        </button>
      </div>

      {/* AI Recommendation Banner if active */}
      {aiRecommendation && (
        <div className="bg-gradient-to-r from-[#edf5ff] to-[#f4f8ff] border border-[#d6e6fe] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3984f5]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Saran Metodologi Bedah AI
            </div>
            <span className="text-[11px] bg-white px-2.5 py-0.5 rounded-full border border-[#d6e6fe] font-medium text-[#243149]">
              {aiRecommendation.methodTitle}
            </span>
          </div>
          <p className="text-[13px] text-[#243149] font-medium leading-relaxed">
            {aiRecommendation.reason}
          </p>
          {aiRecommendation.steps && (
            <div className="pt-2 border-t border-[#d6e6fe]/60 flex flex-wrap gap-2 text-[11.5px] text-[#57667c]">
              {aiRecommendation.steps.map((step: string, i: number) => (
                <span
                  key={i}
                  className="bg-white/80 px-2 py-0.5 rounded-md border border-[#e2e8f0]"
                >
                  ✓ {step}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Workspace Controls: Project & Dataset Picker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Selector */}
        <div className="bg-white rounded-2xl border border-[#e9edf3] p-4.5 shadow-[0_2px_8px_rgba(36,49,73,0.02)]">
          <label className="text-[11px] font-bold uppercase text-[#738196] tracking-wider block mb-1.5">
            1. Proyek Penelitian Aktif
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              const linked = datasets.find((d) => d.projectId === e.target.value);
              if (linked) setSelectedDatasetId(linked.id);
            }}
            className="w-full text-[13.5px] font-semibold text-[#243149] bg-[#f8faff] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#3984f5]"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.status})
              </option>
            ))}
          </select>
        </div>

        {/* Dataset Selector */}
        <div className="bg-white rounded-2xl border border-[#e9edf3] p-4.5 shadow-[0_2px_8px_rgba(36,49,73,0.02)]">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase text-[#738196] tracking-wider block">
              2. Dataset Yang Dianalisis
            </label>
            <Link
              href="/dataset/upload"
              className="text-[11px] font-semibold text-[#3984f5] hover:underline"
            >
              + Upload baru
            </Link>
          </div>
          <select
            value={selectedDatasetId}
            onChange={(e) => setSelectedDatasetId(e.target.value)}
            className="w-full text-[13.5px] font-semibold text-[#243149] bg-[#f8faff] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#3984f5]"
          >
            {datasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fileName} ({d.rowCount} baris &middot; {d.columnCount} kolom)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Methods Grid (8 Modules) */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold uppercase text-[#738196] tracking-wider block">
          3. Pilih Modul Analisis Statistik
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {METHODS.map((m) => {
            const isSelected = selectedMethod === m.id;
            const IconComp = m.icon;

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#edf5ff] border-[#3984f5] shadow-[0_4px_16px_rgba(57,132,245,0.12)] ring-1 ring-[#3984f5]"
                    : "bg-white border-[#e9edf3] hover:border-[#ccd7e6] shadow-[0_2px_6px_rgba(36,49,73,0.02)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? "bg-[#3984f5] text-white"
                          : "bg-[#f0f4f9] text-[#57667c]"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-[#3984f5] text-white"
                          : "bg-[#f1f5f9] text-[#738196]"
                      }`}
                    >
                      {m.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-[13.5px] text-[#243149] mb-1">
                    {m.name}
                  </h3>
                  <p className="text-[11.5px] text-[#57667c] leading-relaxed line-clamp-2">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-semibold ${
                      isSelected ? "text-[#3984f5]" : "text-[#738196]"
                    }`}
                  >
                    {isSelected ? "Sedang dipilih" : "Pilih metode"}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      isSelected ? "text-[#3984f5]" : "text-[#94a3b8]"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Variables & Parameters Setup Box */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-[0_2px_8px_rgba(36,49,73,0.02)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0f3f8] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#3984f5]" />
            <h3 className="font-bold text-[14px] text-[#243149]">
              Konfigurasi Variabel &amp; Parameter
            </h3>
          </div>
          <span className="text-xs text-[#738196]">
            Total {variablesList.length} variabel terbaca pada dataset
          </span>
        </div>

        {/* 1. SIMPLE REGRESSION CONFIG */}
        {selectedMethod === "SIMPLE_REGRESSION" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#243149] block mb-1.5">
                Variabel Bebas / Prediktor (X):
              </label>
              <select
                value={paramXVar}
                onChange={(e) => setParamXVar(e.target.value)}
                className="w-full text-xs font-medium border border-[#e2e8f0] rounded-xl px-3 py-2 bg-white"
              >
                {variablesList.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#243149] block mb-1.5">
                Variabel Terikat / Kriteria (Y):
              </label>
              <select
                value={paramYVar}
                onChange={(e) => setParamYVar(e.target.value)}
                className="w-full text-xs font-medium border border-[#e2e8f0] rounded-xl px-3 py-2 bg-white"
              >
                {variablesList.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 2. MULTIPLE REGRESSION & CLASSICAL ASSUMPTIONS CONFIG */}
        {(selectedMethod === "MULTIPLE_REGRESSION" ||
          selectedMethod === "CLASSICAL_ASSUMPTIONS") && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#243149] block mb-1.5">
                Variabel Bebas (X) - Pilih minimal 2 variabel:
              </label>
              <div className="flex flex-wrap gap-2">
                {variablesList.map((v) => {
                  const active = paramXMultiple.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleMultiVar(v)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        active
                          ? "bg-[#3984f5] text-white border-[#3984f5]"
                          : "bg-white text-[#57667c] border-[#e2e8f0] hover:border-[#ccd7e6]"
                      }`}
                    >
                      {active && "✓ "}
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#243149] block mb-1.5">
                Variabel Terikat (Y):
              </label>
              <select
                value={paramYVar}
                onChange={(e) => setParamYVar(e.target.value)}
                className="w-full sm:w-80 text-xs font-medium border border-[#e2e8f0] rounded-xl px-3 py-2 bg-white"
              >
                {variablesList.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 3. VALIDITY & RELIABILITY CONFIG */}
        {(selectedMethod === "VALIDITY" || selectedMethod === "RELIABILITY") && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#243149] block mb-1.5">
                Pilih Butir Pertanyaan / Item Kuesioner:
              </label>
              <div className="flex flex-wrap gap-2">
                {variablesList.map((v) => {
                  const active = paramItemVars.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleItemVar(v)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        active
                          ? "bg-[#3984f5] text-white border-[#3984f5]"
                          : "bg-white text-[#57667c] border-[#e2e8f0] hover:border-[#ccd7e6]"
                      }`}
                    >
                      {active && "✓ "}
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedMethod === "VALIDITY" && (
              <div>
                <label className="text-xs font-semibold text-[#243149] block mb-1.5">
                  Variabel Skor Total (Opsional, kosongkan untuk dihitung otomatis):
                </label>
                <select
                  value={paramTotalVar}
                  onChange={(e) => setParamTotalVar(e.target.value)}
                  className="w-full sm:w-80 text-xs font-medium border border-[#e2e8f0] rounded-xl px-3 py-2 bg-white"
                >
                  <option value="">Hitung Total Otomatis dari Butir Terpilih</option>
                  {variablesList.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* 4. CORRELATION CONFIG */}
        {selectedMethod === "PEARSON" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#243149] block mb-1.5">
                Pilih Variabel untuk Matriks Korelasi (Minimal 2):
              </label>
              <div className="flex flex-wrap gap-2">
                {variablesList.map((v) => {
                  const active = paramItemVars.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleItemVar(v)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        active
                          ? "bg-[#3984f5] text-white border-[#3984f5]"
                          : "bg-white text-[#57667c] border-[#e2e8f0] hover:border-[#ccd7e6]"
                      }`}
                    >
                      {active && "✓ "}
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#243149] block mb-1.5">
                Metode Koefisien Korelasi:
              </label>
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="corr_method"
                    value="pearson"
                    checked={paramCorrMethod === "pearson"}
                    onChange={(e) => setParamCorrMethod(e.target.value)}
                  />
                  <span>Pearson (Data interval/rasio normal)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="corr_method"
                    value="spearman"
                    checked={paramCorrMethod === "spearman"}
                    onChange={(e) => setParamCorrMethod(e.target.value)}
                  />
                  <span>Spearman Rank (Data ordinal/non-parametrik)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 5. DESCRIPTIVE & VISUALIZATION NOTE */}
        {(selectedMethod === "DESCRIPTIVE" || selectedMethod === "VISUALIZATION") && (
          <p className="text-xs text-[#57667c] bg-[#fafcff] p-3 rounded-xl border border-[#e9edf3]">
            Analisis deskriptif dan visualisasi akan merangkum seluruh variabel numerik dan kategorik pada dataset secara otomatis.
          </p>
        )}

        {/* Run Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-[#738196]">
            File aktif: <span className="font-semibold text-[#243149]">{selectedDataset?.fileName}</span> &middot; {selectedDataset?.rowCount} responden
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isExecuting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-bold text-[13px] rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Menghitung di Mesin Python...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Jalankan Analisis Sekarang</span>
              </>
            )}
          </button>
        </div>

        {executionError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{executionError}</span>
          </div>
        )}
      </div>

      {/* RESULTS DISPLAY SECTION */}
      {analysisResult && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-[#e9edf3] pb-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#16a34a]">
                HASIL KOMPUTASI STATISTIK
              </div>
              <h2 className="text-xl font-extrabold text-[#243149]">
                Output Analisis Ilmiah
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/validasi"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#edf5ff] hover:bg-[#d6e6fe] text-[#3984f5] font-semibold text-xs rounded-xl transition-all"
              >
                <span>Validasi Hasil</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/laporan"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#3984f5] hover:bg-[#2672df] text-white font-semibold text-xs rounded-xl transition-all"
              >
                <span>Ekspor Laporan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 1. REGRESSION OUTPUT */}
          {(selectedMethod === "SIMPLE_REGRESSION" || selectedMethod === "MULTIPLE_REGRESSION") && (
            <div className="space-y-4">
              {/* Equation Card */}
              {analysisResult.equation && (
                <div className="bg-[#fafcff] border border-[#d6e6fe] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#738196]">Persamaan Model Regresi:</span>
                    <div className="text-base font-extrabold text-[#243149] mt-0.5 font-mono">
                      {analysisResult.equation}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold uppercase text-[#738196]">R-Square (R²):</span>
                    <div className="text-xl font-black text-[#3984f5]">
                      {analysisResult.r_squared}
                    </div>
                  </div>
                </div>
              )}

              {/* Coefficients Table (APA Style) */}
              <div className="bg-white rounded-2xl border border-[#e9edf3] overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-[#f8faff] border-b border-[#e9edf3] font-bold text-xs text-[#243149]">
                  Tabel 1: Koefisien Regresi Linier (Coefficients)
                </div>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
                      <th className="py-2.5 px-4">Model Variabel</th>
                      <th className="py-2.5 px-4 text-right">B (Unstandardized)</th>
                      <th className="py-2.5 px-4 text-right">Std. Error</th>
                      <th className="py-2.5 px-4 text-right">Beta (Standardized)</th>
                      <th className="py-2.5 px-4 text-right">t-hitung</th>
                      <th className="py-2.5 px-4 text-right">Sig. (p-value)</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f3f8]">
                    {analysisResult.coefficients?.map((c: any, i: number) => {
                      const sig = c.p_value !== null && c.p_value < 0.05;
                      return (
                        <tr key={i} className="hover:bg-[#fafcff]">
                          <td className="py-2.5 px-4 font-semibold text-[#243149]">{c.term}</td>
                          <td className="py-2.5 px-4 text-right font-mono">{c.b !== null ? c.b.toFixed(4) : "-"}</td>
                          <td className="py-2.5 px-4 text-right font-mono">{c.std_error !== null ? c.std_error.toFixed(4) : "-"}</td>
                          <td className="py-2.5 px-4 text-right font-mono">{c.beta !== null && c.beta !== undefined ? c.beta.toFixed(4) : "-"}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-[#243149]">{c.t !== null ? c.t.toFixed(3) : "-"}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-[#3984f5]">{c.p_value !== null ? c.p_value.toFixed(4) : "-"}</td>
                          <td className="py-2.5 px-4 text-center">
                            {c.term === "(Constant)" ? (
                              <span className="text-[#94a3b8] text-[11px]">-</span>
                            ) : sig ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-green-50 text-green-700 border border-green-200">
                                Signifikan (p &lt; 0.05)
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Tidak Sig. (p ≥ 0.05)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ANOVA Table */}
              {analysisResult.anova && (
                <div className="bg-white rounded-2xl border border-[#e9edf3] overflow-hidden shadow-sm">
                  <div className="px-5 py-3.5 bg-[#f8faff] border-b border-[#e9edf3] font-bold text-xs text-[#243149]">
                    Tabel 2: Uji Kelayakan Model (ANOVA)
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
                        <th className="py-2 px-4">Sumber Variasi</th>
                        <th className="py-2 px-4 text-right">Sum of Squares</th>
                        <th className="py-2 px-4 text-right">df</th>
                        <th className="py-2 px-4 text-right">Mean Square</th>
                        <th className="py-2 px-4 text-right">F-hitung</th>
                        <th className="py-2 px-4 text-right">Sig. (F)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f3f8]">
                      <tr>
                        <td className="py-2 px-4 font-semibold text-[#243149]">Regression</td>
                        <td className="py-2 px-4 text-right font-mono">{analysisResult.anova.ss_regression?.toFixed(3)}</td>
                        <td className="py-2 px-4 text-right font-mono">{analysisResult.anova.df_regression}</td>
                        <td className="py-2 px-4 text-right font-mono">{analysisResult.anova.ms_regression?.toFixed(3)}</td>
                        <td className="py-2 px-4 text-right font-mono font-bold text-[#243149]">{analysisResult.anova.f_stat?.toFixed(3)}</td>
                        <td className="py-2 px-4 text-right font-mono font-bold text-[#3984f5]">{analysisResult.anova.p_value?.toFixed(4)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-semibold text-[#243149]">Residual</td>
                        <td className="py-2 px-4 text-right font-mono">{analysisResult.anova.ss_residual?.toFixed(3)}</td>
                        <td className="py-2 px-4 text-right font-mono">{analysisResult.anova.df_residual}</td>
                        <td className="py-2 px-4 text-right font-mono">{analysisResult.anova.ms_residual?.toFixed(3)}</td>
                        <td className="py-2 px-4 text-right font-mono">-</td>
                        <td className="py-2 px-4 text-right font-mono">-</td>
                      </tr>
                      <tr className="bg-[#fafcff] font-bold">
                        <td className="py-2 px-4 text-[#243149]">Total</td>
                        <td className="py-2 px-4 text-right font-mono">{analysisResult.anova.ss_total?.toFixed(3)}</td>
                        <td className="py-2 px-4 text-right font-mono">{analysisResult.anova.df_total}</td>
                        <td className="py-2 px-4 text-right font-mono">-</td>
                        <td className="py-2 px-4 text-right font-mono">-</td>
                        <td className="py-2 px-4 text-right font-mono">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Automated AI Interpretation */}
              {analysisResult.interpretation && (
                <div className="bg-[#edf5ff] border border-[#d6e6fe] rounded-2xl p-4.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#3984f5] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Interpretasi Akademik Otomatis (Bedah AI)
                  </div>
                  <p className="text-xs text-[#243149] leading-relaxed font-medium">
                    {analysisResult.interpretation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. VALIDITY TEST OUTPUT */}
          {selectedMethod === "VALIDITY" && (
            <div className="space-y-4">
              <div className="bg-[#fafcff] border border-[#d6e6fe] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-[#738196]">Cutoff Kriteria:</div>
                  <div className="text-sm font-bold text-[#243149]">
                    R-Tabel (df = {analysisResult.df}, α = {analysisResult.alpha}) = <span className="text-[#3984f5]">{analysisResult.r_table}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#738196]">Hasil Butir:</div>
                  <div className="text-sm font-bold text-[#16a34a]">
                    {analysisResult.valid_items_count} dari {analysisResult.total_items} Butir Dinyatakan VALID
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#e9edf3] overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
                      <th className="py-2.5 px-4">Butir Kuesioner</th>
                      <th className="py-2.5 px-4 text-right">R-Hitung (Pearson)</th>
                      <th className="py-2.5 px-4 text-right">R-Tabel</th>
                      <th className="py-2.5 px-4 text-right">p-value</th>
                      <th className="py-2.5 px-4 text-center">Status Validitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f3f8]">
                    {analysisResult.results?.map((item: any, i: number) => (
                      <tr key={i} className="hover:bg-[#fafcff]">
                        <td className="py-2.5 px-4 font-semibold text-[#243149]">{item.item}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-[#243149]">{item.r_hitung?.toFixed(4)}</td>
                        <td className="py-2.5 px-4 text-right font-mono">{item.r_tabel}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-[#3984f5]">{item.p_value?.toFixed(4)}</td>
                        <td className="py-2.5 px-4 text-center">
                          {item.is_valid ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                              ✓ Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                              ✕ Gugur / Tidak Valid
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. RELIABILITY TEST OUTPUT */}
          {selectedMethod === "RELIABILITY" && (
            <div className="space-y-4">
              <div className="bg-[#fafcff] border border-[#d6e6fe] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#738196]">Koefisien Cronbach's Alpha Keseluruhan:</div>
                  <div className="text-3xl font-black text-[#243149] mt-0.5">
                    {analysisResult.cronbach_alpha}
                  </div>
                  <p className="text-xs text-[#57667c] mt-1">
                    Benchmark instrumen reliabel: α ≥ {analysisResult.benchmark}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs ${
                      analysisResult.is_reliable
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {analysisResult.interpretation}
                  </span>
                </div>
              </div>

              {/* Alpha if Item Deleted Table */}
              <div className="bg-white rounded-2xl border border-[#e9edf3] overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-[#f8faff] border-b border-[#e9edf3] font-bold text-xs text-[#243149]">
                  Tabel: Item-Total Statistics &amp; Alpha Jika Butir Dihapus
                </div>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
                      <th className="py-2.5 px-4">Butir</th>
                      <th className="py-2.5 px-4 text-right">Corrected Item-Total Correlation</th>
                      <th className="py-2.5 px-4 text-right">Cronbach's Alpha if Item Deleted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f3f8]">
                    {analysisResult.alpha_if_item_deleted?.map((it: any, i: number) => (
                      <tr key={i} className="hover:bg-[#fafcff]">
                        <td className="py-2.5 px-4 font-semibold text-[#243149]">{it.item}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-[#243149]">
                          {it.corrected_item_total_correlation}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-[#3984f5]">
                          {it.alpha_if_deleted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. CORRELATION OUTPUT */}
          {selectedMethod === "PEARSON" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#e9edf3] overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-[#f8faff] border-b border-[#e9edf3] font-bold text-xs text-[#243149]">
                  Matriks Korelasi Pearson (N = {analysisResult.n})
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
                        <th className="py-2.5 px-4">Variabel</th>
                        {analysisResult.variables?.map((v: string) => (
                          <th key={v} className="py-2.5 px-4 text-right">{v}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f3f8]">
                      {analysisResult.variables?.map((v1: string, i: number) => (
                        <tr key={v1} className="hover:bg-[#fafcff]">
                          <td className="py-2.5 px-4 font-semibold text-[#243149]">{v1}</td>
                          {analysisResult.variables?.map((v2: string, j: number) => {
                            const r = analysisResult.r_matrix?.[i]?.[j];
                            const p = analysisResult.p_matrix?.[i]?.[j];
                            return (
                              <td key={v2} className="py-2.5 px-4 text-right font-mono">
                                <div className="font-bold text-[#243149]">{r?.toFixed(3)}</div>
                                <div className="text-[10px] text-[#738196]">p={p?.toFixed(3)}</div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pair Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.pair_insights?.map((pair: any, i: number) => (
                  <div key={i} className="p-4 bg-white border border-[#e9edf3] rounded-2xl shadow-sm text-xs space-y-1">
                    <div className="font-bold text-[#243149]">{pair.pair}</div>
                    <div className="flex items-center gap-2 text-[11.5px]">
                      <span className="font-mono font-bold text-[#3984f5]">r = {pair.r?.toFixed(3)}</span>
                      <span>&middot;</span>
                      <span className="text-[#57667c]">Keeratan: <b>{pair.strength} ({pair.direction})</b></span>
                    </div>
                    <div className="text-[11px] text-[#16a34a] font-medium">{pair.significance}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. CLASSICAL ASSUMPTIONS OUTPUT */}
          {selectedMethod === "CLASSICAL_ASSUMPTIONS" && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  analysisResult.all_assumptions_met
                    ? "bg-green-50 border-green-200 text-green-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-sm">
                    {analysisResult.all_assumptions_met
                      ? "Seluruh Asumsi Regresi Terpenuhi (Model BLUE: Best Linear Unbiased Estimator)"
                      : "Beberapa Asumsi Klasik Memerlukan Penyesuaian"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Normality */}
                <div className="bg-white rounded-2xl border border-[#e9edf3] p-4.5 space-y-2">
                  <div className="text-[11px] font-bold uppercase text-[#738196]">1. Uji Normalitas Residual</div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-extrabold text-[#243149] text-sm">Shapiro-Wilk</span>
                    <span className="font-mono text-xs text-[#3984f5]">p = {analysisResult.normality?.p_value}</span>
                  </div>
                  <p className="text-xs text-[#57667c]">{analysisResult.normality?.verdict}</p>
                </div>

                {/* Heteroscedasticity */}
                <div className="bg-white rounded-2xl border border-[#e9edf3] p-4.5 space-y-2">
                  <div className="text-[11px] font-bold uppercase text-[#738196]">2. Uji Heteroskedastisitas</div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-extrabold text-[#243149] text-sm">Breusch-Pagan</span>
                    <span className="font-mono text-xs text-[#3984f5]">p = {analysisResult.heteroscedasticity?.p_value}</span>
                  </div>
                  <p className="text-xs text-[#57667c]">{analysisResult.heteroscedasticity?.verdict}</p>
                </div>

                {/* Autocorrelation */}
                <div className="bg-white rounded-2xl border border-[#e9edf3] p-4.5 space-y-2">
                  <div className="text-[11px] font-bold uppercase text-[#738196]">3. Uji Autokorelasi</div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-extrabold text-[#243149] text-sm">Durbin-Watson</span>
                    <span className="font-mono text-xs text-[#3984f5]">DW = {analysisResult.autocorrelation?.statistic}</span>
                  </div>
                  <p className="text-xs text-[#57667c]">{analysisResult.autocorrelation?.verdict}</p>
                </div>

                {/* Multicollinearity */}
                <div className="bg-white rounded-2xl border border-[#e9edf3] p-4.5 space-y-2">
                  <div className="text-[11px] font-bold uppercase text-[#738196]">4. Uji Multikolinearitas</div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-extrabold text-[#243149] text-sm">Variance Inflation Factor (VIF)</span>
                    <span className="font-mono text-xs text-[#16a34a]">VIF &lt; 10</span>
                  </div>
                  <p className="text-xs text-[#57667c]">
                    {analysisResult.multicollinearity?.passed
                      ? "Tidak terdeteksi multikolinearitas antar variabel bebas."
                      : "Terdeteksi potensi multikolinearitas pada variabel prediktor."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 6. DESCRIPTIVE & VISUALIZATION OUTPUT */}
          {(selectedMethod === "DESCRIPTIVE" || selectedMethod === "VISUALIZATION") && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#e9edf3] overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-[#f8faff] border-b border-[#e9edf3] font-bold text-xs text-[#243149]">
                  Tabel Ringkasan Statistik Deskriptif Variabel Numerik (N = {analysisResult.row_count})
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
                        <th className="py-2.5 px-4">Variabel</th>
                        <th className="py-2.5 px-4 text-right">N</th>
                        <th className="py-2.5 px-4 text-right">Mean</th>
                        <th className="py-2.5 px-4 text-right">Median</th>
                        <th className="py-2.5 px-4 text-right">Std. Dev</th>
                        <th className="py-2.5 px-4 text-right">Min</th>
                        <th className="py-2.5 px-4 text-right">Max</th>
                        <th className="py-2.5 px-4 text-right">Skewness</th>
                        <th className="py-2.5 px-4 text-right">Kurtosis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f3f8]">
                      {analysisResult.numeric?.map((num: any) => (
                        <tr key={num.variable} className="hover:bg-[#fafcff]">
                          <td className="py-2.5 px-4 font-semibold text-[#243149]">{num.variable}</td>
                          <td className="py-2.5 px-4 text-right font-mono">{num.n}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-[#243149]">{num.mean?.toFixed(2)}</td>
                          <td className="py-2.5 px-4 text-right font-mono">{num.median?.toFixed(2)}</td>
                          <td className="py-2.5 px-4 text-right font-mono">{num.std?.toFixed(2)}</td>
                          <td className="py-2.5 px-4 text-right font-mono">{num.min}</td>
                          <td className="py-2.5 px-4 text-right font-mono">{num.max}</td>
                          <td className="py-2.5 px-4 text-right font-mono">{num.skewness?.toFixed(2)}</td>
                          <td className="py-2.5 px-4 text-right font-mono">{num.kurtosis?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Visual Distribution Chart for Visualisation Tab */}
              {selectedMethod === "VISUALIZATION" && analysisResult.numeric && (
                <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#243149]">Visualisasi Sebaran Data (Distribution Range)</h4>
                      <p className="text-[11.5px] text-[#738196]">Perbandingan kuartil Q1, Median, Q3, dan rentang nilai</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    {analysisResult.numeric.slice(0, 4).map((num: any) => {
                      const maxVal = num.max || 100;
                      const q1Pct = Math.round(((num.q1 || 0) / maxVal) * 100);
                      const medPct = Math.round(((num.median || 0) / maxVal) * 100);
                      const q3Pct = Math.round(((num.q3 || 0) / maxVal) * 100);

                      return (
                        <div key={num.variable} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-[#243149]">{num.variable}</span>
                            <span className="text-[#738196]">
                              Min: {num.min} &middot; Median: {num.median?.toFixed(1)} &middot; Max: {num.max}
                            </span>
                          </div>
                          <div className="relative h-6 bg-[#f0f4f9] rounded-lg overflow-hidden flex items-center px-2">
                            <div
                              className="absolute top-1 bottom-1 bg-[#3984f5]/30 rounded-md"
                              style={{ left: `${q1Pct}%`, width: `${Math.max(8, q3Pct - q1Pct)}%` }}
                            />
                            <div
                              className="absolute top-0 bottom-0 w-1 bg-[#3984f5] shadow-sm"
                              style={{ left: `${medPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

