<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <div class="titulo q-mb-sm flex items-center">
            <q-icon name="event" size="32px" class="q-mr-sm" color="primary" />
            {{ $t('RentalsPage.title') }}
          </div>
        </div>

        <div class="col-6 col-md-2">
          <q-btn
            class="CadastroBTN"
            :label="$t('RentalsPage.register_button')"
            color="primary"
            @click="openCreateModal"
          />
        </div>

        <div class="col-6 col-md-4">
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
      :filter="searchTerm"
      :rows-per-page-options="[5, 10, 15]"
      :loading="loading"
    >
      <template v-slot:header="props">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>{{ $t('RentalsPage.actions_header') }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td>
            <q-btn
              v-if="props.row.status === 'RENTED' || props.row.status === 'IN_TIME' || props.row.status === 'LATE'"
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
      
      <template v-slot:loading>
        <q-inner-loading showing color="primary" :label="$t('RentalsPage.loading_rentals')" />
      </template>
    </q-table>

    <q-dialog v-model="modalAberto">
      <q-card class="modal" style="min-width: 450px;">
        <q-form @submit.prevent="salvarAluguel" style="width: 100%;">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{ editando ? $t('RentalsPage.modal_update_title') : $t('RentalsPage.modal_register_title') }}
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
                    <q-item-label caption>{{ $t('RentalsPage.available_caption') }}: {{ scope.opt.totalAvailable }}</q-item-label>
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
              :label="editando ? $t('RentalsPage.update_button') : $t('RentalsPage.register_button')"
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
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n'; // <-- Importar i18n
import AlugueisService from "src/services/alugueisService";

const $q = useQuasar();
const { t, locale } = useI18n(); // <-- Injetar 't' e 'locale'

// --- Mapeamento de Status (COMPUTED para reatividade do idioma) ---
const statusMap = computed(() => ({
    RENTED: t('RentalsPage.status_rented'),
    IN_TIME: t('RentalsPage.status_in_time'),
    LATE: t('RentalsPage.status_late'),
    DELIVERED_ON_TIME: t('RentalsPage.status_delivered_on_time'),
    DELIVERED_WITH_DELAY: t('RentalsPage.status_delivered_with_delay'),
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
const searchTerm = ref('');

// Colunas da Tabela (COMPUTED para reatividade do idioma)
const columns = computed(() => [
    { name: 'locatario', label: t('RentalsPage.column_renter'), align: 'left', field: row => row.renter?.name || '-', sortable: true },
    { name: 'livro', label: t('RentalsPage.column_book'), align: 'left', field: row => row.book?.name || '-', sortable: true },
    { name: 'rentDate', label: t('RentalsPage.column_rent_date'), align: 'left', field: 'rentDate', format: val => formatarData(val), sortable: true },
    { name: 'deadLine', label: t('RentalsPage.column_deadline'), align: 'left', field: 'deadLine', format: val => formatarData(val), sortable: true },
    { name: 'devolutionDate', label: t('RentalsPage.column_devolution_date'), align: 'left', field: 'devolutionDate', format: val => formatarData(val), sortable: true },
    {
        name: 'status',
        label: t('RentalsPage.column_status'),
        align: 'left',
        // USA O statusMap computed
        field: row => statusMap.value[row.status] || row.status,
        sortable: true
    },
]);

// --- Funções Auxiliares (Data Formatting) ---

function formatarData(data) {
    if (!data) return t('RentalsPage.not_applicable_short');
    return data.substring(0, 10).split('-').reverse().join('/');
}

// --- Funções de Validação (Mantidas) ---

const validarCampo = (campo) => {
    if (!aluguelForm.value[campo] || aluguelForm.value[campo].toString().trim() === "") {
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
        locatariosOptions.value = dependencies.locatarios.map(r => ({ label: r.name, value: r.id }));
        livrosOptions.value = dependencies.livros.map(b => ({ label: b.name, value: b.id, totalAvailable: b.totalQuantity - b.totalInUse }));

    } catch (error) {
        $q.notify({
            type: 'negative',
            // Usa $t()
            message: t('RentalsPage.error_load_default'),
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
            message: t('RentalsPage.validation_fill_all'),
        });
        return;
    }

    salvando.value = true;
    try {
        if (editando.value) {
            await AlugueisService.updateAluguel(aluguelForm.value.id, aluguelForm.value);
            // Usa $t()
            $q.notify({ type: "positive", message: t('RentalsPage.success_update') });
        } else {
            await AlugueisService.createAluguel(aluguelForm.value);
            // Usa $t()
            $q.notify({ type: "positive", message: t('RentalsPage.success_register') });
        }

        await fetchAllData();
        fecharModal();
    } catch (error) {
        let errorMessage = t('RentalsPage.error_save_default');

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
    const BG_COLOR = '#0d1b2a';
    const TEXT_COLOR = 'white';
    const BUTTON_COLOR = '#274e55';

    $q.dialog({
        // Título e Mensagem: usam $t()
        title: `<span style="color: ${TEXT_COLOR};">${t('RentalsPage.confirm_receive_title')}</span>`,
        message: `<span style="color: ${TEXT_COLOR};">${t('RentalsPage.confirm_receive_q1')} <strong>"${aluguel.book?.name}"</strong> ${t('RentalsPage.confirm_receive_q2')}</span>`,

        html: true,
        
        // Botões: usam $t()
        cancel: {
            label: t('RentalsPage.cancel_button'),
            color: BUTTON_COLOR,
            flat: true
        },
        ok: {
            label: t('RentalsPage.confirm_button'),
            color: BUTTON_COLOR
        },

        class: 'dialogo-escuro',
        persistent: true
    }).onOk(async () => {
        try {
            const dados = {
                ...aluguel,
                devolutionDate: new Date().toISOString().split('T')[0]
            };

            await AlugueisService.updateAluguel(aluguel.id, dados);
            
            // Notificação: usa $t()
            $q.notify({ type: 'positive', message: t('RentalsPage.success_receive') });
            await fetchAllData();
        } catch (error) {
            $q.notify({
                type: 'negative',
                // Usa $t()
                message: t('RentalsPage.error_receive_default')
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
    fetchAllData();
    $q.notify({
      type: 'info',
      message: t('general.language_updated'),
      timeout: 1000
    });
});
</script>