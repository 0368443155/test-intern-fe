# Explore Gallery

## 1. Chức năng đã thực hiện được

* **Explore Page (`/`):** Lưới card responsive, Tìm kiếm (debounce 300ms)
* **Tạo ảnh mới (`/create`):**  
    ```bash
    Tạo ảnh mới  
    Chọn ảnh từ máy để tải lên HOẶC dán link ảnh từ website
    Điền tiêu đề ảnh  
    Chọn danh mục cho ảnh
    Gắn tags
    Nhập description
    Sau khi bấm tạo ảnh thì ảnh mới sẽ được đưa lên đầu danh sách ảnh

## 2. Hướng dẫn Cài đặt & Chạy

1.  **Clone repository:**
    git clone https://github.com/0368443155/test-intern-fe
    cd explore-gallery
2.  **Cài đặt dependencies:**
    ```bash
    npm install  
    npm install swr  
    npm install -D vitest @testing-library/react @testing-library/jest-dom playwright  
    npx playwright install # Cài đặt trình duyệt  

3.  **Khởi động server phát triển:**
    npm run dev

Dự án sẽ chạy tại: **`http://localhost:3000`**.

## 3. Deploy:
Dự án đã được deploy lên Vercel tại: https://test-intern-fe-snowy.vercel.app/


