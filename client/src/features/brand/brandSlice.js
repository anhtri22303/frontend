
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brands: [],
  brand: {},
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setBrand: (state, action) => {
      state.brand = action.payload;
    },
  },
});

export const { setBrands, setBrand } = brandSlice.actions;
export default brandSlice.reducer;
