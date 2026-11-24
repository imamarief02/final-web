-- Skema Basis Data KursusDeh (PostgreSQL 3NF - 9 Tabel Utama)
-- Acuan: PRD.md Bagian 5.1

DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS material_progress CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS course_status CASCADE;
DROP TYPE IF EXISTS course_level CASCADE;
DROP TYPE IF EXISTS teacher_state CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

CREATE TYPE user_role      AS ENUM ('admin','teacher','student');
CREATE TYPE teacher_state  AS ENUM ('pending','approved','rejected');
CREATE TYPE course_level   AS ENUM ('pemula','menengah','lanjutan');
CREATE TYPE course_status  AS ENUM ('draft','published');

CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  role           user_role NOT NULL DEFAULT 'student',
  teacher_status teacher_state,
  bio            TEXT,
  avatar_url     TEXT,
  approved_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_teacher_status CHECK (
    (role = 'teacher' AND teacher_status IS NOT NULL) OR
    (role <> 'teacher' AND teacher_status IS NULL))
);

CREATE TABLE sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL UNIQUE,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE courses (
  id            SERIAL PRIMARY KEY,
  teacher_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title         VARCHAR(150) NOT NULL,
  slug          VARCHAR(180) NOT NULL UNIQUE,
  description   TEXT NOT NULL,
  thumbnail_url TEXT,
  level         course_level  NOT NULL DEFAULT 'pemula',
  status        course_status NOT NULL DEFAULT 'draft',
  start_date    DATE,
  end_date      DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE materials (
  id           SERIAL PRIMARY KEY,
  course_id    INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title        VARCHAR(150) NOT NULL,
  content      TEXT NOT NULL,
  order_number INT NOT NULL CHECK (order_number > 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, order_number)
);

CREATE TABLE enrollments (
  id           SERIAL PRIMARY KEY,
  student_id   INT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  course_id    INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE (student_id, course_id)
);

CREATE TABLE material_progress (
  id            SERIAL PRIMARY KEY,
  enrollment_id INT NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  material_id   INT NOT NULL REFERENCES materials(id)   ON DELETE CASCADE,
  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  UNIQUE (enrollment_id, material_id)
);

CREATE TABLE discussions (
  id          SERIAL PRIMARY KEY,
  material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  user_id     INT NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
  parent_id   INT REFERENCES discussions(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE certificates (
  id               SERIAL PRIMARY KEY,
  enrollment_id    INT NOT NULL UNIQUE REFERENCES enrollments(id) ON DELETE CASCADE,
  certificate_code VARCHAR(30) NOT NULL UNIQUE,
  issued_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indeks Performa
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_status   ON courses(status);
CREATE INDEX idx_enroll_student   ON enrollments(student_id);
CREATE INDEX idx_disc_material    ON discussions(material_id);
