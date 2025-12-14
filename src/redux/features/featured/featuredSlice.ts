import { createSlice } from "@reduxjs/toolkit";

interface FeaturedState {
  FeaturedItemData: any;
}

// Initial state
const initialState: FeaturedState = {
  FeaturedItemData: null,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder

      ;

  },
});

export const { } = layoutSlice.actions;
export default layoutSlice.reducer;
