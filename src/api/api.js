import axiosClient from './axiosClient';

////////////////// login api /////////////////////////
export const authInfo = (data) => {
  const payload = data.payload;
  const url = `/GetLoginUser`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////// dashboard api ///////////////////////
export const getdashboardinfo = () => {
  const url = `/GetDashboardDetails`;
  return axiosClient().get(url, {
    'Content-Type': 'application/json'
  });
};

/////////////////// user api  ///////////////////
export const alluserInfo = () => {
  const url = `/GetUserDetails`;
  return axiosClient().get(url, {
    'Content-Type': 'application/json'
  });
};
export const adduserInfo = (data) => {
  const payload = data.payload;
  const url = `/Save_User`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const updateuserInfo = (data) => {
  const payload = data.payload;
  const id = '';
  const url = `/Update_User`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Designation api  ///////////////////
export const GetDesignationDetails = () => {
  const url = `/GetDesignationDetails`;
  return axiosClient().get(url, {
    'Content-Type': 'application/json'
  });
};
export const AddDesignationDetails = (data) => {
  const payload = data.payload;
  const url = `/Save_Designation`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateDesignation = (data) => {
  const payload = data.payload;
  const url = `/Update_Designation`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Division api  ///////////////////
export const GetDivisionDetails = () => {
  const url = `/GetDivisionDetails`;
  return axiosClient().get(url, {
    'Content-Type': 'application/json'
  });
};
export const AddDivisionDetails = (data) => {
  const payload = data.payload;
  const url = `/Save_Division`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateDivision = (data) => {
  const payload = data.payload;
  const url = `/Update_Division`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Organisation api  ///////////////////
export const GetOrganisationDetails = () => {
  const url = `/GetOrganisationDetails`;
  return axiosClient().get(url, {
    'Content-Type': 'application/json'
  });
};
export const AddOrganisationDetails = (data) => {
  const payload = data.payload;
  const url = `/Save_Organisation`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateOrganisation = (data) => {
  const payload = data.payload;
  const url = `/Update_Organisation`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Employement api  ///////////////////
export const GetEmployementDetails = () => {
  const url = `/GetEmployementDetails`;
  return axiosClient().get(url, {
    'Content-Type': 'application/json'
  });
};
export const AddEmployementDetails = (data) => {
  const payload = data.payload;
  const url = `/Save_Employement`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateEmployement = (data) => {
  const payload = data.payload;
  const url = `/Update_Employement`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Status api  ///////////////////
export const GetStatusDetails = () => {
  const url = `/GetStatusDetails`;
  return axiosClient().get(url, {
    'Content-Type': 'application/json'
  });
};
export const AddStatusDetails = (data) => {
  const payload = data.payload;
  const url = `/Save_Status`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateStatus = (data) => {
  const payload = data.payload;
  const url = `/Update_Status`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};


/////////////////// Project api  ///////////////////
export const GetProjectDetails = () => {
  const url = `/GetProjectDetails`;
  return axiosClient().get(url, {
    'Content-Type': 'application/json'
  });
};
export const AddProjectDetails = (data) => {
  const payload = data.payload;
  const url = `/Save_Project`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateProject = (data) => {
  const payload = data.payload;
  const url = `/Update_Project`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};




/////////////////// Meetings api  ///////////////////
export const getMeetings = () => {
  const url = `/GetMeetingDiscussionAttendanceDetails`;
  return axiosClient().get(url, {
    'Content-Type': 'application/json'
  });
};
export const addMeetingsDetails = (data) => {
  const payload = data.payload;
  const url = `/Save_Meeting`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const updateMeetingsDetails = (data) => {
  const payload = data.payload;
  const url = `/Update_Meeting`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const addAttendanceDetails = (data) => {
  const payload = data.payload;
  const url = `/Save_Attendance`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const updateAttendanceDetails = (data) => {
  const payload = data.payload;
  const url = `/Update_Attendance`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const addDiscussionDetails = (data) => {
  const payload = data.payload;
  const url = `/Save_DiscussionPoint`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

export const updateDiscussionDetails = (data) => {
  const payload = data.payload;
  const url = `/Update_DiscussionPoint`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
