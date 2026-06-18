import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
// Set up base URL (adjust to your backend URL)
const api = axios.create({
  baseURL: API_URL, // Replace with your backend server URL
  headers: {
    'Content-Type': 'application/json' // Default header for JSON
  }
});

export default api;
