import { CategoryItem } from "../category/types";
import {
  BrandItem,
  DiscountType,
  RewardProduct,
  ValueType,
} from "../product/types";
import { BranchItem } from "../store/types";

export interface DiscountCreatePayload {
  applicable_branches_ids?: number[];
  product_ids?: number[];
  name: string;
  description: string;
  terms_conditions?: string;
  start_date: string;
  end_date: string;
  status?: "active" | "inactive" | string;
  apply_to_all_branches?: boolean;
  banner: number;
  layout: number;
  applicable_branches?: number[];
}

export interface DiscountUpdatePayload {
  applicable_branches_ids?: number[];
  product_ids?: number[];
  name?: string;
  description?: string;
  terms_conditions?: string;
  start_date?: string;
  end_date?: string;
  status?: "active" | "inactive" | string;
  discount_type?: "PERCENTAGE" | "FLAT" | string;
  value?: string;
  buy_quantity?: number;
  get_quantity?: number;
  min_spend_amount?: string;
  apply_to_all_branches?: boolean;
  banner?: number;
  layout?: number;
  applicable_branches?: number[];
}

//to add the products on the discount
export interface AddProductOnDiscountPayload {
  discount_type: DiscountType;
  value?: number;
  value_type?: ValueType;
  buy_quantity?: number;
  min_spend_amount?: string;
  max_discount_amount?: string;
  brand?: number;
  category?: number;
  store_product?: number;
  bundle_discounts?: BundleDiscount[];
  reward_products?: RewardProduct[];
}

//Types of products which have offer applied to them and attached to the
//discount
export interface StoreProduct {
  id: number;
  store: number;
  store_name: string;
  price: string;
  image: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  category: number;
  brand: number | null;
}

export interface OfferAppliedProduct {
  id: number;
  discount_type: DiscountType;
  value: string;
  value_type: ValueType;
  buy_quantity: number;
  min_spend_amount: string;
  max_discount_amount: string;
  brand: BrandItem | null;
  category: CategoryItem | null;
  store_product: StoreProduct | null;
  bundle_discounts: BundleDiscount[];
  reward_products: ResponseRewardProduct[];
  created_at: string;
}

export interface ResponseRewardProduct {
  id: number;
  product_discount: number;
  store_product: StoreProduct;
  get_quantity: number;
  created_at: string;
}

// collection of type for disocunt detail (for disocunt preview) response
export interface BundleDiscount {
  id: number;
  store_product: StoreProduct;
  buy_quantity: number;
}

export interface ResponseRewardProduct {
  id: number;
  product_discount: number;
  store_product: StoreProduct;
  get_quantity: number;
  created_at: string;
}

// export interface DiscountedProduct {
//   id: number;
//   discount_type: DiscountType;
//   value: string;
//   value_type: ValueType;
//   buy_quantity: number;
//   min_spend_amount: string;
//   max_discount_amount: string;
//   brand: BrandItem | null;
//   category: CategoryItem | null;
//   store_product: StoreProduct | null;
//   bundle_discounts: BundleDiscount[];
//   reward_products: ResponseRewardProduct[];
//   created_at: string;
// }

// export interface OfferAppliedProducts {
//   id: number;
//   discount_type: DiscountType;
//   value: string;
//   value_type: ValueType;
//   buy_quantity: number;
//   min_spend_amount: string;
//   max_discount_amount: string;
//   brand: BrandItem | null;
//   category: CategoryItem | null;
//   store_product: StoreProduct | null;
//   bundle_discounts: any[];
//   reward_products: ResponseRewardProduct[];
//   created_at: string;
// }

export interface DiscountDetailResponse {
  id: number;
  discount_products: OfferAppliedProduct[];
  applicable_branches: BranchItem[];
  is_currently_active: boolean;
  product_count: number;
  name: string;
  description: string;
  terms_conditions: string;
  start_date: string;
  end_date: string;
  status: "active" | "inactive" | string;
  apply_to_all_branches: boolean;
  created_at: string;
  updated_at: string;
  banner: number;
  layout: number;
  store: number;
  created_by: number;
}

// interface DiscountItem {
//   id: number;
//   is_currently_active: boolean;
//   applicable_branches: BranchItem[];
//   banner: BannerItem;
//   layout: LayoutItem;
//   name: string;
//   description: string;
//   terms_conditions: string;
//   start_date: string;
//   end_date: string;
//   status: "active" | "inactive" | string;
//   apply_to_all_branches: boolean;
//   created_at: string;
//   updated_at: string;
//   store: number;
//   created_by: number;
// }

// export interface PreviewStoreProduct {
//   id: number;
//   store: number;
//   store_name: string;
//   price: string;
//   image: string;
//   is_available: boolean;
//   created_at: string;
//   updated_at: string;
//   delivery_available: boolean;
//   name: string;
//   description: string;
//   category: number;
//   brand: number | null;
// }

// export interface ProductsOnDiscount {
//   discount_type: "PERCENTAGE" | "FIXED_AMOUNT" | "SPEND_GET" | "BUNDLE";
//   value?: number;
//   value_type: "PERCENTAGE" | "FIXED_AMOUNT";
//   buy_quantity?: number;
//   min_spend_amount?: string;
//   max_discount_amount?: string;
//   brand?: number;
//   category?: number;
//   store_product?: number;
//   bundle_discounts?: BundleDiscount[];
//   reward_products?: ResponseRewardProduct[];
// }
