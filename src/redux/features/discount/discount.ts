import api from "@/lib/interceptor";
import {
  CreateDiscountPayload,
  DiscountItem,
  GetDiscountResponse,
  UpdateDiscountPayload,
} from "@/redux/features/discount/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

export const getDiscount = createAsyncThunk<
  GetDiscountResponse[],
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
  CreateDiscountPayload,
  { rejectValue: string }
>("userData/discount/create", async (discountData, thunkAPI) => {
  try {
    const response = await api.post("/api/discounts/", {
      ...discountData,
      main_category: 1,
    });
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to create discount."
    );
  }
});

export const updateDiscount = createAsyncThunk<
  AxiosResponse<DiscountItem>,
  UpdateDiscountPayload,
  { rejectValue: string }
>("userData/discount/update", async (discountData, thunkAPI) => {
  try {
    const response = await api.patch("/api/discounts/", {
      ...discountData,
    });
    return response;
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
  number,
  { rejectValue: string }
>("userData/discount/delete", async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/api/discounts/${id}`);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to delete discount."
    );
  }
});
