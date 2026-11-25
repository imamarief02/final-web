import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgresql://postgres:imam173@localhost:5432/kursusdeh' });

async function syncTeachers() {
  console.log('Menyelaraskan guru dan kursus...');

  // 1. Pindahkan Siti Rahmawati (ID 3) ke Kursus UI/UX (ID 3)
  await pool.query(`UPDATE courses SET teacher_id = 3, updated_at = NOW() WHERE id = 3`);
  console.log('✓ Siti Rahmawati (Spesialis UI/UX) dipindahkan ke Kursus ID 3 (Dasar Riset UI/UX & Wireframing)');

  // 2. Buat atau perbarui Pengajar Data Science (Fajar Ramadhan, S.Stat., M.Kom)
  const dsEmail = 'fajar@kursusdeh.com';
  let dsTeacher = await pool.query(`SELECT id FROM users WHERE email = $1`, [dsEmail]);
  let dsTeacherId;
  if (dsTeacher.rows.length === 0) {
    const res = await pool.query(`
      INSERT INTO users (name, email, password_hash, role, teacher_status, bio, approved_at)
      VALUES (
        'Fajar Ramadhan, S.Stat., M.Kom',
        $1,
        '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe',
        'teacher',
        'approved',
        'Praktisi Data Scientist, Machine Learning Engineer, dan Konsultan Analisis Data.',
        NOW()
      )
      RETURNING id
    `, [dsEmail]);
    dsTeacherId = res.rows[0].id;
    console.log(`✓ Pengajar Data Science dibuat dengan ID ${dsTeacherId}`);
  } else {
    dsTeacherId = dsTeacher.rows[0].id;
    await pool.query(`
      UPDATE users 
      SET name = 'Fajar Ramadhan, S.Stat., M.Kom',
          role = 'teacher',
          teacher_status = 'approved',
          bio = 'Praktisi Data Scientist, Machine Learning Engineer, dan Konsultan Analisis Data.',
          approved_at = COALESCE(approved_at, NOW())
      WHERE id = $1
    `, [dsTeacherId]);
  }

  // Set Pengajar untuk Kursus 4 (Python / Data Science)
  await pool.query(`UPDATE courses SET teacher_id = $1, updated_at = NOW() WHERE id = 4`, [dsTeacherId]);
  console.log(`✓ Kursus ID 4 (Analisis Data Python) diampu oleh Fajar Ramadhan (ID ${dsTeacherId})`);

  // 3. Buat atau perbarui Pengajar Bahasa Asing (Sarah Wijaya, M.Pd)
  const langEmail = 'sarah@kursusdeh.com';
  let langTeacher = await pool.query(`SELECT id FROM users WHERE email = $1`, [langEmail]);
  let langTeacherId;
  if (langTeacher.rows.length === 0) {
    const res = await pool.query(`
      INSERT INTO users (name, email, password_hash, role, teacher_status, bio, approved_at)
      VALUES (
        'Sarah Wijaya, M.Pd',
        $1,
        '$2b$10$hhtW/Xihn16kfjR0k41ty.bV7fwDRGpupmIbLRwJS79V9AlgHShxe',
        'teacher',
        'approved',
        'Instruktur Bahasa Asing bersertifikasi TEFL dengan pengalaman mengajar komunikasi profesional lebih dari 7 tahun.',
        NOW()
      )
      RETURNING id
    `, [langEmail]);
    langTeacherId = res.rows[0].id;
    console.log(`✓ Pengajar Bahasa Asing dibuat dengan ID ${langTeacherId}`);
  } else {
    langTeacherId = langTeacher.rows[0].id;
    await pool.query(`
      UPDATE users 
      SET name = 'Sarah Wijaya, M.Pd',
          role = 'teacher',
          teacher_status = 'approved',
          bio = 'Instruktur Bahasa Asing bersertifikasi TEFL dengan pengalaman mengajar komunikasi profesional lebih dari 7 tahun.',
          approved_at = COALESCE(approved_at, NOW())
      WHERE id = $1
    `, [langTeacherId]);
  }

  // Set Pengajar untuk Kursus 5 (Bahasa Inggris)
  await pool.query(`UPDATE courses SET teacher_id = $1, updated_at = NOW() WHERE id = 5`, [langTeacherId]);
  console.log(`✓ Kursus ID 5 (Percakapan Bahasa Inggris) diampu oleh Sarah Wijaya (ID ${langTeacherId})`);

  // 4. Pastikan Kursus 1 & 2 diampu oleh Budi Santoso (ID 2 - Web Dev)
  await pool.query(`UPDATE courses SET teacher_id = 2, updated_at = NOW() WHERE id IN (1, 2)`);
  console.log('✓ Kursus ID 1 & 2 diampu oleh Budi Santoso (Web Developer)');

  // 5. Pastikan Kursus 6 diampu oleh Rian Pratama (ID 11 - Bisnis & Karir)
  await pool.query(`UPDATE courses SET teacher_id = 11, updated_at = NOW() WHERE id = 6`);
  console.log('✓ Kursus ID 6 diampu oleh Rian Pratama (Bisnis & Karir)');

  // Verifikasi Hasil Akhir
  const finalCheck = await pool.query(`
    SELECT c.id, c.title, cat.name as kategori, u.name as pengajar, u.bio as bio_pengajar
    FROM courses c
    JOIN categories cat ON c.category_id = cat.id
    JOIN users u ON c.teacher_id = u.id
    ORDER BY c.id
  `);

  console.log('\n=== HASIL PENYELARASAN PENGAJAR & KURSUS ===');
  console.table(finalCheck.rows);

  await pool.end();
}

syncTeachers().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
