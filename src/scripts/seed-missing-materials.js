import { query } from '../lib/db.js';

async function seedMissingMaterials() {
  console.log('--- Mulai Mengisi Materi Kursus yang Masih Kosong ---');

  try {
    // 1. Perbarui Materi 3 di Kursus 2 (Mastering Tailwind CSS) - ID 10
    const contentTailwind3 = `Tipografi dan pewarnaan adalah dua aspek visual yang paling menentukan kenyamanan membaca dan identitas sebuah antarmuka web. Di bab ini, kita akan mempelajari bagaimana Tailwind CSS menyediakan skala tipografi dan palet warna yang sangat terstruktur.

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

\`\`\`html
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
\`\`\`

4. Tips Aksesibilitas Tipografi:
Selalu pastikan kontras antara warna teks dan warna latar belakang cukup kontras (rasio minimal 4.5:1 untuk teks normal) agar tulisan Anda mudah dibaca oleh seluruh kalangan pengguna.`;

    await query(
      `UPDATE materials 
       SET title = $1, content = $2 
       WHERE id = 10`,
      ['Tipografi, Pewarnaan, & Desain Komponen', contentTailwind3]
    );
    console.log('✓ Materi Kursus 2 (Bab 3) berhasil diperbarui');

    // Tambah Materi 4 Kursus 2 jika belum ada
    const checkC2M4 = await query(`SELECT id FROM materials WHERE course_id = 2 AND order_number = 4`);
    if (checkC2M4.rows.length === 0) {
      const contentTailwind4 = `Interaktivitas adalah hal yang membedakan web modern dari dokumen statis. Di bab ini, kita akan mempelajari interaksi komponen dengan state pseudo-class seperti hover, focus, dan animasi transisi halus.

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

\`\`\`html
<button class="px-6 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-teal-200 cursor-pointer">
  Simpan Perubahan
</button>
\`\`\`

3. Ringkasan:
Kombinasi transisi yang halus dan state hover yang responsif memberikan umpan balik (feedback) langsung kepada pengguna bahwa elemen tersebut siap untuk diklik.`;

      await query(
        `INSERT INTO materials (course_id, title, content, order_number)
         VALUES (2, $1, $2, 4)`,
        ['Interaktivitas Komponen & Animasi Transisi', contentTailwind4]
      );
      console.log('✓ Materi Kursus 2 (Bab 4) berhasil ditambahkan');
    }

    // 2. Perbarui Materi Kursus 3 (Dasar Riset UI/UX & Wireframing) - ID 7 & 8
    const contentUIUX1 = `Desain antarmuka (UI) dan pengalaman pengguna (UX) yang sukses berakar dari pemahaman mendalam tentang kebutuhan dan pola pikir manusia yang akan menggunakannya. Prinsip ini dikenal sebagai Human-Centered Design (Desain Berpusat pada Manusia).

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
Estetika visual hanyalah kulit luar. Fondasi sejati dari produk digital yang dicintai jutaan orang adalah kemampuannya menyelesaikan masalah nyata dengan sesedikit mungkin kebingungan.`;

    await query(
      `UPDATE materials 
       SET title = $1, content = $2 
       WHERE id = 7`,
      ['Prinsip Dasar Desain Berpusat pada Pengguna (Human-Centered)', contentUIUX1]
    );
    console.log('✓ Materi Kursus 3 (Bab 1) berhasil diperbarui');

    const contentUIUX2 = `Sebelum menuangkan warna, tipografi mewah, dan ilustrasi rumit, seorang perancang produk digital selalu memulai dari Wireframe. Wireframe adalah cetak biru (blueprint) hitam-putih yang memetakan tata letak informasi.

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
Ambil selembar kertas dan pulpen. Sketsakan antarmuka sebuah aplikasi pencari kursus dengan 1 hero section dan 3 kartu materi. Pastikan tombol utama terlihat paling mencolok dibanding elemen lain!`;

    await query(
      `UPDATE materials 
       SET title = $1, content = $2 
       WHERE id = 8`,
      ['Merancang Wireframe & Arsitektur Informasi', contentUIUX2]
    );
    console.log('✓ Materi Kursus 3 (Bab 2) berhasil diperbarui');

    // Tambah Materi 3 Kursus 3 jika belum ada
    const checkC3M3 = await query(`SELECT id FROM materials WHERE course_id = 3 AND order_number = 3`);
    if (checkC3M3.rows.length === 0) {
      const contentUIUX3 = `Aksesibilitas (Accessibility / a11y) dan sistem desain adalah jaminan bahwa aplikasi Anda dapat digunakan dengan nyaman oleh semua orang, termasuk mereka yang memiliki keterbatasan fisik, penglihatan, atau berada di bawah terik sinar matahari.

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

Dengan memadukan empati riset, wireframe yang rapi, dan kepatuhan pada aksesibilitas, Anda siap merancang produk digital kelas dunia!`;

      await query(
        `INSERT INTO materials (course_id, title, content, order_number)
         VALUES (3, $1, $2, 3)`,
        ['Prinsip Aksesibilitas & Komponen Desain Nyata', contentUIUX3]
      );
      console.log('✓ Materi Kursus 3 (Bab 3) berhasil ditambahkan');
    }

    // 3. Tambah Materi Kursus 4 (Analisis Data Python untuk Pemula) - ID Course: 4
    const checkC4 = await query(`SELECT COUNT(*)::int as count FROM materials WHERE course_id = 4`);
    if (checkC4.rows[0].count === 0) {
      const c4m1 = `Selamat datang di Kursus Analisis Data dengan Python! Python saat ini merupakan bahasa pemrograman paling populer di dunia untuk ilmu data (Data Science), kecerdasan buatan (AI), dan otomatisasi pengolahan data.

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

\`\`\`python
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
\`\`\`

3. Lingkungan Kerja Analisis Data:
Dalam dunia profesional, praktisi data banyak menggunakan Jupyter Notebook atau Google Colaboratory karena memungkinkan kita menjalankan kode per-sel blok sambil melihat tabel dan grafik secara instan.`;

      const c4m2 = `Pandas adalah pustaka Python yang paling krusial bagi seorang data analyst. Jika Anda terbiasa menggunakan Microsoft Excel atau Google Sheets, anggaplah Pandas sebagai spreadsheet canggih berbasis kode yang mampu memproses jutaan baris data dalam hitungan detik.

1. Dua Struktur Data Inti di Pandas:
• Series: Kolom tunggal data 1 dimensi (seperti satu kolom di Excel).
• DataFrame: Tabel data 2 dimensi lengkap dengan baris dan kolom yang memiliki label nama.

2. Membaca dan Menginspeksi Data:

\`\`\`python
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

print("\n--- Ringkasan Statistik Angka ---")
print(df.describe())

print("\n--- Informasi Tipe Data Kolom ---")
print(df.info())
\`\`\`

3. Memfilter dan Memilih Data:
\`\`\`python
# Memfilter siswa yang nilainya di atas 80
siswa_unggul = df[df["Nilai_Ujian"] > 80]
print(siswa_unggul[["Nama", "Nilai_Ujian"]])

# Menghitung rata-rata nilai per kota
rata_per_kota = df.groupby("Kota")["Nilai_Ujian"].mean()
print(rata_per_kota)
\`\`\`

Dengan beberapa baris kode Pandas di atas, Anda sudah bisa melakukan agregasi dan penyaringan data yang kompleks secara otomatis.`;

      const c4m3 = `Dalam kenyataan di lapangan, data mentah yang kita terima dari survei, sensor, atau database hampir tidak pernah 100% bersih. Seringkali terdapat data kosong (missing values), data duplikat, atau format teks yang berantakan.

1. Menemukan Data Kosong (NaN / Null)
Langkah pertama adalah memeriksa berapa banyak sel kosong di setiap kolom:

\`\`\`python
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
\`\`\`

2. Strategi Menangani Data Kosong:
• Menghapus Baris Kosong (\`df.dropna()\`): Cocok jika jumlah data yang hilang sangat sedikit dan tidak mempengaruhi kesimpulan.
• Mengisi Nilai Kosong (\`df.fillna()\` / Imputasi): Mengisi sel kosong dengan nilai rata-rata (mean), median, atau nilai default seperti 0.

\`\`\`python
# Mengisi harga kosong dengan median harga produk
median_harga = df["Harga"].median()
df["Harga"] = df["Harga"].fillna(median_harga)

# Mengisi jumlah terjual kosong dengan angka 0
df["Terjual"] = df["Terjual"].fillna(0)
\`\`\`

3. Menghapus Data Duplikat:
Data pencatatan ganda sering terjadi saat sistem input bermasalah:
\`\`\`python
# Menghapus baris yang identik kembar
df = df.drop_duplicates()
print(df)
\`\`\`

Data yang bersih adalah syarat mutlak sebelum melangkah ke tahap visualisasi grafik dan pemodelan prediktif.`;

      const c4m4 = `Grafik visual bernilai seribu kata. Kemampuan menyajikan temuan data ke dalam bentuk visualisasi yang jelas dan mudah dipahami oleh orang non-teknis adalah keterampilan utama seorang Data Analyst.

1. Matplotlib & Seaborn
• Matplotlib: Pustaka dasar visualisasi grafik di Python yang sangat fleksibel.
• Seaborn: Pustaka tingkat tinggi berbasis Matplotlib yang menghasilkan grafik modern dan estetis dengan sedikit baris kode.

2. Memilih Jenis Grafik yang Tepat:
• Diagram Batang (Bar Chart): Menampilkan perbandingan antar kategori (misal: total penjualan per cabang).
• Diagram Garis (Line Chart): Menampilkan tren pergerakan nilai sepanjang waktu (time series).
• Histogram: Menampilkan sebaran frekuensi data (distribusi normal, kemiringan).
• Diagram Sebar (Scatter Plot): Menemukan korelasi atau hubungan antara dua variabel angka.

Contoh Kode Pembuatan Visualisasi:

\`\`\`python
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
\`\`\`

Selamat! Anda telah menguasai alur kerja hulu ke hilir seorang praktisi data: Mulai dari memahami Python dasar, mengolah tabel dengan Pandas, membersihkan data kotor, hingga meracik grafik visual yang siap dipresentasikan.`;

      await query(
        `INSERT INTO materials (course_id, title, content, order_number) VALUES
         (4, 'Pengenalan Python & Lingkungan Sains Data', $1, 1),
         (4, 'Manipulasi Tabel Data Menggunakan Pandas', $2, 2),
         (4, 'Teknik Pembersihan Data (Data Cleaning)', $3, 3),
         (4, 'Visualisasi Data Grafis dengan Matplotlib & Seaborn', $4, 4)`,
        [c4m1, c4m2, c4m3, c4m4]
      );
      console.log('✓ Materi Kursus 4 (4 Bab) berhasil ditambahkan');
    }

    // 4. Tambah Materi Kursus 5 (Percakapan Bahasa Inggris Sehari-hari) - ID Course: 5
    const checkC5 = await query(`SELECT COUNT(*)::int as count FROM materials WHERE course_id = 5`);
    if (checkC5.rows[0].count === 0) {
      const c5m1 = `Welcome to Everyday English Conversation! Di bab pertama ini, kita akan membongkar rasa ragu dan gugup saat harus memulai percakapan bahasa Inggris dalam situasi perkenalan dan obrolan santai (small talk).

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
Fokuslah pada kelancaran komunikasi dan pesan yang ingin Anda sampaikan, bukan pada ketakutan salah tata bahasa (grammar). Penutur asli sangat menghargai usaha Anda untuk berkomunikasi!`;

      const c5m2 = `Saat bepergian ke luar negeri atau berinteraksi di lingkungan wisata internasional, kemampuan memesan makanan di kafe/restoran serta menanyakan petunjuk arah jalan adalah keterampilan paling praktis yang wajib Anda kuasai.

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
Cobalah ucapkan dengan lantang pesanan menu makan siang favorit Anda dalam bahasa Inggris menggunakan pola "Could I have [makanan], and a glass of [minuman], please?"`;

      const c5m3 = `Dalam dunia karir global dan kerja jarak jauh (remote work), komunikasi profesional saat rapat (meeting), menyampaikan gagasan, dan menyetujui atau menolak ide rekan kerja membutuhkan tata bahasa yang diplomatis dan konstruktif.

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

Congratulations! Anda telah mempelajari keterampilan percakapan esensial dari perkenalan sosial, situasi perjalanan praktis, hingga komunikasi profesional di lingkungan kerja.`;

      await query(
        `INSERT INTO materials (course_id, title, content, order_number) VALUES
         (5, 'Percakapan Perkenalan & Memulai Obrolan Santai (Small Talk)', $1, 1),
         (5, 'Memesan Makanan & Menanyakan Petunjuk Arah', $2, 2),
         (5, 'Komunikasi Profesional & Diskusi Tim dalam Pekerjaan', $3, 3)`,
        [c5m1, c5m2, c5m3]
      );
      console.log('✓ Materi Kursus 5 (3 Bab) berhasil ditambahkan');
    }

    console.log('--- Seluruh Materi Kursus Berhasil Dilengkapi! ---');
  } catch (err) {
    console.error('Terjadi kesalahan saat mengisi materi:', err);
    process.exit(1);
  }
}

seedMissingMaterials().then(() => process.exit(0));
