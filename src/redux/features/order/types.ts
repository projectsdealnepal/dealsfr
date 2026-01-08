export interface OrderListResponse {
  count: number,
  next: string,
  previous: string,
  results: OrderItem[]
}
export interface OrderItem {
  id: number
  status: string
  customer: Customer
  total_quantity: number
  item_count: number
  total_amount: string
  pickup_code: string
  fulfillment_summary: FulfillmentSummary
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  first_name: string
  last_name: string
  profile_image: string
  email: string
}

export interface FulfillmentSummary {
  pickup: number
  delivery: number
}

//for order summary
export interface OrderSummary {
  total_orders: number;
  pending: number;
  confirmed: number;
  ready_for_pickup: number;
  picked_up: number;
  delivered: number;
  cancelled: number;
  completed: number;
  total_revenue: string;
}

//for reteriving the order detail of each order
export interface OrderDetail {
  id: number;
  status: string;
  total_amount: string;
  pickup_code: string;
  pickup_code_expires_at: string;
  store: number;
  branch: Branch;
  customer: Customer;
  items: OrderStatus[];
  timeline: TimelineEvent[];
  notes: OrderNote[];
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: number;
  name: string;
  city: string;
  district: string;
  address: string;
  location_link: string;
  latitude: string;
  longitude: string;
  distance_km: number;
}


export interface OrderStatus {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  fulfillment_type: "pickup" | "delivery" | string;
  delivery_status: "not_required" | "pending" | "shipped" | "delivered" | string;
  delivery_address: DeliveryAddress;
}

export interface DeliveryAddress {
  id: number;
  name: string;
  address: string;
  city: string;
  district: string;
  location_link: string;
}

export interface TimelineEvent {
  event: string;
  label: string;
  timestamp: string;
}

export interface OrderNote {
  id: number;
  note: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  internal_only: boolean;
}
