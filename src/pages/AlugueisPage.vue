<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm flex-md-row flex-column">
        <div class="col-grow col-md-6 order-xs-2 order-md-1">
          <div class="titulo flex items-center">
            <q-icon name="event" size="32px" class="q-mr-sm" color="primary" />
            <span class="text-h6 text-white text-weight-bold ellipsis">{{
              $t("RentalsPage.title")
            }}</span>
          </div>
        </div>

        <div
          class="col-auto col-md-2 order-xs-3 order-md-2 q-ml-auto q-ml-md-none"
        >
          <q-btn
            class="CadastroBTN full-width"
            :label="$t('RentalsPage.register_button')"
            color="primary"
            @click="openCreateModal"
            icon="person_add"
          />
        </div>

        <div class="col-12 col-md-4 order-xs-1 order-md-3">
          <q-input
            class="pesquisaALL"
            standout
            v-model="searchTerm"
            :label="$t('RentalsPage.search_placeholder')"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <q-table
      :rows="alugueis"
      :columns="columns"
      row-key="id"
      :grid="$q.screen.lt.md"
      :hide-header="$q.screen.lt.md"
      :rows-per-page-options="[5, 10, 15, 0]"
      :pagination="{
        page: 1,
        // Em telas pequenas (lt.md), rowsPerPage=0 exibe todos os itens, confiando no scroll da página
        rowsPerPage: $q.screen.lt.md ? 0 : 5,
      }"
      :hide-pagination="$q.screen.lt.md"
      :filter="searchTerm"
      :loading="loading"
    >
      <template v-slot:header="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>{{ $t("RentalsPage.actions_header") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td>
            <q-btn
              v-if="
                props.row.status === 'RENTED' ||
                props.row.status === 'IN_TIME' ||
                props.row.status === 'LATE'
              "
              dense
              flat
              icon="library_add_check"
              color="green"
              :tooltip="$t('RentalsPage.tooltip_receive')"
              @click="registrarRecebimento(props.row)"
            />
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              :tooltip="$t('RentalsPage.tooltip_edit')"
              @click="openEditModal(props.row)"
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
                  {{ col.value }}
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                v-if="
                  props.row.status === 'RENTED' ||
                  props.row.status === 'IN_TIME' ||
                  props.row.status === 'LATE'
                "
                dense
                flat
                icon="library_add_check"
                color="green"
                :tooltip="$t('RentalsPage.tooltip_receive')"
                @click="registrarRecebimento(props.row)"
              />
              <q-btn
                dense
                flat
                icon="edit"
                color="primary"
                :tooltip="$t('RentalsPage.tooltip_edit')"
                @click="openEditModal(props.row)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </template>
      <template v-slot:loading>
        <q-inner-loading
          showing
          color="primary"
          :label="$t('RentalsPage.loading_rentals')"
        />
      </template>
    </q-table>
    <q-dialog v-model="modalAberto">
      <q-card class="modal">
        <q-form @submit.prevent="salvarAluguel" style="width: 100%">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{
                editando
                  ? $t("RentalsPage.modal_update_title")
                  : $t("RentalsPage.modal_register_title")
              }}
            </div>

            <q-select
              class="inputModalSelect"
              outlined
              v-model="aluguelForm.renterId"
              :options="locatariosOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :label="$t('RentalsPage.input_renter_label')"
              :error="errosCadastro.renterId"
              error-color="negative"
              @update:model-value="validarCampo('renterId')"
              :disable="editando"
            />

            <q-select
              class="inputModalSelect"
              outlined
              v-model="aluguelForm.bookId"
              :options="livrosOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :label="$t('RentalsPage.input_book_label')"
              :error="errosCadastro.bookId"
              error-color="negative"
              @update:model-value="validarCampo('bookId')"
              :disable="editando"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption
                      >{{ $t("RentalsPage.available_caption") }}:
                      {{ scope.opt.totalAvailable }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              class="inputModal"
              outlined
              v-model="aluguelForm.rentDate"
              :label="$t('RentalsPage.input_rent_date_label')"
              type="date"
              stack-label
              :error="errosCadastro.rentDate"
              error-color="negative"
              @input="validarCampo('rentDate')"
              :disable="editando"
            />

            <q-input
              class="inputModal"
              outlined
              v-model="aluguelForm.deadLine"
              :label="$t('RentalsPage.input_deadline_label')"
              type="date"
              stack-label
              :error="errosCadastro.deadLine"
              error-color="negative"
              @input="validarCampo('deadLine')"
            />
          </q-card-section>

          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="
                editando
                  ? $t('RentalsPage.update_button')
                  : $t('RentalsPage.register_button')
              "
              color="primary"
              type="submit"
              :loading="salvando"
            />
            <q-btn
              class="modalBTN"
              :label="$t('RentalsPage.cancel_button')"
              @click="fecharModal"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import AlugueisService from "src/services/alugueisService";

const $q = useQuasar();
// Desestrutura 't' e 'locale' do useI18n. 'locale' é usado na formatação de data.
const { t, locale } = useI18n(); 

// --- Mapeamento de Status (COMPUTED para reatividade do idioma) ---
const statusMap = computed(() => ({
  RENTED: t("RentalsPage.status_rented"),
  IN_TIME: t("RentalsPage.status_in_time"),
  LATE: t("RentalsPage.status_late"),
  DELIVERED_ON_TIME: t("RentalsPage.status_delivered_on_time"),
  DELIVERED_WITH_DELAY: t("RentalsPage.status_delivered_with_delay"),
}));

// --- Variáveis de Estado Reativas e Formulário ---
const alugueis = ref([]);
const loading = ref(false);

const locatariosOptions = ref([]);
const livrosOptions = ref([]);

const aluguelForm = ref({
  id: null,
  renterId: null,
  bookId: null,
  rentDate: null,
  deadLine: null,
});

const modalAberto = ref(false);
const editando = ref(false);
const salvando = ref(false);
const errosCadastro = ref({});

// --- Variáveis de Busca e Tabela ---
const searchTerm = ref("");

// Colunas da Tabela (COMPUTED para reatividade do idioma)
const columns = computed(() => [
  {
    name: "locatario",
    label: t("RentalsPage.column_renter"),
    align: "left",
    field: (row) => row.renter?.name || "-",
    sortable: true,
  },
  {
    name: "livro",
    label: t("RentalsPage.column_book"),
    align: "left",
    field: (row) => row.book?.name || "-",
    sortable: true,
  },
  {
    name: "rentDate",
    label: t("RentalsPage.column_rent_date"),
    align: "left",
    field: "rentDate",
    // Usando 'format' para a exibição na célula do body
    format: (val) => formatarData(val),
    sortable: true,
  },
  {
    name: "deadLine",
    label: t("RentalsPage.column_deadline"),
    align: "left",
    field: "deadLine",
    // Usando 'format' para a exibição na célula do body
    format: (val) => formatarData(val),
    sortable: true,
  },
  {
    name: "devolutionDate",
    label: t("RentalsPage.column_devolution_date"),
    align: "left",
    field: "devolutionDate",
    // Usando 'format' para a exibição na célula do body
    format: (val) => formatarData(val),
    sortable: true,
  },
  {
    name: "status",
    label: t("RentalsPage.column_status"),
    align: "left",
    // O 'field' agora retorna a string de status JÁ TRADUZIDA (usando statusMap computed)
    field: (row) => statusMap.value[row.status] || row.status,
    sortable: true,
  },
]);

// --- Funções Auxiliares (Data Formatting) ---

/**
 * Formata a data com base no locale ativo.
 * Se o idioma for inglês (en), usa MM/DD/YYYY.
 * Caso contrário (ex: pt-BR), usa DD/MM/YYYY.
 * @param {string} data - A data no formato YYYY-MM-DD (geralmente vinda da API/input date).
 * @returns {string} A data formatada.
 */
function formatarData(data) {
  if (!data) return t("RentalsPage.not_applicable_short");

  // O formato da data é YYYY-MM-DD
  const dateParts = data.substring(0, 10).split("-"); 
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  // Verifica se o idioma ativo é inglês ('en', 'en-US', 'en-GB', etc.)
  if (locale.value.startsWith('en')) {
    // Formato EN: Mês/Dia/Ano (MM/DD/YYYY)
    return `${month}/${day}/${year}`;
  } else {
    // Formato PT (ou padrão): Dia/Mês/Ano (DD/MM/YYYY)
    return `${day}/${month}/${year}`;
  }
}

// --- Funções de Validação (Mantidas) ---

const validarCampo = (campo) => {
  if (
    !aluguelForm.value[campo] ||
    aluguelForm.value[campo].toString().trim() === ""
  ) {
    errosCadastro.value[campo] = true;
  } else {
    delete errosCadastro.value[campo];
  }
};

const validarFormulario = () => {
  errosCadastro.value = {};
  let valido = true;

  const camposObrigatorios = ["renterId", "bookId", "rentDate", "deadLine"];

  camposObrigatorios.forEach((campo) => {
    if (!aluguelForm.value[campo]) {
      errosCadastro.value[campo] = true;
      valido = false;
    }
  });
  return valido;
};

// --- Funções de Busca da API (Notificações traduzidas) ---

async function fetchAllData() {
  loading.value = true;
  try {
    alugueis.value = await AlugueisService.getAllAlugueis();

    const dependencies = await AlugueisService.getDependencies();
    locatariosOptions.value = dependencies.locatarios.map((r) => ({
      label: r.name,
      value: r.id,
    }));
    livrosOptions.value = dependencies.livros.map((b) => ({
      label: b.name,
      value: b.id,
      totalAvailable: b.totalQuantity - b.totalInUse,
    }));
  } catch (error) {
    $q.notify({
      type: "negative",
      // Usa $t()
      message: t("RentalsPage.error_load_default"),
    });
  } finally {
    loading.value = false;
  }
}

// --- Funções de Modal (Mantidas) ---

function limparFormulario() {
  aluguelForm.value = {
    id: null,
    renterId: null,
    bookId: null,
    rentDate: null,
    deadLine: null,
  };
  errosCadastro.value = {};
}

function fecharModal() {
  modalAberto.value = false;
  limparFormulario();
}

function openCreateModal() {
  editando.value = false;
  limparFormulario();
  modalAberto.value = true;
}

function openEditModal(aluguel) {
  editando.value = true;
  errosCadastro.value = {};

  aluguelForm.value = {
    id: aluguel.id,
    renterId: aluguel.renter?.id || null,
    bookId: aluguel.book?.id || null,
    rentDate: aluguel.rentDate?.substring(0, 10) || null,
    deadLine: aluguel.deadLine?.substring(0, 10) || null,
  };
  modalAberto.value = true;
}

// --- FUNÇÃO DE CADASTRO/ATUALIZAÇÃO (Notificações traduzidas) ---
async function salvarAluguel() {
  if (!validarFormulario()) {
    $q.notify({
      type: "warning",
      // Usa $t()
      message: t("RentalsPage.validation_fill_all"),
    });
    return;
  }

  salvando.value = true;
  try {
    if (editando.value) {
      await AlugueisService.updateAluguel(
        aluguelForm.value.id,
        aluguelForm.value
      );
      // Usa $t()
      $q.notify({ type: "positive", message: t("RentalsPage.success_update") });
    } else {
      await AlugueisService.createAluguel(aluguelForm.value);
      // Usa $t()
      $q.notify({
        type: "positive",
        message: t("RentalsPage.success_register"),
      });
    }

    await fetchAllData();
    fecharModal();
  } catch (error) {
    let errorMessage = t("RentalsPage.error_save_default");

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
    });
  } finally {
    salvando.value = false;
  }
}

// --- Funções de Ações Adicionais (Aceitar Devolução - traduzidas) ---
async function registrarRecebimento(aluguel) {
  // Estilos (MANTIDOS)
  const BG_COLOR = "#0d1b2a";
  const TEXT_COLOR = "white";
  const BUTTON_COLOR = "#274e55";

  $q.dialog({
    // Título e Mensagem: usam $t()
    title: `<span style="color: ${TEXT_COLOR};">${t(
      "RentalsPage.confirm_receive_title"
    )}</span>`,
    message: `<span style="color: ${TEXT_COLOR};">${t(
      "RentalsPage.confirm_receive_q1"
    )} <strong>"${aluguel.book?.name}"</strong> ${t(
      "RentalsPage.confirm_receive_q2"
    )}</span>`,

    html: true,

    // Botões: usam $t()
    cancel: {
      label: t("RentalsPage.cancel_button"),
      color: BUTTON_COLOR,
      flat: true,
    },
    ok: {
      label: t("RentalsPage.confirm_button"),
      color: BUTTON_COLOR,
    },

    class: "dialogo-escuro",
    persistent: true,
  }).onOk(async () => {
    try {
      const dados = {
        ...aluguel,
        devolutionDate: new Date().toISOString().split("T")[0],
      };

      await AlugueisService.updateAluguel(aluguel.id, dados);

      // Notificação: usa $t()
      $q.notify({
        type: "positive",
        message: t("RentalsPage.success_receive"),
      });
      await fetchAllData();
    } catch (error) {
      $q.notify({
        type: "negative",
        // Usa $t()
        message: t("RentalsPage.error_receive_default"),
      });
    }
  });
}

// --- Inicialização e Watcher
onMounted(() => {
  fetchAllData();
});

// Watcher para reatividade do idioma na tela
watch(locale, () => {
  // Recarrega todos os dados para que as colunas e o statusMap sejam atualizados.
  // Isso garante que a função formatarData(val) nas colunas seja reavaliada com o novo locale.
  fetchAllData(); 
  $q.notify({
    type: "info",
    message: t("general.language_updated"),
    timeout: 1000,
  });
});
</script>