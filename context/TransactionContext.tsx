"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Transaction, Budget, FinancialSummary, BudgetProgress } from "@/types/database.types";
import { getCurrentMonth } from "@/lib/utils";
import { useToast } from "./ToastContext";

interface TransactionContextType {
  transactions: Transaction[];
  budgets: Budget[];
  isLoading: boolean;
  summary: FinancialSummary;
  budgetProgressList: BudgetProgress[];
  addTransaction: (data: {
    type: "income" | "expense";
    amount: number;
    category: string;
    description: string;
    transaction_date: string;
  }) => Promise<boolean>;
  updateTransaction: (
    id: string,
    data: Partial<Transaction>
  ) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  saveBudget: (category: string, amount: number, month?: string) => Promise<boolean>;
  deleteBudget: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Initial sample transactions for preview/demo when Supabase credentials are not yet linked
const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "demo-1",
    user_id: "demo-user",
    type: "income",
    amount: 3500000,
    category: "Gaji",
    description: "Gaji Pokok & Tunjangan",
    transaction_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    user_id: "demo-user",
    type: "expense",
    amount: 45000,
    category: "Makanan",
    description: "Makan siang ramen",
    transaction_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    user_id: "demo-user",
    type: "expense",
    amount: 25000,
    category: "Transportasi",
    description: "KRL & Ojek Online",
    transaction_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-4",
    user_id: "demo-user",
    type: "expense",
    amount: 120000,
    category: "Belanja",
    description: "Keperluan harian bulanan",
    transaction_date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-5",
    user_id: "demo-user",
    type: "income",
    amount: 350000,
    category: "Bonus",
    description: "Freelance UI project bonus",
    transaction_date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-6",
    user_id: "demo-user",
    type: "expense",
    amount: 150000,
    category: "Tagihan",
    description: "Paket Internet & Listrik",
    transaction_date: new Date(Date.now() - 345600000).toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEMO_BUDGETS: Budget[] = [
  {
    id: "budget-1",
    user_id: "demo-user",
    category: "Makanan",
    amount: 1500000,
    month: getCurrentMonth(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "budget-2",
    user_id: "demo-user",
    category: "Transportasi",
    amount: 600000,
    month: getCurrentMonth(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "budget-3",
    user_id: "demo-user",
    category: "Belanja",
    amount: 800000,
    month: getCurrentMonth(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "budget-4",
    user_id: "demo-user",
    category: "Hiburan",
    amount: 400000,
    month: getCurrentMonth(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const supabase = createClient();
  const hasSupabase = isSupabaseConfigured() && Boolean(user);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    if (!isSupabaseConfigured() || !user) {
      // Use local demo storage if not authenticated or supabase unconfigured
      const localTx = localStorage.getItem("anvaya_transactions");
      const localBudgets = localStorage.getItem("anvaya_budgets");

      if (localTx) {
        try {
          setTransactions(JSON.parse(localTx));
        } catch {
          setTransactions(DEMO_TRANSACTIONS);
        }
      } else {
        setTransactions(DEMO_TRANSACTIONS);
      }

      if (localBudgets) {
        try {
          setBudgets(JSON.parse(localBudgets));
        } catch {
          setBudgets(DEMO_BUDGETS);
        }
      } else {
        setBudgets(DEMO_BUDGETS);
      }

      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch transactions
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (txError) throw txError;
      setTransactions((txData as Transaction[]) || []);

      // 2. Fetch budgets
      const { data: bgData, error: bgError } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id);

      if (bgError) throw bgError;
      setBudgets((bgData as Budget[]) || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      toastError("Gagal memuat data dari database.");
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase, toastError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Financial summary calculations
  const summary: FinancialSummary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of transactions) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") {
        totalIncome += amt;
      } else if (tx.type === "expense") {
        totalExpense += amt;
      }
    }

    return {
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  // Budget progress calculations for current month
  const budgetProgressList: BudgetProgress[] = useMemo(() => {
    const currentMonth = getCurrentMonth();
    const currentBudgets = budgets.filter((b) => b.month === currentMonth || !b.month);

    return currentBudgets.map((b) => {
      // sum expense for this category in this month
      const spent = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category.toLowerCase() === b.category.toLowerCase() &&
            t.transaction_date.startsWith(currentMonth)
        )
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const budgetAmt = Number(b.amount) || 1;
      const remaining = Math.max(0, budgetAmt - spent);
      const percentage = Math.min(100, Math.round((spent / budgetAmt) * 100));

      return {
        ...b,
        spent,
        remaining,
        percentage,
      };
    });
  }, [budgets, transactions]);

  // Add Transaction
  const addTransaction = async (data: {
    type: "income" | "expense";
    amount: number;
    category: string;
    description: string;
    transaction_date: string;
  }): Promise<boolean> => {
    const tempId = "temp-" + Date.now();
    const newTx: Transaction = {
      id: tempId,
      user_id: user?.id || "demo-user",
      type: data.type,
      amount: Number(data.amount),
      category: data.category,
      description: data.description || "",
      transaction_date: data.transaction_date || new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic UI update
    setTransactions((prev) => [newTx, ...prev]);

    if (!hasSupabase) {
      // Local fallback
      const updated = [newTx, ...transactions];
      localStorage.setItem("anvaya_transactions", JSON.stringify(updated));
      success("Transaksi berhasil ditambahkan.");
      return true;
    }

    try {
      const { data: inserted, error: insertError } = await supabase
        .from("transactions")
        .insert({
          user_id: user!.id,
          type: data.type,
          amount: Number(data.amount),
          category: data.category,
          description: data.description || "",
          transaction_date: data.transaction_date,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Replace temp id with real id
      setTransactions((prev) =>
        prev.map((t) => (t.id === tempId ? (inserted as Transaction) : t))
      );
      success("Transaksi berhasil ditambahkan.");
      return true;
    } catch (err: any) {
      console.error("Error inserting transaction:", err);
      // Revert optimistic update
      setTransactions((prev) => prev.filter((t) => t.id !== tempId));
      toastError("Gagal menyimpan transaksi ke database.");
      return false;
    }
  };

  // Update Transaction
  const updateTransaction = async (
    id: string,
    data: Partial<Transaction>
  ): Promise<boolean> => {
    const prevList = [...transactions];
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, updated_at: new Date().toISOString() } : t))
    );

    if (!hasSupabase) {
      const updated = transactions.map((t) =>
        t.id === id ? { ...t, ...data, updated_at: new Date().toISOString() } : t
      );
      localStorage.setItem("anvaya_transactions", JSON.stringify(updated));
      success("Transaksi berhasil diperbarui.");
      return true;
    }

    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user!.id);

      if (error) throw error;
      success("Transaksi berhasil diperbarui.");
      return true;
    } catch (err: any) {
      console.error("Error updating transaction:", err);
      setTransactions(prevList);
      toastError("Gagal memperbarui transaksi.");
      return false;
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id: string): Promise<boolean> => {
    const prevList = [...transactions];
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (!hasSupabase) {
      const updated = transactions.filter((t) => t.id !== id);
      localStorage.setItem("anvaya_transactions", JSON.stringify(updated));
      success("Transaksi berhasil dihapus.");
      return true;
    }

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", user!.id);

      if (error) throw error;
      success("Transaksi berhasil dihapus.");
      return true;
    } catch (err: any) {
      console.error("Error deleting transaction:", err);
      setTransactions(prevList);
      toastError("Gagal menghapus transaksi.");
      return false;
    }
  };

  // Save / Update Budget
  const saveBudget = async (
    category: string,
    amount: number,
    month: string = getCurrentMonth()
  ): Promise<boolean> => {
    const tempId = "bg-" + Date.now();
    const existing = budgets.find(
      (b) => b.category.toLowerCase() === category.toLowerCase() && b.month === month
    );

    let updatedBudgets: Budget[];
    if (existing) {
      updatedBudgets = budgets.map((b) =>
        b.id === existing.id ? { ...b, amount: Number(amount), updated_at: new Date().toISOString() } : b
      );
    } else {
      const newBudget: Budget = {
        id: tempId,
        user_id: user?.id || "demo-user",
        category,
        amount: Number(amount),
        month,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updatedBudgets = [...budgets, newBudget];
    }

    setBudgets(updatedBudgets);

    if (!hasSupabase) {
      localStorage.setItem("anvaya_budgets", JSON.stringify(updatedBudgets));
      success("Batas anggaran berhasil disimpan.");
      return true;
    }

    try {
      const { data: upserted, error } = await supabase
        .from("budgets")
        .upsert(
          {
            user_id: user!.id,
            category,
            amount: Number(amount),
            month,
          },
          { onConflict: "user_id, category, month" }
        )
        .select()
        .single();

      if (error) throw error;
      if (upserted) {
        setBudgets((prev) =>
          prev.map((b) =>
            b.category === category && b.month === month ? (upserted as Budget) : b
          )
        );
      }
      success("Batas anggaran berhasil disimpan.");
      return true;
    } catch (err: any) {
      console.error("Error saving budget:", err);
      toastError("Gagal menyimpan anggaran ke Supabase.");
      return false;
    }
  };

  // Delete Budget
  const deleteBudget = async (id: string): Promise<boolean> => {
    const prev = [...budgets];
    setBudgets((b) => b.filter((item) => item.id !== id));

    if (!hasSupabase) {
      const updated = budgets.filter((b) => b.id !== id);
      localStorage.setItem("anvaya_budgets", JSON.stringify(updated));
      success("Anggaran dihapus.");
      return true;
    }

    try {
      const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", id)
        .eq("user_id", user!.id);

      if (error) throw error;
      success("Anggaran dihapus.");
      return true;
    } catch (err: any) {
      console.error("Error deleting budget:", err);
      setBudgets(prev);
      toastError("Gagal menghapus anggaran.");
      return false;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        budgets,
        isLoading,
        summary,
        budgetProgressList,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        saveBudget,
        deleteBudget,
        refreshData: fetchData,
        isAddModalOpen,
        openAddModal,
        closeAddModal,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
}
