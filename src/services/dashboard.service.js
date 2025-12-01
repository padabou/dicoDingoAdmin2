import { axiosInstanceSecure } from "../utils/axiosInterceptor.jsx";
import authHeader from "./auth-header";

const API_URL = "/admin/dashboard";

const get = () => {
  return axiosInstanceSecure.get(`${API_URL}`, { headers: authHeader() });
};


const DashboardService = {
  get
};

export default DashboardService;
