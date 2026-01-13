import SelectRewardDialog from "@/app/dashboard/discounts/select_product/Components/SelectRewardDialog";
import {
  BOGODiscount,
  BundleDiscount,
  FixedAmountDiscount,
  PartialDiscountItem,
  PercentageDiscount,
  SpendGetDiscount,
} from "@/app/dashboard/discounts/select_product/Components/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TargetType, ValueType } from "@/redux/features/product/types";
import { DollarSign, Gift, Percent, ShoppingBag, Tag } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

interface RenderDiscountFieldsProps {
  currentItem: PartialDiscountItem;
  setCurrentItem: Dispatch<SetStateAction<PartialDiscountItem>>;
  errors: Record<string, string>;
}

export const DiscountFieldRender = ({
  errors,
  currentItem,
  setCurrentItem,
}: RenderDiscountFieldsProps) => {
  console.log("currentItem", currentItem);
  switch (currentItem.discountType) {
    case "PERCENTAGE":
      return (
        <div className="grid grid-cols-1 gap-6 pt-2">
          <div className="space-y-2.5">
            <Label
              htmlFor="percentageValue"
              className="text-xs font-medium uppercase tracking-wider"
            >
              Discount Percentage
            </Label>
            <div className="relative group">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
              <Input
                id="percentageValue"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="20"
                className="pl-9 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
                value={
                  (currentItem as PercentageDiscount).percentageValue || ""
                }
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    percentageValue: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            {errors.percentageValue && (
              <p className="text-xs text-red-500 font-medium ml-1">
                {errors.percentageValue}
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="maximumDiscount"
              className="text-xs font-medium uppercase tracking-wider"
            >
              Max Discount Cap
            </Label>
            <div className="relative group">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
              <Input
                id="maximumDiscount"
                type="number"
                min="0"
                placeholder="1000"
                className="pl-9 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
                value={
                  (currentItem as PercentageDiscount).maximumDiscount || ""
                }
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    maximumDiscount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        </div>
      );

    case "FIXED_AMOUNT":
      return (
        <div className="space-y-2">
          <Label
            htmlFor="amountValue"
            className="text-xs font-medium uppercase tracking-wider"
          >
            Discount Amount
          </Label>
          <div className="relative group">
            <p className="absolute left-3 text-sm top-1/4  h-2 w-2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
              NPR
            </p>
            <Input
              className="pl-12 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
              id="amountValue"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 50"
              value={(currentItem as FixedAmountDiscount).amountValue || ""}
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  amountValue: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          {errors.amountValue && (
            <p className="text-xs text-red-500 font-medium ml-1">
              {errors.amountValue}
            </p>
          )}
        </div>
      );

    case "BOGO":
      return (
        <div className="space-y-6 pt-2">
          {/* Buy Quantity Section */}
          <div className="space-y-2.5">
            <Label
              htmlFor="buyQuantity"
              className="text-xs font-medium uppercase tracking-wider"
            >
              Buy Quantity
            </Label>
            <div className="relative group w-full">
              <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
              <Input
                id="buyQuantity"
                type="number"
                min="1"
                step="1"
                placeholder="Buy quantity (e.g., 2)"
                className="pl-9 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
                value={(currentItem as BOGODiscount).buyQuantity || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    buyQuantity: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            {errors.buyQuantity && (
              <p className="text-xs text-red-500 font-medium ml-1">
                {errors.buyQuantity}
              </p>
            )}
          </div>

          <div className="border-t border-dashed my-4 opacity-50" />

          {/* Discount Logic Section */}
          <div className="space-y-4">
            <Label className="text-xs font-medium uppercase tracking-wider">
              Discount Type & Value
            </Label>
            <Tabs
              defaultValue="PERCENTAGE"
              className="w-full "
              onValueChange={(v) => {
                setCurrentItem({
                  ...currentItem,
                  discountType: currentItem.discountType,
                  valueType: v as ValueType,
                });
              }}
            >
              <TabsList className="grid w-full gap-4 grid-cols-2 h-11 p-1  mb-6">
                <TabsTrigger
                  value="PERCENTAGE"
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Percentage Off
                </TabsTrigger>
                <TabsTrigger
                  value="FIXED_AMOUNT"
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Fixed Amount Off
                </TabsTrigger>
              </TabsList>

              <TabsContent value="PERCENTAGE" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="percentageValue"
                      className="text-xs font-medium uppercase tracking-wider"
                    >
                      Discount (%)
                    </Label>
                    <div className="relative group">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="percentageValue"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="100"
                        className="pl-9 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
                        value={
                          (currentItem as BOGODiscount).percentageValue || ""
                        }
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            percentageValue: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    {errors.percentageValue && (
                      <p className="text-xs text-red-500 font-medium ml-1">
                        {errors.percentageValue}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="maximumDiscount"
                      className="text-xs font-medium uppercase tracking-wider"
                    >
                      Max Cap
                    </Label>
                    <div className="relative group">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="maximumDiscount"
                        type="number"
                        min="0"
                        placeholder="e.g., 50"
                        className="pl-9 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
                        value={
                          (currentItem as BOGODiscount).maximumDiscount || ""
                        }
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            maximumDiscount: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="FIXED_AMOUNT" className="mt-0">
                <div className="space-y-2.5 max-w-sm">
                  <Label
                    htmlFor="discountValue"
                    className="text-xs font-medium uppercase tracking-wider"
                  >
                    Discount Amount
                  </Label>
                  <div className="relative group">
                    <p className="absolute left-3 text-sm top-1/4  h-2 w-2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                      NPR
                    </p>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 50"
                      className="pl-12 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
                      value={(currentItem as BOGODiscount).discountValue || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          discountValue: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  {errors.discountValue && (
                    <p className="text-xs text-red-500 font-medium ml-1">
                      {errors.discountValue}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-4 w-4 text-primary" />
              <Label className="text-sm font-semibold text-foreground">
                Additional Reward Items
              </Label>
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </div>
            <div className="pl-1">
              <SelectRewardDialog />
            </div>
          </div>
        </div>
      );

    case "SPEND_GET":
      return (
        <div className="space-y-6 pt-2">
          {/* Minimum Spend Section */}
          <div className="space-y-2.5">
            <Label
              htmlFor="spendAmount"
              className="text-xs font-medium uppercase tracking-wider"
            >
              Minimum Spend Amount
            </Label>
            <div className="relative group w-full">
              <p className="absolute left-3 text-sm top-1/4  h-2 w-2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                NPR
              </p>
              <Input
                id="spendAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 500"
                className="pl-12 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
                value={(currentItem as SpendGetDiscount).spendAmount || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    spendAmount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            {errors.spendAmount && (
              <p className="text-xs text-red-500 font-medium ml-1">
                {errors.spendAmount}
              </p>
            )}
          </div>

          <div className="border-t border-dashed my-4 opacity-50" />

          {/* Discount Logic Section */}
          <div className="space-y-4">
            <Label className="text-xs font-medium uppercase tracking-wider">
              Discount Type & Value
            </Label>
            <Tabs
              defaultValue="PERCENTAGE"
              className="w-full"
              onValueChange={(v) => {
                setCurrentItem({
                  ...currentItem,
                  discountType: currentItem.discountType,
                  valueType: v as ValueType,
                });
              }}
            >
              <TabsList className="grid w-full gap-4 grid-cols-2 h-11 p-1 mb-6">
                <TabsTrigger
                  value="PERCENTAGE"
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Percentage Off
                </TabsTrigger>
                <TabsTrigger
                  value="FIXED_AMOUNT"
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Fixed Amount Off
                </TabsTrigger>
              </TabsList>

              <TabsContent value="PERCENTAGE" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="discountValue"
                      className="text-xs font-medium uppercase tracking-wider"
                    >
                      Discount (%)
                    </Label>
                    <div className="relative group">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="discountValue"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="10"
                        className="pl-9 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
                        value={
                          (currentItem as SpendGetDiscount).percentageValue ||
                          ""
                        }
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            percentageValue: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    {errors.percentageValue && (
                      <p className="text-xs text-red-500 font-medium ml-1">
                        {errors.percentageValue}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="maximumDiscount"
                      className="text-xs font-medium uppercase tracking-wider"
                    >
                      Max Cap
                    </Label>
                    <div className="relative group">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="maximumDiscount"
                        type="number"
                        min="0"
                        placeholder="e.g., 200"
                        className="pl-9 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
                        value={
                          (currentItem as SpendGetDiscount).maximumDiscount ||
                          ""
                        }
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            maximumDiscount: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="FIXED_AMOUNT" className="mt-0">
                <div className="space-y-2.5 max-w-sm">
                  <Label
                    htmlFor="discountValue"
                    className="text-xs font-medium uppercase tracking-wider"
                  >
                    Discount Amount
                  </Label>
                  <div className="relative group">
                    <p className="absolute left-3 text-sm top-1/4  h-2 w-2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                      NPR
                    </p>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 100"
                      className="pl-12 h-11 bg-muted/5 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
                      value={
                        (currentItem as SpendGetDiscount).discountValue || ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          discountValue: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  {errors.discountValue && (
                    <p className="text-xs text-red-500 font-medium ml-1">
                      {errors.discountValue}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-4 w-4 text-primary" />
              <Label className="text-sm font-semibold text-foreground">
                Additional Reward Items
              </Label>
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </div>
            <div className="pl-1">
              <SelectRewardDialog />
            </div>
          </div>
        </div>
      );

    case "BUNDLE":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="targetType">Discount Value Type</Label>
              <Tabs
                defaultValue="storeproduct"
                className="w-full bg-accent"
                onValueChange={(v) => {
                  setCurrentItem({
                    discountType: currentItem.discountType,
                    targetType: v as TargetType,
                  });
                }}
              >
                <TabsList className="flex w-full justify-start gap-6 border-b border-primary/10  rounded-none p-0">
                  <TabsTrigger
                    value="storeproduct"
                    style={{
                      boxShadow: "none",
                    }}
                    className="relative rounded-none border-none bg-transparent 
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
                 data-[state=active]:after:opacity-100"
                  >
                    Percentage
                  </TabsTrigger>

                  <TabsTrigger
                    value="brand"
                    style={{
                      boxShadow: "none",
                    }}
                    className="relative rounded-none border-none bg-transparent 
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
                 data-[state=active]:after:opacity-100"
                  >
                    Fixed Value
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="storeproduct" className="flex gap-2 mt-4">
                  <div className="flex-1">
                    <Label htmlFor="discountValue">Discount Value (%)</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="e.g., 100 for free"
                      value={
                        (currentItem as BundleDiscount).percentageValue || ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          percentageValue: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    {errors.discountValue && (
                      <p className="text-sm text-red-500">
                        {errors.discountValue}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="maximumDiscount">Maximum Discount</Label>
                    <Input
                      id="maximumDiscount"
                      type="number"
                      min="0"
                      placeholder="e.g., 200"
                      value={
                        (currentItem as BundleDiscount).maximumDiscount || ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          maximumDiscount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent value="brand" className="mt-4">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 100 for free"
                    value={(currentItem as BundleDiscount).discountValue || ""}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        discountValue: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  {errors.discountValue && (
                    <p className="text-sm text-red-500">
                      {errors.discountValue}
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rewardItems">Reward Items (Optional)</Label>
            <div>
              <SelectRewardDialog />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
