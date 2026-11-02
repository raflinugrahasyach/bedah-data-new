import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { QuoteStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const { quoteId, status, convertToClient, contractValue } = await req.json();

    if (!quoteId) {
      return NextResponse.json({ error: "quoteId wajib disertakan." }, { status: 400 });
    }

    const updated = await db.quoteRequest.update({
      where: { id: quoteId },
      data: {
        status: status as QuoteStatus,
      },
    });

    if (convertToClient) {
      // Create active Institution record
      const inst = await db.institution.create({
        data: {
          name: updated.institutionName,
          seats: updated.userCount,
          contractValue: parseInt(contractValue, 10) || 15000000,
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          active: true,
          isPilot: true,
        },
      });

      await db.quoteRequest.update({
        where: { id: quoteId },
        data: { institutionId: inst.id, status: "DEAL" },
      });
    }

    return NextResponse.json({ success: true, quote: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

