// client/src/services/ContractorService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/contractors";

/**
 * Get stored token from localStorage
 */
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

/**
 * Return auth headers if token exists
 */
function getAuthHeader(token) {
  const t = token || getStoredToken();
  return t ? { headers: { Authorization: `Bearer ${t}` } } : {};
}

/**
 * Unified safe request wrapper for error handling
 */
const safeRequest = async (fn) => {
  try {
    const res = await fn();
    return res.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

/**
 * Build query string from object params
 */
const buildQuery = (params) => {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : "";
};

// ==================== CONTRACTOR API ====================

/**
 * Create contractor profile
 */
const createContractor = (data, token) =>
  safeRequest(() => axios.post(API_URL, data, getAuthHeader(token)));

/**
 * Update contractor profile
 */
const updateContractor = (id, data, token) =>
  safeRequest(() => axios.put(`${API_URL}/${id}`, data, getAuthHeader(token)));

/**
 * Delete contractor profile
 * Can accept either contractorId or token
 */
const deleteContractor = (idOrToken, maybeToken) => {
  if (idOrToken && typeof idOrToken === "string" && idOrToken.length === 24) {
    // treat as contractorId
    const id = idOrToken;
    const token = maybeToken || getStoredToken();
    return safeRequest(() =>
      axios.delete(`${API_URL}/${id}`, getAuthHeader(token))
    );
  } else {
    const token = idOrToken || getStoredToken();
    return safeRequest(() => axios.delete(API_URL, getAuthHeader(token)));
  }
};

/**
 * Get contractor profile by userId (private/dashboard)
 */
const getContractorByUserId = (userId, token) =>
  safeRequest(() =>
    axios.get(`${API_URL}/user/${userId}`, getAuthHeader(token))
  );

/**
 * Get contractor profile by contractorId (public view)
 */
const getContractorById = (id) =>
  safeRequest(() => axios.get(`${API_URL}/${id}`));

/**
 * Search contractors (public)
 * Example: searchContractors({ q: "paint", city: "Lahore", page: 2 })
 */
const searchContractors = (params = {}) =>
  safeRequest(() => axios.get(`${API_URL}${buildQuery(params)}`));

// ==================== EXPORT ====================

const ContractorService = {
  createContractor,
  updateContractor,
  deleteContractor,
  getContractorByUserId,
  getContractorById,
  searchContractors,
};

export default ContractorService;
