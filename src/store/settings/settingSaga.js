import { call, put, takeLatest } from 'redux-saga/effects';
import { settingsActions } from './settingSlice';
import {
  AddDesignationDetails,
  AddDivisionDetails,
  AddEmployementDetails,
  AddOrganisationDetails,
  GetDesignationDetails,
  GetDivisionDetails,
  GetEmployementDetails,
  GetOrganisationDetails,
  UpdateDesignation,
  UpdateDivision,
  UpdateEmployement,
  UpdateOrganisation
} from '../../api/api';
import { toast } from 'react-toastify';

// Saga function to handle fetching Designation information
function* handleDesignationInfo(data) {
  try {
    // Call the API to fetch Designation information
    const response = yield call(GetDesignationDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.getDesignationInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.getDesignationInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Designation information
function* handleAddDesignationInfo(data) {
  try {
    // Call the API to fetch Designation information
    const response = yield call(AddDesignationDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.addDesignationInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.addDesignationInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Designation information
function* handleUpdateDesignationInfo(data) {
  try {
    // Call the API to fetch Designation information
    const response = yield call(UpdateDesignation, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.updateDesignationInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.updateDesignationInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching Division information
function* handleDivisionInfo(data) {
  try {
    // Call the API to fetch Division information
    const response = yield call(GetDivisionDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.getDivisionInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.getDivisionInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Division information
function* handleAddDivisionInfo(data) {
  try {
    // Call the API to fetch Division information
    const response = yield call(AddDivisionDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.addDivisionInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.addDivisionInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Division information
function* handleUpdateDivisionInfo(data) {
  try {
    // Call the API to fetch Division information
    const response = yield call(UpdateDivision, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.updateDivisionInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.updateDivisionInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching Employeement information
function* handleEmployeementInfo(data) {
  try {
    // Call the API to fetch Employeement information
    const response = yield call(GetEmployementDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.getEmployeementInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.getEmployeementInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Employeement information
function* handleAddEmployeementInfo(data) {
  try {
    // Call the API to fetch Employeement information
    const response = yield call(AddEmployementDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.addEmployeementInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.addEmployeementInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Employeement information
function* handleUpdateEmployeementInfo(data) {
  try {
    // Call the API to fetch Employeement information
    const response = yield call(UpdateEmployement, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.updateEmployeementInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.updateEmployeementInfoFailed(error.message)); // Dispatch failure action
  }
}

// Saga function to handle fetching Organization information
function* handleOrganizationInfo(data) {
  try {
    // Call the API to fetch Organization information
    const response = yield call(GetOrganisationDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.getOrganizationInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.getOrganizationInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Organization information
function* handleAddOrganizationInfo(data) {
  try {
    // Call the API to fetch Organization information
    const response = yield call(AddOrganisationDetails, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.addOrganizationInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.addOrganizationInfoFailed(error.message)); // Dispatch failure action
  }
}
// Saga function to handle fetching Organization information
function* handleUpdateOrganizationInfo(data) {
  try {
    // Call the API to fetch Organization information
    const response = yield call(UpdateOrganisation, data);
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      // If successful, dispatch success action with received data
      const data = response.data;
      yield put(settingsActions.updateOrganizationInfoSuccess(data || []));
    } else {
      // If response status is not 200, throw an error
      throw new Error('Something went wrong');
    }
  } catch (error) {
    // If an error occurs during the process, handle it
    toast.error(error.message); // Display error message using toast
    yield put(settingsActions.updateOrganizationInfoFailed(error.message)); // Dispatch failure action
  }
}

// Watcher saga to take latest action of fetching user information
export default function* settingsSaga() {
  yield takeLatest(settingsActions.getDesignationInfo.type, handleDesignationInfo);
  yield takeLatest(settingsActions.addDesignationInfo.type, handleAddDesignationInfo);
  yield takeLatest(settingsActions.updateDesignationInfo.type, handleUpdateDesignationInfo);

  yield takeLatest(settingsActions.getDivisionInfo.type, handleDivisionInfo);
  yield takeLatest(settingsActions.addDivisionInfo.type, handleAddDivisionInfo);
  yield takeLatest(settingsActions.updateDivisionInfo.type, handleUpdateDivisionInfo);

  yield takeLatest(settingsActions.getEmployeementInfo.type, handleEmployeementInfo);
  yield takeLatest(settingsActions.addEmployeementInfo.type, handleAddEmployeementInfo);
  yield takeLatest(settingsActions.updateEmployeementInfo.type, handleUpdateEmployeementInfo);

  yield takeLatest(settingsActions.getOrganizationInfo.type, handleOrganizationInfo);
  yield takeLatest(settingsActions.addOrganizationInfo.type, handleAddOrganizationInfo);
  yield takeLatest(settingsActions.updateOrganizationInfo.type, handleUpdateOrganizationInfo);
}
