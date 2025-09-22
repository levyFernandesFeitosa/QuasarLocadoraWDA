<template>
  <q-page class="dashboard-page q-pa-md bg-grey-1">
    <div class="dashboard">
      <!-- Estatísticas: Gráficos + Totais -->
      <div class="dashboard-grid">
        <!-- Gráfico de Pizza -->
        <q-card class="card">
          <q-card-section>
            <div class="text-h6 q-mb-md">Distribuição de Aluguéis</div>
            <canvas id="graficoDistribuicaoAlugueis"></canvas>
          </q-card-section>
        </q-card>

        <!-- Gráfico de Barras -->
        <q-card class="card">
          <q-card-section>
            <div class="text-h6 q-mb-md">Livros Mais Alugados</div>
            <canvas id="graficoLivrosMaisAlugados"></canvas>
          </q-card-section>
        </q-card>

        <!-- Totais (empilhados) -->
        <div class="cards-coluna">
          <q-card class="card-total">
            <q-card-section>
              <div class="text-h6">Total de Aluguéis</div>
              <span class="text-h5">{{ totalAlugueis }}</span>
            </q-card-section>
          </q-card>
          <q-card class="card-total">
            <q-card-section>
              <div class="text-h6">Total de Locatários</div>
              <span class="text-h5">{{ totalLocatarios }}</span>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Tabela de Locatários -->
      <div class="dashboard-extra"  >
        <q-table
        
          :rows="rows"
          :columns="columns"
          row-key="name"
          :rows-per-page-options="[2]"
        >
          <!-- Cabeçalho customizado -->
          <template v-slot:header="props" >
            <q-tr :props="props" class="linha-destacada">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <!-- Corpo da tabela -->
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import Chart from "chart.js/auto";

const totalAlugueis = ref(120);
const totalLocatarios = ref(35);

const rows = ref([
  { name: "João Silva", emprestimos: 12, devolvidos: 10 },
  { name: "Maria Souza", emprestimos: 8, devolvidos: 8 },
  { name: "Carlos Lima", emprestimos: 15, devolvidos: 13 },
  { name: "João Silva", emprestimos: 12, devolvidos: 10 },
  { name: "Maria Souza", emprestimos: 8, devolvidos: 8 },
  { name: "Carlos Lima", emprestimos: 15, devolvidos: 13 },
  { name: "João Silva", emprestimos: 12, devolvidos: 10 },
  { name: "Maria Souza", emprestimos: 8, devolvidos: 8 },
  { name: "Carlos Lima", emprestimos: 15, devolvidos: 13 },
  { name: "João Silva", emprestimos: 12, devolvidos: 10 },
  { name: "Maria Souza", emprestimos: 8, devolvidos: 8 },
  { name: "Carlos Lima", emprestimos: 15, devolvidos: 13 },
  // ...mais dados
]);

const columns = [
  { name: "name", label: "Locatário", field: "name", align: "left" },
  {
    name: "emprestimos",
    label: "Total de empréstimos",
    field: "emprestimos",
    align: "center",
  },
  {
    name: "devolvidos",
    label: "Aluguéis Devolvidos",
    field: "devolvidos",
    align: "center",
  },
];

onMounted(() => {
  // Gráfico de Pizza
  new Chart(document.getElementById("graficoDistribuicaoAlugueis"), {
    type: "pie",
    data: {
      labels: ["Devolvidos", "Pendentes"],
      datasets: [
        {
          data: [80, 40],
          backgroundColor: ["#26A69A", "#FFA726"],
        },
      ],
    },
  });

  // Gráfico de Barras
  new Chart(document.getElementById("graficoLivrosMaisAlugados"), {
    type: "bar",
    data: {
      labels: ["Livro A", "Livro B", "Livro C"],
      datasets: [
        {
          label: "Aluguéis",
          data: [30, 20, 15],
          backgroundColor: "#42A5F5",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2vh;
}

.stats {
  width: 100%;
}

.dashboard-grid {
  display: flex;
  flex-wrap: wrap;
  
}



.cards-coluna {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.paginacao {
  justify-content: center;
  align-items: center;
}


</style>
