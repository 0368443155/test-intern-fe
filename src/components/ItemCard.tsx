import { GalleryItem } from '@/lib/types';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export const ItemCard: React.FC<{ item: GalleryItem }> = ({ item }) => {
  return (
    // Responsive grid item: 1/2/3 cột
    <Link 
      href={`/item/${item.id}`} 
      className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <Image 
        src={item.imageUrl} 
        alt={item.title} 
        width={200}
        height={200}
        className="w-full h-48 object-cover"
        // Thêm thuộc tính a11y cơ bản
        aria-label={`View details for ${item.title}`} 
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{item.title}</h3>
        <p className="text-sm text-gray-500 flex items-center mt-1">
          ❤️ {item.likes} Likes
        </p>
      </div>
    </Link>
  );
};

// Skeleton Loading
export const ItemCardSkeleton: React.FC = () => (
  <div className="bg-gray-200 rounded-xl shadow-lg animate-pulse overflow-hidden">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/4"></div>
    </div>
  </div>
);