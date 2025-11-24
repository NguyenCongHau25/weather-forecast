'use client';

import { useState } from 'react';
import { 
  ShoppingOutlined, 
  StarFilled,
  LinkOutlined,
  FilterOutlined,
} from '@ant-design/icons';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  link: string;
  category: string;
}

// Mock products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Áo chống nắng UV cao cấp',
    description: 'Áo chống nắng với công nghệ UV Protection, thoáng mát và co giãn tốt',
    price: 299000,
    rating: 4.5,
    image: '☂️',
    link: '#',
    category: 'Thời trang',
  },
  {
    id: '2',
    name: 'Ô dù tự động cao cấp',
    description: 'Ô dù tự động mở/đóng, chống UV, chống thấm nước tốt',
    price: 450000,
    rating: 4.8,
    image: '🌂',
    link: '#',
    category: 'Phụ kiện',
  },
  {
    id: '3',
    name: 'Nón tai bèo chống nắng',
    description: 'Nón tai bèo vành rộng, chất liệu vải thoáng mát',
    price: 150000,
    rating: 4.3,
    image: '👒',
    link: '#',
    category: 'Phụ kiện',
  },
  {
    id: '4',
    name: 'Kem chống nắng SPF 50+',
    description: 'Kem chống nắng phổ rộng, không gây bết dính, thích hợp mọi loại da',
    price: 250000,
    rating: 4.7,
    image: '🧴',
    link: '#',
    category: 'Sức khỏe',
  },
  {
    id: '5',
    name: 'Kính mát chống UV400',
    description: 'Kính mát thời trang với khả năng chống tia UV tối ưu',
    price: 350000,
    rating: 4.6,
    image: '🕶️',
    link: '#',
    category: 'Phụ kiện',
  },
  {
    id: '6',
    name: 'Bình giữ nhiệt 1L',
    description: 'Bình giữ nhiệt inox 304, giữ lạnh 24h, giữ nóng 12h',
    price: 199000,
    rating: 4.9,
    image: '🧊',
    link: '#',
    category: 'Sức khỏe',
  },
];

const categories = ['Tất cả', 'Thời trang', 'Phụ kiện', 'Sức khỏe'];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  
  const filteredProducts = selectedCategory === 'Tất cả' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          <ShoppingOutlined className="mr-3" />
          Sản phẩm tiện ích
        </h1>
        <p className="text-gray-600 text-lg">
          Các sản phẩm hỗ trợ bảo vệ bạn khỏi thời tiết khắc nghiệt
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-2">
        <div className="flex items-center text-gray-600">
          <FilterOutlined className="mr-2" />
          <span className="font-medium">Danh mục:</span>
        </div>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
          >
            {/* Product Image */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-48 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform">
              {product.image}
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                  {product.name}
                </h3>
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <StarFilled className="text-yellow-400 mr-1" />
                <span className="font-semibold text-gray-800">{product.rating}</span>
                <span className="text-gray-500 text-sm ml-1">(128 đánh giá)</span>
              </div>

              {/* Price & Link */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Giá chỉ từ</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {product.price.toLocaleString('vi-VN')}₫
                  </p>
                </div>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LinkOutlined />
                  <span>Xem</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Không có sản phẩm trong danh mục này</p>
        </div>
      )}

      {/* Banner */}
      {/* <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">Ưu đãi đặc biệt!</h2>
        <p className="text-xl mb-4">Giảm giá lên đến 30% cho sản phẩm chống nắng</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Khám phá ngay
        </button>
      </div> */}
    </div>
  );
}
