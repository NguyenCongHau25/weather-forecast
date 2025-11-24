# Weather Forecast 🌤️

Dự án website dự báo thời tiết full-stack được xây dựng với Next.js, TypeScript, Tailwind CSS, PostgreSQL và Docker.

## 🔐 Tài khoản Test

### Admin
- **Email**: `admin@weather.com`
- **Password**: `password123`
- Có thể quản lý sản phẩm, xóa bài viết bất kỳ

### User
- **Email**: `user@weather.com` hoặc `user2@weather.com`
- **Password**: `password123`
- Tạo bài viết, bình luận, xem sản phẩm

## 🌟 Tính năng

### 1. Trang chủ (Home)
- Dashboard hiển thị thông tin thời tiết hiện tại
- Cards thông số: nhiệt độ, độ ẩm, tốc độ gió, áp suất, tầm nhìn, UV index
- Biểu đồ nhiệt độ 24 giờ với Recharts
- Biểu đồ dự báo 7 ngày
- Thông tin bổ sung: mây che phủ, giờ mặt trời mọc/lặn

### 2. Forum
- Đăng bài viết mới
- Thảo luận và bình luận
- Tương tác: like, comment
- Hiển thị thời gian đăng bài

### 3. Sản phẩm (Products)
- Danh sách sản phẩm với filter theo danh mục
- Thông tin sản phẩm: tên, giá, rating, mô tả
- Link đến sản phẩm
- Banner quảng cáo

### 4. Xác thực (Auth)
- Trang đăng nhập
- Trang đăng ký
- Trang profile người dùng
- Chỉnh sửa thông tin cá nhân

## 🚀 Bắt đầu

### 1. Cài đặt dependencies

```bash
yarn install
```

### 2. Khởi động Database

**Yêu cầu**: Docker Desktop phải được cài đặt và đang chạy

```bash
# Cách 1: Sử dụng script tự động
./setup-database.sh

# Cách 2: Thủ công
docker-compose up -d
```

Database sẽ tự động:
- Tạo bảng
- Import sample data
- Tạo tài khoản admin và user

### 3. Chạy development server

```bash
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### 4. Dừng Database (khi không dùng)

```bash
docker-compose down
```

### Build production

```bash
yarn build
```

### Chạy production server

```bash
yarn start
```

## 📁 Cấu trúc thư mục

```
weather-forecast/
├── app/                    # App Router pages
│   ├── page.tsx           # Trang chủ
│   ├── forum/             # Trang forum
│   ├── products/          # Trang sản phẩm
│   ├── login/             # Trang đăng nhập
│   ├── register/          # Trang đăng ký
│   ├── profile/           # Trang profile
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Header navigation
│   ├── Footer.tsx         # Footer
│   ├── WeatherCard.tsx    # Weather info card
│   ├── TemperatureChart.tsx
│   └── WeeklyForecast.tsx
├── types/                 # TypeScript types
│   └── index.ts
├── utils/                 # Utility functions
├── lib/                   # Libraries
└── public/               # Static files
```

## 🛠️ Công nghệ sử dụng

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [@ant-design/icons](https://ant.design/components/icon)
- **Charts**: [Recharts](https://recharts.org/)
- **Date handling**: [date-fns](https://date-fns.org/)

### Backend
- **Database**: PostgreSQL 15
- **ORM**: pg (node-postgres)
- **Authentication**: JWT + bcrypt
- **API**: Next.js API Routes
- **Container**: Docker & Docker Compose

### Weather API
- **Provider**: [Open Meteo](https://open-meteo.com/) (Free, no API key required)

## 📝 Ghi chú

- Hiện tại dự án sử dụng mock data. Bạn có thể tích hợp API thời tiết thực như:
  - [OpenWeatherMap API](https://openweathermap.org/api)
  - [WeatherAPI](https://www.weatherapi.com/)
  - [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api)

- Để tích hợp authentication thật, bạn có thể sử dụng:
  - [NextAuth.js](https://next-auth.js.org/)
  - [Supabase Auth](https://supabase.com/docs/guides/auth)
  - [Firebase Auth](https://firebase.google.com/docs/auth)

## 🎨 Tùy chỉnh

Bạn có thể tùy chỉnh màu sắc và theme trong file `tailwind.config.ts`.

## 📄 License

MIT
