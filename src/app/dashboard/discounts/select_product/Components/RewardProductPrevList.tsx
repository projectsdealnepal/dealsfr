"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  updateRewardProductList,
} from "@/redux/features/product/productSlice";
import { Input } from "@/components/ui/input";

interface TempProductPreviewProps {
  mode?: "reward" | "default";
}

export function RewardProductPrevList({ mode = "default" }: TempProductPreviewProps) {
  const dispatch = useAppDispatch();
  const { rewardProductList } = useAppSelector((s) => s.product);

  //  Remove item from list
  const handleRemoveTempProduct = (id: number) => {
    const modifiedArr = rewardProductList.filter((item) => item.id !== id);
    dispatch(updateRewardProductList(modifiedArr));
  };

  //  Update quantity and sync with Redux
  const handleQuantityChange = (id: number, quantity: number) => {
    // Ensure minimum quantity = 1
    const validQuantity = Math.max(1, quantity);

    const updatedList = rewardProductList.map((item) =>
      item.id === id ? { ...item, quantity: validQuantity } : item
    );

    dispatch(updateRewardProductList(updatedList));
  };

  const productList = rewardProductList;

  return (
    <div className="w-full flex flex-col">
      {productList.length > 0 ? (
        productList.map((product, index) => (
          <div
            key={product.id}
            className={`p-3 py-1 border-b ${index % 2 == 0 ? "bg-muted" : "bg-muted/50"
              } flex justify-between hover:bg-muted/30 transition-colors`}
          >
            <div className="flex items-center gap-5 min-w-0 flex-1">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="w-6 h-6 object-cover rounded-md border shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate-2 line-clamp-1 text-sm sm:text-base">
                  {product.name}
                </h3>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Price: ${product.price}
                </p>
              </div>
              <div>
                <Input
                  className="w-20"
                  value={product.quantity}
                  min={1}
                  type="number"
                  onChange={(e) =>
                    handleQuantityChange(product.id, Number(e.target.value))
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive shrink-0"
                onClick={() => handleRemoveTempProduct(product.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-6">
          No products selected yet
        </p>
      )}
    </div>
  );
}
