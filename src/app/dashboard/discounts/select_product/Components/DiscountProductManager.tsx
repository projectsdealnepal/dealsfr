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
  DiscountType,
  RewardProduct,
  TargetType,
  ValueType,
} from "@/redux/features/product/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { BrandSelector } from "./BrandSelector";
import ProductSelector from "./ProductSelector";
import SelectRewardDialog from "./SelectRewardDialog";
import { AddProductOnDiscountPayload } from "@/redux/features/discount/types";
import { addProductOnDiscount } from "@/redux/features/discount/discount";
import { useSearchParams } from "next/navigation";

// Types
interface BaseDiscountItem {
  id: string;
  discountType: DiscountType;
  targetType: TargetType;
  valueType: ValueType;
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
  valueType: ValueType,
  target: number;
  buyQuantity: number;
  percentageValue: number;
  maximumDiscount: number;
  discountValue: number;
  rewardItems?: string;
}

interface SpendGetDiscount extends BaseDiscountItem {
  discountType: "SPEND_GET";
  valueType: ValueType,
  target: number;
  spendAmount: number;
  percentageValue: number;
  maximumDiscount: number;
  discountValue: number;
  rewardItems?: string;
}

interface BundleDiscount extends BaseDiscountItem {
  discountType: "BUNDLE";
  valueType: ValueType,
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
  percentageValue: z.number().min(0).max(100).optional(),
  maximumDiscount: z.number().min(0).optional(),
  discountValue: z.number().min(0).optional(),
  rewardItems: z.string().optional(),
});

const spendGetSchema = z.object({
  spendAmount: z.number().min(1),
  percentageValue: z.number().min(0).max(100).optional(),
  maximumDiscount: z.number().min(0).optional(),
  discountValue: z.number().min(0).optional(),
  rewardItems: z.string().optional(),
});

const DiscountManager = () => {
  const [currentItem, setCurrentItem] = useState<PartialDiscountItem>({
    discountType: "PERCENTAGE",
    valueType: "PERCENTAGE",
    targetType: "storeproduct",
  });
  const [selectedTargetType, setSelectedTargetType] =
    useState<TargetType>("storeproduct");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brandValue, setBrandValue] = useState<BrandItem>();

  const param = useSearchParams()
  const id = parseInt(param.get("id") ?? "0", 10)
  const dispatch = useAppDispatch()
  const { storeDetailData } = useAppSelector((s) => s.store);
  const { tempDiscountProductList, rewardProductList } = useAppSelector((s) => s.product);

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
      toast.info("Discount type is required", {
        richColors: true,
      });
      return false;
    }

    if (!currentItem.targetType) {
      newErrors.targetType = "Discount value type is required";
      setErrors(newErrors);
      toast.info("Discount value type is required", {
        richColors: true,
      });

      return false;
    }

    if (!currentItem.targetType) {
      newErrors.targetType = "Application scope is required";
      setErrors(newErrors);
      toast.info("Application scope is required", {
        richColors: true,
      });
      return false;
    }
    //TODO: need to modify validation schema
    // Rule 1: Either percentageValue or discountValue must be present
    if (currentItem.discountType === "BOGO" || currentItem.discountType === "SPEND_GET") {
      if (currentItem.percentageValue == null && currentItem.discountValue == null) {
        toast.info("at least the bonus value or disocunt value is requied", {
          richColors: true,
        });
        return false;
      }
      // Rule 2: If percentageValue is present, maximumDiscount must also be present
      if (currentItem.percentageValue != null && currentItem.maximumDiscount == null) {
        toast.info("at least the bonus value or disocunt value is requied1", {
          richColors: true,
        });
        return false;
      }
    }

    //if the discount type is BOGO or SPEND_GET then either disocunt value or reward
    //product is mendatery
    if (
      (currentItem.discountType === "BOGO" ||
        currentItem.discountType === "SPEND_GET") &&
      rewardProductList.length <= 0 &&
      currentItem.discountValue === 0 &&
      currentItem.percentageValue === 0 &&
      currentItem.discountValue === undefined
    ) {
      toast.info("At least one reward product or discount value is required", {
        richColors: true,
      });
      return false;
    }

    //check if there are any product selected or not
    if (currentItem.targetType == "storeproduct" && tempDiscountProductList.length === 0) {
      toast.info("At least one product is required", { richColors: true });
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
    let payload: AddProductOnDiscountPayload[] = []
    if (currentItem.discountType == "PERCENTAGE") {
      //for currentItem.tartet type is "storeProduct"
      switch (currentItem.targetType) {
        case "storeproduct":
          payload = tempDiscountProductList.map(
            (item) => ({
              discount_type: currentItem.discountType,
              value: currentItem.percentageValue,
              value_type: "PERCENTAGE",
              max_discount_amount: currentItem.maximumDiscount?.toString(),
              store_product: item.id,
            })
          );
          break;
        case "brand":
          //for currentItem.tartet type is "brand"
          payload = [{
            discount_type: currentItem.discountType,
            value: currentItem.percentageValue,
            value_type: "PERCENTAGE",
            max_discount_amount: currentItem.maximumDiscount?.toString(),
            brand: brandValue?.id,
          }]
          break;
        default:
          break;
      }
      const dispatchData = {
        payload,
        d_id: id,
        s_id: storeDetailData?.id ?? 0
      }
      // dispatch(addProductOnDiscount(dispatchData))
      console.log({ payload });
    }
  };

  const handleFixedDiscount = () => {
    let payload: AddProductOnDiscountPayload[] = []
    if (currentItem.discountType == "FIXED_AMOUNT") {

      switch (currentItem.targetType) {
        case "storeproduct":
          payload = tempDiscountProductList.map(
            (item, _) => ({
              discount_type: currentItem.discountType,
              value: currentItem.amountValue,
              value_type: "FIXED_AMOUNT",

              // conditional key assignment
              [currentItem.targetType === "storeproduct" ? "store_product" : "brand"]:
                currentItem.targetType === "storeproduct" ? item.id : brandValue?.id,
            })
          );
          break;

        case "brand":
          //for currentItem.tartet type is "brand"
          payload = [{
            discount_type: currentItem.discountType,
            value: currentItem.amountValue,
            value_type: "FIXED_AMOUNT",
            brand: brandValue?.id,
          }]
          break;
        default:
          break;
      }

      const dispatchData = {
        payload,
        d_id: id,
        s_id: storeDetailData?.id ?? 0
      }
      // dispatch(addProductOnDiscount(dispatchData))
      console.log({ payload });
    }
  };

  const handleBOGODiscount = () => {
    if (currentItem.discountType == "BOGO") {
      const rewardProducts: RewardProduct[] = rewardProductList.map((item) => ({
        store_product_id: item.id,
        get_quantity: item.quantity,
      }));

      let payload: AddProductOnDiscountPayload[] = []
      switch (currentItem.targetType) {
        case "storeproduct":
          payload = tempDiscountProductList.map(
            (item, _) => ({
              discount_type: currentItem.discountType as "PERCENTAGE",
              value_type: currentItem.valueType as ValueType,
              buy_quantity: currentItem.buyQuantity,
              reward_products: rewardProducts,
              value: currentItem.valueType == "PERCENTAGE" ? currentItem.percentageValue : currentItem.discountValue,
              store_product: item?.id,
              //pass the max disocunt amount only on percentage
              ...(currentItem.valueType === "PERCENTAGE" && {
                max_discount_amount: currentItem.maximumDiscount?.toString(),
              }),
            })
          );
          break;
        case "brand":
          payload = [{
            discount_type: currentItem.discountType as "PERCENTAGE",
            value_type: currentItem.valueType as ValueType,
            buy_quantity: currentItem.buyQuantity,
            reward_products: rewardProducts,
            value: currentItem.valueType == "PERCENTAGE" ? currentItem.percentageValue : currentItem.discountValue,
            brand: brandValue?.id,
            //pass the max disocunt amount only on percentage
            ...(currentItem.valueType === "PERCENTAGE" && {
              max_discount_amount: currentItem.maximumDiscount?.toString(),
            }),
          }]
          break;
        default:
          break;
      }

      console.log({ payload });
    }
  };

  const handleSpendGetDiscount = () => {
    if (currentItem.discountType == "SPEND_GET") {
      const rewardProducts: RewardProduct[] = rewardProductList.map((item) => ({
        store_product_id: item.id,
        get_quantity: item.quantity,
      }));

      let payload: AddProductOnDiscountPayload[] = []
      switch (currentItem.targetType) {
        case "storeproduct":
          payload = tempDiscountProductList.map(
            (item, _) => ({
              discount_type: "SPEND_GET",
              value_type: currentItem.valueType as "PERCENTAGE",
              max_discount_amount: currentItem.maximumDiscount?.toString(),
              store_product: item.id,
              reward_products: rewardProducts,
              value: currentItem.valueType == "PERCENTAGE" ? currentItem.percentageValue : currentItem.discountValue,

              //pass the max disocunt amount only on percentage
              ...(currentItem.valueType === "PERCENTAGE" && {
                max_discount_amount: currentItem.maximumDiscount?.toString(),
              }),
            })
          );
          break;
        case "brand":
          payload = [{
            discount_type: "SPEND_GET",
            value_type: currentItem.valueType as "PERCENTAGE",
            brand: brandValue?.id,
            min_spend_amount: currentItem.spendAmount?.toString(),
            reward_products: rewardProducts,
            value: currentItem.valueType == "PERCENTAGE" ? currentItem.percentageValue : currentItem.discountValue,

            //pass the max disocunt amount only on percentage
            ...(currentItem.valueType === "PERCENTAGE" && {
              max_discount_amount: currentItem.maximumDiscount?.toString(),
            }),
          }]
          break;
        default:
          break;
      }

      console.log({ payload });
    }
  };

  const addDiscountItem = () => {
    if (validateCurrentItem()) {
      console.log("addDiscountItemClicked");
      switch (currentItem.discountType) {
        case "PERCENTAGE":
          handlePercentageDiscount();
          break;
        case "FIXED_AMOUNT":
          console.log("fix anount");
          handleFixedDiscount();
          break;
        case "BOGO":
          console.log("aaaaaaaaaaaaaaaaaaaBOGO");
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
      ...currentItem,
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <Label htmlFor="buyQuantity">Buy Quantity</Label>
                <Input
                  id="buyQuantity"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 2"
                  value={(currentItem as BOGODiscount).buyQuantity || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      buyQuantity: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                {errors.buyQuantity && (
                  <p className="text-sm text-red-500">{errors.buyQuantity}</p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="targetType">Discount Value Type</Label>
                <Tabs
                  defaultValue="PERCENTAGE"
                  className="w-full bg-accent"
                  onValueChange={(v) => {
                    setSelectedTargetType(v as TargetType)
                    setCurrentItem({
                      ...currentItem,
                      discountType: currentItem.discountType,
                      valueType: v as ValueType,
                    });
                  }}
                >
                  <TabsList className="flex w-full justify-start gap-6 border-b border-primary/10  rounded-none p-0">
                    <TabsTrigger
                      value="PERCENTAGE"
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
                      value="FIXED_AMOUNT"
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

                  <TabsContent value="PERCENTAGE" className="flex gap-2 mt-4">
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
                      {errors.percentageValue && (
                        <p className="text-sm text-red-500">{errors.percentageValue}</p>
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
                  <TabsContent value="FIXED_AMOUNT" className="mt-4">
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
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
              <div className="space-y-2 col-span-2">
                <Label htmlFor="targetType">Discount Value Type</Label>
                <Tabs
                  defaultValue="PERCENTAGE"
                  className="w-full bg-accent"
                  onValueChange={(v) => {
                    setSelectedTargetType(v as TargetType)
                    setCurrentItem({
                      ...currentItem,
                      valueType: v as ValueType,
                      discountType: currentItem.discountType,
                    });
                  }}
                >
                  <TabsList className="flex w-full justify-start gap-6 border-b border-primary/10  rounded-none p-0">
                    <TabsTrigger
                      value="PERCENTAGE"
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
                      value="FIXED_AMOUNT"
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

                  <TabsContent value="PERCENTAGE" className="flex gap-2 mt-4">
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
                      {errors.percentageValue && (
                        <p className="text-sm text-red-500">{errors.percentageValue}</p>
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
                  <TabsContent value="FIXED_AMOUNT" className="mt-4">
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
                  ...currentItem,
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
