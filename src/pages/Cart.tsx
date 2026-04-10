import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-heading text-2xl mb-2">Your Cart is Empty</h1>
        <p className="font-body text-sm text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm tracking-wider font-body hover:bg-primary/90 transition-colors">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <h1 className="font-heading text-2xl md:text-3xl mb-8">Shopping Cart</h1>

      <div className="space-y-6">
        {items.map(item => (
          <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 pb-6 border-b border-border">
            <Link to={`/product/${item.product.id}`} className="w-24 h-32 shrink-0 overflow-hidden bg-secondary">
              <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <div>
                  <Link to={`/product/${item.product.id}`} className="font-body text-sm font-medium hover:text-accent transition-colors">
                    {item.product.title}
                  </Link>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Size: {item.size} · Color: {item.color}
                  </p>
                </div>
                <button onClick={() => removeItem(item.product.id, item.size, item.color)} className="p-1 hover:text-destructive transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="inline-flex items-center border border-border">
                  <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)} className="p-2 hover:bg-secondary">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-4 text-sm font-body">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)} className="p-2 hover:bg-secondary">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="font-body text-sm font-semibold">PKR {(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="font-body text-sm">Subtotal</span>
          <span className="font-heading text-xl">PKR {subtotal.toLocaleString()}</span>
        </div>
        <p className="font-body text-xs text-muted-foreground mb-6">Shipping calculated at checkout.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/shop" className="flex-1 text-center border border-border py-3 text-sm tracking-wider font-body hover:bg-secondary transition-colors">
            CONTINUE SHOPPING
          </Link>
          <Link to="/checkout" className="flex-1 text-center bg-accent text-accent-foreground py-3 text-sm tracking-wider font-body hover:bg-accent/90 transition-colors">
            CHECKOUT
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
