<a href="https://github.com/kingsusuputih/personal-finance-tracker">
  <img src="public/favicon.svg" width="48" alt="Finance Tracker logo" />
</a>

# Finance Tracker

Dashboard keuangan pribadi, gratis — data tersimpan di Google Drive Anda sendiri.

Finance Tracker adalah aplikasi web serverless (SPA) untuk mencatat pemasukan dan pengeluaran serta menghitung target keuangan, tanpa backend dan tanpa biaya. Setiap pengguna masuk dengan akun Google miliknya; aplikasi membuat spreadsheet `Finance_Tracker_Data` otomatis di Google Drive pengguna dan menulis semua data langsung ke spreadsheet tersebut. Tidak ada server pihak ketiga yang menyimpan data Anda.

## Fitur

- Masuk dengan Google (OAuth 2.0 PKCE — tanpa client secret)
- Spreadsheet otomatis dibuat di Google Drive Anda (`drive.file` scope, hanya file yang dibuat aplikasi)
- Mencatat pemasukan bulanan dan pengeluaran harian per kategori
- Alokasi 50 / 30 / 20 (Kebutuhan 50%, Investasi 30%, Gaya Hidup 20%)
- Target dana: Dana Darurat 6× dan Dana Pensiun 300× pengeluaran bulanan
- Grafik pengeluaran per kategori (Apache ECharts)
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
| Autentikasi | @react-oauth/google (PKCE) |
| Database | Google Sheets API v4 (di Drive pengguna) |
| Analytics | @vercel/analytics · Google Analytics |
| Deployment | Vercel |

## Cara Kerja & Privasi

1. Pengguna masuk dengan akun Google via PKCE.
2. Aplikasi mencari/membuat spreadsheet `Finance_Tracker_Data` di Google Drive pengguna.
3. Pemasukan & pengeluaran ditulis langsung ke spreadsheet tersebut.
4. Semua perhitungan (50/30/20, target dana) dilakukan di sisi klien.

Aplikasi hanya meminta scope minimal `drive.file` — tidak dapat mengakses file lain di Drive, email, atau data Google lain. Token OAuth disimpan sementara dan dicabut saat keluar. Tanpa backend, tanpa iklan.

## Persiapan GCP

1. Buat project di [Google Cloud Console](https://console.cloud.google.com/) dan aktifkan **Google Sheets API** & **Google Drive API**.
2. Konfigurasi OAuth consent screen (External), scopes: `email`, `profile`, `spreadsheets`, `drive.file`.
3. Buat kredensial **OAuth 2.0 Web Application**.
   - Authorized JS Origins: `http://localhost:5173`
   - Authorized Redirect URIs: `http://localhost:5173`
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

Buka `http://localhost:5173`.

## Build & Preview

```bash
npm run build
npm run preview
```

## Deploy ke Vercel

1. Import repo ini ke [Vercel](https://vercel.com/).
2. Tambahkan env variable `VITE_GOOGLE_CLIENT_ID`.
3. Tambahkan production URL pada Authorized JS Origins & Redirect URIs di GCP.
4. Deploy. (SPA rewrite sudah dikonfigurasi di `vercel.json`.)

## Rute

| Rute | Keterangan |
|---|---|
| `/` | Landing page |
| `/login` | Masuk dengan Google |
| `/dashboard` | Dasbor alokasi & target dana |
| `/ledger` | Pencatatan pemasukan & pengeluaran |
| `/privacy` | Kebijakan Privasi |
| `/terms` | Ketentuan Layanan |

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