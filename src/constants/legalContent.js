const CONTACT_EMAIL = "harsa.aditya.ha@gmail.com";

export { CONTACT_EMAIL };

export const privacy = {
  en: [
    {
      title: "Overview",
      body: `Finance Tracker is a client-side web app with no backend server and no accounts on our infrastructure. The data you enter is written directly to a spreadsheet stored in your own Google Drive. This page explains what information the app handles and how.`,
    },
    {
      title: "What we handle",
      body: `When you sign in with Google, the app receives your Google account's basic profile (name, email address, and profile picture) to identify you and display who is signed in. Your income, expenses, and personal settings (time zone mode, IANA time zone, and monthly cutoff day) are stored in your own Google Drive spreadsheet (Finance_Tracker_Data). Transactions receive an ISO 8601 UTC creation timestamp; editing a transaction preserves its original creation timestamp.`,
    },
    {
      title: "Google permissions",
      body: `The app requests email, profile, spreadsheets, and drive.file OAuth permissions. These allow the app to authenticate you and manage the Finance_Tracker_Data spreadsheet. The drive.file scope limits Drive access to files created by or explicitly opened with the app — it cannot see, list, or modify other files in your Google Drive or access your Gmail messages.`,
    },
    {
      title: "Authentication tokens & local storage",
      body: `Your Google OAuth access token and basic profile are kept in your browser's local storage so your session survives page reloads. The token is transmitted directly to Google APIs and is never sent to or stored by any app-operated server. When you sign out, the local token and profile are cleared, and revocation is requested from Google.`,
    },
    {
      title: "Tracking periods & time zones",
      body: `Date defaults, tracking cycles, and transaction display times are calculated client-side according to your effective time zone (automatic browser detection or manual IANA selection) and monthly cutoff day (1–28, default: 25). These settings are stored in the Settings tab of your Google Sheet.`,
    },
    {
      title: "Third parties & analytics",
      body: `Beyond Google (Sign-in, Drive, and Sheets APIs), the app uses aggregate web analytics: Google Analytics (GA4) and Vercel Web Analytics. These services collect standard usage and device statistics under their respective privacy policies. Your financial records are stored only in your Google Sheet and are not sent to analytics services. The app does not run advertising.`,
    },
    {
      title: "Your control & deletion",
      body: `Because your data lives in your own Google Drive, you remain in full control. Delete the "Finance_Tracker_Data" spreadsheet from your Drive to erase all financial records and settings. Signing out clears local browser storage, and removing app access in your Google Account security settings prevents future sign-ins until reauthorized.`,
    },
    {
      title: "Contact",
      body: `Questions about this policy? Contact ${CONTACT_EMAIL}.`,
    },
    {
      title: "Changes",
      body: `If this policy changes, the updated version will be published on this page.`,
    },
  ],
  id: [
    {
      title: "Ringkasan",
      body: `Finance Tracker adalah aplikasi web sisi-klien tanpa server backend dan tanpa akun di infrastruktur kami. Data yang Anda masukkan ditulis langsung ke spreadsheet yang tersimpan di Google Drive Anda sendiri. Halaman ini menjelaskan informasi apa saja yang ditangani aplikasi dan bagaimana caranya.`,
    },
    {
      title: "Data yang kami tangani",
      body: `Saat Anda masuk dengan Google, aplikasi menerima profil dasar akun Google Anda (nama, alamat email, dan foto profil) untuk mengidentifikasi dan menampilkan siapa yang sedang masuk. Catatan pemasukan, pengeluaran, dan pengaturan pribadi Anda (mode zona waktu, zona waktu IANA, dan tanggal batas siklus bulanan) tersimpan di spreadsheet Google Drive Anda sendiri (Finance_Tracker_Data). Transaksi memiliki stempel waktu pembuatan ISO 8601 UTC; mengubah transaksi tetap mempertahankan stempel waktu aslinya.`,
    },
    {
      title: "Izin Google",
      body: `Aplikasi meminta izin OAuth email, profile, spreadsheets, dan drive.file. Izin ini digunakan untuk mengautentikasi Anda serta mengelola spreadsheet Finance_Tracker_Data. Cakupan drive.file membatasi akses Drive hanya pada file yang dibuat atau dibuka oleh aplikasi — aplikasi tidak dapat melihat, mendaftar, atau mengubah file lain di Google Drive Anda maupun mengakses email Gmail Anda.`,
    },
    {
      title: "Token autentikasi & penyimpanan lokal",
      body: `Token akses OAuth Google dan profil dasar Anda disimpan di penyimpanan lokal browser agar sesi Anda tetap aktif saat memuat ulang halaman. Token dikirim langsung ke API Google dan tidak pernah dikirim ke atau disimpan oleh server yang dioperasikan aplikasi. Saat Anda keluar, token dan profil lokal dihapus, serta pencabutan token dimintakan ke Google.`,
    },
    {
      title: "Periode pencatatan & zona waktu",
      body: `Tanggal default, siklus pencatatan, dan tampilan jam transaksi dihitung di sisi klien berdasarkan zona waktu efektif Anda (deteksi otomatis browser atau pilihan manual IANA) dan tanggal batas siklus bulanan (1–28, default: 25). Pengaturan ini tersimpan di tab Settings pada Google Sheet Anda.`,
    },
    {
      title: "Pihak ketiga & analitik",
      body: `Selain Google (API Sign-in, Drive, dan Sheets), aplikasi menggunakan analitik web agregat: Google Analytics (GA4) dan Vercel Web Analytics. Layanan ini mengumpulkan statistik penggunaan dan perangkat standar sesuai kebijakan privasi masing-masing. Catatan keuangan Anda hanya tersimpan di Google Sheet Anda dan tidak dikirim ke layanan analitik. Aplikasi tidak menjalankan iklan.`,
    },
    {
      title: "Kendali & penghapusan data Anda",
      body: `Karena data Anda tersimpan di Google Drive Anda sendiri, Anda memegang kendali penuh. Hapus spreadsheet "Finance_Tracker_Data" dari Drive Anda untuk menghapus seluruh catatan keuangan dan pengaturan. Keluar akan membersihkan penyimpanan lokal browser, dan menghapus akses aplikasi di pengaturan keamanan Akun Google Anda akan memblokir akses masuk sampai Anda mengotorisasinya kembali.`,
    },
    {
      title: "Kontak",
      body: `Punya pertanyaan tentang kebijakan ini? Hubungi ${CONTACT_EMAIL}.`,
    },
    {
      title: "Perubahan",
      body: `Jika kebijakan ini berubah, versi terbaru akan dipublikasikan di halaman ini.`,
    },
  ],
};

export const terms = {
  en: [
    {
      title: "Acceptance of terms",
      body: `By using Finance Tracker, you agree to these Terms of Service. If you do not agree, please do not use the app.`,
    },
    {
      title: "The service",
      body: `Finance Tracker is a free, serverless personal finance dashboard. It authenticates you with Google, creates and manages a spreadsheet in your Google Drive, and reads and writes your income, expense records, and tracking preferences directly to that spreadsheet. Calculations and tracking cycles follow your configured time zone and cutoff settings. The app is provided "as is" without any paid tier or hosted backend.`,
    },
    {
      title: "Your responsibilities",
      body: `You must have a valid Google account to use the app. You are responsible for the accuracy of the data you enter and for complying with Google's Terms of Service and applicable privacy laws regarding your own financial data.`,
    },
    {
      title: "Acceptable use",
      body: `Do not use the app to store unlawful material, attempt to interfere with the service, or access another person's spreadsheet.`,
    },
    {
      title: "No warranty",
      body: `The app is provided "as is" and "as available", without warranty of any kind — including fitness for a particular purpose or non-infringement. It is a tool for your own record-keeping; we do not guarantee it is error-free, uninterrupted, or a substitute for professional financial advice.`,
    },
    {
      title: "Limitation of liability",
      body: `To the maximum extent permitted by law, the Finance Tracker creator shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app. Because all data lives in your own Google account, you retain ownership of, and responsibility for, your records.`,
    },
    {
      title: "Termination & changes",
      body: `You may stop using the app at any time. We may update these terms from time to time; the latest version is always published on this page.`,
    },
    {
      title: "Contact",
      body: `Questions about these terms? Contact ${CONTACT_EMAIL}.`,
    },
  ],
  id: [
    {
      title: "Penerimaan ketentuan",
      body: `Dengan menggunakan Finance Tracker, Anda menyetujui Ketentuan Layanan ini. Jika Anda tidak setuju, mohon tidak menggunakan aplikasi ini.`,
    },
    {
      title: "Layanan",
      body: `Finance Tracker adalah dashboard keuangan pribadi gratis tanpa server. Aplikasi mengautentikasi Anda dengan Google, membuat dan mengelola spreadsheet di Google Drive Anda, serta membaca dan menulis catatan pemasukan, pengeluaran, dan preferensi pencatatan langsung ke spreadsheet tersebut. Perhitungan dan siklus pencatatan mengikuti pengaturan zona waktu dan tanggal batas Anda. Aplikasi disediakan "apa adanya" tanpa tier berbayar atau backend yang di-hosting.`,
    },
    {
      title: "Tanggung jawab Anda",
      body: `Anda harus memiliki akun Google yang valid untuk menggunakan aplikasi ini. Anda bertanggung jawab atas keakuratan data yang Anda masukkan dan atas kepatuhan terhadap Ketentuan Layanan Google serta hukum privasi yang berlaku sehubungan dengan data keuangan Anda sendiri.`,
    },
    {
      title: "Penggunaan yang dapat diterima",
      body: `Jangan gunakan aplikasi untuk menyimpan materi ilegal, mencoba mengganggu layanan, atau mengakses spreadsheet milik orang lain.`,
    },
    {
      title: "Tanpa jaminan",
      body: `Aplikasi disediakan "apa adanya" dan "sesuai ketersediaan", tanpa jaminan apa pun — termasuk kesesuaian untuk tujuan tertentu atau tidak melanggar hak pihak lain. Ini adalah alat pencatatan pribadi; kami tidak menjamin aplikasi bebas dari kesalahan, berjalan tanpa gangguan, atau merupakan pengganti nasihat keuangan profesional.`,
    },
    {
      title: "Batasan tanggung jawab",
      body: `Sejauh yang diizinkan hukum, pembuat Finance Tracker tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan aplikasi. Karena semua data tersimpan di akun Google Anda sendiri, Anda tetap memiliki dan bertanggung jawab atas catatan Anda.`,
    },
    {
      title: "Penghentian & perubahan",
      body: `Anda dapat berhenti menggunakan aplikasi kapan saja. Kami dapat memperbarui ketentuan ini dari waktu ke waktu; versi terbaru selalu dipublikasikan di halaman ini.`,
    },
    {
      title: "Kontak",
      body: `Punya pertanyaan tentang ketentuan ini? Hubungi ${CONTACT_EMAIL}.`,
    },
  ],
};
