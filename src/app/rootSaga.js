import { all } from 'redux-saga/effects';
import userSaga from '../store/user/userSaga';
import settingsSaga from '../store/settings/settingSaga';
import authSaga from '../store/auth/authSaga';
import MeetingsSaga from '../store/mom/momSaga';

/**
 * used to allow a Redux store to interact with resources itself asynchronously
 **/
// Define the rootSaga generator function
export default function* rootSaga() {
  // Use the 'all' effect to run multiple sagas concurrently
  yield all([
    // Call and run the auth
    authSaga(),
    // Call and run the userSaga
    userSaga(),
    // Call and run the userSaga
    settingsSaga(),
    // Call and run the userSaga
    MeetingsSaga()
  ]);
}
