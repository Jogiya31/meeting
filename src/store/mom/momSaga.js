import { call, put, takeLatest } from 'redux-saga/effects';
import { meetingsActions } from './momSlice';
import {
  addAttendanceDetails,
  addDiscussionDetails,
  addMeetingsDetails,
  deleteAttendanceDetails,
  deleteDiscussionDetails,
  getMeetings,
  updateAttendanceDetails,
  updateDiscussionDetails,
  updateMeetingsDetails
} from '../../api/api';
import { toast } from 'react-toastify';

// Saga function to handle fetching Meetings information
function* handleMeetingsInfo(data) {
  try {
    // Call the API to fetch Meetings information
    const response = yield call(getMeetings, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(meetingsActions.getMeetingsInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(meetingsActions.getMeetingsInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching add Meetings information
function* handleAddMeetingsInfo(data) {
  try {
    // Call the API to fetch add Meetings information
    const response = yield call(addMeetingsDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(meetingsActions.addMeetingsInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(meetingsActions.addMeetingsInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching add Meetings information
function* handleUpdateMeetingsInfo(data) {
  try {
    // Call the API to fetch update Meetings information
    const response = yield call(updateMeetingsDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(meetingsActions.updateMeetingsInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(meetingsActions.updateMeetingsInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching add Attendance information
function* handleAddAttendanceInfo(data) {
  try {
    // Call the API to fetch add Attendance information
    const response = yield call(addAttendanceDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(meetingsActions.addAttendanceInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(meetingsActions.addAttendanceInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching update Attendance information
function* handleUpdateAttendanceInfo(data) {
  try {
    // Call the API to fetch update Attendance information
    const response = yield call(updateAttendanceDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(meetingsActions.updateAttendanceInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(meetingsActions.updateAttendanceInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching add Discussion information
function* handleAddDiscussionInfo(data) {
  try {
    // Call the API to fetch add Discussion information
    const response = yield call(addDiscussionDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(meetingsActions.addDiscussionInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(meetingsActions.addDiscussionInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching update Discussion information
function* handleupdateDiscussionInfo(data) {
  try {
    // Call the API to fetch update Discussion information
    const response = yield call(updateDiscussionDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(meetingsActions.updateDiscussionInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(meetingsActions.updateDiscussionInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching delete Attendance information
function* handledeleteAttendanceInfo(data) {
  try {
    // Call the API to fetch delete Attendance information
    const response = yield call(deleteAttendanceDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(meetingsActions.deleteAttendanceInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(meetingsActions.deleteAttendanceInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching delete Discussion information
function* handledeleteDiscussionInfo(data) {
  try {
    // Call the API to fetch delete Discussion information
    const response = yield call(deleteDiscussionDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(meetingsActions.deleteDiscussionInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(meetingsActions.deleteDiscussionInfoFailed(error.message)); // Dispatch failure action
  }
}

// Watcher saga to take latest action of fetching Meetings information
export default function* MeetingsSaga() {
  yield takeLatest(meetingsActions.getMeetingsInfo.type, handleMeetingsInfo);
  yield takeLatest(meetingsActions.addMeetingsInfo.type, handleAddMeetingsInfo);
  yield takeLatest(meetingsActions.updateMeetingsInfo.type, handleUpdateMeetingsInfo);
  yield takeLatest(meetingsActions.addAttendanceInfo.type, handleAddAttendanceInfo);
  yield takeLatest(meetingsActions.updateAttendanceInfo.type, handleUpdateAttendanceInfo);
  yield takeLatest(meetingsActions.addDiscussionInfo.type, handleAddDiscussionInfo);
  yield takeLatest(meetingsActions.updateDiscussionInfo.type, handleupdateDiscussionInfo);
  yield takeLatest(meetingsActions.deleteAttendanceInfo.type, handledeleteAttendanceInfo);
  yield takeLatest(meetingsActions.deleteDiscussionInfo.type, handledeleteDiscussionInfo);
}
