import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { TransactionProvider } from "@/context/TransactionContext";

export const metadata: Metadata = {
  title: "ANVAYA Spend — Kelola uangmu. Pahami kebiasaanmu.",
  description:
    "Aplikasi web pencatatan keuangan pribadi modern, cepat, dan elegan. Pantau pemasukan, pengeluaran, saldo, dan anggaran bulanan.",
  keywords: ["keuangan pribadi", "budgeting", "expense tracker", "ANVAYA Spend", "catatan keuangan"],
  authors: [{ name: "ANVAYA Spend" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#050505] text-[#F5F5F5] antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <ToastProvider>
          <AuthProvider>
            <TransactionProvider>
              {children}
            </TransactionProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
