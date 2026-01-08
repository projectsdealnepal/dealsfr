import api from "@/lib/interceptor";
import { extractErrorMessage } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { OrderDetail, OrderListResponse, OrderSummary } from "./types";

export const getOrderList = createAsyncThunk<
  OrderListResponse,
  { s_id: number, filter: string },
  { rejectValue: string }
>("get/orderlist", async ({ s_id, filter }, thunkAPI) => {
  try {
    const response = await api.get(`/orders/${s_id}/?${filter}`);
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(err, "Failed to get the order list")
    );
  }
});

//to the the order summmary detail
// https://api.thedealsfr.com/api/v1/admin/orders/{store_pk}/summary/
export const getOrderSummary = createAsyncThunk<
  OrderSummary,
  number,
  { rejectValue: string }
>("get/orderSummary", async (s_id, thunkAPI) => {
  try {
    const response = await api.get(`/orders/${s_id}/summary/`);
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(err, "Failed to get the summary of order")
    );
  }
});

//for getting the all details of order
// https://api.thedealsfr.com/api/v1/admin/orders/{store_pk}/{order_id}/detail/
export const getOrderDetail = createAsyncThunk<
  OrderDetail,
  { s_id: number; o_id: number },
  { rejectValue: string }
>("get/orderDetiail", async ({ o_id, s_id }, thunkAPI) => {
  try {
    const response = await api.get(`/orders/${s_id}/${o_id}/detail/`);
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(err, "Failed to get the order detail")
    );
  }
});

//update order status
// https://api.thedealsfr.com/api/v1/admin/orders/{store_pk}/{order_id}/status/
export const updateOrderStatus = createAsyncThunk<
  { message: string },
  { s_id: number; o_id: number; status: string },
  { rejectValue: string }
>("update/orderStatus", async ({ o_id, s_id, status }, thunkAPI) => {
  try {
    const response = await api.post(`/orders/${s_id}/${o_id}/status/`, {
      new_status: status,
    });
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(err, "Failed to update the order status")
    );
  }
});
