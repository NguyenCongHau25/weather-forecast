'use client';

import { 
  GithubOutlined, 
  TwitterOutlined, 
  FacebookOutlined,
  MailOutlined 
} from '@ant-design/icons';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Weather Forecast</h3>
            <p className="text-gray-300">
              Nền tảng dự báo thời tiết chính xác và cộng đồng chia sẻ kinh nghiệm về thời tiết.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-blue-400">Trang chủ</a></li>
              <li><a href="/forum" className="hover:text-blue-400">Forum</a></li>
              <li><a href="/products" className="hover:text-blue-400">Sản phẩm</a></li>
              <li><a href="/about" className="hover:text-blue-400">Về chúng tôi</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kết nối</h3>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FacebookOutlined />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <GithubOutlined />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <MailOutlined />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>2025 Weather Forecast</p>
        </div>
      </div>
    </footer>
  );
}
