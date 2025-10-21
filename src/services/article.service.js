import { axiosInstanceSecure } from "../utils/axiosInterceptor.jsx";
import authHeader from "./auth-header";

const API_URL = "/admin/articles";

const getAll = (type, lang, sitemapAdded, enabled) => {
  type = type ? type : '';
  lang = lang ? lang : '';
  sitemapAdded = sitemapAdded ? sitemapAdded : '';
  enabled = enabled ? enabled : '';
  return axiosInstanceSecure.get(`${API_URL}?type=${type}&lang=${lang}&lightResult=true&sitemapAdded=${sitemapAdded}&enabled=${enabled}`, { headers: authHeader() });
};

const getById = (id) => {
  return axiosInstanceSecure.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const getBySlug = (slug) => {
  return axiosInstanceSecure.get(`${API_URL}/${slug}/exist`, { headers: authHeader() });
};

const update = (id, data) => {
  return axiosInstanceSecure.put(`${API_URL}/${id}`, data, {
    headers: authHeader(),
  });
};

const updatePartially = (id, data) => {
  return axiosInstanceSecure.patch(`${API_URL}/${id}`, data, {
    headers: authHeader(),
  });
};


const create = (data) => {
  return axiosInstanceSecure.post(`${API_URL}`, data, {
    headers: authHeader(),
  });
};

const bulkCreate = (data) => {
  return axiosInstanceSecure.post(`${API_URL}/bulk`, data, {
    headers: authHeader(),
  });
};

const deleteFrontDiscipline = (id) => {
  return axiosInstanceSecure.delete(`${API_URL}${id}`, { headers: authHeader() })
}


const ArticleService = {
  getAll,
  getById,
  update,
  create,
  bulkCreate,
  deleteFrontDiscipline,
  getBySlug,
  updatePartially,
};

export default ArticleService;
