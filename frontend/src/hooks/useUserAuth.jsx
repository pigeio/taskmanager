// hooks/useUserAuth.js
import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

export const useUserAuth = () => {
  const { user, Loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Loading && !user) {
      navigate("/login");
    }
  }, [user, Loading, navigate]);
};
