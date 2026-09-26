export const changelogEntries = [
  {
    version: "v1.4.0",
    date: "2026-09-27",
    en: {
      title: "Custom Budgets, Device Push Notifications & Multi-period AI Analysis",
      sections: [
        {
          type: "added",
          label: "Added",
          items: [
            "Manual custom budgets per expense group and category for each payday cycle with real-time progress indicators.",
            "Web Push notifications for custom budget alert thresholds (80%, 100%, and >100%) with 3-hour recurring reminders and quiet hours (22:00–07:00).",
            "Progressive Web App (PWA) manifest and background service worker support for home screen installation and alerts.",
            "Multi-period context support in AI Assistant (/chat), enabling analysis and comparisons across historical cycles via a dedicated cycle selector.",
            "Rich markdown bold text rendering in AI chat responses.",
          ],
        },
        {
          type: "changed",
          label: "Changed",
          items: [
            "Google Sheets schema expanded with a dedicated 5th sheet ('Budgets') for cycle budget caps.",
            "AI Assistant backend updated to Google Gemini 3.5 Flash-Lite with configurable GEMINI_MODEL support.",
            "Updated Privacy Policy and Terms of Service with budget push notification disclosures.",
          ],
        },
      ],
      items: [
        "Manual custom budgets per expense group and category for each payday cycle with real-time progress indicators.",
        "Web Push notifications for custom budget alert thresholds (80%, 100%, and >100%) with 3-hour recurring reminders and quiet hours (22:00–07:00).",
        "Progressive Web App (PWA) manifest and background service worker support for home screen installation and alerts.",
        "Multi-period context support in AI Assistant (/chat), enabling analysis and comparisons across historical cycles via a dedicated cycle selector.",
        "Rich markdown bold text rendering in AI chat responses.",
        "Google Sheets schema expanded with a dedicated 5th sheet ('Budgets') for cycle budget caps.",
        "AI Assistant backend updated to Google Gemini 3.5 Flash-Lite with configurable GEMINI_MODEL support.",
        "Updated Privacy Policy and Terms of Service with budget push notification disclosures.",
      ],
    },
    id: {
      title: "Budget Custom, Notifikasi Push di HP & Analisis Multi-periode AI",
      sections: [
        {
          type: "added",
          label: "Fitur Baru (Added)",
          items: [
            "Pencatatan budget custom manual per kelompok pengeluaran dan kategori untuk setiap siklus gajian dengan indikator progres pemakaian langsung.",
            "Notifikasi Web Push di HP untuk ambang batas budget (80%, 100%, dan >100%) dengan pengingat tiap 3 jam di luar jam tenang (22.00–07.00).",
            "Dukungan Progressive Web App (PWA) lengkap dengan manifest dan service worker untuk instalasi di Home Screen dan notifikasi latar belakang.",
            "Dukungan konteks multi-periode pada Asisten AI (/chat), memungkinkan analisa dan perbandingan antarperiode historis melalui pemilih periode.",
            "Rendering format teks tebal (bold markdown) pada respons chat AI.",
          ],
        },
        {
          type: "changed",
          label: "Perubahan (Changed)",
          items: [
            "Skema Google Sheets diperluas dengan tab ke-5 ('Budgets') untuk menyimpan batas budget per siklus.",
            "Backend Asisten AI diperbarui ke model Google Gemini 3.5 Flash-Lite dengan dukungan konfigurasi GEMINI_MODEL.",
            "Pembaruan Kebijakan Privasi dan Ketentuan Layanan dengan penjelasan notifikasi push budget.",
          ],
        },
      ],
      items: [
        "Pencatatan budget custom manual per kelompok pengeluaran dan kategori untuk setiap siklus gajian dengan indikator progres pemakaian langsung.",
        "Notifikasi Web Push di HP untuk ambang batas budget (80%, 100%, dan >100%) dengan pengingat tiap 3 jam di luar jam tenang (22.00–07.00).",
        "Dukungan Progressive Web App (PWA) lengkap dengan manifest dan service worker untuk instalasi di Home Screen dan notifikasi latar belakang.",
        "Dukungan konteks multi-periode pada Asisten AI (/chat), memungkinkan analisa dan perbandingan antarperiode historis melalui pemilih periode.",
        "Rendering format teks tebal (bold markdown) pada respons chat AI.",
        "Skema Google Sheets diperluas dengan tab ke-5 ('Budgets') untuk menyimpan batas budget per siklus.",
        "Backend Asisten AI diperbarui ke model Google Gemini 3.5 Flash-Lite dengan dukungan konfigurasi GEMINI_MODEL.",
        "Pembaruan Kebijakan Privasi dan Ketentuan Layanan dengan penjelasan notifikasi push budget.",
      ],
    },
  },
  {
    version: "v1.3.0",
    date: "2026-09-26",
    en: {
      title: "Historical Recap, Additional Income, Smart Grouping & AI Chatbot",
      sections: [
        {
          type: "added",
          label: "Added",
          items: [
            "Historical monthly recap page (/recap) based on configurable payday cycles with period surplus/deficit indicators.",
            "Clear separation of consumption expenses vs. investment contributions, showing remaining unspent income available to save or invest.",
            "Cumulative savings & investment tracker accumulating all historical Investment entries up to the active cycle cutoff.",
            "Separate Additional Income recording in Ledger for bonuses, freelance side jobs, and gig income without overwriting main salary.",
            "Automatic keyword-based item grouping within expense categories (e.g. Cigarettes, Coffee) with manual per-transaction overrides.",
            "Smart AI Financial Assistant (/chat) using Google Gemini 1.5 Flash (free tier) for financial query analysis and interactive transaction drafting.",
            "Interactive transaction proposal cards allowing user editing and explicit confirmation before appending rows to Google Sheets.",
            "Automated AI quota warnings and cooldown countdown timer when rate limits or quotas are reached; strictly no paid fallback.",
          ],
        },
        {
          type: "changed",
          label: "Changed",
          items: [
            "Strict documentation and history synchronization policy enforced in PRD.",
            "Updated Privacy Policy and Terms of Service with AI Assistant and automated grouping disclosures.",
          ],
        },
      ],
      items: [
        "Historical monthly recap page (/recap) based on configurable payday cycles with period surplus/deficit indicators.",
        "Clear separation of consumption expenses vs. investment contributions, showing remaining unspent income available to save or invest.",
        "Cumulative savings & investment tracker accumulating all historical Investment entries up to the active cycle cutoff.",
        "Separate Additional Income recording in Ledger for bonuses, freelance side jobs, and gig income without overwriting main salary.",
        "Automatic keyword-based item grouping within expense categories (e.g. Cigarettes, Coffee) with manual per-transaction overrides.",
        "Smart AI Financial Assistant (/chat) using Google Gemini 1.5 Flash (free tier) for financial query analysis and interactive transaction drafting.",
        "Interactive transaction proposal cards allowing user editing and explicit confirmation before appending rows to Google Sheets.",
        "Automated AI quota warnings and cooldown countdown timer when rate limits or quotas are reached; strictly no paid fallback.",
        "Strict documentation and history synchronization policy enforced in PRD.",
      ],
    },
    id: {
      title: "Rekap Historis, Pemasukan Tambahan, Pengelompokan Otomatis & Chatbot AI",
      sections: [
        {
          type: "added",
          label: "Fitur Baru (Added)",
          items: [
            "Halaman rekap bulanan historis (/recap) berbasis siklus gajian dengan indikator surplus/defisit pengeluaran terhadap pemasukan.",
            "Pemisahan jelas antara pengeluaran konsumsi dan alokasi investasi, menampilkan sisa uang yang belum terpakai untuk ditabung/diinvestasikan.",
            "Pelacak akumulasi uang yang sudah ditabung & investasi dari seluruh riwayat kategori Investment sampai batas siklus terkait.",
            "Pencatatan Pemasukan Tambahan terpisah di Buku Besar (bonus, side job, ngojek) tanpa menimpa gaji utama.",
            "Pengelompokan otomatis pengeluaran per kategori berdasarkan kata kunci deskripsi (mis. Rokok, Kopi) dengan opsi override manual per transaksi.",
            "Asisten Keuangan AI pintar (/chat) bertenaga Google Gemini 1.5 Flash (tier gratis) untuk analisis keuangan dan pembuatan draf transaksi.",
            "Kartu usulan transaksi interaktif yang dapat ditinjau dan diedit pengguna sebelum dikonfirmasi dan disimpan ke Google Sheet.",
            "Pemberitahuan otomatis batas kuota AI dan timer hitung mundur cooldown saat limit tercapai; tanpa fallback berbayar.",
          ],
        },
        {
          type: "changed",
          label: "Perubahan (Changed)",
          items: [
            "Kebijakan wajib sinkronisasi dokumentasi dan riwayat perubahan yang ditegaskan di PRD.",
            "Pembaruan Kebijakan Privasi dan Ketentuan Layanan dengan penjelasan Asisten AI dan pengelompokan otomatis.",
          ],
        },
      ],
      items: [
        "Halaman rekap bulanan historis (/recap) berbasis siklus gajian dengan indikator surplus/defisit pengeluaran terhadap pemasukan.",
        "Pemisahan jelas antara pengeluaran konsumsi dan alokasi investasi, menampilkan sisa uang yang belum terpakai untuk ditabung/diinvestasikan.",
        "Pelacak akumulasi uang yang sudah ditabung & investasi dari seluruh riwayat kategori Investment sampai batas siklus terkait.",
        "Pencatatan Pemasukan Tambahan terpisah di Buku Besar (bonus, side job, ngojek) tanpa menimpa gaji utama.",
        "Pengelompokan otomatis pengeluaran per kategori berdasarkan kata kunci deskripsi (mis. Rokok, Kopi) dengan opsi override manual per transaksi.",
        "Asisten Keuangan AI pintar (/chat) bertenaga Google Gemini 1.5 Flash (tier gratis) untuk analisis keuangan dan pembuatan draf transaksi.",
        "Kartu usulan transaksi interaktif yang dapat ditinjau dan diedit pengguna sebelum dikonfirmasi dan disimpan ke Google Sheet.",
        "Pemberitahuan otomatis batas kuota AI dan timer hitung mundur cooldown saat limit tercapai; tanpa fallback berbayar.",
        "Kebijakan wajib sinkronisasi dokumentasi dan riwayat perubahan yang ditegaskan di PRD.",
      ],
    },
  },
  {
    version: "v1.2.0",
    date: "2026-09-06",
    en: {
      title: "Custom Payday Cycle, Timezone Settings & Community Social Proof",
      sections: [
        {
          type: "added",
          label: "Added",
          items: [
            "Configurable monthly payday cutoff day (1–28, default: 25) with automatic cycle date range calculation.",
            "Automatic browser timezone detection with manual IANA selection saved directly to Google Sheets.",
            "Pseudonymous user registry via Supabase (Singapore region) with live user counter on the landing page.",
            "Optional community social proof toast with H*** A*** name masking and settings controls to opt out or delete registry data.",
          ],
        },
        {
          type: "changed",
          label: "Changed",
          items: [
            "Transactions now chronologically ordered by creation timestamp, with localized time display.",
          ],
        },
      ],
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
      sections: [
        {
          type: "added",
          label: "Fitur Baru (Added)",
          items: [
            "Tanggal batas gajian bulanan yang dapat diatur (1–28, bawaan: 25) beserta perhitungan rentang tanggal siklus otomatis.",
            "Deteksi zona waktu browser otomatis dengan opsi pemilihan IANA manual yang tersimpan di Google Sheets.",
            "Registry pengguna pseudonim melalui Supabase (wilayah Singapura) dengan penghitung pengguna langsung di landing page.",
            "Notifikasi bukti sosial komunitas opsional dengan penyamaran nama H*** A*** serta kendali di Pengaturan untuk keluar atau menghapus data pendaftaran.",
          ],
        },
        {
          type: "changed",
          label: "Perubahan (Changed)",
          items: [
            "Pengurutan transaksi kini berurutan berdasarkan waktu pembuatan (created_at), disertai tampilan jam lokal.",
          ],
        },
      ],
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
      sections: [
        {
          type: "added",
          label: "Added",
          items: [
            "Added independent visibility toggles to hide or show monthly income and monthly expenses on the dashboard.",
            "Default state is hidden for privacy upon each page load.",
            "Masking extends to 50 / 30 / 20 allocation targets, fund targets, and category spending chart amounts.",
          ],
        },
      ],
      items: [
        "Added independent visibility toggles to hide or show monthly income and monthly expenses on the dashboard.",
        "Default state is hidden for privacy upon each page load.",
        "Masking extends to 50 / 30 / 20 allocation targets, fund targets, and category spending chart amounts.",
      ],
    },
    id: {
      title: "Privasi Nominal Dasbor",
      sections: [
        {
          type: "added",
          label: "Fitur Baru (Added)",
          items: [
            "Menambahkan tombol privasi terpisah untuk menyembunyikan atau menampilkan pemasukan dan pengeluaran di dasbor.",
            "Default nominal tersembunyi demi privasi setiap kali halaman dimuat.",
            "Penyamaran nominal berlaku juga untuk target alokasi 50 / 30 / 20, target dana, dan rincian nominal grafik pengeluaran.",
          ],
        },
      ],
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
      sections: [
        {
          type: "added",
          label: "Added",
          items: [
            "Sign in with Google OAuth without creating a separate account.",
            "Automatic provisioning and direct storage in your own Google Drive spreadsheet (Finance_Tracker_Data).",
            "Ledger to record and manage monthly income and categorized daily expenses.",
            "Automatic 50 / 30 / 20 budget breakdown and emergency and retirement fund targets.",
            "Interactive spending distribution donut chart powered by Apache ECharts.",
            "Bilingual interface supporting English and Bahasa Indonesia.",
          ],
        },
      ],
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
      sections: [
        {
          type: "added",
          label: "Fitur Baru (Added)",
          items: [
            "Masuk dengan Google OAuth tanpa perlu membuat akun terpisah.",
            "Pembuatan otomatis dan penyimpanan data langsung di Google Drive Anda (Finance_Tracker_Data).",
            "Buku Besar untuk mencatat dan mengelola pemasukan bulanan serta pengeluaran harian berkategori.",
            "Perhitungan otomatis alokasi 50 / 30 / 20 serta target dana darurat dan pensiun.",
            "Grafik donat pengeluaran interaktif menggunakan Apache ECharts.",
            "Antarmuka bilingual dengan dukungan Bahasa Indonesia dan Bahasa Inggris.",
          ],
        },
      ],
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
