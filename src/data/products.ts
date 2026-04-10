import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

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

export const products: Product[] = [
  {
    id: "1",
    title: "Embroidered Cream Kurta",
    price: 3500,
    originalPrice: 4500,
    description: "A beautifully embroidered cream kurta with gold thread work. Perfect for casual and semi-formal occasions. Made with premium cotton fabric for ultimate comfort.",
    category: "kurtis",
    images: [product1, product1],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Cream", hex: "#F5F0E1" },
      { name: "Beige", hex: "#D4C5A9" },
    ],
    badge: "Best Seller",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    title: "Blush Pink Maxi Dress",
    price: 5200,
    originalPrice: 6500,
    description: "Elegant blush pink maxi dress with a flattering silhouette. Features delicate draping and a beautiful wrap-style bodice. Perfect for events and celebrations.",
    category: "dresses",
    images: [product2, product2],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Blush Pink", hex: "#F4B4B0" },
      { name: "Dusty Rose", hex: "#D4A0A0" },
    ],
    badge: "New",
    rating: 4.9,
    reviews: 87,
  },
  {
    id: "3",
    title: "Beige Co-Ord Set",
    price: 6800,
    description: "Sophisticated beige co-ord set featuring a cropped blazer and high-waisted trousers. A modern power dressing essential for the contemporary woman.",
    category: "co-ord-sets",
    images: [product3, product3],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Beige", hex: "#D4C5A9" },
      { name: "Camel", hex: "#C4A882" },
    ],
    badge: "Featured",
    rating: 4.7,
    reviews: 56,
  },
  {
    id: "4",
    title: "Pink Pleated Skirt Set",
    price: 4800,
    originalPrice: 5800,
    description: "A romantic pink pleated skirt paired with a matching blouse. The flowing silhouette and soft fabric create an effortlessly elegant look.",
    category: "skirts",
    images: [product4, product4],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Pink", hex: "#F0B0C0" },
      { name: "Lavender", hex: "#C8B0D0" },
    ],
    rating: 4.6,
    reviews: 43,
  },
  {
    id: "5",
    title: "Ivory Embroidered Top",
    price: 2800,
    description: "Delicate ivory top with intricate embroidery details. A versatile piece that pairs beautifully with both casual and dressy bottoms.",
    category: "tops",
    images: [product1, product1],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Ivory", hex: "#FFFFF0" },
      { name: "White", hex: "#FFFFFF" },
    ],
    badge: "New",
    rating: 4.5,
    reviews: 32,
  },
  {
    id: "6",
    title: "Gold Accent Two Piece",
    price: 7200,
    originalPrice: 8500,
    description: "Luxurious two-piece set with gold accent details. Features a structured top and flowing palazzo pants. Perfect for festive occasions.",
    category: "two-piece",
    images: [product3, product3],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Gold", hex: "#D4A843" },
      { name: "Champagne", hex: "#F7E7CE" },
    ],
    badge: "Best Seller",
    rating: 4.9,
    reviews: 98,
  },
  {
    id: "7",
    title: "Rose Chiffon Dress",
    price: 4500,
    description: "Flowy chiffon dress in a beautiful rose shade. Features subtle ruching and a flattering A-line cut.",
    category: "dresses",
    images: [product2, product2],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Rose", hex: "#E8A0B0" },
      { name: "Peach", hex: "#F0C8B0" },
    ],
    rating: 4.7,
    reviews: 61,
  },
  {
    id: "8",
    title: "Traditional Embroidered Kurta",
    price: 3800,
    originalPrice: 4800,
    description: "Classic kurta with traditional embroidery patterns. Comfortable cotton fabric with a relaxed fit.",
    category: "kurtis",
    images: [product1, product1],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cream", hex: "#F5F0E1" },
      { name: "Sage", hex: "#B0C4A8" },
    ],
    badge: "New",
    rating: 4.6,
    reviews: 29,
  },
];
