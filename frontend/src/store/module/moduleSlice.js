import { createSlice } from "@reduxjs/toolkit";

// Define initial state for module slice
const initialState = {
  loader: false,
  addloader: false,
  data: [],
  success: false,
  message: "",
};

// Create module slice using createSlice method
const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    // Action to initiate fetching module information
    getModuleInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of Module information
    getModuleInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.data = action.payload; // Store received data
    },
    // Action to handle failure in fetching Module information
    getModuleInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    addModuleInfo(state) {
      state.addloader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of Module information
    addModuleInfoSuccess(state, action) {
      state.addloader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching Module information
    addModuleInfoFailed(state, action) {
      state.addloader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    updateModuleInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of Module information
    updateModuleInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching Module information
    updateModuleInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to clear module data
    clearData(state) {
      state.data = [];
      state.loader = false; // Set loader to false
      state.success = false; // Set success flag to false
      state.message = ""; // Clear error message
    },
  },
});

// Export module actions and reducer
export const moduleActions = moduleSlice.actions;
export default moduleSlice.reducer;
