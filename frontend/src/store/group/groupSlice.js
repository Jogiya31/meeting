import { createSlice } from "@reduxjs/toolkit";

// Define initial state for group slice
const initialState = {
  loader: false,
  addloader: false,
  data: [],
  success: false,
  message: "",
};

// Create group slice using createSlice method
const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    // Action to initiate fetching group information
    getGroupInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of Group information
    getGroupInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.data = action.payload; // Store received data
    },
    // Action to handle failure in fetching Group information
    getGroupInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    addGroupInfo(state) {
      state.addloader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of Group information
    addGroupInfoSuccess(state, action) {
      state.addloader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching Group information
    addGroupInfoFailed(state, action) {
      state.addloader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    updateGroupInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of Group information
    updateGroupInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching Group information
    updateGroupInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to clear group data
    clearData(state) {
      state.data = [];
      state.loader = false; // Set loader to false
      state.success = false; // Set success flag to false
      state.message = ""; // Clear error message
    },
  },
});

// Export group actions and reducer
export const groupActions = groupSlice.actions;
export default groupSlice.reducer;
