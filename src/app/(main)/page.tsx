// 'use client';

// import { useEffect, useRef } from 'react';
// import useSWRInfinite from 'swr/infinite';
// import { ItemCard, ItemCardSkeleton } from '@/components/ItemCard';
// import { GalleryItem, PaginatedResponse } from '@/lib/types';

// // Hàm lấy key cho SWR Infinite
// const getKey = (pageIndex: number, previousPageData: PaginatedResponse<GalleryItem> | null) => {
//   if (previousPageData && !previousPageData.nextPage) return null; // Hết trang
//   return `/api/gallery?page=${pageIndex + 1}`;
// };

// export default function ExplorePage() {
//   const { data, size, setSize, isLoading, error, isValidating } = useSWRInfinite<PaginatedResponse<GalleryItem>>(getKey);
  
//   // Ref cho IntersectionObserver
//   const triggerRef = useRef<HTMLDivElement>(null);

//   // Flatten data
//   const allItems: GalleryItem[] = data ? data.flatMap(page => page.data) : [];
  
//   // Kiểm tra đã hết dữ liệu chưa
//   const isReachingEnd = data && data[data.length - 1]?.nextPage === null;
//   const currentLoading = isLoading && !allItems.length; // Loading lần đầu

//   // --- LOGIC INFINITE SCROLL (IntersectionObserver) ---
//   useEffect(() => {
//     if (isReachingEnd || isValidating || currentLoading) return;

//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         setSize(size + 1); // Tăng size để fetch trang tiếp theo
//       }
//     }, {
//       rootMargin: '200px',
//     });

//     if (triggerRef.current) {
//       observer.observe(triggerRef.current);
//     }

//     return () => {
//       if (triggerRef.current) {
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         observer.unobserve(triggerRef.current);
//       }
//     };
//   }, [isReachingEnd, isValidating, currentLoading, size, setSize]);

//   return (
//     <div className="container mx-auto p-4 md:p-8">
//       <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Explore Gallery</h1>
      
//       {/* Lưới Card Responsive: 1 cột (mobile), 2 cột (sm), 3 cột (lg) */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
//         {/* Render Items */}
//         {allItems.map(item => <ItemCard key={item.id} item={item} />)}
        
//         {/* Skeleton khi load lần đầu */}
//         {currentLoading && Array.from({ length: 9 }).map((_, i) => <ItemCardSkeleton key={i} />)}

//         {/* Skeleton khi load trang tiếp theo */}
//         {!currentLoading && isValidating && (
//           Array.from({ length: 3 }).map((_, i) => <ItemCardSkeleton key={`loading-${i}`} />)
//         )}
//       </div>

//       {/* Trigger cho Infinite Scroll */}
//       <div className="mt-8">
//         {isReachingEnd && allItems.length > 0 && (
//           <p className="text-center text-gray-500">You have reached the end!</p>
//         )}
        
//         {!isReachingEnd && !currentLoading && (
//           // Div này sẽ kích hoạt IntersectionObserver
//           <div ref={triggerRef} className="h-10"></div> 
//         )}
//       </div>

//       {/* Error State */}
//       {error && (
//         <div className="text-center p-8 text-red-600 border border-red-300 bg-red-50 rounded-lg mt-8">
//           Error loading data. Please check your API handler.
//         </div>
//       )}
//     </div>
//   );
// }