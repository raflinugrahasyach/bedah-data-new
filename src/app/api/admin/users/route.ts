import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PlanTier, UserStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Akses khusus Super Admin." }, { status: 403 });
    }

    const { action, userId, tier, status } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId wajib disertakan." }, { status: 400 });
    }

    if (action === "TOGGLE_STATUS") {
      const updated = await db.user.update({
        where: { id: userId },
        data: {
          status: status === "ACTIVE" ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
        },
      });
      return NextResponse.json({ success: true, user: updated });
    }

    if (action === "CHANGE_TIER") {
      if (!tier) {
        return NextResponse.json({ error: "Tier wajib dipilih." }, { status: 400 });
      }

      // Deactivate existing active subscriptions
      await db.subscription.updateMany({
        where: { userId, status: "ACTIVE" },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      });

      // Create new active subscription with new tier
      const sub = await db.subscription.create({
        data: {
          userId,
          tier: tier as PlanTier,
          status: "ACTIVE",
          cycle: "MONTHLY",
        },
      });

      return NextResponse.json({ success: true, subscription: sub });
    }

    return NextResponse.json({ error: "Aksi tidak dikenali." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

