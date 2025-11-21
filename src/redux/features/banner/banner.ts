import api from "@/lib/interceptor";
import { extractErrorMessage } from "@/lib/utils";
import { BannerItem } from "@/redux/features/banner/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getBanner = createAsyncThunk<
  BannerItem[],
  number,
  { rejectValue: string }
>("userData/banner/get", async (store_id, thunkAPI) => {
  try {
    const response = await api.get(`/stores/${store_id}/banners/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(error, "Failed to get the banners.")
    );
  }
});

export const createBanner = createAsyncThunk<
  BannerItem[],
  { payload: FormData; s_id: number },
  { rejectValue: string }
>("userData/banner/create", async ({ payload, s_id }, thunkAPI) => {
  try {
    const response = await api.post(`/stores/${s_id}/banners/`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(error, "Failed to create banners.")
    );
  }
});

export const updateBanner = createAsyncThunk<
  BannerItem,
  { payload: FormData; s_id: number; b_id: string },
  { rejectValue: string }
>("userData/banner/update", async ({ payload, s_id, b_id }, thunkAPI) => {
  try {
    const response = await api.patch(
      `/stores/${s_id}/banners/${b_id}/`,
      payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(error, "Failed to update banner.")
    );
  }
});

export const deleteBanner = createAsyncThunk<
  BannerItem[],
  { s_id: number; b_id: number },
  { rejectValue: string }
>("userData/banner/delete", async ({ s_id, b_id }, thunkAPI) => {
  try {
    const response = await api.delete(`/stores/${s_id}/banners/${b_id}/`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(error, "Failed to delete banner.")
    );
  }
});
