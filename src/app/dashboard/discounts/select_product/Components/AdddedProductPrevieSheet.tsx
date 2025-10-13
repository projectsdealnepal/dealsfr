"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryItem } from "@/redux/features/category/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { updateTempProductList } from "@/redux/features/product/productSlice";
import { Badge } from "@/components/ui/badge";


interface TempProductPrevSheetProps {
  open: boolean;
  onClose: () => void;
}

export function TempProductPrevSheet({
  open,
  onClose,
}: TempProductPrevSheetProps) {
  const dispatch = useAppDispatch()
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const { tempDiscountProductList } = useAppSelector(s => s.product)

  const getAllChildIds = (cat: CategoryItem): number[] => {
    let ids: number[] = [cat.id];
    for (const child of cat.children) {
      ids = ids.concat(getAllChildIds(child));
    }
    return ids;
  };


  const handleRemoveTempProduct = (id: number) => {
    //filter the removed product and modify the redux state
    const modifiedSelected: Record<string, boolean> = {}
    const modifiedArr = tempDiscountProductList.filter(item => item.id != id)
    modifiedArr.forEach((item) => modifiedSelected[item.id.toString()] = true)

    dispatch(updateTempProductList(modifiedArr))
  }
  console.log({ tempDiscountProductList })

  return (
    <Sheet open={open} onOpenChange={onClose} >
      <SheetContent side="left" >
        <SheetHeader>
          <SheetTitle>
            Products
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="max-h-[80%] w-full px-2  border-none" >
          {tempDiscountProductList.map((product) => (
            <Card
              key={product.id}
              className="p-2 mt-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Price: ${product.price}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => handleRemoveTempProduct(product?.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}

          {tempDiscountProductList.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No products selected yet
            </p>
          )}
        </ScrollArea>

      </SheetContent>
    </Sheet>
  );
}
