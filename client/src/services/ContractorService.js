// client/src/services/ContractorService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/contractors";

function getStoredToken() {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr);
      return u?.token || null;
    }
    return localStorage.getItem("token") || null;
  } catch (e) {
    return null;
  }
}

function getAuthHeader(token) {
  const t = token || getStoredToken();
  return t ? { headers: { Authorization: `Bearer ${t}` } } : {};
}

const safeRequest = async (fn) => {
  try {
    const res = await fn();
    return res.data;
  } catch (error) {
    console.error("❌ Contractor API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

const ContractorService = {
  createContractor: (data, token) =>
    safeRequest(() => axios.post(API_URL, data, getAuthHeader(token))),

  updateContractor: (id, data, token) =>
    safeRequest(() => axios.put(`${API_URL}/${id}`, data, getAuthHeader(token))),

  deleteContractor: (id, token) =>
    safeRequest(() => axios.delete(`${API_URL}/${id}`, getAuthHeader(token))),

  getContractorByUserId: (userId, token) =>
    safeRequest(() => axios.get(`${API_URL}/user/${userId}`, getAuthHeader(token))),

  getMyContractorProfile: (token) =>
    safeRequest(() => axios.get(`${API_URL}/me`, getAuthHeader(token))),

  getContractorById: (id) =>
    safeRequest(() => axios.get(`${API_URL}/${id}`)),

  // FIX: Use /search endpoint
  searchContractors: (queryString = "") =>
    safeRequest(() => axios.get(`${API_URL}/search${queryString}`)),

  getAllContractors: (token) =>
    safeRequest(() => axios.get(`${API_URL}/search`, getAuthHeader(token))),
};

export default ContractorService;