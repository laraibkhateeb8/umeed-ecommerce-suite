import { Card, CardContent } from "@/components/ui/card";

const customers = [
  { id: 1, name: "Ayesha Khan", email: "ayesha@email.com", phone: "0300-1234567", city: "Lahore", orders: 5, totalSpent: "PKR 32,500" },
  { id: 2, name: "Fatima Ali", email: "fatima@email.com", phone: "0321-7654321", city: "Karachi", orders: 3, totalSpent: "PKR 18,200" },
  { id: 3, name: "Sana Ahmed", email: "sana@email.com", phone: "0333-9876543", city: "Islamabad", orders: 8, totalSpent: "PKR 54,800" },
  { id: 4, name: "Hira Malik", email: "hira@email.com", phone: "0345-1122334", city: "Faisalabad", orders: 2, totalSpent: "PKR 10,400" },
  { id: 5, name: "Zara Noor", email: "zara@email.com", phone: "0312-5566778", city: "Rawalpindi", orders: 4, totalSpent: "PKR 28,100" },
];

export default function AdminCustomers() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Customers</h1>

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
                    <td className="py-3 px-4">{c.email}</td>
                    <td className="py-3 px-4">{c.phone}</td>
                    <td className="py-3 px-4">{c.city}</td>
                    <td className="py-3 px-4">{c.orders}</td>
                    <td className="py-3 px-4">{c.totalSpent}</td>
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
