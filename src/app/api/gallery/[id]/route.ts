import { NextRequest, NextResponse } from 'next/server';
// Import mảng mockData được chia sẻ từ API route chính
import { mockData } from '../route'; 

// --- GET: Lấy một item theo ID ---
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id; // Thay đổi ở đây
    const item = mockData.find(i => i.id === id);

    if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
}

// --- PATCH: Cập nhật lượt like ---
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id; // Thay đổi ở đây
    const itemIndex = mockData.findIndex(i => i.id === id);

    if (itemIndex === -1) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Tăng lượt like và cập nhật item trong mảng
    mockData[itemIndex].likes++;
    const updatedItem = mockData[itemIndex];

    return NextResponse.json(updatedItem);
}

