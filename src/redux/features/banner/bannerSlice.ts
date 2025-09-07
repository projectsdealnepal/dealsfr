import {
  createBanner,
  deleteBanner,
  getBanner,
  updateBanner,
} from "@/redux/features/banner/banner";
import { BannerItem } from "@/redux/features/banner/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface BannerState {
  bannerStateLoading: boolean;

  bannerData: BannerItem[] | null;
  bannerError: string | null;

  bannerCreateData: BannerItem[] | null;
  bannerCreateError: string | null;

  bannerUpdateData: BannerItem | null;
  bannerUpdateError: string | null;

  bannerDeleteData: BannerItem[] | null;
  bannerDeleteError: string | null;
}

// Initial state
const initialState: BannerState = {
  bannerStateLoading: false,

  bannerData: null,
  bannerError: null,

  bannerCreateData: null,
  bannerCreateError: null,

  bannerUpdateData: null,
  bannerUpdateError: null,

  bannerDeleteData: null,
  bannerDeleteError: null,
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    clearBannerState(state) {
      state.bannerError = null;
      state.bannerData = null;
      state.bannerStateLoading = false;
    },
    clearBannerCreateState(state) {
      state.bannerCreateData = null;
      state.bannerCreateError = null;
    },
    clearBannerUpdateState(state) {
      state.bannerUpdateData = null;
      state.bannerUpdateError = null;
    },
    clearBannerDeleteState(state) {
      state.bannerDeleteData = null;
      state.bannerDeleteError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getBanner.pending, (state) => {
        state.bannerStateLoading = true;
        state.bannerError = null;
      })
      .addCase(getBanner.fulfilled, (state, action) => {
        state.bannerStateLoading = false;
        state.bannerData = action.payload;
        state.bannerError = null;
      })
      .addCase(
        getBanner.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.bannerData = null;
          state.bannerStateLoading = false;
          state.bannerError = action.payload || "Failed to fetch banners";
        }
      )

      //create
      .addCase(createBanner.pending, (state) => {
        state.bannerStateLoading = true;
        state.bannerCreateError = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.bannerStateLoading = false;
        state.bannerCreateData = action.payload;
        state.bannerData = action.payload;
        state.bannerCreateError = null;
      })
      .addCase(
        createBanner.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.bannerStateLoading = false;
          state.bannerCreateData = null;
          state.bannerCreateError =
            action.payload || "Failed to create Banners";
        }
      )
      //update
      .addCase(updateBanner.pending, (state) => {
        state.bannerStateLoading = true;
        state.bannerUpdateError = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.bannerStateLoading = false;
        state.bannerUpdateData = action.payload;
        if (state.bannerData) {
          const index = state.bannerData.findIndex(
            (b) => b.id === action.payload.id
          );
          if (index !== -1) {
            state.bannerData[index] = action.payload;
          }
        }
        state.bannerUpdateError = null;
      })
      .addCase(
        updateBanner.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.bannerStateLoading = false;
          state.bannerUpdateData = null;
          state.bannerUpdateError =
            action.payload || "Failed to update Banner";
        }
      )

      //delete
      .addCase(deleteBanner.pending, (state) => {
        state.bannerStateLoading = true;
        state.bannerDeleteError = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.bannerStateLoading = false;
        state.bannerData = action.payload;
        state.bannerDeleteData = action.payload;
        state.bannerDeleteError = null;
      })
      .addCase(
        deleteBanner.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.bannerStateLoading = false;
          state.bannerDeleteData = null;
          state.bannerDeleteError =
            action.payload || "Failed to delete Banner";
        }
      );
  },
});

export const {
  clearBannerState,
  clearBannerCreateState,
  clearBannerUpdateState,
  clearBannerDeleteState,
} = bannerSlice.actions;
export default bannerSlice.reducer;
