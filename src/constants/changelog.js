export const changelogEntries = [
  {
    version: "v1.2.0",
    date: "2026-09-06",
    en: {
      title: "Custom Payday Cycle, Timezone Settings & Community Social Proof",
      items: [
        "Configurable monthly payday cutoff day (1–28, default: 25) with automatic cycle date range calculation.",
        "Automatic browser timezone detection with manual IANA selection saved directly to Google Sheets.",
        "Transactions now chronologically ordered by creation timestamp, with localized time display.",
        "Pseudonymous user registry via Supabase (Singapore region) with live user counter on the landing page.",
        "Optional community social proof toast with H*** A*** name masking and settings controls to opt out or delete registry data.",
      ],
    },
    id: {
      title: "Siklus Gajian Kustom, Pengaturan Zona Waktu & Bukti Sosial Komunitas",
      items: [
        "Tanggal batas gajian bulanan yang dapat diatur (1–28, bawaan: 25) beserta perhitungan rentang tanggal siklus otomatis.",
        "Deteksi zona waktu browser otomatis dengan opsi pemilihan IANA manual yang tersimpan di Google Sheets.",
        "Pengurutan transaksi kini berurutan berdasarkan waktu pembuatan (created_at), disertai tampilan jam lokal.",
        "Registry pengguna pseudonim melalui Supabase (wilayah Singapura) dengan penghitung pengguna langsung di landing page.",
        "Notifikasi bukti sosial komunitas opsional dengan penyamaran nama H*** A*** serta kendali di Pengaturan untuk keluar atau menghapus data pendaftaran.",
      ],
    },
  },
  {
    version: "v1.1.0",
    date: "2026-09-06",
    en: {
      title: "Privacy Toggles for Dashboard Amounts",
      items: [
        "Added independent visibility toggles to hide or show monthly income and monthly expenses on the dashboard.",
        "Default state is hidden for privacy upon each page load.",
        "Masking extends to 50 / 30 / 20 allocation targets, fund targets, and category spending chart amounts.",
      ],
    },
    id: {
      title: "Privasi Nominal Dasbor",
      items: [
        "Menambahkan tombol privasi terpisah untuk menyembunyikan atau menampilkan pemasukan dan pengeluaran di dasbor.",
        "Default nominal tersembunyi demi privasi setiap kali halaman dimuat.",
        "Penyamaran nominal berlaku juga untuk target alokasi 50 / 30 / 20, target dana, dan rincian nominal grafik pengeluaran.",
      ],
    },
  },
  {
    version: "v1.0.0",
    date: "2026-08-16",
    en: {
      title: "Initial Release",
      items: [
        "Sign in with Google OAuth without creating a separate account.",
        "Automatic provisioning and direct storage in your own Google Drive spreadsheet (Finance_Tracker_Data).",
        "Ledger to record and manage monthly income and categorized daily expenses.",
        "Automatic 50 / 30 / 20 budget breakdown and emergency and retirement fund targets.",
        "Interactive spending distribution donut chart powered by Apache ECharts.",
        "Bilingual interface supporting English and Bahasa Indonesia.",
      ],
    },
    id: {
      title: "Rilis Perdana",
      items: [
        "Masuk dengan Google OAuth tanpa perlu membuat akun terpisah.",
        "Pembuatan otomatis dan penyimpanan data langsung di Google Drive Anda (Finance_Tracker_Data).",
        "Buku Besar untuk mencatat dan mengelola pemasukan bulanan serta pengeluaran harian berkategori.",
        "Perhitungan otomatis alokasi 50 / 30 / 20 serta target dana darurat dan pensiun.",
        "Grafik donat pengeluaran interaktif menggunakan Apache ECharts.",
        "Antarmuka bilingual dengan dukungan Bahasa Indonesia dan Bahasa Inggris.",
      ],
    },
  },
];
