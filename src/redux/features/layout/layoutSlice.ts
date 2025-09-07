import {
  createLayout,
  deleteLayout,
  getLayout,
  updateLayout,
} from "@/redux/features/layout/layout";
import { LayoutItem } from "@/redux/features/layout/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
  layoutStateLoading: boolean;
  layoutData: LayoutItem[] | null;
  layoutError: string | null;

  layoutCreateData: LayoutItem[] | null;
  layoutCreateError: string | null;

  layoutUpdateData: LayoutItem | null;
  layoutUpdateError: string | null;

  layoutDeleteData: LayoutItem[] | null;
  layoutDeleteError: string | null;
}

// Initial state
const initialState: LayoutState = {
  layoutStateLoading: false,
  layoutData: null,
  layoutError: null,

  layoutCreateData: null,
  layoutCreateError: null,

  layoutUpdateData: null,
  layoutUpdateError: null,

  layoutDeleteData: null,
  layoutDeleteError: null,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    clearLayoutState(state) {
      state.layoutError = null;
      state.layoutData = null;
      state.layoutStateLoading = false;
    },
    clearLayoutCreateState(state) {
      state.layoutCreateData = null;
      state.layoutCreateError = null;
    },
    clearLayoutUpdateState(state) {
      state.layoutUpdateData = null;
      state.layoutUpdateError = null;
    },
    clearLayoutDeleteState(state) {
      state.layoutDeleteData = null;
      state.layoutDeleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLayout.pending, (state) => {
        state.layoutStateLoading = true;
        state.layoutError = null;
      })
      .addCase(getLayout.fulfilled, (state, action) => {
        state.layoutStateLoading = false;
        state.layoutData = action.payload;
        state.layoutError = null;
      })
      .addCase(
        getLayout.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.layoutData = null;
          state.layoutStateLoading = false;
          state.layoutError = action.payload || "Failed to fetch layout";
        }
      )
      .addCase(createLayout.pending, (state) => {
        state.layoutStateLoading = true;
        state.layoutCreateError = null;
      })
      .addCase(createLayout.fulfilled, (state, action) => {
        state.layoutStateLoading = false;
        state.layoutCreateData = action.payload;
        state.layoutCreateError = null;
      })
      .addCase(
        createLayout.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.layoutStateLoading = false;
          state.layoutCreateData = null;
          state.layoutCreateError = action.payload || "Failed to create layout";
        }
      )
      .addCase(updateLayout.pending, (state) => {
        state.layoutStateLoading = true;
        state.layoutUpdateError = null;
      })
      .addCase(updateLayout.fulfilled, (state, action) => {
        state.layoutStateLoading = false;
        state.layoutUpdateData = action.payload;
        if (state.layoutData) {
          const index = state.layoutData.findIndex(
            (l) => l.id === action.payload.id
          );
          if (index !== -1) {
            state.layoutData[index] = action.payload;
          }
        }
        state.layoutUpdateError = null;
      })
      .addCase(
        updateLayout.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.layoutStateLoading = false;
          state.layoutUpdateData = null;
          state.layoutUpdateError = action.payload || "Failed to update layout";
        }
      )
      .addCase(deleteLayout.pending, (state) => {
        state.layoutStateLoading = true;
        state.layoutDeleteError = null;
      })
      .addCase(deleteLayout.fulfilled, (state, action) => {
        state.layoutStateLoading = false;
        state.layoutDeleteData = action.payload;
        state.layoutData = action.payload;
        state.layoutDeleteError = null;
      })
      .addCase(
        deleteLayout.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.layoutStateLoading = false;
          state.layoutDeleteData = null;
          state.layoutDeleteError = action.payload || "Failed to delete layout";
        }
      );
  },
});

export const {
  clearLayoutState,
  clearLayoutCreateState,
  clearLayoutUpdateState,
  clearLayoutDeleteState,
} = layoutSlice.actions;
export default layoutSlice.reducer;
