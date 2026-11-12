"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowDownLeft, ArrowUpRight, Calendar, Tag, FileText, Check } from "lucide-react";
import { useTransactions } from "@/context/TransactionContext";
import { CATEGORIES_EXPENSE, CATEGORIES_INCOME, formatRupiah } from "@/lib/utils";

export function AddTransactionModal() {
  const { isAddModalOpen, closeAddModal, addTransaction } = useTransactions();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("Makanan");
  const [description, setDescription] = useState<string>("");
  const [transactionDate, setTransactionDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch default category when type changes
  useEffect(() => {
    if (type === "expense") {
      setCategory(CATEGORIES_EXPENSE[0]);
    } else {
      setCategory(CATEGORIES_INCOME[0]);
    }
  }, [type]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAddModal();
    };
    if (isAddModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddModalOpen, closeAddModal]);

  if (!isAddModalOpen) return null;

  const currentCategories = type === "expense" ? CATEGORIES_EXPENSE : CATEGORIES_INCOME;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(/[^0-9]/g, ""));
    if (!parsedAmount || parsedAmount <= 0) return;

    setIsSubmitting(true);
    const success = await addTransaction({
      type,
      amount: parsedAmount,
      category,
      description: description.trim(),
      transaction_date: transactionDate,
    });

    setIsSubmitting(false);
    if (success) {
      setAmount("");
      setDescription("");
      closeAddModal();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    setAmount(rawVal);
  };

  const numAmount = parseFloat(amount || "0");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={closeAddModal}
        aria-hidden="true"
      />

      {/* Sheet / Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#242424] rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
          <div>
            <h2 className="text-lg font-semibold text-[#F5F5F5] tracking-tight">
              Tambah Transaksi
            </h2>
            <p className="text-xs text-[#8A8A8A] mt-0.5">
              Catat mutasi arus kas pribadimu
            </p>
          </div>
          <button
            onClick={closeAddModal}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-4 space-y-5">
          {/* Type Selector (Tabs) */}
          <div className="grid grid-cols-2 p-1 bg-[#151515] rounded-xl border border-[#222222]">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                type === "expense"
                  ? "bg-[#202020] text-rose-400 shadow-sm border border-rose-500/20"
                  : "text-[#8A8A8A] hover:text-zinc-300"
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                type === "income"
                  ? "bg-[#202020] text-emerald-400 shadow-sm border border-emerald-500/20"
                  : "text-[#8A8A8A] hover:text-zinc-300"
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Pemasukan
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
              Nominal
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-lg font-semibold text-zinc-500">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                autoFocus
                placeholder="0"
                value={amount ? new Intl.NumberFormat("id-ID").format(Number(amount)) : ""}
                onChange={handleAmountChange}
                className="w-full bg-[#151515] border border-[#242424] focus:border-emerald-500/60 rounded-xl pl-12 pr-4 py-3.5 text-2xl font-semibold text-white placeholder-zinc-700 outline-none transition-colors"
              />
            </div>
            {numAmount > 0 && (
              <p className="text-xs text-zinc-400 pl-1">
                Terbaca: <span className="text-zinc-200">{formatRupiah(numAmount)}</span>
              </p>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              Kategori
            </label>
            <div className="flex flex-wrap gap-2">
              {currentCategories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      isSelected
                        ? "bg-zinc-100 text-black border-white shadow-sm font-semibold"
                        : "bg-[#151515] text-zinc-400 border-[#242424] hover:bg-[#1C1C1C] hover:text-zinc-200"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline-block mr-1 -mt-0.5" />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              Deskripsi (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Kopi pagi, Makan siang, Gaji kantor"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#151515] border border-[#242424] focus:border-zinc-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              Tanggal Transaksi
            </label>
            <input
              type="date"
              required
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full bg-[#151515] border border-[#242424] focus:border-zinc-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !amount || numAmount <= 0}
              className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Menyimpan Transaksi...
                </>
              ) : (
                "Simpan Transaksi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
