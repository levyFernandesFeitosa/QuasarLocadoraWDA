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
              name="manage_accounts"
              size="32px"
              class="q-mr-sm"
              color="primary"
            />
            <span class="text-h6 text-white text-weight-bold ellipsis">{{
              $t("UsersPage.title")
            }}</span>
          </div>
        </div>

        <div
          class="col-auto col-md-2 order-xs-3 order-md-2 q-ml-auto q-ml-md-none"
        >
          <q-btn
            class="CadastroBTN full-width"
            :label="$t('UsersPage.register_button')"
            color="primary"
            @click="abrirModalCadastro"
            icon="person_add"
          />
        </div>

        <div class="col-12 col-md-4 order-xs-1 order-md-3">
          <q-input
            class="pesquisaALL"
            standout
            v-model="pesquisa"
            :label="$t('UsersPage.search_placeholder')"
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
      :grid="$q.screen.lt.md"
      :hide-header="$q.screen.lt.md"
      :rows-per-page-options="[5, 10, 15, 0]"
      :pagination="{
        page: 1,
        // Em telas pequenas (lt.md), rowsPerPage=0 exibe todos os itens, confiando no scroll da página
        rowsPerPage: $q.screen.lt.md ? 0 : 5,
      }"
      :hide-pagination="$q.screen.lt.md"
      :loading="loading"
    >
      <template v-slot:header="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>{{ $t("UsersPage.actions_header") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'role'">
              {{ roleMap[col.value] || col.value }}
            </span>
            <span v-else>
              {{ col.value }}
            </span>
          </q-td>
          <q-td>
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              :tooltip="$t('UsersPage.tooltip_edit')"
              @click="editarUsuario(props.row)"
            />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              :tooltip="$t('UsersPage.tooltip_delete')"
              @click="confirmarExcluir(props.row)"
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
                  <span v-if="col.name === 'role'">
                    {{ roleMap[col.value] || col.value }}
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
                :tooltip="$t('UsersPage.tooltip_edit')"
                @click="editarUsuario(props.row)"
              />
              <q-btn
                dense
                flat
                icon="delete"
                color="negative"
                :tooltip="$t('UsersPage.tooltip_delete')"
                @click="confirmarExcluir(props.row)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </template>
      <template v-slot:loading>
        <q-inner-loading
          showing
          color="primary"
          :label="$t('UsersPage.loading_users')"
        />
      </template>
    </q-table>
    <q-dialog v-model="modalCadastro">
      <q-card class="modal">
        <q-form @submit.prevent="cadastrarUsuario">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{ $t("UsersPage.modal_register_title") }}
            </div>
            <q-input
              class="inputModal"
              outlined
              v-model="novoUsuario.nome"
              :label="$t('UsersPage.input_name_label')"
              required
            />
            <q-input
              class="inputModal"
              outlined
              v-model="novoUsuario.email"
              :label="$t('UsersPage.input_email_label')"
              type="email"
              required
            />
            <q-input
              class="inputModal"
              outlined
              v-model="novoUsuario.senha"
              :label="$t('UsersPage.input_password_label')"
              type="password"
              required
            />
            <q-select
              class="inputModalSelect"
              outlined
              v-model="novoUsuario.tipo"
              :options="roleOptionsComputed"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :label="$t('UsersPage.input_role_label')"
              required
            />
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage.register_button')"
              color="primary"
              type="submit"
            />
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage.cancel_button')"
              @click="modalCadastro = false"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalEditar">
      <q-card class="modal">
        <q-form @submit.prevent="atualizarUsuario">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{ $t("UsersPage.modal_update_title") }}
            </div>
            <q-input
              class="inputModal"
              outlined
              v-model="usuarioEditar.nome"
              :label="$t('UsersPage.input_name_label')"
              required
            />
            <q-input
              class="inputModal"
              outlined
              v-model="usuarioEditar.email"
              :label="$t('UsersPage.input_email_label')"
              type="email"
              required
            />
            <q-input
              class="inputModal"
              outlined
              v-model="usuarioEditar.senha"
              :label="$t('UsersPage.input_new_password_label')"
              type="password"
            />
            <q-input
              class="inputModal"
              outlined
              v-model="usuarioEditar.confirmarSenha"
              :label="$t('UsersPage.input_confirm_password_label')"
              type="password"
            />
            <q-select
              class="inputModalSelect"
              outlined
              v-model="usuarioEditar.tipo"
              :options="roleOptionsComputed"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :label="$t('UsersPage.input_role_label')"
              required
            />
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage.update_button')"
              color="primary"
              type="submit"
            />
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage.close_button')"
              @click="modalEditar = false"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%">
        <q-card-section class="conteudoModal">
          <div class="text-h6">{{ $t("UsersPage.confirm_delete_q1") }}</div>
          <div class="text-h6">{{ $t("UsersPage.confirm_delete_q2") }}</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('UsersPage.delete_button')"
            color="negative"
            @click="excluirUsuario"
          />
          <q-btn
            class="modalBTN"
            :label="$t('UsersPage.back_button')"
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
import { usuarioService } from "src/services/usuarioService";

const $q = useQuasar();
const { t, locale } = useI18n();

// --- Mapeamento de Funções (Role Map) ---
const roleMap = computed(() => ({
  USER: t("UsersPage.role_user"),
  ADMIN: t("UsersPage.role_admin"),
}));

// Opções do q-select (Computed para reatividade do idioma)
const roleOptionsComputed = computed(() => [
  { label: t("UsersPage.role_user"), value: "USER" },
  { label: t("UsersPage.role_admin"), value: "ADMIN" },
]);

// --- Estado da Aplicação ---
const allUsers = ref([]); // Lista completa de usuários da API
const loading = ref(false);

// --- Estado da Pesquisa e Tabela ---
const pesquisa = ref(""); // Mapeia para o v-model do q-input

// Colunas da Q-Table (COMPUTED para reatividade do idioma)
const columns = computed(() => [
  {
    name: "name",
    label: t("UsersPage.column_name"),
    field: "name",
    sortable: true,
    align: "left",
  },
  {
    name: "email",
    label: t("UsersPage.column_email"),
    field: "email",
    sortable: true,
    align: "left",
  },
  // Label da Permissão usa i18n, o field continua sendo 'role'
  {
    name: "role",
    label: t("UsersPage.column_role"),
    field: "role",
    sortable: true,
    align: "left",
  },
]);

// --- Lógica da Q-Table e Pesquisa (Mantida) ---
const usuariosFiltrados = computed(() => {
  const term = pesquisa.value.toLowerCase();
  if (!term) {
    return allUsers.value;
  }
  // Implementa a lógica de filtro do seu código Vanilla
  return allUsers.value.filter(
    (user) =>
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      // Filtra pelo valor original da role (ex: 'ADMIN'), não pelo traduzido
      user.role?.toLowerCase().includes(term)
  );
});

// --- Estado dos Modais (Mantido) ---
const modalCadastro = ref(false);
const modalEditar = ref(false);
const modalExcluir = ref(false);

const novoUsuario = ref({
  nome: "",
  email: "",
  senha: "",
  tipo: "USER", // Valor padrão (value)
});

const usuarioEditar = ref({
  id: null,
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
  tipo: "",
});

const usuarioParaExcluir = ref(null);

// --- Chamadas da API (Serviço) - Notificações traduzidas ---

/**
 * Carrega a lista de usuários ao iniciar a página.
 */
async function fetchUsers() {
  loading.value = true;
  try {
    const users = await usuarioService.listarUsuarios();
    allUsers.value = users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    $q.notify({
      type: "negative",
      // Usa $t()
      message:
        t("UsersPage.error_load_default") +
        (error.response?.data?.message || t("UsersPage.error_network")),
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
    // Usa $t()
    $q.notify({ type: "warning", message: t("UsersPage.validation_fill_all") });
    return;
  }

  try {
    const dados = {
      name: nome,
      email: email,
      password: senha,
      role: tipo.toUpperCase(),
    };

    await usuarioService.criarUsuario(dados);

    // Usa $t()
    $q.notify({ type: "positive", message: t("UsersPage.success_register") });
    modalCadastro.value = false;
    resetNovoUsuario();
    await fetchUsers();
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    $q.notify({
      type: "negative",
      // Usa $t()
      message:
        t("UsersPage.error_register_default") +
        (error.response?.data?.message || t("UsersPage.error_check_console")),
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
    senha: "", // A senha é sempre limpa no início da edição
    confirmarSenha: "",
  };
  modalEditar.value = true;
}

/**
 * Atualiza um usuário existente.
 */
async function atualizarUsuario() {
  const { id, nome, email, senha, confirmarSenha, tipo } = usuarioEditar.value;

  if (senha && senha !== confirmarSenha) {
    // Usa $t()
    $q.notify({
      type: "warning",
      message: t("UsersPage.validation_password_mismatch"),
    });
    return;
  }
  if (!nome || !email) {
    // Usa $t()
    $q.notify({
      type: "warning",
      message: t("UsersPage.validation_name_email_required"),
    });
    return;
  }

  try {
    const dadosAtualizados = {
      name: nome,
      email: email,
      role: tipo.toUpperCase(),
    };

    if (senha) {
      dadosAtualizados.password = senha; // Adiciona senha apenas se alterada
    }

    await usuarioService.atualizarUsuario(id, dadosAtualizados);

    // Usa $t()
    $q.notify({ type: "positive", message: t("UsersPage.success_update") });
    modalEditar.value = false;

    // Otimização: atualiza o array localmente
    const index = allUsers.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      // Atualiza apenas os campos exibíveis
      allUsers.value[index].name = dadosAtualizados.name;
      allUsers.value[index].email = dadosAtualizados.email;
      allUsers.value[index].role = dadosAtualizados.role;
      // Força a reatividade, pois a atualização de uma propriedade aninhada pode não ser reativa o suficiente para a QTable
      allUsers.value = [...allUsers.value];
    }
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    $q.notify({
      type: "negative",
      // Usa $t()
      message:
        t("UsersPage.error_update_default") +
        (error.response?.data?.message || t("UsersPage.error_check_console")),
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

    // Usa $t()
    $q.notify({ type: "positive", message: t("UsersPage.success_delete") });
    modalExcluir.value = false;
    usuarioParaExcluir.value = null;

    // Otimização: remove o usuário localmente
    allUsers.value = allUsers.value.filter((u) => u.id !== user.id);
  } catch (error) {
    console.error("Erro ao deletar:", error);
    $q.notify({
      type: "negative",
      // Usa $t()
      message:
        t("UsersPage.error_delete_default") +
        (error.response?.data?.message || t("UsersPage.error_check_console")),
    });
  }
}

// --- Funções de UI/Abertura de Modais (Mantidas) ---

function abrirModalCadastro() {
  resetNovoUsuario();
  modalCadastro.value = true;
}

function resetNovoUsuario() {
  novoUsuario.value = {
    nome: "",
    email: "",
    senha: "",
    tipo: "USER",
  };
}

// --- Ciclo de Vida: Carregar dados ao montar o componente ---
onMounted(() => {
  fetchUsers();
});

// Watcher para reatividade do idioma na tela
watch(locale, () => {
  // Apenas força a recarga da lista (não é necessário chamar a API novamente) para que
  // as colunas e o roleMap sejam reavaliados no computed e no body/item slots.
  fetchUsers();
  $q.notify({
    type: "info",
    message: t("general.language_updated"),
    timeout: 1000,
  });
});
</script>