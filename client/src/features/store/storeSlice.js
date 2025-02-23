
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stores: [],
  store: {},
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setStores: (state, action) => {
      state.stores = action.payload;
    },
    setStore: (state, action) => {
      state.store = action.payload;
    },
  },
});

export const { setStores, setStore } = storeSlice.actions;
export default storeSlice.reducer;
