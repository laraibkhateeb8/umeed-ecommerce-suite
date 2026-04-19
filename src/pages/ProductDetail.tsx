import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Heart, Star, ShoppingBag, ArrowLeft } from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts = [] } = useProducts();
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="font-body text-muted-foreground">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="font-body text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="text-accent font-body text-sm mt-4 inline-block">Back to shop</Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    if (!selectedColor) { toast.error("Please select a color"); return; }
    addItem(product, selectedSize, selectedColor, quantity);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    if (!selectedColor) { toast.error("Please select a color"); return; }
    addItem(product, selectedSize, selectedColor, quantity);
    window.location.href = "/checkout";
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden bg-secondary">
            <img src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-24 overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-accent" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {product.badge && (
            <span className="inline-block bg-accent text-accent-foreground text-[10px] px-3 py-1 tracking-wider font-body">{product.badge.toUpperCase()}</span>
          )}

          <h1 className="font-heading text-2xl md:text-3xl">{product.title}</h1>

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
              ))}
            </div>
            <span className="text-xs font-body text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-heading text-2xl">PKR {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="font-body text-lg text-muted-foreground line-through">PKR {product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <p className="font-body text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Size */}
          <div>
            <h3 className="font-body text-xs tracking-wider font-semibold mb-3">SIZE</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 text-sm font-body border transition-colors ${selectedSize === s ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-foreground"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <h3 className="font-body text-xs tracking-wider font-semibold mb-3">COLOR</h3>
            <div className="flex gap-3">
              {product.colors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c.name ? "border-accent scale-110" : "border-border"}`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-body text-xs tracking-wider font-semibold mb-3">QUANTITY</h3>
            <div className="inline-flex items-center border border-border">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-secondary transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-6 font-body text-sm">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-secondary transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 text-sm tracking-wider font-body hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-accent text-accent-foreground py-3 text-sm tracking-wider font-body hover:bg-accent/90 transition-colors"
            >
              BUY NOW
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 border transition-colors ${wishlisted ? "border-accent bg-accent/10" : "border-border hover:border-foreground"}`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? "fill-accent text-accent" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-heading text-2xl mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
