import { axiosInstanceSecure } from "../utils/axiosInterceptor.jsx";
import authHeader from "./auth-header";

const API_URL = "/front-discipline/";
const API_URL_FOR_CENTER = "/discipline/";

const getAll = () => {
  return axiosInstanceSecure.get(API_URL, { headers: authHeader() });
};

const getById = (id) => {
  return axiosInstanceSecure.get(`${API_URL}${id}`, { headers: authHeader() });
};

const update = (data) => {
  return axiosInstanceSecure.put(`${API_URL}${data.id}`, data, {
    headers: authHeader(),
  });
};


const getAllforCenter = () => {
  return axiosInstanceSecure.get(API_URL_FOR_CENTER, { headers: authHeader() })
}

const create = (data) => {
  return axiosInstanceSecure.post(`${API_URL}`, data, {
    headers: authHeader(),
  });
};

const deleteFrontDiscipline = (id) => {
  return axiosInstanceSecure.delete(`${API_URL}${id}`, { headers: authHeader() })
}


const DisciplineService = {
  getAll,
  getAllforCenter,
  getById,
  update,
  create,
  deleteFrontDiscipline,
};

export default DisciplineService;
