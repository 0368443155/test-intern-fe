export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  likes: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextPage: number | null; // Null nếu không còn trang
}