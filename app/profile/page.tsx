"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  LogOut,
  ShieldCheck,
  Database,
  Copy,
  Check,
  Code2,
  ExternalLink,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useTransactions } from "@/context/TransactionContext";
import { useToast } from "@/context/ToastContext";
import { formatRupiah } from "@/lib/utils";

export default function ProfilePage() {
  const { user, profile, signOut, isConfigured } = useAuth();
  const { summary } = useTransactions();
  const { success } = useToast();
  const [copiedSQL, setCopiedSQL] = useState(false);

  const sqlSetup = `-- Skrip Database ANVAYA Spend (Jalankan di Supabase SQL Editor)
-- 1. Tabel Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Tabel Transactions
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(15, 2) not null check (amount >= 0),
  category text not null,
  description text default '',
  transaction_date date not null default current_date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Tabel Budgets
create table if not exists public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  amount numeric(15, 2) not null check (amount >= 0),
  month text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint unique_user_category_month unique (user_id, category, month)
);

-- Aktifkan RLS
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

-- RLS Policies
create policy "User profiles select" on public.profiles for select using (auth.uid() = id);
create policy "User profiles update" on public.profiles for update using (auth.uid() = id);
create policy "User transactions all" on public.transactions for all using (auth.uid() = user_id);
create policy "User budgets all" on public.budgets for all using (auth.uid() = user_id);`;

  const copySQL = () => {
    navigator.clipboard.writeText(sqlSetup);
    setCopiedSQL(true);
    success("Skrip SQL Supabase berhasil disalin ke clipboard!");
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Profil Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8A8A] mt-1">
            Informasi akun dan pengaturan integrasi database
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0D0D] border border-[#242424] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || "Avatar"}
                width={80}
                height={80}
                className="rounded-full ring-2 ring-zinc-700 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}

            <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {profile?.full_name || "Pengguna ANVAYA Spend"}
                </h2>
                <span className="self-center sm:self-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {isConfigured ? "Supabase Auth" : "Mode Demo"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{user?.email || "demo.user@anvayaspend.id"}</span>
              </p>
              <p className="text-[11px] text-zinc-500 pt-1">
                ID Pengguna: <span className="font-mono text-zinc-400">{user?.id || "local-demo-session"}</span>
              </p>
            </div>

            <button
              onClick={signOut}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-rose-500/10 hover:text-rose-400 border border-[#242424] hover:border-rose-500/30 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>

          {/* Quick Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#1C1C1C]">
            <div className="p-4 rounded-xl bg-[#141414] border border-[#202020] space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-zinc-500" />
                Jumlah Transaksi
              </span>
              <div className="text-xl font-bold text-white">
                {summary.transactionCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#202020] space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                Total Pemasukan
              </span>
              <div className="text-xl font-bold text-emerald-400">
                {formatRupiah(summary.totalIncome)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#202020] space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowDownLeft className="w-3.5 h-3.5 text-rose-400" />
                Total Pengeluaran
              </span>
              <div className="text-xl font-bold text-rose-400">
                {formatRupiah(summary.totalExpense)}
              </div>
            </div>
          </div>
        </div>

        {/* Database & Google OAuth Setup Guide */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0D0D] border border-[#242424] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Koneksi Database Supabase
                </h3>
                <p className="text-xs text-zinc-400">
                  Status: {isConfigured ? "Terhubung ke Supabase Cloud" : "Menunggu Kredensial di .env.local"}
                </p>
              </div>
            </div>

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              Buka Supabase <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3 text-xs text-zinc-400 leading-relaxed">
            <p>
              Untuk mengaktifkan autentikasi Google dan database Postgres permanen:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 text-zinc-300">
              <li>
                Buat proyek baru di <strong>Supabase</strong>.
              </li>
              <li>
                Buka menu <strong>Authentication &rarr; Providers &rarr; Google</strong>, aktifkan dan masukkan Google Client ID & Client Secret dari Google Cloud Console.
              </li>
              <li>
                Buka menu <strong>SQL Editor</strong> di Supabase dan jalankan skrip skema di bawah ini.
              </li>
              <li>
                Isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di file <code>.env.local</code>.
              </li>
            </ol>
          </div>

          {/* SQL Snippet box */}
          <div className="relative rounded-xl bg-[#070707] border border-[#1E1E1E] p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#181818] text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> schema.sql
              </span>
              <button
                onClick={copySQL}
                className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedSQL ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-zinc-400 overflow-x-auto max-h-48 leading-relaxed">
              {sqlSetup}
            </pre>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
