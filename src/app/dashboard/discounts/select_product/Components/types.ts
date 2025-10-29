import { DiscountType, TargetType, ValueType } from "@/redux/features/product/types";

// Types
export interface BaseDiscountItem {
  id: string;
  discountType: DiscountType;
  targetType: TargetType;
  valueType: ValueType;
}

export interface PercentageDiscount extends BaseDiscountItem {
  discountType: "PERCENTAGE";
  target: number;
  percentageValue: number;
  maximumDiscount: number;
}

export interface FixedAmountDiscount extends BaseDiscountItem {
  discountType: "FIXED_AMOUNT";
  target: number;
  amountValue: number;
}

export interface BOGODiscount extends BaseDiscountItem {
  discountType: "BOGO";
  valueType: ValueType,
  target: number;
  buyQuantity: number;
  percentageValue: number;
  maximumDiscount: number;
  discountValue: number;
  rewardItems?: string;
}

export interface SpendGetDiscount extends BaseDiscountItem {
  discountType: "SPEND_GET";
  valueType: ValueType,
  target: number;
  spendAmount: number;
  percentageValue: number;
  maximumDiscount: number;
  discountValue: number;
  rewardItems?: string;
}

export interface BundleDiscount extends BaseDiscountItem {
  discountType: "BUNDLE";
  valueType: ValueType,
  percentageValue: number;
  maximumDiscount: number;
  discountValue: number;
  rewardItems?: string;
}

export type PartialDiscountItem =
  | (Partial<PercentageDiscount> & { discountType: "PERCENTAGE" })
  | (Partial<FixedAmountDiscount> & { discountType: "FIXED_AMOUNT" })
  | (Partial<BOGODiscount> & { discountType: "BOGO" })
  | (Partial<SpendGetDiscount> & { discountType: "SPEND_GET" })
  | (Partial<BundleDiscount> & { discountType: "BUNDLE" });
