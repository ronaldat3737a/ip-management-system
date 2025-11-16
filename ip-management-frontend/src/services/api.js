import axios from 'axios';

const API_URL = '/api'; // Because of the proxy in package.json

// Authentication
export const login = (username, password) => {
  return axios.post(`${API_URL}/auth/login`, { username, password });
};

export const register = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

// Applications
export const submitApplication = (formData) => {
  return axios.post(`${API_URL}/applications`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getAllApplications = () => {
  return axios.get(`${API_URL}/applications`);
};

export const getApplicationById = (id) => {
    return axios.get(`${API_URL}/applications/${id}`);
};

export const updateApplicationStatus = (id, status) => {
  return axios.patch(`${API_URL}/applications/${id}/status`, { status });
};

export const downloadFile = (fileId) => {
    return axios.get(`${API_URL}/applications/files/${fileId}`, {
        responseType: 'blob', // Important for file downloads
    });
};
