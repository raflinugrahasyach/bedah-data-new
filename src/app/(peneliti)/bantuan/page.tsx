import React from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Database,
  Sliders,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function PusatBantuanPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
          PANDUAN &amp; DOKUMENTASI
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
          Pusat Bantuan Riset<span className="text-[#3984f5]">.</span>
        </h1>
        <p className="text-[13.5px] text-[#57667c] mt-0.5">
          Riset lebih terarah, mulai dari sini. Panduan lengkap workflow dari data mentah hingga laporan siap pakai.
        </p>
      </div>

      {/* Ask AI Banner */}
      <div className="bg-gradient-to-r from-[#edf5ff] via-[#f2f7ff] to-[#edf5ff] border border-[#d6e6fe] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#3984f5] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Butuh Bimbingan Metodologi Langsung?
          </div>
          <p className="text-xs text-[#243149] font-medium leading-relaxed">
            Bedah AI siap berdiskusi mengenai penentuan hipotesis, pemilihan uji statistik, maupun interpretasi data Anda.
          </p>
        </div>
        <Link
          href="/advisor"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3984f5] hover:bg-[#2672df] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0"
        >
          <span>Tanya Bedah AI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Guided Steps */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-[#243149]">
          4 Langkah Workflow Penelitian di Bedah Data
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#edf5ff] text-[#3984f5] font-bold flex items-center justify-center text-xs">
                01
              </span>
              <h3 className="font-bold text-sm text-[#243149]">
                Siapkan &amp; Upload Data Riset
              </h3>
            </div>
            <p className="text-xs text-[#57667c] leading-relaxed">
              Format yang didukung adalah <b>CSV, XLSX, dan XLS (Excel)</b>. Maksimal 10 MB, 50 kolom, dan 10.000 baris per penelitian.
            </p>
            <div className="bg-[#f8faff] p-3 rounded-xl border border-[#e2e8f0] text-[11.5px] text-[#243149] space-y-1">
              <div className="font-bold text-[#3984f5]">Aturan penting:</div>
              <ul className="list-disc pl-4 space-y-0.5 text-[#57667c]">
                <li>Baris pertama wajib nama variabel (unik tanpa duplikasi).</li>
                <li>Satu baris = satu responden penelitian.</li>
                <li>Hanya angka tanpa simbol satuan atau persen (%).</li>
                <li>
                  <b>Pengguna SPSS:</b> Ekspor file data (.sav) Anda ke format Excel (.xlsx) atau CSV sebelum di-upload. File .sav tidak didukung langsung demi efisiensi privasi.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#edf5ff] text-[#3984f5] font-bold flex items-center justify-center text-xs">
                02
              </span>
              <h3 className="font-bold text-sm text-[#243149]">
                Tentukan Tujuan &amp; Hipotesis
              </h3>
            </div>
            <p className="text-xs text-[#57667c] leading-relaxed">
              Tentukan arah penelitian Anda: apakah untuk menguji <i>pengaruh</i> (Regresi), <i>keeratan hubungan</i> (Korelasi), menguji <i>kuesioner</i> (Validitas &amp; Reliabilitas), atau <i>eksplorasi awal</i> (Deskriptif).
            </p>
            <div className="bg-[#f8faff] p-3 rounded-xl border border-[#e2e8f0] text-[11.5px] text-[#243149] space-y-1">
              <div className="font-bold text-[#3984f5]">Tips Bedah AI:</div>
              <p className="text-[#57667c]">
                Gunakan tombol <b>&quot;Rekomendasikan Metode&quot;</b> di halaman Analisis Statistik untuk membiarkan AI menganalisis kecocokan variabel Anda secara otomatis.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#edf5ff] text-[#3984f5] font-bold flex items-center justify-center text-xs">
                03
              </span>
              <h3 className="font-bold text-sm text-[#243149]">
                Jalankan &amp; Tinjau Analisis
              </h3>
            </div>
            <p className="text-xs text-[#57667c] leading-relaxed">
              Seluruh proses kalkulasi diproses di server backend menggunakan library statistik ilmiah Python (scipy, statsmodels, pingouin). AI tidak pernah mengarang angka.
            </p>
            <div className="bg-[#f8faff] p-3 rounded-xl border border-[#e2e8f0] text-[11.5px] text-[#243149] space-y-1">
              <div className="font-bold text-[#3984f5]">Output Otomatis:</div>
              <ul className="list-disc pl-4 space-y-0.5 text-[#57667c]">
                <li>Tabel koefisien dan uji kelayakan ANOVA standar jurnal ilmiah (APA style).</li>
                <li>Uji asumsi klasik regresi (Normalitas, Heteroskedastisitas, Autokorelasi).</li>
                <li>Interpretasi naratif berbahasa Indonesia yang siap dikutip.</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl border border-[#e9edf3] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#edf5ff] text-[#3984f5] font-bold flex items-center justify-center text-xs">
                04
              </span>
              <h3 className="font-bold text-sm text-[#243149]">
                Validasi &amp; Buat Laporan
              </h3>
            </div>
            <p className="text-xs text-[#57667c] leading-relaxed">
              Jalankan <b>Research Validation Engine</b> untuk mengaudit ulang seluruh perhitungan secara terpisah. Jika cocok, proyek Anda mendapatkan badge resmi <b>&quot;Tervalidasi&quot;</b>.
            </p>
            <div className="bg-[#f8faff] p-3 rounded-xl border border-[#e2e8f0] text-[11.5px] text-[#243149] space-y-1">
              <div className="font-bold text-[#3984f5]">Ekspor Dokumen:</div>
              <p className="text-[#57667c]">
                Generate laporan lengkap langsung ke format PDF dan Word (DOCX) dengan struktur akademik: Bab Masalah, Data, Metodologi, Tabel Hasil, hingga Kesimpulan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security & PDP Notice */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#243149]">
          <Lock className="w-4 h-4 text-[#3984f5]" />
          <span>Privasi Data &amp; Kepatuhan UU Pelindungan Data Pribadi (UU PDP)</span>
        </div>
        <p className="text-xs text-[#57667c] leading-relaxed">
          Bedah Data memberlakukan prinsip <i>Zero-Knowledge Data Privacy</i>. Proyek dan dataset pribadi Anda hanya dapat diakses oleh akun Anda sendiri. Panel Super Admin secara ketat <b>TIDAK BISA</b> membaca isi tabel dataset maupun nilai responden milik pengguna—hanya metadata (nama file, jumlah baris dan kolom) untuk keperluan operasional.
        </p>
      </div>
    </div>
  );
}

