import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import rootReducer from './rootReducer';

// Create the Redux Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure the Redux store with rootReducer and middleware
const store = configureStore({
  reducer: rootReducer,
  // Use getDefaultMiddleware to include the default middleware and add sagaMiddleware
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(sagaMiddleware),
});

// Run the root Saga
sagaMiddleware.run(rootSaga);

export default store;
