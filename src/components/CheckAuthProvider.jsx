import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckAuthProvider = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser == null) {
      navigate("/login");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default CheckAuthProvider;
