export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  tags: string[];
  createdAt: string; // ISO date string
}