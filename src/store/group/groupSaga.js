import { call, put, takeLatest } from 'redux-saga/effects';
import { groupActions } from './groupSlice';
import { AddGroupDetails, GetGroupDetails, UpdateGroup } from 'api/api';

// Saga function to handle fetching Group information
function* handleGroupInfo(data) {
  try {
    // Call the API to fetch Group information
    const response = yield call(GetGroupDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(groupActions.getGroupInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(groupActions.getGroupInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Group information
function* handleAddGroupInfo(data) {
  try {
    // Call the API to fetch Group information
    const response = yield call(AddGroupDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(groupActions.addGroupInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(groupActions.addGroupInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Group information
function* handleUpdateGroupInfo(data) {
  try {
    // Call the API to fetch Group information
    const response = yield call(UpdateGroup, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(groupActions.updateGroupInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(groupActions.updateGroupInfoFailed(error.message)); // Dispatch failure action
  }
}

// Watcher saga to take latest action of fetching user information
export default function* groupSaga() {
  yield takeLatest(groupActions.getGroupInfo.type, handleGroupInfo);
  yield takeLatest(groupActions.addGroupInfo.type, handleAddGroupInfo);
  yield takeLatest(groupActions.updateGroupInfo.type, handleUpdateGroupInfo);
}
