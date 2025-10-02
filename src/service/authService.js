import { api } from 'boot/axios'; // Importa a instância do axios configurada

const authService = {
  /**
   * Tenta fazer o login e armazena o token.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>} A resposta da API.
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      const token = response.data?.token;

      if (token) {
        // Armazena o token
        localStorage.setItem('authToken', token);

        // A instância do 'api' já tem um interceptor, mas é bom garantir que o token
        // seja configurado imediatamente após o login se o interceptor não for usado.
        // No caso do seu `boot/axios.js`, o interceptor cuidará disso automaticamente
        // para *próximas* requisições, mas manter a lógica explícita aqui é opcional.
        // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return response.data;
      } else {
        console.warn("Resposta da API sem token:", response.data);
        throw new Error('Token não recebido após o login.');
      }
    } catch (error) {
      console.error('Erro de Autenticação:', error.response?.data || error.message || error);
      // Lança o erro para ser tratado no componente (login page)
      throw error;
    }
  },

  /**
   * Remove o token de autenticação.
   */
  logout() {
    localStorage.removeItem('authToken');
    // Você pode remover o cabeçalho Authorization se necessário,
    // mas o interceptor cuida disso para futuras requisições sem o token.
  },

  /**
   * Verifica se o usuário está autenticado.
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
};

export default authService;