import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";

const priceRanges = [
  { label: "Under PKR 3,000", min: 0, max: 3000 },
  { label: "PKR 3,000 - 5,000", min: 3000, max: 5000 },
  { label: "PKR 5,000 - 7,000", min: 5000, max: 7000 },
  { label: "Above PKR 7,000", min: 7000, max: Infinity },
];

const sizes = ["XS", "S", "M", "L", "XL"];
const colorOptions = ["Cream", "Beige", "Pink", "Gold", "White", "Rose"];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = products;
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter || (categoryFilter === "new-arrivals" && p.badge === "New"));
    }
    if (selectedPrice !== null) {
      const range = priceRanges[selectedPrice];
      result = result.filter(p => p.price >= range.min && p.price < range.max);
    }
    if (selectedSize) {
      result = result.filter(p => p.sizes.includes(selectedSize));
    }
    if (selectedColor) {
      result = result.filter(p => p.colors.some(c => c.name === selectedColor));
    }
    return result;
  }, [categoryFilter, selectedPrice, selectedSize, selectedColor]);

  const clearFilters = () => {
    setSelectedPrice(null);
    setSelectedSize("");
    setSelectedColor("");
    setSearchParams({});
  };

  const hasFilters = categoryFilter || selectedPrice !== null || selectedSize || selectedColor;

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-body text-xs tracking-wider font-semibold mb-3">CATEGORY</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSearchParams(cat.slug === categoryFilter ? {} : { category: cat.slug })}
              className={`block text-sm font-body transition-colors ${categoryFilter === cat.slug ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-body text-xs tracking-wider font-semibold mb-3">PRICE</h3>
        <div className="space-y-2">
          {priceRanges.map((range, i) => (
            <button
              key={i}
              onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
              className={`block text-sm font-body transition-colors ${selectedPrice === i ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-body text-xs tracking-wider font-semibold mb-3">SIZE</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
              className={`px-3 py-1.5 text-xs font-body border transition-colors ${selectedSize === s ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="font-body text-xs tracking-wider font-semibold mb-3">COLOR</h3>
        <div className="space-y-2">
          {colorOptions.map(c => (
            <button
              key={c}
              onClick={() => setSelectedColor(selectedColor === c ? "" : c)}
              className={`block text-sm font-body transition-colors ${selectedColor === c ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl">
            {categoryFilter ? categories.find(c => c.slug === categoryFilter)?.name || "Shop" : "Shop All"}
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-1">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs font-body text-muted-foreground hover:text-foreground flex items-center gap-1">
              Clear all <X className="w-3 h-3" />
            </button>
          )}
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="md:hidden p-2 border border-border">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Desktop filters */}
        <aside className="hidden md:block w-56 shrink-0">
          <FilterPanel />
        </aside>

        {/* Mobile filters */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 bg-background p-6 md:hidden overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterPanel />
          </div>
        )}

        {/* Products grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-20">No products found matching your filters.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
