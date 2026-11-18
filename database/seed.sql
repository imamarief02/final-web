-- Seed Data KursusDeh
-- Acuan: PRD.md (Password untuk seluruh akun bawaan: password123)

-- 1. Pengguna (Users)
-- Hash password123: $2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe
INSERT INTO users (id, name, email, password_hash, role, teacher_status, bio, avatar_url)
VALUES 
  (1, 'Admin Pusat KursusDeh', 'admin@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'admin', NULL, 'Administrator Sistem KursusDeh', NULL),
  (2, 'Budi Santoso, S.Kom', 'teacher@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'teacher', 'approved', 'Praktisi Web Developer dan Pengajar berpengalaman lebih dari 8 tahun.', NULL),
  (3, 'Siti Rahmawati', 'calonguru@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'teacher', 'pending', 'Spesialis UI/UX Design dan riset interaksi manusia-komputer.', NULL),
  (4, 'Andi Pratama', 'student@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'student', NULL, 'Pelajar yang antusias mempelajari teknologi web baru.', NULL),
  (5, 'Rudi Hidayat', 'rudi@kursusdeh.com', '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe', 'student', NULL, 'Pemula yang baru memulai belajar coding.', NULL)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  teacher_status = EXCLUDED.teacher_status;

ALTER SEQUENCE users_id_seq RESTART WITH 6;

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
  (1, 2, 1, 'Dasar-Dasar HTML & CSS untuk Pemula', 'dasar-html-css-pemula', 'Kursus ramah pemula untuk membangun fondasi web statis pertama Anda menggunakan tag HTML semantik dan styling CSS modern.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', 'pemula', 'published'),
  (2, 2, 1, 'Mastering Tailwind CSS Modern', 'mastering-tailwind-css', 'Pelajari cara cepat membuat antarmuka web responsif dan elegan dengan utility-first styling Tailwind CSS.', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', 'menengah', 'published'),
  (3, 2, 2, 'Dasar Riset UI/UX & Wireframing', 'dasar-ui-ux-wireframing', 'Pahami metode Human-Centered Design untuk merancang aplikasi yang intuitif, nyaman, dan disukai pengguna.', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80', 'pemula', 'published'),
  (4, 2, 3, 'Analisis Data Python untuk Pemula', 'analisis-data-python', 'Panduan langkah demi langkah memproses tabel data, membersihkan data, dan membuat grafik visual menarik.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 'pemula', 'published'),
  (5, 2, 4, 'Percakapan Bahasa Inggris Sehari-hari', 'percakapan-bahasa-inggris', 'Tingkatkan rasa percaya diri berbicara bahasa Inggris dalam berbagai situasi umum dan profesional.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', 'pemula', 'published')
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  level = EXCLUDED.level,
  status = EXCLUDED.status;

ALTER SEQUENCE courses_id_seq RESTART WITH 6;

-- 4. Materi Kursus Berurutan (Materials)
INSERT INTO materials (id, course_id, title, content, order_number)
VALUES 
  (1, 1, 'Pengenalan Web & Anatomi HTML', 'Selamat datang di KursusDeh! HTML (HyperText Markup Language) adalah kerangka dasar pembangun halaman web. Setiap halaman internet tersusun dari elemen tag seperti <html>, <head>, dan <body>. Pada materi pembuka ini, Anda akan belajar bagaimana browser membaca struktur file HTML dan menampilkannya di layar kaca.', 1),
  (2, 1, 'Bekerja dengan Teks, Gambar, dan Tautan', 'Setelah memahami kerangka dasar, kini saatnya mengisi konten web Anda. Kita akan menjelajahi elemen heading <h1> sampai <h6>, paragraf <p>, menambahkan gambar dengan tag <img> serta atribut alt yang ramah aksesibilitas, dan membuat hyperlink menggunakan tag <a>.', 2),
  (3, 1, 'Pengantar CSS & Pewarnaan Elemen', 'CSS (Cascading Style Sheets) memberi warna dan keindahan pada halaman web Anda. Pelajari cara menggunakan color, background-color, font-family, serta bagaimana selector class dan ID bekerja.', 3),
  (4, 1, 'Konsep Box Model & Tata Letak Dasar', 'Setiap elemen HTML diperlakukan oleh browser sebagai sebuah kotak. Pahami perbedaan margin, border, padding, dan content agar tampilan layout website Anda presisi dan rapi.', 4),
  
  (5, 2, 'Mengapa Memilih Tailwind CSS?', 'Tailwind CSS adalah framework CSS utility-first yang memungkinkan kita membangun desain khusus langsung pada markup HTML tanpa harus berpindah-pindah file CSS.', 1),
  (6, 2, 'Layout Responsif: Mobile, Tablet, dan Desktop', 'Pelajari bagaimana breakpoint sm, md, lg, dan xl bekerja di Tailwind untuk menciptakan tampilan yang luwes di semua ukuran layar.', 2),
  
  (7, 3, 'Prinsip Dasar Desain Ramah Manusia', 'Desain yang baik bukan hanya tentang estetika, melainkan bagaimana produk tersebut mempermudah manusia menyelesaikan tugasnya secara menyenangkan.', 1),
  (8, 3, 'Membuat Wireframe Sederhana', 'Pelajari cara membuat sketsa tata letak hitam-putih berfokus pada hierarki informasi sebelum masuk ke tahap warna.', 2)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  order_number = EXCLUDED.order_number;

ALTER SEQUENCE materials_id_seq RESTART WITH 9;

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
