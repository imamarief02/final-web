# KursusDeh

Platform kursus online berbasis web yang dibangun dengan Next.js App Router, Tailwind CSS, dan PostgreSQL (raw SQL tanpa ORM).

## Fitur Utama

### Siswa (Student)
* Katalog kursus dengan pencarian dan filter kategori (Pemula, Menengah, Lanjutan).
* Alur belajar materi berurutan.
* Pelacakan progres belajar per materi.
* Forum diskusi dan tanya jawab di setiap materi.
* Cetak sertifikat kelulusan digital.

### Pengajar (Teacher)
* Pendaftaran akun pengajar dengan sistem verifikasi admin.
* Pengelolaan kursus dan materi pembelajaran.
* Pemantauan progres belajar siswa yang terdaftar.

### Admin
* Ringkasan statistik pengguna, kursus, dan sertifikat.
* Verifikasi persetujuan akun pengajar baru.
* Pengelolaan data pengguna (tambah, edit, reset password, hapus).
* Pengelolaan kategori kursus.
* Pengelolaan data seluruh kursus di platform.

## Tech Stack

* Framework: Next.js 16 (App Router)
* Frontend: React 19, Tailwind CSS v4, Lucide React
* Database: PostgreSQL (driver pg, raw SQL)
* Keamanan: bcryptjs, session cookie httpOnly

## Skema Database

Aplikasi menggunakan PostgreSQL dengan 9 tabel utama:
1. `users`: Data pengguna (admin, teacher, student) dan status verifikasi.
2. `sessions`: Pengelolaan sesi login pengguna.
3. `categories`: Kategori kursus.
4. `courses`: Informasi kursus, deskripsi, level, dan jadwal.
5. `materials`: Bab materi belajar yang terurut per kursus.
6. `enrollments`: Pendaftaran kursus oleh siswa.
7. `material_progress`: Status penyelesaian materi per siswa.
8. `discussions`: Forum diskusi dan balasan pada materi.
9. `certificates`: Sertifikat kelulusan kursus.

## Panduan Menjalankan Proyek

### 1. Kebutuhan Sistem
* Node.js versi 18 atau lebih baru
* PostgreSQL (server lokal atau cloud)

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (.env.local)
Buat file `.env.local` di root proyek:
```env
DATABASE_URL=postgresql://postgres:password_anda@localhost:5432/kursusdeh
NODE_ENV=development
```

### 4. Inisialisasi Database
Jalankan inisialisasi tabel dan data awal (seed):
```bash
npm run db:init
```

### 5. Jalankan Server
```bash
npm run dev
```
Buka browser di http://localhost:3000

## Akun Demo Pengujian

Password default untuk semua akun: `password123`

| Peran | Email | Keterangan |
| :--- | :--- | :--- |
| Admin | admin@kursusdeh.com | Akses dashboard admin dan verifikasi guru |
| Teacher | budi@kursusdeh.com | Pengajar Web Development |
| Teacher | siti@kursusdeh.com | Pengajar UI/UX Design |
| Teacher | fajar@kursusdeh.com | Pengajar Data Science |
| Teacher | sarah@kursusdeh.com | Pengajar Bahasa Asing |
| Teacher | rian@kursusdeh.com | Pengajar Bisnis dan Karir |
| Student | andi@kursusdeh.com | Akun siswa untuk belajar dan cek sertifikat |
| Student | dewi@kursusdeh.com | Akun siswa |
| Student | rudi@kursusdeh.com | Akun siswa |

## Keamanan

* Proteksi SQL Injection menggunakan parameterized query ($1, $2, dst).
* Proteksi XSS dengan sanitasi dan rendering bawaan React.
* Validasi otorisasi server side untuk membatasi akses edit kursus hanya bagi pemilik kursus.
* Middleware server untuk proteksi rute dashboard.
