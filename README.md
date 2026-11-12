# ANVAYA Spend — Personal Finance Web Application

> **"Kelola uangmu. Pahami kebiasaanmu."**  
> Aplikasi pencatatan keuangan modern dengan filosofi desain Apple-like minimalist dark mode, real-time balance tracking, kategorisasi pengeluaran, analisis visual, dan integrasi penuh Supabase Auth & PostgreSQL Row Level Security (RLS).

---

## 🚀 Fitur Utama

1. **Desain Finansial Modern (Dark Theme #050505)**
   - Tema gelap pekat elegan dengan depth bertingkat (`#050505`, `#0D0D0D`, `#151515`).
   - Aksen subtle emerald (`#10B981`) untuk pemasukan dan rose (`#F43F5E`) untuk pengeluaran.
   - Glassmorphism halus dan tipografi bersih.

2. **Mobile-First Experience**
   - Bottom navigation untuk akses satu tangan di smartphone.
   - Floating quick-action button `+` untuk tambah transaksi dalam hitungan detik.
   - Modal responsif otomatis bertransformasi menjadi smooth bottom-sheet di layar seluler.
   - Touch targets lega (>= 44px) tanpa overflow horizontal.

3. **Dashboard Real-time**
   - Kartu Saldo Saat Ini, Total Pemasukan, dan Total Pengeluaran.
   - Daftar 5 transaksi terakhir dengan pembeda warna mutasi.
   - Quick widget status batas anggaran bulanan.

4. **Pencatatan Transaksi Dinamis**
   - Pemasukan (Gaji, Uang Saku, Investasi, Bonus, dll).
   - Pengeluaran (Makanan, Transportasi, Belanja, Pendidikan, Hiburan, Tagihan, Kesehatan, Lainnya).
   - Live format Rupiah otomatis saat mengetik (`Rp1.250.000`).
   - Optimistic UI updates.

5. **Riwayat Transaksi Komprehensif**
   - Pencarian instan berdasarkan nama transaksi atau kategori.
   - Filter jenis mutasi (Semua, Pemasukan, Pengeluaran).
   - Filter kategori pengeluaran/pemasukan.
   - Sorting (Terbaru, Terlama, Nominal Terbesar, Nominal Terkecil).
   - Edit rincian transaksi & Hapus permanen.

6. **Analisis & Statistik Pengeluaran**
   - Pemilihan rentang waktu: Minggu ini, Bulan ini, 3 Bulan Terakhir, Tahun ini.
   - Perbandingan rasio arus kas masuk vs keluar.
   - Distribusi persentase pengeluaran per kategori.
   - Rasio tabungan (Savings Rate).

7. **Batas Anggaran Bulanan (Budgeting)**
   - Pasang kuota pengeluaran per kategori (misal: Makanan Rp1.500.000).
   - Progress bar dinamis.
   - Peringatan visual halus (Amber Alert) ketika pengeluaran &ge; 80% dari batas.
   - Indikator Overbudget (Red Alert) ketika pengeluaran melampaui batas limit.

8. **Keamanan & Privasi Tingkat Tinggi**
   - Supabase Row Level Security (RLS) pada tabel `profiles`, `transactions`, dan `budgets`.
   - Google OAuth Authentication via Supabase Auth.
   - Setiap pengguna hanya dapat mengakses dan mengelola datanya sendiri.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Icons**: Lucide React
- **Security**: Supabase Row Level Security (RLS)

---

## 📂 Struktur Direktori Proyek

```
anvaya-spend/
├── app/
│   ├── auth/callback/route.ts  # Penangan redirect Google OAuth
│   ├── dashboard/page.tsx      # Ringkasan saldo & transaksi mutasi
│   ├── transactions/page.tsx   # Riwayat lengkap, search, filter, edit
│   ├── analytics/page.tsx      # Grafik analisis arus kas & kategori
│   ├── budget/page.tsx         # Manajemen batas anggaran bulanan
│   ├── profile/page.tsx        # Informasi profil pengguna & setup Supabase
│   ├── login/page.tsx          # Halaman masuk via Google OAuth
│   ├── globals.css             # Tema dark mode & token warna
│   ├── layout.tsx              # Root Layout & Context Provider
│   └── page.tsx                # Landing page interaktif
├── components/
│   ├── layout/AppLayout.tsx    # Desktop sidebar & mobile bottom bar
│   ├── modals/                 # Modal & bottom-sheet
│   └── transactions/           # Komponen form tambah & edit transaksi
├── context/
│   ├── AuthContext.tsx         # Session & Google OAuth provider
│   ├── TransactionContext.tsx  # State manajemen transaksi & anggaran
│   └── ToastContext.tsx        # Sistem notifikasi toast
├── lib/
│   ├── supabase/               # Klien Supabase (browser, server, middleware)
│   └── utils.ts                # Formatter Rupiah & tanggal Indonesia
├── supabase/
│   └── schema.sql              # Skrip skema database & aturan RLS
├── types/
│   └── database.types.ts       # Definisi tipe data TypeScript
└── .env.example                # Template konfigurasi environment
```

---

## ⚙️ Panduan Setup Supabase & Google OAuth

### 1. Buat Proyek Supabase
1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard) dan buat proyek baru.
2. Buka menu **SQL Editor**, buka file `supabase/schema.sql` di proyek ini, salin seluruh kodenya, dan tekan **Run**.

Skrip ini akan otomatis membuat:
- Tabel `profiles` (terhubung ke auth.users)
- Tabel `transactions` (dengan RLS terisolasi per user)
- Tabel `budgets` (batas anggaran bulanan per kategori)
- Trigger otomatis untuk sinkronisasi profil saat login Google pertama kali.

### 2. Aktifkan Google Provider di Supabase
1. Buka [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Buat **OAuth 2.0 Client ID** (Web Application).
3. Tambahkan URL Authorized redirect URI dari Supabase:
   `https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback`
4. Di Dashboard Supabase, buka **Authentication** &rarr; **Providers** &rarr; **Google**:
   - Aktifkan provider Google.
   - Masukkan **Client ID** dan **Client Secret** dari Google Cloud.
   - Simpan perubahan.

### 3. Konfigurasi Environment Variables
Buat file `.env.local` di root proyek:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 💻 Menjalankan Aplikasi Secara Lokal

```bash
# 1. Jalankan development server
npm run dev

# 2. Atau buat build produksi dan jalankan
npm run build
npm start
```

Buka peramban Anda di `http://localhost:3000`.
Aplikasi sudah siap digunakan secara penuh!
