import { filterProducts, getProducts } from "@/redux/features/product/product";
import { AddProductOnDiscount, ApiResponse, ProductItem, } from "@/redux/features/product/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  productList: ProductItem[] | null;
  productData: ApiResponse | null,
  productLoading: boolean;
  productError: string | null;

  //added Discount product
  addedDisountProducts: ProductItem[];
  rowSelection: Record<string, boolean>;
}

// Initial state
const initialState: ProductState = {
  productList: null,
  productData: null,
  productLoading: false,
  productError: null,

  //added Discount product
  addedDisountProducts: [],
  rowSelection: {},
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

    addProductOnDiscount(state, action: PayloadAction<AddProductOnDiscount>) {
      const productIds = Object.keys(action.payload.items).map(Number)
      if (action.payload.rowId) {
        const product = state.productData?.results.find((item: ProductItem) => (item as ProductItem).id === action.payload.rowId);
        if (product)
          state.addedDisountProducts.push(product)
      }
      if (!action.payload.rowId) {
        state.addedDisountProducts = state.addedDisountProducts.filter((product) => productIds.includes(product.id))
      }
    },

    setProductOnDiscount(state, action: PayloadAction<ProductItem[]>) {
      state.addedDisountProducts = action.payload
    },
    //row selection to determine the tick on checkbox
    setRowSelection(state, action: PayloadAction<Record<string, boolean>>) {
      state.rowSelection = action.payload;
    },

    clearAddedDiscountProducts(state) {
      state.addedDisountProducts = []
    }
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
        state.productList = action.payload.results;
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

export const { clearProductState, clearAddedDiscountProducts, addProductOnDiscount, setRowSelection, setProductOnDiscount } = productSlice.actions;
export default productSlice.reducer;
