import {
  getCategories,
  getStoreCategories,
} from "@/redux/features/category/category";
import {
  CategoryItem,
  MainCategoryItem,
} from "@/redux/features/category/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  categoryData: CategoryItem[] | null;
  storeCategoryData: CategoryItem[] | null;
  categoryLoading: boolean;
  storeCategoryLoading: boolean;
  categoryError: string | null;
}

// Initial state
const initialState: CategoryState = {
  categoryData: null,
  storeCategoryData: null,
  categoryLoading: false,
  storeCategoryLoading: false,
  categoryError: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryState(state) {
      state.categoryData = null;
      state.categoryLoading = false;
      state.categoryError = null;
    },
    clearStoreCategoryState(state) {
      state.storeCategoryData = null;
      state.storeCategoryLoading = false;
      state.categoryError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // All Category categories list
      .addCase(getCategories.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categoryData = action.payload;
        state.categoryError = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categoryData = null;
        state.categoryLoading = false;
        state.categoryError = action.payload || "Failed to fetch categories";
      })

      // Store Category Cases
      .addCase(getStoreCategories.pending, (state) => {
        state.storeCategoryLoading = true;
        state.categoryError = null;
      })
      .addCase(getStoreCategories.fulfilled, (state, action) => {
        state.storeCategoryLoading = false;
        state.storeCategoryData = action.payload;
        state.categoryError = null;
      })
      .addCase(getStoreCategories.rejected, (state, action) => {
        state.storeCategoryData = null;
        state.storeCategoryLoading = false;
        state.categoryError =
          action.payload || "Failed to fetch store categories";
      });
  },
});

export const { clearCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
