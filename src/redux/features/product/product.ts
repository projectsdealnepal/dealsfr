import api from "@/lib/interceptor";
import { ApiResponse, BrandItem, GenericProductsApiResponse, ProductItem } from "@/redux/features/product/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

// https://api.thedealsfr.com/api/v1/admin/products/{store_pk}/products/
export const getProducts = createAsyncThunk<
  ApiResponse,
  number,
  { rejectValue: string }
>("product/get", async (s_id, thunkAPI) => {
  try {
    const response = await api.get(`/products/${s_id}/products/`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.error || error.message || "Failed to ge the the products"
    );
  }
});

//get all products( which includes all the products from all stores)
// https://api.thedealsfr.com/api/v1/admin/products/generic/
export const getAllProducts = createAsyncThunk<
  GenericProductsApiResponse,
  string,
  { rejectValue: string }
>("product/getall", async (filter, thunkAPI) => {
  try {
    const response = await api.get(`/products/generic/?${filter}`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to get all products"
    );
  }
});

export const filterProducts = createAsyncThunk<
  ApiResponse,
  { s_id: number, filter: string },
  { rejectValue: string }
>("product/filter/get", async ({ s_id, filter }, thunkAPI) => {
  try {
    const response = await api.get(`/products/${s_id}/products/?${filter}`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to ge the the products"
    );
  }
});

export const fetchProducts = createAsyncThunk<
  ApiResponse,
  { s_id: number; filter?: string }, // Make filter optional
  { rejectValue: string }
>("product/fetch", async ({ s_id, filter = '' }, thunkAPI) => {
  try {
    const url = filter ? `/products/store/${s_id}/?${filter}` : `/products/store/${s_id}/`;
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to fetch products"
    );
  }
});

//Create product on store
// https://api.thedealsfr.com/api/v1/admin/products/{store_pk}/create/
export const createProduct = createAsyncThunk<
  ProductItem,
  { store_pk: number, userData: FormData },
  { rejectValue: string }
>("product/create", async ({ store_pk, userData }, thunkAPI) => {
  try {
    const response = await api.post(`/products/${store_pk}/create/`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to create product"
    );
  }
});

//update bulk products
// https://api.thedealsfr.com/api/v1/admin/products/{store_pk}/bulk-update/
export const updateBulkProducts = createAsyncThunk<
  ProductItem[],
  { store_pk: number, userData: FormData },
  { rejectValue: string }
>("product/bulk-update", async ({ store_pk, userData }, thunkAPI) => {
  try {
    const response = await api.patch(`/products/${store_pk}/bulk-update/`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to update bulk products"
    );
  }
});

//##################################################
// Brand List 
//##################################################
export const getBrandsList = createAsyncThunk<
  BrandItem[],
  void,
  { rejectValue: string }
>("brandList/get", async (_, thunkAPI) => {
  try {
    const response = await api.get(`products/brands/`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to get the brands list."
    );
  }
});

// https://api.thedealsfr.com/api/v1/admin/products/{store_pk}/create/

//add product to the store
export const addProductsToStore = createAsyncThunk<
  ProductItem[],
  { store_pk: number, products: FormData },
  { rejectValue: string }
>("product/addToStore", async ({ store_pk, products }, thunkAPI) => {
  try {
    const response = await api.post(`/products/${store_pk}/create/`, products, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to add products to store"
    );
  }
});

