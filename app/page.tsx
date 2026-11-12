"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  PieChart,
  Wallet,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/lib/utils";

export default function LandingPage() {
  const { user, signInWithGoogle, isConfigured } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navbar */}
      <header className="border-b border-[#181818] sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black font-black text-sm tracking-tighter shadow-md">
              AV
            </div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              ANVAYA
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Spend
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
              >
                Buka Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs text-zinc-400 hover:text-white transition-colors px-3 py-2"
                >
                  Masuk
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  Mulai Sekarang
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121212] border border-[#222222] text-[11px] font-medium text-zinc-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Finansial cerdas dengan standar desain modern Apple-like</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Kelola uangmu. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
              Pahami kebiasaanmu.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#8A8A8A] leading-relaxed">
            ANVAYA Spend dirancang untuk pelajar, mahasiswa, dan profesional muda yang menginginkan pencatatan pemasukan, pengeluaran, serta anggaran tanpa repot.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>Mulai Sekarang</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => signInWithGoogle()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#121212] hover:bg-[#1A1A1A] active:scale-[0.98] border border-[#262626] text-white font-medium text-sm transition-all flex items-center justify-center gap-3 shadow-md"
            >
              {/* Google G Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Masuk dengan Google</span>
            </button>
          </div>

          <div className="pt-2 text-xs text-zinc-500 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Gratis & Open
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Supabase Row-Level Security
            </span>
          </div>
        </div>

        {/* Subtle Dashboard Preview Mockup */}
        <div className="max-w-4xl mx-auto mt-14 sm:mt-18 relative">
          <div className="p-2 sm:p-3 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#222222] to-[#111111] border border-[#2B2B2B] shadow-2xl">
            <div className="rounded-xl sm:rounded-2xl bg-[#0B0B0B] border border-[#1A1A1A] p-5 sm:p-7 space-y-6">
              {/* Mockup Top Header */}
              <div className="flex items-center justify-between border-b border-[#181818] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-zinc-600 font-mono pl-2">anvaya.spend/dashboard</span>
                </div>
                <div className="text-[11px] text-zinc-500">Saldo Real-time</div>
              </div>

              {/* Mockup Financial Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#121212] border border-[#202020]">
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Saldo Saat Ini</span>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-1">Rp1.250.000</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Arus kas positif
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#121212] border border-[#202020]">
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Total Pemasukan</span>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">Rp2.500.000</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Bulan berjalan</div>
                </div>
                <div className="p-4 rounded-xl bg-[#121212] border border-[#202020]">
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Total Pengeluaran</span>
                  <div className="text-xl sm:text-2xl font-bold text-rose-400 mt-1">Rp1.250.000</div>
                  <div className="text-[10px] text-zinc-500 mt-1">50% dari pemasukan</div>
                </div>
              </div>

              {/* Mockup Recent Transactions */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Transaksi Terakhir</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#202020]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                        +
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Uang Saku</div>
                        <div className="text-[10px] text-zinc-500">Hari ini • Pemasukan</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">+ Rp50.000</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#202020]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold">
                        -
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Makanan</div>
                        <div className="text-[10px] text-zinc-500">Makan siang • Pengeluaran</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-400">- Rp15.000</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#202020]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold">
                        -
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Transportasi</div>
                        <div className="text-[10px] text-zinc-500">Tiket KRL • Pengeluaran</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-400">- Rp10.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-4 sm:px-6 border-t border-[#181818] bg-[#080808]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Dibuat untuk Efisiensi & Ketenangan Pikiran
            </h2>
            <p className="text-sm text-zinc-400">
              Antarmuka gelap minimalis yang tidak menyilaukan mata dan fokus pada data yang kamu butuhkan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#202020] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Pencatatan Secepat Kilat</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cukup tekan satu tombol, pilih kategori, isi nominal. Tanpa form rumit dan tanpa waktu tunggu.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#202020] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Analisis Kebiasaan Belanja</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Visualisasikan alokasi pengeluaran per kategori. Pahami ke mana uangmu mengalir setiap minggu atau bulan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#202020] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Batas Anggaran Bulanan</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pasang batas pengeluaran untuk makan, hiburan, dan transportasi. Dapatkan peringatan halus saat mendekati limit.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#202020] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Row Level Security (RLS)</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Data terenkripsi dan diproteksi di level database PostgreSQL Supabase. Tidak ada pengguna lain yang bisa melihat transaksimu.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#202020] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Login Aman Google OAuth</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tanpa perlu mengingat password baru. Masuk dengan aman menggunakan akun Google terpercaya Anda.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#202020] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Mobile-First Experience</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dirancang khusus dengan bottom navigation dan modal responsif agar sangat nyaman diakses via ponsel cerdas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#181818] py-8 px-4 sm:px-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">ANVAYA Spend</span>
            <span>—</span>
            <span>Aplikasi Pencatatan Keuangan Pribadi</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/transactions" className="hover:text-white transition-colors">
              Transaksi
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
