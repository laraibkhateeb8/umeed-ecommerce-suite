const ShippingPolicy = () => (
  <div className="container mx-auto px-4 py-12 max-w-3xl">
    <h1 className="font-heading text-3xl mb-8">Shipping Policy</h1>
    <div className="space-y-6 font-body text-sm text-muted-foreground leading-relaxed">
      <section>
        <h2 className="font-heading text-lg text-foreground mb-2">Delivery Areas</h2>
        <p>We deliver across all major cities in Pakistan. Orders are typically dispatched within 1-2 business days.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg text-foreground mb-2">Shipping Charges</h2>
        <p>Free shipping on orders above PKR 5,000. A flat shipping fee of PKR 300 applies to orders below PKR 5,000.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg text-foreground mb-2">Delivery Time</h2>
        <p>Standard delivery takes 3-5 business days for major cities. Remote areas may take 5-7 business days.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg text-foreground mb-2">Tracking</h2>
        <p>Once your order is dispatched, you will receive a tracking number via SMS and email.</p>
      </section>
    </div>
  </div>
);

export default ShippingPolicy;
