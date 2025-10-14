import { NextRequest, NextResponse } from 'next/server';
import { GalleryItem, PaginatedResponse } from '@/lib/types';

// --- MOCK DATA (40 items) ---
const mockData: GalleryItem[] = Array.from({ length: 40 }, (_, i) => ({
  id: String(i + 1),
  title: `Design Idea ${i + 1}`,
  imageUrl: `https://picsum.photos/seed/${i + 1}/400/300`,
  category: i % 2 === 0 ? 'Abstract' : 'Nature',
  likes: 100 + i * 5,
}));


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