'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { GalleryItem } from '@/lib/types';
import { ItemCard, ItemCardSkeleton } from '@/components/ItemCard';
import { Heart, Tag, User, AlignLeft, ArrowLeft, Clock } from 'lucide-react';

const ItemDetailPage = () => {
    const params = useParams();
    const id = params.id as string;

    // SWR hook to fetch the main item details
    const { data: item, error, mutate } = useSWR<GalleryItem>(id ? `/api/gallery/${id}` : null);

    // SWR hook to fetch related items (same category, limit 3, exclude current)
    const { data: relatedItemsResponse } = useSWR<{ data: GalleryItem[] }>(
        item ? `/api/gallery?category=${item.category}&limit=3&exclude=${id}` : null
    );
    const relatedItems = relatedItemsResponse?.data || [];

    // Optimistic update for the like button
    const handleLike = async () => {
        if (!item) return;

        const originalLikes = item.likes;
        // Immediately update the UI without waiting for the API
        mutate({ ...item, likes: item.likes + 1 }, false);

        try {
            const response = await fetch(`/api/gallery/${id}`, { method: 'PATCH' });
            if (!response.ok) throw new Error('Failed to like item.');
            // Re-fetch data from API to ensure consistency
            mutate(); 
        } catch (err) {
            console.error(err);
            // If the API call fails, revert the UI change
            mutate({ ...item, likes: originalLikes }, false);
        }
    };
    
    // --- Render states ---
    if (error) return (
        <div className="text-center p-8 text-red-600">Không thể tải dữ liệu. Vui lòng thử lại.</div>
    );

    if (!item) return <ItemDetailSkeleton />; // Loading state

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
            <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors mb-8 font-semibold">
                <ArrowLeft size={18} />
                Trở lại tư viện
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                {/* Main Image */}
                <div className="lg:col-span-3 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>

                {/* Details Sidebar */}
                <div className="lg:col-span-2 flex flex-col space-y-6">
                    <h1 className="text-4xl font-bold text-gray-900 break-words">{item.title}</h1>
                    
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-gray-600">
                            <User size={18} />
                        </div>
                        <button 
                            onClick={handleLike} 
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors font-semibold"
                            aria-label={`Like this item. Current likes: ${item.likes}`}
                        >
                            <Heart size={18} />
                            <span>{item.likes}</span>
                        </button>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-start gap-3">
                            <AlignLeft size={20} className="text-gray-500 mt-1 flex-shrink-0" />
                            <p className="text-gray-700">{item.description || 'No description available.'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                             <Clock size={18} className="text-gray-500 flex-shrink-0" />
                             <p className="text-sm text-gray-600">
                                Published on {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Tag size={20} className="text-gray-500 mt-1 flex-shrink-0" />
                            <div className="flex flex-wrap gap-2">
                                {item.tags?.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* More from this category */}
            {relatedItems.length > 0 && (
                <div className="mt-16 pt-8 border-t">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">More from: {item.category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedItems.map(related => <ItemCard key={related.id} item={related} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

// Skeleton component for loading state
const ItemDetailSkeleton = () => (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded-md mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3 h-[500px] bg-gray-200 rounded-xl"></div>
            <div className="lg:col-span-2 space-y-6">
                <div className="h-10 bg-gray-200 rounded-md w-3/4"></div>
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-full w-24"></div>
                </div>
                <div className="space-y-4 pt-4 border-t">
                    <div className="h-20 bg-gray-200 rounded-md"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
                    <div className="flex gap-2">
                        <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ItemDetailPage;
