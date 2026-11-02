import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

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

    const userId = session.user.id;
    const { messages, includeProjectSummary, projectId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Format pesan tidak valid." }, { status: 400 });
    }

    // 1. Quota check based on Plan tier
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messageCountToday = await db.chatMessage.count({
      where: {
        userId: userId,
        role: "USER",
        createdAt: { gte: today },
      },
    });

    const sub = await db.subscription.findFirst({
      where: { userId: userId, status: "ACTIVE" },
      include: { plan: true },
    });

    const maxPerDay = sub?.plan?.maxChatPerDay ?? 5; // Free: 5, Student: 30, Researcher: null (unlimited)
    if (maxPerDay !== null && messageCountToday >= maxPerDay) {
      return NextResponse.json(
        {
          error: `Batas harian Anda (${maxPerDay} pesan/hari) telah tercapai. Tingkatkan paket untuk akses lebih leluasa.`,
        },
        { status: 429 }
      );
    }

    // 2. Build Project Context if checked
    let projectContext = "";
    if (includeProjectSummary) {
      let project = null;
      if (projectId) {
        project = await db.project.findUnique({
          where: { id: projectId },
          include: { datasets: true, analyses: true },
        });
      } else {
        project = await db.project.findFirst({
          where: { ownerId: userId },
          include: { datasets: true, analyses: true },
          orderBy: { updatedAt: "desc" },
        });
      }

      if (project) {
        const dataset = project.datasets?.[0];
        const analysis = project.analyses?.[0];
        projectContext = `
[DATA PROYEK AKTIF PENELITI]
- Judul Penelitian: "${project.title}"
- Deskripsi: ${project.description || "Belum ada deskripsi"}
- Hipotesis Awal: ${project.hypothesis || "Belum dirumuskan"}
- Status Proyek: ${project.status}
${
  dataset
    ? `- Dataset: ${dataset.fileName} (${dataset.rowCount} baris, ${dataset.columnCount} kolom)
- Variabel Terdeteksi: ${JSON.stringify(dataset.variables)}`
    : "- Dataset: Belum diunggah"
}
${
  analysis
    ? `- Analisis Terakhir: Metode ${analysis.method}, Hasil: ${JSON.stringify(analysis.result)}`
    : ""
}
`;
      }
    }

    // 3. System Prompt: strict methodology advisor constraints
    const systemPrompt = `
Anda adalah "Bedah AI", Methodology Advisor resmi pada platform riset Bedah Data (bedahdata.id).
Peran Anda adalah sebagai teman berpikir metodologis ("Teman berpikir, bukan pengganti peneliti") untuk mahasiswa, dosen, dan peneliti di Indonesia.

ATURAN PALING KRITIS & WAJIB DIPATUHI:
1. DILARANG MENGHITUNG ANGKA ATAU STATISTIK SENDIRI: Anda TIDAK BOLEH menghitung angka statistik, korelasi, regresi, p-value, nilai t, atau probabilitas matematika secara manual dalam kepala Anda. Ini untuk mencegah angka karangan (halusinasi angka).
2. Jika pengguna meminta Anda menghitung rumus atau meminta hasil hitungan matematika, TOLAK DENGAN SANTUN:
   "Sebagai Bedah AI Methodology Advisor, tugas saya adalah membantu rancangan metodologis, penentuan uji, dan interpretasi makna temuan. Untuk perhitungan komputasi statistik yang presisi dan tervalidasi, silakan jalankan modul di menu 'Analisis Statistik' di panel kiri."
3. BACA & JELASKAN ANGKA YANG DISEDIAKAN: Anda HANYA membaca, merangkum, dan menginterpretasikan angka-angka yang sudah dihasilkan oleh calculation engine Python di server.
4. SIKAP & GAYA BAHASA: Hangat, akademik-profesional, suportif, dalam Bahasa Indonesia. Awali dengan apresiasi terhadap rasa ingin tahu mereka. Gunakan analogi yang mudah dipahami bila menjelaskan konsep yang rumit.
5. SELALU INGATKAN: Di akhir rekomendasi penting, ingatkan bahwa keputusan akhir dan validasi konseptual perlu didiskusikan bersama dosen pembimbing atau reviewer akademik.

${projectContext ? `\nKONTEKS PROYEK PENELITI SAAT INI:\n${projectContext}\nGunakan informasi variabel di atas jika relevan dengan pertanyaan user.` : ""}
`;

    // 4. Record user's incoming message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.content) {
      await db.chatMessage.create({
        data: {
          userId: userId,
          projectId: projectId || null,
          role: "USER",
          content: String(lastUserMessage.content),
        },
      });
    }

    // 5. Stream response using Gemini 2.5 Flash
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
      onFinish: async (event) => {
        if (event.text) {
          await db.chatMessage.create({
            data: {
              userId: userId,
              projectId: projectId || null,
              role: "ASSISTANT",
              content: event.text,
            },
          });
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (err: any) {
    console.error("AI Chat route error:", err);
    return NextResponse.json(
      { error: `Terjadi kendala pada layanan AI: ${err.message}` },
      { status: 500 }
    );
  }
}
