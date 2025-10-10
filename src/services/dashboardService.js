import { api } from 'boot/axios';

/**
 * Módulo de Serviço para a API da Dashboard.
 */
const dashboardService = {
  /**
   * Obtém todos os dados estatísticos da dashboard com uma única Promise.all.
   * @param {number} numberOfMonths - Número de meses para alguns filtros.
   * @returns {Promise<Object>} Objeto contendo todas as respostas da API.
   */
  async loadDashboardData(numberOfMonths = 1) {
    const params = { numberOfMonths };
    
    try {
      // Replica exatamente as chamadas Promise.all do seu código vanilla
      const [
        livrosMaisAlugadosRes,
        entreguesNoPrazoRes,
        entreguesAtrasoRes,
        alugueisAtrasadosRes,
        alugueisPorLocatarioRes,
        alugueisRes, // /rent
        locatariosRes // /renter
      ] = await Promise.all([
        api.get('/dashboard/bookMoreRented', { params }),
        api.get('/dashboard/deliveredInTimeQuantity', { params }),
        api.get('/dashboard/deliveredWithDelayQuantity', { params }),
        api.get('/dashboard/rentsLateQuantity', { params }),
        api.get('/dashboard/rentsPerRenter', { params }),
        api.get('/rent'),
        api.get('/renter')
      ]);

      // Retorna todos os dados brutos para serem processados no componente Vue.
      return {
        livrosMaisAlugados: livrosMaisAlugadosRes.data,
        entreguesNoPrazo: entreguesNoPrazoRes.data,
        entreguesAtraso: entreguesAtrasoRes.data,
        alugueisAtrasados: alugueisAtrasadosRes.data,
        alugueis: alugueisRes.data,
        locatarios: locatariosRes.data,
      };

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error.response?.data || error.message);
      throw error;
    }
  },
};

export { dashboardService };