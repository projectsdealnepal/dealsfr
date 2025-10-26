export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductItem[];
}

export interface ProductItem {
  id: number;
  name: string;
  description: string;
  category: Category;
  brand: Brand;
  price: string;
  image: string;
  is_available: boolean;
  store: string;
  store_id: number;
  active_discount: ActiveDiscount | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  parent: number;
  child: CategoryChild | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryChild {
  id: number;
  name: string;
  parent: number;
  created_at: string;
  updated_at: string;
  child: ChildItem[];
}

export interface ChildItem {
  property1: string | null;
  property2: string | null;
}

export interface Brand {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ActiveDiscount {
  id: number;
  name: string;
  description: string;
  terms_conditions: string;
  start_date: string;
  end_date: string;
  status: string;
  discount_type: "PERCENTAGE" | "FLAT" | string;
  value: string;
  buy_quantity: number;
  get_quantity: number;
  min_spend_amount: string;
  apply_to_all_branches: boolean;
  created_at: string;
  updated_at: string;
  banner: number;
  layout: number;
  store: number;
  created_by: number;
  applicable_branches: number[];
}

//add discount payload
export interface AddProductOnDiscount {
  items: Record<string, boolean>,
  rowId: number | undefined
}

//for brands list
export interface BrandItem {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface RewardProductItem extends ProductItem {
  quantity: number;
}

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT" | "BOGO" | "SPEND_GET" | "BUNDLE"
export type TargetType = "storeproduct" | "category" | "brand"

export interface DiscountedProductType {
  discount_type: DiscountType;
  value?: string;
  buy_quantity?: number;
  get_quantity?: number;
  min_spend_amount?: string;
  reward_products?: RewardProduct[];
  target_type: TargetType;
  target_id: number;
}

export interface RewardProduct {
  store_product_id: number;
  get_quantity: number;
}
