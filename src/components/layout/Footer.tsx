import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">UMEED</h3>
            <p className="text-sm opacity-80 font-body leading-relaxed">
              Elegant, modest fashion for the modern woman. Curated with love and designed to make you feel beautiful.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://wa.me/923001234567" aria-label="WhatsApp" className="hover:text-accent transition-colors"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-body text-sm font-semibold tracking-wider mb-4">SHOP</h4>
            <ul className="space-y-2 text-sm opacity-80 font-body">
              <li><Link to="/shop" className="hover:opacity-100 transition-opacity">All Products</Link></li>
              <li><Link to="/shop?category=new-arrivals" className="hover:opacity-100 transition-opacity">New Arrivals</Link></li>
              <li><Link to="/shop?category=kurtis" className="hover:opacity-100 transition-opacity">Kurtis</Link></li>
              <li><Link to="/shop?category=dresses" className="hover:opacity-100 transition-opacity">Dresses</Link></li>
              <li><Link to="/shop?category=co-ord-sets" className="hover:opacity-100 transition-opacity">Co-Ord Sets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-body text-sm font-semibold tracking-wider mb-4">HELP</h4>
            <ul className="space-y-2 text-sm opacity-80 font-body">
              <li><Link to="/shipping-policy" className="hover:opacity-100 transition-opacity">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="hover:opacity-100 transition-opacity">Return Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-body text-sm font-semibold tracking-wider mb-4">NEWSLETTER</h4>
            <p className="text-sm opacity-80 mb-4 font-body">Subscribe for updates & exclusive offers.</p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-primary-foreground/10 border border-primary-foreground/20 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none font-body"
              />
              <button type="submit" className="px-4 py-2 bg-accent text-accent-foreground text-sm font-body tracking-wide hover:bg-accent/90 transition-colors">
                JOIN
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-xs opacity-60 font-body">
          © 2026 UMEED. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
