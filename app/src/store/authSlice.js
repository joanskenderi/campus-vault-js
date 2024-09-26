import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userId: null,
    role: null,
  },
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.userId = null;
    },
    setUserId: (state, { payload }) => {
      state.userId = payload;
    },
    setRole: (state, { payload }) => {
      state.role = payload;
    },
  },
});

export const { login, logout, setUserId, setRole } = authSlice.actions;

export default authSlice.reducer;
