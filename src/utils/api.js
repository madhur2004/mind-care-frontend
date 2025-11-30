import axios from 'axios';

// Current backend URL check karein
//const API_BASE_URL = https://mind-care-service.onrender.com || 'http://localhost:5000/api';
const API_BASE_URL = 'https://mind-care-service.onrender.com/api';

// --------------------------------------------------
// 🔐 AXIOS INSTANCE
// --------------------------------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
});

// --------------------------------------------------
// 🔐 Request Interceptor → Token Auto Add (IMPROVED)
// --------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Token validity check karo
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          console.log('❌ Token expired, logging out...');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userName');
          window.location.href = '/login';
          return Promise.reject(new Error('Token expired'));
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('❌ Invalid token:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        window.location.href = '/login';
        return Promise.reject(new Error('Invalid token'));
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------
// ❗ Response Interceptor → Auto Logout When Token Expired (IMPROVED)
// --------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('❌ API Error:', error.response?.status);
    
    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized, clearing tokens...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      
      // Current page check karo - agar profile page hai to redirect karo
      if (window.location.pathname === '/profile') {
        window.location.href = '/login';
      }
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
  // Forgot Password
  forgotPassword: (email) => 
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password', { token, newPassword }),

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

// --------------------------------------------------
// ⚙️ SETTINGS APIs
// --------------------------------------------------
export const settingsAPI = {
  // Get user settings
  getSettings: () => api.get('/settings'),
  
  // Update user settings
  updateSettings: (settingsData) => api.put('/settings', settingsData),
  
  // Export data
  exportData: () => api.get('/settings/export-data'),
  
  // Delete account
  deleteAccount: (confirmation) => api.delete('/settings/delete-account', { data: { confirmation } })
};

// --------------------------------------------------
// 👤 PROFILE APIs
// --------------------------------------------------
export const profileAPI = {
  // Get user profile
  getProfile: () => api.get('/profile'),
  
  // Update profile (name)
  updateProfile: (profileData) => api.put('/profile', profileData),
  
  // Upload avatar
  uploadAvatar: (formData) => api.post('/profile/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Remove avatar
  removeAvatar: () => api.delete('/profile/remove-avatar')
};

export default api;
