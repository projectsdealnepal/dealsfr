import { BannerItem } from "../banner/types";
import { LayoutItem } from "../layout/types";
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
