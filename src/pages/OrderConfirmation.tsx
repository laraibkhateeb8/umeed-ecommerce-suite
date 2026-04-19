import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const OrderConfirmation = () => {
  const [params] = useSearchParams();
  const orderId = params.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    // Public can't SELECT orders (RLS). Show summary from URL params instead.
    const total = params.get("total");
    const name = params.get("name");
    setOrder({ id: orderId, total, name });
    setLoading(false);
  }, [orderId, params]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center font-body text-sm">Loading…</div>;

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl mb-4">No order found</h1>
        <Link to="/shop" className="text-accent font-body text-sm">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-xl text-center">
      <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-6" />
      <h1 className="font-heading text-3xl md:text-4xl mb-3">Order Confirmed!</h1>
      <p className="font-body text-muted-foreground mb-8">
        Thank you{order?.name ? `, ${order.name}` : ""}. Your order has been placed successfully.
      </p>
      <div className="bg-secondary p-6 mb-8 text-left space-y-3">
        <div className="flex justify-between font-body text-sm">
          <span className="text-muted-foreground">Order ID</span>
          <span className="font-mono">{orderId.slice(0, 8).toUpperCase()}</span>
        </div>
        {order?.total && (
          <div className="flex justify-between font-body text-sm">
            <span className="text-muted-foreground">Total</span>
            <span>PKR {Number(order.total).toLocaleString()}</span>
          </div>
        )}
      </div>
      <p className="font-body text-xs text-muted-foreground mb-6">
        We'll contact you shortly to confirm delivery details.
      </p>
      <Link
        to="/shop"
        className="inline-block bg-accent text-accent-foreground px-8 py-3 text-sm tracking-wider font-body hover:bg-accent/90 transition-colors"
      >
        CONTINUE SHOPPING
      </Link>
    </div>
  );
};

export default OrderConfirmation;
