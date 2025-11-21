export interface StoreItem {
  id: number;
  name: string;
  description: string;
  store_type: "DEPT" | string;
  logo: string;
  cover_image: string;
  city: string;
  email: string;
  phone: string;
  website: string;
  welcome_message: string;
  slogan: string;
  owner: number;
}


export interface GetStoreListResponse {
  count: number;
  next: string;
  previous: string;
  results: StoreItem[]
}

//to get the store details by providing specific store key
export interface SocialMedia {
  platform: string;
  url: string;
  alt_text: string;
}

export interface SocialMediaResp {
  id: number;
  platform: string;
  url: string;
  alt_text: string;
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

export interface GetStoreDetailResponse {
  id: number;
  name: string;
  description: string;
  business_registration_number: string;
  website: string;
  phone: string;
  email: string;
  store_type: "DEPT" | string;
  logo: string;
  cover_image: string;
  city: string;
  district: string;
  address: string;
  location_link: string;
  latitude: string;
  longitude: string;
  welcome_message: string;
  slogan: string;
  followers_count: number;
  social_medias: SocialMedia[];
  branches: Branch[];
  owner: number;
}

//for store branches
export interface BranchItem {
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

export interface CreateStoreBranchPayload {
  name: string;
  city: string;
  district: string;
  address: string;
  location_link: string;
  latitude: string;
  longitude: string;
}

//******************************
//DOCUMENTS
//******************************

export interface DocumentItem {
  id: number;
  name: string;
  file: string;
  uploaded_at: string;
  is_verified: boolean
}

//******************************
//store  category list
//******************************
export interface StoreCategoryItem {
  id: number;
  name: string;
  didplay_name: string;
}
