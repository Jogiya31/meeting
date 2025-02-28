import axiosClient from './axiosClient';

// ------------------api call for allscheme list page with filters---------------
export const alluserInfo = (data) => {
  const payload = data.payload;
  const url = `/users`;
  return axiosClient().get(url, payload, {
    'Content-Type': 'application/json'
  });
};

export const adduserInfo = (data) => {
  const payload = data.payload;
  const url = `/users`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};

export const updateuserInfo = (data) => {
  const payload = data.payload;
  const id = '';
  const url = `/users/${id}`;
  return axiosClient().post(url, payload, {
    'Content-Type': 'application/json'
  });
};
