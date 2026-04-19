import { useState } from "react";
import { Plus, Pencil, Trash2, Upload, X, ImageIcon } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

interface ProductForm {
  title: string;
  price: string;
  original_price: string;
  description: string;
  category: string;
  badge: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
}

const emptyForm: ProductForm = {
  title: "",
  price: "",
  original_price: "",
  description: "",
  category: "",
  badge: "",
  sizes: [],
  colors: [],
  images: [],
};

export default function AdminProducts() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<ProductForm>(emptyForm);

  const { data: productList = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (values: ProductForm & { id?: string }) => {
      const payload = {
        title: values.title,
        price: Number(values.price),
        original_price: values.original_price ? Number(values.original_price) : null,
        description: values.description,
        category: values.category,
        badge: values.badge || null,
        sizes: values.sizes,
        colors: values.colors,
        images: values.images,
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
      setDeleteId(null);
    },
    onError: (e: Error) => toast({ title: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setColorName("");
    setColorHex("#000000");
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: p.price.toString(),
      original_price: p.original_price?.toString() || "",
      description: p.description || "",
      category: p.category,
      badge: p.badge || "",
      sizes: p.sizes || [],
      colors: Array.isArray(p.colors) ? p.colors : [],
      images: p.images || [],
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
        uploaded.push(data.publicUrl);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
      toast({ title: `Uploaded ${uploaded.length} image(s)` });
    } catch (err) {
      toast({ title: (err as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  };

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  const addColor = () => {
    if (!colorName.trim()) return;
    setForm((f) => ({ ...f, colors: [...f.colors, { name: colorName.trim(), hex: colorHex }] }));
    setColorName("");
    setColorHex("#000000");
  };

  const removeColor = (idx: number) => {
    setForm((f) => ({ ...f, colors: f.colors.filter((_, i) => i !== idx) }));
  };

  const handleSave = () => {
    if (!form.title || !form.price || !form.category) {
      toast({ title: "Please fill title, price and category", variant: "destructive" });
      return;
    }
    if (form.images.length === 0) {
      toast({ title: "Please upload at least one image", variant: "destructive" });
      return;
    }
    upsertMutation.mutate(editingId ? { ...form, id: editingId } : form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            {productList.length} product{productList.length === 1 ? "" : "s"} in catalog
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              {/* Images */}
              <div>
                <Label>Product Images *</Label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {form.images.map((url) => (
                    <div key={url} className="relative aspect-square rounded-md overflow-hidden border group">
                      <img src={url} alt="product" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">
                      {uploading ? "Uploading..." : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Price (PKR) *</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Original Price (optional)</Label>
                  <Input
                    type="number"
                    value={form.original_price}
                    onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Badge (optional)</Label>
                  <Input
                    placeholder="e.g. New, Sale, Bestseller"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <Label>Available Sizes</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 rounded-md border text-sm transition ${
                        form.sizes.includes(s)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <Label>Colors</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Color name (e.g. Beige)"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="h-10 w-14 rounded-md border border-input cursor-pointer"
                  />
                  <Button type="button" variant="outline" onClick={addColor}>
                    Add
                  </Button>
                </div>
                {form.colors.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.colors.map((c, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1.5 pl-1.5">
                        <span
                          className="h-3 w-3 rounded-full border border-border"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                        <button type="button" onClick={() => removeColor(idx)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} className="w-full" disabled={upsertMutation.isPending || uploading}>
                {upsertMutation.isPending ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading products...</p>
      ) : productList.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-heading text-lg font-semibold">No products yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Add Product" to create your first item.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Image</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Badge</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-12 w-12 rounded-md object-cover border"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{product.title}</td>
                      <td className="py-3 px-4 capitalize">{product.category}</td>
                      <td className="py-3 px-4">
                        <div>PKR {Number(product.price).toLocaleString()}</div>
                        {product.original_price && (
                          <div className="text-xs text-muted-foreground line-through">
                            PKR {Number(product.original_price).toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {product.badge && <Badge variant="secondary">{product.badge}</Badge>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(product.id)}>
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

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently removed from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
