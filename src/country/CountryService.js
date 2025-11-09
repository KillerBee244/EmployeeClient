
import axios from "axios";


const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";


const COUNTRY_API = `${API_BASE_URL}/api/countries`;

export const CountryService = {
  
  getPaging: (page = 0, size = 10, keyword = "") =>
    axios.get(COUNTRY_API, {
      params: { page, size, keyword },
    }),


  getById: (id) => axios.get(`${COUNTRY_API}/${id}`),

  
  create: (data) => axios.post(COUNTRY_API, data),

  
  update: (id, data) => axios.put(`${COUNTRY_API}/${id}`, data),

 
  remove: (id) => axios.delete(`${COUNTRY_API}/${id}`),
};
