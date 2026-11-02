"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

interface AdminUsersViewProps {
  initialUsers: any[];
}

export function AdminUsersView({ initialUsers }: AdminUsersViewProps) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  async function handleToggleStatus(userId: string, currentStatus: string) {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setLoadingUserId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE_STATUS", userId, status: nextStatus }),
      });
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUserId(null);
    }
  }

  async function handleChangeTier(userId: string, tier: string) {
    setLoadingUserId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CHANGE_TIER", userId, tier }),
      });
      if (res.ok) {
        setUsers(
          users.map((u) => {
            if (u.id === userId) {
              return {
                ...u,
                subscriptions: [{ tier, status: "ACTIVE" }],
              };
            }
            return u;
          })
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUserId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-[#3984f5] uppercase mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3984f5]" />
          <span>SUPER ADMIN USER DIRECTORY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243149] tracking-tight">
          User Management<span className="text-[#3984f5]">.</span>
        </h1>
        <p className="text-[13.5px] text-[#57667c] mt-0.5">
          Kelola hak akses pengguna, status akun (aktif/tangguhkan), dan peningkatan paket langganan secara manual.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau email user..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#e2e8f0] focus:outline-none focus:border-[#3984f5]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#738196]">Peran:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border border-[#e2e8f0] rounded-lg px-2.5 py-1.5 bg-white text-[#243149] focus:outline-none"
          >
            <option value="ALL">Semua Peran</option>
            <option value="PENELITI">Peneliti</option>
            <option value="ADMIN">Super Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#e9edf3] shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e9edf3] text-[#738196] font-semibold bg-[#fafcff]">
              <th className="py-3 px-5">Nama &amp; Email</th>
              <th className="py-3 px-5">Tipe Pengguna</th>
              <th className="py-3 px-5">Paket Aktif</th>
              <th className="py-3 px-5">Proyek &amp; Riset</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Aksi Kelola</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3f8]">
            {filteredUsers.map((u) => {
              const activeSub = u.subscriptions?.find((s: any) => s.status === "ACTIVE");
              const currentTier = activeSub?.tier || "FREE";
              const isLoading = loadingUserId === u.id;

              return (
                <tr key={u.id} className="hover:bg-[#fafcff]">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-[#243149]">{u.name}</div>
                    <div className="text-[11px] text-[#738196]">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#edf5ff] text-[#3984f5]">
                      {u.userType}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <select
                      value={currentTier}
                      disabled={isLoading}
                      onChange={(e) => handleChangeTier(u.id, e.target.value)}
                      className="text-xs font-bold bg-[#fafcff] border border-[#e2e8f0] rounded-lg px-2 py-1 text-[#243149] cursor-pointer"
                    >
                      <option value="FREE">Free</option>
                      <option value="STUDENT">Student</option>
                      <option value="RESEARCHER">Researcher</option>
                      <option value="CAMPUS">Campus</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-5 text-[#57667c]">
                    {u.projects?.length || 0} Proyek &middot; {u.datasets?.length || 0} Data
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                        u.status === "ACTIVE"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      disabled={isLoading}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                        u.status === "ACTIVE"
                          ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                          : "border-green-300 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {isLoading ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      ) : u.status === "ACTIVE" ? (
                        "Tangguhkan"
                      ) : (
                        "Aktifkan"
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

