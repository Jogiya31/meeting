import { call, put, takeLatest } from 'redux-saga/effects';
import { meetingsActions } from './momSlice';
import { allMeetingsInfo } from '../../api/api';
import { toast } from 'react-toastify';

// Saga function to handle fetching Meetings information
function* handleMeetingsInfo(data) {
  try {
    // Call the API to fetch Meetings information
    const response = yield call(allMeetingsInfo, data);
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
    const response = yield call(addMeetingsInfo, data);
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

// Watcher saga to take latest action of fetching Meetings information
export default function* MeetingsSaga() {
  yield takeLatest(meetingsActions.getMeetingsInfo.type, handleMeetingsInfo);
  yield takeLatest(meetingsActions.addMeetingsInfo.type, handleAddMeetingsInfo);
}
