import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth, getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT 
        fp.*,
        u.name as author_name,
        u.avatar as author_avatar,
        (SELECT COUNT(*)::int FROM comments WHERE post_id = fp.id) as comment_count
      FROM forum_posts fp
      JOIN users u ON fp.user_id = u.id
      ORDER BY fp.created_at DESC
    `);

    return NextResponse.json({ posts: result.rows });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO forum_posts (user_id, title, content) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [user.id, title, content]
    );

    const postWithAuthor = await pool.query(
      `SELECT fp.*, u.name as author_name, u.avatar as author_avatar
       FROM forum_posts fp
       JOIN users u ON fp.user_id = u.id
       WHERE fp.id = $1`,
      [result.rows[0].id]
    );

    return NextResponse.json({ post: postWithAuthor.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
