import { AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders } from "axios";
type ValuesArray = [number, number, number] | [number, number, number, number];

export interface LayoutItem {
  id?: number;
  name: string;
  layout_array: ValuesArray;
}

export interface LayoutCreatePayload {
  name: string;
  layout_array: ValuesArray;
}

