export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  badge?: string;
  rating: number;
  reviews: number;
}

export const categories = [
  { name: "Tops", slug: "tops" },
  { name: "Kurtis", slug: "kurtis" },
  { name: "Dresses", slug: "dresses" },
  { name: "Two Piece", slug: "two-piece" },
  { name: "Skirts", slug: "skirts" },
  { name: "Co-Ord Sets", slug: "co-ord-sets" },
  { name: "New Arrivals", slug: "new-arrivals" },
];
