"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, RotateCw } from "lucide-react";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
    } catch (e) {
      console.error("Sign out error:", e);
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleSignOut}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#57667c] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
    >
      {loading ? (
        <RotateCw className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>Keluar</span>
    </button>
  );
}

