import {
  addProductOnDiscount,
  createDiscount,
  deleteDiscount,
  getDiscount,
  updateDiscount,
} from "@/redux/features/discount/discount";
import { DiscountItem } from "@/redux/features/discount/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

interface DiscountState {
  discountData: DiscountItem[] | null;
  discountStateLoading: boolean;
  discountError: string | null;

  //create discount
  createDiscountData: DiscountItem | null;
  createDiscountLoading: boolean;

  //update discount
  updateDiscountData: DiscountItem | null;
  updateDiscountLoading: boolean;

  //delete discount
  deleteDiscountData: AxiosResponse<{ message: string }> | null;
  deleteDiscountLoading: boolean;

  //add Products on disocunts
  addProductOnDiscountData: any | null;
  addProductOnDiscoutLoading: boolean;
}

// Initial state
const initialState: DiscountState = {
  discountStateLoading: false,
  //Get Discount
  discountData: null,
  discountError: null,

  //create discount
  createDiscountData: null,
  createDiscountLoading: false,

  //update discount
  updateDiscountData: null,
  updateDiscountLoading: false,

  //delete discount
  deleteDiscountData: null,
  deleteDiscountLoading: false,

  //add Products on disocunts
  addProductOnDiscountData: null,
  addProductOnDiscoutLoading: false,
};

const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {
    clearAllDiscountState: (state) => {
      state.discountError = null;
      state.discountData = null;
      state.discountStateLoading = false;
      state.createDiscountData = null;
      state.createDiscountLoading = false;
      state.updateDiscountData = null;
      state.updateDiscountLoading = false;
      state.deleteDiscountData = null;
      state.deleteDiscountLoading = false;
    },
    clearGetDiscountState: (state) => {
      state.discountError = null;
      state.discountData = null;
      state.discountStateLoading = false;
    },
    clearCreateDiscountState: (state) => {
      state.discountError = null;
      state.createDiscountData = null;
      state.createDiscountLoading = false;
    },
    clearUpdateDiscountState: (state) => {
      state.discountError = null;
      state.updateDiscountData = null;
      state.updateDiscountLoading = false;
    },
    clearDeleteDiscountState: (state) => {
      state.discountError = null;
      state.deleteDiscountData = null;
      state.deleteDiscountLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Discount
      .addCase(getDiscount.pending, (state) => {
        state.discountStateLoading = true;
        state.discountError = null;
      })
      .addCase(getDiscount.fulfilled, (state, action: any) => {
        state.discountStateLoading = false;
        state.discountData = action.payload;
        state.discountError = null;
      })
      .addCase(
        getDiscount.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.discountData = null;
          state.discountStateLoading = false;
          state.discountError = action.payload || "Failed to fetch discounts";
        }
      )

      // Create Discount
      .addCase(createDiscount.pending, (state) => {
        state.createDiscountLoading = true;
        state.discountError = null;
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.createDiscountLoading = false;
        state.createDiscountData = action.payload;
        state.discountData?.push(action.payload);
        state.discountError = null;
      })
      .addCase(
        createDiscount.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.createDiscountData = null;
          state.createDiscountLoading = false;
          state.discountError = action.payload || "Failed to create discount";
        }
      )

      // Update Discount
      .addCase(updateDiscount.pending, (state) => {
        state.updateDiscountLoading = true;
        state.discountError = null;
      })
      .addCase(updateDiscount.fulfilled, (state, action: PayloadAction<DiscountItem>) => {
        toast.info("Update Successfully", { richColors: true })
        state.updateDiscountLoading = false;
        state.updateDiscountData = action.payload;
        state.discountData = state.discountData && state.discountData.map((item) =>
          action.payload.id == item.id ? { ...item, ...action.payload } : item
        )
        state.discountError = null;
      })
      .addCase(
        updateDiscount.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.updateDiscountData = null;
          state.updateDiscountLoading = false;
          state.discountError = action.payload || "Failed to update discount";
        }
      )

      // Delete Discount
      .addCase(deleteDiscount.pending, (state) => {
        state.deleteDiscountLoading = true;
        state.discountError = null;
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.deleteDiscountLoading = false;
        state.deleteDiscountData = action.payload;
        state.discountError = null;
      })
      .addCase(
        deleteDiscount.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.deleteDiscountData = null;
          state.deleteDiscountLoading = false;
          state.discountError = action.payload || "Failed to delete discount";
        }
      )

      // Add products on discount (extra reducer)
      .addCase(addProductOnDiscount.pending, (state) => {
        state.addProductOnDiscoutLoading = true;
        state.discountError = null;
      })
      .addCase(addProductOnDiscount.fulfilled, (state, action) => {
        state.addProductOnDiscoutLoading = false;
        state.addProductOnDiscountData = action.payload;
        state.discountError = null;
        // Optionally update discountData if needed:
        // if (action.payload?.id && state.discountData) {
        //   const idx = state.discountData.findIndex(d => d.id === action.payload.id);
        //   if (idx !== -1) state.discountData[idx] = action.payload;
        // }
      })
      .addCase(
        addProductOnDiscount.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.addProductOnDiscountData = null;
          state.addProductOnDiscoutLoading = false;
          state.discountError =
            action.payload || "Failed to add products on discount";
        }
      );
  },
});

export const {
  clearAllDiscountState,
  clearCreateDiscountState,
  clearDeleteDiscountState,
  clearGetDiscountState,
  clearUpdateDiscountState,
} = discountSlice.actions;

export default discountSlice.reducer;
