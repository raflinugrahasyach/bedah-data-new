"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutGrid,
  FolderOpen,
  Database,
  Sparkles,
  BarChart3,
  ShieldCheck,
  FileText,
  Settings,
  HelpCircle,
  ChevronDown,
  Activity,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  projectCount?: number;
}

export function Sidebar({ projectCount = 4 }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isDemoMode = (session?.user as any)?.isDemo;

  const navRuangKerja = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutGrid,
    },
    {
      title: "Proyek Penelitian",
      href: "/proyek",
      icon: FolderOpen,
      badge: projectCount,
    },
    {
      title: "Dataset Saya",
      href: "/dataset",
      icon: Database,
    },
  ];

  const navAlat = [
    {
      title: "AI Methodology Advisor",
      href: "/advisor",
      icon: Sparkles,
      tag: "AI",
    },
    {
      title: "Analisis Statistik",
      href: "/analisis",
      icon: BarChart3,
    },
    {
      title: "Validasi Penelitian",
      href: "/validasi",
      icon: ShieldCheck,
    },
    {
      title: "Visualisasi & Laporan",
      href: "/laporan",
      icon: FileText,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#e9edf3] flex flex-col h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Top Logo */}
      <div className="p-5 pb-4 border-b border-[#f0f3f8]">
        <BrandLogo size="md" href="/dashboard" />
      </div>

      {/* Workspace Switcher */}
      <div className="p-3">
        <button
          type="button"
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#e4ebf5] bg-[#fafcff] hover:bg-[#f1f6ff] transition-all text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#edf5ff] text-[#3984f5] flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-[13px] font-bold text-[#243149] leading-tight truncate">
                Ruang Penelitian
              </div>
              <div className="text-[11px] text-[#738196] leading-tight">
                Ruang kerja pribadi
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-[#8a9bb1] group-hover:text-[#3984f5] shrink-0" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {/* Section 1: RUANG KERJA */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold tracking-[0.15em] text-[#8e9eb3] uppercase">
            RUANG KERJA
          </div>
          <div className="space-y-1">
            {navRuangKerja.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
                    active
                      ? "bg-[#edf5ff] text-[#3984f5] font-semibold"
                      : "text-[#57667c] hover:bg-[#f5f8fc] hover:text-[#243149]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? "text-[#3984f5]" : "text-[#7a8a9f]"}`} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        active
                          ? "bg-[#dbeafe] text-[#2563eb]"
                          : "bg-[#f0f3f8] text-[#6b7b90]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Section 2: ALAT PENELITIAN */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold tracking-[0.15em] text-[#8e9eb3] uppercase">
            ALAT PENELITIAN
          </div>
          <div className="space-y-1">
            {navAlat.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
                    active
                      ? "bg-[#edf5ff] text-[#3984f5] font-semibold"
                      : "text-[#57667c] hover:bg-[#f5f8fc] hover:text-[#243149]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? "text-[#3984f5]" : "text-[#7a8a9f]"}`} />
                    <span>{item.title}</span>
                  </div>
                  {item.tag && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#3984f5] text-[#3984f5]">
                      {item.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[#edf2f9] space-y-1">
        <Link
          href="/bantuan"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
            pathname === "/bantuan"
              ? "bg-[#edf5ff] text-[#3984f5] font-semibold"
              : "text-[#57667c] hover:bg-[#f5f8fc] hover:text-[#243149]"
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#7a8a9f]" />
          <span>Pusat Bantuan</span>
        </Link>
        <Link
          href="/pengaturan"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all ${
            pathname === "/pengaturan"
              ? "bg-[#edf5ff] text-[#3984f5] font-semibold"
              : "text-[#57667c] hover:bg-[#f5f8fc] hover:text-[#243149]"
          }`}
        >
          <Settings className="w-4 h-4 text-[#7a8a9f]" />
          <span>Pengaturan</span>
        </Link>

        {/* User Card & Sign Out */}
        <div className="pt-2 mt-1 border-t border-[#f0f3f8] flex items-center justify-between px-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#dbeafe] text-[#2563eb] text-xs font-bold flex items-center justify-center shrink-0">
              {session?.user?.name ? session.user.name.slice(0, 2).toUpperCase() : "PE"}
            </div>
            <div className="truncate">
              <p className="text-[12px] font-semibold text-[#243149] truncate leading-tight">
                {session?.user?.name || "Peneliti Riset"}
              </p>
              <p className="text-[10px] text-[#738196] truncate leading-tight">
                {session?.user?.email || "peneliti@bedahdata.id"}
              </p>
            </div>
          </div>
          <button
            type="button"
            title="Keluar"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 text-[#8e9eb3] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

