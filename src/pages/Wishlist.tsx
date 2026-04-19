import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

const Wishlist = () => {
  const { items } = useWishlist();
  const { data: products = [], isLoading } = useProducts();
  const wishlistProducts = products.filter(p => items.includes(p.id));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="font-body text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-heading text-2xl mb-2">Your Wishlist is Empty</h1>
        <p className="font-body text-sm text-muted-foreground mb-6">Save items you love for later.</p>
        <Link to="/shop" className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm tracking-wider font-body">
          BROWSE COLLECTION
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-heading text-2xl md:text-3xl mb-8">Wishlist ({wishlistProducts.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

export default Wishlist;
