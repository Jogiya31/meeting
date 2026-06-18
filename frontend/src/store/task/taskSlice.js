import { createSlice } from "@reduxjs/toolkit";

// Define initial state for task slice
const initialState = {
  loader: false,
  addloader: false,
  data: [],
  success: false,
  message: "",
};

// Create task slice using createSlice method
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    // Action to initiate fetching task information
    getTaskInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of Task information
    getTaskInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.data = action.payload; // Store received data
    },
    // Action to handle failure in fetching Task information
    getTaskInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    addTaskInfo(state) {
      state.addloader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of Task information
    addTaskInfoSuccess(state, action) {
      state.addloader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching Task information
    addTaskInfoFailed(state, action) {
      state.addloader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    updateTaskInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of Task information
    updateTaskInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching Task information
    updateTaskInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to clear task data
    clearData(state) {
      state.data = [];
      state.loader = false; // Set loader to false
      state.success = false; // Set success flag to false
      state.message = ""; // Clear error message
    },
  },
});

// Export task actions and reducer
export const taskActions = taskSlice.actions;
export default taskSlice.reducer;
