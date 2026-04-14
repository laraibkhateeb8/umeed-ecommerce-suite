import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/data/products";

const stats = [
  { title: "Total Products", value: products.length.toString(), icon: Package, change: "+2 this week" },
  { title: "Total Orders", value: "24", icon: ShoppingCart, change: "+5 today" },
  { title: "Customers", value: "156", icon: Users, change: "+12 this month" },
  { title: "Revenue", value: "PKR 285,000", icon: TrendingUp, change: "+18% this month" },
];

const recentOrders = [
  { id: "ORD-001", customer: "Ayesha Khan", total: "PKR 7,200", status: "Processing", date: "2026-04-14" },
  { id: "ORD-002", customer: "Fatima Ali", total: "PKR 3,500", status: "Shipped", date: "2026-04-13" },
  { id: "ORD-003", customer: "Sana Ahmed", total: "PKR 11,000", status: "Delivered", date: "2026-04-12" },
  { id: "ORD-004", customer: "Hira Malik", total: "PKR 5,200", status: "Processing", date: "2026-04-12" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{order.id}</td>
                    <td className="py-3 px-2">{order.customer}</td>
                    <td className="py-3 px-2">{order.total}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{order.date}</td>
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
