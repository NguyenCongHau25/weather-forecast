-- Create tables for Weather Forecast App

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT,
    link VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum posts table
CREATE TABLE forum_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product reviews table
CREATE TABLE product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for authentication
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin and user accounts
-- Password for both: password123
-- Password for all users: password123
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@weather.com', '$2b$10$NPl3ovw777obUAN1zE1O9eV0rzqN6Jw92yETSgHA/Jf9b1bj873Cu', 'Admin', 'admin'),
('user@weather.com', '$2b$10$NPl3ovw777obUAN1zE1O9eV0rzqN6Jw92yETSgHA/Jf9b1bj873Cu', 'Nguyễn Văn A', 'user'),
('user2@weather.com', '$2b$10$NPl3ovw777obUAN1zE1O9eV0rzqN6Jw92yETSgHA/Jf9b1bj873Cu', 'Trần Thị B', 'user');

-- Insert sample products
INSERT INTO products (name, description, price, image, link, category, rating) VALUES
('Áo chống nắng UV cao cấp', 'Áo chống nắng với công nghệ UV Protection, thoáng mát và co giãn tốt', 299000, '☂️', 'https://example.com/product1', 'Thời trang', 4.5),
('Ô dù tự động cao cấp', 'Ô dù tự động mở/đóng, chống UV, chống thấm nước tốt', 450000, '🌂', 'https://example.com/product2', 'Phụ kiện', 4.8),
('Nón tai bèo chống nắng', 'Nón tai bèo vành rộng, chất liệu vải thoáng mát', 150000, '👒', 'https://example.com/product3', 'Phụ kiện', 4.3),
('Kem chống nắng SPF 50+', 'Kem chống nắng phổ rộng, không gây bết dính, thích hợp mọi loại da', 250000, '🧴', 'https://example.com/product4', 'Sức khỏe', 4.7),
('Kính mát chống UV400', 'Kính mát thời trang với khả năng chống tia UV tối ưu', 350000, '🕶️', 'https://example.com/product5', 'Phụ kiện', 4.6),
('Bình giữ nhiệt 1L', 'Bình giữ nhiệt inox 304, giữ lạnh 24h, giữ nóng 12h', 199000, '🧊', 'https://example.com/product6', 'Sức khỏe', 4.9),
('Áo khoác dù chống thấm', 'Áo khoác dù nhẹ, chống thấm nước, dễ gấp gọn', 399000, '🧥', 'https://example.com/product7', 'Thời trang', 4.4),
('Kem dưỡng da sau nắng', 'Kem dưỡng phục hồi da sau tiếp xúc với ánh nắng', 180000, '🧴', 'https://example.com/product8', 'Sức khỏe', 4.2);

-- Insert sample forum posts
INSERT INTO forum_posts (user_id, title, content, likes) VALUES
(2, 'Thời tiết Sài Gòn hôm nay nóng quá!', 'Hôm nay trời nóng lên đến 35 độ, mọi người nhớ uống đủ nước và hạn chế ra ngoài vào giữa trưa nhé. Có ai biết khi nào mưa không?', 15),
(3, 'Cách phòng tránh nắng nóng hiệu quả', 'Chia sẻ một số tips phòng tránh nắng nóng: 1) Uống nhiều nước, 2) Mặc quần áo sáng màu, 3) Đội mũ/nón khi ra ngoài, 4) Tránh hoạt động ngoài trời từ 11h-15h.', 28),
(2, 'Dự báo mưa cuối tuần này', 'Theo dự báo thời tiết, cuối tuần này sẽ có mưa rào và giông. Mọi người chuẩn bị ô dù nhé!', 10);

-- Insert sample comments
INSERT INTO comments (post_id, user_id, content, likes) VALUES
(1, 3, 'Dự báo chiều nay có mưa rải rác đấy bạn!', 5),
(1, 2, 'Cảm ơn bạn đã chia sẻ!', 2),
(2, 2, 'Rất hữu ích, cảm ơn bạn!', 8),
(3, 3, 'Tốt quá, mình sẽ chuẩn bị kỹ!', 3);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
