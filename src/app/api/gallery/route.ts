import { NextRequest, NextResponse } from 'next/server';
import { GalleryItem, NewItemPayload } from '@/lib/types';
// Import dữ liệu từ tệp riêng
import { mockData } from '@/lib/data';

// --- GET: Lấy danh sách, tìm kiếm, lọc, sắp xếp ---
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sort') || 'latest';
    const limit = parseInt(searchParams.get('limit') || '10');
    const excludeId = searchParams.get('exclude');

    let filteredData = [...mockData];

    // Lọc theo ID cần loại trừ
    if (excludeId) {
        filteredData = filteredData.filter(item => item.id !== excludeId);
    }

    // Lọc theo tìm kiếm
    if (search) {
        filteredData = filteredData.filter(item =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Lọc theo danh mục
    if (category) {
        filteredData = filteredData.filter(item => item.category === category);
    }

    // Sắp xếp
    if (sortBy === 'trending') {
        filteredData.sort((a, b) => b.likes - a.likes);
    } else { // Mặc định là 'latest'
        filteredData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Phân trang
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = filteredData.slice(startIndex, endIndex);

    return NextResponse.json({
        data: results,
        nextPage: endIndex < filteredData.length ? page + 1 : null,
    });
}

// --- POST: Tạo item mới ---
export async function POST(request: NextRequest) {
    const payload: NewItemPayload = await request.json();

    if (!payload.title || !payload.imageUrl || !payload.category) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem: GalleryItem = {
        ...payload,
        id: Date.now().toString(),
        likes: 0,
        createdAt: new Date().toISOString(),
    };

    // Thêm item mới vào mảng dữ liệu đã import
    mockData.unshift(newItem);

    return NextResponse.json(newItem, { status: 201 });
}

