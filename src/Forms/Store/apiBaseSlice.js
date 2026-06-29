// store/apiBaseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const apiBaseSlice = createSlice({
  name: "apiBase",
  initialState: {
    value: "", // This will store the selected backend API
  },
  reducers: {
    setApiBase: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setApiBase } = apiBaseSlice.actions;
export default apiBaseSlice.reducer;
