-- 1. DATA AWAL PENGGUNA (Password semua akun: password123)
INSERT INTO pengguna (nama_pengguna, email, kata_sandi, peran, status_guru, disetujui_pada)
VALUES 
    ('admin_pusat', 'admin@kursusdeh.com', '$2a$10$wT0XkO0eP91vN.rM5nB3I.nN9gWzLqg37I73k/p6EwFk0R1K6z6sS', 'admin', NULL, NULL),
    ('budi_teacher', 'teacher@kursusdeh.com', '$2a$10$wT0XkO0eP91vN.rM5nB3I.nN9gWzLqg37I73k/p6EwFk0R1K6z6sS', 'teacher', 'approved', NOW()),
    ('siti_calon_guru', 'calonguru@kursusdeh.com', '$2a$10$wT0XkO0eP91vN.rM5nB3I.nN9gWzLqg37I73k/p6EwFk0R1K6z6sS', 'student', 'pending', NULL),
    ('andi_student', 'student@kursusdeh.com', '$2a$10$wT0XkO0eP91vN.rM5nB3I.nN9gWzLqg37I73k/p6EwFk0R1K6z6sS', 'student', NULL, NULL)
ON CONFLICT (email) DO NOTHING;

-- 2. DATA AWAL KATEGORI
INSERT INTO kategori (nama_kategori)
VALUES 
    ('Web Development'),
    ('Data Science'),
    ('UI/UX Design')
ON CONFLICT (nama_kategori) DO NOTHING;