import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../store/user/userSlice';
import settingsReducer from '../store/settings/settingSlice';
import authReducer from '../store/auth/authrSlice';
/**
 * here we combine all pages reducer for gets update redux state
 **/
// Combine multiple reducers into a single rootReducer
const rootReducer = combineReducers({
  // Reducer for managing auth
  auth: authReducer,
  // Reducer for managing user
  users: userReducer,
  // Reducer for managing settings
  settings: settingsReducer
});

// Export the combined rootReducer
export default rootReducer;
