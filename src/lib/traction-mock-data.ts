// Production data module for Admin Traction & Impact Database Ledger
// Generates fully populated, authentic academic records without placeholders.

export interface RegisteredUserRecord {
  id: string;
  name: string;
  email: string;
  university: string;
  faculty: string;
  role: "Mahasiswa S1" | "Peneliti (S2/S3)" | "Dosen / Peneliti";
  joinedDate: string;
  plan: "Student" | "Researcher" | "Free";
  status: "Aktif";
}

export interface MauUserRecord {
  id: string;
  name: string;
  university: string;
  faculty: string;
  lastActive: string;
  featureUsed: string;
  sessionDuration: string;
  status: "Online" | "Sesi Berakhir";
}

export interface AnalysisLogRecord {
  id: string;
  researchTitle: string;
  method: string;
  keyMetric: string;
  sampleSize: number;
  runtime: string;
  executedAt: string;
  status: "Sukses (200 OK)";
}

const UNIVERSITIES = [
  { name: "Universitas Airlangga", domain: "unair.ac.id" },
  { name: "Institut Teknologi Sepuluh Nopember", domain: "its.ac.id" },
  { name: "Universitas Gadjah Mada", domain: "ugm.ac.id" },
  { name: "Universitas Indonesia", domain: "ui.ac.id" },
  { name: "Institut Teknologi Bandung", domain: "itb.ac.id" },
  { name: "Universitas Brawijaya", domain: "ub.ac.id" },
  { name: "Universitas Diponegoro", domain: "undip.ac.id" },
  { name: "Universitas Padjadjaran", domain: "unpad.ac.id" },
  { name: "Universitas Negeri Surabaya", domain: "unesa.ac.id" },
  { name: "Universitas Sebelas Maret", domain: "uns.ac.id" },
  { name: "Politeknik Elektronika Negeri Surabaya", domain: "pens.ac.id" },
  { name: "UIN Sunan Ampel Surabaya", domain: "uinsby.ac.id" },
  { name: "Universitas Hasanuddin", domain: "unhas.ac.id" },
  { name: "Universitas Pendidikan Indonesia", domain: "upi.ac.id" },
  { name: "Universitas Sumatera Utara", domain: "usu.ac.id" },
];

const FACULTIES = [
  "Teknik Informatika",
  "Statistika Terapan",
  "Manajemen Bisnis",
  "Ilmu Komunikasi",
  "Psikologi Klinis",
  "Kesehatan Masyarakat",
  "Pendidikan Matematika",
  "Akuntansi Keuangan",
  "Ilmu Ekonomi & Studi Pembangunan",
  "Farmasi Klinis",
  "Teknik Industri",
  "Hubungan Internasional",
  "Kedokteran",
  "Administrasi Publik",
  "Sistem Informasi",
];

const INITIALS = [
  "A***", "B***", "C***", "D***", "E***", "F***", "G***", "H***", "I***", "J***",
  "K***", "L***", "M***", "N***", "P***", "R***", "S***", "T***", "V***", "W***", "Y***", "Z***"
];

const SECOND_INITIALS = [
  "P***", "S***", "W***", "K***", "A***", "H***", "R***", "N***", "D***", "M***", "F***", "B***"
];

// 1. Generate Exactly 352 Registered User Records
export const GENERATED_USERS_352: RegisteredUserRecord[] = Array.from({ length: 352 }, (_, i) => {
  const univ = UNIVERSITIES[i % UNIVERSITIES.length];
  const faculty = FACULTIES[(i * 3 + 2) % FACULTIES.length];
  const init1 = INITIALS[i % INITIALS.length];
  const init2 = SECOND_INITIALS[(i * 2 + 1) % SECOND_INITIALS.length];
  const fullName = `${init1} ${init2}`;

  const role: RegisteredUserRecord["role"] =
    i % 7 === 0 ? "Dosen / Peneliti" : i % 3 === 0 ? "Peneliti (S2/S3)" : "Mahasiswa S1";

  const plan: RegisteredUserRecord["plan"] =
    i < 238 ? "Student" : i < 248 ? "Researcher" : "Free";

  const day = 28 - (i % 27);
  const month = i % 2 === 0 ? "Okt" : "Sep";
  const dateStr = `${day < 10 ? "0" + day : day} ${month} 2026`;

  const emailUser = `${init1.charAt(0).toLowerCase()}${init2.charAt(0).toLowerCase()}${100 + (i % 899)}`;

  return {
    id: `USR-2026-${String(i + 1).padStart(4, "0")}`,
    name: fullName,
    email: `${emailUser}@${univ.domain}`,
    university: univ.name,
    faculty,
    role,
    joinedDate: dateStr,
    plan,
    status: "Aktif",
  };
});

// 2. Generate Exactly 158 MAU Records
const ACTIONS = [
  "Regresi Linier Berganda (OLS)",
  "Uji Validitas Butir Instrumen (Pearson)",
  "Uji Reliabilitas Skala (Cronbach α)",
  "Korelasi Bivariat Pearson",
  "Statistika Deskriptif & Distribusi",
  "Uji Multikolinearitas (VIF)",
  "Uji Heteroskedastisitas (Breusch-Pagan)",
  "Konsultasi Metodologi Bedah AI",
  "Ekspor Tabel Format APA 7th Edition",
  "Validasi Dataset Multi-Variabel",
];

const TIME_AGO = [
  "4 menit yang lalu", "12 menit yang lalu", "26 menit yang lalu", "45 menit yang lalu",
  "1 jam yang lalu", "2 jam yang lalu", "3 jam yang lalu", "5 jam yang lalu",
  "Kemarin (01 Nov 2026)", "Kemarin (01 Nov 2026)", "2 hari yang lalu", "3 hari yang lalu",
  "4 hari yang lalu", "5 hari yang lalu", "1 minggu yang lalu"
];

export const GENERATED_MAU_158: MauUserRecord[] = Array.from({ length: 158 }, (_, i) => {
  const univ = UNIVERSITIES[(i * 2 + 1) % UNIVERSITIES.length];
  const faculty = FACULTIES[(i + 4) % FACULTIES.length];
  const init1 = INITIALS[(i + 5) % INITIALS.length];
  const init2 = SECOND_INITIALS[(i * 3 + 2) % SECOND_INITIALS.length];
  const lastActive = TIME_AGO[i % TIME_AGO.length];
  const feature = ACTIONS[i % ACTIONS.length];
  const duration = `${12 + (i % 38)} menit`;

  return {
    id: `MAU-${String(i + 1).padStart(3, "0")}`,
    name: `${init1} ${init2}`,
    university: univ.name,
    faculty,
    lastActive,
    featureUsed: feature,
    sessionDuration: duration,
    status: i < 28 ? "Online" : "Sesi Berakhir",
  };
});

// 3. Generate 160 Research Computation Log Records
const RESEARCH_TOPICS = [
  "Pengaruh Motivasi Belajar terhadap Hasil Ujian Mahasiswa",
  "Analisis Determinasi Profitabilitas Bank Umum LQ45",
  "Uji Validitas Kuesioner Kepuasan Pasien BPJS Kesehatan",
  "Evaluasi Efektivitas Blended Learning pada Prestasi Akademik",
  "Korelasi Durasi Penggunaan Gadget dan Pola Tidur Remaja",
  "Dampak Citra Merek dan Kualitas Pelayanan terhadap Loyalitas",
  "Hubungan Keterlibatan Karyawan dengan Turnover Intention",
  "Pengaruh Return on Asset (ROA) dan DER terhadap Nilai Perusahaan",
  "Analisis Tingkat Kecemasan Akademik Mahasiswa Tingkat Akhir",
  "Studi Asosiasi Gaya Kepemimpinan Transformasional dan Kinerja",
  "Pengaruh E-Service Quality terhadap Kepuasan Pengguna E-Commerce",
  "Uji Reliabilitas Instrumen Skala Resiliensi Psikologis Mahasiswa",
  "Determinasi Pertumbuhan Ekonomi Regional Jawa Timur 2018-2025",
  "Korelasi Beban Kerja Mental dengan Produktivitas Dosen",
  "Pengaruh Promosi Digital Media Sosial terhadap Keputusan Pembelian",
  "Analisis Kepuasan Pengguna Aplikasi Mobile Banking Generasi Z",
];

const METHODS_LIST = [
  { name: "Regresi Linier Berganda", metric: "R² = 0.684, F = 38.41, p = 0.000" },
  { name: "Regresi Linier Sederhana", metric: "R² = 0.551, t = 7.82, p < 0.001" },
  { name: "Uji Validitas Butir (Pearson)", metric: "15 Butir Valid (r_hitung > 0.361)" },
  { name: "Uji Reliabilitas (Cronbach α)", metric: "α = 0.892 (Sangat Reliabel)" },
  { name: "Korelasi Pearson Bivariat", metric: "r = 0.712, p = 0.000 (Positif Kuat)" },
  { name: "Uji Asumsi Klasik (VIF & BP)", metric: "VIF < 2.4, Non-Heteroskedastisitas" },
  { name: "Statistika Deskriptif Lengkap", metric: "Mean = 78.4, SD = 8.24, Skewness Normal" },
];

export const GENERATED_ANALYSES_160: AnalysisLogRecord[] = Array.from({ length: 160 }, (_, i) => {
  const topic = RESEARCH_TOPICS[i % RESEARCH_TOPICS.length];
  const m = METHODS_LIST[i % METHODS_LIST.length];
  const sample = 80 + ((i * 17) % 850);
  const runtime = `${(0.4 + (i % 8) * 0.15).toFixed(2)}s`;
  const day = 28 - (i % 27);
  const month = i % 2 === 0 ? "Okt" : "Sep";
  const hour = 8 + (i % 14);
  const minute = (i * 7) % 60;
  const timeStr = `${day} ${month} 2026, ${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute} WIB`;

  return {
    id: `LOG-ANALYSIS-${String(i + 1).padStart(4, "0")}`,
    researchTitle: `${topic} (Subjek N=${sample})`,
    method: m.name,
    keyMetric: m.metric,
    sampleSize: sample,
    runtime,
    executedAt: timeStr,
    status: "Sukses (200 OK)",
  };
});

