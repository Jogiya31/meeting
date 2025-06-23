import axiosClient from './axiosClient';

////////////////// login api /////////////////////////
export const authInfo = (data) => {
  const payload = data.payload;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////// dashboard api ///////////////////////
export const getdashboardinfo = () => {
  const url = `/Api`;
  const payload = {
    Key: 46
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// user api  ///////////////////
export const alluserInfo = () => {
  const url = `/Api`;
  const payload = {
    Key: 1
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const adduserInfo = (data) => {
  const payload = data.payload;
  payload.key = 2;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const updateuserInfo = (data) => {
  const payload = data.payload;
  payload.key = 3;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Designation api  ///////////////////
export const GetDesignationDetails = () => {
  const url = `/Api`;
  const payload = {
    Key: 4
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const AddDesignationDetails = (data) => {
  const payload = data.payload;
  payload.key = 5;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateDesignation = (data) => {
  const payload = data.payload;
  payload.key = 6;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Division api  ///////////////////
export const GetDivisionDetails = () => {
  const url = `/Api`;
  const payload = {
    Key: 7
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const AddDivisionDetails = (data) => {
  const payload = data.payload;
  payload.key = 8;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateDivision = (data) => {
  const payload = data.payload;
  payload.key = 9;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Organisation api  ///////////////////
export const GetOrganisationDetails = () => {
  const url = `/Api`;
  const payload = {
    Key: 10
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const AddOrganisationDetails = (data) => {
  const payload = data.payload;
  payload.key = 11;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateOrganisation = (data) => {
  const payload = data.payload;
  payload.key = 36;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Employement api  ///////////////////
export const GetEmployementDetails = () => {
  const url = `/Api`;
  const payload = {
    Key: 12
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const AddEmployementDetails = (data) => {
  const payload = data.payload;
  payload.key = 13;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateEmployement = (data) => {
  const payload = data.payload;
  payload.key = 14;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Status api  ///////////////////
export const GetStatusDetails = () => {
  const url = `/Api`;
  const payload = {
    Key: 22
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const AddStatusDetails = (data) => {
  const payload = data.payload;
  payload.key = 19;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateStatus = (data) => {
  const payload = data.payload;
  payload.key = 21;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Project api  ///////////////////
export const GetProjectDetails = () => {
  const url = `/Api`;
  const payload = {
    Key: 25
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

export const AddProjectDetailsFromTracker = (data) => {
  const payload = data.payload;
  payload.key = 26;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

export const UpdateProjectDetailsFromTracker = (data) => {
  const payload = data.payload;
  payload.key = 27;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Salutation api  ///////////////////
export const GetSalutationDetails = () => {
  const url = `/Api`;
  const payload = {
    Key: 32
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const AddSalutationDetails = (data) => {
  const payload = data.payload;
  payload.key = 30;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateSalutation = (data) => {
  const payload = data.payload;
  payload.key = 31;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Role api  ///////////////////
export const GetRoleDetails = () => {
  const url = `/Api`;
  const payload = {
    Key: 37
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Priority api  ///////////////////
export const GetPriorityDetails = () => {
  const url = `/Api`;
  const payload = {
    Key: 34
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const AddPriorityDetails = (data) => {
  const payload = data.payload;
  payload.key = 33;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdatePriority = (data) => {
  const payload = data.payload;
  payload.key = 35;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Meetings api  ///////////////////
export const getMeetings = () => {
  const url = `/Api`;
  const payload = {
    Key: 45
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const addMeetingsDetails = (data) => {
  const payload = data.payload;
  payload.key = 16;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const updateMeetingsDetails = (data) => {
  const payload = data.payload;
  payload.key = 23;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const addAttendanceDetails = (data) => {
  const payload = data.payload;
  payload.key = 50;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const updateAttendanceDetails = (data) => {
  const payload = data.payload;
  payload.key = 24;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const addDiscussionDetails = (data) => {
  const payload = data.payload;
  payload.key = 17;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const updateDiscussionDetails = (data) => {
  const payload = data.payload;
  payload.key = 18;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const deleteAttendanceDetails = (data) => {
  const payload = data.payload;
  payload.key = 28;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const deleteDiscussionDetails = (data) => {
  const payload = data.payload;
  payload.key = 29;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Module api  ///////////////////
export const GetModuleDetails = () => {
  const url = `/Api`;
  const payload = {
    Key: 39
  };
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const AddModuleDetails = (data) => {
  const payload = data.payload;
  payload.key = 38;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateModule = (data) => {
  const payload = data.payload;
  payload.key = 40;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

/////////////////// Task api  ///////////////////
export const GetTaskDetails = (data) => {
  const payload = data.payload;
  payload.key = 44;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const AddTaskDetails = (data) => {
  const payload = data.payload;
  payload.key = 42;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
export const UpdateTask = (data) => {
  const payload = data.payload;
  payload.key = 43;
  const url = `/Api`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
