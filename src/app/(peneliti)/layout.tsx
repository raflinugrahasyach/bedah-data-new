import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PenelitiLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Fetch real project count for current user
  let projectCount = 4;
  if (session?.user?.id) {
    projectCount = await db.project.count({
      where: { ownerId: session.user.id },
    });
  }

  return (
    <div className="min-h-screen bg-[#f8faff] flex">
      {/* Sidebar */}
      <Sidebar projectCount={projectCount} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
