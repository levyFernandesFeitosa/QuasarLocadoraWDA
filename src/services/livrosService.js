import { api } from 'boot/axios';

// Variável local do módulo que armazena o mapeamento nomeEditora -> idEditora.
let editorasMap = {}; 

const LivrosService = {
  
  /**
   * Busca a lista de livros no endpoint /book.
   * @returns {Array} Lista de livros.
   */
  async buscarTodos() {
    try {
      const response = await api.get('/book');
      // Garante que o retorno é sempre um array
      const dadosLivros = Array.isArray(response.data) ? response.data : [response.data];
      return dadosLivros;
    } catch (error) {
      console.error('Erro ao buscar livros:', error.response?.data || error.message);
      throw new Error(`Falha ao buscar livros: ${error.response?.status || 'Erro de rede'}`);
    }
  },

  /**
   * Busca a lista de editoras no endpoint /publisher,
   * popula o mapa interno e retorna a lista completa.
   * @returns {Array} Lista completa de objetos editora.
   */
  async carregarEditoras() {
    try {
      const response = await api.get('/publisher');
      const editoras = response.data;
      
      // Limpa e recria o mapa nome -> id
      editorasMap = {};
      editoras.forEach(ed => {
        editorasMap[ed.name] = ed.id;
      });

      return editoras;
    } catch (error) {
      console.error('Erro ao carregar editoras:', error.response?.data || error.message);
      throw new Error(`Falha ao carregar editoras: ${error.response?.status || 'Erro de rede'}`);
    }
  },
  
  /**
   * Cadastra um novo livro.
   * @param {Object} livro - Dados do livro (incluindo publisherName).
   */
  async cadastrar(livro) {
    // VERIFICAÇÃO CHAVE: Busca o ID da editora usando o mapa interno
    const idEditora = editorasMap[livro.publisherName]; 
    if (!idEditora) {
        // Esta mensagem de erro é a que o Quasar irá exibir
        throw new Error("Erro de validação: A editora selecionada é inválida ou o mapa não foi carregado corretamente.");
    }

    const payload = {
        name: livro.name,
        author: livro.author,
        launchDate: livro.launchDate,
        totalQuantity: parseInt(livro.totalQuantity),
        totalInUse: 0, 
        publisherId: idEditora
    };

    await api.post("/book", payload);
  },

  /**
   * Atualiza um livro existente.
   * @param {number} idLivro - ID do livro a ser atualizado.
   * @param {Object} livro - Dados atualizados (incluindo publisherName).
   */
  async atualizar(idLivro, livro) {
    // VERIFICAÇÃO CHAVE: Busca o ID da editora usando o mapa interno
    const idEditora = editorasMap[livro.publisherName]; 
    if (!idEditora) {
        // Esta mensagem de erro é a que o Quasar irá exibir
        throw new Error("Erro de validação: A editora selecionada é inválida ou o mapa não foi carregado corretamente.");
    }
    
    const payload = {
        name: livro.name,
        author: livro.author,
        launchDate: livro.launchDate,
        totalQuantity: parseInt(livro.totalQuantity),
        // Mantém o valor de totalInUse que veio do formulário de edição (tabela)
        totalInUse: parseInt(livro.totalInUse), 
        publisherId: idEditora
    };

    await api.put(`/book/${idLivro}`, payload);
  },

  /**
   * Deleta um livro pelo ID.
   * @param {number} id - O ID do livro a ser deletado.
   */
  async deletar(id) {
    try {
      await api.delete(`/book/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar livro ${id}:`, error.response?.data || error);
      throw new Error(`Falha ao deletar livro: ${error.response?.status || 'Erro de rede'}`);
    }
  },
  
  /**
   * Método auxiliar para obter o ID da editora.
   */
  getIdEditora(nomeEditora) {
    return editorasMap[nomeEditora];
  }
};

export default LivrosService;