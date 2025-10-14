export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  likes: number;
  tags: string[];
  description: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextPage: number | null; // Null if it's the last page
}

// Data payload for creating a new item
export type NewItemPayload = Omit<GalleryItem, 'id' | 'likes' | 'createdAt'>;