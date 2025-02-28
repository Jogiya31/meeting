import { call, put, takeLatest } from 'redux-saga/effects';
import { userActions } from './userSlice';
import { alluserInfo } from '../../api/api';
import { toast } from 'react-toastify';

// Saga function to handle fetching user information
function* handleuserInfo(data) {
  try {
    // Call the API to fetch user information
    const response = yield call(alluserInfo, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(userActions.getuserInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(userActions.getuserInfoFailed(error.message)); // Dispatch failure action
  }
}

// Watcher saga to take latest action of fetching user information
export default function* userSaga() {
  yield takeLatest(userActions.getuserInfo.type, handleuserInfo);
}
