import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function AdminCustomers() {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Customers</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="text-muted-foreground">No customers yet. Customer records will appear here when orders are placed.</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">City</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Orders</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{c.name}</td>
                      <td className="py-3 px-4">{c.email || "—"}</td>
                      <td className="py-3 px-4">{c.phone}</td>
                      <td className="py-3 px-4">{c.city || "—"}</td>
                      <td className="py-3 px-4">{c.total_orders}</td>
                      <td className="py-3 px-4">PKR {Number(c.total_spent || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
