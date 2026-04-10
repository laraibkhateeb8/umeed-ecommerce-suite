import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import categoryKurtis from "@/assets/category-kurtis.jpg";
import categoryDresses from "@/assets/category-dresses.jpg";
import categoryTops from "@/assets/category-tops.jpg";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const reviews = [
  { name: "Ayesha K.", text: "Absolutely love the quality! The fabric is so soft and the embroidery is stunning.", rating: 5 },
  { name: "Fatima R.", text: "Fast delivery and beautiful packaging. The dress fits perfectly!", rating: 5 },
  { name: "Sana M.", text: "UMEED has become my go-to brand. Every piece is a masterpiece.", rating: 4 },
];

const categoryImages = [
  { name: "Kurtis", slug: "kurtis", image: categoryKurtis },
  { name: "Dresses", slug: "dresses", image: categoryDresses },
  { name: "Tops", slug: "tops", image: categoryTops },
];

const Index = () => {
  const featured = products.filter(p => p.badge === "Best Seller" || p.badge === "Featured");
  const newArrivals = products.filter(p => p.badge === "New");

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <img src={heroBanner} alt="UMEED Collection" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-primary/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 animate-fade-in">
            UMEED
          </h1>
          <p className="font-body text-sm md:text-base text-primary-foreground/90 tracking-[0.3em] mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            ELEGANCE REDEFINED
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 text-sm tracking-widest font-body hover:bg-accent/90 transition-colors animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            SHOP NOW <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="font-heading text-2xl md:text-3xl text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryImages.map(cat => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden aspect-[4/3]"
            >
              <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-xl md:text-2xl text-primary-foreground tracking-wider">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-2xl md:text-3xl">Featured Products</h2>
          <Link to="/shop" className="text-sm font-body tracking-wide text-muted-foreground hover:text-accent transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-heading text-2xl md:text-3xl">New Arrivals</h2>
            <Link to="/shop?category=new-arrivals" className="text-sm font-body tracking-wide text-muted-foreground hover:text-accent transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="font-heading text-2xl md:text-3xl text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-secondary p-8 text-center">
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="font-body text-sm text-muted-foreground mb-4 italic">"{r.text}"</p>
              <p className="font-body text-sm font-semibold">{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="font-heading text-2xl md:text-3xl mb-4">Stay in the Loop</h2>
          <p className="font-body text-sm opacity-80 mb-8">Subscribe for exclusive offers, new arrivals, and style inspiration.</p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none font-body"
            />
            <button type="submit" className="px-8 py-3 bg-accent text-accent-foreground text-sm font-body tracking-wider hover:bg-accent/90 transition-colors">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Index;
