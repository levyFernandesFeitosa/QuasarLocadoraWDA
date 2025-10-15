<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm flex-md-row flex-column">
        <div class="col-grow col-md-6 order-xs-2 order-md-1">
          <div class="titulo flex items-center">
            <q-icon
              name="menu_book"
              size="32px"
              class="q-mr-sm"
              color="primary"
            />
            <span class="text-white text-weight-bold ellipsis">{{
              $t("BooksPage.title")
            }}</span>
          </div>
        </div>

        <div
          class="col-auto col-md-2 order-xs-3 order-md-2 q-ml-auto q-ml-md-none"
        >
          <q-btn
            class="CadastroBTN full-width"
            :label="$t('BooksPage.register_button')"
            color="primary"
            @click="abrirModalCadastro"
            icon="person_add"
          />
        </div>

        <div class="col-12 col-md-4 order-xs-1 order-md-3">
          <q-input
            class="pesquisaALL"
            standout
            v-model="termoPesquisa"
            :label="$t('BooksPage.search_placeholder')"
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
      :grid="$q.screen.lt.md"
      :hide-header="$q.screen.lt.md"
      :rows-per-page-options="[5, 10, 20, 0]"
      :pagination="{
        page: 1,
        // Em telas pequenas (lt.md), rowsPerPage=0 exibe todos os itens, confiando no scroll da página
        rowsPerPage: $q.screen.lt.md ? 0 : 5,
      }"
      :hide-pagination="$q.screen.lt.md"
      :loading="carregando"
      :filter="termoPesquisa"
    >
      <template v-slot:header="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>{{ $t("BooksPage.actions_header") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'publisher'">{{
              props.row.publisher?.name || $t("BooksPage.not_applicable")
            }}</span>
            <span v-else-if="col.name === 'launchDate'">{{
              col.format(col.value)
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

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <q-card class="q-mb-md card-mobile" style="background-color: #f5f5f5">
            <q-card-section>
              <div
                v-for="col in props.cols"
                :key="col.name"
                class="row q-mb-xs"
              >
                <div class="col-5 text-weight-bold text-grey-7">
                  {{ col.label }}:
                </div>
                <div class="col-7 text-black">
                  <span v-if="col.name === 'publisher'">
                    {{
                      props.row.publisher?.name ||
                      $t("BooksPage.not_applicable")
                    }}
                  </span>
                  <span v-else-if="col.name === 'launchDate'">
                    {{ col.format(col.value) }}
                  </span>
                  <span v-else>
                    {{ col.value }}
                  </span>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
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
            </q-card-actions>
          </q-card>
        </div>
      </template>
      <template v-slot:loading>
        <q-inner-loading
          showing
          color="primary"
          :label="$t('BooksPage.loading_books')"
        />
      </template>
    </q-table>
    <q-dialog v-model="modalAberto">
      <q-card class="modal">
        <q-form @submit.prevent="salvarLivro" style="width: 100%; height: 90%">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{
                editando
                  ? $t("BooksPage.modal_update_title")
                  : $t("BooksPage.modal_register_title")
              }}
            </div>

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.name"
              :label="$t('BooksPage.input_title_label')"
              :error="errosCadastro.name"
              error-color="negative"
              @input="validarCampo('name')"
            />

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.author"
              :label="$t('BooksPage.input_author_label')"
              :error="errosCadastro.author"
              error-color="negative"
              @input="validarCampo('author')"
            />

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.launchDate"
              :label="$t('BooksPage.input_launch_date_label')"
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
              :label="$t('BooksPage.input_total_quantity_label')"
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
              :label="$t('BooksPage.input_publisher_label')"
              :error="errosCadastro.publisherName"
              error-color="negative"
              @update:model-value="validarCampo('publisherName')"
            />
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="
                editando
                  ? $t('BooksPage.update_button')
                  : $t('BooksPage.register_button')
              "
              color="primary"
              type="submit"
              :loading="salvando"
            />
            <q-btn
              class="modalBTN"
              :label="$t('BooksPage.cancel_button')"
              @click="fecharModal"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="">
        <q-card-section class="conteudoModal text-center">
          <div class="text-h6 lt-sm:text-body1">
            {{ $t("BooksPage.confirm_delete_q1") }}
            {{ $t("BooksPage.confirm_delete_q2") }}
          </div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('BooksPage.delete_button')"
            color="negative"
            @click="deletarLivroConfirmado"
          />
          <q-btn
            class="modalBTN"
            :label="$t('BooksPage.back_button')"
            flat
            @click="modalExcluir = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import LivrosService from "src/services/livrosService";

const $q = useQuasar();
const { t, locale } = useI18n();

// --- ADICIONADO PARA VALIDAÇÃO MANUAL ---
const errosCadastro = ref({});
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

// Colunas da Tabela (COMPUTED para reatividade do idioma)
const columns = computed(() => [
  {
    name: "name",
    label: t("BooksPage.column_title"),
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "author",
    label: t("BooksPage.column_author"),
    field: "author",
    align: "left",
    sortable: true,
  },
  // Formatando a data para exibir apenas AAAA-MM-DD
  {
    name: "launchDate",
    label: t("BooksPage.column_launch_date"),
    field: "launchDate",
    align: "center",
    sortable: true,
    format: (val) =>
      val ? val.substring(0, 10) : t("BooksPage.not_applicable"),
  },
  {
    name: "totalQuantity",
    label: t("BooksPage.column_total"),
    field: "totalQuantity",
    align: "center",
    sortable: true,
  },
  {
    name: "totalInUse",
    label: t("BooksPage.column_in_use"),
    field: "totalInUse",
    align: "center",
    sortable: true,
  },
  {
    name: "publisher",
    label: t("BooksPage.column_publisher"),
    // O field é uma função para extrair o nome da editora
    field: (row) => row.publisher?.name || t("BooksPage.not_applicable"),
    align: "left",
    sortable: true,
  },
]);

// --- Funções de Validação Manual (Mantidas) ---

const validarCampo = (campo) => {
  if (
    campo !== "publisherName" &&
    (!livroForm.value[campo] || livroForm.value[campo].toString().trim() === "")
  ) {
    errosCadastro.value[campo] = true;
  } else if (campo === "publisherName" && !livroForm.value[campo]) {
    errosCadastro.value[campo] = true;
  } else if (
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

  const camposObrigatorios = [
    "name",
    "author",
    "launchDate",
    "totalQuantity",
    "publisherName",
  ];

  camposObrigatorios.forEach((campo) => {
    if (
      !livroForm.value[campo] ||
      livroForm.value[campo].toString().trim() === ""
    ) {
      errosCadastro.value[campo] = true;
      valido = false;
    }
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

// --- Funções de API (Notificações traduzidas)

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
      message: error.message || t("BooksPage.error_load_default"),
      caption: error.response?.data?.message || t("BooksPage.error_connection"),
    });
    livros.value = [];
  } finally {
    carregando.value = false;
  }
}

// --- Funções de Modal (Mantidas)

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
  errosCadastro.value = {};
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
  errosCadastro.value = {};
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

// --- FUNÇÃO DE CADASTRO/ATUALIZAÇÃO COM VALIDAÇÃO MANUAL (Notificações traduzidas)
async function salvarLivro() {
  // 1. VALIDAÇÃO: Chama a função manual que marca os campos vazios
  if (!validarFormulario()) {
    $q.notify({
      type: "warning",
      message: t("BooksPage.validation_fill_all"),
    });
    return;
  }

  // 2. SALVAMENTO (se o formulário for válido)
  salvando.value = true;
  try {
    if (editando.value) {
      await LivrosService.atualizar(livroForm.value.id, livroForm.value);
      $q.notify({ type: "positive", message: t("BooksPage.success_update") });
    } else {
      await LivrosService.cadastrar(livroForm.value);
      $q.notify({ type: "positive", message: t("BooksPage.success_register") });
    }

    await carregarTudo();
    fecharModal();
  } catch (error) {
    let errorMessage = t("BooksPage.error_save_default");

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

// --- Funções de Exclusão (Notificações traduzidas)

function confirmarExclusao(id) {
  livroParaDeletarId.value = id;
  modalExcluir.value = true;
}

async function deletarLivroConfirmado() {
  modalExcluir.value = false;
  carregando.value = true;
  try {
    await LivrosService.deletar(livroParaDeletarId.value);
    $q.notify({ type: "positive", message: t("BooksPage.success_delete") });
    await carregarTudo();
  } catch (error) {
    let errorMessage = t("BooksPage.error_delete_default");

    if (error.response?.status === 400) {
      errorMessage = t("BooksPage.error_delete_linked");
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

// --- Inicialização e Watcher

onMounted(() => {
  carregarTudo();
});

// Watcher para reatividade do idioma na tela
watch(locale, () => {
  $q.notify({
    type: "info",
    message: t("general.language_updated") || "Idioma atualizado",
    timeout: 1000,
  });
});
</script>