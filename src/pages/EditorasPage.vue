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
              name="library_books"
              size="32px"
              class="q-mr-sm"
              color="primary"
            />
            {{ $t('PublishersPage.title') }}
          </div>
        </div>

        <div class="col-6 col-md-2">
          <q-btn
            class="CadastroBTN"
            :label="$t('PublishersPage.register_button')"
            color="primary"
            @click="abrirModalCadastro"
          />
        </div>

        <div class="col-6 col-md-4">
          <q-input
            class="pesquisaALL"
            standout
            v-model="pesquisa"
            :label="$t('PublishersPage.search_placeholder')"
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
          <q-th>{{ $t('PublishersPage.actions_header') }}</q-th>
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

    <q-dialog v-model="modalCadastro">
      <q-card class="modal" style="max-height: 80%; width: 100%">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">{{ $t('PublishersPage.modal_register_title') }}</div>
          
          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.nome"
            :label="$t('PublishersPage.input_name_label')"
            :error="errosCadastro.nome"
            error-color="negative"
            @input="validarCampo('nome')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.email"
            :label="$t('PublishersPage.input_email_label')"
            type="email"
            :error="errosCadastro.email"
            error-color="negative"
            @input="validarCampo('email')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.telefone"
            :label="$t('PublishersPage.input_phone_label')"
            :error="errosCadastro.telefone"
            error-color="negative"
            @input="validarCampo('telefone')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.site"
            :label="$t('PublishersPage.input_website_label')"
            :error="errosCadastro.site"
            error-color="negative"
            @input="validarCampo('site')"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.register_button')"
            color="primary"
            @click="cadastrarEditora"
          />
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.cancel_button')"
            @click="modalCadastro = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalEditar">
      <q-card class="modal" style="max-height: 80%; width: 100%">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">{{ $t('PublishersPage.modal_update_title') }}</div>
          
          <q-input
            class="inputModal"
            v-model="editoraEditar.nome"
            :label="$t('PublishersPage.input_name_label')"
            :error="errosEdicao.nome"
            :error-message="errosEdicao.nome ? $t('PublishersPage.validation_required') : ''"
            @input="validarCampo('nome', 'edicao')"
            required
          />
          <q-input
            class="inputModal"
            v-model="editoraEditar.email"
            :label="$t('PublishersPage.input_email_label')"
            type="email"
            :error="errosEdicao.email"
            :error-message="errosEdicao.email ? $t('PublishersPage.validation_required') : ''"
            @input="validarCampo('email', 'edicao')"
            required
          />
          <q-input
            class="inputModal"
            v-model="editoraEditar.telefone"
            :label="$t('PublishersPage.input_phone_label')"
            :error="errosEdicao.telefone"
            :error-message="errosEdicao.telefone ? $t('PublishersPage.validation_required') : ''"
            @input="validarCampo('telefone', 'edicao')"
            required
          />
          <q-input
            class="inputModal"
            v-model="editoraEditar.site"
            :label="$t('PublishersPage.input_website_label')"
            :error="errosEdicao.site"
            :error-message="errosEdicao.site ? $t('PublishersPage.validation_required') : ''"
            @input="validarCampo('site', 'edicao')"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.update_button')"
            color="primary"
            @click="atualizarEditora"
          />
          <q-btn 
            class="modalBTN" 
            :label="$t('PublishersPage.close_button')" 
            @click="modalEditar = false" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%">
        <q-card-section class="conteudoModal">
          <div class="text-h6">{{ $t('PublishersPage.confirm_delete_q1') }}</div>
          <div class="q-mt-sm">{{ $t('PublishersPage.confirm_delete_q2') }}</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.delete_button')"
            color="negative"
            @click="excluirEditora"
          />
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.back_button')"
            @click="modalExcluir = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"; // Incluindo 'watch'
import { useQuasar } from "quasar";
import { useI18n } from 'vue-i18n'; // <-- Importar i18n
import EditorasService from "src/services/editorasService"; 

const $q = useQuasar();
const { t, locale } = useI18n(); // <-- Injetar 't' e 'locale'

// ===================================================
// 1. ESTADO REATIVO
// ===================================================
const allEditoras = ref([]);
const pesquisa = ref("");
const isLoading = ref(true);

// Variáveis para Modais
const modalCadastro = ref(false);
const modalEditar = ref(false);
const modalExcluir = ref(false);

// Objeto para Cadastro
const novaEditora = ref({
  nome: "",
  email: "",
  telefone: "",
  site: "",
});

// Objeto para Edição e Exclusão (armazena a linha selecionada)
const editoraEditar = ref({});
const editoraExcluir = ref({});

// Objeto para ERROS de Cadastro (Controla a cor vermelha)
const errosCadastro = ref({
  nome: false,
  email: false,
  telefone: false,
  site: false,
});

// Objeto para ERROS de Edição (Controla a cor vermelha)
const errosEdicao = ref({
  nome: false,
  email: false,
  telefone: false,
  site: false,
});

// ===================================================
// 2. COLUNAS DA TABELA (AGORA COMPUTADA para reatividade do idioma)
// ===================================================
const columns = computed(() => [
  { name: "name", label: t('PublishersPage.column_name'), field: "name", align: "left", sortable: true },
  { name: "email", label: t('PublishersPage.column_email'), field: "email", align: "left", sortable: true },
  { name: "telefone", label: t('PublishersPage.column_phone'), field: "telephone", align: "left", sortable: true },
  { name: "site", label: t('PublishersPage.column_website'), field: "site", align: "left", sortable: true },
]);

// ===================================================
// 3. PROPRIEDADE COMPUTADA (Lógica de Filtragem)
// ===================================================
const editorasFiltradas = computed(() => {
  if (!pesquisa.value) {
    return allEditoras.value;
  }
  const termo = pesquisa.value.toLowerCase();

  return allEditoras.value.filter((editora) => {
    return (
      editora.name?.toLowerCase().includes(termo) ||
      editora.email?.toLowerCase().includes(termo) ||
      editora.telephone?.toLowerCase().includes(termo) ||
      editora.site?.toLowerCase().includes(termo)
    );
  });
});

// ===================================================
// 4. MÉTODOS DE VALIDAÇÃO E AÇÃO (Notificações traduzidas)
// ===================================================

/**
 * Limpa o estado de erro de um campo ao digitar.
 * @param {string} campo - O nome do campo (ex: 'nome', 'email').
 * @param {string} tipo - 'cadastro' ou 'edicao' para saber qual objeto de erro usar.
 */
function validarCampo(campo, tipo = 'cadastro') {
  if (tipo === 'cadastro') {
    errosCadastro.value[campo] = false;
  } else {
    errosEdicao.value[campo] = false;
  }
}

/**
 * Valida se todos os campos do formulário de Cadastro estão preenchidos.
 */
function validarFormularioCadastro() {
  let valido = true;
  const campos = ['nome', 'email', 'telefone', 'site'];

  campos.forEach(campo => {
    if (!novaEditora.value[campo] || novaEditora.value[campo].trim() === "") {
      errosCadastro.value[campo] = true;
      valido = false;
    } else {
      errosCadastro.value[campo] = false;
    }
  });

  return valido;
}

/**
 * Valida se todos os campos do formulário de Edição estão preenchidos.
 */
function validarFormularioEdicao() {
  let valido = true;
  const campos = ['nome', 'email', 'telefone', 'site'];

  campos.forEach(campo => {
    if (!editoraEditar.value[campo] || editoraEditar.value[campo].trim() === "") {
      errosEdicao.value[campo] = true;
      valido = false;
    } else {
      errosEdicao.value[campo] = false;
    }
  });

  return valido;
}


/** Busca todas as editoras na API */
async function carregarEditoras() {
  isLoading.value = true;
  try {
    const data = await EditorasService.buscarTodas();
    // A API retornou os dados? Se for um objeto, coloca em um array. Se for array, usa o array.
    allEditoras.value = Array.isArray(data) ? data : [data].filter(d => d);
  } catch (error) {
    console.error("Falha ao carregar editoras:", error);
    $q.notify({
      type: "negative",
      // Usa $t() para a mensagem de erro padrão
      message: t('PublishersPage.error_load_default'),
      caption: error.response?.data?.message || t('PublishersPage.error_connection'),
    });
  } finally {
    isLoading.value = false;
  }
}

/** Prepara e abre o modal de cadastro */
function abrirModalCadastro() {
  // Limpa o formulário e erros
  novaEditora.value = { nome: "", email: "", telefone: "", site: "" };
  errosCadastro.value = { nome: false, email: false, telefone: false, site: false };
  modalCadastro.value = true;
}

/** Envia os dados da nova editora para a API */
async function cadastrarEditora() {
  if (!validarFormularioCadastro()) {
    // Usa $t()
    $q.notify({
      type: "negative",
      message: t('PublishersPage.validation_fill_all'),
    });
    return;
  }

  try {
    const dataToSend = {
      name: novaEditora.value.nome,
      email: novaEditora.value.email,
      telephone: novaEditora.value.telefone,
      site: novaEditora.value.site,
    };

    await EditorasService.criar(dataToSend);

    // Usa $t()
    $q.notify({ type: "positive", message: t('PublishersPage.success_register') });
    modalCadastro.value = false;
    carregarEditoras();
  } catch (error) {
    console.error("Erro no cadastro:", error);
    // Usa $t()
    $q.notify({ 
        type: "negative", 
        message: error.response?.data?.message || t('PublishersPage.error_register_default') 
    });
  }
}

/** Prepara a linha para edição */
function editarEditora(editora) {
  // Cria uma cópia profunda dos dados da linha
  editoraEditar.value = {
    id: editora.id,
    nome: editora.name,
    email: editora.email,
    telefone: editora.telephone,
    site: editora.site,
  };
  // Limpa os erros de validação de edição
  errosEdicao.value = { nome: false, email: false, telefone: false, site: false };
  modalEditar.value = true;
}

/** Envia a atualização para a API */
async function atualizarEditora() {
  if (!validarFormularioEdicao()) {
    // Usa $t()
    $q.notify({
      type: "negative",
      message: t('PublishersPage.validation_fill_all'),
    });
    return;
  }

  try {
    const dataToSend = {
      name: editoraEditar.value.nome,
      email: editoraEditar.value.email,
      telephone: editoraEditar.value.telefone,
      site: editoraEditar.value.site,
    };

    await EditorasService.atualizar(editoraEditar.value.id, dataToSend);

    // Usa $t()
    $q.notify({ type: "positive", message: t('PublishersPage.success_update') });
    modalEditar.value = false;
    carregarEditoras();
  } catch (error) {
    console.error("Erro na atualização:", error);
    // Usa $t()
    $q.notify({ 
        type: "negative", 
        message: error.response?.data?.message || t('PublishersPage.error_update_default') 
    });
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

    // Usa $t()
    $q.notify({ type: "positive", message: t('PublishersPage.success_delete') });
    modalExcluir.value = false;
    carregarEditoras();
  } catch (error) {
    console.error("Erro na exclusão:", error);
    let errorMessage = t('PublishersPage.error_delete_default');
    
    if (error.response?.status === 400) {
        // Mensagem mais específica se estiver ligada a livros, por exemplo.
        errorMessage = t('PublishersPage.error_delete_linked');
    } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
    }

    $q.notify({ 
        type: "negative", 
        message: errorMessage,
        timeout: 7000 
    });
  }
}

// 5. CICLO DE VIDA E WATCHER
onMounted(() => {
  carregarEditoras();
});

// Adiciona o watcher para reatividade do idioma na tela
watch(locale, () => {
    $q.notify({ 
      type: 'info', 
      message: t('general.language_updated'), // Assume que você tem uma chave 'general.language_updated'
      timeout: 1000 
    });
});
</script>