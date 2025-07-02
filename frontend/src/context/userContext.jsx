import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const localUser = localStorage.getItem("user");

    if (!token || !localUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(localUser);
    setUser(parsedUser); // ✅ Set user immediately to prevent flicker

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data); // ✅ Optional: update from server
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser(); // ❌ Removed invalid JSON.parse
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = ({ user, token, role }) => {
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <UserContext.Provider value={{ user, Loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;



