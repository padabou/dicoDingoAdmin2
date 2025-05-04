import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const axiosInstanceSecure = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_BASE_URL,
});

const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    const resInterceptor = (response) => {
      return response;
    };

    const errInterceptor = (error) => {
      if (error.response.status === 401) {
        navigate("/login");
      }

      return Promise.reject(error);
    };

    const interceptor = axiosInstanceSecure.interceptors.response.use(
      resInterceptor,
      errInterceptor
    );

    setIsSet(true);

    return () => axiosInstanceSecure.interceptors.response.eject(interceptor);
  }, [navigate]);

  return isSet && children;
};

export { AxiosInterceptor };
