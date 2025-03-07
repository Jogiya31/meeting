import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../store/user/userSlice';
import settingsReducer from '../store/settings/settingSlice';
import authReducer from '../store/auth/authrSlice';
import meetingsReducer from '../store/mom/momSlice'
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
  settings: settingsReducer,
  // Reducer for managing meetings
  meetings: meetingsReducer
});

// Export the combined rootReducer
export default rootReducer;
