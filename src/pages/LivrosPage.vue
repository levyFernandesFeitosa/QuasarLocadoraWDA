<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <div class="titulo q-mb-sm flex items-center">
            <q-icon
              name="menu_book"
              size="32px"
              class="q-mr-sm"
              color="primary"
            />
            Livros
          </div>
        </div>

        <div class="col-6 col-md-2">
          <q-btn
            class="CadastroBTN"
            label="Cadastrar"
            color="primary"
            @click="abrirModalCadastro"
          />
        </div>

        <div class="col-6 col-md-4">
          <q-input
            class="pesquisaALL"
            standout
            v-model="termoPesquisa"
            label="Pesquisar Livro"
            debounce="300"
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table
      :rows="livros"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[5, 10, 20]"
      :loading="carregando"
      :filter="termoPesquisa"
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
            <span v-if="col.name === 'publisher'">{{
              props.row.publisher?.name || "N/A"
            }}</span>
            <span v-else>{{ col.value }}</span>
          </q-td>
          <q-td>
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              @click="abrirModalEdicao(props.row)"
            />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click="confirmarExclusao(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" label="Carregando livros..." />
      </template>
    </q-table>

    <q-dialog v-model="modalAberto">
      <q-card class="modal">
        <q-form @submit.prevent="salvarLivro" style="width: 100%; height: 90%">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{ editando ? "Atualizar Livro" : "Cadastrar Livro" }}
            </div>

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.name"
              label="Título do Livro"
              :error="errosCadastro.name"
              error-color="negative"
              @input="validarCampo('name')"
            />

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.author"
              label="Autor"
              :error="errosCadastro.author"
              error-color="negative"
              @input="validarCampo('author')"
            />

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.launchDate"
              label="Data de Lançamento"
              type="date"
              stack-label
              :error="errosCadastro.launchDate"
              error-color="negative"
              @input="validarCampo('launchDate')"
            />

            <q-input
              class="inputModal"
              outlined
              v-model.number="livroForm.totalQuantity"
              label="Quantidade Total"
              type="number"
              :disable="editando"
              :error="errosCadastro.totalQuantity"
              error-color="negative"
              @input="validarCampo('totalQuantity')"
            />

            <q-select
              class="inputModalSelect"
              id="inputModalSelectGrande"
              outlined
              v-model="livroForm.publisherName"
              :options="opcoesEditoras"
              label="Editora"
              :error="errosCadastro.publisherName"
              error-color="negative"
              @update:model-value="validarCampo('publisherName')"
            />
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="editando ? 'Atualizar' : 'Cadastrar'"
              color="primary"
              type="submit"
              :loading="salvando"
            />
            <q-btn class="modalBTN" label="Cancelar" @click="fecharModal" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%">
        <q-card-section class="conteudoModal">
          <div class="text-h6">Certeza que deseja excluir esse Livro?</div>
          <div class="text-h6">Após essa ação não haverá retorno.</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            label="Excluir"
            color="negative"
            @click="deletarLivroConfirmado"
          />
          <q-btn
            class="modalBTN"
            label="Voltar"
            flat
            @click="modalExcluir = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import LivrosService from "src/services/livrosService";

const $q = useQuasar();

// --- ADICIONADO PARA VALIDAÇÃO MANUAL ---
const errosCadastro = ref({});
// O ref 'formLivro' do Q-Form não é mais estritamente necessário para a validação,
// mas pode ser mantido se quiser usar o Q-Form no futuro. Por enquanto, a
// validação será feita manualmente.
// ----------------------------------------

// --- Reatividade de Dados e Tabela
const livros = ref([]);
const carregando = ref(true);
const termoPesquisa = ref("");
const opcoesEditoras = ref([]);

const livroForm = ref({
  id: null,
  name: "",
  author: "",
  launchDate: "",
  totalQuantity: null,
  totalInUse: 0,
  publisherName: "",
});

// Variáveis de Estado dos Modais
const modalAberto = ref(false);
const editando = ref(false);
const salvando = ref(false);
const modalExcluir = ref(false);
const livroParaDeletarId = ref(null);

// Colunas da Tabela
const columns = [
  
  {
    name: "name",
    label: "Título",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "author",
    label: "Autor",
    field: "author",
    align: "left",
    sortable: true,
  },
  // Formatando a data para exibir apenas AAAA-MM-DD
  {
    name: "launchDate",
    label: "Lançamento",
    field: "launchDate",
    align: "center",
    sortable: true,
    format: (val) => (val ? val.substring(0, 10) : "N/A"),
  },
  {
    name: "totalQuantity",
    label: "Total",
    field: "totalQuantity",
    align: "center",
    sortable: true,
  },
  {
    name: "totalInUse",
    label: "Em Uso",
    field: "totalInUse",
    align: "center",
    sortable: true,
  },
  {
    name: "publisher",
    label: "Editora",
    field: (row) => row.publisher?.name || "N/A",
    align: "left",
    sortable: true,
  },
];

// --- Funções de Validação Manual (Copiadas/Adaptadas de Locatários) ---

const validarCampo = (campo) => {
  // Para inputs de texto/data:
  if (
    campo !== "publisherName" &&
    (!livroForm.value[campo] || livroForm.value[campo].toString().trim() === "")
  ) {
    errosCadastro.value[campo] = true;
  }
  // Para Q-Select e números (que podem ser 0 ou null)
  else if (campo === "publisherName" && !livroForm.value[campo]) {
    errosCadastro.value[campo] = true;
  }
  // Para quantidade (verifica se é nulo/vazio OU se é zero ou negativo)
  else if (
    campo === "totalQuantity" &&
    (!livroForm.value[campo] ||
      isNaN(livroForm.value[campo]) ||
      livroForm.value[campo] <= 0)
  ) {
    errosCadastro.value[campo] = true;
  } else {
    delete errosCadastro.value[campo];
  }
};

const validarFormulario = () => {
  errosCadastro.value = {};
  let valido = true;

  // Lista de campos OBRIGATÓRIOS do Livro
  const camposObrigatorios = [
    "name",
    "author",
    "launchDate",
    "totalQuantity",
    "publisherName",
  ];

  camposObrigatorios.forEach((campo) => {
    // Validação básica para campos de texto/select
    if (
      !livroForm.value[campo] ||
      livroForm.value[campo].toString().trim() === ""
    ) {
      errosCadastro.value[campo] = true;
      valido = false;
    }
    // Validação específica para quantidade (deve ser um número > 0)
    if (
      campo === "totalQuantity" &&
      (livroForm.value.totalQuantity <= 0 ||
        isNaN(livroForm.value.totalQuantity))
    ) {
      errosCadastro.value[campo] = true;
      valido = false;
    }
  });
  return valido;
};

// -----------------------------------------------------------------------

// --- Funções de API

async function carregarTudo() {
  carregando.value = true;
  try {
    const editoras = await LivrosService.carregarEditoras();
    opcoesEditoras.value = editoras.map((e) => e.name);
    livros.value = await LivrosService.buscarTodos();
  } catch (error) {
    console.error("Falha geral ao carregar dados:", error);
    $q.notify({
      type: "negative",
      message:
        error.message ||
        "Erro ao carregar dados da API. Verifique o servidor/rede.",
    });
    livros.value = [];
  } finally {
    carregando.value = false;
  }
}

// --- Funções de Modal

function limparFormulario() {
  livroForm.value = {
    id: null,
    name: "",
    author: "",
    launchDate: "",
    totalQuantity: null,
    totalInUse: 0,
    publisherName: "",
  };
  errosCadastro.value = {}; // IMPORTANTE: Limpar os erros
}

function fecharModal() {
  modalAberto.value = false;
  limparFormulario();
}

function abrirModalCadastro() {
  editando.value = false;
  limparFormulario();
  modalAberto.value = true;
}

function abrirModalEdicao(livro) {
  editando.value = true;
  errosCadastro.value = {}; // Limpar erros na edição
  const launchDateString = livro.launchDate
    ? livro.launchDate.substring(0, 10)
    : "";

  livroForm.value = {
    id: livro.id,
    name: livro.name,
    author: livro.author,
    launchDate: launchDateString,
    totalQuantity: livro.totalQuantity,
    totalInUse: livro.totalInUse,
    publisherName: livro.publisher?.name || "",
  };
  modalAberto.value = true;
}

// --- FUNÇÃO DE CADASTRO/ATUALIZAÇÃO COM VALIDAÇÃO MANUAL ---
async function salvarLivro() {
  // 1. VALIDAÇÃO: Chama a função manual que marca os campos vazios
  if (!validarFormulario()) {
    $q.notify({
      type: "warning",
      message: "Preencha todos os campos obrigatórios para salvar.",
    });
    return; // Para a execução se a validação falhar
  }

  // 2. SALVAMENTO (se o formulário for válido)
  salvando.value = true;
  try {
    if (editando.value) {
      await LivrosService.atualizar(livroForm.value.id, livroForm.value);
      $q.notify({ type: "positive", message: "Livro atualizado com sucesso!" });
    } else {
      await LivrosService.cadastrar(livroForm.value);
      $q.notify({ type: "positive", message: "Livro cadastrado com sucesso!" });
    }

    await carregarTudo();
    fecharModal();
  } catch (error) {
    let errorMessage = error.message || "Erro ao salvar o livro.";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
    });
  } finally {
    salvando.value = false;
  }
}

// --- Funções de Exclusão

function confirmarExclusao(id) {
  livroParaDeletarId.value = id;
  modalExcluir.value = true;
}

async function deletarLivroConfirmado() {
  modalExcluir.value = false;
  carregando.value = true;
  try {
    await LivrosService.deletar(livroParaDeletarId.value);
    $q.notify({ type: "positive", message: "Livro deletado com sucesso!" });
    await carregarTudo();
  } catch (error) {
    let errorMessage = error.message || "Erro ao deletar o livro.";

    if (error.response?.status === 400) {
      errorMessage =
        "Não foi possível deletar o livro. Ele está vinculado a um ou mais aluguéis ativos.";
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
    });
  } finally {
    carregando.value = false;
  }
}

// --- Inicialização
onMounted(() => {
  carregarTudo();
});
</script>