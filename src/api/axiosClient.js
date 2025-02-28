import axios from "axios";

// getting global variable from .env file
const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

/**
 * create default layout function for api calls
 * here we can customize our authentication/Authorization token
 **/

export const axiosClient = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default axiosClient;
