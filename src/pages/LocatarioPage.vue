<template >
  <q-page class="q-pa-md" style="background-color: #f0ffff;">
    <div class="q-mb-md flex items-center justify-between">
      <div class="q-mb-md flex items-center" style="flex-grow: 1;">
        <div class="titulo q-mb-sm flex items-center">
          <q-icon name="people" size="32px" class="q-mr-sm" color="primary" />
          Locatários
        </div>
        <q-btn
          class="CadastroBTN"
          label="Cadastrar"
          color="primary"
          @click="abrirModalCadastro"
        />
        <q-input
          class="pesquisaALL"
          rounded
          standout
          v-model="pesquisa"
          label="Pesquisar locatário"
          :dense="true"
          style="width: 19%; height: 100%; margin-left: 16px;"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>


    <q-table
      :rows="locatariosFiltrados"
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
    </q-table>

    <!-- Modal Cadastro -->
    <q-dialog v-model="modalCadastro">
      <q-card class="modal">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Cadastrar Locatário</div>
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.nome"
            label="Nome do Locatário"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.email"
            label="Email"
            type="email"
            required
          />
          <q-input class="inputModal" outlined v-model="novoLocatario.telefone" label="Telefone" required />
          <q-input class="inputModal" outlined v-model="novoLocatario.cpf" label="CPF" required />
          <q-input class="inputModal" outlined v-model="novoLocatario.endereco" label="Endereço" required />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            label="Cadastrar"
            color="primary"
            @click="cadastrarLocatario"
          />
          <q-btn
            class="modalBTN"
            label="Cancelar"
            @click="modalCadastro = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Editar -->
    <q-dialog v-model="modalEditar">
      <q-card class="modal">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Atualizar Locatário</div>
          <q-input
            class="inputModal"
            v-model="locatarioEditar.nome"
            label="Nome do Locatário"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.email"
            label="Email"
            type="email"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.telefone"
            label="Telefone"
            required
          />
          <q-input class="inputModal" v-model="locatarioEditar.cpf" label="CPF" required />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.endereco"
            label="Endereço"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            label="Atualizar"
            color="primary"
            @click="atualizarLocatario"
          />
          <q-btn
            class="modalBTN"
            label="Fechar"
            @click="modalEditar = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Confirmar Excluir -->
    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%;">
        <q-card-section class="conteudoModal">
          <div class="text-h6">Certeza que deseja excluir esse locatário?</div>
          <div class="text-h6">Após essa ação não haverá retorno.</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            label="Excluir"
            color="negative"
            @click="excluirLocatario"
          />
          <q-btn
            class="modalBTN"
            label="Voltar"
            @click="modalExcluir = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";

const pesquisa = ref("");
const modalCadastro = ref(false);
const modalEditar = ref(false);
const modalVisualizar = ref(false);
const modalExcluir = ref(false);

const locatarios = ref([
  {
    id: 1,
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "11999999999",
    cpf: "123.456.789-00",
    endereco: "Rua A, 123",
  },
  {
    id: 2,
    nome: "Maria Souza",
    email: "maria@email.com",
    telefone: "11988888888",
    cpf: "987.654.321-00",
    endereco: "Rua B, 456",
  },
  {
    id: 3,
    nome: "Carlos Lima",
    email: "carlos@email.com",
    telefone: "11977777777",
    cpf: "111.222.333-44",
    endereco: "Rua C, 789",
  },
  {
    id: 3,
    nome: "Carlos Lima",
    email: "carlos@email.com",
    telefone: "11977777777",
    cpf: "111.222.333-44",
    endereco: "Rua C, 789",
  },
  {
    id: 3,
    nome: "Carlos Lima",
    email: "carlos@email.com",
    telefone: "11977777777",
    cpf: "111.222.333-44",
    endereco: "Rua C, 789",
  },

  {
    id: 3,
    nome: "Carlos Lima",
    email: "carlos@email.com",
    telefone: "11977777777",
    cpf: "111.222.333-44",
    endereco: "Rua C, 789",
  },
  {
    id: 3,
    nome: "Carlos Lima",
    email: "carlos@email.com",
    telefone: "11977777777",
    cpf: "111.222.333-44",
    endereco: "Rua C, 789",
  },
]);

const columns = [
  { name: "nome", label: "Nome", field: "nome", align: "left" },
  { name: "email", label: "Email", field: "email", align: "left" },
  { name: "telefone", label: "Telefone", field: "telefone", align: "left" },
  { name: "cpf", label: "CPF", field: "cpf", align: "left" },
  { name: "endereco", label: "Endereço", field: "endereco", align: "left" },
];

const locatariosFiltrados = computed(() => {
  if (!pesquisa.value) return locatarios.value;
  return locatarios.value.filter((l) =>
    l.nome.toLowerCase().includes(pesquisa.value.toLowerCase())
  );
});

// Cadastro
const novoLocatario = ref({
  nome: "",
  email: "",
  telefone: "",
  cpf: "",
  endereco: "",
});
function abrirModalCadastro() {
  Object.assign(novoLocatario.value, {
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: "",
  });
  modalCadastro.value = true;
}
function cadastrarLocatario() {
  const novoId = locatarios.value.length
    ? Math.max(...locatarios.value.map((l) => l.id)) + 1
    : 1;
  locatarios.value.push({ id: novoId, ...novoLocatario.value });
  modalCadastro.value = false;
}

// Editar
const locatarioEditar = ref({});
function editarLocatario(locatario) {
  locatarioEditar.value = { ...locatario };
  modalEditar.value = true;
}
function atualizarLocatario() {
  const idx = locatarios.value.findIndex(
    (l) => l.id === locatarioEditar.value.id
  );
  if (idx !== -1) locatarios.value[idx] = { ...locatarioEditar.value };
  modalEditar.value = false;
}

// Visualizar
const locatarioVisualizar = ref({});
function visualizarLocatario(locatario) {
  locatarioVisualizar.value = { ...locatario };
  modalVisualizar.value = true;
}

// Excluir
const locatarioExcluir = ref({});
function confirmarExcluir(locatario) {
  locatarioExcluir.value = locatario;
  modalExcluir.value = true;
}
function excluirLocatario() {
  locatarios.value = locatarios.value.filter(
    (l) => l.id !== locatarioExcluir.value.id
  );
  modalExcluir.value = false;
}
</script>