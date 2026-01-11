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
import { CategoryItem } from "@/redux/features/category/types";
import { addProductOnDiscount } from "@/redux/features/discount/discount";
import { clearAddProductOnDiscountState } from "@/redux/features/discount/discountSlice";
import {
  AddProductOnDiscountPayload,
  OfferAppliedProduct,
} from "@/redux/features/discount/types";
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
import { ChevronRight, Loader2, Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { BrandSelector } from "../BrandSelector";
import { CategorySelectorSheet } from "../CategoriesSheet";
import { MultipleCategorySelector } from "../MultipleCategorySelector";
import { DiscountFieldRender } from "./DiscountFieldRender";

// Validation schemas
const percentageSchema = z.object({
  percentageValue: z.number().min(0).max(100),
  maximumDiscount: z.number().min(0).optional(),
});

const fixedAmountSchema = z.object({
  amountValue: z.number().min(0),
});

const getBogoSchema = (hasRewards: boolean) =>
  z
    .object({
      buyQuantity: z.number().int().min(1, "Buy quantity is required"),
      percentageValue: z.number().min(0).max(100).optional(),
      maximumDiscount: z.number().min(0).optional(),
      discountValue: z.number().min(0).optional(),
      rewardItems: z.string().optional(),
    })
    .refine(
      (data) => {
        const hasDiscount = data.discountValue !== undefined;
        const hasPercentage =
          data.percentageValue !== undefined &&
          data.maximumDiscount !== undefined;

        return hasDiscount || hasPercentage || hasRewards;
      },
      {
        message:
          "Either discount value, (percentage value and maximum value together) or rewards products should not be empty on Buy-Get discount",
      }
    );

const getSpendGetSchema = (hasRewards: boolean) =>
  z
    .object({
      spendAmount: z.number().min(1, "Spend amount is required"),
      percentageValue: z.number().min(0).max(100).optional(),
      maximumDiscount: z.number().min(0).optional(),
      discountValue: z.number().min(0).optional(),
      rewardItems: z.any().optional(),
    })
    .refine(
      (data) => {
        const hasDiscount = data.discountValue !== undefined;
        const hasPercentage =
          data.percentageValue !== undefined &&
          data.maximumDiscount !== undefined;

        return hasDiscount || hasPercentage || hasRewards;
      },
      {
        message:
          "Either discount value, (percentage value and maximum value together) or rewards products should not be empty on Spend Get discount",
      }
    );

interface DiscountFieldsSheetProps {
  discountedAppliedProduct?: OfferAppliedProduct | null;
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
  const [categoryValue, setCategoryValue] = useState<CategoryItem>();
  const [openCategorySelector, setOpenCategorySelector] = useState(false);

  console.log("Selected caregories:: from DiscountFieldsSheet", categoryValue);

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { storeDetailData } = useAppSelector((s) => s.store);
  const { tempDiscountProductList, rewardProductList } = useAppSelector(
    (s) => s.product
  );

  const { categoryData, storeCategoryData } = useAppSelector((s) => s.category);
  const { addProductOnDiscountData, addProductOnDiscountLoading } =
    useAppSelector((s) => s.discount);

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
      // onClose();
    }
  };

  const validateCurrentItem = (): boolean => {
    const newErrors: Record<string, string> = {};

    //If discount is on product, there should be atleast one prodcut
    if (
      currentItem.targetType == "storeproduct" &&
      tempDiscountProductList.length === 0
    ) {
      toast.info("At least one product is required");
      return false;
    }
    //if discount is on brand, there should be atleast one brand
    if (currentItem.targetType == "brand" && brandValue == null) {
      toast.info("At least one brand is required");
      return false;
    }
    //if discount is on category, there should be atleast one category
    if (currentItem.targetType == "category" && categoryValue == null) {
      toast.info("Please select the category for category target type");
      return false;
    }

    //There  should be discount type selected
    if (!currentItem.discountType) {
      newErrors.discountType = "Discount type is required";
      setErrors(newErrors);
      toast.info("Discount type is required (please select discount type)", {
        richColors: true,
      });
      return false;
    }

    //There  should be target type selected( but if the target is store then on api payload it will be null)
    if (!currentItem.targetType) {
      newErrors.targetType = "Target Type is required";
      setErrors(newErrors);
      toast.info("Target Type is required (please select target type)", {
        richColors: true,
      });
      return false;
    }

    // If the discount is percentage then there should be max cap amount
    if (
      currentItem.discountType === "PERCENTAGE" &&
      currentItem.maximumDiscount == null
    ) {
      toast.info(
        "You have to mention maximum discount limit on percentage value.",
        { richColors: true }
      );
      return false;
    }

    // In every discount of BOGO and SPEND_GET, there should be eithre reward product or discount( discount itself can be two times 1. Flat amount discount 2. Percentage discount with max cap amount)

    //When user select BOGO type
    //Case:1
    // User select the flat amount as discount
    if (
      currentItem.discountType == "BOGO" &&
      currentItem.valueType == "FIXED_AMOUNT"
    ) {
      //there should be discount value present in the currentItem or reward item but not both
      if (!currentItem.discountValue && rewardProductList.length == 0) {
        toast.info("Discount value or reward items are required");
        return false;
      }
      //if there is disocunt and reward items both are present then show error
      if (currentItem.discountValue && rewardProductList.length > 0) {
        toast.info(
          "Reward items are not allowed when discount value is present"
        );
        return false;
      }
    }

    //Case:2
    // User select the percentage value as discount
    if (
      currentItem.discountType == "BOGO" &&
      currentItem.valueType == "PERCENTAGE"
    ) {
      //there should be discount value present in the currentItem or reward item but not both
      if (
        currentItem.percentageValue == undefined &&
        rewardProductList.length == 0
      ) {
        toast.info("Discount value or reward items are required");
        return false;
      }
      //if there is disocunt and reward items both are present then show error
      if (
        currentItem.percentageValue != undefined &&
        rewardProductList.length > 0
      ) {
        toast.info(
          "Reward items are not allowed when discount value is present"
        );
        return false;
      }
    }

    //When user select Spend Get type
    //Case:1
    // User select the flat amount as discount
    if (
      currentItem.discountType == "SPEND_GET" &&
      currentItem.valueType == "FIXED_AMOUNT"
    ) {
      //there shoudl be eithre disocunt value present or reward items but not both
      if (!currentItem.discountValue && rewardProductList.length == 0) {
        toast.info("Discount value or reward items are required");
        return false;
      }
      //if there is disocunt and reward items both are present then show error
      if (
        currentItem.discountValue != undefined &&
        rewardProductList.length > 0
      ) {
        toast.info(
          "Reward items are not allowed when discount value is present"
        );
        return false;
      }
    }

    //Case:2
    // User select the percentage value as discount
    if (
      currentItem.discountType == "SPEND_GET" &&
      currentItem.valueType == "PERCENTAGE"
    ) {
      //there should be eithre percentage value present or reward items but not both
      if (!currentItem.percentageValue && rewardProductList.length == 0) {
        toast.info("Percentage value or reward items are required");
        return false;
      }
      //if there is percentage and reward items both are present then show error
      if (
        currentItem.percentageValue != undefined &&
        rewardProductList.length > 0
      ) {
        toast.info(
          "Reward items are not allowed when percentage value is present"
        );
        return false;
      }
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
          getBogoSchema(rewardProductList.length > 0).parse({
            buyQuantity: (currentItem as BOGODiscount).buyQuantity,
            discountValue: (currentItem as BOGODiscount).discountValue,
            percentageValue: (currentItem as BOGODiscount).percentageValue,
            maximumDiscount: (currentItem as BOGODiscount).maximumDiscount,
            rewardItems: (currentItem as BOGODiscount).rewardItems,
          });
          break;
        case "SPEND_GET":
          getSpendGetSchema(rewardProductList.length > 0).parse({
            spendAmount: (currentItem as SpendGetDiscount).spendAmount,
            discountValue: (currentItem as SpendGetDiscount).discountValue,
            rewardItems: (currentItem as SpendGetDiscount).rewardItems,
            percentageValue: (currentItem as SpendGetDiscount).percentageValue,
            maximumDiscount: (currentItem as SpendGetDiscount).maximumDiscount,
          });
          break;
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
          toast.info(err.message, { richColors: true });
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
        case "category":
          payload = [
            {
              discount_type: currentItem.discountType,
              value: currentItem.percentageValue,
              value_type: "PERCENTAGE",
              max_discount_amount: currentItem.maximumDiscount?.toString(),
              category: categoryValue?.id,
            },
          ];
          break;
        case "store":
          payload = [
            {
              discount_type: currentItem.discountType,
              value: currentItem.percentageValue,
              value_type: "PERCENTAGE",
              max_discount_amount: currentItem.maximumDiscount?.toString(),
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
        case "category":
          payload = [
            {
              discount_type: currentItem.discountType,
              value: currentItem.amountValue,
              value_type: "FIXED_AMOUNT",
              category: categoryValue?.id,
            },
          ];
          break;
        case "store":
          payload = [
            {
              discount_type: currentItem.discountType,
              value: currentItem.amountValue,
              value_type: "FIXED_AMOUNT",
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
    console.log("handleBOGODiscount", currentItem);
    if (currentItem.discountType == "BOGO") {
      const rewardProducts: RewardProduct[] = rewardProductList.map((item) => ({
        store_product_id: item.id,
        get_quantity: item.quantity,
      }));

      let payload: AddProductOnDiscountPayload[] = [];
      switch (currentItem.targetType) {
        case "storeproduct":
          payload = tempDiscountProductList.map((item) => ({
            discount_type: currentItem.discountType,
            //only provide the value type if there is no reward product
            ...(rewardProducts.length == 0 && {
              value_type: currentItem.valueType as ValueType,
            }),
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
              discount_type: currentItem.discountType,
              //only provide the value type if there is no reward product
              ...(rewardProducts.length == 0 && {
                value_type: currentItem.valueType as ValueType,
              }),
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
        case "category":
          payload = [
            {
              discount_type: currentItem.discountType,
              //only provide the value type if there is no reward product
              ...(rewardProducts.length == 0 && {
                value_type: currentItem.valueType as ValueType,
              }),
              buy_quantity: currentItem.buyQuantity,
              reward_products: rewardProducts,
              value:
                currentItem.valueType == "PERCENTAGE"
                  ? currentItem.percentageValue
                  : currentItem.discountValue,
              category: categoryValue?.id,
              ...(currentItem.valueType === "PERCENTAGE" && {
                max_discount_amount: currentItem.maximumDiscount?.toString(),
              }),
            },
          ];
          break;
        case "store":
          payload = [
            {
              discount_type: currentItem.discountType,
              //only provide the value type if there is no reward product
              ...(rewardProducts.length == 0 && {
                value_type: currentItem.valueType as ValueType,
              }),
              buy_quantity: currentItem.buyQuantity,
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
            //only pass the value type when there is no reward products
            ...(rewardProducts.length == 0 && {
              value_type: currentItem.valueType as ValueType,
            }),
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
              //only pass the value type when there is no reward products
              ...(rewardProducts.length == 0 && {
                value_type: currentItem.valueType as ValueType,
              }),
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
        case "category":
          payload = [
            {
              discount_type: "SPEND_GET",
              //only pass the value type when there is no reward products
              ...(rewardProducts.length == 0 && {
                value_type: currentItem.valueType as ValueType,
              }),
              category: categoryValue?.id,
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
        case "store":
          payload = [
            {
              discount_type: "SPEND_GET",
              //only pass the value type when there is no reward products
              ...(rewardProducts.length == 0 && {
                value_type: currentItem.valueType as ValueType,
              }),
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

  //closethe sheet only after the addProductOnDiscount is successfull
  useEffect(() => {
    if (addProductOnDiscountData) {
      onClose();
    }
    return () => {
      dispatch(clearAddProductOnDiscountState());
    };
  }, [addProductOnDiscountData]);

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
            ) : targetType === "category" ? (
              storeCategoryData && (
                <div className="space-y-2">
                  {!categoryValue ? (
                    <Button
                      variant="outline"
                      onClick={() => setOpenCategorySelector(true)}
                      className="w-full justify-between font-normal"
                    >
                      <span className="text-muted-foreground">
                        Select Category
                      </span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground">
                          Selected Category
                        </p>
                        <p className="text-sm font-medium">
                          {categoryValue.name}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCategoryValue(undefined)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear</span>
                      </Button>
                    </div>
                  )}

                  <CategorySelectorSheet
                    open={openCategorySelector}
                    onClose={() => setOpenCategorySelector(false)}
                    categories={storeCategoryData}
                    onSelect={setCategoryValue}
                  />
                </div>
              )
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
            {addProductOnDiscountLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add to discount
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default DiscountFieldsSheet;
