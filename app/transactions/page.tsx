"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Edit2,
  Trash2,
  Plus,
  X,
  Receipt,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTransactions } from "@/context/TransactionContext";
import { EditTransactionModal } from "@/components/transactions/EditTransactionModal";
import type { Transaction } from "@/types/database.types";
import { formatRupiah, formatIndoDate, CATEGORIES_EXPENSE, CATEGORIES_INCOME } from "@/lib/utils";

export default function TransactionsPage() {
  const { transactions, isLoading, openAddModal, deleteTransaction } = useTransactions();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Combine unique categories for filter dropdown
  const allCategories = useMemo(() => {
    const set = new Set([...CATEGORIES_EXPENSE, ...CATEGORIES_INCOME]);
    return Array.from(set);
  }, []);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchDesc = (tx.description || "").toLowerCase().includes(query);
          const matchCat = tx.category.toLowerCase().includes(query);
          if (!matchDesc && !matchCat) return false;
        }

        // Type filter
        if (typeFilter !== "all" && tx.type !== typeFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== "all" && tx.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
        } else if (sortOrder === "oldest") {
          return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
        } else if (sortOrder === "highest") {
          return Number(b.amount) - Number(a.amount);
        } else if (sortOrder === "lowest") {
          return Number(a.amount) - Number(b.amount);
        }
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, categoryFilter, sortOrder]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus transaksi ini secara permanen?")) {
      await deleteTransaction(id);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Riwayat Transaksi
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8A8A] mt-1">
              Daftar lengkap seluruh mutasi pengeluaran dan pemasukanmu
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

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-3.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi, toko, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151515] border border-[#242424] focus:border-zinc-500 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#1C1C1C]">
            {/* Type tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#151515] rounded-xl border border-[#222222]">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === "all"
                    ? "bg-[#222222] text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setTypeFilter("income")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === "income"
                    ? "bg-[#222222] text-emerald-400 border border-emerald-500/20 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setTypeFilter("expense")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === "expense"
                    ? "bg-[#222222] text-rose-400 border border-rose-500/20 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Pengeluaran
              </button>
            </div>

            {/* Dropdown Filters: Category & Sorting */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category selector */}
              <div className="flex items-center gap-1 bg-[#151515] border border-[#242424] rounded-xl px-2.5 py-1.5 text-xs text-zinc-300">
                <Filter className="w-3.5 h-3.5 text-zinc-500" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent border-none text-xs text-white outline-none cursor-pointer pr-1"
                >
                  <option value="all" className="bg-[#121212] text-white">
                    Semua Kategori
                  </option>
                  {allCategories.map((c) => (
                    <option key={c} value={c} className="bg-[#121212] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting selector */}
              <div className="flex items-center gap-1 bg-[#151515] border border-[#242424] rounded-xl px-2.5 py-1.5 text-xs text-zinc-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="bg-transparent border-none text-xs text-white outline-none cursor-pointer pr-1"
                >
                  <option value="newest" className="bg-[#121212] text-white">
                    Terbaru
                  </option>
                  <option value="oldest" className="bg-[#121212] text-white">
                    Terlama
                  </option>
                  <option value="highest" className="bg-[#121212] text-white">
                    Nominal Terbesar
                  </option>
                  <option value="lowest" className="bg-[#121212] text-white">
                    Nominal Terkecil
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2.5">
          {/* Loading Skeletons */}
          {isLoading && (
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#0D0D0D] border border-[#202020] flex items-center justify-between animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-zinc-800 rounded" />
                      <div className="h-3 w-20 bg-zinc-800/60 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-24 bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredTransactions.length === 0 && (
            <div className="p-8 sm:p-12 rounded-2xl bg-[#0D0D0D] border border-[#242424] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Tidak ada transaksi ditemukan
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                {searchQuery || typeFilter !== "all" || categoryFilter !== "all"
                  ? "Coba ubah kata kunci pencarian atau bersihkan filter yang aktif."
                  : "Mulai catat pemasukan atau pengeluaran pertamamu."}
              </p>
              {(searchQuery || typeFilter !== "all" || categoryFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="text-xs text-emerald-400 hover:underline pt-2 inline-block font-medium"
                >
                  Reset Semua Filter
                </button>
              )}
            </div>
          )}

          {/* Transaction Cards / List */}
          {!isLoading &&
            filteredTransactions.map((tx) => {
              const isIncome = tx.type === "income";
              return (
                <div
                  key={tx.id}
                  className="group p-3.5 sm:p-4 rounded-xl bg-[#0D0D0D] border border-[#202020] hover:border-[#2C2C2C] transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isIncome
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-white truncate">
                        {tx.description || tx.category}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
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

                  {/* Right side: Amount + action buttons */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
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

                    {/* Quick actions: Edit & Delete */}
                    <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingTransaction(tx)}
                        title="Edit transaksi"
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        title="Hapus transaksi"
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Edit Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={Boolean(editingTransaction)}
        onClose={() => setEditingTransaction(null)}
      />
    </AppLayout>
  );
}
