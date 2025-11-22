import axios from 'axios';

const API_BASE_URL = 'https://mind-care-service.onrender.com/api';

// --------------------------------------------------
// 🔐 AXIOS INSTANCE
// --------------------------------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
});

// --------------------------------------------------
// 🔐 Request Interceptor → Token Auto Add
// --------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------
// ❗ Response Interceptor → Auto Logout When Token Expired
// --------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --------------------------------------------------
// 🔐 AUTH APIs
// --------------------------------------------------
export const authAPI = {
  register: (email, name, password) =>
    api.post('/auth/register', { email, name, password }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getGoogleAuthUrl: () => api.get('/auth/google/url'),

  googleAuthCallback: (code) =>
    api.post('/auth/google/callback', { code }),

  // Fallback route (remove in production)
  googleAuth: (googleData) => api.post('/auth/google', googleData),

  getProfile: () => api.get('/auth/user'),
};

// --------------------------------------------------
// 😊 MOOD APIs
// --------------------------------------------------
export const moodAPI = {
  create: (moodData) => api.post('/moods', moodData),
  getAll: () => api.get('/moods'),
  getStats: () => api.get('/moods/stats'),
};

// --------------------------------------------------
// 📝 JOURNAL APIs
// --------------------------------------------------
export const journalAPI = {
  create: (journalData) => api.post('/journals', journalData),
  getAll: () => api.get('/journals'),
  update: (id, journalData) => api.put(`/journals/${id}`, journalData),
  delete: (id) => api.delete(`/journals/${id}`),
  getStats: () => api.get('/journals/stats'),
};

// --------------------------------------------------
// 🤖 CHATBOT API (UPDATED + FIXED)
// --------------------------------------------------
export const chatAPI = {
  sendMessage: async (message) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI service is temporarily unavailable");
      }

      // Return in the expected format for your frontend
      return { 
        data: { 
          reply: data.reply,
          success: data.success 
        } 
      };

    } catch (error) {
      console.error("Chat API Error:", error);
      throw new Error(error.message || "Connection issue. Please try again.");
    }
  }
};

// --------------------------------------------------
// 🧘 MEDITATION
// --------------------------------------------------
export const meditationAPI = {
  start: (duration, type) =>
    api.post('/meditation/start', { duration, type }),

  getAll: () => api.get('/meditation'),

  getStats: () => api.get('/meditation/stats'),
};

// --------------------------------------------------
// 📈 PROGRESS
// --------------------------------------------------
export const progressAPI = {
  getStats: () => api.get('/progress'),
};

export default api;
