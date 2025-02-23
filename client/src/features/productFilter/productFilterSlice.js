
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterCredentials: {},
};

const productFilter = createSlice({
  name: "productFilter",
  initialState,
  reducers: {
    addProductFilter: (state, { payload }) => {
      const [filterType, filterItems] = payload;
      state.filterCredentials = {
        ...state.filterCredentials,
        [filterType]: filterItems,
      };
    },

    clearProductFilter: (state) => {
      state.filterCredentials = {};
    },
  },
});

export const { addProductFilter, clearProductFilter } = productFilter.actions;
export default productFilter.reducer;
