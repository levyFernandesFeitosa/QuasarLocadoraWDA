<template >
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm">
        <!-- Título: ocupa a linha toda no mobile, só metade no desktop -->
        <div class="col-12 col-md-6">
          <div class="titulo q-mb-sm flex items-center">
            <q-icon name="people" size="32px" class="q-mr-sm" color="primary" />
            Locatários
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
            label="Pesquisar locatário"
            
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
      <!-- Cabeçalho e corpo normais no desktop -->
      <template v-slot:header="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>Ações</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td style="padding-left: 4%;">
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

      <!-- Versão mobile em formato de card -->
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

    <!-- Modal Cadastro -->
    <q-dialog v-model="modalCadastro">
      <q-card class="modal .col-md-12 .col-xl-12">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Cadastrar Locatário</div>
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.nome"
            label="Nome do Locatário"
            :error="errosCadastro.nome"
            error-color="negative"
            @input="validarCampo('nome')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.email"
            label="Email"
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
            label="Telefone"
            :error="errosCadastro.telefone"
            error-color="negative"
            @input="validarCampo('telefone')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.cpf"
            label="CPF"
            :error="errosCadastro.cpf"
            error-color="negative"
            @input="validarCampo('cpf')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.endereco"
            label="Endereço"
            :error="errosCadastro.endereco"
            error-color="negative"
            @input="validarCampo('endereco')"
            required
          />
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
            :color="errosCadastro.nome ? 'negative' : 'primary'"
            error-message="Campo obrigatório"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.email"
            label="Email"
            type="email"
            :error="errosCadastro.email"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.telefone"
            label="Telefone"
            :error="errosCadastro.telefone"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.cpf"
            label="CPF"
            :error="errosCadastro.cpf"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.endereco"
            label="Endereço"
            :error="errosCadastro.endereco"
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
          <q-btn class="modalBTN" label="Fechar" @click="modalEditar = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Confirmar Excluir -->
    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%">
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
  { name: "nome", label: "Nome", field: "nome", align: "left", sortable: true },
  { name: "email", label: "Email", field: "email", align: "left", sortable: true },
  { name: "telefone", label: "Telefone", field: "telefone", align: "left", sortable: true },
  { name: "cpf", label: "CPF", field: "cpf", align: "left", sortable: true },
  { name: "endereco", label: "Endereço", field: "endereco", align: "left", sortable: true },
];

const locatariosFiltrados = computed(() => {
  if (!pesquisa.value) return locatarios.value;
  return locatarios.value.filter((l) =>
    l.nome.toLowerCase().includes(pesquisa.value.toLowerCase())
  );
});

// Novo ref para rastrear erros de validação no cadastro
const errosCadastro = ref({
  nome: false,
  email: false,
  telefone: false,
  cpf: false,
  endereco: false,
});

function validarCampo(campo) {
  
  if (novoLocatario.value[campo]) {
    errosCadastro.value[campo] = false;
  }
}

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
  Object.assign(errosCadastro.value, {
    nome: false,
    email: false,
    telefone: false,
    cpf: false,
    endereco: false,
  });
  modalCadastro.value = true;
}
function cadastrarLocatario() {
  // 1. Resetar o estado de erro
  Object.assign(errosCadastro.value, {
    nome: false,
    email: false,
    telefone: false,
    cpf: false,
    endereco: false,
  });

  // 2. Realizar a validação
  let formularioValido = true;
  
  if (!novoLocatario.value.nome) {
    errosCadastro.value.nome = true;
    formularioValido = false;
  }
  if (!novoLocatario.value.email) {
    errosCadastro.value.email = true;
    formularioValido = false;
  }
  if (!novoLocatario.value.telefone) {
    errosCadastro.value.telefone = true;
    formularioValido = false;
  }
  if (!novoLocatario.value.cpf) {
    errosCadastro.value.cpf = true;
    formularioValido = false;
  }
  if (!novoLocatario.value.endereco) {
    errosCadastro.value.endereco = true;
    formularioValido = false;
  }
  
  // 3. Se o formulário for válido, cadastre
  if (formularioValido) {
    const novoId = locatarios.value.length
      ? Math.max(...locatarios.value.map((l) => l.id)) + 1
      : 1;
    locatarios.value.push({ id: novoId, ...novoLocatario.value });
    modalCadastro.value = false;
  }
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