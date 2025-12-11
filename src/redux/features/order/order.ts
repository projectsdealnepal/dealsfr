import api from "@/lib/interceptor";
import { extractErrorMessage } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { OrderDetail, OrderItem, OrderSummary } from "./types";

export const getOrderList = createAsyncThunk<
  OrderItem[],
  number,
  { rejectValue: string }
>("get/orderlist", async (s_id, thunkAPI) => {
  try {
    const response = await api.get(`/orders/${s_id}/`)
    return response.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(err, "Failed to get the order list")
    );
  }
})


//to the the order summmary detail
// https://api.thedealsfr.com/api/v1/admin/orders/{store_pk}/summary/
export const getOrderSummary = createAsyncThunk<
  OrderSummary,
  number,
  { rejectValue: string }
>("get/orderSummary", async (s_id, thunkAPI) => {
  try {
    const response = await api.get(`/orders/${s_id}/summary/`)
    return response.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(err, "Failed to get the summary of order")
    );
  }
})

//for getting the all details of order
// https://api.thedealsfr.com/api/v1/admin/orders/{store_pk}/{order_id}/detail/
export const getOrderDetail = createAsyncThunk<
  OrderDetail,
  { s_id: number, o_id: number },
  { rejectValue: string }
>("get/orderDetiail", async ({ o_id, s_id }, thunkAPI) => {
  try {
    const response = await api.get(`/orders/${s_id}/${o_id}/detail/`)
    return response.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(err, "Failed to get the order detail")
    );
  }
})
