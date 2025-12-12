import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// -------------------- AUTH --------------------

// Đăng ký user
export const register = (data) => axios.post(`${BASE_URL}/auth/register`, data);

// Đăng nhập user
export const login = (username, password) => axios.post(`${BASE_URL}/auth/login`, { username, password });

// -------------------- DASHBOARD --------------------

// Lấy thống kê cho dashboard
export const getDashboardStats = (userId) => axios.get(`${BASE_URL}/dashboard/stats/${userId}`);

// -------------------- APPLICATIONS --------------------

// Lấy tất cả applications, có thể có filter
export const getAllApplications = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) {
        params.append('status', filters.status);
    }
    return axios.get(`${BASE_URL}/applications`, { params });
};

// Lấy tất cả applications cho một user
export const getApplicationsByUserId = (userId) => axios.get(`${BASE_URL}/applications/user/${userId}`);

// Lấy chi tiết 1 application theo id
export const getApplicationById = (id) =>
  axios.get(`${BASE_URL}/applications/${id}`);

// Tạo application (có thể upload file)
export const createApplication = (formData) =>
  axios.post(`${BASE_URL}/applications`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Cập nhật trạng thái application
export const updateApplicationStatus = (id, { status, rejectionReason }) =>
  axios.patch(`${BASE_URL}/applications/${id}/status`, { status, rejectionReason });

// Download file
export const downloadFile = async (fileId, fileName) => {
  const response = await axios.get(`${BASE_URL}/applications/files/${fileId}`, {
    responseType: "blob", // quan trọng để nhận file
  });

  // Tạo link tải file
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName || "file");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
