import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ======================== AUTH ========================

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/auth/password", data),
};

// ======================== PROPERTIES ========================

export const propertyAPI = {
  getAll: (params?: Record<string, string>) =>
    api.get("/properties", { params }),
  getById: (id: string) => api.get(`/properties/${id}`),
  create: (data: Record<string, unknown>) => api.post("/properties", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/properties/${id}`, data),
  delete: (id: string) => api.delete(`/properties/${id}`),
};

// ======================== AGENTS ========================

export const agentAPI = {
  getAll: () => api.get("/agents"),
  getById: (id: string) => api.get(`/agents/${id}`),
  apply: (data: Record<string, unknown>) => api.post("/agents/apply", data),
};

// ======================== WISHLIST ========================

export const wishlistAPI = {
  get: () => api.get("/wishlist"),
  add: (propertyId: string) => api.post(`/wishlist/${propertyId}`),
  remove: (propertyId: string) => api.delete(`/wishlist/${propertyId}`),
};

// ======================== INQUIRIES ========================

export const inquiryAPI = {
  create: (data: { propertyId: string; message: string }) =>
    api.post("/inquiries", data),
  respond: (id: string, response: string) =>
    api.put(`/inquiries/${id}/respond`, { response }),
};

// ======================== USER DASHBOARD ========================

export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data: Record<string, unknown>) =>
    api.put("/user/profile", data),
  getFavorites: () => api.get("/user/favorites"),
  getInquiries: () => api.get("/user/inquiries"),
  getMyProperties: () => api.get("/user/properties"),
};

// ======================== AGENT DASHBOARD ========================

export const agentDashboardAPI = {
  getProfile: () => api.get("/agent/profile"),
  getInquiries: () => api.get("/agent/inquiries"),
  updateProfile: (data: Record<string, unknown>) =>
    api.put("/agent/profile", data),
};

// ======================== ADMIN ========================

export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  // Users
  getUsers: () => api.get("/admin/users"),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  // Properties
  getProperties: () => api.get("/admin/properties"),
  getPendingProperties: () => api.get("/admin/properties/pending"),
  approveProperty: (id: string) =>
    api.put(`/admin/properties/${id}/approve`),
  rejectProperty: (id: string) =>
    api.put(`/admin/properties/${id}/reject`),
  deleteProperty: (id: string) => api.delete(`/admin/properties/${id}`),
  // Agents
  getAgents: () => api.get("/admin/agents"),
  getPendingAgents: () => api.get("/admin/agents/pending"),
  approveAgent: (id: string) => api.put(`/admin/agents/${id}/approve`),
  rejectAgent: (id: string) => api.put(`/admin/agents/${id}/reject`),
  // Inquiries
  getInquiries: () => api.get("/admin/inquiries"),
};

// ======================== UPLOAD ========================

export const uploadAPI = {
  single: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  multiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return api.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadImages: (formData: FormData) =>
    api.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  avatar: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ======================== REVIEWS ========================

export const reviewAPI = {
  getAgentReviews: (agentId: string) => api.get(`/reviews/agent/${agentId}`),
  getMyReviews: () => api.get("/reviews/my"),
  create: (data: { agent: string; property?: string; rating: number; comment: string }) =>
    api.post("/reviews", data),
};

// ======================== CONTACT ========================

export const contactAPI = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post("/contact", data),
};

export const UPLOADS_URL = "http://localhost:5000";

export default api;
