import React from "react";
import { AiChatView } from "@/components/ai-chat-view";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdvisorPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const session = await auth();
  const resolvedParams = await searchParams;

  let planName = "Researcher";
  let maxPerDay = 30;

  if (session?.user?.id) {
    const sub = await db.subscription.findFirst({
      where: { userId: session.user.id, status: "ACTIVE" },
      include: { plan: true },
    });
    if (sub?.plan?.name) {
      planName = sub.plan.name;
      maxPerDay = sub.plan.maxChatPerDay ?? 999;
    }
  }

  return (
    <div className="space-y-4">
      <AiChatView
        userPlanName={planName}
        dailyQuotaLeft={maxPerDay}
        initialPrompt={resolvedParams.prompt || ""}
      />
    </div>
  );
}

