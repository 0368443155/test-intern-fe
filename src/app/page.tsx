'use client';

import { useEffect, useRef, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { ItemCard, ItemCardSkeleton } from '@/components/ItemCard';
import { GalleryItem, PaginatedResponse } from '@/lib/types';
import Link from 'next/link';
import { useDebounce } from '@/lib/hooks/useDebounce';

// Hàm lấy key cho SWR Infinite, bao gồm cả các tham số lọc
const getKey = (pageIndex: number, previousPageData: PaginatedResponse<GalleryItem> | null, search: string, category: string, sort: string) => {
    if (previousPageData && !previousPageData.nextPage) return null; // Reached the end
    
    // Xây dựng URL với các tham số
    const params = new URLSearchParams({
        page: (pageIndex + 1).toString(),
        search,
        category,
        sort,
    });
    
    return `/api/gallery?${params.toString()}`;
};

export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { data, size, setSize, isLoading, error, isValidating, mutate } = useSWRInfinite<PaginatedResponse<GalleryItem>>(
        (pageIndex, previousPageData) => getKey(pageIndex, previousPageData, debouncedSearchTerm, category, sortBy)
    );
    
    const triggerRef = useRef<HTMLDivElement>(null);

    const allItems: GalleryItem[] = data ? data.flatMap(page => page.data) : [];
    const isReachingEnd = data && data[data.length - 1]?.nextPage === null;
    const initialLoading = isLoading && !allItems.length;

    // Reset size về 1 khi các bộ lọc thay đổi để fetch lại từ đầu
    useEffect(() => {
        setSize(1);
    }, [debouncedSearchTerm, category, sortBy, setSize]);

    // Logic Infinite Scroll
    useEffect(() => {
        if (isReachingEnd || isValidating || initialLoading) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setSize(size + 1);
            }
        }, { rootMargin: '200px' });

        if (triggerRef.current) {
            observer.observe(triggerRef.current);
        }

        return () => {
            if (triggerRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(triggerRef.current);
            }
        };
    }, [isReachingEnd, isValidating, initialLoading, size, setSize]);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">Explore Gallery</h1>
                <Link href="/create" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">
                    + Create New Item
                </Link>
            </div>
            
            {/* Thanh điều khiển tìm kiếm, lọc, sắp xếp */}
            <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm -mx-8 px-8 py-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2 text-black"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full md:w-auto border border-gray-300 rounded-lg p-2 text-black"
                    >
                        <option value="">All Categories</option>
                        <option value="Động vật">Động vật</option>
                        <option value="Thiên nhiên">Thiên nhiên</option>
                        <option value="Người mẫu">Người mẫu</option>
                        <option value="Thiết kế">Thiết kế</option>
                        <option value="Khác">Khác</option>
                    </select>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('latest')}
                            className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'latest' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-black'}`}
                        >
                            Latest
                        </button>
                        <button
                            onClick={() => setSortBy('trending')}
                            className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'trending' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-black'}`}
                        >
                            Trending
                        </button>
                    </div>
                </div>
            </div>

            {/* Lưới hiển thị */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allItems.map(item => <ItemCard key={item.id} item={item} />)}
                
                {initialLoading && Array.from({ length: 9 }).map((_, i) => <ItemCardSkeleton key={i} />)}

                {!initialLoading && isValidating && (
                    Array.from({ length: 3 }).map((_, i) => <ItemCardSkeleton key={`loading-${i}`} />)
                )}
            </div>

            {/* Trigger và thông báo */}
            <div className="mt-8 text-center">
                {!initialLoading && !isReachingEnd && <div ref={triggerRef} className="h-10"></div>}
                {isReachingEnd && allItems.length > 0 && <p className="text-gray-500">You have reached the end!</p>}
                {!isLoading && !allItems.length && <p className="text-gray-500">No results found. Try a different search or filter.</p>}
            </div>

            {error && (
                <div className="text-center p-8 text-red-600 border border-red-300 bg-red-50 rounded-lg mt-8">
                    Error loading data. Please try again later.
                </div>
            )}
        </div>
    );
}

