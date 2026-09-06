const CONTACT_EMAIL = "harsa.aditya.ha@gmail.com";

export { CONTACT_EMAIL };

export const privacy = {
  en: [
    {
      title: "Overview",
      body: `Finance Tracker is a personal finance app where your income and expense records are written directly to a spreadsheet stored in your own Google Drive. A minimal pseudonymous user registry is maintained on Supabase (Singapore region) solely to count unique users and optionally display masked names with your consent. This page explains what information the app handles and how.`,
    },
    {
      title: "What we handle",
      body: `When you sign in with Google, the app receives your Google account's basic profile (name, email address, and profile picture) to identify you and display who is signed in. Your financial entries (income, expenses, and personal tracking settings) are stored solely in your own Google Drive spreadsheet (Finance_Tracker_Data). Transactions receive an ISO 8601 UTC creation timestamp; editing a transaction preserves its original timestamp.`,
    },
    {
      title: "User registry & community proof",
      body: `To track the total number of users who use Finance Tracker, a one-way cryptographic hash of your Google account identifier (HMAC-SHA-256) is recorded in a private database hosted on Supabase (Singapore region). We never store your email, password, or financial records in this database. If you explicitly opt in, a masked version of your name (e.g. H*** A***) may be displayed on the landing page community updates. You can change this preference or delete your registry record at any time in Settings.`,
    },
    {
      title: "Google permissions",
      body: `The app requests email, profile, spreadsheets, and drive.file OAuth permissions. These allow the app to authenticate you and manage the Finance_Tracker_Data spreadsheet. The drive.file scope limits Drive access to files created by or explicitly opened with the app — it cannot see, list, or modify other files in your Google Drive or access your Gmail messages.`,
    },
    {
      title: "Authentication tokens & local storage",
      body: `Your Google OAuth access token and basic profile are kept in your browser's local storage so your session survives page reloads. The token is transmitted directly to Google APIs and is never stored on any app-operated server. When you sign out, the local token and profile are cleared, and revocation is requested from Google.`,
    },
    {
      title: "Tracking periods & time zones",
      body: `Date defaults, tracking cycles, and transaction display times are calculated client-side according to your effective time zone (automatic browser detection or manual IANA selection) and monthly cutoff day (1–28, default: 25). These settings are stored in the Settings tab of your Google Sheet.`,
    },
    {
      title: "Third parties & analytics",
      body: `Third-party services used by the app include Google (Sign-in, Drive, and Sheets APIs), Supabase (Singapore region, for unique user registry and public community count), and web analytics (Vercel Web Analytics and Google Analytics). These services operate under their respective privacy policies. Your financial records are stored only in your Google Sheet and are never transmitted to analytics or registry services. The app does not run advertising.`,
    },
    {
      title: "Your control & deletion",
      body: `Because your financial data lives in your own Google Drive, you remain in full control. Delete the "Finance_Tracker_Data" spreadsheet from your Drive to erase all financial records and settings. You can delete your pseudonymous registry record in the app Settings. Signing out clears local browser storage, and removing app access in your Google Account security settings prevents future sign-ins until reauthorized.`,
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
      body: `Finance Tracker adalah aplikasi keuangan pribadi di mana catatan pemasukan dan pengeluaran Anda ditulis langsung ke spreadsheet yang tersimpan di Google Drive Anda sendiri. Registry pengguna pseudonim minimal dikelola di Supabase (wilayah Singapura) semata-mata untuk menghitung pengguna unik dan secara opsional menampilkan nama tersamarkan atas persetujuan Anda. Halaman ini menjelaskan informasi apa saja yang ditangani aplikasi dan bagaimana caranya.`,
    },
    {
      title: "Data yang kami tangani",
      body: `Saat Anda masuk dengan Google, aplikasi menerima profil dasar akun Google Anda (nama, alamat email, dan foto profil) untuk mengidentifikasi dan menampilkan siapa yang sedang masuk. Catatan keuangan Anda (pemasukan, pengeluaran, dan pengaturan siklus) tersimpan hanya di spreadsheet Google Drive Anda sendiri (Finance_Tracker_Data). Transaksi memiliki stempel waktu pembuatan ISO 8601 UTC; mengubah transaksi tetap mempertahankan stempel waktu aslinya.`,
    },
    {
      title: "Registry pengguna & bukti sosial komunitas",
      body: `Untuk mencatat jumlah pengguna yang menggunakan Finance Tracker, hash kriptografi satu arah dari ID akun Google Anda (HMAC-SHA-256) dicatat di database privat yang di-hosting di Supabase (wilayah Singapura). Kami tidak pernah menyimpan email, kata sandi, atau data keuangan Anda di database ini. Jika Anda secara eksplisit setuju, nama Anda dalam format tersamarkan (mis. H*** A***) dapat ditampilkan pada pembaruan komunitas di landing page. Anda dapat mengubah pilihan ini atau menghapus data registry Anda kapan saja di Pengaturan.`,
    },
    {
      title: "Izin Google",
      body: `Aplikasi meminta izin OAuth email, profile, spreadsheets, dan drive.file. Izin ini digunakan untuk mengautentikasi Anda serta mengelola spreadsheet Finance_Tracker_Data. Cakupan drive.file membatasi akses Drive hanya pada file yang dibuat atau dibuka oleh aplikasi — aplikasi tidak dapat melihat, mendaftar, atau mengubah file lain di Google Drive Anda maupun mengakses email Gmail Anda.`,
    },
    {
      title: "Token autentikasi & penyimpanan lokal",
      body: `Token akses OAuth Google dan profil dasar Anda disimpan di penyimpanan lokal browser agar sesi Anda tetap aktif saat memuat ulang halaman. Token dikirim langsung ke API Google dan tidak pernah disimpan di server yang dioperasikan aplikasi. Saat Anda keluar, token dan profil lokal dihapus, serta pencabutan token dimintakan ke Google.`,
    },
    {
      title: "Periode pencatatan & zona waktu",
      body: `Tanggal default, siklus pencatatan, dan tampilan jam transaksi dihitung di sisi klien berdasarkan zona waktu efektif Anda (deteksi otomatis browser atau pilihan manual IANA) dan tanggal batas siklus bulanan (1–28, default: 25). Pengaturan ini tersimpan di tab Settings pada Google Sheet Anda.`,
    },
    {
      title: "Pihak ketiga & analitik",
      body: `Pihak ketiga yang digunakan meliputi Google (API Sign-in, Drive, dan Sheets), Supabase (wilayah Singapura, untuk registry pengguna dan hitungan komunitas), serta analitik web (Vercel Web Analytics dan Google Analytics). Layanan ini beroperasi sesuai kebijakan privasi masing-masing. Catatan keuangan Anda hanya tersimpan di Google Sheet Anda dan tidak dikirim ke layanan registry maupun analitik. Aplikasi tidak menjalankan iklan.`,
    },
    {
      title: "Kendali & penghapusan data Anda",
      body: `Karena data keuangan Anda tersimpan di Google Drive Anda sendiri, Anda memegang kendali penuh. Hapus spreadsheet "Finance_Tracker_Data" dari Drive Anda untuk menghapus seluruh catatan keuangan dan pengaturan. Anda dapat menghapus data registry Anda di menu Pengaturan. Keluar akan membersihkan penyimpanan lokal browser, dan menghapus akses aplikasi di pengaturan keamanan Akun Google Anda akan memblokir akses masuk sampai Anda mengotorisasinya kembali.`,
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
      body: `Finance Tracker is a personal finance tool. It authenticates you with Google, creates and manages a spreadsheet in your Google Drive, and reads and writes your income, expense records, and tracking preferences directly to that spreadsheet. A pseudonymous registry records unique users on Supabase (Singapore region) to provide community metrics, and optional masked names may appear in community social proof. The app is provided "as is" without financial advisory representations.`,
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
      body: `Finance Tracker adalah alat pencatatan keuangan pribadi. Aplikasi mengautentikasi Anda dengan Google, membuat dan mengelola spreadsheet di Google Drive Anda, serta membaca dan menulis catatan pemasukan, pengeluaran, dan preferensi pencatatan langsung ke spreadsheet tersebut. Registry pseudonim mencatat pengguna unik di Supabase (wilayah Singapura) untuk menyajikan metrik komunitas, dan nama tersamarkan dapat ditampilkan pada bukti sosial komunitas atas persetujuan Anda. Aplikasi disediakan "apa adanya" tanpa representasi nasihat keuangan.`,
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
