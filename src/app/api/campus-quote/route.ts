import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { institutionName, userCount, picName, picContact } = await req.json();

    if (!institutionName || !picName || !picContact) {
      return NextResponse.json(
        { error: "Nama institusi, nama PIC, dan kontak PIC wajib diisi." },
        { status: 400 }
      );
    }

    const quote = await db.quoteRequest.create({
      data: {
        institutionName,
        userCount: parseInt(userCount, 10) || 50,
        picName,
        picContact,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      message: "Permintaan penawaran telah diterima. Tim Bedah Data akan segera menghubungi PIC Anda.",
    });
  } catch (err: any) {
    console.error("Campus quote error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

