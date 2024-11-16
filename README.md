# Dự Án Twitter Clone

## 1. Mô Tả Dự Án

Dự án này là một phiên bản đơn giản hóa của Twitter, được xây dựng bằng Node.js và Express cho backend, sử dụng MongoDB làm cơ sở dữ liệu. Mục tiêu chính là cho phép người dùng tạo tài khoản, đăng tweet, theo dõi người khác, và tương tác với nội dung thông qua lượt thích và bình luận.

## 2. Tính Năng Chính

- **Xác thực người dùng**: Đăng ký, đăng nhập, thay đổi mật khẩu, đặt lại mật khẩu.
- **Quản lý hồ sơ cá nhân**: Cập nhật thông tin người dùng, hình đại diện, tiểu sử.
- **Tweet**: Tạo, xóa, chỉnh sửa tweet.
- **Like**: Thích các tweet của người khác.
- **Bình luận**: Bình luận trên các tweet.
- **Theo dõi người dùng**: Theo dõi và hủy theo dõi người dùng khác.
- **Thông báo**: Nhận thông báo khi có người theo dõi, tạo bài đăng hoặc thích tweet của mình.

## 3. Kiến Trúc Hệ Thống

Dự án sử dụng mô hình MVC (Model-View-Controller), bao gồm:

- **Models**: Định nghĩa các schema cho người dùng, tweet, thông báo, bình luận và các mối quan hệ giữa người dùng.
- **Controllers**: Xử lý logic cho các thao tác như đăng ký, đăng nhập, đăng tweet, và theo dõi người dùng.
- **Views**: Sử dụng JSON để trả về dữ liệu cho client (REST API).
- **Routes**: Định tuyến các API cho các chức năng của hệ thống.
- **Middlewares**: Quản lý xác thực JWT, phân quyền và xử lý lỗi.

## 4. Công Nghệ Sử Dụng

- **Ngôn ngữ lập trình**: Node.js
- **Framework**: Express.js
- **Cơ sở dữ liệu**: MongoDB
- **Thư viện hỗ trợ**:
  - Mongoose (ORM cho MongoDB)
  - JWT (JSON Web Token cho xác thực)
  - bcrypt (Mã hóa mật khẩu)
  - dotenv (Quản lý biến môi trường)
  - Cloudinary (Lưu trữ đám mây cho hình ảnh và video)
  - Multer (Middleware cho việc tải file)
  - Cookie-Parser (Phân tích và quản lý cookies)
  - CORS (Hỗ trợ yêu cầu giữa các nguồn gốc khác nhau)
  - Nodemailer (Gửi email xác thực)
  - Joi (Xác thực dữ liệu)

## 5. Hướng Dẫn Cài Đặt

### Các bước để cài đặt và chạy dự án:
1. Clone repository:
   ```bash
   git clone https://github.com/haidangsondev/Twitter_clone
   ```
2. Cài đặt các gói cần thiết:
   ```bash
   npm install
   ```
3. Tạo file `.env` và cấu hình các biến môi trường:
- PORT = 7000
- URL_MONGODB = your_url_mongodb
- URL_SERVER = http://localhost:7000
- URL_CLIENT =  http://localhost:3000
- APP_PASSWORD = your_app_password for email 
- EMAIL_NAME = your_email
- JWT_SECRETKEY = your_jwt_secretkey
- CLOUDINARY_NAME = your_cloudinary_name
- CLOUDINARY_KEY = your_cloudinary_key
- CLOUDINARY_SECRET = your_cloudinary_secret

4. Chạy dự án:
- npm run dev
   ```bash
   "dev": "nodemon index.js"
   ```
5. Truy cập hệ thống qua đường dẫn:
   ```
   http://localhost:7000
   ```
## 6 Kết luận
Dự án Twitter Clone này cho phép người dùng đăng tweet, theo dõi, thích và bình luận, tạo một nền tảng xã hội đơn giản tương tự như Twitter. Trong tương lai, dự án có thể mở rộng thêm các tính năng quản lý thông báo chi tiết hơn và giao diện người dùng trực quan.
