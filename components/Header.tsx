'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  HomeOutlined,
  CommentOutlined,
  ShoppingOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Trang chủ', href: '/', icon: <HomeOutlined /> },
    { name: 'Forum', href: '/forum', icon: <CommentOutlined /> },
    { name: 'Sản phẩm', href: '/products', icon: <ShoppingOutlined /> },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="container mx-auto bg-white/70 backdrop-blur-lg rounded-full shadow-lg px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">🌤️</div>
            <span className="text-xl font-bold text-gray-800">Weather Forecast</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors ${
                  isActive(item.href)
                    ? 'text-coral-500 font-bold'
                    : 'text-gray-600 hover:text-coral-500 font-medium'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    <SettingOutlined className="text-lg" />
                    <span>Quản lý</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors text-gray-700"
                >
                  <UserOutlined className="text-lg" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 px-3 py-2 rounded-full transition-colors"
                  title="Đăng xuất"
                >
                  <LogoutOutlined className="text-lg" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-coral-500 transition-colors font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors font-medium shadow-md"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 py-2 hover:text-blue-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-3 border-t border-white/20 space-y-2">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 py-2 text-red-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <SettingOutlined className="text-lg" />
                      <span>Quản lý</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserOutlined className="text-lg" />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 py-2 text-red-600 w-full text-left"
                  >
                    <LogoutOutlined className="text-lg" />
                    <span>Đăng xuất</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="block bg-white text-blue-600 px-4 py-2 rounded-lg text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
