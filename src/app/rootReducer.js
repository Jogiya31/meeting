import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../store/user/userSlice";
/**
 * here we combine all pages reducer for gets update redux state
 **/
// Combine multiple reducers into a single rootReducer
const rootReducer = combineReducers({
  // Reducer for managing user
  users : userReducer
});

// Export the combined rootReducer
export default rootReducer;
