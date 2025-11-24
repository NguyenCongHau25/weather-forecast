import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    // Get total users
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total posts
    const postsResult = await pool.query('SELECT COUNT(*) FROM forum_posts');
    const totalPosts = parseInt(postsResult.rows[0].count);

    // Get total products
    const productsResult = await pool.query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(productsResult.rows[0].count);

    // Get total comments
    const commentsResult = await pool.query('SELECT COUNT(*) FROM comments');
    const totalComments = parseInt(commentsResult.rows[0].count);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalPosts,
        totalProducts,
        totalComments,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
