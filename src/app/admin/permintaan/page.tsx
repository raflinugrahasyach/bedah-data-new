import React from "react";
import { db } from "@/lib/db";
import { AdminQuotesView } from "@/components/admin-quotes-view";

export const dynamic = "force-dynamic";

export default async function AdminPermintaanPage() {
  const quotes = await db.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminQuotesView initialQuotes={quotes} />;
}

