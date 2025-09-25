<template>
  <q-page class="q-pa-md" style="background-color: #f0ffff;">
    <div class="q-pa-md example-row-column-width" style="background-color: #00bfa6; margin-bottom: 2%; border-radius: 4vh;">

      <div class="row items-center q-col-gutter-sm">

        <!-- Título: ocupa a linha toda no mobile, só metade no desktop -->
        <div class="col-12 col-md-6">
          <div class="titulo q-mb-sm flex items-center">
            <q-icon name="people" size="32px" class="q-mr-sm" color="primary" />
            Livros
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
            rounded
            standout
            v-model="pesquisa"
            label="Pesquisar Livros"
            :dense="true"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

      </div>
    </div>

    <q-table
      :rows="livrosFiltrados"
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
              @click="editarLivro(props.row)"
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
          <div class="tituloModal">Cadastrar Livro</div>
          <q-input class="inputModal" outlined v-model="novoLivro.titulo" label="Título do Livro" required />
          <q-input class="inputModal" outlined v-model="novoLivro.autor" label="Autor" required />
          <q-input class="inputModal" outlined v-model="novoLivro.dataLancada" label="Data de Lançamento" required />
          <q-input class="inputModal" outlined v-model="novoLivro.disponivel" label="Disponível" required />
          <q-input class="inputModal" outlined v-model="novoLivro.editora" label="Editora" required />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Cadastrar" color="primary" @click="cadastrarLivro" />
          <q-btn class="modalBTN" label="Cancelar" @click="modalCadastro = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Editar -->
    <q-dialog v-model="modalEditar">
      <q-card class="modal">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Atualizar Livro</div>
          <q-input class="inputModal" v-model="livroEditar.titulo" label="Título" required />
          <q-input class="inputModal" v-model="livroEditar.autor" label="Autor" required />
          <q-input class="inputModal" v-model="livroEditar.dataLancada" label="Data de Lançamento" required />
          <q-input class="inputModal" v-model="livroEditar.disponivel" label="Disponível" required />
          <q-input class="inputModal" v-model="livroEditar.editora" label="Editora" required />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Atualizar" color="primary" @click="atualizarLivro" />
          <q-btn class="modalBTN" label="Fechar" @click="modalEditar = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Confirmar Excluir -->
    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%;">
        <q-card-section class="conteudoModal">
          <div class="text-h6">Certeza que deseja excluir esse Livro?</div>
          <div class="text-h6">Após essa ação não haverá retorno.</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Excluir" color="negative" @click="excluirLivro" />
          <q-btn class="modalBTN" label="Voltar" flat @click="modalExcluir = false" />
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

const livros = ref([
  {
    id: 1,
    titulo: "Livro A",
    autor: "Autor 1",
    dataLancada: "2020",
    disponivel: "100",
    alugados: "50",
    editora: "Editora Alfa",
  },
  
  {
    id: 2,
    titulo: "Livro B",
    autor: "Autor 2",
    dataLancada: "2020",
    disponivel: "100",
    alugados: "50",
    editora: "Editora Alfa",
  },
  {
    id: 3,
    titulo: "Livro C",
    autor: "Autor 3",
    dataLancada: "2020",
    disponivel: "100",
    alugados: "50",
    editora: "Editora Alfa",
  },
]);

const columns = [
  { name: "titulo", label: "Título", field: "titulo", align: "left" },
  { name: "autor", label: "Autor", field: "autor", align: "left" },
  { name: "dataLancada", label: "Data de Lançamento", field: "dataLancada", align: "left" },
  { name: "disponivel", label: "Disponível", field: "disponivel", align: "left" },
  { name: "alugados", label: "Alugados", field: "alugados", align: "left" },
  { name: "editora", label: "Editora", field: "editora", align: "left" },
];

const livrosFiltrados = computed(() => {
  if (!pesquisa.value) return livros.value;
  return livros.value.filter((l) =>
    l.titulo.toLowerCase().includes(pesquisa.value.toLowerCase())
  );
});

// Cadastro
const novoLivro = ref({
  titulo: "",
  autor: "",
  dataLancada: "",
  disponivel: "",
  alugados: "",
  editora: "",
});
function abrirModalCadastro() {
  Object.assign(novoLivro.value, {
    titulo: "",
    autor: "",
    editora: "",
    ano: "",
    isbn: "",
  });
  modalCadastro.value = true;
}
function cadastrarLivro() {
  const novoId = livros.value.length
    ? Math.max(...livros.value.map((l) => l.id)) + 1
    : 1;
  livros.value.push({ id: novoId, ...novoLivro.value });
  modalCadastro.value = false;
}

// Editar
const livroEditar = ref({});
function editarLivro(livro) {
  livroEditar.value = { ...livro };
  modalEditar.value = true;
}
function atualizarLivro() {
  const idx = livros.value.findIndex((l) => l.id === livroEditar.value.id);
  if (idx !== -1) livros.value[idx] = { ...livroEditar.value };
  modalEditar.value = false;
}

// Excluir
const livroExcluir = ref({});
function confirmarExcluir(livro) {
  livroExcluir.value = livro;
  modalExcluir.value = true;
}
function excluirLivro() {
  livros.value = livros.value.filter((l) => l.id !== livroExcluir.value.id);
  modalExcluir.value = false;
}
</script>