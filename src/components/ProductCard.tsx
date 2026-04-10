import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/data/products";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] px-2.5 py-1 tracking-wider font-body font-medium">
              {product.badge.toUpperCase()}
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-body text-sm font-medium tracking-wide">{product.title}</h3>
          <div className="flex items-center gap-2">
            <span className="font-body text-sm font-semibold">PKR {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="font-body text-xs text-muted-foreground line-through">
                PKR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
        className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
        aria-label="Add to wishlist"
      >
        <Heart className={`w-4 h-4 ${wishlisted ? "fill-accent text-accent" : ""}`} />
      </button>
    </div>
  );
};

export default ProductCard;
