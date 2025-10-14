import { GalleryItem } from '@/lib/types';

// Dữ liệu giả, được lưu trữ trong bộ nhớ và chia sẻ giữa các request
// eslint-disable-next-line prefer-const
export let mockData: GalleryItem[] = Array.from({ length: 35 }, (_, i) => ({
    id: String(i + 1),
    title: `Design Idea ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/${i + 1}/400/300`,
    category: i % 5 === 0 ? 'Động vật' : i % 5 === 1 ? 'Thiên nhiên' : i % 5 === 2 ? 'Người mẫu' : i % 5 === 3 ? 'Thiết kế' : 'Khác',
    likes: 100 + i * 5,
    tags: i % 3 === 0 ? ['modern', 'simple'] : i % 4 === 0 ? ['vibrant', 'art'] : ['complex', 'nature'],
    description: `This is a detailed description for design idea ${i + 1}.`,
    createdAt: new Date(Date.now() - (i * 3600000)).toISOString(),
    author: `Designer ${i % 5 + 1}`
}));
