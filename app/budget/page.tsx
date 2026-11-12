"use client";

import React, { useState } from "react";
import {
  WalletCards,
  Plus,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTransactions } from "@/context/TransactionContext";
import { formatRupiah, CATEGORIES_EXPENSE, getCurrentMonth } from "@/lib/utils";

export default function BudgetPage() {
  const { budgetProgressList, saveBudget, deleteBudget, isLoading } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES_EXPENSE[0]);
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = (categoryName?: string, currentAmount?: number) => {
    if (categoryName) {
      setSelectedCategory(categoryName);
      setBudgetAmount(currentAmount ? String(currentAmount) : "");
    } else {
      setSelectedCategory(CATEGORIES_EXPENSE[0]);
      setBudgetAmount("");
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(budgetAmount.replace(/[^0-9]/g, ""));
    if (!parsedAmount || parsedAmount <= 0) return;

    setIsSubmitting(true);
    await saveBudget(selectedCategory, parsedAmount, getCurrentMonth());
    setIsSubmitting(false);
    setIsModalOpen(false);
    setBudgetAmount("");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus batasan anggaran ini?")) {
      await deleteBudget(id);
    }
  };

  // Check how many categories are over or near budget
  const warningCount = budgetProgressList.filter((b) => b.percentage >= 80).length;

  return (
    <AppLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Budget Bulanan
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8A8A] mt-1">
              Tetapkan batas pengeluaran per kategori agar kondisi keuangan tetap terkontrol
            </p>
          </div>

          <button
            onClick={() => handleOpenAdd()}
            className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs tracking-tight hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Atur Budget Baru</span>
          </button>
        </div>

        {/* Warning Banner if any category exceeds 80% */}
        {warningCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Perhatian: Terdapat <strong>{warningCount} kategori</strong> yang pengeluarannya telah mencapai &ge;80% batas bulanan.
              </span>
            </div>
          </div>
        )}

        {/* Budget Progress Cards */}
        <div className="space-y-3">
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#202020] animate-pulse space-y-3"
                >
                  <div className="h-4 w-32 bg-zinc-800 rounded" />
                  <div className="h-2 w-full bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && budgetProgressList.length === 0 && (
            <div className="p-10 sm:p-14 rounded-2xl bg-[#0D0D0D] border border-[#242424] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                <WalletCards className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Belum ada anggaran bulanan
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Tentukan target limit bulanan untuk makanan, transportasi, belanja, atau hiburan untuk menjaga saldo tetap sehat.
              </p>
              <button
                onClick={() => handleOpenAdd()}
                className="mt-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Atur Budget Sekarang</span>
              </button>
            </div>
          )}

          {!isLoading &&
            budgetProgressList.map((item) => {
              const isOver = item.percentage >= 100;
              const isNear = item.percentage >= 80 && !isOver;

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl bg-[#0D0D0D] border transition-colors space-y-3 ${
                    isOver
                      ? "border-rose-500/30 bg-rose-950/10"
                      : isNear
                      ? "border-amber-500/30 bg-amber-950/10"
                      : "border-[#242424]"
                  }`}
                >
                  {/* Top line: Category + Amount info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-white">
                        {item.category}
                      </span>
                      {isOver && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Melebihi Limit
                        </span>
                      )}
                      {isNear && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Mendekati Limit
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAdd(item.category, item.amount)}
                        title="Edit anggaran"
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Hapus anggaran"
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Numbers */}
                  <div className="flex items-baseline justify-between text-xs text-zinc-400">
                    <div>
                      Terpakai:{" "}
                      <span
                        className={`font-semibold ${
                          isOver ? "text-rose-400" : isNear ? "text-amber-400" : "text-white"
                        }`}
                      >
                        {formatRupiah(item.spent)}
                      </span>
                    </div>
                    <div>
                      Batas:{" "}
                      <span className="font-semibold text-zinc-200">
                        {formatRupiah(item.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-[#181818] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver
                          ? "bg-rose-500"
                          : isNear
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>

                  {/* Bottom percentage & remaining */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
                    <span>
                      {item.percentage}% dari kuota bulanan terpakai
                    </span>
                    <span>
                      Sisa:{" "}
                      <strong className={item.remaining === 0 ? "text-rose-400" : "text-zinc-300"}>
                        {formatRupiah(item.remaining)}
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Set / Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#0D0D0D] border border-[#242424] rounded-2xl shadow-2xl p-6 z-10 space-y-5 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Atur Batas Anggaran Bulanan
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Bulan: {getCurrentMonth()}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#151515] border border-[#242424] focus:border-zinc-500 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer"
                >
                  {CATEGORIES_EXPENSE.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#121212] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Batas Nominal Bulanan (Rp)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-base font-semibold text-zinc-500">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="Contoh: 500000"
                    value={
                      budgetAmount
                        ? new Intl.NumberFormat("id-ID").format(Number(budgetAmount))
                        : ""
                    }
                    onChange={(e) =>
                      setBudgetAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="w-full bg-[#151515] border border-[#242424] focus:border-zinc-500 rounded-xl pl-12 pr-4 py-3 text-lg font-semibold text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !budgetAmount}
                  className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Batas Anggaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
