import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  customer: string;
  phone: string;
  city: string;
  total: string;
  items: number;
  payment: string;
  status: string;
  date: string;
}

const initialOrders: Order[] = [
  { id: "ORD-001", customer: "Ayesha Khan", phone: "0300-1234567", city: "Lahore", total: "PKR 7,200", items: 2, payment: "COD", status: "Processing", date: "2026-04-14" },
  { id: "ORD-002", customer: "Fatima Ali", phone: "0321-7654321", city: "Karachi", total: "PKR 3,500", items: 1, payment: "JazzCash", status: "Shipped", date: "2026-04-13" },
  { id: "ORD-003", customer: "Sana Ahmed", phone: "0333-9876543", city: "Islamabad", total: "PKR 11,000", items: 3, payment: "Bank Transfer", status: "Delivered", date: "2026-04-12" },
  { id: "ORD-004", customer: "Hira Malik", phone: "0345-1122334", city: "Faisalabad", total: "PKR 5,200", items: 1, payment: "EasyPaisa", status: "Processing", date: "2026-04-12" },
  { id: "ORD-005", customer: "Zara Noor", phone: "0312-5566778", city: "Rawalpindi", total: "PKR 9,600", items: 2, payment: "COD", status: "Cancelled", date: "2026-04-11" },
];

const statusColors: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Orders</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">City</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div>{order.customer}</div>
                        <div className="text-xs text-muted-foreground">{order.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.city}</td>
                    <td className="py-3 px-4">{order.total}</td>
                    <td className="py-3 px-4">{order.payment}</td>
                    <td className="py-3 px-4">
                      <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                            {order.status}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
