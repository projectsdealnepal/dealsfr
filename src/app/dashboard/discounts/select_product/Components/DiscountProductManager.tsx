import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { AddProductOnDiscountPayload } from "@/redux/features/discount/types";
import { useSearchParams } from "next/navigation";
import { BOGODiscount, FixedAmountDiscount, PartialDiscountItem, PercentageDiscount, SpendGetDiscount } from "./types";
import { RenderDiscountFields } from "./RenderFieldComponent";
import DiscountAppliedProductListDialog from "./DiscountAppliedProductListDialog";
import { clearRewardProductList, clearTempProductList, setDiscountAppliedProductList } from "@/redux/features/product/productSlice";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brandValue, setBrandValue] = useState<BrandItem>();
  //discount applied product dialog
  const [daplDialog, setDaplDialog] = useState<boolean>(false)

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
      console.log({ payload });
      dispatch(setDiscountAppliedProductList(payload))
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
      dispatch(setDiscountAppliedProductList(payload))
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
      dispatch(setDiscountAppliedProductList(payload))
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
              min_spend_amount: currentItem.spendAmount?.toString(),
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
      dispatch(setDiscountAppliedProductList(payload))
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
      dispatch(clearTempProductList())
      dispatch(clearRewardProductList())
      setCurrentItem({
        discountType: "PERCENTAGE",
        valueType: "PERCENTAGE",
        targetType: "storeproduct",
      });
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
            <DiscountAppliedProductListDialog
              open={daplDialog}
              onOpenChange={() => setDaplDialog((prev) => !prev)}
            />
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
                // setSelectedTargetType(v as TargetType)
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

        <RenderDiscountFields
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          errors={errors}
        />

        <Button onClick={addDiscountItem} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add to list
        </Button>
      </CardContent>
    </Card>
  );
};

export default DiscountManager;
