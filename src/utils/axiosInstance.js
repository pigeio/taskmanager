import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Directly return the response data for successful requests
    return response.data;
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      // Server responded with error status (4xx/5xx)
      const errorMessage = error.response.data?.message || "Request failed";
      const status = error.response.status;
      
      // Handle specific status codes
      if (status === 401) {
        // Unauthorized access - redirect to login
        window.location.href = "/login";
      }
      
      return Promise.reject({
        status,
        message: errorMessage,
        data: error.response.data
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: "No response from server",
        isNetworkError: true
      });
    } else {
      // Request setup error
      return Promise.reject({
        message: "Request configuration error"
      });
    }
  }
);

export default axiosInstance;