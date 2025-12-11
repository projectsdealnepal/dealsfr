import api from "@/lib/interceptor";
import { extractErrorMessage } from "@/lib/utils";
import { LayoutCreatePayload, LayoutItem } from "@/redux/features/layout/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getFeaturedItems = createAsyncThunk<
  LayoutItem[],
  number,
  { rejectValue: string }
>("userData/layout/get", async (s_id, thunkAPI) => {
  try {
    const response = await api.get(`/stores/${s_id}/layouts/`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(error, "Failed to get layouts.")
    );
  }
});


export const createLayout = createAsyncThunk<
  LayoutItem[],
  { payload: LayoutCreatePayload; s_id: number },
  { rejectValue: string }
>("userData/layout/create", async ({ payload, s_id }, thunkAPI) => {
  try {
    const response = await api.post(`/stores/${s_id}/layouts/`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(error, "Failed to create layout.")
    );
  }
});

export const updateLayout = createAsyncThunk<
  LayoutItem,
  { payload: LayoutCreatePayload; s_id: number; l_id: number },
  { rejectValue: string }
>("userData/layout/update", async ({ payload, s_id, l_id }, thunkAPI) => {
  try {
    const response = await api.patch(
      `/stores/${s_id}/layouts/${l_id}/`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(error, "Failed to update layout.")
    );
  }
});

export const deleteLayout = createAsyncThunk<
  LayoutItem[],
  { s_id: number; l_id: number },
  { rejectValue: string }
>("userData/layout/delete", async ({ s_id, l_id }, thunkAPI) => {
  try {
    const response = await api.delete(`/stores/${s_id}/layouts/${l_id}/`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(error, "Failed to delete layout.")
    );
  }
});
