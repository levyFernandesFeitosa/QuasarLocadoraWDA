import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://locadora-ryan-back.altislabtech.com.br',
  headers: { 'Content-Type': 'application/json' }
});

export default boot(({ app }) => {
  // Pega token do localStorage
  const token = localStorage.getItem('authToken');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Disponibiliza o axios normal e a api configurada no Vue
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  /**
   * Função de autenticação
   * Pode ser usada em qualquer componente via this.$authenticate(email, password)
   */
  app.config.globalProperties.$authenticate = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data?.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        localStorage.setItem('authToken', data.token);
      }
      return data;
    } catch (err) {
      console.error('Erro de autenticação:', err);
      throw err;
    }
  };
});

export { api };
