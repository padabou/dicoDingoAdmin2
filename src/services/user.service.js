import { axiosInstanceSecure } from "../utils/axiosInterceptor.jsx";
import authHeader from "./auth-header";

const API_URL = "/user/";

const getUserBoard = () => {
  return axiosInstanceSecure.get(API_URL + "user", { headers: authHeader() });
};

const getUserInfo = () => {
  return axiosInstanceSecure.get(API_URL + "me", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axiosInstanceSecure.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axiosInstanceSecure.get(API_URL + "admin", { headers: authHeader() });
};

const getUserBySearch = (data) => {
  return axiosInstanceSecure.get(`${API_URL}search/${data}`, {
    headers: authHeader(),
  });
};

const updateUser = (data, roles) => {
  return axiosInstanceSecure.put(`${API_URL}${data.id}`, data, {
    headers: authHeader(),
  });
};

const deleteUser = (userId) => {
  return axiosInstanceSecure.delete(`${API_URL}${userId}`, {
    headers: authHeader(),
  });
};

const UserService = {
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getUserInfo,
  getUserBySearch,
  updateUser,
  deleteUser,
};

export default UserService;
