"use client";
import { getSubCategory } from "@/redux/features/category/category";
import { useAppDispatch } from "@/redux/hooks";
import React, { useEffect, useMemo, useState } from "react";
import { JSX } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSubCategory());
  }, []);

  interface Product {
    id: string;
    mainCategory: string;
    subCategory: string;
    productName: string;
    price: number;
    image: string;
    description: string;
  }

  // --- Constants ---
  const LS_KEY = "products:v2"; // bump key because schema changed
  const MAIN_CATEGORIES = ["Electronics", "Apparel", "Home"] as const;
  const SUB_CATEGORIES: Record<(typeof MAIN_CATEGORIES)[number], string[]> = {
    Electronics: ["Laptops", "Mobiles", "Accessories"],
    Apparel: ["T-Shirts", "Jeans", "Shoes"],
    Home: ["Kitchen", "Furniture", "Decor"],
  };

  // --- Utils ---
  function uid() {
    return (
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 8)
    ).toUpperCase();
  }

  function loadProducts(): Product[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Product[]) : [];
    } catch {
      return [];
    }
  }

  function saveProducts(products: Product[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(products));
  }

  // --- State ---
  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  const [form, setForm] = useState<Omit<Product, "id">>({
    mainCategory: MAIN_CATEGORIES[0],
    subCategory: SUB_CATEGORIES[MAIN_CATEGORIES[0]][0],
    productName: "",
    price: 0,
    image: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<
    "productName_asc" | "productName_desc" | "price_asc" | "price_desc"
  >("productName_asc");
  const [error, setError] = useState<string>("");

  // Persist
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY) setProducts(loadProducts());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Derived
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = products.filter((p) =>
      [p.productName, p.mainCategory, p.subCategory, p.description]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );

    switch (sort) {
      case "productName_asc":
        items = items.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case "productName_desc":
        items = items.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      case "price_asc":
        items = items.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price_desc":
        items = items.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
    }
    return items;
  }, [products, query, sort]);

  // Handlers
  function resetForm() {
    setForm({
      mainCategory: MAIN_CATEGORIES[0],
      subCategory: SUB_CATEGORIES[MAIN_CATEGORIES[0]][0],
      productName: "",
      price: 0,
      image: "",
      description: "",
    });
    setEditingId(null);
    setError("");
  }

  function validate(): string {
    if (!form.productName.trim()) return "Product name is required";
    if (form.price === undefined || isNaN(Number(form.price)))
      return "Valid price is required";
    if (Number(form.price) < 0) return "Price cannot be negative";
    if (!form.mainCategory) return "Main category is required";
    if (!form.subCategory) return "Sub category is required";
    if (!form.image.trim()) return "Image URL is required";
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { id: editingId, ...form } : p))
      );
    } else {
      const newProduct: Product = { id: uid(), ...form };
      setProducts((prev) => [newProduct, ...prev]);
    }
    resetForm();
  }

  function handleEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      mainCategory: p.mainCategory,
      subCategory: p.subCategory,
      productName: p.productName,
      price: p.price,
      image: p.image,
      description: p.description,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              if (!confirm("Clear ALL products? This cannot be undone."))
                return;
              setProducts([]);
            }}
            title="Clear all products"
          >
            Clear All
          </Button>
        </header>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingId ? "Edit product" : "Add a product"}
                </CardTitle>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mainCategory">Main Category</Label>
                    <Select
                      value={form.mainCategory}
                      onValueChange={(value) => {
                        const mc = value as (typeof MAIN_CATEGORIES)[number];
                        setForm((f) => ({
                          ...f,
                          mainCategory: mc,
                          subCategory: SUB_CATEGORIES[mc][0],
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MAIN_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub Category</Label>
                    <Select
                      value={form.subCategory}
                      onValueChange={(value) =>
                        setForm((f) => ({ ...f, subCategory: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUB_CATEGORIES[
                          form.mainCategory as keyof typeof SUB_CATEGORIES
                        ].map((sc) => (
                          <SelectItem key={sc} value={sc}>
                            {sc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={form.productName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, productName: e.target.value }))
                      }
                      placeholder="e.g., Mechanical Keyboard"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        inputMode="decimal"
                        step="1"
                        value={form.price}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            price: Number(e.target.value),
                          }))
                        }
                        placeholder="e.g., 49.99"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={form.image}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, image: e.target.value }))
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      placeholder="Optional details"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button type="submit">
                      {editingId ? "Save Changes" : "Add Product"}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* List & Controls */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, category, description..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Sort</Label>
                <Select
                  value={sort}
                  onValueChange={(value) => setSort(value as any)}
                >
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="productName_asc">Name A–Z</SelectItem>
                    <SelectItem value="productName_desc">Name Z–A</SelectItem>
                    <SelectItem value="price_asc">Price Low → High</SelectItem>
                    <SelectItem value="price_desc">Price High → Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.productName}
                          className="h-16 w-16 flex-none rounded-lg object-cover border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold leading-tight truncate text-foreground">
                          {p.productName}
                        </h3>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {p.mainCategory}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {p.subCategory}
                          </Badge>
                        </div>
                        {p.description && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                            {p.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          ${p.price.toFixed(2)}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(p)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(p.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <Card className="mt-8">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No products yet. Use the form to add one.
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>
            Data is stored in your browser (localStorage). Refreshing or
            navigating away will keep it intact.
          </p>
        </footer>
      </div>
    </div>
  );
}
