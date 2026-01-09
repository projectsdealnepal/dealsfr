"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryItem } from "@/redux/features/category/types";
import {
  updateRewardProductList,
  updateTempProductList,
} from "@/redux/features/product/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Trash2 } from "lucide-react";

interface TempProductPreviewProps {
  mode?: "reward" | "default";
}

export function TempProductPrevList({
  mode = "default",
}: TempProductPreviewProps) {
  const dispatch = useAppDispatch();
  const { tempDiscountProductList } = useAppSelector((s) => s.product);

  const handleRemoveTempProduct = (id: number) => {
    const modifiedArr = tempDiscountProductList.filter(
      (item) => item.id !== id
    );
    dispatch(updateTempProductList(modifiedArr));
  };

  const productList = tempDiscountProductList;

  return (
    <div className="w-full flex flex-col ">
      {productList.length > 0 ? (
        productList.map((product, index) => (
          <div
            key={product.id}
            className={`p-3 py-1 border-b ${
              index % 2 == 0 ? "bg-muted" : "bg-muted/50"
            } flex justify-between hover:bg-muted/30 transition-colors  `}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
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
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Price: ${product.price}
                </p>
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
