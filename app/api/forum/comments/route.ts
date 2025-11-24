import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const { postId, content } = await request.json();

    if (!postId || !content) {
      return NextResponse.json(
        { error: 'Post ID and content are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [postId, user.id, content]
    );

    const commentWithAuthor = await pool.query(
      `SELECT c.*, u.name as author_name, u.avatar as author_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [result.rows[0].id]
    );

    return NextResponse.json({ comment: commentWithAuthor.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
