"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#57667c] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Keluar</span>
    </button>
  );
}

