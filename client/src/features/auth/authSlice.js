
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, { payload }) => {
      state.user = payload;
    },
  },
});

export const { addUser } = authSlice.actions;
export default authSlice.reducer;
