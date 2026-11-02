"use client";

import React from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Topbar() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "PE";

  return (
    <header className="h-16 bg-white border-b border-[#e9edf3] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="w-full max-w-md relative">
        <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari proyek penelitian..."
          className="w-full pl-10 pr-4 py-2 text-[13.5px] rounded-xl border border-[#e2e8f0] bg-white placeholder:text-[#94a3b8] text-[#243149] focus:outline-none focus:ring-2 focus:ring-[#3984f5]/20 focus:border-[#3984f5] transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          type="button"
          className="w-9 h-9 rounded-xl border border-[#e8edf5] hover:bg-[#f8faff] flex items-center justify-center text-[#64748b] hover:text-[#243149] transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#3984f5] absolute top-2 right-2 ring-2 ring-white" />
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-9 h-9 rounded-full bg-[#edf5ff] border border-[#d6e6fe] text-[#3984f5] font-bold text-xs flex items-center justify-center">
            {initials}
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
        </div>
      </div>
    </header>
  );
}

