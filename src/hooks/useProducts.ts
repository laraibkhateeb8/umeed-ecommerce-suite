import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

const mapRow = (row: any): Product => ({
  id: row.id,
  title: row.title,
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : undefined,
  description: row.description || "",
  category: row.category,
  images: Array.isArray(row.images) && row.images.length > 0 ? row.images : ["/placeholder.svg"],
  sizes: row.sizes || [],
  colors: Array.isArray(row.colors) ? row.colors : [],
  badge: row.badge || undefined,
  rating: Number(row.rating) || 0,
  reviews: Number(row.reviews) || 0,
});

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    },
  });
};
