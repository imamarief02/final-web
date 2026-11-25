import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET() {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const result = await query(
      `SELECT c.id, c.name, c.slug, c.description,
              COUNT(co.id)::int AS total_courses
       FROM categories c
       LEFT JOIN courses co ON c.id = co.category_id
       GROUP BY c.id
       ORDER BY c.name ASC`
    );

    return NextResponse.json({ categories: result.rows });
  } catch (error) {
    console.error('Admin categories GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil kategori.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { name, description = '' } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Nama kategori wajib diisi.' },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    // Cek duplikasi
    const dupCheck = await query('SELECT id FROM categories WHERE slug = $1 OR name = $2', [slug, name.trim()]);
    if (dupCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Kategori dengan nama atau slug ini sudah ada.' },
        { status: 409 }
      );
    }

    const insertRes = await query(
      `INSERT INTO categories (name, slug, description)
       VALUES ($1, $2, $3)
       RETURNING id, name, slug, description`,
      [name.trim(), slug, description.trim() || null]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Kategori berhasil ditambahkan.',
        category: insertRes.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin categories POST Error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan kategori.' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { id, name, description } = await request.json();

    if (!id || !name || !name.trim()) {
      return NextResponse.json(
        { error: 'ID dan nama kategori wajib diisi.' },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    // Cek duplikasi nama atau slug pada kategori lain
    const dupCheck = await query(
      'SELECT id FROM categories WHERE (slug = $1 OR name = $2) AND id <> $3',
      [slug, name.trim(), id]
    );
    if (dupCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Kategori dengan nama atau slug ini sudah digunakan oleh kategori lain.' },
        { status: 409 }
      );
    }

    const updateRes = await query(
      `UPDATE categories
       SET name = $1, slug = $2, description = $3
       WHERE id = $4
       RETURNING id, name, slug, description`,
      [name.trim(), slug, description ? description.trim() : null, id]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Kategori berhasil diperbarui.',
      category: updateRes.rows[0],
    });
  } catch (error) {
    console.error('Admin categories PUT Error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui kategori.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'), 10);

    if (!id) {
      return NextResponse.json(
        { error: 'ID kategori wajib disertakan.' },
        { status: 400 }
      );
    }

    // Aturan Bisnis BR-07: Kategori yang masih terikat kursus tidak boleh dihapus
    const courseCountRes = await query(
      `SELECT COUNT(id)::int AS count FROM courses WHERE category_id = $1`,
      [id]
    );

    const courseCount = courseCountRes.rows[0].count;
    if (courseCount > 0) {
      return NextResponse.json(
        { error: `Kategori tidak dapat dihapus karena masih terhubung dengan ${courseCount} kursus.` },
        { status: 400 }
      );
    }

    await query(`DELETE FROM categories WHERE id = $1`, [id]);

    return NextResponse.json({
      success: true,
      message: 'Kategori berhasil dihapus.',
    });
  } catch (error) {
    console.error('Admin categories DELETE Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kategori.' },
      { status: 500 }
    );
  }
}
