import {
  addProductOnDiscount,
  createDiscount,
  deleteDiscount,
  deleteProductOnDiscount,
  getDiscount,
  getDiscountDetail,
  updateDiscount,
} from "@/redux/features/discount/discount";
import {
  DiscountDetailResponse,
  OfferAppliedProduct,
} from "@/redux/features/discount/types";
import { createSlice, PayloadAction, TaskAbortError } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

interface DiscountState {
  discountData: DiscountDetailResponse[] | null;
  discountStateLoading: boolean;
  discountError: string | null;

  //create discount
  createDiscountData: DiscountDetailResponse | null;
  createDiscountLoading: boolean;

  //update discount
  updateDiscountData: DiscountDetailResponse | null;
  updateDiscountLoading: boolean;

  //delete discount
  deleteDiscountData: AxiosResponse<{ message: string }> | null;
  deleteDiscountLoading: boolean;

  //add Products on disocunts
  addProductOnDiscountData: any | null;
  addProductOnDiscountLoading: boolean;

  //delete product on discounts
  deleteProductOnDiscountData: number | null;
  deleteProductOnDiscountLoading: boolean;

  //for discount detail
  discountDetailData: DiscountDetailResponse | null;
  discountDetailLoading: boolean;
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

  //add Products on discounts
  addProductOnDiscountData: null,
  addProductOnDiscountLoading: false,

  //for delete product on discount
  deleteProductOnDiscountData: null,
  deleteProductOnDiscountLoading: false,

  //for discount detail
  discountDetailData: null,
  discountDetailLoading: false,
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
    clearDiscountDetailState: (state) => {
      state.discountDetailData = null;
      state.discountDetailLoading = false;
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
    clearAddProductOnDiscountState: (state) => {
      state.discountError = null;
      state.addProductOnDiscountData = null;
      state.addProductOnDiscountLoading = false;
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
      .addCase(
        updateDiscount.fulfilled,
        (state, action: PayloadAction<DiscountDetailResponse>) => {
          toast.info("Updated Successfully", { richColors: true });
          state.updateDiscountLoading = false;
          state.updateDiscountData = action.payload;
          //on update the discount status it should update the discount detail data(except discount_products , which is not present on the response)
          state.discountDetailData = {
            ...action.payload,
            discount_products:
              state.discountDetailData?.discount_products ?? [],
          };

          state.discountData =
            state.discountData &&
            state.discountData.map((item) =>
              action.payload.id == item.id
                ? { ...item, ...action.payload }
                : item
            );
          state.discountError = null;
        }
      )
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
        state.addProductOnDiscountLoading = true;
        state.discountError = null;
      })
      .addCase(
        addProductOnDiscount.fulfilled,
        (state, action: PayloadAction<OfferAppliedProduct[]>) => {
          toast.success("Successfully added products");

          state.addProductOnDiscountLoading = false;
          state.addProductOnDiscountData = action.payload;
          state.discountError = null;

          //on successful add product on discount it should update the discount detail data
          if (state.discountDetailData) {
            state.discountDetailData = {
              ...state.discountDetailData,
              discount_products: action.payload,
            };
          }
        }
      )
      .addCase(
        addProductOnDiscount.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          toast.error(action.payload);

          state.addProductOnDiscountData = null;
          state.addProductOnDiscountLoading = false;
          state.discountError =
            action.payload || "Failed to add products on discount";
        }
      )
      //delete product on discount
      .addCase(deleteProductOnDiscount.pending, (state) => {
        state.deleteProductOnDiscountLoading = true;
        state.discountError = null;
      })
      .addCase(
        deleteProductOnDiscount.fulfilled,
        (state, action: PayloadAction<number>) => {
          toast.success("Successfully deleted product on discount");

          state.deleteProductOnDiscountLoading = false;
          state.deleteProductOnDiscountData = action.payload;
          state.discountError = null;

          //on successful delete product on discount it should update the discount detail data
          if (state.discountDetailData) {
            state.discountDetailData = {
              ...state.discountDetailData,
              discount_products:
                state.discountDetailData.discount_products.filter(
                  (item) => item.id !== action.payload
                ),
            };
          }
        }
      )
      .addCase(
        deleteProductOnDiscount.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          toast.error(action.payload);

          state.deleteProductOnDiscountData = null;
          state.deleteProductOnDiscountLoading = false;
          state.discountError =
            action.payload || "Failed to delete product on discount";
        }
      )

      //getting the details of discount
      .addCase(getDiscountDetail.pending, (state) => {
        state.discountDetailLoading = true;
        state.discountError = null;
      })
      .addCase(getDiscountDetail.fulfilled, (state, action) => {
        state.discountDetailLoading = false;
        state.discountDetailData = action.payload;
        state.discountError = null;
      })
      .addCase(
        getDiscountDetail.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.discountDetailData = null;
          state.discountDetailLoading = false;
          state.discountError =
            action.payload || "Failed to get discount detail";
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
  clearDiscountDetailState,
  clearAddProductOnDiscountState,
} = discountSlice.actions;

export default discountSlice.reducer;
