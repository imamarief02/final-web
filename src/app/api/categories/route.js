import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT c.id, c.name, c.slug, c.description,
              COUNT(co.id) FILTER (WHERE co.status = 'published') AS course_count
       FROM categories c
       LEFT JOIN courses co ON c.id = co.category_id
       GROUP BY c.id, c.name, c.slug, c.description
       ORDER BY c.name ASC`
    );

    return NextResponse.json({ categories: result.rows });
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kategori.' },
      { status: 500 }
    );
  }
}
