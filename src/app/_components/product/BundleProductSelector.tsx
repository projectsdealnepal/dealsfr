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
import { columns } from "../../dashboard/discounts/select_product/Components/columns";
import { DataTable } from "../../dashboard/discounts/select_product/Components/data-table";
import { BundleProductPrevList } from "./BundleProductPrevList";

export default function BundleProductSelector() {
  const [bundleProductPrev, setBundleProductPrev] = useState(false);
  const [bundleProductDialog, setBundleProductDialog] = useState(false);
  const { bundleProductList, productList } = useAppSelector((s) => s.product);

  return (
    <div className="w-full space-y-2">
      <div className="flex w-full items-center gap-3">
        {/* Show only if there are selected products */}
        {bundleProductList && bundleProductList.length > 0 && (
          <>
            <Card
              onClick={() => setBundleProductPrev(true)}
              className="flex bg-primary/20 flex-row items-center justify-between cursor-pointer flex-1 p-3 hover:bg-accent/30 transition"
            >
              <span className="text-sm font-medium">Products Selected</span>
              <Badge variant="secondary">{bundleProductList?.length}</Badge>
            </Card>
          </>
        )}
        {/* Add Products Dialog */}
        <Dialog
          open={bundleProductDialog}
          onOpenChange={setBundleProductDialog}
        >
          <DialogTitle asChild>
            <DialogTrigger asChild>
              <Card className="flex flex-row items-center justify-center gap-2 cursor-pointer p-3 flex-1 hover:bg-accent/30 transition">
                {bundleProductList.length > 0 ? (
                  <>
                    <RotateCcw size={16} />
                    <span className="text-sm font-medium">Replace</span>
                  </>
                ) : (
                  <div className="flex flex-row items-center gap-2">
                    <PlusCircle size={16} />
                    <span className="text-sm font-medium">Choose Products</span>
                  </div>
                )}
              </Card>
            </DialogTrigger>
          </DialogTitle>
          <DialogContent className="!max-w-none w-[95%] h-full p-0 bg-white">
            <div className="h-full w-full overflow-y-auto p-6">
              {productList && (
                <DataTable
                  mode="bundle"
                  setSelectProductDialog={() => setBundleProductDialog(false)}
                  columns={columns}
                  data={productList}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sheet for previewing selected products */}
      <div className="w-full">
        <BundleProductPrevList />
      </div>
    </div>
  );
}
