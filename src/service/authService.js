// src/services/authService.js
import api from "./api.js";

export const authenticate = async (email, password) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    if (data?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      localStorage.setItem('authToken', data.token);
    }
    return data;
  } catch (err) {
    console.error("Erro de autenticação:", err);
    throw err;
  }
};
