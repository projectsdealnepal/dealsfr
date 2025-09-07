import {
  AxiosResponseHeaders,
  InternalAxiosRequestConfig,
  RawAxiosResponseHeaders,
} from "axios";

export default interface BannerPayload {
  id: number;
  banner_type: string;
  web_banner_image: string;
  mobile_banner_image: string;
  banner_name: string;
  banner_content: string | null;
  selected_banner_id: number;
  theme_id: number;
  created_by_id: number;
  store: number;
}

export interface BannerItem {
  id: number;
  name: string;
  web_image: string;
  mobile_image: string;
  layout: number;
  store: number;
}

export interface BannerCreateResponse {
  data: BannerItem[];
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<any>;
  request?: any;
}
