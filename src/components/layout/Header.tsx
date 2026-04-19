import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/hooks/useAuth";
import { categories } from "@/data/products";

const Header = () => {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { session, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-xs tracking-widest font-body">
        FREE SHIPPING ON ORDERS ABOVE PKR 5,000
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-heading text-2xl md:text-3xl font-bold tracking-wider">
            UMEED
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-sm tracking-wide hover:text-accent transition-colors font-body">
              SHOP ALL
            </Link>
            {categories.slice(0, 5).map(cat => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="text-sm tracking-wide hover:text-accent transition-colors font-body"
              >
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin" className="p-2 hover:text-accent transition-colors" aria-label="Admin">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}
            {session ? (
              <button onClick={signOut} className="p-2 hover:text-accent transition-colors" aria-label="Sign out">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link to="/auth" className="p-2 hover:text-accent transition-colors" aria-label="Sign in">
                <LogIn className="w-5 h-5" />
              </Link>
            )}
            <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" className="p-2 hover:text-accent transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/wishlist" className="p-2 hover:text-accent transition-colors relative">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-2 hover:text-accent transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4 animate-fade-in">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm font-body focus:outline-none focus:ring-1 focus:ring-accent"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <nav className="flex flex-col py-4 px-4 gap-1">
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="py-3 text-sm tracking-wide border-b border-border font-body">
              SHOP ALL
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm tracking-wide border-b border-border font-body"
              >
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
