"use client";
import ProductSelector from "@/app/dashboard/discounts/select_product/Components/ProductSelector";
import {
  BOGODiscount,
  FixedAmountDiscount,
  PartialDiscountItem,
  PercentageDiscount,
  SpendGetDiscount,
} from "@/app/dashboard/discounts/select_product/Components/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductOnDiscount } from "@/redux/features/discount/discount";
import { AddProductOnDiscountPayload } from "@/redux/features/discount/types";
import {
  clearRewardProductList,
  clearTempProductList,
  setDiscountAppliedProductList,
} from "@/redux/features/product/productSlice";
import {
  BrandItem,
  DiscountType,
  RewardProduct,
  TargetType,
  ValueType,
} from "@/redux/features/product/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { BrandSelector } from "../BrandSelector";
import { DiscountFieldRender } from "./DiscountFieldRender";

// Validation schemas
const percentageSchema = z.object({
  percentageValue: z.number().min(0).max(100),
  maximumDiscount: z.number().min(0).optional(),
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

interface DiscountFieldsSheetProps {
  discountType: DiscountType;
  targetType: TargetType;
  open: boolean;
  onClose: () => void;
}

const DiscountFieldsSheet = ({
  discountType,
  targetType,
  open,
  onClose,
}: DiscountFieldsSheetProps) => {
  const [currentItem, setCurrentItem] = useState<PartialDiscountItem>({
    discountType: discountType,
    targetType: targetType,
    valueType: "PERCENTAGE",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brandValue, setBrandValue] = useState<BrandItem>();

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { storeDetailData } = useAppSelector((s) => s.store);
  const {
    tempDiscountProductList,
    rewardProductList,
    offerAppliedProductsList,
  } = useAppSelector((s) => s.product);

  useEffect(() => {
    setCurrentItem((prev) => ({
      ...prev,
      discountType,
      targetType,
    }));
  }, [discountType, targetType]);

  const handleAddProducts = (p: AddProductOnDiscountPayload[]) => {
    if (id && storeDetailData) {
      const payload = {
        d_id: Number(id),
        s_id: storeDetailData.id,
        payload: p,
      };

      dispatch(addProductOnDiscount(payload));
      onClose();
    }
  };

  const validateCurrentItem = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentItem.discountType) {
      newErrors.discountType = "Discount type is required";
      setErrors(newErrors);
      toast.info("Discount type is required", { richColors: true });
      return false;
    }

    if (!currentItem.targetType) {
      newErrors.targetType = "Application scope is required";
      setErrors(newErrors);
      toast.info("Application scope is required", { richColors: true });
      return false;
    }

    if (
      currentItem.discountType === "BOGO" ||
      currentItem.discountType === "SPEND_GET"
    ) {
      if (
        currentItem.percentageValue == null &&
        currentItem.discountValue == null &&
        currentItem.rewardItems?.length == 0
      ) {
        toast.info("At least the bonus value or discount value is required", {
          richColors: true,
        });
        return false;
      }
      if (
        currentItem.percentageValue != null &&
        currentItem.maximumDiscount == null
      ) {
        toast.info(
          "You have to mention maximum discount limit on percentage value.",
          { richColors: true }
        );
        return false;
      }
    }

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

    if (
      currentItem.targetType == "storeproduct" &&
      tempDiscountProductList.length === 0
    ) {
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

  const handlePercentageDiscount = () => {
    let payload: AddProductOnDiscountPayload[] = [];
    if (currentItem.discountType == "PERCENTAGE") {
      switch (currentItem.targetType) {
        case "storeproduct":
          payload = tempDiscountProductList.map((item) => ({
            discount_type: currentItem.discountType,
            value: currentItem.percentageValue,
            value_type: "PERCENTAGE",
            max_discount_amount: currentItem.maximumDiscount?.toString(),
            store_product: item.id,
          }));
          break;
        case "brand":
          payload = [
            {
              discount_type: currentItem.discountType,
              value: currentItem.percentageValue,
              value_type: "PERCENTAGE",
              max_discount_amount: currentItem.maximumDiscount?.toString(),
              brand: brandValue?.id,
            },
          ];
          break;
        default:
          break;
      }
      console.log({ payload });
      dispatch(setDiscountAppliedProductList(payload));
      handleAddProducts(payload);
    }
  };

  const handleFixedDiscount = () => {
    let payload: AddProductOnDiscountPayload[] = [];
    if (currentItem.discountType == "FIXED_AMOUNT") {
      switch (currentItem.targetType) {
        case "storeproduct":
          payload = tempDiscountProductList.map((item) => ({
            discount_type: currentItem.discountType,
            value: currentItem.amountValue,
            value_type: "FIXED_AMOUNT",
            [currentItem.targetType === "storeproduct"
              ? "store_product"
              : "brand"]:
              currentItem.targetType === "storeproduct"
                ? item.id
                : brandValue?.id,
          }));
          break;

        case "brand":
          payload = [
            {
              discount_type: currentItem.discountType,
              value: currentItem.amountValue,
              value_type: "FIXED_AMOUNT",
              brand: brandValue?.id,
            },
          ];
          break;
        default:
          break;
      }
      console.log({ payload });
      dispatch(setDiscountAppliedProductList(payload));
      handleAddProducts(payload);
    }
  };

  const handleBOGODiscount = () => {
    if (currentItem.discountType == "BOGO") {
      const rewardProducts: RewardProduct[] = rewardProductList.map((item) => ({
        store_product_id: item.id,
        get_quantity: item.quantity,
      }));

      let payload: AddProductOnDiscountPayload[] = [];
      switch (currentItem.targetType) {
        case "storeproduct":
          payload = tempDiscountProductList.map((item) => ({
            discount_type: currentItem.discountType as "PERCENTAGE",
            value_type: currentItem.valueType as ValueType,
            buy_quantity: currentItem.buyQuantity,
            reward_products: rewardProducts,
            value:
              currentItem.valueType == "PERCENTAGE"
                ? currentItem.percentageValue
                : currentItem.discountValue,
            store_product: item?.id,
            ...(currentItem.valueType === "PERCENTAGE" && {
              max_discount_amount: currentItem.maximumDiscount?.toString(),
            }),
          }));
          break;
        case "brand":
          payload = [
            {
              discount_type: currentItem.discountType as "PERCENTAGE",
              value_type: currentItem.valueType as ValueType,
              buy_quantity: currentItem.buyQuantity,
              reward_products: rewardProducts,
              value:
                currentItem.valueType == "PERCENTAGE"
                  ? currentItem.percentageValue
                  : currentItem.discountValue,
              brand: brandValue?.id,
              ...(currentItem.valueType === "PERCENTAGE" && {
                max_discount_amount: currentItem.maximumDiscount?.toString(),
              }),
            },
          ];
          break;
        default:
          break;
      }

      console.log({ payload });
      dispatch(setDiscountAppliedProductList(payload));
      handleAddProducts(payload);
    }
  };

  const handleSpendGetDiscount = () => {
    if (currentItem.discountType == "SPEND_GET") {
      const rewardProducts: RewardProduct[] = rewardProductList.map((item) => ({
        store_product_id: item.id,
        get_quantity: item.quantity,
      }));

      let payload: AddProductOnDiscountPayload[] = [];
      switch (currentItem.targetType) {
        case "storeproduct":
          payload = tempDiscountProductList.map((item) => ({
            discount_type: "SPEND_GET",
            value_type: currentItem.valueType as "PERCENTAGE",
            max_discount_amount: currentItem.maximumDiscount?.toString(),
            store_product: item.id,
            min_spend_amount: currentItem.spendAmount?.toString(),
            reward_products: rewardProducts,
            value:
              currentItem.valueType == "PERCENTAGE"
                ? currentItem.percentageValue
                : currentItem.discountValue,

            ...(currentItem.valueType === "PERCENTAGE" && {
              max_discount_amount: currentItem.maximumDiscount?.toString(),
            }),
          }));
          break;
        case "brand":
          payload = [
            {
              discount_type: "SPEND_GET",
              value_type: currentItem.valueType as "PERCENTAGE",
              brand: brandValue?.id,
              min_spend_amount: currentItem.spendAmount?.toString(),
              reward_products: rewardProducts,
              value:
                currentItem.valueType == "PERCENTAGE"
                  ? currentItem.percentageValue
                  : currentItem.discountValue,

              ...(currentItem.valueType === "PERCENTAGE" && {
                max_discount_amount: currentItem.maximumDiscount?.toString(),
              }),
            },
          ];
          break;
        default:
          break;
      }

      console.log({ payload });
      dispatch(setDiscountAppliedProductList(payload));
      handleAddProducts(payload);
    }
  };

  const addDiscountItem = () => {
    if (validateCurrentItem()) {
      switch (currentItem.discountType) {
        case "PERCENTAGE":
          handlePercentageDiscount();
          break;
        case "FIXED_AMOUNT":
          handleFixedDiscount();
          break;
        case "BOGO":
          handleBOGODiscount();
          break;
        case "SPEND_GET":
          handleSpendGetDiscount();
          break;
        default:
          break;
      }
      setErrors({});
      dispatch(clearTempProductList());
      dispatch(clearRewardProductList());

      setCurrentItem({
        discountType: discountType,
        valueType: "PERCENTAGE",
        targetType: targetType,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[100%] gap-0 p-0 sm:max-w-2xl flex flex-col h-full">
        <SheetHeader className="px-6 py-3 border-b">
          <SheetTitle>Add Discount</SheetTitle>
          <SheetDescription>
            Configure discount rules for{" "}
            {targetType === "brand"
              ? "Brand"
              : targetType === "storeproduct"
              ? "Product"
              : targetType === "category"
              ? "Category"
              : "All Products"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6 flex-1 overflow-y-auto">
          {/* Selector Type (Product or Brand) */}
          <div className="space-y-2">
            <Label className="font-semibold text-base text-foreground/70">
              {targetType === "brand"
                ? "Select Brand"
                : targetType === "storeproduct"
                ? "Select Product"
                : targetType === "category"
                ? "Select Category"
                : "Discount will applied on all products"}
            </Label>
            {targetType === "storeproduct" ? (
              <ProductSelector />
            ) : targetType === "brand" ? (
              <BrandSelector value={brandValue} onSelect={setBrandValue} />
            ) : null}
          </div>

          {/* Discount Fields */}
          <DiscountFieldRender
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
            errors={errors}
          />
        </div>
        <SheetFooter className="w-full p-6 py-3 border-t mt-auto">
          <Button onClick={addDiscountItem} className="w-full py-5">
            <Plus className="mr-2 h-4 w-4" />
            Add to discount
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default DiscountFieldsSheet;
