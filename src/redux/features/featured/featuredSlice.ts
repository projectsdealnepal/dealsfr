import { createSlice } from "@reduxjs/toolkit";

interface FeaturedState {
}

// Initial state
const initialState: FeaturedState = {
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
