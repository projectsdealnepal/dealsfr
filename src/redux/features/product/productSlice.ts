import { filterProducts, getBrandsList, getProducts } from "@/redux/features/product/product";
import { AddProductOnDiscount, ApiResponse, BrandItem, DiscountedProductType, ProductItem, RewardProductItem, } from "@/redux/features/product/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  productList: ProductItem[] | null;
  productData: ApiResponse | null,
  productLoading: boolean;
  productError: string | null;

  //for listing all brands
  brandListData: BrandItem[] | null
  //to select and add the item in the discount list
  discountProductList: DiscountedProductType[],
  tempDiscountProductList: ProductItem[],
  //added Discount product(used in table)
  selectedProductList: ProductItem[];
  //for rewardProductList
  rewardProductList: RewardProductItem[];
  rowSelection: Record<string, boolean>;
}

// Initial state
const initialState: ProductState = {
  productList: null,
  productData: null,
  productLoading: false,
  productError: null,

  //for listing all brands
  brandListData: null,

  //to select and add the item in the discount list
  tempDiscountProductList: [],
  discountProductList: [],
  //added Discount product(used in data-table)
  selectedProductList: [],
  //rewardProductList
  rewardProductList: [],
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

    //row selection to determine the tick on checkbox
    setRowSelection(state, action: PayloadAction<Record<string, boolean>>) {
      state.rowSelection = action.payload;
    },
    clearRowSelection(state) {
      state.rowSelection = {};
    },
    //to make the list when user check the product from the table
    makeSelectedProductList(state, action: PayloadAction<AddProductOnDiscount>) {
      const productIds = Object.keys(action.payload.items).map(Number)
      if (action.payload.rowId) {
        const product = state.productData?.results.find((item: ProductItem) => (item as ProductItem).id === action.payload.rowId);
        if (product)
          state.selectedProductList.push(product)
      }
      if (!action.payload.rowId) {
        state.selectedProductList = state.selectedProductList.filter((product) => productIds.includes(product.id))
      }
    },
    setSelectedProductList(state, action: PayloadAction<ProductItem[]>) {
      state.selectedProductList = action.payload
    },
    clearSelectedProductList(state) {
      state.selectedProductList = []
    },
    //to select and create the product list for discount
    setTempProductList(state) {
      state.tempDiscountProductList = state.selectedProductList
    },
    updateTempProductList(state, action: PayloadAction<ProductItem[]>) {
      state.tempDiscountProductList = action.payload
    },
    clearTempProductList(state) {
      state.tempDiscountProductList = []
    },
    //to select and create the product list for discount
    addDiscountedProductList(state, action: PayloadAction<DiscountedProductType[]>) {
      state.discountProductList = action.payload
    },
    clearDiscountProductList(state) {
      state.discountProductList = []
    },

    //for reward product list
    setRewardProductList(state) {
      state.rewardProductList = state.selectedProductList.map(
        (item, index) => ({ ...item, quantity: 1 })
      )
    },
    updateRewardProductList(state, action: PayloadAction<RewardProductItem[]>) {
      state.rewardProductList = action.payload
    },
    clearRewardProductList(state) {
      state.rewardProductList = []
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
      //get the list of brands
      .addCase(getBrandsList.fulfilled, (state, action) => {
        state.brandListData = action.payload;
      })

  },
});

export const {
  clearProductState,
  setRowSelection,
  clearRowSelection,
  makeSelectedProductList,
  setSelectedProductList,
  clearSelectedProductList,
  setTempProductList,
  updateTempProductList,
  clearTempProductList,
  addDiscountedProductList: addDiscountProductList,
  clearDiscountProductList,
  setRewardProductList,
  clearRewardProductList,
  updateRewardProductList

} = productSlice.actions;
export default productSlice.reducer;
