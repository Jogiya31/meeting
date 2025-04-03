import { call, put, takeLatest } from 'redux-saga/effects';
import { dashboardActions } from './dashboardSlice';
import { getdashboardinfo } from '../../api/api';

// Saga function to handle fetching dashboard information
function* handledashboardInfo() {
  try {
    // Call the API to fetch dashboard information
    const response = yield call(getdashboardinfo);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(dashboardActions.getdashboardInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(dashboardActions.getdashboardInfoFailed(error.message)); // Dispatch failure action
  }
}

// Watcher saga to take latest action of fetching dashboard information
export default function* dashboardSaga() {
  yield takeLatest(dashboardActions.getdashboardInfo.type, handledashboardInfo);
}
