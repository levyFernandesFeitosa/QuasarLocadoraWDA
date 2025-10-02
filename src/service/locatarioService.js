import { api } from 'boot/axios'; 

const endpoint = '/renter'; // Ajustado para a rota correta da sua API (/renter)

const LocatarioService = {

  /**
   * Obtém a lista de todos os locatários.
   */
  async getAll() {
    try {
      const response = await api.get(endpoint);
      // Se a sua API retornar o array diretamente, use response.data
      // Se retornar um objeto com os dados dentro, ajuste aqui (ex: response.data.renters)
      return response.data; 
    } catch (error) {
      console.error('Erro ao buscar locatários:', error);
      // Incluímos o status 403 que você notou:
      if (error.response?.status === 403) {
          throw new Error('Acesso negado. Verifique suas credenciais.');
      }
      throw error;
    }
  },

  /**
   * Cria um novo locatário.
   * @param {Object} data - Os dados do novo locatário (name, email, telephone, cpf, address).
   */
  async create(data) {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar locatário:', error.response?.data || error);
      throw error;
    }
  },
  
  /**
   * Atualiza um locatário existente.
   * @param {number} id - O ID do locatário.
   * @param {Object} data - Os dados atualizados.
   */
  async update(id, data) {
    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar locatário ${id}:`, error.response?.data || error);
      throw error;
    }
  },

  /**
   * Remove um locatário.
   * @param {number} id - O ID do locatário a ser removido.
   */
  async delete(id) {
    try {
      await api.delete(`${endpoint}/${id}`);
      // Não precisa retornar nada se a exclusão for um 204/200 OK
    } catch (error) {
      console.error(`Erro ao deletar locatário ${id}:`, error);
      throw error;
    }
  }
};

export default LocatarioService;