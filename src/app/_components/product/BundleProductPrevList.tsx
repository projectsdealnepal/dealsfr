"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateBundleProductList } from "@/redux/features/product/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Trash2 } from "lucide-react";

interface TempProductPreviewProps {
  mode?: "bundle" | "default";
}

export function BundleProductPrevList({
  mode = "default",
}: TempProductPreviewProps) {
  const dispatch = useAppDispatch();
  const { bundleProductList } = useAppSelector((s) => s.product);

  //  Remove item from list
  const handleRemoveTempProduct = (id: number) => {
    const modifiedArr = bundleProductList.filter((item) => item.id !== id);
    dispatch(updateBundleProductList(modifiedArr));
  };

  //  Update quantity and sync with Redux
  const handleQuantityChange = (id: number, quantity: number) => {
    // Ensure minimum quantity = 1
    const validQuantity = Math.max(1, quantity);

    const updatedList = bundleProductList.map((item) =>
      item.id === id ? { ...item, quantity: validQuantity } : item
    );

    dispatch(updateBundleProductList(updatedList));
  };

  const productList = bundleProductList;

  return (
    <div className="w-full flex flex-col gap-1">
      {productList.length > 0 ? (
        productList.map((product, index) => (
          <div
            key={product.id}
            className="group flex flex-row items-center justify-between p-3 rounded-xl bg-background/50 border border-transparent hover:border-primary/20 hover:bg-background hover:shadow-sm transition-all duration-300"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-muted shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs font-medium text-muted-foreground">
                  NPR {parseFloat(product.price).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-6 px-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                    Quantity
                  </span>
                  <div className="relative">
                    <Input
                      className="w-16 h-8 text-center font-bold bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-7 text-xs"
                      value={product.quantity}
                      min={1}
                      type="number"
                      onChange={(e) =>
                        handleQuantityChange(product.id, Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  onClick={() => handleRemoveTempProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-2 opacity-40">
          <p className="text-xs font-bold uppercase tracking-widest">
            Yet to select Products
          </p>
        </div>
      )}
    </div>
  );
}
