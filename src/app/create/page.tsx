'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { NewItemPayload, GalleryItem, PaginatedResponse } from '@/lib/types'; 
import React from 'react';

const CATEGORIES = ['Động vật', 'Thiên nhiên', 'Người mẫu', 'Thiết kế', 'Khác'];

export default function CreateItemPage() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [formData, setFormData] = useState<NewItemPayload>({
    title: '',
    imageUrl: '', //url hoặc base64
    category: '',
    tags: [],
    description: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //state lưu tên file
  const [fileName, setFileName] = useState<string | null>(null); 

  //hàm xử lý input
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'imageUrl') {
        //nếu là url thì reset fileName và imageUrl
        setFileName(null);
        setFormData({ ...formData, [name]: value });
        
        // reset input file
        const fileInput = document.getElementById('imageFile') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

    } else if (name === 'tags') {
      // chuỗi tags thành mảng, loại bỏ khoảng trắng
      setFormData({ ...formData, [name]: value.split(',').map(t => t.trim()).filter(Boolean) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // input file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData(prev => ({ ...prev, imageUrl: '' })); // reset url/base64 cũ
    setFileName(null); // reset tên file cũ
    setError(null);

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('File bắt buộc là ảnh.');
        e.target.value = ''; // reset input file
        return;
      }
      
      // xóa url nhập tay khi chọn file
      setFormData(prev => ({ ...prev, imageUrl: '' }));

      const reader = new FileReader();
      
      reader.onloadend = () => {
        //lưu base64 vào imageUrl
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        setFileName(file.name);
      };

      reader.onerror = () => {
          setError('Không thể đọc file, vui lòng thử lại.');
      };

      reader.readAsDataURL(file); 
    } else {
        // nếu bỏ chọn file thì reset cả 2
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client Validation
    // Kiểm tra: Phải có Title, Category VÀ (có URL hoặc có Base64)
    if (!formData.title || !formData.category || !formData.imageUrl) {
      setError('Title, Category, and an Image Source (URL or File) are required.'); 
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. POST API (Gửi URL hoặc Base64 string trong field imageUrl)
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create item');
      }

      const newItem: GalleryItem = await response.json();
      
      // 2. Optimistic Update và Invalidate Cache của Explore Page
      const firstPageKey = '/api/gallery?page=1'; 

      mutate(firstPageKey, (currentData: PaginatedResponse<GalleryItem> | undefined) => {
          if (!currentData) return currentData;
          
          const updatedData = [newItem, ...currentData.data];
          const limitedData = updatedData.slice(0, 10);
          
          return {
              ...currentData,
              data: limitedData,
          };
      }, {
          revalidate: true 
      });

      // 3. Redirect về trang chủ ('/')
      router.push('/'); 
      
    } catch (err) {
      console.error(err);
      setError('Tạo ảnh mới thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logic kiểm tra xem phương thức nào đang được chọn
  const isUrlSelected = !!formData.imageUrl && !formData.imageUrl.startsWith('data:image');
  const isFileSelected = !!fileName;
  
  // Kiểm tra trạng thái tải lên Base64
  const isBase64Ready = !!formData.imageUrl && formData.imageUrl.startsWith('data:image');


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Tạo ảnh mới</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
        
        {/* Lỗi chung */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* --- Lựa chọn 1: Image URL --- */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">1. URL ảnh (dán link ảnh)</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            // Hiển thị URL nếu nó không phải Base64
            value={isUrlSelected ? formData.imageUrl : ''} 
            onChange={handleTextChange} 
            placeholder="Dán link ảnh tại đây (vd: https://picsum.photos/400/300)"
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 text-gray-900" 
            // Vô hiệu hóa nếu file đang được chọn/tải lên
            disabled={isSubmitting || isFileSelected || isBase64Ready} 
          />
        </div>
        
        <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">HOẶC</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        {/* --- Lựa chọn 2: Image File Upload --- */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">2. Tải lên ảnh (Từ máy tính)</label>
          <input
            id="imageFile"
            name="imageFile"
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            // disable nếu đang submit hoặc URL đang được nhập
            disabled={isSubmitting || isUrlSelected} 
            key={fileName || 'file-input'} // dùng key để reset input file khi chuyển chế độ
          />
          {fileName && (
            <p className="mt-2 text-sm text-green-600"> File đã tải lên: {fileName}</p>
          )}
        </div>
        
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tiêu đề ảnh (*)</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleTextChange} 
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" 
            disabled={isSubmitting}
          />
        </div>

        {/* Category (Select) */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Danh mục ảnh (*)</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleTextChange} 
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 bg-white appearance-none text-gray-900" 
            disabled={isSubmitting}
          >
            <option value="">-- Chọn danh mục --</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Nhãn</label>
          <input
            id="tags"
            name="tags"
            value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
            onChange={handleTextChange} 
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 text-gray-900" 
            disabled={isSubmitting}
          />
        </div>
        
        {/* Mô tả */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleTextChange} 
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 text-gray-900" 
            disabled={isSubmitting}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.imageUrl} // disable nếu chưa có ảnh
          className="w-full py-3 px-4 rounded-xl shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Item'}
        </button>
      </form>
    </div>
  );
}
