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

    let parsedUser = null;
    try {
      if (localUser) {
        parsedUser = JSON.parse(localUser);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      parsedUser = null;
    }

    if (!token || !parsedUser) {
      setLoading(false);
      return;
    }

    setUser(parsedUser);

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser({
          ...response.data,
          token,
          role: localStorage.getItem("role"),
        });
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = ({ user, token, role }) => {
    const mergedUser = { ...user, token, role };
    setUser(mergedUser);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(mergedUser)); // ✅ fixed
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




