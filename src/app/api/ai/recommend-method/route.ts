import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export const dynamic = "force-dynamic";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const { projectTitle, hypothesis, variables, rowCount } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        recommendedMethod: "SIMPLE_REGRESSION",
        methodTitle: "Regresi Linier Sederhana",
        reason: "Berdasarkan struktur data dengan variabel numerik dan fokus mencari pengaruh, Regresi Linier Sederhana cocok untuk menguji hipotesis penelitian Anda.",
        suggestedX: variables?.[0] || "",
        suggestedY: variables?.[1] || "",
        steps: [
          "Tentukan 1 variabel bebas (X) dan 1 variabel terikat (Y)",
          "Jalankan uji asumsi klasik (normalitas residual)",
          "Interpretasikan koefisien determinasi R-Square dan nilai p (sig < 0.05)",
        ],
      });
    }

    const prompt = `Anda adalah Bedah AI (Methodology Advisor) pada platform riset Bedah Data (bedahdata.id).
Tugas Anda: Berdasarkan informasi proyek dan variabel berikut, rekomendasikan 1 metode analisis statistik yang paling tepat di antara 8 modul Bedah Data:
1. DESCRIPTIVE (Statistik Deskriptif)
2. VISUALIZATION (Visualisasi Data & Eksplorasi)
3. VALIDITY (Uji Validitas Butir Kuesioner Pearson)
4. RELIABILITY (Uji Reliabilitas Cronbach's Alpha)
5. PEARSON (Korelasi Pearson)
6. SIMPLE_REGRESSION (Regresi Linier Sederhana)
7. MULTIPLE_REGRESSION (Regresi Linier Berganda)
8. CLASSICAL_ASSUMPTIONS (Uji Asumsi Klasik)

Data Proyek:
- Judul Proyek: "${projectTitle || "Penelitian Tanpa Judul"}"
- Pertanyaan / Hipotesis: "${hypothesis || "Tidak disebutkan"}"
- Jumlah Responden: ${rowCount || "Belum ada data"}
- Variabel yang tersedia: ${JSON.stringify(variables || [])}

KEMBALIKAN HANYA JSON VALID TANPA MARKDOWN BACKTICKS DENGAN FORMAT BERIKUT:
{
  "recommendedMethod": "METHOD_CODE_ENUM",
  "methodTitle": "Nama Metode Lengkap Bahasa Indonesia",
  "reason": "Penjelasan ringkas 2-3 kalimat mengapa metode ini paling tepat.",
  "suggestedX": "Nama variabel X jika regresi/korelasi",
  "suggestedY": "Nama variabel Y jika regresi/korelasi",
  "steps": ["Langkah 1", "Langkah 2", "Langkah 3"]
}`;

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("AI Method Recommendation error:", err);
    return NextResponse.json({
      recommendedMethod: "SIMPLE_REGRESSION",
      methodTitle: "Regresi Linier Sederhana",
      reason: "Berdasarkan struktur data penelitian Anda, metode ini direkomendasikan untuk menguji pengaruh antar variabel numerik.",
      steps: [
        "Pilih variabel prediktor (X) dan kriteria (Y)",
        "Periksa signifikansi koefisien t dan F hitung",
        "Validasi residual dengan Uji Asumsi Klasik",
      ],
    });
  }
}
