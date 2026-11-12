"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTransactions } from "@/context/TransactionContext";
import { formatRupiah } from "@/lib/utils";

type PeriodFilter = "week" | "month" | "3months" | "year" | "all";

export default function AnalyticsPage() {
  const { transactions, isLoading } = useTransactions();
  const [period, setPeriod] = useState<PeriodFilter>("month");

  // Filter transactions according to selected period
  const filteredData = useMemo(() => {
    const now = new Date();

    return transactions.filter((t) => {
      const txDate = new Date(t.transaction_date);
      if (isNaN(txDate.getTime())) return false;

      if (period === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= oneWeekAgo && txDate <= now;
      } else if (period === "month") {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      } else if (period === "3months") {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        return txDate >= threeMonthsAgo && txDate <= now;
      } else if (period === "year") {
        return txDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [transactions, period]);

  // Aggregate stats
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    const categoryExpenseMap: Record<string, number> = {};
    const categoryIncomeMap: Record<string, number> = {};

    for (const tx of filteredData) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") {
        income += amt;
        categoryIncomeMap[tx.category] = (categoryIncomeMap[tx.category] || 0) + amt;
      } else {
        expense += amt;
        categoryExpenseMap[tx.category] = (categoryExpenseMap[tx.category] || 0) + amt;
      }
    }

    const net = income - expense;
    const savingsRate = income > 0 ? Math.max(0, Math.round((net / income) * 100)) : 0;

    // Sort category expense descending
    const sortedExpenseCats = Object.entries(categoryExpenseMap)
      .map(([cat, total]) => ({
        category: cat,
        amount: total,
        percentage: expense > 0 ? Math.round((total / expense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      income,
      expense,
      net,
      savingsRate,
      sortedExpenseCats,
    };
  }, [filteredData]);

  const periods: { id: PeriodFilter; label: string }[] = [
    { id: "week", label: "Minggu ini" },
    { id: "month", label: "Bulan ini" },
    { id: "3months", label: "3 Bulan Terakhir" },
    { id: "year", label: "Tahun ini" },
    { id: "all", label: "Semua" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Analisis Keuangan
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8A8A] mt-1">
              Evaluasi pola pengeluaran, rasio tabungan, dan alokasi dana
            </p>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1 p-1 bg-[#121212] rounded-xl border border-[#222222] self-start sm:self-auto overflow-x-auto max-w-full">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  period === p.id
                    ? "bg-[#222222] text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats for selected period */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
              <span>Pemasukan Periode Ini</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
              {formatRupiah(stats.income)}
            </div>
            <div className="text-[11px] text-zinc-500">
              Total kas masuk yang tercatat
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
              <span>Pengeluaran Periode Ini</span>
              <ArrowDownLeft className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight">
              {formatRupiah(stats.expense)}
            </div>
            <div className="text-[11px] text-zinc-500">
              Total belanja & konsumsi
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
              <span>Net Tabungan / Arus Kas</span>
              {stats.net >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-400" />
              )}
            </div>
            <div
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                stats.net >= 0 ? "text-white" : "text-rose-400"
              }`}
            >
              {formatRupiah(stats.net)}
            </div>
            <div className="text-[11px] text-zinc-500">
              Rasio Tabungan: <span className="text-white font-medium">{stats.savingsRate}%</span>
            </div>
          </div>
        </div>

        {/* Comparison Bar: Pemasukan vs Pengeluaran */}
        <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Perbandingan Arus Kas
              </h2>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Rasio proporsi pemasukan terhadap pengeluaran
              </p>
            </div>
          </div>

          {stats.income === 0 && stats.expense === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500">
              Tidak ada data transaksi pada periode ini.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Stacked comparison bar */}
              <div className="w-full h-4 bg-[#1A1A1A] rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{
                    width: `${
                      stats.income + stats.expense > 0
                        ? (stats.income / (stats.income + stats.expense)) * 100
                        : 50
                    }%`,
                  }}
                  title={`Pemasukan: ${formatRupiah(stats.income)}`}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{
                    width: `${
                      stats.income + stats.expense > 0
                        ? (stats.expense / (stats.income + stats.expense)) * 100
                        : 50
                    }%`,
                  }}
                  title={`Pengeluaran: ${formatRupiah(stats.expense)}`}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Pemasukan ({formatRupiah(stats.income)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Pengeluaran ({formatRupiah(stats.expense)})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Breakdown (Pengeluaran Berdasarkan Kategori) */}
        <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                Pengeluaran Berdasarkan Kategori
              </h2>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Kategori apa yang paling banyak menyerap anggaranmu
              </p>
            </div>
          </div>

          {stats.sortedExpenseCats.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Tidak ada pengeluaran tercatat pada periode ini.
            </div>
          ) : (
            <div className="space-y-4">
              {stats.sortedExpenseCats.map((cat, idx) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-zinc-500 font-mono text-[11px]">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-white">{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-400 text-[11px] font-mono">
                        {cat.percentage}%
                      </span>
                      <span className="font-semibold text-rose-400">
                        {formatRupiah(cat.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
