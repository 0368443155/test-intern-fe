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
  nextPage: number | null; // Null nếu không còn trang
}

//data cho item mới
export type NewItemPayload = Omit<GalleryItem, 'id' | 'likes' | 'createdAt'>;
