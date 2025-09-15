import {
  getCategories,
} from "@/redux/features/category/category";
import {
  CategoryItem,
  MainCategoryItem,
} from "@/redux/features/category/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  categoryData: CategoryItem[] | null;
  categoryLoading: boolean;
  categoryError: string | null;
}

// Initial state
const initialState: CategoryState = {
  categoryData: null,
  categoryLoading: false,
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
  },
  extraReducers: (builder) => {
    builder
      // Main Category Cases
      .addCase(getCategories.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categoryData = action.payload;
        state.categoryError = null;
      })
      .addCase(
        getCategories.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.categoryData = null;
          state.categoryLoading = false;
          state.categoryError =
            action.payload || "Failed to fetch categories";
        }
      )
  },
});

export const { clearCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
