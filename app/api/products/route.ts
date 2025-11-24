import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = 'SELECT * FROM products ORDER BY created_at DESC';
    const params: any[] = [];

    if (category && category !== 'Tất cả') {
      query = 'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC';
      params.push(category);
    }

    const result = await pool.query(query, params);

    return NextResponse.json({ products: result.rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const { name, description, price, image, link, category, rating } = await request.json();

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO products (name, description, price, image, link, category, rating) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, image || '📦', link || '#', category, rating || 0]
    );

    return NextResponse.json({ product: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
