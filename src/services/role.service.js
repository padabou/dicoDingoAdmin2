import { axiosInstanceSecure } from "../utils/axiosInterceptor.jsx";
import authHeader from "./auth-header";

const API_URL = "/role";

const getAllRole = () => {
  return axiosInstanceSecure.get(API_URL , { headers: authHeader() });
};

const RoleService = {
    getAllRole,
  };
  
  export default RoleService;