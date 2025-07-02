// utils/axiosInstance.js
import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response, // keep full response
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || "Request failed";

      
      if (status === 401) {
        window.dispatchEvent(new Event("unauthorized")); // catch in App.jsx
      }

      return Promise.reject({ status, message, data });
    }

    // Network or config errors
    if (error.request) {
      return Promise.reject({ message: "No response from server", isNetworkError: true });
    }
    return Promise.reject({ message: "Request configuration error" });
  }
);

export default axiosInstance;
