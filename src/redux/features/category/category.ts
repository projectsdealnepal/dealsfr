import api from "@/lib/interceptor";
import {
  CategoryItem,
  MainCategoryItem,
  SubCategoryItem,
} from "@/redux/features/category/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

// Get Category List
export const getCategories = createAsyncThunk<
  CategoryItem[],
  void,
  { rejectValue: string }
>("category/mainCategory/get", async (_, thunkAPI) => {
  try {
    const response = await api.get("/products/categories/");
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch main categories"
    );
  }
});

// Get store Category List
// https://api.thedealsfr.com/api/v1/admin/products/{store_pk}/category-by-store/
export const getStoreCategories = createAsyncThunk<
  CategoryItem[],
  { store_pk: number },
  { rejectValue: string }
>("category/storeCategory/get", async ({ store_pk }, thunkAPI) => {
  try {
    const response = await api.get(`/products/${store_pk}/category-by-store/`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch store categories list"
    );
  }
});
// Create Main Category
export const createMainCategory = createAsyncThunk<
  MainCategoryItem[],
  FormData,
  { rejectValue: string }
>("category/mainCategory/create", async (categoryData, thunkAPI) => {
  try {
    const response = await api.post("/main-categories/", categoryData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to create main category"
    );
  }
});

// Update Main Category
export const updateMainCategory = createAsyncThunk<
  AxiosResponse<MainCategoryItem>,
  { id: string; categoryData: FormData },
  { rejectValue: string }
>("category/mainCategory/update", async ({ id, categoryData }, thunkAPI) => {
  try {
    const response = await api.patch(`/main-categories/${id}`, categoryData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to update main category"
    );
  }
});

// Delete Main Category
export const deleteMainCategory = createAsyncThunk<
  AxiosResponse<void>,
  string,
  { rejectValue: string }
>("category/mainCategory/delete", async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/main-categories/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete main category"
    );
  }
});

//================================================================
//FOR SUB CATEGORY
//================================================================

// Get Sub Category
export const getSubCategory = createAsyncThunk<
  SubCategoryItem[],
  void,
  { rejectValue: string }
>("category/subCategory/get", async (_, thunkAPI) => {
  try {
    const response = await api.get("/sub-categories/", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch sub categories"
    );
  }
});

// Create Sub Category
export const createSubCategory = createAsyncThunk<
  AxiosResponse<SubCategoryItem>,
  FormData,
  { rejectValue: string }
>("category/subCategory/create", async (categoryData, thunkAPI) => {
  try {
    const response = await api.post("/sub-categories/", categoryData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to create sub category"
    );
  }
});

// Update Sub Category
export const updateSubCategory = createAsyncThunk<
  AxiosResponse<SubCategoryItem>,
  { id: string; categoryData: FormData },
  { rejectValue: string }
>("category/subCategory/update", async ({ id, categoryData }, thunkAPI) => {
  try {
    const response = await api.put(`/sub-categories/${id}`, categoryData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to update sub category"
    );
  }
});

// Delete Sub Category
export const deleteSubCategory = createAsyncThunk<
  AxiosResponse<void>,
  string,
  { rejectValue: string }
>("category/subCategory/delete", async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/sub-categories/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete sub category"
    );
  }
});
