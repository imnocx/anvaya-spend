"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Shield, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signInWithGoogle, isConfigured, isLoading } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (errorParam) {
      setErrorMessage("Autentikasi gagal atau dibatalkan. Silakan coba kembali.");
    }
  }, [errorParam]);

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsAuthenticating(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menghubungi layanan Google OAuth.");
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0D0D] border border-[#242424] shadow-2xl space-y-6">
      {/* Logo & Headline */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center mx-auto shadow-lg mb-3">
          AV
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Masuk ke ANVAYA Spend
        </h1>
        <p className="text-xs text-zinc-400">
          Kelola uangmu. Pahami kebiasaanmu.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Setup notice if Supabase keys are missing */}
      {!isConfigured && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Supabase Belum Dikonfigurasi</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            Tambahkan <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di <code>.env.local</code>. Kamu tetap bisa mencoba aplikasi dalam mode demo.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-1 font-semibold underline text-amber-300 hover:text-white"
          >
            Lanjutkan ke Dashboard Demo &rarr;
          </Link>
        </div>
      )}

      {/* Google Login Button */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleGoogleLogin}
          disabled={isAuthenticating}
          className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
        >
          {/* Google G SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
          <span>{isAuthenticating ? "Menghubungkan ke Google..." : "Masuk dengan Google"}</span>
        </button>

        {!isConfigured && (
          <Link
            href="/dashboard"
            className="w-full py-3 px-4 rounded-xl bg-[#151515] hover:bg-[#1E1E1E] border border-[#242424] text-zinc-300 font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            Coba Pratinjau Dashboard
          </Link>
        )}
      </div>

      {/* Privacy & Security Guarantee */}
      <div className="pt-4 border-t border-[#1C1C1C] space-y-2 text-[11px] text-zinc-500">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Privasi terisolasi: Hanya kamu yang dapat membaca transaksimu.</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Autentikasi langsung ke Supabase Auth & Google Identity.</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between p-4 sm:p-6 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top bar back link */}
      <div className="max-w-md w-full mx-auto pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Center login card */}
      <div className="max-w-md w-full mx-auto my-auto py-12">
        <Suspense
          fallback={
            <div className="p-8 rounded-3xl bg-[#0D0D0D] border border-[#242424] text-center text-sm text-zinc-400 animate-pulse">
              Memuat formulir masuk...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center pb-4 text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} ANVAYA Spend. Semua hak cipta dilindungi.
      </div>
    </div>
  );
}
