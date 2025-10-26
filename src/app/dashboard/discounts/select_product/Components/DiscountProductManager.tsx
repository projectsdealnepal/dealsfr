import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrandItem,
  DiscountedProductType,
  DiscountType,
  RewardProduct,
  TargetType,
} from "@/redux/features/product/types";
import { useAppSelector } from "@/redux/hooks";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { BrandSelector } from "./BrandSelector";
import ProductSelector from "./ProductSelector";
import SelectRewardDialog from "./SelectRewardDialog";

// Types
interface BaseDiscountItem {
  id: string;
  discountType: DiscountType;
  targetType: TargetType;
}

interface PercentageDiscount extends BaseDiscountItem {
  discountType: "PERCENTAGE";
  target: number;
  percentageValue: number;
  maximumDiscount: number;
}

interface FixedAmountDiscount extends BaseDiscountItem {
  discountType: "FIXED_AMOUNT";
  target: number;
  amountValue: number;
}

interface BOGODiscount extends BaseDiscountItem {
  discountType: "BOGO";
  target: number;
  buyQuantity: number;
  percentageValue: number;
  maximumDiscount: number;
  discountValue: number;
  rewardItems?: string;
}

interface SpendGetDiscount extends BaseDiscountItem {
  discountType: "SPEND_GET";
  target: number;
  spendAmount: number;
  percentageValue: number;
  maximumDiscount: number;
  discountValue: number;
  rewardItems?: string;
}

interface BundleDiscount extends BaseDiscountItem {
  discountType: "BUNDLE";
  percentageValue: number;
  maximumDiscount: number;
  discountValue: number;
  rewardItems?: string;
}

type PartialDiscountItem =
  | (Partial<PercentageDiscount> & { discountType: "PERCENTAGE" })
  | (Partial<FixedAmountDiscount> & { discountType: "FIXED_AMOUNT" })
  | (Partial<BOGODiscount> & { discountType: "BOGO" })
  | (Partial<SpendGetDiscount> & { discountType: "SPEND_GET" })
  | (Partial<BundleDiscount> & { discountType: "BUNDLE" });

// Validation schemas
const percentageSchema = z.object({
  percentageValue: z.number().min(0).max(100),
});

const fixedAmountSchema = z.object({
  amountValue: z.number().min(0),
});

const bogoSchema = z.object({
  buyQuantity: z.number().int().min(1),
  discountValue: z.number().min(0).max(100),
  rewardItems: z.string().optional(),
});

const spendGetSchema = z.object({
  spendAmount: z.number().min(0),
  discountValue: z.number().min(0).max(100),
  rewardItems: z.string().optional(),
});

const DiscountManager: React.FC = () => {
  const [currentItem, setCurrentItem] = useState<PartialDiscountItem>({
    discountType: "PERCENTAGE",
    targetType: "storeproduct",
  });
  const { tempDiscountProductList, rewardProductList } =
    useAppSelector((s) => s.product);
  const [selectedTargetType, setSelectedTargetType] =
    useState<TargetType>("storeproduct");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brandValue, setBrandValue] = useState<BrandItem>();

  const discountTypeOptions = [
    { value: "PERCENTAGE", label: "Percentage Off" },
    { value: "FIXED_AMOUNT", label: "Fixed Amount Off" },
    { value: "BOGO", label: "Buy X Get Y" },
    { value: "SPEND_GET", label: "Spend X Get Y Off" },
    { value: "BUNDLE", label: "Buy Combo of Products to Get Discount" },
  ];


  const validateCurrentItem = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentItem.discountType) {
      newErrors.discountType = "Discount type is required";
      setErrors(newErrors);
      return false;
    }

    if (!currentItem.targetType) {
      newErrors.targetType = "Application scope is required";
      setErrors(newErrors);
      return false;
    }

    //check if there are any product selected or not
    if (tempDiscountProductList.length === 0) {
      toast.info("At least one product is required", { richColors: true });
      return false;
    }

    if (
      (currentItem.discountType === "BOGO" ||
        currentItem.discountType === "SPEND_GET") &&
      rewardProductList.length <= 0 &&
      currentItem.discountValue === 0 &&
      currentItem.discountValue === undefined
    ) {
      toast.info("At least one reward product or discount vlaue is required", {
        richColors: true,
      });
      return false;
    }

    try {
      switch (currentItem.discountType) {
        case "PERCENTAGE":
          percentageSchema.parse({
            percentageValue: (currentItem as PercentageDiscount)
              .percentageValue,
          });
          break;
        case "FIXED_AMOUNT":
          fixedAmountSchema.parse({
            amountValue: (currentItem as FixedAmountDiscount).amountValue,
          });
          break;
        case "BOGO":
          bogoSchema.parse({
            buyQuantity: (currentItem as BOGODiscount).buyQuantity,
            discountValue: (currentItem as BOGODiscount).discountValue,
            rewardItems: (currentItem as BOGODiscount).rewardItems,
          });
          break;
        case "SPEND_GET":
          spendGetSchema.parse({
            spendAmount: (currentItem as SpendGetDiscount).spendAmount,
            discountValue: (currentItem as SpendGetDiscount).discountValue,
            rewardItems: (currentItem as SpendGetDiscount).rewardItems,
          });
          break;
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  //funcitons that are used to api post  the proucts on the discount

  const handlePercentageDiscount = () => {
    if (currentItem.discountType == "PERCENTAGE") {
      const payload: DiscountedProductType[] = tempDiscountProductList.map(
        (item, index) => ({
          discount_type: currentItem.discountType,
          target_type: currentItem.targetType ?? "storeproduct",
          value: currentItem.percentageValue?.toString(),
          target_id: item.id,
        })
      );

      console.log({ payload });
    }
  };

  const handleFixedDiscount = () => {
    if (currentItem.discountType == "FIXED_AMOUNT") {
      const payload: DiscountedProductType[] = tempDiscountProductList.map(
        (item, _) => ({
          discount_type: currentItem.discountType,
          target_type: currentItem.targetType ?? "storeproduct",
          value: currentItem.amountValue?.toString(),
          target_id: item.id,
        })
      );

      console.log({ payload });
    }
  };

  const handleBOGODiscount = () => {
    if (currentItem.discountType == "BOGO") {
      const rewardProducts: RewardProduct[] = rewardProductList.map((item) => ({
        store_product_id: item.id,
        get_quantity: item.quantity,
      }));

      const payload: DiscountedProductType[] = tempDiscountProductList.map(
        (item, _) => ({
          discount_type: currentItem.discountType,
          target_type: currentItem.targetType ?? "storeproduct",
          target_id: item.id,
          buy_quantity: currentItem.buyQuantity,
          reward_products: rewardProducts,
          value: currentItem.discountValue?.toString(),
        })
      );

      console.log({ payload });
    }
  };

  const handleSpendGetDiscount = () => {
    if (currentItem.discountType == "SPEND_GET") {
      const rewardProducts: RewardProduct[] = rewardProductList.map((item) => ({
        store_product_id: item.id,
        get_quantity: item.quantity,
      }));

      const payload: DiscountedProductType[] = tempDiscountProductList.map(
        (item, _) => ({
          discount_type: currentItem.discountType,
          target_type: currentItem.targetType ?? "storeproduct",
          target_id: item.id,
          min_spend_amount: currentItem.spendAmount?.toString(),
          reward_products: rewardProducts,
          value: currentItem.discountValue?.toString(),
        })
      );

      console.log({ payload });
    }
  };

  const addDiscountItem = () => {
    if (validateCurrentItem()) {
      console.log("addDiscountItemClicked");
      console.log({ currentItem });
      switch (currentItem.discountType) {
        case "PERCENTAGE":
          handlePercentageDiscount();
          break;
        case "FIXED_AMOUNT":
          console.log("fix anount");
          handleFixedDiscount();
          break;
        case "BOGO":
          console.log("BOGO");
          handleBOGODiscount();
          break;

        case "SPEND_GET":
          console.log("SPEND_GET");
          handleSpendGetDiscount();
          break;
        default:
          console.log("default");
          break;
      }

      setErrors({});
    }
  };

  const handleDiscountTypeChange = (value: DiscountType) => {
    setCurrentItem({
      discountType: value,
      targetType: currentItem.targetType || "storeproduct",
    });
    setErrors({});
  };

  const renderDiscountFields = () => {
    console.log("currentItem", currentItem)
    switch (currentItem.discountType) {
      case "PERCENTAGE":
        return (
          <div className="flex w-full justify-between gap-2">
            <div className="space-y-2 flex-1" >
              <Label htmlFor="percentageValue">Percentage Value (%)</Label>
              <Input
                id="percentageValue"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 9"
                value={(currentItem as PercentageDiscount).percentageValue || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    percentageValue: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {errors.percentageValue && (
                <p className="text-sm text-red-500">{errors.percentageValue}</p>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <Label htmlFor="maximumDiscount">Maximum Discount</Label>
              <Input
                id="maximumDiscount"
                type="number"
                min="0"
                placeholder="e.g., 200"
                value={(currentItem as PercentageDiscount).maximumDiscount || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    maximumDiscount: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {/* {errors.maximumDiscount && ( */}
              {/*   <p className="text-sm text-red-500">{errors.maximumDiscount}</p> */}
              {/* )} */}
            </div>
          </div>
        );

      case "FIXED_AMOUNT":
        return (
          <div className="space-y-2">
            <Label htmlFor="amountValue">Discount Amount</Label>
            <Input
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
            {errors.amountValue && (
              <p className="text-sm text-red-500">{errors.amountValue}</p>
            )}
          </div>
        );

      case "BOGO":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="targetType">Discount Value Type</Label>
                <Tabs
                  defaultValue="storeproduct"
                  className="w-full bg-accent"
                  onValueChange={(v) => {
                    setSelectedTargetType(v as TargetType)
                    setCurrentItem({
                      discountType: currentItem.discountType,
                      targetType: v as TargetType,
                    });
                  }}
                >
                  <TabsList className="flex w-full justify-start gap-6 border-b border-primary/10  rounded-none p-0">
                    <TabsTrigger
                      value="percentage"
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
                      value="fixed"
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

                  <TabsContent value="percentage" className="flex gap-2 mt-4">
                    <div className="flex-1">
                      <Label htmlFor="discountValue">Discount Value (%)</Label>
                      <Input
                        id="discountValue"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="e.g., 100 for free"
                        value={(currentItem as BOGODiscount).percentageValue || ""}
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            percentageValue: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                      {errors.discountValue && (
                        <p className="text-sm text-red-500">{errors.discountValue}</p>
                      )}
                    </div>

                    <div className="flex-1">
                      <Label htmlFor="maximumDiscount">Maximum Discount</Label>
                      <Input
                        id="maximumDiscount"
                        type="number"
                        min="0"
                        placeholder="e.g., 200"
                        value={(currentItem as BOGODiscount).maximumDiscount || ""}
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            maximumDiscount: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="fixed" className="mt-4">
                    <Label htmlFor="discountValue">Discount Value</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g., 100 for free"
                      value={(currentItem as BOGODiscount).discountValue || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          discountValue: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    {errors.discountValue && (
                      <p className="text-sm text-red-500">{errors.discountValue}</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div >
            </div >
            <div className="space-y-2">
              <Label htmlFor="rewardItems">Reward Items (Optional)</Label>
              <div>
                <SelectRewardDialog />
              </div>
            </div>
          </div >
        );

      case "SPEND_GET":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spendAmount">Minimum Spend Amount</Label>
                <Input
                  id="spendAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 100"
                  value={(currentItem as SpendGetDiscount).spendAmount || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      spendAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                {errors.spendAmount && (
                  <p className="text-sm text-red-500">{errors.spendAmount}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetType">Discount Value Type</Label>
                <Tabs
                  defaultValue="storeproduct"
                  className="w-full bg-accent"
                  onValueChange={(v) => {
                    setSelectedTargetType(v as TargetType)
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
                        value={(currentItem as SpendGetDiscount).percentageValue || ""}
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            percentageValue: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                      {errors.discountValue && (
                        <p className="text-sm text-red-500">{errors.discountValue}</p>
                      )}
                    </div>

                    <div className="flex-1">
                      <Label htmlFor="maximumDiscount">Maximum Discount</Label>
                      <Input
                        id="maximumDiscount"
                        type="number"
                        min="0"
                        placeholder="e.g., 200"
                        value={(currentItem as SpendGetDiscount).maximumDiscount || ""}
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
                    <Label htmlFor="discountValue">Discount Value (%)</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="e.g., 100 for free"
                      value={(currentItem as SpendGetDiscount).discountValue || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          discountValue: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    {errors.discountValue && (
                      <p className="text-sm text-red-500">{errors.discountValue}</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div >
            </div>
            <div className="space-y-2">
              <Label htmlFor="rewardItems">Reward Items (Optional)</Label>{" "}
              <div>
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
                    setSelectedTargetType(v as TargetType)
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
                        value={(currentItem as BundleDiscount).percentageValue || ""}
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            percentageValue: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                      {errors.discountValue && (
                        <p className="text-sm text-red-500">{errors.discountValue}</p>
                      )}
                    </div>

                    <div className="flex-1">
                      <Label htmlFor="maximumDiscount">Maximum Discount</Label>
                      <Input
                        id="maximumDiscount"
                        type="number"
                        min="0"
                        placeholder="e.g., 200"
                        value={(currentItem as BundleDiscount).maximumDiscount || ""}
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
                      <p className="text-sm text-red-500">{errors.discountValue}</p>
                    )}
                  </TabsContent>
                </Tabs>

              </div >
            </div >
            <div className="space-y-2">
              <Label htmlFor="rewardItems">Reward Items (Optional)</Label>
              <div>
                <SelectRewardDialog />
              </div>
            </div>
          </div >
        )

      default:
        return null;
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Add Discount Item</CardTitle>
            <CardDescription>
              Configure discount rules for products or brands
            </CardDescription>
          </div>
          <div>
            <Button className="border" variant="ghost">
              Product list
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/*Choose the discount type, based on this different fields will show up*/}
          <div className="space-y-2">
            <Label htmlFor="discountType">Discount Type</Label>
            <Select
              value={currentItem.discountType}
              onValueChange={(value) =>
                handleDiscountTypeChange(value as DiscountType)
              }
            >
              <SelectTrigger id="discountType" className="w-full">
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                {discountTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.discountType && (
              <p className="text-sm text-red-500">{errors.discountType}</p>
            )}
          </div>
          {/*Select targets type (products/brands)*/}
          <div className="space-y-2">
            <Label htmlFor="targetType">Discount On</Label>
            <Tabs
              defaultValue="storeproduct"
              className="w-full bg-accent"
              onValueChange={(v) => {
                setSelectedTargetType(v as TargetType)
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
                  Product
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
                  brand
                </TabsTrigger>
              </TabsList>

              <TabsContent value="storeproduct" className="mt-4">
                <ProductSelector />
              </TabsContent>
              <TabsContent value="brand" className="mt-4">
                <BrandSelector value={brandValue} onSelect={setBrandValue} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {renderDiscountFields()}

        <Button onClick={addDiscountItem} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add to list
        </Button>
      </CardContent>
    </Card>
  );
};

export default DiscountManager;
