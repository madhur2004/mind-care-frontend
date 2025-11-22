export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userName');
};

export const getUserName = () => {
  return localStorage.getItem('userName');
};

export const setUserName = (name) => {
  localStorage.setItem('userName', name);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
}; 


