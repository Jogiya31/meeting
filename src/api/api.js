import axiosClient from './axiosClient';

export const authInfo = (data) => {
  const payload = data.payload;
  const url = `/GetLoginUser`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

export const alluserInfo = (data) => {
  const payload = data.payload;
  const url = `/GetUserDetails`;
  return axiosClient().get(url, payload, {
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

export const GetDesignationDetails = (data) => {
  const payload = data.payload;
  const url = `/GetDesignationDetails`;
  return axiosClient().get(url, payload, {
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

export const GetDivisionDetails = (data) => {
  const payload = data.payload;
  const url = `/GetDivisionDetails`;
  return axiosClient().get(url, payload, {
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

export const GetOrganisationDetails = (data) => {
  const payload = data.payload;
  const url = `/GetOrganisationDetails`;
  return axiosClient().get(url, payload, {
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

export const GetEmployementDetails = (data) => {
  const payload = data.payload;
  const url = `/GetEmployementDetails`;
  return axiosClient().get(url, payload, {
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

export const getMeetingsDetails = () => {
  const url = `/GetMeetingDetails`;
  return axiosClient().get(url, payload, {
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