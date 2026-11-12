"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowDownLeft, ArrowUpRight, Calendar, Tag, FileText, Check, Trash2 } from "lucide-react";
import { useTransactions } from "@/context/TransactionContext";
import type { Transaction } from "@/types/database.types";
import { CATEGORIES_EXPENSE, CATEGORIES_INCOME, formatRupiah } from "@/lib/utils";

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTransactionModal({ transaction, isOpen, onClose }: EditTransactionModalProps) {
  const { updateTransaction, deleteTransaction } = useTransactions();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("Makanan");
  const [description, setDescription] = useState<string>("");
  const [transactionDate, setTransactionDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(String(transaction.amount));
      setCategory(transaction.category);
      setDescription(transaction.description || "");
      setTransactionDate(transaction.transaction_date);
    }
  }, [transaction]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const currentCategories = type === "expense" ? CATEGORIES_EXPENSE : CATEGORIES_INCOME;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(/[^0-9]/g, ""));
    if (!parsedAmount || parsedAmount <= 0) return;

    setIsSubmitting(true);
    const success = await updateTransaction(transaction.id, {
      type,
      amount: parsedAmount,
      category,
      description: description.trim(),
      transaction_date: transactionDate,
    });

    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Apakah kamu yakin ingin menghapus transaksi ini?")) return;
    setIsDeleting(true);
    await deleteTransaction(transaction.id);
    setIsDeleting(false);
    onClose();
  };

  const numAmount = parseFloat(amount || "0");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#242424] rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-4 duration-200">
        <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
          <div>
            <h2 className="text-lg font-semibold text-[#F5F5F5] tracking-tight">
              Edit Transaksi
            </h2>
            <p className="text-xs text-[#8A8A8A] mt-0.5">
              Perbarui rincian transaksi
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-4 space-y-5">
          {/* Type Selector */}
          <div className="grid grid-cols-2 p-1 bg-[#151515] rounded-xl border border-[#222222]">
            <button
              type="button"
              onClick={() => {
                setType("expense");
                setCategory(CATEGORIES_EXPENSE[0]);
              }}
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
              onClick={() => {
                setType("income");
                setCategory(CATEGORIES_INCOME[0]);
              }}
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

          {/* Amount */}
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
                value={amount ? new Intl.NumberFormat("id-ID").format(Number(amount)) : ""}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full bg-[#151515] border border-[#242424] focus:border-zinc-500 rounded-xl pl-12 pr-4 py-3.5 text-2xl font-semibold text-white outline-none transition-colors"
              />
            </div>
            {numAmount > 0 && (
              <p className="text-xs text-zinc-400 pl-1">
                Terbaca: <span className="text-zinc-200">{formatRupiah(numAmount)}</span>
              </p>
            )}
          </div>

          {/* Categories */}
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

          {/* Description */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              Deskripsi
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#151515] border border-[#242424] focus:border-zinc-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              Tanggal
            </label>
            <input
              type="date"
              required
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full bg-[#151515] border border-[#242424] focus:border-zinc-500 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-3.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-2"
              title="Hapus transaksi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || numAmount <= 0}
              className="flex-1 py-3.5 px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
