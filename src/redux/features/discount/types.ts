import { BannerItem } from "../banner/types";
import { LayoutItem } from "../layout/types";

//types used in request
export interface CreateDiscountPayload {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  discount_type: "main" | "secondary" | "special";
  discount_percent: string;
  banner: string;
  layout: string;
}

export interface UpdateDiscountPayload {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  discount_type: "main" | "secondary" | "special";
  discount_percent: string;
  banner: string;
  layout: string;
}

// types that are used in response
interface ApplicableBranch {
  id: number;
  name: string;
  city: string;
  district: string;
  address: string;
  location_link: string;
  latitude: number;
  longitude: number;
  distance_km: number;
}

interface Banner {
  id: number;
  name: string;
  web_image: string;
  mobile_image: string;
  layout: number;
  store: number;
}

interface Layout {
  id: number;
  name: string;
  array: null;
}

interface DiscountItem {
  id: number;
  is_currently_active: boolean;
  applicable_branches: ApplicableBranch[];
  banner: BannerItem;
  layout: LayoutItem;
  name: string;
  description: string;
  terms_conditions: string;
  start_date: string;
  end_date: string;
  status: 'active' | string;
  discount_type: 'PERCENTAGE' | 'FIXED' | 'BOGO';
  value: number;
  buy_quantity: number;
  get_quantity: number;
  min_spend_amount: number;
  apply_to_all_branches: boolean;
  created_at: string;
  updated_at: string;
  store: number;
  created_by: number;
}

export interface GetDiscountResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DiscountItem[];
}
