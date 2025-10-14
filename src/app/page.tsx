'use client';

import { useEffect, useRef, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Link from 'next/link';
import { ItemCard, ItemCardSkeleton } from '@/components/ItemCard';
import { GalleryItem, PaginatedResponse } from '@/lib/types';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Search, SlidersHorizontal, TrendingUp, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Nature', 'Abstract', 'Portraits', 'Architecture', 'Animals'];

// Updated getKey function to include search, filter, and sort parameters
const getKey = (pageIndex: number, previousPageData: PaginatedResponse<GalleryItem> | null, search: string, category: string, sort: string) => {
    if (previousPageData && !previousPageData.nextPage) return null; // Reached the end

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
    const [category, setCategory] = useState('All');
    const [sortBy, setSortBy] = useState('latest');

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { data, size, setSize, isLoading, error, isValidating, mutate } = useSWRInfinite<PaginatedResponse<GalleryItem>>(
        (pageIndex, previousPageData) => getKey(pageIndex, previousPageData, debouncedSearchTerm, category, sortBy),
        // SWRConfig fetcher is used globally
    );

    const triggerRef = useRef<HTMLDivElement>(null);
    const allItems: GalleryItem[] = data ? data.flatMap(page => page.data) : [];
    const isReachingEnd = data && data[data.length - 1]?.nextPage === null;
    const initialLoading = isLoading && !allItems.length;
    const loadingMore = !initialLoading && isValidating;
    const noResults = !initialLoading && !error && allItems.length === 0;

    // Reset size to 1 when filters change, triggering a new data fetch
    useEffect(() => {
        setSize(1);
    }, [debouncedSearchTerm, category, sortBy, setSize]);


    // IntersectionObserver for infinite scroll
    useEffect(() => {
        if (isReachingEnd || isValidating || initialLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setSize((prevSize) => prevSize + 1);
                }
            },
            { rootMargin: '200px' }
        );

        const currentTrigger = triggerRef.current;
        if (currentTrigger) {
            observer.observe(currentTrigger);
        }

        return () => {
            if (currentTrigger) {
                observer.unobserve(currentTrigger);
            }
        };
    }, [isReachingEnd, isValidating, initialLoading, size, setSize]);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-extrabold text-gray-900">Explore Gallery</h1>
                <Link
                    href="/create"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
                >
                    <Sparkles size={18} />
                    Create New
                </Link>
            </header>
            
            {/* Filter and Sort Controls */}
            <div className="mb-8 sticky top-4 z-10">
                <div className="p-4 bg-white rounded-xl shadow-md flex flex-col md:flex-row gap-4 items-center">
                    {/* Search Input */}
                    <div className="relative w-full md:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-black"
                        />
                    </div>
                    
                    {/* Category Filter */}
                    <div className="relative w-full md:w-auto">
                        <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-black"
                        >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* Sort Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setSortBy('latest')}
                            className={`flex-1 md:flex-none w-full px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition ${sortBy === 'latest' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            <Sparkles size={16} /> Latest
                        </button>
                        <button
                            onClick={() => setSortBy('trending')}
                            className={`flex-1 md:flex-none w-full px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition ${sortBy === 'trending' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                           <TrendingUp size={16} /> Trending
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allItems.map(item => <ItemCard key={item.id} item={item} />)}
                {initialLoading && Array.from({ length: 9 }).map((_, i) => <ItemCardSkeleton key={i} />)}
                {loadingMore && Array.from({ length: 3 }).map((_, i) => <ItemCardSkeleton key={`loading-${i}`} />)}
            </div>

            {/* Trigger for Infinite Scroll & Status Messages */}
            <div className="mt-8 text-center">
                 {isReachingEnd && allItems.length > 0 && (
                    <p className="text-gray-500">No more content 😁</p>
                )}
                {noResults && (
                     <div className="text-center p-8 text-gray-600 border border-gray-200 bg-white rounded-lg mt-8">
                        <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}
                 {!isReachingEnd && !initialLoading && !noResults && (
                    <div ref={triggerRef} className="h-10"></div>
                )}
                {error && (
                    <div className="text-center p-8 text-red-600 border border-red-300 bg-red-50 rounded-lg mt-8">
                        Không thể tải dữ liệu. Vui lòng thử lại.
                    </div>
                )}
            </div>
        </div>
    );
}

