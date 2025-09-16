<template>
  <q-page class="q-pa-md" style="background-color: #f0ffff;">
    <div class="q-mb-md flex items-center justify-between" >
      <div class="q-mb-md flex items-center" style="flex-grow: 1" >
        <div class="titulo q-mb-sm flex items-center">
          <q-icon name="library_books" size="32px" class="q-mr-sm" color="primary" />
          Editoras
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
          label="Pesquisar Editoras"
          :dense="true"
          style="width: 20%; height: 100%; margin-left: 16px;"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>


        
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
import { ref, computed } from "vue";

const pesquisa = ref("");
const modalCadastro = ref(false);
const modalEditar = ref(false);
const modalExcluir = ref(false);

const editoras = ref([
  {
    id: 1,
    nome: "Editora Alfa",
    email: "alfa@email.com",
    telefone: "11999999999",
    site: "www.alfa.com.br",
  },
  {
    id: 2,
    nome: "Editora Beta",
    email: "beta@email.com",
    telefone: "11988888888",
    site: "www.beta.com.br",
  },
  {
    id: 3,
    nome: "Editora Gama",
    email: "gama@email.com",
    telefone: "11977777777",
    site: "www.gama.com.br",
  },
    {
    id: 3,
    nome: "Editora Gama",
    email: "gama@email.com",
    telefone: "11977777777",
    site: "www.gama.com.br",
  },
    {
    id: 3,
    nome: "Editora Gama",
    email: "gama@email.com",
    telefone: "11977777777",
    site: "www.gama.com.br",
  },
    {
    id: 3,
    nome: "Editora Gama",
    email: "gama@email.com",
    telefone: "11977777777",
    site: "www.gama.com.br",
  },
]);

const columns = [
  { name: "nome", label: "Nome da Editora", field: "nome", align: "left" },
  { name: "telefone", label: "Telefone", field: "telefone", align: "left" },
  { name: "email", label: "Email", field: "email", align: "left" },
  { name: "site", label: "Site", field: "site", align: "left" },
];

const editorasFiltradas = computed(() => {
  if (!pesquisa.value) return editoras.value;
  return editoras.value.filter((e) =>
    e.nome.toLowerCase().includes(pesquisa.value.toLowerCase())
  );
});

// Cadastro
const novaEditora = ref({
  nome: "",
  email: "",
  telefone: "",
  site: "",
});
function abrirModalCadastro() {
  Object.assign(novaEditora.value, {
    nome: "",
    email: "",
    telefone: "",
    site: "",
  });
  modalCadastro.value = true;
}
function cadastrarEditora() {
  const novoId = editoras.value.length
    ? Math.max(...editoras.value.map((e) => e.id)) + 1
    : 1;
  editoras.value.push({ id: novoId, ...novaEditora.value });
  modalCadastro.value = false;
}

// Editar
const editoraEditar = ref({});
function editarEditora(editora) {
  editoraEditar.value = { ...editora };
  modalEditar.value = true;
}
function atualizarEditora() {
  const idx = editoras.value.findIndex((e) => e.id === editoraEditar.value.id);
  if (idx !== -1) editoras.value[idx] = { ...editoraEditar.value };
  modalEditar.value = false;
}

// Excluir
const editoraExcluir = ref({});
function confirmarExcluir(editora) {
  editoraExcluir.value = editora;
  modalExcluir.value = true;
}
function excluirEditora() {
  editoras.value = editoras.value.filter(
    (e) => e.id !== editoraExcluir.value.id
  );
  modalExcluir.value = false;
}
</script>