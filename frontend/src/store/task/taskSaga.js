import { call, put, takeLatest } from 'redux-saga/effects';
import { taskActions } from './taskSlice';
import { AddTaskDetails, GetTaskDetails, UpdateTask } from 'api/api';
import { toast } from 'react-toastify';

// Saga function to handle fetching Task information
function* handleTaskInfo(data) {
  try {
    // Call the API to fetch Task information
    const response = yield call(GetTaskDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(taskActions.getTaskInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(taskActions.getTaskInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Task information
function* handleAddTaskInfo(data) {
  try {
    // Call the API to fetch Task information
    const response = yield call(AddTaskDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(taskActions.addTaskInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(taskActions.addTaskInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Task information
function* handleUpdateTaskInfo(data) {
  try {
    // Call the API to fetch Task information
    const response = yield call(UpdateTask, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(taskActions.updateTaskInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(taskActions.updateTaskInfoFailed(error.message)); // Dispatch failure action
  }
}

// Watcher saga to take latest action of fetching user information
export default function* taskSaga() {
  yield takeLatest(taskActions.getTaskInfo.type, handleTaskInfo);
  yield takeLatest(taskActions.addTaskInfo.type, handleAddTaskInfo);
  yield takeLatest(taskActions.updateTaskInfo.type, handleUpdateTaskInfo);
}
