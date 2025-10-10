<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm">
        <!-- Título: ocupa a linha toda no mobile, só metade no desktop -->
        <div class="col-12 col-md-6">
          <div class="titulo q-mb-sm flex items-center">
            <q-icon name="manage_accounts" size="32px" class="q-mr-sm" color="primary" />
            Usuários
          </div>
        </div>

        <!-- Botão -->
        <div class="col-6 col-md-2">
          <q-btn
            class="CadastroBTN"
            label="Cadastrar"
            color="primary"
            @click="abrirModalCadastro"
          />
        </div>

        <!-- Input -->
        <div class="col-6 col-md-4">
          <q-input
            class="pesquisaALL"
            standout
            v-model="pesquisa"
            label="Pesquisar Usuário"
            
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <q-table
      :rows="usuariosFiltrados"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[5]"
    >
      <template v-slot:header="props">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>Ações</q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td>
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              @click="editarUsuario(props.row)"
            />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click="confirmarExcluir(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Modal Cadastro -->
    <q-dialog v-model="modalCadastro">
      <q-card class="modal">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Cadastrar Locatário</div>
          <q-input
            class="inputModal" outlined
            v-model="novoUsuario.nome"
            label="Nome do Usuário"
            required
          />
          <q-input class="inputModal" outlined v-model="novoUsuario.email" label="Email" required />
          <q-input
            class="inputModal" outlined
            v-model="novoUsuario.senha"
            label="Senha"
            type="password"
            required
          />
          <q-select
            class="inputModalSelect" outlined
            v-model="novoUsuario.tipo"
            :options="['USER', 'ADMIN']"
            label="Tipo de Usuário"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Cadastrar" color="primary" @click="cadastrarUsuario" />
          <q-btn class="modalBTN" label="Cancelar" @click="modalCadastro = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Editar -->
    <q-dialog v-model="modalEditar">
      <q-card class="modal">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Cadastrar Locatário</div>
          <q-input
            class="inputModal" outlined
            v-model="usuarioEditar.nome"
            label="Nome do Usuário"
            required
          />
          <q-input class="inputModal" outlined v-model="usuarioEditar.email" label="Email" required />
          <q-input
            class="inputModal" outlined
            v-model="usuarioEditar.senha"
            label="Nova Senha (Opcional)"
            type="password"
          />
          <q-input
            class="inputModal" 
            v-model="usuarioEditar.confirmarSenha"
            label="Confirmar Nova Senha"
            type="password"
          />
          <q-select
            class="inputModalSelect" outlined
            v-model="usuarioEditar.tipo"
            :options="['USER', 'ADMIN']"
            label="Tipo de Usuário"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Atualizar" color="primary" @click="atualizarUsuario" />
          <q-btn class="modalBTN" label="Fechar" @click="modalEditar = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Confirmar Excluir -->
    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%;">
        <q-card-section class="conteudoModal">
          <div class="text-h6">Certeza que deseja excluir esse Usuário?</div>
          <div class="text-h6">Após essa ação não haverá retorno.</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Excluir" color="negative" @click="excluirUsuario" />
          <q-btn class="modalBTN" label="Voltar" @click="modalExcluir = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { usuarioService } from 'src/services/usuarioService';

const $q = useQuasar();

// --- Estado da Aplicação ---
const allUsers = ref([]); // Lista completa de usuários da API
const loading = ref(false); 

// --- Estado da Pesquisa e Tabela ---
const pesquisa = ref(''); // Mapeia para o v-model do q-input
const columns = [ // Colunas da Q-Table
  { name: 'name', label: 'Nome', field: 'name', sortable: true, align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', sortable: true, align: 'left' },
  { name: 'role', label: 'Permissão', field: 'role', sortable: true, align: 'left' },
  // A coluna "Ações" não precisa ser definida aqui, pois é um slot customizado no template.
];

// --- Lógica da Q-Table e Pesquisa ---
const usuariosFiltrados = computed(() => {
  const term = pesquisa.value.toLowerCase();
  if (!term) {
    return allUsers.value;
  }
  // Implementa a lógica de filtro do seu código Vanilla
  return allUsers.value.filter(user => 
    (user.name?.toLowerCase().includes(term)) ||
    (user.email?.toLowerCase().includes(term)) ||
    (user.role?.toLowerCase().includes(term))
  );
});

// --- Estado dos Modais ---
const modalCadastro = ref(false);
const modalEditar = ref(false);
const modalExcluir = ref(false);

// Objeto para novo cadastro (misto com a API: name, email, password, role)
const novoUsuario = ref({
  nome: '', // Mapeia para name
  email: '',
  senha: '', // Mapeia para password
  tipo: 'USER', // Mapeia para role, valor padrão
});

// Objeto para edição
const usuarioEditar = ref({
  id: null,
  nome: '', // Mapeia para name
  email: '',
  senha: '', // Mapeia para password
  confirmarSenha: '',
  tipo: '', // Mapeia para role
});

// Usuário selecionado para exclusão
const usuarioParaExcluir = ref(null);

// --- Chamadas da API (Serviço) ---

/**
 * Carrega a lista de usuários ao iniciar a página.
 */
async function fetchUsers() {
  loading.value = true;
  try {
    const users = await usuarioService.listarUsuarios();
    // A API retorna o campo "role" em maiúsculo (ADMIN/USER), então não é necessário ajuste aqui.
    allUsers.value = users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    $q.notify({
      type: 'negative',
      message: 'Falha ao carregar usuários. ' + (error.response?.data?.message || 'Erro de rede.'),
    });
  } finally {
    loading.value = false;
  }
}

/**
 * Cadastra um novo usuário.
 */
async function cadastrarUsuario() {
  const { nome, email, senha, tipo } = novoUsuario.value;

  if (!nome || !email || !senha) {
    $q.notify({ type: 'warning', message: 'Preencha todos os campos obrigatórios.' });
    return;
  }

  try {
    const dados = {
      name: nome,
      email: email,
      password: senha,
      role: tipo.toUpperCase() // Garante que a role esteja em caixa alta
    };
    
    await usuarioService.criarUsuario(dados);

    $q.notify({ type: 'positive', message: 'Usuário cadastrado com sucesso!' });
    modalCadastro.value = false;
    // Limpa e recarrega os dados
    resetNovoUsuario(); 
    await fetchUsers(); 
    
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    $q.notify({ 
      type: 'negative', 
      message: 'Erro ao cadastrar usuário. ' + (error.response?.data?.message || 'Verifique o console.') 
    });
  }
}

/**
 * Abre o modal de edição e preenche os campos.
 * @param {Object} user - Objeto do usuário a ser editado (vindo da q-table).
 */
function editarUsuario(user) {
  // Mapeia os campos da API para o objeto de edição
  usuarioEditar.value = {
    id: user.id,
    nome: user.name,
    email: user.email,
    tipo: user.role, 
    senha: '', // A senha é sempre limpa no início da edição
    confirmarSenha: '',
  };
  modalEditar.value = true;
}

/**
 * Atualiza um usuário existente.
 */
async function atualizarUsuario() {
  const { id, nome, email, senha, confirmarSenha, tipo } = usuarioEditar.value;

  if (senha && senha !== confirmarSenha) {
    $q.notify({ type: 'warning', message: 'As novas senhas não conferem!' });
    return;
  }
  if (!nome || !email) {
    $q.notify({ type: 'warning', message: 'Nome e email são obrigatórios.' });
    return;
  }

  try {
    const dadosAtualizados = { 
      name: nome, 
      email: email, 
      role: tipo.toUpperCase() 
    };

    if (senha) {
      dadosAtualizados.password = senha; // Adiciona senha apenas se alterada
    }
    
    await usuarioService.atualizarUsuario(id, dadosAtualizados);
    
    $q.notify({ type: 'positive', message: 'Usuário atualizado com sucesso!' });
    modalEditar.value = false;

    // Otimização: atualiza o array localmente
    const index = allUsers.value.findIndex(u => u.id === id);
    if (index !== -1) {
        // Usa o spread operator para garantir a reatividade e merge dos dados
        allUsers.value[index] = { ...allUsers.value[index], ...dadosAtualizados };
        // Atualiza a visualização, preservando a reatividade do Vue
        allUsers.value = [...allUsers.value]; 
    }

  } catch (error) {
    console.error('Erro ao atualizar:', error);
    $q.notify({ 
      type: 'negative', 
      message: 'Erro ao atualizar usuário. ' + (error.response?.data?.message || 'Verifique o console.') 
    });
  }
}

/**
 * Define o usuário para exclusão e abre o modal.
 * @param {Object} user - Objeto do usuário a ser excluído.
 */
function confirmarExcluir(user) {
  usuarioParaExcluir.value = user;
  modalExcluir.value = true;
}

/**
 * Executa a exclusão.
 */
async function excluirUsuario() {
  const user = usuarioParaExcluir.value;

  try {
    await usuarioService.deletarUsuario(user.id);

    $q.notify({ type: 'positive', message: 'Usuário deletado com sucesso!' });
    modalExcluir.value = false;
    usuarioParaExcluir.value = null;

    // Otimização: remove o usuário localmente
    allUsers.value = allUsers.value.filter(u => u.id !== user.id);

  } catch (error) {
    console.error('Erro ao deletar:', error);
    $q.notify({ 
      type: 'negative', 
      message: 'Erro ao deletar usuário. ' + (error.response?.data?.message || 'Verifique o console.') 
    });
  }
}

// --- Funções de UI/Abertura de Modais ---

function abrirModalCadastro() {
  resetNovoUsuario();
  modalCadastro.value = true;
}

function resetNovoUsuario() {
  novoUsuario.value = {
    nome: '',
    email: '',
    senha: '',
    tipo: 'USER',
  };
}

// --- Ciclo de Vida: Carregar dados ao montar o componente ---
onMounted(() => {
  fetchUsers();
});
</script>