
"use client";

import { Virtuoso } from "react-virtuoso";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, ChevronsUpDown, PlusCircle, RotateCcw } from "lucide-react";
import { TempProductPrevSheet } from "./AdddedProductPrevieSheet";
import { DataTable } from "./data-table";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { columns } from "./columns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { BrandItem } from "@/redux/features/product/types";

interface TargetSelectorProps {
  selectedTargetType: string;
  errors?: { target?: string };
}

export default function TargetSelector({
  selectedTargetType,
  errors,
}: TargetSelectorProps) {
  const [tempProductPrev, setTempProductPrev] = useState(false)
  const [selectProductDialog, setSelectProductDialog] = useState(false);
  const { brandListData, tempDiscountProductList, productList, } = useAppSelector(s => s.product)

  const [open, setOpen] = useState(false);
  const [brandValue, setBrandValue] = useState<BrandItem>();
  const filteredBrands = useMemo(() => brandListData ?? [], [brandListData]);

  console.log(brandValue)

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="targetType">Targets</Label>
      {selectedTargetType === "PRODUCT" ? (
        <div className="flex w-full items-center gap-3">
          {/* Show only if there are selected products */}
          {tempDiscountProductList && tempDiscountProductList.length > 0 && (
            <>
              <Card
                onClick={() => setTempProductPrev(true)}
                className="flex bg-primary/20 flex-row items-center justify-between cursor-pointer flex-1 p-3 hover:bg-accent/30 transition"
              >
                <span className="text-sm font-medium">
                  Products Selected
                </span>
                <Badge variant="secondary">
                  {tempDiscountProductList.length}
                </Badge>
              </Card>

              {/* Sheet for previewing selected products */}
              <TempProductPrevSheet
                open={tempProductPrev}
                onClose={() => setTempProductPrev(false)}
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
                  {tempDiscountProductList.length > 0 ?
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
                    setSelectProductDialog={() => setSelectProductDialog(false)}
                    columns={columns}
                    data={productList}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {brandValue?.name || "Select Brand..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search brands..." className="h-9" />
                <CommandEmpty>No brand found.</CommandEmpty>
                <CommandGroup>
                  <div style={{ height: "300px", minHeight: "300px" }}>
                    <Virtuoso
                      style={{ height: "300px" }} // scrollable area height
                      totalCount={filteredBrands.length}
                      itemContent={(index) => {
                        const brand = filteredBrands[index];
                        return (
                          <CommandItem
                            key={brand.id}
                            value={brand.name}
                            onSelect={() => {
                              if (brandValue?.id === brand.id) {
                                setBrandValue(undefined); // unselect if already selected
                              } else {
                                setBrandValue(brand); // store the full brand object
                              }
                              setOpen(false);
                            }}
                          >
                            {brand.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                brandValue?.name === brand.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        );
                      }}
                    />
                  </div>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </>
      )}

      {errors?.target && (
        <p className="text-sm text-red-500">{errors.target}</p>
      )}
    </div >
  );
}
