import { createSlice } from '@reduxjs/toolkit';

// Define initial state for meetings slice
const initialState = {
  loader: false,
  data: [],
  meetingData: [],
  success: false,
  message: ''
};

// Create meetings slice using createSlice method
const meetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    // Action to initiate fetching meetings information
    getMeetingsInfo(state) {
      state.loader = true; // Set loader to true while fetching
      // state.data = []; // Clear previous data
    },
    // Action to handle successful retrieval of meetings information
    getMeetingsInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.data = action.payload; // Store received data
    },
    // Action to handle failure in fetching meetings information
    getMeetingsInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to initiate fetching add meetings information
    addMeetingsInfo(state) {
      state.loader = true; // Set loader to true while fetching
      state.meetingData = [];
    },
    // Action to handle successful retrieval of add meetings information
    addMeetingsInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
      state.meetingData = action.payload;
    },
    // Action to handle failure in fetching add meetings information
    addMeetingsInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
      state.meetingData = action.payload;
    },

    // Action to initiate fetching update meetings information
    updateMeetingsInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of update meetings information
    updateMeetingsInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching update meetings information
    updateMeetingsInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to initiate fetching add Attendance information
    addAttendanceInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of add Attendance information
    addAttendanceInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching add Attendance information
    addAttendanceInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to initiate fetching update Attendance information
    updateAttendanceInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of update Attendance information
    updateAttendanceInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching update Attendance information
    updateAttendanceInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to initiate fetching add Discussion information
    addDiscussionInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of add Discussion information
    addDiscussionInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching add Discussion information
    addDiscussionInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to initiate fetching updateDiscussion information
    updateDiscussionInfo(state) {
      state.loader = true; // Set loader to true while fetching
    },
    // Action to handle successful retrieval of updateDiscussion information
    updateDiscussionInfoSuccess(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.success = true; // Set success flag to true
    },
    // Action to handle failure in fetching updateDiscussion information
    updateDiscussionInfoFailed(state, action) {
      state.loader = false; // Set loader to false after fetching
      state.message = action.payload; // Store error message
      state.success = false; // Set success flag to false
    },

    // Action to clear meetings data
    clearData(state) {
      state.data = [];
      state.loader = false; // Set loader to false
      state.success = false; // Set success flag to false
      state.message = ''; // Clear error message
    }
  }
});

// Export meetings actions and reducer
export const meetingsActions = meetingsSlice.actions;
export default meetingsSlice.reducer;
