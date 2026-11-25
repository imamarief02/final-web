-- 1. Pengguna (Users)
-- Hash password123: $2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe
INSERT INTO users (id, name, email, password_hash, role, teacher_status, bio, avatar_url, approved_at)
VALUES 
  (1, 'Admin Pusat KursusDeh', 'admin@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'admin', NULL, 'Administrator Sistem KursusDeh', NULL, NULL),
  (2, 'Budi Santoso', 'budi@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'teacher', 'approved', 'Praktisi Web Developer dan Pengajar berpengalaman lebih dari 8 tahun.', NULL, NOW() - INTERVAL '3 days'),
  (3, 'Siti Rahmawati', 'siti@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'teacher', 'approved', 'Spesialis UI/UX Design dan riset interaksi manusia-komputer.', NULL, NOW() - INTERVAL '3 days'),
  (4, 'Andi Pratama', 'andi@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'student', NULL, 'Pelajar yang antusias mempelajari teknologi web baru.', NULL, NULL),
  (5, 'Dewi Lestari', 'dewi@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'student', NULL, 'Pemula yang baru memulai belajar coding.', NULL, NULL),
  (8, 'Andi Pratama (Akun Siswa)', 'student@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'student', NULL, 'Pelajar yang antusias mempelajari teknologi web baru.', NULL, NULL),
  (9, 'Rudi Hidayat', 'rudi@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'student', NULL, 'Pemula yang baru memulai belajar coding.', NULL, NULL),
  (11, 'Rian Pratama', 'rian@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'teacher', 'approved', 'Praktisi Bisnis, Konsultan Manajemen & Karir Profesional lebih dari 10 tahun', NULL, NOW()),
  (12, 'Fajar Ramadhan', 'fajar@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'teacher', 'approved', 'Praktisi Data Scientist, Machine Learning Engineer, dan Konsultan Analisis Data.', NULL, NOW()),
  (13, 'Sarah Wijaya', 'sarah@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'teacher', 'approved', 'Instruktur Bahasa Asing bersertifikasi TEFL dengan pengalaman mengajar komunikasi profesional lebih dari 7 tahun.', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  teacher_status = EXCLUDED.teacher_status,
  bio = EXCLUDED.bio,
  approved_at = EXCLUDED.approved_at;

ALTER SEQUENCE users_id_seq RESTART WITH 14;

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
INSERT INTO courses (id, teacher_id, category_id, title, slug, description, thumbnail_url, level, status, start_date, end_date)
VALUES 
  (1, 2, 1, 'Dasar-Dasar HTML & CSS untuk Pemula', 'dasar-html-css-pemula', 'Kursus ramah pemula untuk membangun fondasi web statis pertama Anda menggunakan tag HTML semantik dan styling CSS modern.', '/images/courses/dasardasarhtlmcss.jpg', 'pemula', 'published', NULL, NULL),
  (2, 2, 1, 'Mastering Tailwind CSS Modern', 'mastering-tailwind-css', 'Pelajari cara cepat membuat antarmuka web responsif dan elegan dengan utility-first styling Tailwind CSS.', '/images/courses/tailwindcss.jpg', 'menengah', 'published', '2026-12-01', '2026-12-31'),
  (3, 3, 2, 'Dasar Riset UI/UX & Wireframing', 'dasar-ui-ux-wireframing', 'Pahami metode Human-Centered Design untuk merancang aplikasi yang intuitif, nyaman, dan disukai pengguna.', '/images/courses/uiuxwireframing.jpg', 'pemula', 'published', NULL, NULL),
  (4, 12, 3, 'Analisis Data Python untuk Pemula', 'analisis-data-python', 'Panduan langkah demi langkah memproses tabel data, membersihkan data, dan membuat grafik visual menarik.', '/images/courses/analisisdatapython.jpg', 'pemula', 'published', '2026-12-10', '2027-01-15'),
  (5, 13, 4, 'Percakapan Bahasa Inggris Sehari-hari', 'percakapan-bahasa-inggris', 'Tingkatkan rasa percaya diri berbicara bahasa Inggris dalam berbagai situasi umum dan profesional.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', 'pemula', 'published', NULL, NULL),
  (6, 11, 5, 'Dasar Manajemen Bisnis & Pengembangan Karir', 'manajemen-bisnis-dan-karir', 'Pelajari fondasi pengelolaan bisnis modern, penyusunan Business Model Canvas (BMC), manajemen arus kas dasar, serta strategi membangun karir profesional yang cemerlang.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', 'pemula', 'published', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET 
  teacher_id = EXCLUDED.teacher_id,
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  level = EXCLUDED.level,
  status = EXCLUDED.status,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date;

ALTER SEQUENCE courses_id_seq RESTART WITH 7;

-- 4. Materi Kursus Berurutan (Materials)
INSERT INTO materials (id, course_id, title, content, order_number)
VALUES 
  (1, 1, "Pengenalan Web & Anatomi HTML", $TAG_1$Selamat datang di KursusDeh! Di bab pertama ini, kita akan memulai perjalanan memahami bagaimana sebuah halaman website diciptakan.

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
Selalu pastikan setiap tag pembuka memiliki tag penutup yang sesuai (contoh: <h1> harus ditutup dengan </h1>), serta jaga kerapian indentasi (spasi menjorok) agar kode Anda mudah dibaca oleh diri sendiri dan tim pengembang lain.$TAG_1$, 1),
  (2, 1, "Bekerja dengan Teks, Gambar, dan Tautan", $TAG_2$Setelah memahami kerangka dasar pada bab sebelumnya, sekarang kita akan mengisi dokumen web Anda dengan tiga elemen paling fundamental: teks terstruktur, gambar pendukung, dan tautan antar-halaman.

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
Hanya gunakan satu tag <h1> per halaman untuk menjaga hierarki konten yang ramah mesin pencari (SEO) dan ramah pembaca layar (screen reader).$TAG_2$, 2),
  (3, 1, "Pengantar CSS & Pewarnaan Elemen", $TAG_3$Halaman web yang hanya memiliki HTML ibarat bangunan yang baru selesai dipasang batu bata tanpa cat dan plester. Di bab ini, kita akan mempelajari CSS (Cascading Style Sheets) untuk memberikan gaya visual, warna, dan tipografi yang memikat.

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
Gunakan class (.nama-class) untuk elemen yang memiliki gaya berulang pada banyak tempat, dan gunakan ID (#nama-id) secara hemat khusus untuk elemen tunggal yang unik di halaman.$TAG_3$, 3),
  (4, 1, "Konsep Box Model & Tata Letak Dasar", $TAG_4$Box Model adalah fondasi paling esensial dalam tata letak (layout) CSS. Setiap elemen HTML (baik teks, gambar, maupun tombol) diperlakukan oleh browser sebagai sebuah kotak persegi panjang berlapis.

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
Jika Anda menuliskan padding: 10px 20px 15px 5px;, urutannya selalu searah jarum jam: Atas (Top) → Kanan (Right) → Bawah (Bottom) → Kiri (Left) atau disingkat TRBL (Trouble).$TAG_4$, 4),
  (5, 2, "Mengapa Memilih Tailwind CSS?", $TAG_5$Tailwind CSS adalah framework CSS berparadigma utility-first yang telah merevolusi cara pengembang membangun antarmuka web modern. Di bab ini, kita akan mempelajari mengapa Tailwind sangat digemari dan bagaimana cara berpikir menggunakan utility classes.

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
• Ukuran File Produksi Sangat Kecil: Compiler Tailwind hanya akan mengekspor class yang benar-benar Anda pakai di dalam proyek.$TAG_5$, 1),
  (6, 2, "Layout Responsif: Mobile, Tablet, dan Desktop", $TAG_6$Lebih dari 60% pengguna internet menjelajahi web melalui perangkat seluler (smartphone). Oleh karena itu, prinsip desain Mobile-First bukan lagi pilihan, melainkan sebuah keharusan mutlak. Tailwind CSS dirancang dengan filosofi mobile-first secara default.

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
Jangan mendesain untuk desktop terlebih dahulu lalu mengecilkan elemen di HP. Mulailah menata konten untuk layar sempit, lalu gunakan md: atau lg: untuk melebarkan kolom dan menambah ruang saat layar bertambah luas.$TAG_6$, 2),
  (7, 3, "Prinsip Dasar Desain Berpusat pada Pengguna (Human-Centered)", $TAG_7$Desain antarmuka (UI) dan pengalaman pengguna (UX) yang sukses berakar dari pemahaman mendalam tentang kebutuhan dan pola pikir manusia yang akan menggunakannya. Prinsip ini dikenal sebagai Human-Centered Design (Desain Berpusat pada Manusia).

1. 5 Tahapan Utama Design Thinking:
• Empathize (Empati): Memahami sudut pandang, kesulitan, dan rutinitas calon pengguna melalui observasi dan wawancara.
• Define (Mendefinisikan Masalah): Merumuskan inti masalah yang benar-benar dirasakan pengguna, bukan sekadar asumsi pembuat produk.
• Ideate (Curah Ide): Mengumpulkan berbagai alternatif solusi kreatif tanpa menghakimi ide di awal.
• Prototype (Pembuatan Purwarupa): Mewujudkan ide ke dalam bentuk sketsa atau purwarupa visual yang nyata.
• Test (Uji Coba): Menyerahkan purwarupa ke pengguna asli untuk melihat apakah solusi tersebut benar-benar mudah dipahami.

2. Hukum Esensial UX (Laws of UX):
• Jakob's Law: Pengguna menghabiskan sebagian besar waktunya di aplikasi lain. Oleh karena itu, aplikasi Anda sebaiknya bekerja dengan pola navigasi yang sudah akrab bagi mereka (misal: tombol keranjang belanja di kanan atas).
• Hick's Law: Semakin banyak pilihan yang disajikan di layar, semakin lama waktu yang dibutuhkan pengguna untuk mengambil keputusan. Buat menu sesederhana mungkin!
• Fitts's Law: Tombol aksi utama (CTA) harus berukuran cukup besar dan mudah dijangkau oleh jempol di layar sentuh.

3. Kesimpulan:
Estetika visual hanyalah kulit luar. Fondasi sejati dari produk digital yang dicintai jutaan orang adalah kemampuannya menyelesaikan masalah nyata dengan sesedikit mungkin kebingungan.$TAG_7$, 1),
  (8, 3, "Merancang Wireframe & Arsitektur Informasi", $TAG_8$Sebelum menuangkan warna, tipografi mewah, dan ilustrasi rumit, seorang perancang produk digital selalu memulai dari Wireframe. Wireframe adalah cetak biru (blueprint) hitam-putih yang memetakan tata letak informasi.

1. Mengapa Harus Mulai dari Wireframe?
Banyak pemula tergoda langsung mendesain di Figma dengan warna warni. Akibatnya, saat struktur alur aplikasinya salah, mereka harus merombak seluruh desain yang memakan banyak waktu. Wireframe memungkinkan kita:
• Menguji alur pengguna (user flow) dengan cepat.
• Menentukan hierarki informasi mana yang paling penting di halaman.
• Menghemat waktu revisi tim pengembang dan pemangku kepentingan (stakeholder).

2. Tiga Tingkatan Wireframe:
• Low-Fidelity (Sketsa Kertas): Coretan tangan menggunakan pensil dan kertas untuk mengeksplorasi susunan layout dalam 5–10 menit.
• Mid-Fidelity: Gambar digital menggunakan kotak abu-abu, teks placeholder, dan penempatan tombol tanpa elemen warna/gaya.
• High-Fidelity: Sudah mendekati tampilan aplikasi final lengkap dengan warna tema, gambar nyata, dan mikro-interaksi.

3. Anatomi Halaman Web yang Baik:
• Header / Top Bar: Identitas brand, menu navigasi utama, dan tombol aksi login/daftar.
• Hero Section: Pesan nilai utama yang menjelaskan apa guna produk ini dalam 3 detik pertama.
• Konten Inti / Fitur: Dikelompokkan dalam kartu-kartu terstruktur dengan ruang kosong (white space) yang lega.
• Footer: Navigasi pendukung, tautan bantuan, dan hak cipta.

Langkah Latihan Praktis:
Ambil selembar kertas dan pulpen. Sketsakan antarmuka sebuah aplikasi pencari kursus dengan 1 hero section dan 3 kartu materi. Pastikan tombol utama terlihat paling mencolok dibanding elemen lain!$TAG_8$, 2),
  (9, 1, "Flexbox & tata letak modern dengan CSS", $TAG_9$Menyusun elemen agar berjejer rapi ke samping atau berada tepat di tengah layar dahulu merupakan hal yang rumit. Dengan hadirnya CSS Flexbox (Flexible Box Layout), Anda dapat mengatur posisi, perataan, dan distribusi ruang antar-elemen dengan sangat mudah dan fleksibel.

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
Flexbox adalah perkakas wajib bagi setiap web developer. Kuasai kombinasi display: flex, justify-content: space-between, dan align-items: center karena pola ini digunakan pada 90% komponen navigasi, kartu, dan formulir web modern.$TAG_9$, 5),
  (10, 2, "Tipografi, Pewarnaan, & Desain Komponen", $TAG_10$Tipografi dan pewarnaan adalah dua aspek visual yang paling menentukan kenyamanan membaca dan identitas sebuah antarmuka web. Di bab ini, kita akan mempelajari bagaimana Tailwind CSS menyediakan skala tipografi dan palet warna yang sangat terstruktur.

1. Skala Ukuran Teks (Font Size)
Tailwind menggunakan utility font size yang proporsional dengan line-height (jarak antar baris) bawaan:
• text-xs: Ukuran 12px (biasanya untuk keterangan teks badge atau label kecil)
• text-sm: Ukuran 14px (ukuran standar teks sekunder atau paragraf ringkas)
• text-base: Ukuran 16px (ukuran default teks tubuh web modern)
• text-lg: Ukuran 18px (sub-judul atau teks pengantar)
• text-xl s.d. text-4xl: Digunakan untuk judul bab hingga heading utama artikel

2. Ketebalan Font (Font Weight)
Gunakan class berikut untuk mengatur bobot teks:
• font-normal (400)
• font-medium (500)
• font-semibold (600)
• font-bold (700)
• font-extrabold (800)

3. Palet Warna & Opasitas
Tailwind menyediakan palet warna lengkap dengan tingkatan intensitas 50 hingga 950 (contoh: slate, teal, emerald, amber, rose).
Anda dapat mewarnai teks menggunakan text-{warna}-{tingkat} (misal text-slate-800) dan latar belakang menggunakan bg-{warna}-{tingkat} (misal bg-teal-500).

Contoh Penerapan Komponen Nyata:

```html
<div class="max-w-md p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
  <span class="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
    Tipografi Modern
  </span>
  <h3 class="text-xl font-extrabold text-slate-900 leading-snug">
    Mengatur Hirarki Visual dengan Tailwind CSS
  </h3>
  <p class="text-sm text-slate-600 leading-relaxed">
    Kontras warna teks yang tepat antara judul utama yang tegas (slate-900) dan paragraf pendukung yang lembut (slate-600) membuat mata pembaca tidak cepat lelah.
  </p>
</div>
```

4. Tips Aksesibilitas Tipografi:
Selalu pastikan kontras antara warna teks dan warna latar belakang cukup kontras (rasio minimal 4.5:1 untuk teks normal) agar tulisan Anda mudah dibaca oleh seluruh kalangan pengguna.$TAG_10$, 3),
  (11, 2, "Interaktivitas Komponen & Animasi Transisi", $TAG_11$Interaktivitas adalah hal yang membedakan web modern dari dokumen statis. Di bab ini, kita akan mempelajari interaksi komponen dengan state pseudo-class seperti hover, focus, dan animasi transisi halus.

1. State Hover dan Active
Tambahkan prefix hover: di depan utility apa saja untuk mengubah tampilannya saat kursor mouse melayang di atas elemen:
• hover:bg-teal-600: Mengubah warna tombol saat di-hover.
• hover:scale-105: Membesarkan ukuran elemen sedikit untuk efek sentuhan fisik.
• hover:shadow-lg: Menambah kedalaman bayangan (elevasi).

2. Transisi Halus (Smooth Transitions)
Jangan biarkan perubahan state terjadi secara mendadak dan kaku. Selalu sertakan class transisi:
• transition-all atau transition-colors
• duration-200 atau duration-300 (durasi 200–300 milidetik adalah standar emas kenyamanan visual)

Contoh Pembuatan Tombol Interaktif Profesional:

```html
<button class="px-6 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-teal-200 cursor-pointer">
  Simpan Perubahan
</button>
```

3. Ringkasan:
Kombinasi transisi yang halus dan state hover yang responsif memberikan umpan balik (feedback) langsung kepada pengguna bahwa elemen tersebut siap untuk diklik.$TAG_11$, 4),
  (12, 3, "Prinsip Aksesibilitas & Komponen Desain Nyata", $TAG_12$Aksesibilitas (Accessibility / a11y) dan sistem desain adalah jaminan bahwa aplikasi Anda dapat digunakan dengan nyaman oleh semua orang, termasuk mereka yang memiliki keterbatasan fisik, penglihatan, atau berada di bawah terik sinar matahari.

1. Kontras Warna yang Nyaman
Pastikan kontras antara teks dan warna background memiliki rasio yang memadai. Teks abu-abu muda di atas background putih adalah contoh klasik UX buruk yang membuat mata pengguna lelah. Gunakan warna abu-abu gelap (#1E293B atau #334155) untuk teks tubuh.

2. Ukuran Target Ketukan (Touch Targets)
Pada perangkat mobile, jari manusia memiliki luas sentuhan sekitar 7–10 mm. Standar desain modern mewajibkan:
• Tombol atau link yang dapat diklik memiliki ukuran minimal 44 x 44 piksel.
• Memberikan jarak (gap) yang cukup antar tombol agar tidak terjadi salah tekan (fat-finger error).

3. Umpan Balik Status Interaksi (States):
Setiap komponen yang bisa diklik harus memiliki 4 kondisi status yang jelas:
• Default: Tampilan normal saat pertama dilihat.
• Hover: Berubah sedikit saat kursor melayang.
• Pressed/Active: Terlihat sedikit tertekan saat disentuh.
• Disabled: Terlihat memudar saat aksi belum memenuhi syarat.

Dengan memadukan empati riset, wireframe yang rapi, dan kepatuhan pada aksesibilitas, Anda siap merancang produk digital kelas dunia!$TAG_12$, 3),
  (13, 4, "Pengenalan Python & Lingkungan Sains Data", $TAG_13$Selamat datang di Kursus Analisis Data dengan Python! Python saat ini merupakan bahasa pemrograman paling populer di dunia untuk ilmu data (Data Science), kecerdasan buatan (AI), dan otomatisasi pengolahan data.

1. Mengapa Memilih Python untuk Data?
• Sintaks Bahasa Manusiawi: Kode Python sangat bersih, mudah dibaca, dan ringkas dibandingkan C++ atau Java.
• Ekosistem Pustaka (Library) Terlengkap: Didukung oleh NumPy (komputasi numerik), Pandas (manipulasi tabel data), dan Matplotlib/Seaborn (visualisasi data).
• Dukungan Komunitas Global: Solusi atas setiap kendala dapat ditemukan dengan mudah.

2. Tipe Data Fundamental di Python:
• Integer & Float: Untuk angka bulat (contoh: 25) dan desimal (contoh: 87.5).
• String: Untuk teks (contoh: "KursusDeh").
• List: Kumpulan data berurutan yang dapat diubah nilainya (contoh: [80, 90, 75, 95]).
• Dictionary: Pasangan kunci dan nilai (contoh: {"nama": "Andi", "nilai": 95}).

Contoh Kode Python Sederhana:

```python
# Menghitung rata-rata nilai siswa
daftar_nilai = [85, 90, 78, 92, 88]

total = sum(daftar_nilai)
jumlah_siswa = len(daftar_nilai)
rata_rata = total / jumlah_siswa

print(f"Total Nilai: {total}")
print(f"Rata-rata Nilai Kelas: {rata_rata:.2f}")

# Percabangan logika
if rata_rata >= 80:
    print("Predikat Kelas: Sangat Baik")
else:
    print("Predikat Kelas: Perlu Peningkatan")
```

3. Lingkungan Kerja Analisis Data:
Dalam dunia profesional, praktisi data banyak menggunakan Jupyter Notebook atau Google Colaboratory karena memungkinkan kita menjalankan kode per-sel blok sambil melihat tabel dan grafik secara instan.$TAG_13$, 1),
  (14, 4, "Manipulasi Tabel Data Menggunakan Pandas", $TAG_14$Pandas adalah pustaka Python yang paling krusial bagi seorang data analyst. Jika Anda terbiasa menggunakan Microsoft Excel atau Google Sheets, anggaplah Pandas sebagai spreadsheet canggih berbasis kode yang mampu memproses jutaan baris data dalam hitungan detik.

1. Dua Struktur Data Inti di Pandas:
• Series: Kolom tunggal data 1 dimensi (seperti satu kolom di Excel).
• DataFrame: Tabel data 2 dimensi lengkap dengan baris dan kolom yang memiliki label nama.

2. Membaca dan Menginspeksi Data:

```python
import pandas as pd

# 1. Membuat DataFrame dari kamus data
data = {
    "Nama": ["Andi", "Budi", "Dewi", "Rudi", "Siti"],
    "Kota": ["Jakarta", "Surabaya", "Bandung", "Medan", "Jakarta"],
    "Nilai_Ujian": [85, 78, 92, 65, 89],
    "Status_Lulus": [True, True, True, False, True]
}

df = pd.DataFrame(data)

# 2. Perintah Inspeksi Data Paling Penting:
print("--- 5 Baris Pertama ---")
print(df.head())

print("
--- Ringkasan Statistik Angka ---")
print(df.describe())

print("
--- Informasi Tipe Data Kolom ---")
print(df.info())
```

3. Memfilter dan Memilih Data:
```python
# Memfilter siswa yang nilainya di atas 80
siswa_unggul = df[df["Nilai_Ujian"] > 80]
print(siswa_unggul[["Nama", "Nilai_Ujian"]])

# Menghitung rata-rata nilai per kota
rata_per_kota = df.groupby("Kota")["Nilai_Ujian"].mean()
print(rata_per_kota)
```

Dengan beberapa baris kode Pandas di atas, Anda sudah bisa melakukan agregasi dan penyaringan data yang kompleks secara otomatis.$TAG_14$, 2),
  (15, 4, "Teknik Pembersihan Data (Data Cleaning)", $TAG_15$Dalam kenyataan di lapangan, data mentah yang kita terima dari survei, sensor, atau database hampir tidak pernah 100% bersih. Seringkali terdapat data kosong (missing values), data duplikat, atau format teks yang berantakan.

1. Menemukan Data Kosong (NaN / Null)
Langkah pertama adalah memeriksa berapa banyak sel kosong di setiap kolom:

```python
import pandas as pd
import numpy as np

# Simulasi data mentah yang kotor
raw_data = {
    "Produk": ["Laptop", "Mouse", "Keyboard", "Monitor", "Mouse"],
    "Harga": [8500000, 150000, np.nan, 2100000, 150000],
    "Terjual": [12, np.nan, 34, 8, 12]
}

df = pd.DataFrame(raw_data)

# Memeriksa jumlah nilai kosong
print(df.isnull().sum())
```

2. Strategi Menangani Data Kosong:
• Menghapus Baris Kosong (`df.dropna()`): Cocok jika jumlah data yang hilang sangat sedikit dan tidak mempengaruhi kesimpulan.
• Mengisi Nilai Kosong (`df.fillna()` / Imputasi): Mengisi sel kosong dengan nilai rata-rata (mean), median, atau nilai default seperti 0.

```python
# Mengisi harga kosong dengan median harga produk
median_harga = df["Harga"].median()
df["Harga"] = df["Harga"].fillna(median_harga)

# Mengisi jumlah terjual kosong dengan angka 0
df["Terjual"] = df["Terjual"].fillna(0)
```

3. Menghapus Data Duplikat:
Data pencatatan ganda sering terjadi saat sistem input bermasalah:
```python
# Menghapus baris yang identik kembar
df = df.drop_duplicates()
print(df)
```

Data yang bersih adalah syarat mutlak sebelum melangkah ke tahap visualisasi grafik dan pemodelan prediktif.$TAG_15$, 3),
  (16, 4, "Visualisasi Data Grafis dengan Matplotlib & Seaborn", $TAG_16$Grafik visual bernilai seribu kata. Kemampuan menyajikan temuan data ke dalam bentuk visualisasi yang jelas dan mudah dipahami oleh orang non-teknis adalah keterampilan utama seorang Data Analyst.

1. Matplotlib & Seaborn
• Matplotlib: Pustaka dasar visualisasi grafik di Python yang sangat fleksibel.
• Seaborn: Pustaka tingkat tinggi berbasis Matplotlib yang menghasilkan grafik modern dan estetis dengan sedikit baris kode.

2. Memilih Jenis Grafik yang Tepat:
• Diagram Batang (Bar Chart): Menampilkan perbandingan antar kategori (misal: total penjualan per cabang).
• Diagram Garis (Line Chart): Menampilkan tren pergerakan nilai sepanjang waktu (time series).
• Histogram: Menampilkan sebaran frekuensi data (distribusi normal, kemiringan).
• Diagram Sebar (Scatter Plot): Menemukan korelasi atau hubungan antara dua variabel angka.

Contoh Kode Pembuatan Visualisasi:

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Data kursus populer
kategori = ['Web Dev', 'UI/UX', 'Data Science', 'Bahasa', 'Bisnis']
jumlah_siswa = [1420, 890, 1150, 620, 480]

# Mengatur ukuran kanvas grafik
plt.figure(figsize=(8, 5))

# Membuat diagram batang dengan warna elegan
sns.barplot(x=kategori, y=jumlah_siswa, palette="viridis")

# Memberikan judul dan label sumbu
plt.title("Distribusi Minat Siswa per Kategori Kursus - KursusDeh", fontsize=14, fontweight='bold')
plt.xlabel("Kategori Pembelajaran", fontsize=11)
plt.ylabel("Total Siswa Terdaftar", fontsize=11)

# Menampilkan grid horizontal halus
plt.grid(axis='y', linestyle='--', alpha=0.7)

# Menyimpan grafik sebagai gambar
plt.tight_layout()
plt.savefig("grafik_kursusdeh.png", dpi=300)
plt.show()
```

Selamat! Anda telah menguasai alur kerja hulu ke hilir seorang praktisi data: Mulai dari memahami Python dasar, mengolah tabel dengan Pandas, membersihkan data kotor, hingga meracik grafik visual yang siap dipresentasikan.$TAG_16$, 4),
  (17, 5, "Percakapan Perkenalan & Memulai Obrolan Santai (Small Talk)", $TAG_17$Welcome to Everyday English Conversation! Di bab pertama ini, kita akan membongkar rasa ragu dan gugup saat harus memulai percakapan bahasa Inggris dalam situasi perkenalan dan obrolan santai (small talk).

1. Pola Dasar Memperkenalkan Diri (Self-Introduction):
Alih-alih hanya mengucapkan "My name is...", berikut pola natural yang biasa digunakan:
• Formal / Profesional: "Good morning, everyone. My name is [Nama], and I am currently working as a [Profesi] at [Instansi/Perusahaan]."
• Santai / Kasual: "Hi there! I'm [Nama]. It's really great to meet you all."

2. Menanyakan Kabar & Pertanyaan Pemecah Keheningan (Icebreakers):
Jangan hanya terpaku pada "How are you? I'm fine thank you". Variasikan dengan kalimat berikut:
• "How's your day going so far?" (Bagaimana harimu berjalan sejauh ini?)
• "What brings you here today?" (Apa yang membawamu ke acara ini hari ini?)
• "Have you tried the coffee here? It's really good!" (Sudah coba kopinya? Enak lho!)

Contoh Dialog Praktik:
Alex: "Hi, excuse me. Is anyone sitting here?"
Sarah: "No, it's free. Please, have a seat!"
Alex: "Thanks! By the way, I'm Alex. I'm attending the web development workshop."
Sarah: "Nice to meet you, Alex. I'm Sarah, a graphic design student. Are you finding the workshop helpful?"
Alex: "Absolutely! The mentor explains everything very clearly."

3. Tips Percaya Diri:
Fokuslah pada kelancaran komunikasi dan pesan yang ingin Anda sampaikan, bukan pada ketakutan salah tata bahasa (grammar). Penutur asli sangat menghargai usaha Anda untuk berkomunikasi!$TAG_17$, 1),
  (18, 5, "Memesan Makanan & Menanyakan Petunjuk Arah", $TAG_18$Saat bepergian ke luar negeri atau berinteraksi di lingkungan wisata internasional, kemampuan memesan makanan di kafe/restoran serta menanyakan petunjuk arah jalan adalah keterampilan paling praktis yang wajib Anda kuasai.

1. Ungkapan Sopan Memesan Makanan di Restoran:
Gunakan "I would like..." atau "Could I please have..." agar terdengar sopan dan santun:
• "Excuse me, could we have the menu, please?" (Permisi, boleh minta buku menunya?)
• "I'd like to order a chicken steak with mashed potatoes, please." (Saya ingin memesan steak ayam dengan kentang tumbuk.)
• "Does this dish contain any peanuts? I have an allergy." (Apakah hidangan ini mengandung kacang? Saya ada alergi.)
• "Could we get the bill, please?" (Boleh minta tagihannya?)

2. Menanyakan Petunjuk Arah (Asking for Directions):
• "Excuse me, could you tell me how to get to the central station?" (Permisi, bisakah Anda beritahu arah ke stasiun pusat?)
• "Is the National Museum within walking distance from here?" (Apakah Museum Nasional bisa dicapai dengan jalan kaki dari sini?)

Kata Kunci Petunjuk Arah:
• Go straight ahead: Jalan lurus terus
• Turn left / Turn right: Belok kiri / Belok kanan
• It's on your left / right: Letaknya di sebelah kiri / kanan Anda
• Across the street: Di seberang jalan
• Next to the convenience store: Di sebelah minimarket

Latihan Mandiri:
Cobalah ucapkan dengan lantang pesanan menu makan siang favorit Anda dalam bahasa Inggris menggunakan pola "Could I have [makanan], and a glass of [minuman], please?"$TAG_18$, 2),
  (19, 5, "Komunikasi Profesional & Diskusi Tim dalam Pekerjaan", $TAG_19$Dalam dunia karir global dan kerja jarak jauh (remote work), komunikasi profesional saat rapat (meeting), menyampaikan gagasan, dan menyetujui atau menolak ide rekan kerja membutuhkan tata bahasa yang diplomatis dan konstruktif.

1. Menyampaikan Opini atau Gagasan:
• "From my perspective, focusing on mobile user experience will increase our conversion rate." (Dari sudut pandang saya, fokus pada kenyamanan pengguna mobile akan meningkatkan transaksi kita.)
• "I believe we should prioritize fixing the database performance before launching the new feature." (Saya yakin kita sebaiknya mendahulukan performa database sebelum meluncurkan fitur baru.)

2. Menyetujui dan Mendukung Ide:
• "I completely agree with that point." (Saya sangat setuju dengan poin tersebut.)
• "That makes a lot of sense. Let's proceed with that approach." (Itu sangat masuk akal. Mari kita lanjutkan dengan pendekatan tersebut.)

3. Menolak atau Berbeda Pendapat Secara Santun (Polite Disagreement):
Hindari mengatakan "You are wrong". Gunakan teknik diplomatis:
• "I see your point, but have we considered the extra server cost?" (Saya paham poin Anda, namun apakah kita sudah mempertimbangkan biaya server tambahan?)
• "I'm not quite sure that will work in our current timeline. How about we try a simpler alternative first?" (Saya kurang yakin hal itu bisa selesai tepat waktu. Bagaimana jika kita coba alternatif yang lebih sederhana terlebih dahulu?)

4. Menyimpulkan dan Tindak Lanjut:
• "To sum up, our next action item is to finalize the design prototype by Friday." (Sebagai kesimpulan, tugas kita berikutnya adalah menyelesaikan purwarupa desain pada hari Jumat.)

Congratulations! Anda telah mempelajari keterampilan percakapan esensial dari perkenalan sosial, situasi perjalanan praktis, hingga komunikasi profesional di lingkungan kerja.$TAG_19$, 3),
  (20, 6, 'Pengenalan Ekosistem Bisnis & Business Model Canvas (BMC)', $TAG_20$Selamat datang di bab pertama kursus Dasar Manajemen Bisnis & Pengembangan Karir! Di bab pembuka ini, kita akan mempelajari bagaimana sebuah gagasan usaha dirumuskan menjadi model bisnis yang solid dan teruji.

1. Apa itu Bisnis Modern?
Bisnis pada hakikatnya adalah proses menyelesaikan masalah orang lain secara menguntungkan dan berkelanjutan. Bisnis yang sukses tidak berawal dari produk yang rumit, melainkan dari pemahaman mendalam terhadap kebutuhan atau rasa sakit (pain point) pelanggan.

Tiga pilar utama bisnis yang sehat:
• Penciptaan Nilai (Value Creation): Menghadirkan solusi nyata yang dibutuhkan orang banyak.
• Pengiriman Nilai (Value Delivery): Memastikan produk atau layanan sampai ke tangan pelanggan dengan kualitas konsisten.
• Penangkapan Nilai (Value Capture): Menghasilkan pendapatan yang lebih besar daripada biaya operasional (profit).

2. Memahami 9 Blok Business Model Canvas (BMC)
Business Model Canvas (BMC) diciptakan oleh Alexander Osterwalder untuk memvisualisasikan seluruh komponen bisnis dalam satu lembar kerja ringkas:
• Customer Segments: Siapa kelompok konsumen spesifik yang ingin Anda bantu?
• Value Propositions: Solusi unik apa yang Anda tawarkan yang membedakan Anda dari kompetitor?
• Channels: Melalui sarana apa Anda berkomunikasi dan mendistribusikan produk (misal: toko fisik, web e-commerce, media sosial)?
• Customer Relationships: Bagaimana cara Anda menarik pelanggan baru dan mempertahankan pelanggan lama (retention)?
• Revenue Streams: Dari mana saja uang masuk ke dalam kas bisnis Anda?
• Key Resources: Aset apa saja yang wajib dimiliki (SDM, teknologi, modal, hak paten)?
• Key Activities: Kegiatan operasional harian utama yang tidak boleh berhenti.
• Key Partnerships: Pihak eksternal atau mitra strategis yang diajak bekerja sama (pemasok, logistik, payment gateway).
• Cost Structure: Rincian seluruh pos pengeluaran terbesar untuk menjalankan model bisnis ini.

3. Studi Kasus Singkat: Kedai Kopi Modern
Bayangkan sebuah kedai kopi lokal yang ingin menyasar pekerja jarak jauh (remote worker):
• Value Proposition: Kopi berkualitas dengan koneksi internet cepat, colokan di setiap meja, dan suasana tenang untuk fokus kerja.
• Customer Segment: Freelancer, mahasiswa tingkat akhir, dan digital nomad usia 20-35 tahun.
• Revenue Stream: Penjualan kopi, makanan ringan, dan penyewaan ruang meeting mini per jam.

Tugas Refleksi: Amati satu bisnis lokal di sekitar tempat tinggal Anda. Tuliskan apa nilai tambah unik (Value Proposition) utama yang membuat pelanggan terus kembali membeli produk mereka!$TAG_20$, 1),
  (21, 6, 'Manajemen Finansial Dasar & Pengelolaan Arus Kas (Cash Flow)', $TAG_21$Banyak bisnis pemula gulung tikar bukan karena mereka tidak memiliki penjualan, melainkan karena kehabisan uang tunai (cash flow insolvent). Di bab ini, kita akan membedah dasar-dasar keuangan bisnis yang wajib dipahami oleh setiap pemilik usaha dan profesional.

1. Perbedaan Mendasar: Omset, Laba Kotor, dan Laba Bersih
Sering kali pemula terjebak merasa bisnisnya sangat maju karena omsetnya besar, padahal setelah dihitung sebenarnya merugi.
• Omset (Revenue / Penjualan): Total seluruh uang masuk dari transaksi penjualan sebelum dipotong biaya apa pun.
• Harga Pokok Penjualan (HPP / COGS): Biaya langsung yang dikeluarkan untuk membuat atau membeli produk (misal: bahan baku kopi, susu, kemasan gelas).
• Laba Kotor (Gross Profit): Omset - HPP.
• Biaya Operasional (OPEX): Biaya sewa tempat, gaji karyawan, listrik, wifi, dan pemasaran.
• Laba Bersih (Net Profit): Laba Kotor - Biaya Operasional - Pajak. Inilah keuntungan nyata yang menjadi hak bisnis Anda!

2. Manajemen Arus Kas (Cash Flow is King)
Arus kas mencatat kapan uang benar-benar masuk dan kapan uang keluar dari rekening bank bisnis Anda.
• Arus Kas Positif: Uang yang masuk ke rekening lebih banyak daripada uang yang dibayarkan keluar.
• Arus Kas Negatif: Uang keluar lebih cepat daripada uang masuk. Jika dibiarkan berlarut-larut, bisnis tidak akan mampu membayar tagihan dan gaji.

Aturan Emas Mengelola Cash Flow:
• Pisahkan rekening pribadi dengan rekening bisnis sejak hari pertama.
• Tagih piutang konsumen secepat mungkin dan negosiasikan termin pembayaran ke vendor/pemasok secara bijak.
• Selalu siapkan dana darurat operasional (runway cash) minimal setara dengan 3 hingga 6 bulan pengeluaran rutin.

3. Strategi Penetapan Harga (Pricing Strategy)
Ada tiga pendekatan umum dalam menentukan harga jual:
• Cost-Plus Pricing: Menambahkan persentase margin keuntungan di atas biaya HPP (misal: HPP Rp20.000 + margin 50% = harga jual Rp30.000).
• Competitor-Based Pricing: Menetapkan harga mendekati rata-rata pemain lain di pasar yang sama.
• Value-Based Pricing: Menetapkan harga berdasarkan nilai dan manfaat emosional/finansial yang dirasakan pelanggan, bukan sekadar harga modal bahan.$TAG_21$, 2),
  (22, 6, 'Strategi Perencanaan Karir, Networking & Personal Branding', $TAG_22$Karir yang sukses bukan sekadar hasil dari keberuntungan, melainkan hasil dari perencanaan yang terarah, peningkatan kompetensi (skill development), dan pembangunan reputasi profesional.

1. Memetakan Keahlian Diri (Skill Matrix & T-Shaped Skills)
Di pasar kerja modern, profesional yang paling dicari adalah mereka yang memiliki profil T-Shaped:
• Garis Horizontal (Broad Knowledge): Memiliki pemahaman umum lintas disiplin (misal: paham dasar komunikasi, digital marketing, analitik data, dan cara kerja bisnis).
• Garis Vertikal (Deep Expertise): Memiliki satu atau dua keahlian khusus yang sangat mendalam dan ahli di bidangnya (misal: mahir frontend development atau copywriting).

2. Membangun Personal Branding di Era Digital
Personal brand adalah apa yang orang lain katakan tentang keahlian dan integritas Anda saat Anda tidak berada di dalam ruangan.
Langkah praktis membangun reputasi profesional:
• Optimasi Profil LinkedIn: Gunakan foto profesional, tulis headline yang menjelaskan solusi yang bisa Anda berikan (contoh: "Web Developer | Membantu UMKM Go-Digital"), dan cantumkan pencapaian konkrit.
• Dokumentasikan Proses Belajar (Build in Public): Bagikan studi kasus, proyek yang sedang Anda kerjakan, atau wawasan yang baru saja Anda pelajari di media sosial profesional.
• Portofolio Nyata: Buktikan kemampuan Anda melalui karya nyata, sertifikat terverifikasi, atau kontribusi open-source.

3. Seni Komunikasi & Networking
• Networking bukan tentang membagikan kartu nama sebanyak-banyaknya, melainkan tentang membangun hubungan timbal balik yang tulus.
• Selalu tanyakan: "Bagaimana saya bisa membantu proyek atau pekerjaan Anda saat ini?" sebelum meminta bantuan orang lain.$TAG_22$, 3),
  (23, 6, 'Manajemen Waktu, Produktivitas, dan Eksekusi Target (SMART & OKR)', $TAG_23$Ide bisnis dan ambisi karir terbaik tidak akan bermakna tanpa kemampuan eksekusi yang konsisten. Bab terakhir ini akan membekali Anda dengan kerangka kerja produktivitas yang digunakan oleh perusahaan teknologi global seperti Google, Intel, dan Spotify.

1. Menetapkan Target dengan SMART Goals & OKRs
Banyak orang gagal mencapai target karena targetnya terlalu samar, misalnya "Saya ingin sukses tahun ini". Gunakan prinsip SMART:
• Specific: Target harus jelas dan tidak bermakna ganda.
• Measurable: Memiliki indikator angka yang dapat diukur.
• Achievable: Realistis untuk dicapai dengan sumber daya yang ada.
• Relevant: Sejalan dengan tujuan jangka panjang bisnis atau karir Anda.
• Time-bound: Memiliki batas waktu (tenggat) yang tegas.

Kerangka Kerja OKR (Objectives & Key Results):
• Objective (Kualitatif): "Meningkatkan kualitas pelayanan pelanggan aplikasi."
• Key Result 1 (Kuantitatif): Menurunkan waktu respon customer care dari 30 menit menjadi di bawah 5 menit.
• Key Result 2 (Kuantitatif): Mencapai skor kepuasan pelanggan (CSAT) minimal 90% pada akhir kuartal.

2. Manajemen Waktu: Matriks Eisenhower
Kelompokkan tugas harian Anda ke dalam 4 kuadran:
• Penting & Mendesak (Do First): Krisis yang harus segera diselesaikan hari ini.
• Penting & Tidak Mendesak (Schedule): Inilah kunci kemajuan jangka panjang! Mencakup belajar skill baru, berolahraga, menyusun strategi bisnis, dan membangun networking. Jadwalkan waktu khusus di kalender Anda.
• Tidak Penting & Mendesak (Delegate): Tugas administratif yang bisa didelegasikan atau diotomatisasi.
• Tidak Penting & Tidak Mendesak (Eliminate): Scrolling media sosial tanpa tujuan, kebiasaan menunda-nunda.

3. Membangun Resiliensi & Growth Mindset
Dunia bisnis dan karir selalu berubah secara dinamis. Mereka yang terus bertahan dan menjadi pemimpin adalah mereka yang memandang kegagalan sebagai bahan evaluasi dan data pembelajaran, bukan sebagai akhir perjalanan.

Selamat! Anda telah menuntaskan seluruh modul fundamental bisnis dan pengembangan karir ini. Terapkan wawasan ini secara nyata pada usaha rintisan atau perjalanan profesi Anda!$TAG_23$, 4)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  order_number = EXCLUDED.order_number;

ALTER SEQUENCE materials_id_seq RESTART WITH 25;

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
