import { call, put, takeLatest } from 'redux-saga/effects';
import { authActions } from './authrSlice';
import { toast } from 'react-toastify';
import { authInfo } from '../../api/api';

// Saga function to handle fetching auth information
function* handleauthInfo(data) {
  try {
    // Call the API to fetch auth information
    const response = yield call(authInfo, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(authActions.getauthInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(authActions.getauthInfoFailed(error.message)); // Dispatch failure action
  }
}

// Watcher saga to take latest action of fetching auth information
export default function* authSaga() {
  yield takeLatest(authActions.getauthInfo.type, handleauthInfo);
}
