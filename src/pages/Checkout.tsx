import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(7, "Valid phone required").max(20),
  address: z.string().trim().min(5, "Address is required").max(500),
  city: z.string().trim().min(2, "City is required").max(100),
});

type PaymentMethod = "cod" | "bank" | "jazzcash" | "easypaisa";

const paymentMethods: { id: PaymentMethod; label: string; desc: string }[] = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive your order" },
  { id: "bank", label: "Bank Transfer", desc: "Direct bank transfer" },
  { id: "jazzcash", label: "JazzCash", desc: "Pay via JazzCash mobile wallet" },
  { id: "easypaisa", label: "EasyPaisa", desc: "Pay via EasyPaisa mobile wallet" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [submitting, setSubmitting] = useState(false);
  const shipping = subtotal >= 5000 ? 0 : 300;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl mb-2">No items to checkout</h1>
        <a href="/shop" className="text-accent font-body text-sm">Go shopping</a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setSubmitting(true);

    const orderItems = items.map((i) => ({
      productId: i.product.id,
      title: i.product.title,
      price: i.product.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
    }));

    const total = subtotal + shipping;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_name: result.data.name,
        phone: result.data.phone,
        address: result.data.address,
        city: result.data.city,
        payment_method: payment,
        total,
        items: orderItems,
      })
      .select("id")
      .single();

    if (error || !order) {
      toast.error("Failed to place order. Please try again.");
      setSubmitting(false);
      return;
    }

    // Upsert customer (dedupes by phone, increments totals)
    await supabase.rpc("upsert_customer_on_order", {
      _name: result.data.name,
      _phone: result.data.phone,
      _city: result.data.city,
      _order_total: total,
    });

    toast.success("Order placed successfully! 🎉");
    clearCart();
    navigate(`/order-confirmation?id=${order.id}&total=${total}&name=${encodeURIComponent(result.data.name)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <h1 className="font-heading text-2xl md:text-3xl mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left - Form */}
        <div className="space-y-6">
          <div>
            <h2 className="font-body text-xs tracking-wider font-semibold mb-4">SHIPPING INFORMATION</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <textarea
                placeholder="Address"
                rows={3}
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              />
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <h2 className="font-body text-xs tracking-wider font-semibold mb-4">PAYMENT METHOD</h2>
            <div className="space-y-3">
              {paymentMethods.map(m => (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${payment === m.id ? "border-accent bg-accent/5" : "border-border hover:border-foreground/30"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === m.id}
                    onChange={() => setPayment(m.id)}
                    className="mt-1 accent-accent"
                  />
                  <div>
                    <span className="font-body text-sm font-medium">{m.label}</span>
                    <p className="font-body text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Order Summary */}
        <div>
          <div className="bg-secondary p-6 sticky top-28">
            <h2 className="font-body text-xs tracking-wider font-semibold mb-6">ORDER SUMMARY</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                  <div className="w-14 h-18 shrink-0 overflow-hidden">
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm truncate">{item.product.title}</p>
                    <p className="font-body text-xs text-muted-foreground">{item.size} · {item.color} · Qty: {item.quantity}</p>
                  </div>
                  <span className="font-body text-sm">PKR {(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between font-body text-sm">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `PKR ${shipping}`}</span>
              </div>
              <div className="flex justify-between font-heading text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>PKR {(subtotal + shipping).toLocaleString()}</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-accent text-accent-foreground py-3 text-sm tracking-wider font-body hover:bg-accent/90 transition-colors"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
