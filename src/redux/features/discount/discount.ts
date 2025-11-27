import api from "@/lib/interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { DiscountItem, DiscountCreatePayload, DiscountUpdatePayload, AddProductOnDiscountPayload, OfferAppliedProducts } from "./types";

export const getDiscount = createAsyncThunk<
  DiscountItem[],
  number,
  { rejectValue: string }
>("userData/discount/get", async (s_id, thunkAPI) => {
  try {
    const response = await api.get(`/products/${s_id}/discount/`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to get discounts."
    );
  }
});

export const createDiscount = createAsyncThunk<
  DiscountItem,
  { payload: DiscountCreatePayload, s_id: number },
  { rejectValue: string }
>("userData/discount/create", async ({ payload, s_id }, thunkAPI) => {
  try {
    const response = await api.post(`/products/${s_id}/discount/`, payload);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to create discount."
    );
  }
});

export const updateDiscount = createAsyncThunk<
  DiscountItem,
  { payload: DiscountUpdatePayload, s_id: number, d_id: number },
  { rejectValue: string }
>("userData/discount/update", async ({ payload, s_id, d_id }, thunkAPI) => {
  try {
    const response = await api.patch(`/products/${s_id}/discount/${d_id}/`, payload);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to update discount."
    );
  }
});

export const deleteDiscount = createAsyncThunk<
  AxiosResponse<{ message: string }>,
  { s_id: number, id: number },
  { rejectValue: string }
>("userData/discount/delete", async ({ s_id, id }, thunkAPI) => {
  try {
    const response = await api.delete(`/products/${s_id}/discount/${id}/`);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to delete discount."
    );
  }
});

//=====================================
//Add products on disocunt
//=====================================

export const addProductOnDiscount = createAsyncThunk<
  OfferAppliedProducts[],
  { payload: AddProductOnDiscountPayload[], s_id: number, d_id: number },
  { rejectValue: string }
>("addProductOnDiscount", async ({ payload, s_id, d_id }, thunkAPI) => {
  try {
    const response = await api.post(`/products/${s_id}/discount/${d_id}/products/`, payload);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to add products on discount."
    );
  }
});


export const updateProductOnDiscount = createAsyncThunk<
  OfferAppliedProducts[],
  { payload: AddProductOnDiscountPayload[], s_id: number, d_id: number },
  { rejectValue: string }
>("updateProductOnDiscount", async ({ payload, s_id, d_id }, thunkAPI) => {
  try {
    const response = await api.patch(`/products/${s_id}/discount/${d_id}/products/`, payload);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to add products on discount."
    );
  }
});

export const getDiscountProductList = createAsyncThunk<
  OfferAppliedProducts[],
  { s_id: number, d_id: number },
  { rejectValue: string }
>("getDiscountProductList ", async ({ s_id, d_id }, thunkAPI) => {
  try {
    const response = await api.get(`/products/${s_id}/discount/${d_id}/products/`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to get the product list of a discount."
    );
  }
});
