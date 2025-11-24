'use client';

import { useState } from 'react';
import { 
  LikeOutlined, 
  CommentOutlined, 
  UserOutlined,
  PlusOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  title: string;
  content: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
}

// Mock data
const mockPosts: Post[] = [
  {
    id: '1',
    author: { name: 'Nguyễn Văn A' },
    title: 'Thời tiết Sài Gòn hôm nay nóng quá!',
    content: 'Hôm nay trời nóng lên đến 35 độ, mọi người nhớ uống đủ nước và hạn chế ra ngoài vào giữa trưa nhé. Có ai biết khi nào mưa không?',
    createdAt: new Date('2025-11-24T10:30:00'),
    likes: 15,
    comments: [
      {
        id: '1-1',
        author: { name: 'Trần Thị B' },
        content: 'Dự báo chiều nay có mưa rải rác đấy bạn!',
        createdAt: new Date('2025-11-24T11:00:00'),
        likes: 5,
      },
    ],
  },
  {
    id: '2',
    author: { name: 'Lê Văn C' },
    title: 'Cách phòng tránh nắng nóng hiệu quả',
    content: 'Chia sẻ một số tips phòng tránh nắng nóng: 1) Uống nhiều nước, 2) Mặc quần áo sáng màu, 3) Đội mũ/nón khi ra ngoài, 4) Tránh hoạt động ngoài trời từ 11h-15h.',
    createdAt: new Date('2025-11-23T14:20:00'),
    likes: 28,
    comments: [],
  },
];

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post: Post = {
        id: Date.now().toString(),
        author: { name: 'Người dùng' },
        title: newPost.title,
        content: newPost.content,
        createdAt: new Date(),
        likes: 0,
        comments: [],
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '' });
      setShowNewPostForm(false);
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleAddComment = (postId: string) => {
    const commentContent = commentInputs[postId];
    if (commentContent) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `${postId}-${Date.now()}`,
            author: { name: 'Người dùng' },
            content: commentContent,
            createdAt: new Date(),
            likes: 0,
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      }));
      setCommentInputs({ ...commentInputs, [postId]: '' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Forum Thời Tiết</h1>
          <p className="text-gray-600 mt-2">Chia sẻ và thảo luận về thời tiết</p>
        </div>
        <button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors shadow-md"
        >
          <PlusOutlined />
          <span>Đăng bài mới</span>
        </button>
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Tạo bài viết mới</h3>
          <input
            type="text"
            placeholder="Tiêu đề..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Nội dung bài viết..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-3">
            <button
              onClick={handleCreatePost}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Đăng bài
            </button>
            <button
              onClick={() => setShowNewPostForm(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
            {/* Post Header */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                <UserOutlined />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{post.author.name}</h3>
                <p className="text-sm text-gray-500">
                  {format(post.createdAt, 'dd MMMM yyyy, HH:mm', { locale: vi })}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

            {/* Post Actions */}
            <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleLikePost(post.id)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
              >
                <LikeOutlined className="text-xl" />
                <span>{post.likes}</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <CommentOutlined className="text-xl" />
                <span>{post.comments.length}</span>
              </div>
            </div>

            {/* Comments Section */}
            {post.comments.length > 0 && (
              <div className="mt-6 space-y-4 pl-4 border-l-2 border-gray-200">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
                      <UserOutlined />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-800">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(comment.createdAt, 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="mt-4 flex space-x-3">
              <input
                type="text"
                placeholder="Viết bình luận..."
                value={commentInputs[post.id] || ''}
                onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <SendOutlined />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
