"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ArrowRight,
  Receipt,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTransactions } from "@/context/TransactionContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah, formatIndoDate } from "@/lib/utils";

export default function DashboardPage() {
  const { summary, transactions, isLoading, openAddModal, budgetProgressList } = useTransactions();
  const { profile } = useAuth();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Welcome & Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Ringkasan Keuangan
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8A8A] mt-1">
              Selamat datang kembali{profile?.full_name ? `, ${profile.full_name}` : ""}. Pantau arus kasmu hari ini.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs tracking-tight hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Transaksi</span>
          </button>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Saldo Saat Ini */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0D0D] border border-[#242424] shadow-sm relative overflow-hidden group hover:border-[#333333] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
                Saldo Saat Ini
              </span>
              <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              {isLoading ? (
                <div className="h-8 w-36 bg-zinc-800 rounded animate-pulse" />
              ) : (
                <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] tracking-tight">
                  {formatRupiah(summary.balance)}
                </div>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
              {summary.balance >= 0 ? (
                <span className="text-emerald-400 font-medium">Saldo dalam kondisi surplus</span>
              ) : (
                <span className="text-rose-400 font-medium">Pengeluaran melebihi pemasukan</span>
              )}
            </p>
          </div>

          {/* 2. Total Pemasukan */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0D0D] border border-[#242424] shadow-sm relative overflow-hidden group hover:border-[#333333] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
                Total Pemasukan
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              {isLoading ? (
                <div className="h-8 w-36 bg-zinc-800 rounded animate-pulse" />
              ) : (
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
                  {formatRupiah(summary.totalIncome)}
                </div>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 mt-2">
              Akumulasi pemasukan tercatat
            </p>
          </div>

          {/* 3. Total Pengeluaran */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0D0D] border border-[#242424] shadow-sm relative overflow-hidden group hover:border-[#333333] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
                Total Pengeluaran
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              {isLoading ? (
                <div className="h-8 w-36 bg-zinc-800 rounded animate-pulse" />
              ) : (
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight">
                  {formatRupiah(summary.totalExpense)}
                </div>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 mt-2">
              Akumulasi pengeluaran tercatat
            </p>
          </div>
        </div>

        {/* Section: Transaksi Terakhir & Quick Budget Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions List (2 columns on large screen) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  Transaksi Terakhir
                </h2>
                <p className="text-xs text-[#8A8A8A]">
                  Aktivitas keuangan paling baru
                </p>
              </div>
              <Link
                href="/transactions"
                className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group font-medium"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Empty State */}
            {!isLoading && transactions.length === 0 && (
              <div className="p-8 sm:p-12 rounded-2xl bg-[#0D0D0D] border border-[#242424] text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">
                    Belum ada transaksi
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Mulai catat pemasukan atau pengeluaran pertamamu untuk melihat analisis finansial.
                  </p>
                </div>
                <button
                  onClick={openAddModal}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow-md inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Transaksi</span>
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#0D0D0D] border border-[#202020] flex items-center justify-between animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800" />
                      <div className="space-y-2">
                        <div className="h-4 w-28 bg-zinc-800 rounded" />
                        <div className="h-3 w-20 bg-zinc-800/60 rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-20 bg-zinc-800 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Transaction Items */}
            {!isLoading && transactions.length > 0 && (
              <div className="space-y-2.5">
                {recentTransactions.map((tx) => {
                  const isIncome = tx.type === "income";
                  return (
                    <div
                      key={tx.id}
                      className="p-3.5 sm:p-4 rounded-xl bg-[#0D0D0D] border border-[#202020] hover:border-[#2C2C2C] transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Subtle colored glyph indicator */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isIncome
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-white truncate">
                            {tx.description || tx.category}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                              {tx.category}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatIndoDate(tx.transaction_date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Amount with subtle color distinction */}
                      <div className="text-right shrink-0">
                        <div
                          className={`text-xs sm:text-sm font-bold ${
                            isIncome ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {isIncome ? "+ " : "- "}
                          {formatRupiah(tx.amount)}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                          {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Budget Widget (Side Column) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  Budget Bulanan
                </h2>
                <p className="text-xs text-[#8A8A8A]">
                  Batas pemakaian kategori
                </p>
              </div>
              <Link
                href="/budget"
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Kelola
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-4">
              {budgetProgressList.length === 0 ? (
                <div className="py-6 text-center space-y-3">
                  <p className="text-xs text-zinc-400">
                    Belum ada anggaran bulanan yang disetel.
                  </p>
                  <Link
                    href="/budget"
                    className="inline-block px-3 py-1.5 rounded-lg bg-[#181818] border border-[#282828] text-xs text-zinc-200 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    Atur Anggaran &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {budgetProgressList.slice(0, 3).map((item) => {
                    const isNearLimit = item.percentage >= 80;
                    const isOverLimit = item.percentage >= 100;
                    return (
                      <div key={item.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-white flex items-center gap-1.5">
                            {item.category}
                            {isNearLimit && (
                              <AlertCircle
                                className={`w-3 h-3 ${isOverLimit ? "text-rose-400" : "text-amber-400"}`}
                              />
                            )}
                          </span>
                          <span className="text-zinc-400 text-[11px]">
                            {formatRupiah(item.spent)} / {formatRupiah(item.amount)}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isOverLimit
                                ? "bg-rose-500"
                                : isNearLimit
                                ? "bg-amber-400"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
