
export const DummyOrders = [
  {
    "id": 1,
    "status": "pending",
    "customer": {
      "id": 101,
      "first_name": "Aarav",
      "last_name": "Sharma",
      "profile_image": "https://example.com/profiles/aarav.jpg",
      "email": "aarav.sharma@example.com"
    },
    "total_quantity": 3,
    "item_count": 2,
    "total_amount": "450.00",
    "pickup_code": "PK1234",
    "fulfillment_summary": {
      "pickup": 1,
      "delivery": 2
    },
    "created_at": "2025-01-10T10:25:00Z",
    "updated_at": "2025-01-10T10:30:00Z"
  },
  {
    "id": 2,
    "status": "completed",
    "customer": {
      "id": 102,
      "first_name": "Nikita",
      "last_name": "Khadka",
      "profile_image": "https://example.com/profiles/nikita.jpg",
      "email": "nikita.k@example.com"
    },
    "total_quantity": 5,
    "item_count": 3,
    "total_amount": "1290.50",
    "pickup_code": "PK8921",
    "fulfillment_summary": {
      "pickup": 3,
      "delivery": 2
    },
    "created_at": "2025-01-11T08:10:00Z",
    "updated_at": "2025-01-11T09:00:00Z"
  },
  {
    "id": 3,
    "status": "cancelled",
    "customer": {
      "id": 103,
      "first_name": "Sujal",
      "last_name": "Gurung",
      "profile_image": "https://example.com/profiles/sujal.png",
      "email": "sujal.g@example.com"
    },
    "total_quantity": 1,
    "item_count": 1,
    "total_amount": "120.00",
    "pickup_code": "PK5643",
    "fulfillment_summary": {
      "pickup": 1,
      "delivery": 0
    },
    "created_at": "2025-01-12T11:45:00Z",
    "updated_at": "2025-01-12T11:50:00Z"
  },
  {
    "id": 4,
    "status": "processing",
    "customer": {
      "id": 104,
      "first_name": "Prativa",
      "last_name": "Koirala",
      "profile_image": "https://example.com/profiles/prativa.jpeg",
      "email": "prativa.k@example.com"
    },
    "total_quantity": 8,
    "item_count": 5,
    "total_amount": "2140.75",
    "pickup_code": "PK7782",
    "fulfillment_summary": {
      "pickup": 4,
      "delivery": 4
    },
    "created_at": "2025-01-12T15:20:00Z",
    "updated_at": "2025-01-12T15:40:00Z"
  },
  {
    "id": 5,
    "status": "pending",
    "customer": {
      "id": 105,
      "first_name": "Bishal",
      "last_name": "Thapa",
      "profile_image": "https://example.com/profiles/bishal.jpg",
      "email": "bishal.t@example.com"
    },
    "total_quantity": 2,
    "item_count": 2,
    "total_amount": "650.00",
    "pickup_code": "PK3319",
    "fulfillment_summary": {
      "pickup": 0,
      "delivery": 2
    },
    "created_at": "2025-01-13T09:10:00Z",
    "updated_at": "2025-01-13T09:15:00Z"
  }
]

export const dummyOrder = {
  id: 12345,
  status: "pending",
  total_amount: "1500",
  pickup_code: "PX92KD",
  pickup_code_expires_at: "2025-12-20T14:15:22Z",
  store: 12,

  branch: {
    id: 7,
    name: "New Baneshwor Outlet",
    city: "Kathmandu",
    district: "Kathmandu",
    address: "New Baneshwor Road, Kathmandu",
    location_link: "https://maps.app.goo.gl/example",
    latitude: "27.6945",
    longitude: "85.3420",
    distance_km: 2.4,
  },

  customer: {
    id: 88,
    first_name: "Kushal",
    last_name: "Chapagain",
    profile_image: "https://example.com/profile.jpg",
    email: "kushal@example.com",
  },

  items: [
    {
      id: 1,
      product_name: "Chicken MoMo - Steam",
      quantity: 2,
      unit_price: "180",
      fulfillment_type: "pickup",
      delivery_status: "not_required",
      delivery_address: {
        id: 0,
        name: "",
        address: "",
        city: "",
        district: "",
        location_link: "",
      },
    },
    {
      id: 2,
      product_name: "Veg Chowmein",
      quantity: 1,
      unit_price: "150",
      fulfillment_type: "pickup",
      delivery_status: "not_required",
      delivery_address: {
        id: 0,
        name: "",
        address: "",
        city: "",
        district: "",
        location_link: "",
      },
    },
  ],

  timeline: [
    {
      event: "created",
      label: "Order was created",
      timestamp: "2025-12-10T10:05:22Z",
    },
    {
      event: "processed",
      label: "Kitchen started processing your order",
      timestamp: "2025-12-10T10:10:22Z",
    },
    {
      event: "ready",
      label: "Order is ready for pickup",
      timestamp: "2025-12-10T10:25:22Z",
    },
  ],

  notes: [
    {
      id: 1,
      note: "Customer requested extra spicy.",
      created_by: 12,
      created_at: "2025-12-10T10:03:22Z",
      updated_at: "2025-12-10T10:03:22Z",
      internal_only: false,
    },
  ],

  created_at: "2025-12-10T10:00:00Z",
  updated_at: "2025-12-10T10:25:00Z",
};
