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
            <q-icon name="library_books" size="32px" class="q-mr-sm" color="primary" />
            Editoras
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
            label="Pesquisar Editoras"
            
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <q-table
      :rows="editorasFiltradas"
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
              @click="editarEditora(props.row)"
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
      <q-card class="modal" style="max-height: 80%; width: 100%;">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Cadastrar Editora</div>
          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.nome"
            label="Nome da Editora"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.email"
            label="Email da Editora"
            type="email"
            required
          />
          <q-input class="inputModal" outlined v-model="novaEditora.telefone" label="Telefone" required />
          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.site"
            label="Site da Editora"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Cadastrar" color="primary" @click="cadastrarEditora" />
          <q-btn class="modalBTN" label="Cancelar" @click="modalCadastro = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Editar -->
    <q-dialog v-model="modalEditar">
      <q-card class="modal" style="max-height: 80%; width: 100%;">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Atualizar Editora</div>
          <q-input
            class="inputModal"
            v-model="editoraEditar.nome"
            label="Nome da Editora"
            required
          />
          <q-input
            class="inputModal"
            v-model="editoraEditar.email"
            label="Email da Editora"
            type="email"
            required
          />
          <q-input class="inputModal" v-model="editoraEditar.telefone" label="Telefone" required />
          <q-input
            class="inputModal"
            v-model="editoraEditar.site"
            label="Site da Editora"
            required
          />
        </q-card-section >
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Atualizar" color="primary" @click="atualizarEditora" />
          <q-btn class="modalBTN" label="Fechar" @click="modalEditar = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Confirmar Excluir -->
    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%;">
        <q-card-section class="conteudoModal">
          <div class="text-h6">Certeza que deseja excluir essa Editora?</div>
          <div class="q-mt-sm">Após essa ação não haverá retorno.</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Excluir" color="negative" @click="excluirEditora" />
          <q-btn class="modalBTN" label="Voltar" @click="modalExcluir = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import EditorasService from 'src/service/editorasService'; // Seu serviço de API

const $q = useQuasar();

// 1. ESTADO REATIVO (Variáveis que o template usa)
// Substitui `arrayEditoras` do Vanilla JS
const allEditoras = ref([]); 
const pesquisa = ref(''); // V-model do q-input de pesquisa
const isLoading = ref(true); 

// Variáveis para Modais
const modalCadastro = ref(false);
const modalEditar = ref(false);
const modalExcluir = ref(false);

// Objeto para Cadastro
const novaEditora = ref({
  nome: '',
  email: '',
  telefone: '',
  site: '',
});

// Objeto para Edição e Exclusão (armazena a linha selecionada)
const editoraEditar = ref({}); 
const editoraExcluir = ref({});

// 2. COLUNAS DA TABELA
// Define as colunas da Q-Table. Os campos (`field`) devem ser os nomes que vêm da sua API
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  // Assumindo que sua API retorna 'name', 'email', 'telephone', 'site'
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true }, 
  { name: 'email', label: 'E-mail', field: 'email', align: 'left', sortable: true },
  { name: 'telefone', label: 'Telefone', field: 'telephone', align: 'left', sortable: true },
  { name: 'site', label: 'Site', field: 'site', align: 'left', sortable: true },
];

// 3. PROPRIEDADE COMPUTADA (Lógica de Filtragem)
// Filtra o array de editoras baseado no texto da pesquisa.
const editorasFiltradas = computed(() => {
  if (!pesquisa.value) {
    return allEditoras.value;
  }
  const termo = pesquisa.value.toLowerCase();
  
  return allEditoras.value.filter(editora => {
    // Verificamos todos os campos relevantes
    return (
      editora.name?.toLowerCase().includes(termo) ||
      editora.email?.toLowerCase().includes(termo) ||
      editora.telephone?.toLowerCase().includes(termo) ||
      editora.site?.toLowerCase().includes(termo)
    );
  });
});

// 4. MÉTODOS DE AÇÃO (Conexão com a API)

/** Busca todas as editoras na API */
async function carregarEditoras() {
  isLoading.value = true;
  try {
    const data = await EditorasService.buscarTodas();
    // A API retorna objetos com campos como 'name', 'email', etc.
    allEditoras.value = Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Falha ao carregar editoras:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar editoras.',
      caption: error.response?.data?.message || 'Verifique sua conexão ou token de acesso.',
    });
  } finally {
    isLoading.value = false;
  }
}

/** Prepara e abre o modal de cadastro */
function abrirModalCadastro() {
  // Limpa o formulário
  novaEditora.value = { nome: '', email: '', telefone: '', site: '' };
  modalCadastro.value = true;
}

/** Envia os dados da nova editora para a API */
async function cadastrarEditora() {
  try {
    const dataToSend = {
      name: novaEditora.value.nome,
      email: novaEditora.value.email,
      telephone: novaEditora.value.telefone,
      site: novaEditora.value.site,
    };
    
    await EditorasService.criar(dataToSend);
    
    $q.notify({ type: 'positive', message: 'Editora cadastrada com sucesso!' });
    modalCadastro.value = false;
    carregarEditoras(); // Recarrega a lista
    
  } catch (error) {
    console.error('Erro no cadastro:', error);
    $q.notify({ type: 'negative', message: 'Falha ao cadastrar editora.' });
  }
}

/** Prepara a linha para edição */
function editarEditora(editora) {
  // Cria uma cópia profunda dos dados da linha para não alterar o original diretamente
  editoraEditar.value = { 
    id: editora.id,
    nome: editora.name,
    email: editora.email,
    telefone: editora.telephone,
    site: editora.site,
  };
  modalEditar.value = true;
}

/** Envia a atualização para a API */
async function atualizarEditora() {
  try {
    const dataToSend = {
      name: editoraEditar.value.nome,
      email: editoraEditar.value.email,
      telephone: editoraEditar.value.telefone,
      site: editoraEditar.value.site,
    };
    
    await EditorasService.atualizar(editoraEditar.value.id, dataToSend);
    
    $q.notify({ type: 'positive', message: 'Editora atualizada com sucesso!' });
    modalEditar.value = false;
    carregarEditoras(); // Recarrega a lista
    
  } catch (error) {
    console.error('Erro na atualização:', error);
    $q.notify({ type: 'negative', message: 'Falha ao atualizar editora.' });
  }
}

/** Prepara e abre o modal de confirmação de exclusão */
function confirmarExcluir(editora) {
  editoraExcluir.value = editora;
  modalExcluir.value = true;
}

/** Executa a exclusão na API */
async function excluirEditora() {
  try {
    await EditorasService.deletar(editoraExcluir.value.id);
    
    $q.notify({ type: 'positive', message: 'Editora excluída com sucesso!' });
    modalExcluir.value = false;
    carregarEditoras(); // Recarrega a lista
    
  } catch (error) {
    console.error('Erro na exclusão:', error);
    $q.notify({ type: 'negative', message: 'Falha ao excluir editora.' });
  }
}

// 5. CICLO DE VIDA (onMounted substitui window.onload)
// Inicia o carregamento dos dados quando o componente é montado.
onMounted(() => {
  carregarEditoras();
});
</script>