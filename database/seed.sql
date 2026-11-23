-- 1. Pengguna (Users)
-- Hash password123: $2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe
INSERT INTO users (id, name, email, password_hash, role, teacher_status, bio, avatar_url)
VALUES 
  (1, 'Admin Pusat KursusDeh', 'admin@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'admin', NULL, 'Administrator Sistem KursusDeh', NULL),
  (2, 'Budi Santoso, S.Kom', 'budi@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'teacher', 'approved', 'Praktisi Web Developer dan Pengajar berpengalaman lebih dari 8 tahun.', NULL),
  (3, 'Siti Rahmawati', 'siti@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'teacher', 'pending', 'Spesialis UI/UX Design dan riset interaksi manusia-komputer.', NULL),
  (4, 'Andi Pratama', 'andi@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'student', NULL, 'Pelajar yang antusias mempelajari teknologi web baru.', NULL),
  (5, 'Dewi Lestari', 'dewi@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'student', NULL, 'Pemula yang baru memulai belajar coding.', NULL),
  (8, 'Andi Pratama (Akun Siswa)', 'student@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'student', NULL, 'Pelajar yang antusias mempelajari teknologi web baru.', NULL),
  (9, 'Rudi Hidayat', 'rudi@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'student', NULL, 'Pemula yang baru memulai belajar coding.', NULL)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  teacher_status = EXCLUDED.teacher_status;

ALTER SEQUENCE users_id_seq RESTART WITH 10;

-- 2. Kategori Kursus (Categories)
INSERT INTO categories (id, name, slug, description)
VALUES 
  (1, 'Web Development', 'web-development', 'Pelajari pembuatan aplikasi web modern dari dasar frontend hingga backend.'),
  (2, 'UI/UX Design', 'ui-ux-design', 'Kuasai prinsip desain antarmuka yang ramah pengguna, riset, dan wireframing.'),
  (3, 'Data Science', 'data-science', 'Eksplorasi analisis data, visualisasi, dan pemanfaatan Python.'),
  (4, 'Bahasa Asing', 'bahasa-asing', 'Tingkatkan kecakapan komunikasi bahasa global secara terstruktur.'),
  (5, 'Bisnis & Karir', 'bisnis-karir', 'Kembangkan keahlian manajemen, strategi digital, dan kepemimpinan.')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description;

ALTER SEQUENCE categories_id_seq RESTART WITH 6;

-- 3. Kursus (Courses)
INSERT INTO courses (id, teacher_id, category_id, title, slug, description, thumbnail_url, level, status)
VALUES 
  (1, 2, 1, 'Dasar-Dasar HTML & CSS untuk Pemula', 'dasar-html-css-pemula', 'Kursus ramah pemula untuk membangun fondasi web statis pertama Anda menggunakan tag HTML semantik dan styling CSS modern.', '/images/courses/dasardasarhtlmcss.jpg', 'pemula', 'published'),
  (2, 2, 1, 'Mastering Tailwind CSS Modern', 'mastering-tailwind-css', 'Pelajari cara cepat membuat antarmuka web responsif dan elegan dengan utility-first styling Tailwind CSS.', '/images/courses/tailwindcss.jpg', 'menengah', 'published'),
  (3, 2, 2, 'Dasar Riset UI/UX & Wireframing', 'dasar-ui-ux-wireframing', 'Pahami metode Human-Centered Design untuk merancang aplikasi yang intuitif, nyaman, dan disukai pengguna.', '/images/courses/uiuxwireframing.jpg', 'pemula', 'published'),
  (4, 2, 3, 'Analisis Data Python untuk Pemula', 'analisis-data-python', 'Panduan langkah demi langkah memproses tabel data, membersihkan data, dan membuat grafik visual menarik.', '/images/courses/analisisdatapython.jpg', 'pemula', 'published'),
  (5, 2, 4, 'Percakapan Bahasa Inggris Sehari-hari', 'percakapan-bahasa-inggris', 'Tingkatkan rasa percaya diri berbicara bahasa Inggris dalam berbagai situasi umum dan profesional.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', 'pemula', 'published')
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  level = EXCLUDED.level,
  status = EXCLUDED.status;

ALTER SEQUENCE courses_id_seq RESTART WITH 6;

-- 4. Materi Kursus Berurutan (Materials)
INSERT INTO materials (id, course_id, title, content, order_number)
VALUES 
  (1, 1, 'Pengenalan Web & Anatomi HTML', $Selamat datang di KursusDeh! Di bab pertama ini, kita akan memulai perjalanan memahami bagaimana sebuah halaman website diciptakan.

1. Apa itu HTML?
HTML merupakan singkatan dari HyperText Markup Language. Berbeda dengan bahasa pemrograman seperti Python atau JavaScript yang memiliki logika algoritma, HTML adalah bahasa markah (markup). Artinya, HTML bertugas memberikan struktur, label, dan arti pada konten yang Anda tulis, seperti menentukan mana yang merupakan judul, paragraf, gambar, maupun tombol.

Browser seperti Google Chrome, Safari, atau Firefox bertugas membaca file HTML dan menerjemahkan baris-baris kode tersebut menjadi tampilan visual yang kita nikmati setiap hari.

2. Anatomi Dokumen HTML Standar
Setiap dokumen web modern dibangun menggunakan struktur kerangka baku berikut:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Pertama Saya - KursusDeh</title>
</head>
<body>
  <h1>Selamat Datang di Dunia Web Development!</h1>
  <p>Ini adalah dokumen HTML pertama yang berhasil saya buat.</p>
</body>
</html>
```

3. Penjelasan Setiap Elemen Kunci:
• <!DOCTYPE html>: Mendeklarasikan bahwa dokumen ini menggunakan standar HTML5 terbaru.
• <html lang="id">: Elemen akar (root) yang membungkus seluruh konten. Atribut lang="id" memberitahu mesin pencari bahwa bahasa konten adalah bahasa Indonesia.
• <head>: Area penampung metadata, yaitu informasi penting untuk browser dan SEO yang tidak ditampilkan langsung di halaman utama.
• <meta charset="UTF-8">: Memastikan seluruh karakter teks (termasuk simbol dan huruf khusus) dapat ditampilkan secara benar tanpa glitch.
• <meta name="viewport">: Mengatur skala tampilan agar halaman langsung responsif saat dibuka di layar ponsel cerdas.
• <body>: Area utama tempat semua konten visual ditulis, mulai dari teks, gambar, video, hingga navigasi.

4. Tips Praktik untuk Pemula:
Selalu pastikan setiap tag pembuka memiliki tag penutup yang sesuai (contoh: <h1> harus ditutup dengan </h1>), serta jaga kerapian indentasi (spasi menjorok) agar kode Anda mudah dibaca oleh diri sendiri dan tim pengembang lain.$, 1),
  (2, 1, 'Bekerja dengan Teks, Gambar, dan Tautan', $Setelah memahami kerangka dasar pada bab sebelumnya, sekarang kita akan mengisi dokumen web Anda dengan tiga elemen paling fundamental: teks terstruktur, gambar pendukung, dan tautan antar-halaman.

1. Hierarki Judul dan Paragraf
HTML menyediakan enam tingkatan heading (judul), dari <h1> sebagai judul terpenting hingga <h6> sebagai sub-judul terkecil.
Gunakan tag <p> untuk menuliskan paragraf teks biasa. Anda juga dapat menggunakan tag <strong> untuk menebalkan teks penting dan <em> untuk memberi penekanan miring.

2. Menyisipkan Gambar dengan Aksesibilitas
Gambar disematkan menggunakan tag <img> yang bersifat self-closing (tidak memiliki tag penutup). Tag ini memiliki dua atribut wajib:
• src (source): Lokasi tautan atau path file gambar.
• alt (alternative text): Deskripsi singkat gambar. Atribut ini sangat penting bagi penyandang disabilitas yang menggunakan screen reader dan membantu SEO website.

3. Membuat Tautan (Hyperlink)
Tag <a> (anchor) digunakan untuk menghubungkan satu halaman web ke halaman lainnya menggunakan atribut href.

Berikut contoh implementasi lengkapnya:

```html
<main>
  <article>
    <!-- Judul Utama Topik -->
    <h1>Mengenal Ekosistem Web Modern</h1>
    <p>Belajar web development dimulai dari memahami <strong>HTML</strong>, <strong>CSS</strong>, dan <strong>JavaScript</strong>.</p>
    
    <h2>Tiga Pilar Utama Frontend</h2>
    <p>Untuk membangun antarmuka web interaktif, Anda membutuhkan tiga pilar utama: HTML untuk struktur, CSS untuk keindahan visual, dan JavaScript untuk interaktivitas.</p>
    
    <!-- Contoh Gambar Terstruktur -->
    <figure>
      <img 
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" 
        alt="Baris kode pemrograman web di layar monitor" 
        width="600" 
      />
      <figcaption>Gambar 1.1: Penulisan kode sumber menggunakan code editor.</figcaption>
    </figure>
    
    <!-- Tautan Eksternal -->
    <p>
      Untuk mempelajari standar sintaks lebih mendalam, kunjungi 
      <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
        Dokumentasi Resmi MDN Web Docs
      </a>.
    </p>
  </article>
</main>
```

4. Catatan Praktik Baik:
Hanya gunakan satu tag <h1> per halaman untuk menjaga hierarki konten yang ramah mesin pencari (SEO) dan ramah pembaca layar (screen reader).$, 2),
  (3, 1, 'Pengantar CSS & Pewarnaan Elemen', $Halaman web yang hanya memiliki HTML ibarat bangunan yang baru selesai dipasang batu bata tanpa cat dan plester. Di bab ini, kita akan mempelajari CSS (Cascading Style Sheets) untuk memberikan gaya visual, warna, dan tipografi yang memikat.

1. Tiga Cara Menghubungkan CSS
• External CSS (Paling Dianjurkan): Menuliskan kode CSS pada file terpisah berformat .css lalu menghubungkannya menggunakan tag <link rel="stylesheet" href="style.css"> di dalam <head>.
• Internal CSS: Menuliskan aturan CSS di dalam tag <style> pada bagian <head>.
• Inline CSS: Menuliskan atribut style langsung pada elemen HTML (sebaiknya dihindari untuk proyek besar).

2. Anatomi Aturan CSS (Selector, Property, Value)
Aturan CSS bekerja dengan memilih elemen HTML melalui Selector, lalu menerapkan properti dan nilainya di dalam kurung kurawal.

Berikut contoh styling kartu komponen nyata:

```css
/* 1. Selector Elemen: Mengatur font global */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #F8FAFC;
  color: #0F172A;
  line-height: 1.6;
}

/* 2. Selector Class: Menggunakan tanda titik (.) */
.kartu-belajar {
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 24px;
  max-width: 420px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.kartu-belajar h2 {
  color: #0F766E; /* Warna Tosca Utama KursusDeh */
  font-size: 20px;
  margin-bottom: 8px;
}

/* 3. Selector ID: Menggunakan tanda pagar (#) untuk elemen unik */
#tombol-daftar {
  background-color: #F59E0B; /* Warna Amber Aksen */
  color: #1C1917;
  font-weight: bold;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

#tombol-daftar:hover {
  background-color: #D97706;
}
```

3. Rangkuman Selector:
Gunakan class (.nama-class) untuk elemen yang memiliki gaya berulang pada banyak tempat, dan gunakan ID (#nama-id) secara hemat khusus untuk elemen tunggal yang unik di halaman.$, 3),
  (4, 1, 'Konsep Box Model & Tata Letak Dasar', $Box Model adalah fondasi paling esensial dalam tata letak (layout) CSS. Setiap elemen HTML (baik teks, gambar, maupun tombol) diperlakukan oleh browser sebagai sebuah kotak persegi panjang berlapis.

1. Empat Lapisan Box Model:
• Content: Area aktual tempat teks atau media berada.
• Padding: Ruang kosong transparan di antara isi konten dan garis tepi (border).
• Border: Garis tepi yang membungkus konten dan padding.
• Margin: Jarak ruang luar yang memisahkan elemen tersebut dari elemen-elemen di sekitarnya.

2. Aturan Emas: box-sizing: border-box
Secara default, browser menggunakan content-box, di mana padding dan border akan menambah ukuran total lebar elemen (menyebabkan layout sering pecah). Pengembang profesional selalu menggunakan border-box agar lebar total elemen tetap konsisten.

Mari kita amati contoh kodenya:

```css
/* Standar Reset Box-Sizing untuk seluruh proyek */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Kotak Komponen dengan Box Model yang Presisi */
.wadah-materi {
  width: 360px;
  background-color: #FFFFFF;
  
  /* PADDING: Memberi nafas di dalam kotak */
  padding: 24px;
  
  /* BORDER: Batas garis tepi yang jelas */
  border: 2px solid #0F766E;
  border-radius: 16px;
  
  /* MARGIN: Jarak luar agar tidak menempel ke tepi layar */
  margin: 32px auto;
}

.wadah-materi p {
  /* Margin bawah untuk memberi jeda antar paragraf */
  margin-bottom: 16px;
  color: #334155;
}
```

3. Tips Mengingat Urutan Nilai Shorthand:
Jika Anda menuliskan padding: 10px 20px 15px 5px;, urutannya selalu searah jarum jam: Atas (Top) → Kanan (Right) → Bawah (Bottom) → Kiri (Left) atau disingkat TRBL (Trouble).$, 4),
  (9, 1, 'Flexbox & tata letak modern dengan CSS', $Menyusun elemen agar berjejer rapi ke samping atau berada tepat di tengah layar dahulu merupakan hal yang rumit. Dengan hadirnya CSS Flexbox (Flexible Box Layout), Anda dapat mengatur posisi, perataan, dan distribusi ruang antar-elemen dengan sangat mudah dan fleksibel.

1. Konsep Flex Container dan Flex Items
Untuk mengaktifkan Flexbox, Anda cukup memberikan deklarasi display: flex pada elemen induk (Flex Container). Secara otomatis, seluruh elemen anak di dalamnya (Flex Items) akan berbaris menyamping.

2. Dua Sumbu Arah Flexbox:
• Main Axis (Sumbu Utama): Diatur menggunakan property justify-content (contoh: flex-start, center, flex-end, space-between).
• Cross Axis (Sumbu Silang): Diatur menggunakan property align-items (contoh: flex-start, center, flex-end, stretch).

Berikut contoh pembuatan Navbar modern dan responsif:

```html
<header class="navbar-wrapper">
  <div class="brand-logo">KursusDeh</div>
  <nav class="nav-menu">
    <a href="/courses">Katalog</a>
    <a href="/login">Masuk</a>
    <a href="/register" class="btn-cta">Daftar</a>
  </nav>
</header>

<style>
.navbar-wrapper {
  display: flex;
  justify-content: space-between; /* Menaruh logo di kiri, menu di kanan */
  align-items: center;            /* Meratakan elemen secara vertikal tepat di tengah */
  padding: 16px 32px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 20px; /* Jarak otomatis antar tautan menu */
}

.nav-menu a {
  text-decoration: none;
  color: #334155;
  font-weight: 600;
  font-size: 14px;
}

.btn-cta {
  background-color: #0F766E;
  color: #FFFFFF !important;
  padding: 8px 16px;
  border-radius: 8px;
}
</style>
```

3. Kesimpulan:
Flexbox adalah perkakas wajib bagi setiap web developer. Kuasai kombinasi display: flex, justify-content: space-between, dan align-items: center karena pola ini digunakan pada 90% komponen navigasi, kartu, dan formulir web modern.$, 5),
  (5, 2, 'Mengapa Memilih Tailwind CSS?', $Tailwind CSS adalah framework CSS berparadigma utility-first yang telah merevolusi cara pengembang membangun antarmuka web modern. Di bab ini, kita akan mempelajari mengapa Tailwind sangat digemari dan bagaimana cara berpikir menggunakan utility classes.

1. Masalah pada CSS Konvensional
Pada CSS konvensional, setiap kali ingin membuat komponen baru, Anda harus memikirkan nama class unik (seperti .card-header-v2-container), berpindah ke file CSS terpisah, menulis aturan, lalu kembali ke HTML. Seiring berkembangnya proyek, file CSS akan terus membengkak dan sulit dirawat.

2. Solusi Utility-First Tailwind CSS
Tailwind menyediakan ribuan class utilitas siap pakai (seperti p-4 untuk padding, bg-teal-500 untuk warna latar, text-center untuk teks rata tengah). Anda langsung menyusun desain di dalam markup HTML tanpa meninggalkan file komponen.

Perhatikan perbandingan langsung di bawah ini:

```html
<!-- PENULISAN KOMPONEN MENGGUNAKAN TAILWIND CSS -->
<div class="max-w-md mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-md space-y-4">
  <div class="flex items-center justify-between">
    <span class="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
      Pemula
    </span>
    <span class="text-xs text-slate-500 font-medium">15 Menit</span>
  </div>

  <h3 class="text-xl font-bold text-slate-800 hover:text-teal-700 transition-colors">
    Membangun Antarmuka Cepat dengan Utility Classes
  </h3>

  <p class="text-slate-600 text-sm leading-relaxed">
    Anda tidak perlu lagi mengarang nama class buatan. Cukup gunakan class standar dari design system Tailwind.
  </p>

  <button class="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl text-sm transition-all shadow-sm">
    Mulai Latihan Sekarang
  </button>
</div>
```

3. Keuntungan Utama Tailwind CSS:
• Kecepatan Pengembangan: Tidak perlu bolak-balik antar berkas HTML dan CSS.
• Konsistensi Design System: Nilai padding, margin, font-size, dan palet warna sudah terstandarisasi.
• Ukuran File Produksi Sangat Kecil: Compiler Tailwind hanya akan mengekspor class yang benar-benar Anda pakai di dalam proyek.$, 1),
  (6, 2, 'Layout Responsif: Mobile, Tablet, dan Desktop', $Lebih dari 60% pengguna internet menjelajahi web melalui perangkat seluler (smartphone). Oleh karena itu, prinsip desain Mobile-First bukan lagi pilihan, melainkan sebuah keharusan mutlak. Tailwind CSS dirancang dengan filosofi mobile-first secara default.

1. Cara Kerja Breakpoint di Tailwind
Class tanpa prefix (awalan) akan berlaku untuk semua ukuran layar (termasuk layar HP terkecil). Saat Anda ingin mengubah tampilan pada layar yang lebih lebar, gunakan prefix breakpoint:
• sm: Berlaku pada layar >= 640px (Ponsel lanskap / tablet kecil)
• md: Berlaku pada layar >= 768px (Tablet)
• lg: Berlaku pada layar >= 1024px (Laptop & Desktop)
• xl: Berlaku pada layar >= 1280px (Monitor Besar)

2. Contoh Praktik Tata Letak Responsif:
Mari kita buat sistem grid responsif yang secara otomatis mengubah susunan: 1 kolom di HP, 2 kolom di tablet, dan 3 kolom di laptop.

```html
<section class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
  <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 text-center sm:text-left">
    Katalog Modul Pembelajaran
  </h2>

  <!-- GRID RESPONSIF: 1 kolom (default HP) -> 2 kolom (md) -> 3 kolom (lg) -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    
    <!-- Item 1 -->
    <div class="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div class="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-3">
        01
      </div>
      <h3 class="font-bold text-slate-800 text-base mb-1">Struktur HTML Semantik</h3>
      <p class="text-xs text-slate-500">Mempelajari susunan tag standar dokumen web.</p>
    </div>

    <!-- Item 2 -->
    <div class="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div class="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-3">
        02
      </div>
      <h3 class="font-bold text-slate-800 text-base mb-1">Styling Utility Tailwind</h3>
      <p class="text-xs text-slate-500">Menerapkan tata warna dan spasi secara konsisten.</p>
    </div>

    <!-- Item 3 -->
    <div class="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div class="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-3">
        03
      </div>
      <h3 class="font-bold text-slate-800 text-base mb-1">Publikasi & Optimasi</h3>
      <p class="text-xs text-slate-500">Menyiapkan proyek untuk diunggah ke internet publik.</p>
    </div>

  </div>
</section>
```

3. Aturan Emas Mobile-First:
Jangan mendesain untuk desktop terlebih dahulu lalu mengecilkan elemen di HP. Mulailah menata konten untuk layar sempit, lalu gunakan md: atau lg: untuk melebarkan kolom dan menambah ruang saat layar bertambah luas.$, 2),
  (7, 3, 'Prinsip Dasar Desain Ramah Manusia', $Desain yang baik bukan hanya tentang estetika, melainkan bagaimana produk tersebut mempermudah manusia menyelesaikan tugasnya secara menyenangkan.$, 1),
  (8, 3, 'Membuat Wireframe Sederhana', $Pelajari cara membuat sketsa tata letak hitam-putih berfokus pada hierarki informasi sebelum masuk ke tahap warna.$, 2)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  order_number = EXCLUDED.order_number;

ALTER SEQUENCE materials_id_seq RESTART WITH 10;

-- 5. Pendaftaran Siswa (Enrollments)
INSERT INTO enrollments (id, student_id, course_id, enrolled_at)
VALUES 
  (1, 4, 1, NOW() - INTERVAL '3 days'),
  (2, 4, 2, NOW() - INTERVAL '1 days'),
  (3, 5, 1, NOW() - INTERVAL '2 days')
ON CONFLICT (student_id, course_id) DO NOTHING;

ALTER SEQUENCE enrollments_id_seq RESTART WITH 4;

-- 6. Progres Belajar Siswa (Material Progress)
-- Siswa Andi (enrollment 1) sudah menyelesaikan materi 1 dan 2 (50% progres)
INSERT INTO material_progress (enrollment_id, material_id, is_completed, completed_at)
VALUES 
  (1, 1, TRUE, NOW() - INTERVAL '2 days'),
  (1, 2, TRUE, NOW() - INTERVAL '1 days')
ON CONFLICT (enrollment_id, material_id) DO UPDATE SET 
  is_completed = EXCLUDED.is_completed,
  completed_at = EXCLUDED.completed_at;

-- 7. Forum Diskusi Contoh (Discussions)
INSERT INTO discussions (id, material_id, user_id, parent_id, content)
VALUES 
  (1, 1, 4, NULL, 'Halo Pak Budi, apakah tag <h1> sebaiknya hanya digunakan satu kali per halaman untuk optimasi SEO?'),
  (2, 1, 2, 1, 'Pertanyaan yang sangat bagus, Andi! Ya, secara standar praktik terbaik (best practice), sebuah halaman web dianjurkan memiliki tepat 1 elemen <h1> sebagai judul utama topik.')
ON CONFLICT (id) DO NOTHING;

ALTER SEQUENCE discussions_id_seq RESTART WITH 3;
