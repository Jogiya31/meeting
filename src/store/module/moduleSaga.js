import { call, put, takeLatest } from 'redux-saga/effects';
import { moduleActions } from './moduleSlice';
import { AddModuleDetails, GetModuleDetails, UpdateModule } from 'api/api';

// Saga function to handle fetching Module information
function* handleModuleInfo(data) {
  try {
    // Call the API to fetch Module information
    const response = yield call(GetModuleDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(moduleActions.getModuleInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(moduleActions.getModuleInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Module information
function* handleAddModuleInfo(data) {
  try {
    // Call the API to fetch Module information
    const response = yield call(AddModuleDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(moduleActions.addModuleInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(moduleActions.addModuleInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Module information
function* handleUpdateModuleInfo(data) {
  try {
    // Call the API to fetch Module information
    const response = yield call(UpdateModule, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(moduleActions.updateModuleInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(moduleActions.updateModuleInfoFailed(error.message)); // Dispatch failure action
  }
}

// Watcher saga to take latest action of fetching user information
export default function* moduleSaga() {
  yield takeLatest(moduleActions.getModuleInfo.type, handleModuleInfo);
  yield takeLatest(moduleActions.addModuleInfo.type, handleAddModuleInfo);
  yield takeLatest(moduleActions.updateModuleInfo.type, handleUpdateModuleInfo);
}
