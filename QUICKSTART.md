# Quick Start Guide - Weather Forecast

## 📋 Checklist Setup

- [ ] Docker Desktop đã cài đặt và đang chạy
- [ ] Node.js và Yarn đã cài đặt
- [ ] Clone/Download project code

## 🚀 3 Bước Setup Nhanh

### Bước 1: Cài đặt packages
```bash
yarn install
```

### Bước 2: Khởi động Database
```bash
./setup-database.sh
```

Hoặc:
```bash
docker-compose up -d
```

### Bước 3: Chạy Website
```bash
yarn dev
```

→ Mở http://localhost:3000

## 🔑 Login Test

Vào http://localhost:3000/login

**Admin Account:**
```
Email: admin@weather.com
Password: password123
```

**User Account:**
```
Email: user@weather.com  
Password: password123
```

## ✅ Test Tính Năng

### Với Admin:
1. Login bằng admin@weather.com
2. Vào /products → Có thể thêm/sửa/xóa sản phẩm (tính năng sẽ cần UI admin)
3. Vào /forum → Có thể xóa bất kỳ bài viết nào

### Với User:
1. Login bằng user@weather.com
2. Vào /forum → Tạo bài viết mới
3. Comment vào bài viết
4. Xóa bài viết/comment của mình
5. Vào /products → Xem sản phẩm

### Không login:
1. Xem thời tiết ở trang chủ (dữ liệu thật từ Open Meteo API)
2. Xem danh sách forum (không tạo được bài viết)
3. Xem products (không mua được)

## 📊 Database GUI (Optional)

Nếu muốn xem database:

**Sử dụng TablePlus/DBeaver/pgAdmin:**
```
Host: localhost
Port: 5432
Database: weather_forecast
Username: postgres
Password: postgres123
```

**Hoặc psql trong terminal:**
```bash
docker exec -it weather-forecast-db psql -U postgres -d weather_forecast
```

## 🐛 Troubleshooting

### Database không kết nối được?
```bash
# Kiểm tra Docker container
docker ps

# Xem logs
docker-compose logs postgres

# Restart lại
docker-compose restart
```

### Port 5432 đã được sử dụng?
```bash
# Kiểm tra process nào đang dùng port
lsof -i :5432

# Kill process hoặc đổi port trong docker-compose.yml
```

### Reset lại database?
```bash
# Stop và xóa tất cả data
docker-compose down -v

# Start lại để tạo mới
docker-compose up -d
```

## 📁 Files Quan Trọng

- `docker-compose.yml` - Cấu hình Docker
- `database/init.sql` - Schema và sample data
- `.env.local` - Biến môi trường
- `lib/db.ts` - Database connection
- `lib/auth.ts` - Authentication helpers
- `app/api/*` - API routes

## 🎯 Next Steps

1. Tích hợp UI quản lý sản phẩm cho Admin
2. Thêm trang user profile với thống kê
3. Upload ảnh cho avatar và products
4. Pagination cho forum và products
5. Search và filter nâng cao
6. Email verification
7. Forgot password
8. Real-time notifications với WebSocket

## 📞 Support

Nếu gặp vấn đề, check:
1. DATABASE_SETUP.md - Hướng dẫn chi tiết
2. Docker logs: `docker-compose logs`
3. Next.js console trong terminal
