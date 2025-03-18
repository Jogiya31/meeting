import { createSlice } from '@reduxjs/toolkit';

// Define initial state for dashboard slice
const initialState = {
  loader: false,
  data: [],
  success: false,
  message: ''
};

// Create dashboard slice using createSlice method
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Action to initiate fetching dashboard information
    getdashboardInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of dashboard information
    getdashboardInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.data = action.payload; // Store received data
    },
    // Action to handle failure in fetching dashboard information
    getdashboardInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to clear dashboard data
    clearData(state) {
      state.data = [];
      state.loader = false; // Set loader to false
      state.success = false; // Set success flag to false
      state.message = ''; // Clear error message
    }
  }
});

// Export dashboard actions and reducer
export const dashboardActions = dashboardSlice.actions;
export default dashboardSlice.reducer;
