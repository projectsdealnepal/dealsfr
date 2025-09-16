import api from "@/lib/interceptor";
import { ApiResponse, ProductItem } from "@/redux/features/product/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

export const getProducts = createAsyncThunk<
  ApiResponse,
  number,
  { rejectValue: string }
>("product/get", async (s_id, thunkAPI) => {
  try {
    const response = await api.get(`/products/store/${s_id}/`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Registration failed"
    );
  }
});


export const filterProducts = createAsyncThunk<
  ApiResponse,
  { s_id: number, filter: string },
  { rejectValue: string }
>("product/filter/get", async ({ s_id, filter }, thunkAPI) => {
  try {
    const response = await api.get(`/products/store/${s_id}/?${filter}`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Registration failed"
    );
  }
});

export const createProduct = createAsyncThunk<
  AxiosResponse<ProductItem>,
  FormData,
  { rejectValue: string }
>("product/create", async (userData, thunkAPI) => {
  try {
    const response = await api.post("/api/products/", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Registration failed"
    );
  }
});
