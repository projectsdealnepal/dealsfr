"use client"
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from '@/redux/features/product/product';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ProductItem } from '@/redux/features/product/types';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);
  const { storeDetailData } = useAppSelector(s => s.store)
  const dispatch = useAppDispatch();
  const { productData, productLoading, productError } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (storeDetailData) {
      dispatch(getProducts(storeDetailData.id))
    }

  }, [storeDetailData])

  const handleCheckboxChange = (product: ProductItem) => {
    setSelectedProducts((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6" style={{ background: 'var(--card)', color: 'var(--card-foreground)' }}>
        <CardHeader>
          <CardTitle>Product Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border"
              style={{ borderColor: 'var(--border)', background: 'var(--input)', color: 'var(--foreground)' }}
            />
            <Button
              onClick={() => { }}
              disabled={productLoading}
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              {productLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {productError && (
        <div className="text-destructive mb-4" style={{ color: 'var(--destructive)' }}>
          {productError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productData && productData?.map((product) => (
          <Card key={product.id} style={{ background: 'var(--card)', color: 'var(--card-foreground)' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedProducts.some((item) => item.id === product.id)}
                  onCheckedChange={() => handleCheckboxChange(product)}
                />
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                  style={{ borderColor: 'var(--border)' }}
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {product.description}
                  </p>
                  <p className="text-sm font-medium">
                    Price: {product.price || product.price}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProducts.length > 0 && (
        <Card className="mt-6" style={{ background: 'var(--card)', color: 'var(--card-foreground)' }}>
          <CardHeader>
            <CardTitle>Selected Products ({selectedProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {selectedProducts.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
