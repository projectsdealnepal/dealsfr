import { BannerItem } from "../banner/types";
import { CategoryItem } from "../category/types";
import { LayoutItem } from "../layout/types";
import { BrandItem } from "../product/types";
import { BranchItem, StoreItem } from "../store/types";

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

export interface DiscountItem {
  id: number;
  is_currently_active: boolean;
  applicable_branches: BranchItem[];
  banner: BannerItem;
  layout: LayoutItem;
  name: string;
  description: string;
  terms_conditions: string;
  start_date: string;
  end_date: string;
  status: "active" | "inactive" | string;
  apply_to_all_branches: boolean;
  created_at: string;
  updated_at: string;
  store: number;
  created_by: number;
}


//to add the products on the discount
interface BundleDiscount {
  store_product_id: number;
  buy_quantity: number;
}

interface RewardProduct {
  store_product_id: number;
  get_quantity: number;
}

export interface AddProductOnDiscountPayload {
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT" | "SPEND_GET" | "BUNDLE";
  value?: number;
  value_type: "PERCENTAGE" | "FIXED_AMOUNT";
  buy_quantity?: number;
  min_spend_amount?: string;
  max_discount_amount?: string;
  brand?: number;
  category?: number;
  store_product?: number;
  bundle_discounts?: BundleDiscount[];
  reward_products?: RewardProduct[];
}


export interface ProductsOnDiscount {
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT" | "SPEND_GET" | "BUNDLE";
  value?: number;
  value_type: "PERCENTAGE" | "FIXED_AMOUNT";
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

export interface OfferAppliedProducts {
  id: number;
  discount_type: string;
  value: string;
  value_type: string;
  buy_quantity: number;
  min_spend_amount: number | null;
  max_discount_amount: number | null;
  brand: BrandItem | null;
  category: number | null;
  store_product: StoreProduct | null;
  bundle_discounts: any[];
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

// // ==========================================================
// collection of type for disocunt detail (for disocunt preview) response
// // ==========================================================
//
//

export interface PreviewProductItem {
  id: number;
  name: string;
  description: string;
  category: number;
  brand: number | null;
  created_at: string;
  updated_at: string;
}

export interface PreviewStoreProduct {
  id: number;
  store: number;
  store_name: string;
  price: string;
  image: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  delivery_available: boolean;
  name: string;
  description: string;
  category: number;
  brand: number | null;
}

export interface PreviewBundleDiscount {
  id: number
  store_product: Partial<PreviewStoreProduct>
  buy_quantity: number
}

export interface PreviewRewardProduct {
  id: number
  product_discount: number
  store_product: Partial<PreviewStoreProduct>
  get_quantity: number
  created_at: string
}

export interface PreviewDiscountedProduct {
  id: number
  discount_type: "PERCENTAGE" | "FLAT"
  value: string
  value_type: "PERCENTAGE" | "FLAT"
  buy_quantity: number
  min_spend_amount: string
  max_discount_amount: string
  brand: BrandItem
  category: CategoryItem
  store_product: PreviewStoreProduct
  bundle_discounts: BundleDiscount[]
  reward_products: PreviewRewardProduct[]
  created_at: string
}


export interface PreviewDiscountDetailResponse {
  id: number;
  discount_products: PreviewDiscountedProduct[];
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

