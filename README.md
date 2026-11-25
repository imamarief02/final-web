# KursusDeh - Belajar Langkah Demi Langkah

> **Platform Kursus Daring Terstruktur, Modern, dan Ramah Pengguna**  
> Dibangun menggunakan **Next.js (App Router)**, **Tailwind CSS**, dan **PostgreSQL murni (Raw SQL via driver `pg` tanpa ORM)**.

---

## Tentang KursusDeh

**KursusDeh** adalah platform edukasi daring yang dirancang untuk mempermudah siapa saja—mulai dari pemula, pelajar, hingga profesional—dalam mempelajari keterampilan baru secara terstruktur. KursusDeh mengusung konsep belajar bertahap (*step-by-step learning*) di mana siswa mempelajari modul demi modul, memantau kemajuan belajar melalui indikator progres interaktif, dan meraih sertifikat kelulusan digital yang terverifikasi.

---

## Fitur-Fitur Utama

### 1. Publik & Siswa (Student)
* **Katalog Kursus Dinamis:** Pencarian kursus secara *real-time*, filter kategori, dan klasifikasi level (*Pemula, Menengah, Lanjutan*).
* **Alur Belajar Terstruktur:** Materi disusun berurutan (*sequential learning*); siswa menyelesaikan bab demi bab secara bertahap.
* **Pelacakan Progres Mandiri:** Indikator persentase penyelesaian kursus (*progress bar*) yang otomatis diperbarui setelah menandai materi selesai.
* **Forum Diskusi Interaktif:** Ruang tanya-jawab terintegrasi di setiap bab materi dengan dukungan balasan bertingkat (*nested replies*).
* **Sertifikat Kelulusan Digital:** Penerbitan sertifikat resmi ber-ID unik yang dapat diverifikasi secara publik dan dicetak langsung ke format PDF.

### 2. Pengajar (Teacher)
* **Pendaftaran Pengajar Terverifikasi:** Sistem kurasi akun pengajar baru berstatus *pending* hingga ditinjau dan disetujui oleh Administrator.
* **Studio Manajemen Kursus:** Pembuatan kursus baru, pengaturan rentang waktu pelaksanaan (*batch schedule*), dan publikasi kursus (*Draft / Published*).
* **Modul Builder Fleksibel:** Pengelolaan bab materi pembelajaran dengan urutan bab yang terstruktur.
* **Monitoring Siswa:** Pemantauan daftar siswa yang terdaftar dan progres belajar masing-masing siswa.

### 3. Administrator (Admin)
* **Dashboard Statistik Real-Time:** Ringkasan total pengguna, pengajar aktif, jumlah kursus, pendaftaran siswa, dan sertifikat yang diterbitkan.
* **Kurasi & Persetujuan Guru:** Menyetujui (*Approve*) atau menolak (*Reject*) pendaftaran akun pengajar baru, lengkap dengan pencatatan tanggal persetujuan.
* **Manajemen Pengguna (User Management):** Tambah, ubah data/peran, reset kata sandi, dan hapus akun pengguna dengan proteksi *anti-self-deletion*.
* **Manajemen Kategori:** Tambah, ubah, dan hapus kategori kursus dengan proteksi integritas data (*ON DELETE RESTRICT* jika kategori masih memiliki kursus).
* **Moderasi Kursus Global:** Kemampuan mengelola dan menugaskan pengajar pada kursus manapun di platform.

---

## Tumpukan Teknologi (Tech Stack)

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) | React Server Components & Client Components |
| **Library UI** | [React 19](https://react.dev) | Frontend Reactive Components |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Desain modern, bersih, dan sepenuhnya responsif |
| **Ikon** | [Lucide React](https://lucide.dev) | Ikonografi modern dan konsisten |
| **Basis Data** | [PostgreSQL](https://www.postgresql.org) | Skema relasional normalisasi 3NF (9 tabel utama) |
| **Database Driver** | [node-postgres (`pg`)](https://node-postgres.com) | Koneksi basis data menggunakan Raw SQL terparameterisasi (*Tanpa ORM*) |
| **Keamanan Autentikasi** | `bcryptjs` & Web Crypto | Sesi berbasis Cookie `httpOnly`, enkripsi SHA-256, dan hash kata sandi |

---

## Skema Basis Data (3NF)

Sistem menggunakan basis data PostgreSQL dengan 9 tabel relasional utama:
1. `users` — Menyimpan akun Admin, Guru, dan Siswa beserta status verifikasinya.
2. `sessions` — Mengelola sesi login pengguna dengan token acak berkriptografi tinggi.
3. `categories` — Kategori pembelajaran (Web Development, UI/UX, Data Science, Bahasa Asing, Bisnis & Karir).
4. `courses` — Data kursus, deskripsi, thumbnail, level, jadwal rentang waktu, dan status publikasi.
5. `materials` — Bab pembelajaran berurutan yang terikat pada masing-masing kursus.
6. `enrollments` — Pendaftaran siswa ke kursus.
7. `material_progress` — Pelacakan status penyelesaian materi per siswa.
8. `discussions` — Forum diskusi dan balasan per materi pembelajaran.
9. `certificates` — Sertifikat digital kelulusan dengan kode unik.

---

## Panduan Menjalankan Proyek (Setup & Run)

### 1. Prasyarat Sistem
* [Node.js](https://nodejs.org) versi 18 atau lebih baru.
* [PostgreSQL](https://www.postgresql.org) server lokal atau *cloud* (misal: Supabase / Neon / Docker).

### 2. Kloning & Instal Dependensi
```bash
# Masuk ke direktori proyek
cd kursusdeh

# Instal seluruh pustaka dependensi
npm install
```

### 3. Konfigurasi Lingkungan (`.env.local`)
Buat atau sesuaikan berkas `.env.local` di direktori utama:
```env
DATABASE_URL=postgresql://postgres:password_anda@localhost:5432/kursusdeh
NODE_ENV=development
```

### 4. Inisialisasi Basis Data & Data Awal (*Seed*)
Jalankan skrip migrasi dan pengisian data bawaan:
```bash
npm run db:init
```
> Perintah ini akan mengeksekusi `schema.sql` (membuat 9 tabel & tipe ENUM) dan `seed.sql` (mengisi data pengguna awal, kategori, kursus, modul, dan materi).

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses platform di: **[http://localhost:3000](http://localhost:3000)**

---

## Akun Demo Pengujian

Semua akun demo bawaan menggunakan kata sandi yang sama: **`password123`**

| Peran | Nama Akun | Email Login | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Admin** | Admin Pusat KursusDeh | `admin@kursusdeh.com` | Dashboard admin, verifikasi guru, kelola user & kategori |
| **Teacher** | Budi Santoso | `budi@kursusdeh.com` | Pengajar Web Development (Kelola kursus & materi) |
| **Teacher** | Siti Rahmawati | `siti@kursusdeh.com` | Pengajar UI/UX Design |
| **Teacher** | Fajar Ramadhan | `fajar@kursusdeh.com` | Pengajar Data Science |
| **Teacher** | Sarah Wijaya | `sarah@kursusdeh.com` | Pengajar Bahasa Asing |
| **Teacher** | Rian Pratama | `rian@kursusdeh.com` | Pengajar Bisnis & Karir |
| **Student** | Andi Pratama | `andi@kursusdeh.com` | Akses belajar, daftar kursus, lihat sertifikat |
| **Student** | Dewi Lestari | `dewi@kursusdeh.com` | Akses belajar siswa baru |
| **Student** | Rudi Hidayat | `rudi@kursusdeh.com` | Akses belajar siswa |

> [!NOTE]
> **Catatan Penomoran ID & Riwayat Akun yang Dihapus (*Deprecated Accounts*):**  
> Pada berkas `seed.sql` dan basis data, nomor urut `id` pengguna terlihat memiliki loncatan angka (misal: 1, 2, 3, 4, 5, lalu melompat ke 9 dan 11). Hal ini terjadi karena beberapa akun uji coba lama telah dibersihkan dan dihapus dari sistem untuk mencegah duplikasi:
> - **`student@kursusdeh.com` (sebelumnya ID 8):** Telah dihapus dan dinonaktifkan, seluruh aktivitas siswa kini resmi menggunakan akun **`andi@kursusdeh.com`** (ID 4).
> - **`teacher@kursusdeh.com` (sebelumnya ID 6) & `calonguru@kursusdeh.com` (sebelumnya ID 7):** Telah dihapus karena merupakan alias uji coba lama dari Budi Santoso (ID 2) dan Siti Rahmawati (ID 3).
> - **`ali@kursusdeh.com` (ID 10):** Merupakan akun pengajar yang mendaftar secara langsung melalui antarmuka web (bukan dari *seed* bawaan) dan berstatus *pending*.
> 
> Loncatan nomor ID ini adalah perilaku standar (*best practice*) dalam basis data relasional PostgreSQL di mana *Primary Key* berfungsi sebagai pengenal unik teknis mesin (*surrogate key*), bukan nomor urut antrean. Integritas relasi tabel (*Foreign Key*) tetap terjaga dengan aman.

---

## Praktik Keamanan yang Diterapkan
* **Proteksi SQL Injection:** 100% query basis data menggunakan parameterized query (`$1, $2, ...`).
* **Proteksi XSS (Cross-Site Scripting):** Tidak ada manipulasi HTML mentah (`dangerouslySetInnerHTML`). Seluruh konten dirender aman oleh React.
* **Otorisasi Ketat (IDOR Protection):** Pengajar hanya dapat mengedit, menambah materi, atau menghapus kursus miliknya sendiri.
* **Server-Side Route Guard:** Next.js Middleware dan verifikasi sesi server mengamankan seluruh rute `/dashboard/*` dan `/api/*`.

---

## Lisensi & Kontribusi
Proyek ini dikembangkan untuk tujuan edukasi dan pengembangan platform pembelajaran daring terbuka.  
*Hak Cipta © 2026 KursusDeh. Seluruh hak cipta dilindungi undang-undang.*
