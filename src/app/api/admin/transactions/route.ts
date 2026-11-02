import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { RevenueSource, PaymentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const { source, amount, note, method } = await req.json();

    if (!amount || !source) {
      return NextResponse.json({ error: "Nominal dan sumber pendapatan wajib diisi." }, { status: 400 });
    }

    const tx = await db.transaction.create({
      data: {
        source: source as RevenueSource,
        amount: parseInt(amount, 10),
        status: PaymentStatus.PAID,
        method: method || "Transfer Bank Manual",
        isManual: true,
        note: note || "Pencatatan manual oleh Super Admin",
        invoiceNo: `INV-MANUAL-${Date.now().toString().slice(-6)}`,
        paidAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, transaction: tx });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

