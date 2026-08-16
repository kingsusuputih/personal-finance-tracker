const CONTACT_EMAIL = 'harsa.aditya.ha@gmail.com'

export { CONTACT_EMAIL }

export const privacy = {
  en: [
    {
      title: 'Overview',
      body: `Finance Tracker is a client-side web app with no backend server and no accounts on our infrastructure. The data you enter is written to a spreadsheet stored in your own Google Drive. This page explains what information the app handles and how.`,
    },
    {
      title: 'What we handle',
      body: `When you sign in with Google, the app receives your Google account's basic profile (name, email address, and profile picture) to show who is signed in. Your income and expense records are stored on your side: in a Google Spreadsheet that the app creates inside your Google Drive.`,
    },
    {
      title: 'Limited access to your Google Drive',
      body: `The app requests only the drive.file OAuth scope. That scope lets the app create and read a single spreadsheet it created itself — it cannot see, list, or modify any other file in your Drive, your emails, or any other Google service data.`,
    },
    {
      title: 'Authentication tokens',
      body: `A Google OAuth access token is kept in the browser (local storage) so your session survives a page refresh. It is used only to talk to the Google Sheets API and is revoked when you sign out. We do not transmit or store tokens on any server.`,
    },
    {
      title: 'Third parties & analytics',
      body: `The only third party involved is Google, as the provider of Sign-in, Drive, and Sheets. The app does not run analytics, advertising, or tracking scripts, and does not sell or rent your data.`,
    },
    {
      title: 'Your control & deletion',
      body: `Because your data lives in your own Google Drive, you remain in full control. Delete the "Finance_Tracker_Data" spreadsheet from your Drive to erase all entered data. Removing app access in your Google Account settings prevents future sign-ins.`,
    },
    {
      title: 'Contact',
      body: `Questions about this policy? Contact ${CONTACT_EMAIL}.`,
    },
    {
      title: 'Changes',
      body: `If this policy changes, the updated version will be published on this page.`,
    },
  ],
  id: [
    {
      title: 'Ringkasan',
      body: `Finance Tracker adalah aplikasi web sisi-klien tanpa server backend dan tanpa akun di infrastruktur kami. Data yang Anda masukkan ditulis ke spreadsheet yang tersimpan di Google Drive Anda sendiri. Halaman ini menjelaskan informasi apa saja yang ditangani aplikasi dan bagaimana caranya.`,
    },
    {
      title: 'Data yang kami tangani',
      body: `Saat Anda masuk dengan Google, aplikasi menerima profil dasar akun Google Anda (nama, alamat email, dan foto profil) untuk menampilkan siapa yang sedang masuk. Catatan pemasukan dan pengeluaran Anda tersimpan di sisi Anda: di Google Spreadsheet yang dibuat aplikasi di dalam Google Drive Anda.`,
    },
    {
      title: 'Akses terbatas ke Google Drive Anda',
      body: `Aplikasi hanya meminta cakupan OAuth drive.file. Cakupan itu hanya mengizinkan aplikasi membuat dan membaca satu spreadsheet yang dibuatnya sendiri — aplikasi tidak dapat melihat, mendaftar, atau mengubah file lain di Drive Anda, email Anda, atau data layanan Google lainnya.`,
    },
    {
      title: 'Token autentikasi',
      body: `Token akses OAuth Google disimpan di browser (local storage) agar sesi Anda tetap hidup setelah halaman dimuat ulang. Token hanya dipakai untuk berkomunikasi dengan Google Sheets API dan dicabut saat Anda keluar. Kami tidak mengirim atau menyimpan token di server mana pun.`,
    },
    {
      title: 'Pihak ketiga & analitik',
      body: `Satu-satunya pihak ketiga yang terlibat adalah Google, sebagai penyedia Sign-in, Drive, dan Sheets. Aplikasi tidak menjalankan skrip analitik, iklan, atau pelacakan, dan tidak menjual atau menyewakan data Anda.`,
    },
    {
      title: 'Kendali & penghapusan data Anda',
      body: `Karena data Anda tersimpan di Google Drive Anda sendiri, Anda tetap memegang kendali penuh. Hapus spreadsheet "Finance_Tracker_Data" dari Drive Anda untuk menghapus semua data yang dimasukkan. Hapus akses aplikasi di pengaturan Akun Google Anda untuk mencegah masuk kembali.`,
    },
    {
      title: 'Kontak',
      body: `Punya pertanyaan tentang kebijakan ini? Hubungi ${CONTACT_EMAIL}.`,
    },
    {
      title: 'Perubahan',
      body: `Jika kebijakan ini berubah, versi terbaru akan dipublikasikan di halaman ini.`,
    },
  ],
}

export const terms = {
  en: [
    {
      title: 'Acceptance of terms',
      body: `By using Finance Tracker, you agree to these Terms of Service. If you do not agree, please do not use the app.`,
    },
    {
      title: 'The service',
      body: `Finance Tracker is a free, serverless personal finance dashboard. It authenticates you with Google, creates a spreadsheet in your Google Drive, and reads and writes your income and expense records directly to that spreadsheet. The app is provided "as is" without any paid tier or hosted backend.`,
    },
    {
      title: 'Your responsibilities',
      body: `You must have a valid Google account to use the app. You are responsible for the accuracy of the data you enter and for complying with Google's Terms of Service and applicable privacy laws regarding your own financial data.`,
    },
    {
      title: 'Acceptable use',
      body: `Do not use the app to store unlawful material, attempt to interfere with the service, or access another person's spreadsheet.`,
    },
    {
      title: 'No warranty',
      body: `The app is provided "as is" and "as available", without warranty of any kind — including fitness for a particular purpose or non-infringement. It is a tool for your own record-keeping; we do not guarantee it is error-free, uninterrupted, or a substitute for professional financial advice.`,
    },
    {
      title: 'Limitation of liability',
      body: `To the maximum extent permitted by law, the Finance Tracker creator shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app. Because all data lives in your own Google account, you retain ownership of, and responsibility for, your records.`,
    },
    {
      title: 'Termination & changes',
      body: `You may stop using the app at any time. We may update these terms from time to time; the latest version is always published on this page.`,
    },
    {
      title: 'Contact',
      body: `Questions about these terms? Contact ${CONTACT_EMAIL}.`,
    },
  ],
  id: [
    {
      title: 'Penerimaan ketentuan',
      body: `Dengan menggunakan Finance Tracker, Anda menyetujui Ketentuan Layanan ini. Jika Anda tidak setuju, mohon tidak menggunakan aplikasi ini.`,
    },
    {
      title: 'Layanan',
      body: `Finance Tracker adalah dashboard keuangan pribadi gratis tanpa server. Aplikasi mengautentikasi Anda dengan Google, membuat spreadsheet di Google Drive Anda, dan membaca serta menulis catatan pemasukan dan pengeluaran langsung ke spreadsheet tersebut. Aplikasi disediakan "apa adanya" tanpa tier berbayar atau backend yang di-hosting.`,
    },
    {
      title: 'Tanggung jawab Anda',
      body: `Anda harus memiliki akun Google yang valid untuk menggunakan aplikasi ini. Anda bertanggung jawab atas keakuratan data yang Anda masukkan dan atas kepatuhan terhadap Ketentuan Layanan Google serta hukum privasi yang berlaku sehubungan dengan data keuangan Anda sendiri.`,
    },
    {
      title: 'Penggunaan yang dapat diterima',
      body: `Jangan gunakan aplikasi untuk menyimpan materi ilegal, mencoba mengganggu layanan, atau mengakses spreadsheet milik orang lain.`,
    },
    {
      title: 'Tanpa jaminan',
      body: `Aplikasi disediakan "apa adanya" dan "sesuai ketersediaan", tanpa jaminan apa pun — termasuk kesesuaian untuk tujuan tertentu atau tidak melanggar hak pihak lain. Ini adalah alat pencatatan pribadi; kami tidak menjamin aplikasi bebas dari kesalahan, berjalan tanpa gangguan, atau merupakan pengganti nasihat keuangan profesional.`,
    },
    {
      title: 'Batasan tanggung jawab',
      body: `Sejauh yang diizinkan hukum, pembuat Finance Tracker tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan aplikasi. Karena semua data tersimpan di akun Google Anda sendiri, Anda tetap memiliki dan bertanggung jawab atas catatan Anda.`,
    },
    {
      title: 'Penghentian & perubahan',
      body: `Anda dapat berhenti menggunakan aplikasi kapan saja. Kami dapat memperbarui ketentuan ini dari waktu ke waktu; versi terbaru selalu dipublikasikan di halaman ini.`,
    },
    {
      title: 'Kontak',
      body: `Punya pertanyaan tentang ketentuan ini? Hubungi ${CONTACT_EMAIL}.`,
    },
  ],
}