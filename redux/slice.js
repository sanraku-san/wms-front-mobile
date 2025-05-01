import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      login: (state, action) => {
        console.log('Redux login action triggered'); // DEBUG
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      },
      logout: (state) => {
        console.log('Redux logout action triggered'); // DEBUG
        state.isAuthenticated = false;
        state.token = null; 
        state.user = null;
      },
      // ... other reducers
    }
  });

export const { login, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
