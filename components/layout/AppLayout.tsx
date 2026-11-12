"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  WalletCards,
  User,
  Plus,
  LogOut,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTransactions } from "@/context/TransactionContext";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import Image from "next/image";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { user, profile, isConfigured, signOut } = useAuth();
  const { openAddModal } = useTransactions();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
    { href: "/analytics", label: "Analisis", icon: PieChart },
    { href: "/budget", label: "Budget", icon: WalletCards },
    { href: "/profile", label: "Profil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col md:flex-row">
      {/* Configuration Alert Banner (if Supabase credentials not set) */}
      {!isConfigured && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Mode Pratinjau Lokal aktif. Supabase belum dihubungkan. Data saat ini disimpan di browser.
            </span>
            <Link
              href="/profile"
              className="ml-auto underline font-medium hover:text-white flex items-center gap-1 shrink-0"
            >
              Setup Supabase <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================================= */}
      <aside className={`hidden md:flex flex-col w-64 border-r border-[#1E1E1E] bg-[#0A0A0A] p-5 shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto ${!isConfigured ? "pt-14" : ""}`}>
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-3 mb-6 group">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black font-black tracking-tighter text-sm shadow-md group-hover:scale-105 transition-transform">
            <Image src="/logo.jpg" alt="ANVAYA logo" width={32} height={32} className="w-8 h-8 rounded-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              ANVAYA
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Spend
              </span>
            </span>
            <span className="text-[10px] text-zinc-500 font-normal">
              Personal Finance
            </span>
          </div>
        </Link>

        {/* Quick Add Button */}
        <button
          onClick={openAddModal}
          className="w-full mb-6 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 active:scale-[0.98] text-black font-semibold text-xs tracking-tight transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Transaksi</span>
        </button>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#181818] text-white border border-[#2A2A2A] shadow-sm font-semibold"
                    : "text-[#8A8A8A] hover:bg-[#121212] hover:text-zinc-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout section at bottom of sidebar */}
        <div className="pt-4 border-t border-[#1C1C1C] mt-auto">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#121212] border border-[#202020]">
            <Link href="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || "User Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full ring-1 ring-zinc-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-white shrink-0">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate">
                  {profile?.full_name || "Pengguna ANVAYA"}
                </span>
                <span className="text-[10px] text-zinc-500 truncate">
                  {user?.email || "demo@anvayaspend.id"}
                </span>
              </div>
            </Link>
            <button
              onClick={signOut}
              title="Keluar"
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE TOP BAR */}
      {/* ========================================================= */}
      <header className={`md:hidden flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A] bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40 ${!isConfigured ? "mt-10" : ""}`}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black font-black text-xs">
            <Image src="/logo.jpg" alt="ANVAYA logo" width={32} height={32} className="w-8 h-8 rounded-xl" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">
            ANVAYA <span className="text-emerald-400 font-semibold text-xs">Spend</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/profile" className="p-1">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={28}
                height={28}
                className="rounded-full ring-1 ring-zinc-700"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-white">
                {profile?.full_name?.charAt(0) || "U"}
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <main className={`flex-1 flex flex-col min-w-0 pb-24 md:pb-8 ${!isConfigured ? "md:pt-10" : ""}`}>
        <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav px-3 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-medium transition-colors ${
              pathname === "/dashboard" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Home</span>
          </Link>

          {/* Transaksi */}
          <Link
            href="/transactions"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-medium transition-colors ${
              pathname === "/transactions" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span>Transaksi</span>
          </Link>

          {/* Central Add Action Button */}
          <button
            onClick={openAddModal}
            className="flex items-center justify-center w-11 h-11 -mt-4 rounded-full bg-white text-black shadow-xl hover:scale-105 active:scale-95 transition-transform"
            aria-label="Tambah transaksi baru"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Analisis */}
          <Link
            href="/analytics"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-medium transition-colors ${
              pathname === "/analytics" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span>Analisis</span>
          </Link>

          {/* Budget */}
          <Link
            href="/budget"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-medium transition-colors ${
              pathname === "/budget" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <WalletCards className="w-5 h-5" />
            <span>Budget</span>
          </Link>
        </div>
      </nav>

      {/* Global Add Transaction Modal */}
      <AddTransactionModal />
    </div>
  );
}
