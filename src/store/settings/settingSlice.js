import { createSlice } from '@reduxjs/toolkit';

// Define initial state for settings slice
const initialState = {
  loader: false,
  designationData: [],
  divisionData: [],
  employeementData: [],
  organizationData: [],
  success: false,
  message: ''
};

// Create settings slice using createSlice method
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Action to initiate fetching designation information
    getDesignationInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of designation information
    getDesignationInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.designationData = action.payload; // Store received data
    },
    // Action to handle failure in fetching designation information
    getDesignationInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to initiate fetching designation information
    addDesignationInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of designation information
    addDesignationInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching designation information
    addDesignationInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to initiate fetching designation information
    updateDesignationInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of designation information
    updateDesignationInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.designationData = action.payload; // Store received data
    },
    // Action to handle failure in fetching designation information
    updateDesignationInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to initiate fetching division information
    getDivisionInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of division information
    getDivisionInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.divisionData = action.payload; // Store received data
    },
    // Action to handle failure in fetching division information
    getDivisionInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to initiate fetching division information
    addDivisionInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of division information
    addDivisionInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching division information
    addDivisionInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to initiate fetching division information
    updateDivisionInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of division information
    updateDivisionInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.divisionData = action.payload; // Store received data
    },
    // Action to handle failure in fetching division information
    updateDivisionInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to initiate fetching employeement information
    getEmployeementInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of employeement information
    getEmployeementInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.employeementData = action.payload; // Store received data
    },
    // Action to handle failure in fetching employeement information
    getEmployeementInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to initiate fetching employeement information
    addEmployeementInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of employeement information
    addEmployeementInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.employeementData = action.payload; // Store received data
    },
    // Action to handle failure in fetching employeement information
    addEmployeementInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to initiate fetching employeement information
    updateEmployeementInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of employeement information
    updateEmployeementInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.employeementData = action.payload; // Store received data
    },
    // Action to handle failure in fetching employeement information
    updateEmployeementInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to initiate fetching organization information
    getOrganizationInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of organization information
    getOrganizationInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.organizationData = action.payload; // Store received data
    },
    // Action to handle failure in fetching organization information
    getOrganizationInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to initiate fetching organization information
    addOrganizationInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of organization information
    addOrganizationInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.organizationData = action.payload; // Store received data
    },
    // Action to handle failure in fetching organization information
    addOrganizationInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },
    // Action to initiate fetching organization information
    updateOrganizationInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of organization information
    updateOrganizationInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.organizationData = action.payload; // Store received data
    },
    // Action to handle failure in fetching organization information
    updateOrganizationInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to clear settings data
    clearData(state) {
      state.designationData = [];
      state.divisionData = [];
      state.employeementData = [];
      state.organizationData = [];
      state.loader = false; // Set loader to false
      state.success = false; // Set success flag to false
      state.message = ''; // Clear error message
    }
  }
});

// Export settings actions and reducer
export const settingsActions = settingsSlice.actions;
export default settingsSlice.reducer;
