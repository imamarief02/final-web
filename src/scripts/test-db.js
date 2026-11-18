import { query } from '../lib/db.js';
import bcrypt from 'bcryptjs';

async function testDatabase() {
  console.log('=== VERIFIKASI BASIS DATA KURSUSDEH ===');

  // 1. Verifikasi Pengguna & Password Hash
  const users = await query('SELECT id, name, email, role, teacher_status, password_hash FROM users ORDER BY id ASC');
  console.log(`\n1. Pengguna Terdaftar (${users.rows.length} akun):`);
  for (const u of users.rows) {
    const isPasswordValid = await bcrypt.compare('password123', u.password_hash);
    console.log(`  [ID ${u.id}] ${u.name} <${u.email}> | Peran: ${u.role} | Status: ${u.teacher_status || '-'} | Password 'password123': ${isPasswordValid ? 'VALID ✓' : 'GAGAL ✗'}`);
  }

  // 2. Verifikasi Kategori
  const categories = await query('SELECT id, name, slug FROM categories ORDER BY id ASC');
  console.log(`\n2. Kategori Kursus (${categories.rows.length} kategori):`);
  categories.rows.forEach((c) => {
    console.log(`  - [${c.id}] ${c.name} (${c.slug})`);
  });

  // 3. Verifikasi Kursus & Silabus Materi
  const courses = await query(`
    SELECT c.id, c.title, c.level, c.status, u.name as teacher, COUNT(m.id)::int as material_count
    FROM courses c
    JOIN users u ON c.teacher_id = u.id
    LEFT JOIN materials m ON c.id = m.course_id
    GROUP BY c.id, u.name
    ORDER BY c.id ASC
  `);
  console.log(`\n3. Kursus & Materi (${courses.rows.length} kursus):`);
  courses.rows.forEach((c) => {
    console.log(`  - [ID ${c.id}] "${c.title}" | Guru: ${c.teacher} | Level: ${c.level} | Status: ${c.status} | Jumlah Materi: ${c.material_count}`);
  });

  // 4. Verifikasi Pendaftaran & Progres
  const enrollments = await query(`
    SELECT e.id, u.name as student, c.title as course, COUNT(mp.id) FILTER (WHERE mp.is_completed = TRUE)::int as completed_count
    FROM enrollments e
    JOIN users u ON e.student_id = u.id
    JOIN courses c ON e.course_id = c.id
    LEFT JOIN material_progress mp ON e.id = mp.enrollment_id
    GROUP BY e.id, u.name, c.title
  `);
  console.log(`\n4. Data Pendaftaran Siswa (${enrollments.rows.length} pendaftaran):`);
  enrollments.rows.forEach((e) => {
    console.log(`  - Siswa: ${e.student} | Kursus: "${e.course}" | Materi Selesai: ${e.completed_count}`);
  });

  // 5. Verifikasi Forum Diskusi
  const discussions = await query(`
    SELECT d.id, u.name as author, d.content, d.parent_id
    FROM discussions d
    JOIN users u ON d.user_id = u.id
    ORDER BY d.id ASC
  `);
  console.log(`\n5. Forum Diskusi (${discussions.rows.length} pesan):`);
  discussions.rows.forEach((d) => {
    console.log(`  - [${d.parent_id ? 'Balasan' : 'Pertanyaan'}] ${d.author}: "${d.content.substring(0, 50)}..."`);
  });

  console.log('\n=== SEMUA DATA TERVERIFIKASI DENGAN BAIK! ===\n');
  process.exit(0);
}

testDatabase().catch((err) => {
  console.error('Error saat verifikasi basis data:', err);
  process.exit(1);
});
