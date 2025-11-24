# Weather Forecast - Setup Database & API

## 🗄️ Tài khoản test

### Admin Account
- **Email**: `admin@weather.com`
- **Password**: `password123`
- **Role**: Admin (có thể quản lý products, xóa posts)

### User Accounts
- **Email**: `user@weather.com`
- **Password**: `password123`
- **Role**: User

- **Email**: `user2@weather.com`
- **Password**: `password123`
- **Role**: User

## 🚀 Hướng dẫn Setup

### 1. Khởi động Database với Docker

```bash
# Khởi động PostgreSQL container
docker-compose up -d

# Kiểm tra container đang chạy
docker ps

# Xem logs nếu cần
docker-compose logs postgres
```

### 2. Cài đặt Dependencies (đã xong)

```bash
yarn install
```

### 3. Khởi động Development Server

```bash
yarn dev
```

Website sẽ chạy tại: http://localhost:3000

### 4. Dừng Database

```bash
# Dừng containers
docker-compose down

# Dừng và xóa data (cẩn thận!)
docker-compose down -v
```

## 📊 Database Schema

### Tables:
- **users**: Quản lý người dùng và admin
- **products**: Sản phẩm bán hàng
- **forum_posts**: Bài viết trong forum
- **comments**: Bình luận trong forum
- **product_reviews**: Đánh giá sản phẩm
- **sessions**: Quản lý session đăng nhập

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products?category=Thời%20trang` - Lọc theo category
- `POST /api/products` - Tạo sản phẩm mới (Admin only)
- `PUT /api/products/[id]` - Cập nhật sản phẩm (Admin only)
- `DELETE /api/products/[id]` - Xóa sản phẩm (Admin only)

### Forum
- `GET /api/forum/posts` - Lấy danh sách bài viết
- `POST /api/forum/posts` - Tạo bài viết mới (Cần login)
- `GET /api/forum/posts/[id]` - Lấy chi tiết bài viết và comments
- `DELETE /api/forum/posts/[id]` - Xóa bài viết (Owner hoặc Admin)
- `POST /api/forum/comments` - Thêm comment (Cần login)

## 🔐 Phân quyền

### User (role: 'user')
- Đăng nhập, đăng ký
- Xem products, forum
- Tạo bài viết và comment
- Xóa bài viết/comment của mình

### Admin (role: 'admin')
- Tất cả quyền của User
- Tạo, sửa, xóa sản phẩm
- Xóa bất kỳ bài viết/comment nào

## 🧪 Test API với curl

### Đăng nhập
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@weather.com","password":"password123"}' \
  -c cookies.txt
```

### Tạo sản phẩm mới (Admin)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Sản phẩm test",
    "description": "Mô tả",
    "price": 100000,
    "image": "🎁",
    "link": "https://example.com",
    "category": "Phụ kiện"
  }'
```

### Tạo bài viết mới
```bash
curl -X POST http://localhost:3000/api/forum/posts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Bài viết test",
    "content": "Nội dung bài viết"
  }'
```

## 📝 Sample Data

Database đã được seed với:
- 3 users (1 admin, 2 users)
- 8 products
- 3 forum posts
- 4 comments

## 🔧 Kết nối Database trực tiếp

```bash
# Sử dụng psql
docker exec -it weather-forecast-db psql -U postgres -d weather_forecast

# Hoặc sử dụng GUI tool như:
# - pgAdmin
# - DBeaver
# - TablePlus

# Connection info:
# Host: localhost
# Port: 5432
# Database: weather_forecast
# Username: postgres
# Password: postgres123
```

## ⚠️ Lưu ý

1. File `.env.local` chứa cấu hình quan trọng
2. Trong production, đổi JWT_SECRET và password database
3. Data sẽ được lưu trong Docker volume `postgres_data`
4. File init.sql sẽ tự động chạy khi khởi tạo database lần đầu
