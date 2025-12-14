import { DummyOrders } from "@/app/dashboard/orders/components/DummyData";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  getOrderDetail,
  getOrderList,
  getOrderSummary,
  updateOrderStatus,
} from "./order";
import { OrderDetail, OrderItem, OrderSummary } from "./types";

interface OrderState {
  orderLoading: boolean;
  orderListData: OrderItem[] | null;
  orderError: string | null;

  orderSummaryData: OrderSummary | null;

  orderDetailLoading: boolean;
  orderDetailData: OrderDetail | null;
  orderDetailError: string | null;

  //update order status response
  UpdateOrderStatusData: { message: string } | null;
  UpdateOrderStatusError: string | null;
}

const initialState: OrderState = {
  orderLoading: false,
  orderListData: null,
  orderError: null,

  //for order summary
  orderSummaryData: null,

  //for ordere detial
  orderDetailLoading: false,
  orderDetailData: null,
  orderDetailError: null,

  //update order status response
  UpdateOrderStatusData: null,
  UpdateOrderStatusError: null,
};

const OrderSlice = createSlice({
  name: "orderslice",
  initialState,
  reducers: {
    clearOrderListState: (state) => {
      state.orderLoading = false;
      state.orderListData = null;
      state.orderError = null;
    },
    clearOrderSummaryState: (state) => {
      state.orderSummaryData = null;
    },

    clearOrderDetailState: (state) => {
      state.orderDetailLoading = false;
      state.orderDetailData = null;
      state.orderDetailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderList.pending, (state) => {
        state.orderError = null;
        state.orderLoading = false;
      })
      .addCase(
        getOrderList.fulfilled,
        (state, action: PayloadAction<OrderItem[]>) => {
          state.orderError = null;
          state.orderLoading = false;
          state.orderListData = action.payload;
        }
      )
      .addCase(
        getOrderList.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.orderLoading = false;
          state.orderListData = null;
          state.orderError = action.payload as string;
        }
      )

      //for order summary
      .addCase(getOrderSummary.pending, (state) => {
        state.orderLoading = false;
      })
      .addCase(
        getOrderSummary.fulfilled,
        (state, action: PayloadAction<OrderSummary>) => {
          state.orderError = null;
          state.orderLoading = false;
          state.orderSummaryData = action.payload;
        }
      )
      .addCase(
        getOrderSummary.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.orderLoading = false;
          state.orderSummaryData = null;
          state.orderError = action.payload as string;
        }
      )

      //for getting orderDetail
      .addCase(getOrderDetail.pending, (state) => {
        state.orderDetailLoading = false;
      })
      .addCase(
        getOrderDetail.fulfilled,
        (state, action: PayloadAction<OrderDetail>) => {
          state.orderDetailError = null;
          state.orderDetailLoading = false;
          state.orderDetailData = action.payload;
        }
      )
      .addCase(
        getOrderDetail.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.orderDetailLoading = false;
          state.orderDetailData = null;
          state.orderDetailError = action.payload as string;
        }
      )
      //for order status update
      .addCase(updateOrderStatus.pending, (state) => {
        state.UpdateOrderStatusError = null;
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.UpdateOrderStatusError = null;
          state.UpdateOrderStatusData = action.payload;
          toast.success("Order status updated successfully");
        }
      )
      .addCase(
        updateOrderStatus.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.UpdateOrderStatusData = null;
          state.UpdateOrderStatusError = action.payload as string;
        }
      );
  },
});

export const { clearOrderListState } = OrderSlice.actions;
export default OrderSlice.reducer;
