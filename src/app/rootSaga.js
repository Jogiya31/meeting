import { all } from "redux-saga/effects";
import userSaga from "../store/user/userSaga";

/**
 * used to allow a Redux store to interact with resources itself asynchronously
 **/
// Define the rootSaga generator function
export default function* rootSaga() {
  // Use the 'all' effect to run multiple sagas concurrently
  yield all([
    // Call and run the userSaga
    userSaga(),
  ]);
}
