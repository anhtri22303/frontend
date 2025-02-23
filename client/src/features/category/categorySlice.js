
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  category: {},
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const { setCategories, setCategory } = categorySlice.actions;
export default categorySlice.reducer;
