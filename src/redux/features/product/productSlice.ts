import { filterProducts, getProducts } from "@/redux/features/product/product";
import { ApiResponse, ProductItem, } from "@/redux/features/product/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  productList: ProductItem[] | null;
  productData: ApiResponse | null,
  productLoading: boolean;
  productError: string | null;

}

// Initial state
const initialState: ProductState = {
  productList: null,
  productData: null,
  productLoading: false,
  productError: null,

};


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductState(state) {
      state.productError = null;
      state.productList = null;
      state.productLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.productData = action.payload;
        state.productList = [...state.productList ?? [], ...action.payload.results];
        state.productError = null;
      })
      .addCase(
        getProducts.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.productList = null;
          state.productLoading = false;

          state.productError = action.payload || "Failed to fetch products";
        }
      )
      .addCase(filterProducts.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(filterProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.productData = action.payload;
        state.productList = action.payload.results;
        state.productError = null;
      })
      .addCase(
        filterProducts.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.productList = null;
          state.productLoading = false;
          state.productError = action.payload || "Failed to fetch filter products";
        }
      )

  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
