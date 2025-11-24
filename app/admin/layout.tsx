'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (!data.user || data.user.role !== 'admin') {
        router.push('/login');
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/admin',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Quản lý Users',
      path: '/admin/users',
    },
    {
      key: '/admin/forum',
      icon: <FileTextOutlined />,
      label: 'Quản lý Forum',
      path: '/admin/forum',
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: 'Quản lý Products',
      path: '/admin/products',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingOutlined className="text-6xl text-blue-500" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } flex flex-col fixed left-0 top-0 bottom-0 z-50 overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🌤️</div>
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? (
              <MenuUnfoldOutlined className="text-xl" />
            ) : (
              <MenuFoldOutlined className="text-xl" />
            )}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <UserOutlined className="text-xl" />
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.key}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-800 p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-lg"
          >
            <HomeOutlined className="text-xl" />
            {!collapsed && <span>Về trang chủ</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white transition-colors rounded-lg"
          >
            <LogoutOutlined className="text-xl" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto h-screen transition-all duration-300 ${
        collapsed ? 'ml-20' : 'ml-64'
      }`}>
        {children}
      </main>
    </div>
  );
}
