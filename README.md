# Explore Gallery

## 1. Chức năng đã thực hiện được

* **Explore Page (`/`):** 
    ```bash
    Lưới card responsive  
    Tìm kiếm theo tên, danh mục  
    Sắp xếp theo thời gian tạo (mới nhất)
    Sắp xếp theo mức độ yêu thích (số likes)
    Số lượng hiển thị ban đầu quy định là 10, tổng số là 35, khi lướt xuống quá 10 phần tử thì sẽ tự động render thêm cho đến khi hết
* **Item Detail (`/item/[id]`):** 
    ```bash
    Hiển thị ảnh lớn  
    Hiển tên, lượt thích, description, thời gian tạo, tags
    Hiển thị những ảnh cùng danh mục  
* **Tạo ảnh mới (`/create`):**  
    ```bash
    Tạo ảnh mới  
    Chọn ảnh từ máy để tải lên HOẶC dán link ảnh từ website
    Điền tiêu đề ảnh  
    Chọn danh mục cho ảnh
    Gắn tags
    Nhập description
    Sau khi tạo ảnh thì ảnh mới sẽ được đưa lên đầu danh sách ảnh
    Điều hướng sang trang Item Detail

## 2. Hướng dẫn Cài đặt & Chạy

1.  **Clone repository:**
    git clone https://github.com/0368443155/test-intern-fe
    cd explore-gallery
2.  **Cài đặt dependencies:**
    ```bash
    npm install  
    npm install swr
    npm install lucide-react
    npm install -D vitest @testing-library/react @testing-library/jest-dom playwright  
    npx playwright install # Cài đặt trình duyệt  

3.  **Khởi động server phát triển:**
    npm run dev

Dự án sẽ chạy tại: **`http://localhost:3000`**.

## 3. Deploy:
Dự án đã được deploy lên Vercel tại: https://test-intern-fe-snowy.vercel.app/


