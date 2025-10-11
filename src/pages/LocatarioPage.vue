<template >
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <div class="titulo q-mb-sm flex items-center">
            <q-icon name="people" size="32px" class="q-mr-sm" color="primary" />
            {{ $t('RentersPage.title') }}
          </div>
        </div>

        <div class="col-6 col-md-2">
          <q-btn
            class="CadastroBTN"
            :label="$t('RentersPage.register_button')"
            color="primary"
            @click="abrirModalCadastro"
          />
        </div>

        <div class="col-6 col-md-4">
          <q-input
            class="pesquisaALL"
            standout
            v-model="pesquisa"
            :label="$t('RentersPage.search_placeholder')"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table
      :rows="locatariosFiltrados"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="$q.screen.lt.md ? [] : [5, 10, 20]"
      :pagination="{
        page: 1,
        rowsPerPage: $q.screen.lt.md ? 0 : 5,
      }"
      flat
      bordered
    >
      <template v-slot:header="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>{{ $t('RentersPage.actions_header') }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td>
            <q-btn
              dense
              flat
              icon="edit"
              color="positive"
              @click="editarLocatario(props.row)"
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

      <template v-slot:item="props" v-else>
        <q-card class="q-mb-md card-mobile">
          <q-card-section>
            <div v-for="col in props.cols" :key="col.name" class="row q-mb-xs">
              <div class="col-5 text-weight-bold text-primary">
                {{ col.label }}
              </div>
              <div class="col-7">
                {{ col.value }}
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
              @click="editarLocatario(props.row)"
            />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click="confirmarExcluir(props.row)"
            />
          </q-card-actions>
        </q-card>
      </template>
    </q-table>

    <q-dialog v-model="modalCadastro">
      <q-card class="modal " id="modalGrande">
        <div class="tituloModal">{{ $t('RentersPage.modal_register_title') }}</div>
        <q-card-section class="conteudoModal">
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.nome"
            :label="$t('RentersPage.input_name_label')"
            :error="errosCadastro.nome"
            error-color="negative"
            @input="validarCampo('nome')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.email"
            :label="$t('RentersPage.input_email_label')"
            type="email"
            :error="errosCadastro.email"
            error-color="negative"
            @input="validarCampo('email')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.telefone"
            :label="$t('RentersPage.input_phone_label')"
            :error="errosCadastro.telefone"
            error-color="negative"
            @input="validarCampo('telefone')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.cpf"
            :label="$t('RentersPage.input_cpf_label')"
            :error="errosCadastro.cpf"
            error-color="negative"
            @input="validarCampo('cpf')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.endereco"
            :label="$t('RentersPage.input_address_label')"
            :error="errosCadastro.endereco"
            error-color="negative"
            @input="validarCampo('endereco')"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage.register_button')"
            color="primary"
            @click="cadastrarLocatario"
          />
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage.cancel_button')"
            @click="modalCadastro = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalEditar">
      <q-card class="modal" id="modalGrande">
        <div class="tituloModal">{{ $t('RentersPage.modal_update_title') }}</div>
        <q-card-section class="conteudoModal">
          
          <q-input
            class="inputModal"
            v-model="locatarioEditar.nome"
            :label="$t('RentersPage.input_name_label')"
            :color="errosCadastro.nome ? 'negative' : 'primary'"
            :error-message="$t('RentersPage.validation_required')"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.email"
            :label="$t('RentersPage.input_email_label')"
            type="email"
            :error="errosCadastro.email"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.telefone"
            :label="$t('RentersPage.input_phone_label')"
            :error="errosCadastro.telefone"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.cpf"
            :label="$t('RentersPage.input_cpf_label')"
            :error="errosCadastro.cpf"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.endereco"
            :label="$t('RentersPage.input_address_label')"
            :error="errosCadastro.endereco"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage.update_button')"
            color="primary"
            @click="atualizarLocatario"
          />
          <q-btn class="modalBTN" :label="$t('RentersPage.close_button')" @click="modalEditar = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%">
        <q-card-section class="conteudoModal">
          <div class="text-h6">{{ $t('RentersPage.confirm_delete_q1') }}</div>
          <div class="text-h6">{{ $t('RentersPage.confirm_delete_q2') }}</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage.delete_button')"
            color="negative"
            @click="excluirLocatario"
          />
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage.back_button')"
            @click="modalExcluir = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import LocatarioService from 'src/services/locatarioService';

const $q = useQuasar();
const { t, locale } = useI18n(); // Injetar 't' e 'locale'

// 1. Variáveis de Estado (Modais e Formulários)
const allLocatarios = ref([]);
const loading = ref(false);
const pesquisa = ref('');
const locatarioParaExcluir = ref(null);

const modalCadastro = ref(false);
const novoLocatario = ref({
    nome: '', email: '', telefone: '', cpf: '', endereco: '',
});
const errosCadastro = ref({});

const modalEditar = ref(false);
const locatarioEditar = ref({
    id: null, nome: '', email: '', telefone: '', cpf: '', endereco: '',
});
const modalExcluir = ref(false);


// 2. Colunas da Tabela (COMPUTED para reatividade do idioma)
const columns = computed(() => [
    { name: 'name', label: t('RentersPage.column_name'), field: 'name', align: 'left', sortable: true },
    { name: 'email', label: t('RentersPage.column_email'), field: 'email', align: 'left', sortable: true },
    { name: 'telephone', label: t('RentersPage.column_phone'), field: 'telephone', align: 'left' },
    { name: 'cpf', label: t('RentersPage.column_cpf'), field: 'cpf', align: 'left' },
    { name: 'address', label: t('RentersPage.column_address'), field: 'address', align: 'left' },
]);

// --- 3. Funções de UI (Modais e Validação) ---

const validarCampo = (campo) => {
    if (!novoLocatario.value[campo] || novoLocatario.value[campo].trim() === '') {
        errosCadastro.value[campo] = true;
    } else {
        delete errosCadastro.value[campo];
    }
};

const validarFormulario = () => {
    errosCadastro.value = {};
    let valido = true;
    
    const camposObrigatorios = ['nome', 'email', 'telefone', 'cpf', 'endereco'];

    camposObrigatorios.forEach(campo => {
        if (!novoLocatario.value[campo] || novoLocatario.value[campo].trim() === '') {
            errosCadastro.value[campo] = true;
            valido = false;
        }
    });
    return valido;
};

const abrirModalCadastro = () => {
    novoLocatario.value = { nome: '', email: '', telefone: '', cpf: '', endereco: '' };
    errosCadastro.value = {};
    modalCadastro.value = true;
};

const editarLocatario = (locatario) => {
    locatarioEditar.value = {
        id: locatario.id,
        nome: locatario.name,
        email: locatario.email,
        telefone: locatario.telephone,
        cpf: locatario.cpf,
        endereco: locatario.address,
    };
    modalEditar.value = true;
};

const confirmarExcluir = (locatario) => {
    locatarioParaExcluir.value = locatario;
    modalExcluir.value = true;
};

// --- 4. Lógica CRUD (Chama o Service) ---

const fetchLocatarios = async () => {
    loading.value = true;
    try {
        const data = await LocatarioService.getAll();
        allLocatarios.value = data;
    } catch (error) {
        const fallbackMsg = t('RentersPage.error_load_default');
        const errorMessage = error.message || fallbackMsg;
        $q.notify({ 
            type: 'negative', 
            message: errorMessage,
            timeout: 5000 
        });
    } finally {
        loading.value = false;
    }
};

const cadastrarLocatario = async () => {
    if (!validarFormulario()) {
        $q.notify({ type: 'warning', message: t('RentersPage.validation_fill_all') });
        return;
    }
    
    const dataAPI = {
        name: novoLocatario.value.nome,
        email: novoLocatario.value.email,
        telephone: novoLocatario.value.telefone,
        cpf: novoLocatario.value.cpf,
        address: novoLocatario.value.endereco,
    };

    try {
        await LocatarioService.create(dataAPI);
        $q.notify({ type: 'positive', message: t('RentersPage.success_register') });
        modalCadastro.value = false;
        fetchLocatarios();
    } catch (error) {
        let errorMessage = t('RentersPage.error_unknown');

        if (error.response && error.response.data) {
            const apiData = error.response.data;
            if (typeof apiData.message === 'string') {
                errorMessage = apiData.message;
            } else if (typeof apiData.detail === 'string') {
                errorMessage = apiData.detail;
            } else if (error.response.status === 400) {
                 errorMessage = t('RentersPage.error_validation');
            }
        } else {
             errorMessage = error.message || t('RentersPage.error_connection');
        }

        $q.notify({ 
            type: 'negative', 
            message: errorMessage,
            timeout: 5000 
        });
    }
};

const atualizarLocatario = async () => {
    const dataAPI = {
        name: locatarioEditar.value.nome,
        email: locatarioEditar.value.email,
        telephone: locatarioEditar.value.telefone,
        cpf: locatarioEditar.value.cpf,
        address: locatarioEditar.value.endereco,
    };

    try {
        await LocatarioService.update(locatarioEditar.value.id, dataAPI);
        $q.notify({ type: 'positive', message: t('RentersPage.success_update') });
        modalEditar.value = false;
        fetchLocatarios();
    } catch (error) {
         let errorMessage = error.message || t('RentersPage.error_update_default');

         if (error.response?.data?.message) {
             errorMessage = error.response.data.message;
         }

         $q.notify({ 
             type: 'negative', 
             message: errorMessage,
             timeout: 5000 
         });
    }
};

const excluirLocatario = async () => {
    if (!locatarioParaExcluir.value) return;

    try {
        await LocatarioService.delete(locatarioParaExcluir.value.id);
        $q.notify({ type: 'positive', message: t('RentersPage.success_delete') });
        modalExcluir.value = false;
        fetchLocatarios();
    } catch (error) {
        let errorMessage = t('RentersPage.error_delete_default');

        if (error.response?.status === 400) {
              const apiMessage = error.response.data?.message;
              
              if (apiMessage && typeof apiMessage === 'string') {
                  errorMessage = apiMessage;
              } else {
                  errorMessage = t('RentersPage.error_delete_linked');
              }
        } else if (error.response?.status === 403) {
             errorMessage = t('RentersPage.error_delete_permission');
        } else {
             errorMessage = error.message || t('RentersPage.error_unexpected');
        }

        $q.notify({ 
            type: 'negative', 
            message: errorMessage,
            timeout: 7000
        });
    }
};

// 5. Computed Properties (Filtragem/Pesquisa)
const locatariosFiltrados = computed(() => {
    const termo = pesquisa.value.toLowerCase();
    if (!termo) return allLocatarios.value;
    
    return allLocatarios.value.filter(locatario => 
        locatario.name.toLowerCase().includes(termo) ||
        locatario.email.toLowerCase().includes(termo) ||
        locatario.cpf.includes(termo)
    );
});

onMounted(fetchLocatarios);

// Watcher para reatividade do idioma (mantido)
watch(locale, () => {
    $q.notify({ 
      type: 'info', 
      message: t('general.language_updated'),
      timeout: 1000 
    });
});
</script>