import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

// Baca DATABASE_URL dari .env.local jika ada
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/DATABASE_URL=(.+)/);
      if (match) {
        connectionString = match[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (e) {
    // abaikan jika gagal
  }
}

if (!connectionString) {
  connectionString = 'postgresql://postgres:imam173@localhost:5432/kursusdeh';
}

const pool = new Pool({ connectionString });

async function main() {
  console.log('Menghubungkan ke basis data...');
  const client = await pool.connect();

  try {
    // 1. Cek Kategori Bisnis & Karir (ID 5 atau slug bisnis-karir)
    const catRes = await client.query(`SELECT id, name FROM categories WHERE slug = 'bisnis-karir' OR id = 5 LIMIT 1`);
    if (catRes.rows.length === 0) {
      throw new Error('Kategori Bisnis & Karir tidak ditemukan di tabel categories!');
    }
    const catId = catRes.rows[0].id;
    console.log(`✓ Kategori ditemukan: ID ${catId} (${catRes.rows[0].name})`);

    // 2. Cek Guru (Ambil guru yang sudah approved)
    const teacherRes = await client.query(`SELECT id, name FROM users WHERE role = 'teacher' AND teacher_status = 'approved' ORDER BY id ASC LIMIT 1`);
    if (teacherRes.rows.length === 0) {
      throw new Error('Tidak ada guru dengan status approved!');
    }
    const teacherId = teacherRes.rows[0].id;
    console.log(`✓ Pengajar dipilih: ID ${teacherId} (${teacherRes.rows[0].name})`);

    // 3. Masukkan atau Perbarui Kursus Bisnis & Karir
    const courseSlug = 'manajemen-bisnis-dan-karir';
    const courseTitle = 'Dasar Manajemen Bisnis & Pengembangan Karir';
    const courseDesc = 'Pelajari fondasi pengelolaan bisnis modern, penyusunan Business Model Canvas (BMC), manajemen arus kas dasar, serta strategi membangun karir profesional yang cemerlang.';
    const thumbnailUrl = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80';

    const existingCourseRes = await client.query(`SELECT id FROM courses WHERE slug = $1`, [courseSlug]);

    let courseId;
    if (existingCourseRes.rows.length > 0) {
      courseId = existingCourseRes.rows[0].id;
      await client.query(`
        UPDATE courses 
        SET title = $1, description = $2, thumbnail_url = $3, category_id = $4, status = 'published', updated_at = NOW()
        WHERE id = $5
      `, [courseTitle, courseDesc, thumbnailUrl, catId, courseId]);
      console.log(`✓ Kursus ID ${courseId} diperbarui`);
    } else {
      const insertCourseRes = await client.query(`
        INSERT INTO courses (teacher_id, category_id, title, slug, description, thumbnail_url, level, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'pemula', 'published')
        RETURNING id
      `, [teacherId, catId, courseTitle, courseSlug, courseDesc, thumbnailUrl]);
      courseId = insertCourseRes.rows[0].id;
      console.log(`✓ Kursus baru dibuat dengan ID ${courseId}`);
    }

    // 4. Hapus materi lama untuk kursus ini jika ingin ditimpa dengan materi lengkap
    await client.query(`DELETE FROM materials WHERE course_id = $1`, [courseId]);

    // 5. Masukkan 4 Bab Materi Lengkap
    const contentBab1 = `Selamat datang di bab pertama kursus **Dasar Manajemen Bisnis & Pengembangan Karir**! Di bab pembuka ini, kita akan mempelajari bagaimana sebuah gagasan usaha dirumuskan menjadi model bisnis yang solid dan teruji.

### 1. Apa itu Bisnis Modern?
Bisnis pada hakikatnya adalah proses **menyelesaikan masalah orang lain secara menguntungkan dan berkelanjutan**. Bisnis yang sukses tidak berawal dari produk yang rumit, melainkan dari pemahaman mendalam terhadap kebutuhan atau rasa sakit (*pain point*) pelanggan.

Tiga pilar utama bisnis yang sehat:
1. **Penciptaan Nilai (Value Creation):** Menghadirkan solusi nyata yang dibutuhkan orang banyak.
2. **Pengiriman Nilai (Value Delivery):** Memastikan produk atau layanan sampai ke tangan pelanggan dengan kualitas konsisten.
3. **Penangkapan Nilai (Value Capture):** Menghasilkan pendapatan yang lebih besar daripada biaya operasional (profit).

---

### 2. Memahami 9 Blok Business Model Canvas (BMC)
*Business Model Canvas* (BMC) diciptakan oleh Alexander Osterwalder untuk memvisualisasikan seluruh komponen bisnis dalam satu lembar kerja ringkas:

1. **Customer Segments:** Siapa kelompok konsumen spesifik yang ingin Anda bantu?
2. **Value Propositions:** Solusi unik apa yang Anda tawarkan yang membedakan Anda dari kompetitor?
3. **Channels:** Melalui sarana apa Anda berkomunikasi dan mendistribusikan produk (misal: toko fisik, web e-commerce, media sosial)?
4. **Customer Relationships:** Bagaimana cara Anda menarik pelanggan baru dan mempertahankan pelanggan lama (*retention*)?
5. **Revenue Streams:** Dari mana saja uang masuk ke dalam kas bisnis Anda?
6. **Key Resources:** Aset apa saja yang wajib dimiliki (SDM, teknologi, modal, hak paten)?
7. **Key Activities:** Kegiatan operasional harian utama yang tidak boleh berhenti.
8. **Key Partnerships:** Pihak eksternal atau mitra strategis yang diajak bekerja sama (pemasok, logistik, payment gateway).
9. **Cost Structure:** Rincian seluruh pos pengeluaran terbesar untuk menjalankan model bisnis ini.

---

### 3. Studi Kasus Singkat: Kedai Kopi Modern
Bayangkan sebuah kedai kopi lokal yang ingin menyasar pekerja jarak jauh (*remote worker*):
- **Value Proposition:** Kopi berkualitas dengan koneksi internet cepat, colokan di setiap meja, dan suasana tenang untuk fokus kerja.
- **Customer Segment:** Freelancer, mahasiswa tingkat akhir, dan digital nomad usia 20-35 tahun.
- **Revenue Stream:** Penjualan kopi, makanan ringan, dan penyewaan ruang meeting mini per jam.

> **Tugas Refleksi:** Amati satu bisnis lokal di sekitar tempat tinggal Anda. Tuliskan apa nilai tambah unik (*Value Proposition*) utama yang membuat pelanggan terus kembali membeli produk mereka!`;

    const contentBab2 = `Banyak bisnis pemula gulung tikar bukan karena mereka tidak memiliki penjualan, melainkan karena kehabisan uang tunai (*cash flow insolvent*). Di bab ini, kita akan membedah dasar-dasar keuangan bisnis yang wajib dipahami oleh setiap pemilik usaha dan profesional.

---

### 1. Perbedaan Mendasar: Omset, Laba Kotor, dan Laba Bersih
Sering kali pemula terjebak merasa bisnisnya sangat maju karena omsetnya besar, padahal setelah dihitung sebenarnya merugi.

* **Omset (Revenue / Penjualan):** Total seluruh uang masuk dari transaksi penjualan sebelum dipotong biaya apa pun.
* **Harga Pokok Penjualan (HPP / COGS):** Biaya langsung yang dikeluarkan untuk membuat atau membeli produk (misal: bahan baku kopi, susu, kemasan gelas).
* **Laba Kotor (Gross Profit):** \`Omset - HPP\`.
* **Biaya Operasional (OPEX):** Biaya sewa tempat, gaji karyawan, listrik, wifi, dan pemasaran.
* **Laba Bersih (Net Profit):** \`Laba Kotor - Biaya Operasional - Pajak\`. Inilah keuntungan nyata yang menjadi hak bisnis Anda!

---

### 2. Manajemen Arus Kas (Cash Flow is King)
Arus kas mencatat kapan uang benar-benar masuk dan kapan uang keluar dari rekening bank bisnis Anda.

* **Arus Kas Positif:** Uang yang masuk ke rekening lebih banyak daripada uang yang dibayarkan keluar.
* **Arus Kas Negatif:** Uang keluar lebih cepat daripada uang masuk. Jika dibiarkan berlarut-larut, bisnis tidak akan mampu membayar tagihan dan gaji.

**Aturan Emas Mengelola Cash Flow:**
1. Pisahkan rekening pribadi dengan rekening bisnis sejak hari pertama.
2. Tagih piutang konsumen secepat mungkin dan negosiasikan termin pembayaran ke vendor/pemasok secara bijak.
3. Selalu siapkan dana darurat operasional (*runway cash*) minimal setara dengan 3 hingga 6 bulan pengeluaran rutin.

---

### 3. Strategi Penetapan Harga (Pricing Strategy)
Ada tiga pendekatan umum dalam menentukan harga jual:
* **Cost-Plus Pricing:** Menambahkan persentase margin keuntungan di atas biaya HPP (misal: HPP Rp20.000 + margin 50% = harga jual Rp30.000).
* **Competitor-Based Pricing:** Menetapkan harga mendekati rata-rata pemain lain di pasar yang sama.
* **Value-Based Pricing:** Menetapkan harga berdasarkan nilai dan manfaat emosional/finansial yang dirasakan pelanggan, bukan sekadar harga modal bahan.`;

    const contentBab3 = `Karir yang sukses bukan sekadar hasil dari keberuntungan, melainkan hasil dari perencanaan yang terarah, peningkatan kompetensi (*skill development*), dan pembangunan reputasi profesional.

---

### 1. Memetakan Keahlian Diri (Skill Matrix & T-Shaped Skills)
Di pasar kerja modern, profesional yang paling dicari adalah mereka yang memiliki profil **T-Shaped**:
* **Garis Horizontal (Broad Knowledge):** Memiliki pemahaman umum lintas disiplin (misal: paham dasar komunikasi, digital marketing, analitik data, dan cara kerja bisnis).
* **Garis Vertikal (Deep Expertise):** Memiliki satu atau dua keahlian khusus yang sangat mendalam dan ahli di bidangnya (misal: mahir frontend development atau copywriting).

---

### 2. Membangun Personal Branding di Era Digital
Personal brand adalah apa yang orang lain katakan tentang keahlian dan integritas Anda saat Anda tidak berada di dalam ruangan.

Langkah praktis membangun reputasi profesional:
1. **Optimasi Profil LinkedIn:** Gunakan foto profesional, tulis headline yang menjelaskan solusi yang bisa Anda berikan (contoh: *"Web Developer | Membantu UMKM Go-Digital"*), dan cantumkan pencapaian konkrit.
2. **Dokumentasikan Proses Belajar (Build in Public):** Bagikan studi kasus, proyek yang sedang Anda kerjakan, atau wawasan yang baru saja Anda pelajari di media sosial profesional.
3. **Portofolio Nyata:** Buktikan kemampuan Anda melalui karya nyata, sertifikat terverifikasi, atau kontribusi open-source.

---

### 3. Seni Komunikasi & Networking
* Networking bukan tentang membagikan kartu nama sebanyak-banyaknya, melainkan tentang **membangun hubungan timbal balik yang tulus**.
* Selalu tanyakan: *"Bagaimana saya bisa membantu proyek atau pekerjaan Anda saat ini?"* sebelum meminta bantuan orang lain.`;

    const contentBab4 = `Ide bisnis dan ambisi karir terbaik tidak akan bermakna tanpa kemampuan eksekusi yang konsisten. Bab terakhir ini akan membekali Anda dengan kerangka kerja produktivitas yang digunakan oleh perusahaan teknologi global seperti Google, Intel, dan Spotify.

---

### 1. Menetapkan Target dengan SMART Goals & OKRs
Banyak orang gagal mencapai target karena targetnya terlalu samar, misalnya *"Saya ingin sukses tahun ini"*. Gunakan prinsip **SMART**:
* **Specific:** Target harus jelas dan tidak bermakna ganda.
* **Measurable:** Memiliki indikator angka yang dapat diukur.
* **Achievable:** Realistis untuk dicapai dengan sumber daya yang ada.
* **Relevant:** Sejalan dengan tujuan jangka panjang bisnis atau karir Anda.
* **Time-bound:** Memiliki batas waktu (tenggat) yang tegas.

#### Kerangka Kerja OKR (Objectives & Key Results):
* **Objective (Kualitatif):** *"Meningkatkan kualitas pelayanan pelanggan aplikasi."*
* **Key Result 1 (Kuantitatif):** Menurunkan waktu respon customer care dari 30 menit menjadi di bawah 5 menit.
* **Key Result 2 (Kuantitatif):** Mencapai skor kepuasan pelanggan (CSAT) minimal 90% pada akhir kuartal.

---

### 2. Manajemen Waktu: Matriks Eisenhower
Kelompokkan tugas harian Anda ke dalam 4 kuadran:
1. **Penting & Mendesak (Do First):** Krisis yang harus segera diselesaikan hari ini.
2. **Penting & Tidak Mendesak (Schedule):** Inilah kunci kemajuan jangka panjang! Mencakup belajar skill baru, berolahraga, menyusun strategi bisnis, dan membangun networking. Jadwalkan waktu khusus di kalender Anda.
3. **Tidak Penting & Mendesak (Delegate):** Tugas administratif yang bisa didelegasikan atau diotomatisasi.
4. **Tidak Penting & Tidak Mendesak (Eliminate):** Scrolling media sosial tanpa tujuan, kebiasaan menunda-nunda.

---

### 3. Membangun Resiliensi & Growth Mindset
Dunia bisnis dan karir selalu berubah secara dinamis. Mereka yang terus bertahan dan menjadi pemimpin adalah mereka yang memandang kegagalan sebagai bahan evaluasi dan data pembelajaran, bukan sebagai akhir perjalanan.

**Selamat!** Anda telah menuntaskan seluruh modul fundamental bisnis dan pengembangan karir ini. Terapkan wawasan ini secara nyata pada usaha rintisan atau perjalanan profesi Anda!`;

    const materials = [
      { order: 1, title: 'Pengenalan Ekosistem Bisnis & Business Model Canvas (BMC)', content: contentBab1 },
      { order: 2, title: 'Manajemen Finansial Dasar & Pengelolaan Arus Kas (Cash Flow)', content: contentBab2 },
      { order: 3, title: 'Strategi Perencanaan Karir, Networking & Personal Branding', content: contentBab3 },
      { order: 4, title: 'Manajemen Waktu, Produktivitas, dan Eksekusi Target (SMART & OKR)', content: contentBab4 },
    ];

    for (const mat of materials) {
      await client.query(`
        INSERT INTO materials (course_id, title, content, order_number)
        VALUES ($1, $2, $3, $4)
      `, [courseId, mat.title, mat.content, mat.order]);
      console.log(`✓ Bab ${mat.order}: "${mat.title}" berhasil dimasukkan`);
    }

    console.log('--- Seluruh Materi Kursus Bisnis & Karir Berhasil Diterapkan! ---');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Terjadi kesalahan:', err);
  process.exit(1);
});
