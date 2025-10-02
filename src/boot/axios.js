import { boot } from 'quasar/wrappers';
import axios from 'axios';

// Cria a instância do Axios
const api = axios.create({
  baseURL: "https://locadora-ryan-back.altislabtech.com.br",
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor para adicionar o token de autorização antes de cada requisição
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default boot(({ app }) => {
  // Para que você possa usar 'this.$api' dentro dos componentes Vue.
  app.config.globalProperties.$api = api;
  // Você também pode injetar o Axios original se precisar.
  // app.config.globalProperties.$axios = axios;
});

// Exporta a instância diretamente, útil para o service
export { api };