import { NextRequest, NextResponse } from 'next/server';
import { GalleryItem, PaginatedResponse, NewItemPayload } from '@/lib/types';

//mock data
// eslint-disable-next-line prefer-const
let mockData: GalleryItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  title: `Design Idea ${i + 1}`,
  imageUrl: `https://picsum.photos/seed/${i + 1}/400/300`,
  category: i % 2 === 0 ? 'Abstract' : 'Nature',
  likes: 100 + i * 5,
  tags: i % 3 === 0 ? ['modern', 'simple'] : ['vibrant', 'complex'],
  description: `This is a detailed description for design idea ${i + 1}.`,
  createdAt: new Date(Date.now() - (i * 3600000)).toISOString(), // Mock creation date
}));

// --- GET: Fetch, Pagination ---
export async function GET(request: NextRequest) {
  // Lấy tham số page
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10; // Giới hạn 10 item/trang

  // Giả lập độ trễ mạng
  await new Promise(resolve => setTimeout(resolve, 500)); 

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = mockData.slice(startIndex, endIndex);

  return NextResponse.json({
    data: results,
    nextPage: endIndex < mockData.length ? page + 1 : null, // Tính toán trang kế tiếp
  } as PaginatedResponse<GalleryItem>);
}

// --- POST: Create New Item ---
export async function POST(request: NextRequest) {
  const payload: NewItemPayload = await request.json();

  // Kiểm tra validation cơ bản
  if (!payload.title || !payload.imageUrl || !payload.category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newItem: GalleryItem = {
    ...payload,
    id: Date.now().toString(), // Mock ID dựa trên timestamp
    likes: 0,
    createdAt: new Date().toISOString(), // Thời điểm tạo
  };

  // Thêm item mới vào đầu mảng mockData (giả lập lưu vào DB)
  mockData.unshift(newItem); 

  return NextResponse.json(newItem, { status: 201 });
}
