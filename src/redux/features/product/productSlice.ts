import { getProducts, searchProduct } from "@/redux/features/product/product";
import { ProductItem, } from "@/redux/features/product/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  productData: ProductItem[] | null;
  productLoading: boolean;
  productError: string | null;

  //for product from search
  // productSearchLoading: boolean;
  // productSearchData: SearchedProduct[] | null;
  // productSearchError: string | null;
}

// Initial state
const initialState: ProductState = {
  productData: null,
  productLoading: false,
  productError: null,

  //for searched products
  // productSearchLoading: false,
  // productSearchData: null,
  // productSearchError: null,
};


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductState(state) {
      state.productError = null;
      state.productData = null;
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
        state.productData = [...state.productData ?? [], ...action.payload.results];
        state.productError = null;
      })
      .addCase(
        getProducts.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.productData = null;
          state.productLoading = false;

          state.productError = action.payload || "Failed to fetch banners";
        }
      )

    //for searching product release ( of course need modificaiton after ashok
    //sir redesign )
    // .addCase(searchProduct.pending, (state) => {
    //   state.productSearchLoading = true;
    //   state.productSearchError = null;
    // })
    // .addCase(searchProduct.fulfilled, (state, action: any) => {
    //   state.productSearchLoading = false;
    //   state.productSearchData = action.payload;
    //   state.productSearchError = null;
    // })
    // .addCase(
    //   searchProduct.rejected,
    //   (state, action: PayloadAction<string | undefined>) => {
    //     state.productSearchData = null;
    //     state.productSearchLoading = false;
    //     state.productSearchError = action.payload || "Failed to fetch banners";
    //   }
    // )
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
