import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { UserType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Silakan login." }, { status: 401 });
    }

    const { name, userType } = await req.json();

    const updated = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        userType: userType ? (userType as UserType) : undefined,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

