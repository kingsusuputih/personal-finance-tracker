<a href="https://github.com/kingsusuputih/personal-finance-tracker">
  <img src="public/favicon.svg" width="48" alt="Finance Tracker logo" />
</a>

# Finance Tracker

Dashboard keuangan pribadi, gratis — data keuangan tersimpan di Google Drive Anda sendiri.

Finance Tracker adalah aplikasi web untuk mencatat pemasukan dan pengeluaran serta menghitung target keuangan. Setiap pengguna masuk dengan akun Google miliknya; aplikasi membuat spreadsheet `Finance_Tracker_Data` otomatis di Google Drive pengguna dan menulis semua data keuangan langsung ke spreadsheet tersebut. Registry pengguna pseudonim di Supabase (wilayah Singapura) digunakan semata-mata untuk mencatat jumlah pengguna unik dan menampilkan bukti sosial komunitas tersamarkan (`H*** A***`) secara opsional.

## Fitur

- Masuk dengan Google OAuth 2.0
- Spreadsheet otomatis dibuat di Google Drive Anda (`drive.file` scope, hanya file yang dibuat aplikasi)
- Mencatat pemasukan bulanan utama dan pemasukan tambahan (bonus, side job, ngojek) secara terpisah
- Rekap bulanan historis (`/recap`) per siklus gajian: surplus/defisit, sisa uang yang bisa ditabung, dan akumulasi investasi
- Pengelompokan pengeluaran otomatis per kategori berdasarkan kata kunci deskripsi beserta override manual per transaksi
- Pencatatan budget custom per kelompok pengeluaran dan kategori untuk setiap siklus gajian
- Notifikasi Web Push di HP saat belanja mendekati (80%) atau melebihi batas budget
- Progressive Web App (PWA) yang dapat diinstall ke layar utama (Home Screen)
- Asisten Keuangan AI pintar (`/chat`) bertenaga Google Gemini dengan dukungan multi-periode dan perbandingan antarperiode
- Siklus tanggal gajian kustom (1–28, default 25) dan deteksi/pilihan zona waktu IANA
- Fitur privasi untuk menyembunyikan nominal pemasukan dan pengeluaran di dasbor
- Alokasi 50 / 30 / 20 (Kebutuhan 50%, Investasi 30%, Gaya Hidup 20%)
- Target dana: Dana Darurat 6× dan Dana Pensiun 300× pengeluaran bulanan
- Grafik pengeluaran per kategori (Apache ECharts)
- Penghitungan jumlah pengguna aktif dan notifikasi pendaftar baru tersamarkan di landing page
- Halaman Catatan Rilis (Changelog) publik dan Pengaturan terintegrasi
- Dukungan dua bahasa: Indonesia & English
- Analitik agregat: Vercel Web Analytics & Google Analytics (GA4)

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 6 |
| State Management | Zustand |
| Grafik | Apache ECharts 6 |
| Autentikasi | @react-oauth/google |
| Database Keuangan | Google Sheets API v4 (di Drive pengguna) |
| Registry & AI Proxy | Supabase Postgres & Edge Functions (ap-southeast-1) |
| Model AI | Google Gemini API (gemini-3.5-flash-lite via Edge Function) |
| Analytics | @vercel/analytics · Google Analytics |
| Deployment | Vercel |

## Cara Kerja & Privasi

1. Pengguna masuk dengan akun Google.
2. Aplikasi mencari/membuat spreadsheet `Finance_Tracker_Data` di Google Drive pengguna (terdiri dari 5 lembar: `Income`, `AdditionalIncome`, `Expenses`, `Settings`, dan `Budgets`).
3. Pemasukan, pengeluaran, dan pengaturan siklus ditulis langsung ke spreadsheet tersebut.
4. Semua perhitungan (50/30/20, target dana, siklus gajian, rekap historis, pengelompokan) dilakukan di sisi klien.
5. Akun unik dicatat secara anonim (HMAC) di registry Supabase untuk menampilkan total pengguna di landing page. Pengguna dapat memilih untuk menampilkan nama tersamarkan atau menghapus datanya kapan saja di Pengaturan.
6. Saat menggunakan Asisten AI opsional (`/chat`), ringkasan kalkulasi keuangan dikirim melalui proksi aman Supabase Edge Function ke Google Gemini API (tier gratis) dengan persetujuan pengguna. Percakapan bersifat in-memory dan tidak pernah disimpan di database server aplikasi.

Data keuangan utama tersimpan di Google Drive Anda sendiri. Token OAuth disimpan di penyimpanan browser lokal dan dicabut saat keluar. Tanpa iklan.

## Persiapan GCP

1. Buat project di [Google Cloud Console](https://console.cloud.google.com/) dan aktifkan **Google Sheets API** & **Google Drive API**.
2. Konfigurasi OAuth consent screen (External), scopes: `email`, `profile`, `spreadsheets`, `drive.file`.
3. Buat kredensial **OAuth 2.0 Web Application**.
   - Authorized JS Origins: `http://localhost:5174` (atau `http://localhost:5173`)
   - Authorized Redirect URIs: `http://localhost:5174` (atau `http://localhost:5173`)
4. Salin **Client ID** (bukan secret) ke `.env.local`.

## Instalasi

```bash
git clone https://github.com/kingsusuputih/personal-finance-tracker.git
cd personal-finance-tracker
npm install
cp .env.example .env.local
```

Buka `.env.local` dan isi:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

Jalankan server pengembangan:

```bash
npm run dev
```

Buka `http://localhost:5174`.

## Build & Preview

```bash
npm run build
npm run preview
npm run check
```

## Deploy ke Vercel

1. Import repo ini ke [Vercel](https://vercel.com/).
2. Tambahkan env variable `VITE_GOOGLE_CLIENT_ID`.
3. Tambahkan production URL pada Authorized JS Origins & Redirect URIs di GCP.
4. Deploy. (SPA rewrite dan proxy registry/chat/notify sudah dikonfigurasi di `vercel.json`.)

### Konfigurasi Rahasia Supabase Edge Functions
Setel di **Supabase Dashboard → Edge Functions → Secrets**:
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID yang sama dengan frontend.
- `GEMINI_API_KEY`: API Key dari Google AI Studio.
- `GEMINI_MODEL`: Model Gemini yang digunakan (default: `gemini-3.5-flash-lite`).
- `VAPID_PUBLIC_KEY`: Kunci publik Web Push VAPID.
- `VAPID_PRIVATE_KEY`: Kunci privat Web Push VAPID.
- `VAPID_SUBJECT`: Alamat kontak mailto (misal `mailto:admin@example.com`).
- `CRON_SECRET`: Token rahasia internal untuk pemanggilan endpoint `/dispatch`.

## Rute

| Rute | Keterangan |
|---|---|
| `/` | Landing page dengan statistik komunitas |
| `/login` | Masuk dengan Google |
| `/dashboard` | Dasbor alokasi & target dana |
| `/recap` | Rekap bulanan historis & akumulasi investasi |
| `/ledger` | Pencatatan pemasukan & pengeluaran |
| `/chat` | Asisten Keuangan AI pintar |
| `/settings` | Pengaturan zona waktu & tanggal gajian |
| `/privacy` | Kebijakan Privasi |
| `/terms` | Ketentuan Layanan |
| `/changelog` | Catatan Rilis |

## Struktur Folder

```
src/
├── api/          # OAuth & Google Sheets/Drive helpers
├── components/   # UI, layout, form, dashboard components
├── constants/    # konfigurasi dan konten legal
├── hooks/        # useAuth, useSpreadsheet, useFinanceCalc
├── i18n/         # provider & terjemahan (id/en)
├── pages/        # Landing, Login, Dashboard, Ledger, Legal
├── store/        # Zustand stores
└── utils/        # fungsi murni (formula keuangan)
```

## Lisensi

[MIT](LICENSE) © 2026 [susuputih.psd](https://www.instagram.com/susuputih.psd/)