import { createSlice } from "@reduxjs/toolkit";

// Define initial state for auth slice
const initialState = {
  loader: false,
  data: [],
  success: false,
  message: "",
};

// Create auth slice using createSlice method
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to initiate fetching auth information
    getauthInfo(state) {
      state.loader = true; // Set loader to true while fetching
      state.data = []; // Clear previous data
    },
    // Action to handle successful retrieval of auth information
    getauthInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.data = action.payload; // Store received data
    },
    // Action to handle failure in fetching auth information
    getauthInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to clear auth data
    clearData(state) {
      state.data = [];
      state.loader = false; // Set loader to false
      state.success = false; // Set success flag to false
      state.message = ""; // Clear error message
    },
  },
});

// Export auth actions and reducer
export const authActions = authSlice.actions;
export default authSlice.reducer;
