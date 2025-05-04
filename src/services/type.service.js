import { axiosInstanceSecure } from "../utils/axiosInterceptor.jsx";
import authHeader from "./auth-header";

const API_URL = "/admin/type";

const getAll = (type, lang) => {
  return axiosInstanceSecure.get(`${API_URL}`, { headers: authHeader() });
};

const getById = (id) => {
  return axiosInstanceSecure.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const update = (id, data) => {
  return axiosInstanceSecure.put(`${API_URL}/${id}`, data, {
    headers: authHeader(),
  });
};

const create = (data) => {
  return axiosInstanceSecure.post(`${API_URL}`, data, {
    headers: authHeader(),
  });
};

const deleteType = (id) => {
  return axiosInstanceSecure.delete(`${API_URL}${id}`, { headers: authHeader() })
}


const TypeService = {
  getAll,
  getById,
  update,
  create,
  deleteType,
};

export default TypeService;
