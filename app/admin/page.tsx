'use client';

import { useEffect, useState } from 'react';
import {
  UserOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  RiseOutlined,
} from '@ant-design/icons';

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalProducts: number;
  totalComments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPosts: 0,
    totalProducts: 0,
    totalComments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Tổng Users',
      value: stats.totalUsers,
      icon: <UserOutlined className="text-3xl" />,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Forum Posts',
      value: stats.totalPosts,
      icon: <FileTextOutlined className="text-3xl" />,
      color: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: <ShoppingOutlined className="text-3xl" />,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Comments',
      value: stats.totalComments,
      icon: <RiseOutlined className="text-3xl" />,
      color: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-xl ${card.color}`}>
                <div className={card.textColor}>{card.icon}</div>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {card.title}
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '...' : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Hoạt động gần đây
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserOutlined className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                Hệ thống đang hoạt động bình thường
              </p>
              <p className="text-xs text-gray-500">Cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
