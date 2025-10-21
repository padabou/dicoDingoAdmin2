import { axiosInstanceSecure } from "../utils/axiosInterceptor.jsx";
import authHeader from "./auth-header";

const API_URL = "/admin/contacts";

const getAll = () => {
  return axiosInstanceSecure.get(`${API_URL}`, { headers: authHeader() });
};

const ContactService = {
  getAll
};

export default ContactService;
