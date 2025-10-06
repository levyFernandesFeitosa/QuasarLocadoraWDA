import { api } from 'boot/axios'; // Importa a instância configurada
import { Notify } from 'quasar';

// O map para editoras agora fica interno ao serviço
export const editorasMap = {};

/**
 * Carrega a lista de editoras da API e popula o map.
 * @returns {Promise<Array<Object>>} Lista de editoras.
 */
export async function carregarEditoras() {
    try {
        const response = await api.get("/publisher");
        const editoras = response.data;

        // Limpa e popula o map nome -> id
        Object.keys(editorasMap).forEach(key => delete editorasMap[key]);
        editoras.forEach(ed => {
            editorasMap[ed.name] = ed.id;
        });

        return editoras;
    } catch (error) {
        console.error("Erro ao carregar editoras:", error.response?.data || error.message);
        // Não é necessário um Notify aqui, o componente que chama deve tratar o erro.
        throw error;
    }
}

/**
 * Busca a lista de livros da API.
 * @returns {Promise<Array<Object>>} Lista de livros.
 */
export async function getLivros() {
    try {
        const response = await api.get('/book');
        return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
        console.error('Erro ao buscar livros:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Cadastra um novo livro na API.
 */
export async function cadastrarLivro(livro) {
    const { totalQuantity, totalInUse, nomeEditora, ...rest } = livro; 
    
    // Seu código de validação de editora (usando editorasMap)
    const idEditora = editorasMap[nomeEditora];
    if (!idEditora) {
        throw new Error("Selecione uma editora válida!");
    }
    
    // A chamada POST para a API
    try {
        const response = await api.post("/book", {
            ...rest,
            totalQuantity: parseInt(totalQuantity),
            totalInUse: 0, // Alugados é 0 no cadastro
            publisherId: idEditora
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar livro:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Atualiza um livro existente na API.
 */
export async function atualizarLivro(idLivro, livro) {
    const { totalQuantity, totalInUse, nomeEditora, ...rest } = livro;

    const idEditora = editorasMap[nomeEditora];
    if (!idEditora) {
        throw new Error("Editora inválida! Verifique o nome da editora.");
    }

    try {
        const response = await api.put(`/book/${idLivro}`, {
            ...rest,
            totalQuantity: parseInt(totalQuantity),
            totalInUse: parseInt(totalInUse),
            publisherId: parseInt(idEditora)
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar livro:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Deleta um livro pelo ID.
 */
export async function deletarLivro(id) {
    try {
        await api.delete(`/book/${id}`);
    } catch (error) {
        console.error('Erro ao deletar livro:', error.response?.data || error.message);
        throw error;
    }
}

// Continua com outras funções (como a de Aluguel, se houver)