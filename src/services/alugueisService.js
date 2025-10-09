import { api } from 'boot/axios' // Importa a instância configurada do boot

// Definição das URLs base das APIs
const RESOURCE_URL = '/rent'
const RESOURCE_RENTERS = '/renter'
const RESOURCE_BOOKS = '/book'

// O objeto com as funções do CRUD de aluguéis
const aluguelService = {
    // READ ALL: Busca todos os aluguéis
    async getAllAlugueis() {
        try {
            const response = await api.get(RESOURCE_URL)
            // Retorna os dados, assumindo que são um array de aluguéis
            return response.data
        } catch (error) {
            console.error('Erro ao buscar aluguéis:', error.response?.data || error.message)
            throw error // Deixa o componente lidar com o erro
        }
    },

    // CREATE: Cadastra um novo aluguel
    async createAluguel(novoAluguel) {
        try {
            const response = await api.post(RESOURCE_URL, novoAluguel)
            return response.data
        } catch (error) {
            console.error('Erro ao cadastrar aluguel:', error.response?.data || error.message)
            throw error
        }
    },

    // UPDATE: Edita/Atualiza um aluguel (incluindo o recebimento)
    async updateAluguel(id, dadosAtualizados) {
        try {
            const response = await api.put(`${RESOURCE_URL}/${id}`, dadosAtualizados)
            return response.data
        } catch (error) {
            console.error(`Erro ao atualizar aluguel ${id}:`, error.response?.data || error.message)
            throw error
        }
    },

    // DELETE: Exclui um aluguel
    async deleteAluguel(id) {
        try {
            const response = await api.delete(`${RESOURCE_URL}/${id}`)
            return response.data
        } catch (error) {
            console.error(`Erro ao excluir aluguel ${id}:`, error.response?.data || error.message)
            throw error
        }
    },

    // UTILIDADE: Pega Locatários e Livros (para preenchimento de formulários)
    async getDependencies() {
        try {
            const [resLocatarios, resLivros] = await Promise.all([
                api.get(RESOURCE_RENTERS),
                api.get(RESOURCE_BOOKS)
            ])
            // Retorna um objeto com os dois arrays de dados
            return {
                locatarios: resLocatarios.data,
                livros: resLivros.data
            }
        } catch (error) {
            console.error('Erro ao carregar locatários/livros:', error.response?.data || error.message)
            throw error
        }
    }
}

export default aluguelService