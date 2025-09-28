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

// Create contractor profile
const createContractor = async (data, token) => {
  const res = await axios.post(API_URL, data, getAuthHeader(token));
  return res.data;
};

// Update contractor profile (fixed)
const updateContractor = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeader(token));
  return res.data;
};

// Delete contractor profile
const deleteContractor = async (idOrToken, maybeToken) => {
  if (idOrToken && typeof idOrToken === "string" && idOrToken.length === 24) {
    // treat as id
    const id = idOrToken;
    const token = maybeToken || getStoredToken();
    const res = await axios.delete(`${API_URL}/${id}`, getAuthHeader(token));
    return res.data;
  } else {
    const token = idOrToken || getStoredToken();
    const res = await axios.delete(API_URL, getAuthHeader(token));
    return res.data;
  }
};

// Get contractor profile by userId
const getContractorByUserId = async (userId, token) => {
  const res = await axios.get(`${API_URL}/user/${userId}`, getAuthHeader(token));
  return res.data;
};

// Public search (you can adapt query params later)
const searchContractors = async (query = "") => {
  const url = query ? `${API_URL}?search=${encodeURIComponent(query)}` : API_URL;
  const res = await axios.get(url);
  return res.data;
};

const ContractorService = {
  createContractor,
  updateContractor,
  deleteContractor,
  getContractorByUserId,
  searchContractors,
};

export default ContractorService;
