import { NextRequest, NextResponse } from 'next/server';
import { GalleryItem, PaginatedResponse, NewItemPayload } from '@/lib/types';

//mock data
// eslint-disable-next-line prefer-const
let mockData: GalleryItem[] = Array.from({ length: 30 }, (_, i) => {
    const categoryOptions = ['Animals', 'Nature', 'Portraits', 'Architecture', 'Abstract', 'Other'];
    const date = new Date(Date.now() - (i * 3600000 * 24));
    return {
        id: String(i + 1),
        title: `Design Idea ${i + 1}`,
        imageUrl: `https://picsum.photos/seed/${i + 1}/400/300`,
        category: categoryOptions[i % categoryOptions.length],
        likes: 100 + Math.floor(Math.random() * 500),
        tags: i % 3 === 0 ? ['modern', 'simple'] : ['vibrant', 'complex'],
        description: `This is a detailed description for design idea ${i + 1}.`,
        createdAt: date.toISOString(),
        author: `Author ${i % 5 + 1}`
    };
});


// --- GET: Fetch, Filter, Sort, Paginate ---
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const sort = searchParams.get('sort') || 'latest';
    const exclude = searchParams.get('exclude') || '';

    let allItems = [...mockData]; // Làm việc trên một bản sao

    // 1. Lọc dữ liệu
    if (exclude) {
        allItems = allItems.filter(item => item.id !== exclude);
    }
    if (search) {
        allItems = allItems.filter(item =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );
    }
    if (category && category !== 'All') {
        allItems = allItems.filter(item => item.category === category);
    }

    // 2. Sắp xếp
    if (sort === 'latest') {
        allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'trending') {
        allItems.sort((a, b) => b.likes - a.likes);
    }

    // 3. Phân trang
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const results = allItems.slice(startIndex, endIndex);

    return NextResponse.json({
        data: results,
        nextPage: endIndex < allItems.length ? page + 1 : null,
    } as PaginatedResponse<GalleryItem>);
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
    
    // Thêm vào đầu mảng dữ liệu tạm
    mockData.unshift(newItem); 

    return NextResponse.json(newItem, { status: 201 });
}

// Export mảng dữ liệu để các route khác có thể import và sử dụng chung
export { mockData };