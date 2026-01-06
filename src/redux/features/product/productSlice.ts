import { addProductsToStore, createProduct, filterProducts, getAllProducts, getBrandsList, getProducts, updateBulkProducts } from "@/redux/features/product/product";
import { AddProductOnDiscount, ApiResponse, BrandItem, DiscountedProductType, GenericProductItem, ProductItem, RewardProductItem, } from "@/redux/features/product/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { addProductOnDiscount, getDiscountProductList, updateProductOnDiscount } from "../discount/discount";
import { AddProductOnDiscountPayload, OfferAppliedProduct } from "../discount/types";

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
  //discounted applied Product list(this is like final list of products that are in the
  //discount)
  discountAppliedProductList: AddProductOnDiscountPayload[]
  offerAppliedProductsList: OfferAppliedProduct[]

  //for getting the list of all products ( from all stores)
  allProductList: GenericProductItem[] | null
  allProductPagination: number;

  //these temporary product list are the selected products when admin 
  // adding the product to his/her store(before confirmaiton).
  tempAddedProductList: GenericProductItem[];

  //for add product to store
  addProductToStoreData: ProductItem[] | null;
  addProductToStoreLoading: boolean;
  addProductToStoreError: string | null;

  //selected barnd
  selectedBrand: null | BrandItem

  //product create and update
  createProductData: null | ProductItem,
  createProductLoading: boolean;
  createProductError: string | null;

  bulkProductUpdateData: null | ProductItem[],
  bulkProductUpdateLoading: boolean;
  bulkProductUpdateError: string | null;
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

  //discounted applied Product list(this is like final list that are in the
  //discount)
  discountAppliedProductList: [],
  offerAppliedProductsList: [],

  //for getting the list of all products ( from all stores)
  allProductList: null,
  allProductPagination: 1,

  //these temporary product list are the selected products when admin 
  // adding the product to his/her store(before confirmaiton).
  tempAddedProductList: [],

  //for add product to store
  addProductToStoreData: null,
  addProductToStoreLoading: false,
  addProductToStoreError: null,

  //selected barnd
  selectedBrand: null,

  //product create and update
  createProductData: null,
  createProductLoading: false,
  createProductError: null,

  bulkProductUpdateData: null,
  bulkProductUpdateLoading: false,
  bulkProductUpdateError: null,
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

    //for setting the final discounted product list
    setDiscountAppliedProductList(state, action: PayloadAction<AddProductOnDiscountPayload[]>) {
      state.discountAppliedProductList = [...state.discountAppliedProductList, ...action.payload];
    },

    // deleteDiscountAppliedProductItem(state, action: PayloadAction<number>) {
    //   state.discountAppliedProductList = state.discountAppliedProductList.filter(
    //     (item) => item !== action.payload
    //   );
    // },
    clearDiscountAppliedProductList(state) {
      state.discountAppliedProductList = [];
    },

    //for selected brand item
    setSelectedBrand(state, action: PayloadAction<BrandItem | null>) {
      state.selectedBrand = action.payload
    },

    //for temporary added products which are the selected products when admin 
    // adding the product to his/her store(before confirmation).
    setTempAddedProducts(state, action: PayloadAction<GenericProductItem>) {
      state.tempAddedProductList = [...state.tempAddedProductList, action.payload]
    },
    updateTempAddedProduct(state, action: PayloadAction<Partial<GenericProductItem>>) {
      state.tempAddedProductList = state.tempAddedProductList.map((item) =>
        item.id === action.payload.id ? {
          ...item, ...action.payload
        } : item
      );
    },
    clearTempAddedProducts(state) {
      state.tempAddedProductList = []
    },
    removeTempAddedProduct(state, action: PayloadAction<number>) {
      state.tempAddedProductList = state.tempAddedProductList.filter(
        (item) => item.id !== action.payload
      );
    },

    //for product create and update state
    clearProductCreadteState(state) {
      state.createProductData = null;
      state.createProductLoading = false;
      state.createProductError = null;
    },
    clearBulkProductUpdateState(state) {
      state.bulkProductUpdateData = null;
      state.bulkProductUpdateLoading = false;
      state.bulkProductUpdateError = null;
    },

  },
  extraReducers: (builder) => {
    builder
      //ge the list of products
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

      //get the products with the filters(page size, search, etc)
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

      //got get the list of product and store them in the discounted product list
      .addCase(getDiscountProductList.fulfilled, (state, action) => {
        state.offerAppliedProductsList = action.payload;
      })

      //addProductOnDiscount  and updateProductOnDiscount success
      .addCase(addProductOnDiscount.fulfilled, (state, action) => {
        state.offerAppliedProductsList = action.payload;
      })
      .addCase(updateProductOnDiscount.fulfilled, (state, action) => {
        state.offerAppliedProductsList = action.payload;
      })

      //for getting the list of all products( from all store)
      .addCase(getAllProducts.pending, (state) => {
        state.productLoading = true
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.allProductList = action.payload.results;
        state.productLoading = false
        state.allProductPagination = action.payload.count;
      })

      //for add product to store
      .addCase(addProductsToStore.pending, (state) => {
        state.addProductToStoreLoading = true
      })
      .addCase(addProductsToStore.fulfilled, (state, action) => {
        state.addProductToStoreData = action.payload;
        state.addProductToStoreLoading = false
      })
      .addCase(addProductsToStore.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.addProductToStoreError = action.payload || "Failed to add product to store";
        state.addProductToStoreLoading = false
      })

      //for creating product on store( adding product to store)
      .addCase(createProduct.pending, (state) => {
        state.createProductLoading = true
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createProductData = action.payload;
        state.createProductLoading = false
        toast.success("Product created successfully")
      })
      .addCase(createProduct.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.createProductError = action.payload || "Failed to create product";
        state.createProductLoading = false
        toast.error(action.payload)
      })

      //for bulk updating product on store( adding product to store)
      .addCase(updateBulkProducts.pending, (state) => {
        state.bulkProductUpdateLoading = true
      })
      .addCase(updateBulkProducts.fulfilled, (state, action) => {
        state.bulkProductUpdateData = action.payload;
        state.bulkProductUpdateLoading = false
        toast.success("Product updated successfully")
      })
      .addCase(updateBulkProducts.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.bulkProductUpdateError = action.payload || "Failed to update product";
        state.bulkProductUpdateLoading = false
        toast.error(action.payload)
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
  addDiscountedProductList,
  clearDiscountProductList,
  setRewardProductList,
  clearRewardProductList,
  updateRewardProductList,
  setDiscountAppliedProductList,
  // deleteDiscountAppliedProductItem,
  clearDiscountAppliedProductList,
  setSelectedBrand,
  //for temporary added product list during adding the new products to the store
  setTempAddedProducts,
  clearTempAddedProducts,
  removeTempAddedProduct,
  updateTempAddedProduct,
  clearProductCreadteState,
  clearBulkProductUpdateState,

} = productSlice.actions;
export default productSlice.reducer;
