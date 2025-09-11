import api from "@/lib/interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { DiscountItem, DiscountCreatePayload } from "./types";

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
  any,
  { rejectValue: string }
>("userData/discount/update", async (payload, thunkAPI) => {
  try {
    const response = await api.patch("/api/discounts/", payload);
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
