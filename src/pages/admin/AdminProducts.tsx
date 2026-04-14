import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminProducts() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    price: "",
    original_price: "",
    description: "",
    category: "",
  });

  const { data: productList = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (values: typeof form & { id?: string }) => {
      const payload = {
        title: values.title,
        price: Number(values.price),
        original_price: values.original_price ? Number(values.original_price) : null,
        description: values.description,
        category: values.category,
      };
      if (values.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: editingId ? "Product updated" : "Product added" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (e: Error) => toast({ title: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product deleted" });
    },
  });

  const resetForm = () => {
    setForm({ title: "", price: "", original_price: "", description: "", category: "" });
    setEditingId(null);
  };

  const openAdd = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: p.price.toString(),
      original_price: p.original_price?.toString() || "",
      description: p.description || "",
      category: p.category,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.price || !form.category) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    upsertMutation.mutate(editingId ? { ...form, id: editingId } : form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Products</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Price (PKR) *</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <Label>Original Price</Label>
                  <Input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <Button onClick={handleSave} className="w-full" disabled={upsertMutation.isPending}>
                {editingId ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading products...</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rating</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{product.title}</td>
                      <td className="py-3 px-4 capitalize">{product.category}</td>
                      <td className="py-3 px-4">PKR {Number(product.price).toLocaleString()}</td>
                      <td className="py-3 px-4">{product.rating} ⭐</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
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
