import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BrandLogo } from "@/components/brand-logo";
import { Crown } from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Guard: strictly ADMIN role
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#243149]">
      {/* Super Admin Topbar */}
      <header className="bg-white border-b border-[#e9edf3] px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <BrandLogo size="lg" href="/admin" />
          <nav className="hidden lg:flex items-center gap-5 text-[12.5px] font-semibold text-[#57667c]">
            <Link href="/admin" className="hover:text-[#3984f5] transition-colors">
              Ringkasan
            </Link>
            <Link href="/admin/traction" className="hover:text-[#3984f5] transition-colors">
              Traction &amp; Impact
            </Link>
            <Link href="/admin/users" className="hover:text-[#3984f5] transition-colors">
              User Management
            </Link>
            <Link href="/admin/data" className="hover:text-[#3984f5] transition-colors">
              Data Platform
            </Link>
            <Link href="/admin/pendapatan" className="hover:text-[#3984f5] transition-colors">
              Pendapatan &amp; Paket
            </Link>
            <Link href="/admin/permintaan" className="hover:text-[#3984f5] transition-colors">
              Penawaran Campus
            </Link>
            <Link href="/admin/pengaturan" className="hover:text-[#3984f5] transition-colors">
              Pengaturan
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#edf5ff] text-[#3984f5] border border-[#d8e6fa]">
            <Crown className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </span>
          <SignOutButton />
        </div>
      </header>

      {/* Admin Body */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}

