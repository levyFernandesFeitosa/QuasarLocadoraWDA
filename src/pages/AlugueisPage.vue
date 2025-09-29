<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm">
        <!-- Título: ocupa a linha toda no mobile, só metade no desktop -->
        <div class="col-12 col-md-6">
          <div class="titulo q-mb-sm flex items-center">
            <q-icon name="event" size="32px" class="q-mr-sm" color="primary" />
            Alugueis
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
            label="Pesquisar Aluguel"
            
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table
      :rows="aluguéisFiltrados"
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
              @click="editarAluguel(props.row)"
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
      <q-card class="modal" style="height: 70%;">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Cadastrar Locatário</div>
          <q-input class="inputModal" outlined v-model="novoAluguel.livro" label="Livro" required />
          <q-input class="inputModal" outlined v-model="novoAluguel.locatario" label="Locatário" required />
          <q-input
            class="inputModal" outlined
            v-model="novoAluguel.prazo"
            label="Dias de Aluguel"
            type="date"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Cadastrar" color="primary" @click="cadastrarAluguel" />
          <q-btn class="modalBTN" label="Cancelar" @click="modalCadastro = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Editar -->
    <q-dialog v-model="modalEditar">
      <q-card class="modal" style="height: 70%;">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Atualizar Locatário</div>
          <q-input class="inputModal" outlined v-model="aluguelEditar.livro" label="Livro" required />
          <q-input
            class="inputModal" outlined
            v-model="aluguelEditar.locatario"
            label="Locatário"
            required
          />
          <q-input
            class="inputModal" outlined
            v-model="aluguelEditar.prazo"
            label="Dias de Aluguel"
            type="date"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Atualizar" color="primary" @click="atualizarAluguel" />
          <q-btn class="modalBTN" label="Fechar" @click="modalEditar = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Confirmar Excluir -->
    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%;">
        <q-card-section class="conteudoModal">
          <div class="text-h6">Certeza que deseja excluir esse Aluguel?</div>
          <div class="text-h6">Após essa ação não haverá retorno.</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Excluir" color="negative" @click="excluirAluguel" />
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

const aluguéis = ref([
  {
    id: 1,
    livro: "Livro A",
    locatario: "João Silva",
    DataPrazo: "01/10/2025",
    dataRetirada: "07/09/2025",
    dataDevolucao: "09/09/2025",
    status: "Devolvido",
  },
  {
    id: 2,
    livro: "Livro B",
    locatario: "Maria Souza",
    DataPrazo: "01/10/2025",
    dataRetirada: "07/09/2025",
    dataDevolucao: "09/09/2025",
    status: "Pendente",
  },
  {
    id: 3,
    livro: "Livro C",
    locatario: "Carlos Lima",
    DataPrazo: "01/10/2025",
    dataRetirada: "07/09/2025",
    dataDevolucao: "09/09/2025",
    status: "Devolvido",
  },
]);

const columns = [
  { name: "locatario", label: "Locatário", field: "locatario", align: "left",  sortable: true },
  { name: "livro", label: "Livro", field: "livro", align: "left",  sortable: true },
  {
    name: "DataPrazo",
    label: "Prazo",
    field: "DataPrazo",
    align: "left",
    sortable: true
  },
  {
    name: "DataAlugado",
    label: "Alugado",
    field: "DataAlugado",
    align: "left",  sortable: true
  },
  {
    name: "dataDevolucao",
    label: "Devolução",
    field: "dataDevolucao",
    align: "left",  sortable: true
  },
  { name: "status", label: "Status", field: "status", align: "left",  sortable: true },
];

const aluguéisFiltrados = computed(() => {
  if (!pesquisa.value) return aluguéis.value;
  return aluguéis.value.filter(
    (a) =>
      a.livro.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
      a.locatario.toLowerCase().includes(pesquisa.value.toLowerCase())
  );
});

// Cadastro
const novoAluguel = ref({
  livro: "",
  locatario: "",
  dataRetirada: "",
  dataDevolucao: "",
  status: "",
});
function abrirModalCadastro() {
  Object.assign(novoAluguel.value, {
    livro: "",
    locatario: "",
    dataRetirada: "",
    dataDevolucao: "",
    status: "",
  });
  modalCadastro.value = true;
}
function cadastrarAluguel() {
  const novoId = aluguéis.value.length
    ? Math.max(...aluguéis.value.map((a) => a.id)) + 1
    : 1;
  aluguéis.value.push({ id: novoId, ...novoAluguel.value });
  modalCadastro.value = false;
}

// Editar
const aluguelEditar = ref({});
function editarAluguel(aluguel) {
  aluguelEditar.value = { ...aluguel };
  modalEditar.value = true;
}
function atualizarAluguel() {
  const idx = aluguéis.value.findIndex((a) => a.id === aluguelEditar.value.id);
  if (idx !== -1) aluguéis.value[idx] = { ...aluguelEditar.value };
  modalEditar.value = false;
}

// Excluir
const aluguelExcluir = ref({});
function confirmarExcluir(aluguel) {
  aluguelExcluir.value = aluguel;
  modalExcluir.value = true;
}
function excluirAluguel() {
  aluguéis.value = aluguéis.value.filter(
    (a) => a.id !== aluguelExcluir.value.id
  );
  modalExcluir.value = false;
}
</script>