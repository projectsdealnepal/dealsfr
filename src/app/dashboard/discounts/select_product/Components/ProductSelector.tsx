"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/redux/hooks";
import { PlusCircle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { TempProductPrevList } from "./TempProductPrevList";

export default function SelectProductDialog() {
  const [selectProductDialog, setSelectProductDialog] = useState(false); const { tempDiscountProductList, productList } = useAppSelector((s) => s.product);


  return (
    <div className="w-full space-y-2">
      {/* <Label htmlFor="targetType">Targets</Label> */}
      <div className="flex w-full items-center gap-3">
        {/* Show only if there are selected products */}
        {tempDiscountProductList && tempDiscountProductList.length > 0 && (
          <>
            <Card
              className="flex bg-primary/20 flex-row items-center justify-between cursor-pointer flex-1 p-4 hover:bg-accent/30 transition"
            >
              <span className="text-sm font-medium">Products Selected</span>
              <Badge variant="secondary">
                {tempDiscountProductList.length}
              </Badge>
            </Card>
          </>
        )}

        {/* Add Products Dialog */}
        <Dialog
          open={selectProductDialog}
          onOpenChange={setSelectProductDialog}
        >
          <DialogTitle asChild>
            <DialogTrigger asChild>
              <Card className="flex flex-row items-center justify-center gap-2 border-2 border-red-300 border-dashed cursor-pointer p-3 flex-1 hover:bg-accent/30 transition">
                {tempDiscountProductList.length > 0 ? (
                  <div className="flex flex-row  p-1  gap-2 justify-between items-center " >
                    <RotateCcw size={16} />
                    <span className="text-sm font-medium">Replace</span>
                  </div>
                ) : (
                  <div className="py-6 space-y-2 flex flex-col justify-center items-center">
                    <PlusCircle size={16} />
                    <span className="text-sm font-semibold">Add Products</span>
                    <span className="text-sm font-medium text-foreground/80">Search and select product to apply discount</span>
                  </div>
                )}
              </Card>
            </DialogTrigger>
          </DialogTitle>
          <DialogContent className="!max-w-none w-[95%] h-full p-0 bg-white">
            <div className="h-full w-full overflow-y-auto p-6">
              {productList && (
                <DataTable
                  setSelectProductDialog={() => setSelectProductDialog(false)}
                  columns={columns}
                  data={productList}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* it will show the selected product list */}
      {tempDiscountProductList.length > 0 && (
        <div className="h-40 overflow-y-auto py-2">
          <TempProductPrevList />
        </div>
      )}
    </div>
  );
}
