
"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, RotateCcw } from "lucide-react";
import { DataTable } from "./data-table";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { columns } from "./columns";
import { TempProductPrevSheet } from "./TempProductPrevSheet";


export default function SelectRewardDialog() {
  const [rewardProductPrev, setRewardProductPrev] = useState(false)
  const [selectProductDialog, setSelectProductDialog] = useState(false);
  const { rewardProductList, productList, } = useAppSelector(s => s.product)



  return (
    <div className="w-full space-y-2">
      <div className="flex w-full items-center gap-3">
        {/* Show only if there are selected products */}
        {rewardProductList && rewardProductList.length > 0 && (
          <>
            <Card
              onClick={() => setRewardProductPrev(true)}
              className="flex bg-primary/20 flex-row items-center justify-between cursor-pointer flex-1 p-3 hover:bg-accent/30 transition"
            >
              <span className="text-sm font-medium">
                Products Selected
              </span>
              <Badge variant="secondary">
                {rewardProductList?.length}
              </Badge>
            </Card>

            {/* Sheet for previewing selected products */}
            <TempProductPrevSheet
              mode="reward"
              open={rewardProductPrev}
              onClose={() => setRewardProductPrev(false)}
            />
          </>
        )}

        {/* Add Products Dialog */}
        <Dialog
          open={selectProductDialog}
          onOpenChange={setSelectProductDialog}
        >
          <DialogTitle asChild>
            <DialogTrigger asChild>
              <Card className="flex flex-row items-center justify-center gap-2 cursor-pointer p-3 flex-1 hover:bg-accent/30 transition">
                {rewardProductList.length > 0 ?
                  (
                    <>
                      <RotateCcw size={16} />
                      <span className="text-sm font-medium">
                        Replace
                      </span>
                    </>
                  )
                  :
                  (
                    <>
                      <PlusCircle size={16} />
                      <span className="text-sm font-medium">
                        Add Products
                      </span>
                    </>
                  )}
              </Card>
            </DialogTrigger>
          </DialogTitle>
          <DialogContent className="!max-w-none w-[95%] h-full p-0 bg-white">
            <div className="h-full w-full overflow-y-auto p-6">
              {productList && (
                <DataTable
                  mode="reward"
                  setSelectProductDialog={() => setSelectProductDialog(false)}
                  columns={columns}
                  data={productList}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div >
  );
}
