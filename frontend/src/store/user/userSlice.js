import { createSlice } from "@reduxjs/toolkit";

// Define initial state for user slice
const initialState = {
  loader: false,
  addloader: false,
  data: [],
  success: false,
  message: "",
};

// Create user slice using createSlice method
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Action to initiate fetching user information
    getuserInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of user information
    getuserInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.data = action.payload; // Store received data
    },
    // Action to handle failure in fetching user information
    getuserInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    adduserInfo(state) {
      state.addloader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of user information
    adduserInfoSuccess(state, action) {
      state.addloader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching user information
    adduserInfoFailed(state, action) {
      state.addloader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    updateuserInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of user information
    updateuserInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching user information
    updateuserInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to clear user data
    clearData(state) {
      state.data = [];
      state.loader = false; // Set loader to false
      state.success = false; // Set success flag to false
      state.message = ""; // Clear error message
    },
  },
});

// Export user actions and reducer
export const userActions = userSlice.actions;
export default userSlice.reducer;
