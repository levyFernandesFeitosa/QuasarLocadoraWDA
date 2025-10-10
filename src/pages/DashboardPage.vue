<template>
  <q-page class="dashboard-page q-pa-md bg-grey-1" style="background-color: #edead0;">
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
          :rows-per-page-options="[0]"
          :pagination="{
            page: 1,
            rowsPerPage:
              $q.screen.sm ? 0 : 
              $q.screen.md ? 2 : 
              $q.screen.lg ? 7 : 
              7
          }"
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
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { dashboardService } from 'src/services/dashboardService'; // Assumindo este caminho
import Chart from 'chart.js/auto'; // Certifique-se de ter instalado: npm install chart.js

const $q = useQuasar();

// --- Estado Bruto da API ---
const loading = ref(true);
const locatarios = ref([]);
const alugueis = ref([]);
const livrosMaisAlugados = ref([]);
const entreguesNoPrazo = ref(0);
const entreguesAtraso = ref(0);
const alugueisAtrasados = ref(0);

// --- Métricas Computadas (Cards) ---
const totalAlugueis = computed(() => Array.isArray(alugueis.value) ? alugueis.value.length : 0);
const totalLocatarios = computed(() => Array.isArray(locatarios.value) ? locatarios.value.length : 0);

// --- Colunas da Tabela (Mapeado para :columns="columns" no template) ---
const columns = [
  { name: 'nome', label: 'Locatário', field: 'nome', align: 'left', sortable: true },
  { name: 'totalAlugueis', label: 'Total Aluguéis', field: 'totalAlugueis', align: 'center', sortable: true },
  { name: 'livrosDevolvidos', label: 'Livros Devolvidos', field: 'livrosDevolvidos', align: 'center', sortable: true },
];

/**
 * Lógica de Processamento de Tabela (Mapeado para :rows="rows" no template)
 * Substitui o mapeamento e a paginação manual do código Vanilla.
 */
const rows = computed(() => {
  const allAlugueis = alugueis.value;
  return locatarios.value.map(loc => {
    // Encontra aluguéis por renter ID
    const alugueisDoLoc = allAlugueis.filter(r => r.renter?.id === loc.id);

    const totalAlugueis = alugueisDoLoc.length;
    
    // Lógica de "Livros Devolvidos"
    const livrosDevolvidos = alugueisDoLoc.filter(r =>
      r.status === "DELIVERED" || r.status === "DELIVERED_WITH_DELAY" || r.status === "IN_TIME"
    ).length;

    return {
      nome: loc.name, // Nome do locatário
      totalAlugueis,
      livrosDevolvidos,
    };
  });
});

// --- Lógica de Renderização de Gráficos (Chart.js) ---
let chartLivros = null;
let chartPizza = null;

function renderCharts() {
  // Destrói instâncias antigas para evitar memory leaks
  if (chartLivros) chartLivros.destroy();
  if (chartPizza) chartPizza.destroy();

  // Gráfico de Livros Mais Alugados (Barra)
  const livrosLabels = livrosMaisAlugados.value.map(item => item.name);
  const livrosData = livrosMaisAlugados.value.map(item => item.totalRents);
  
  const ctxLivros = document.getElementById('graficoLivrosMaisAlugados');
  if (ctxLivros) {
    chartLivros = new Chart(ctxLivros.getContext('2d'), {
      type: 'bar',
      data: {
        labels: livrosLabels,
        datasets: [{
          label: 'Livros Mais Alugados',
          data: livrosData,
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: true }
    });
  }

  // Gráfico de Distribuição de Aluguéis (Pizza)
  const ctxPizza = document.getElementById('graficoDistribuicaoAlugueis');
  if (ctxPizza) {
    chartPizza = new Chart(ctxPizza.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['Entregues no Prazo', 'Entregues com Atraso', 'Atualmente Atrasados'],
        datasets: [{
          label: 'Distribuição de Aluguéis',
          data: [
            entreguesNoPrazo.value,
            entreguesAtraso.value,
            alugueisAtrasados.value
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 183, 0, 0.6)',
            'rgba(255, 0, 55, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            // Regra de layout mobile/desktop com Quasar
            position: $q.screen.lt.md ? 'bottom' : 'bottom' 
          }
        }
      }
    });
  }
}

// --- Chamada da API e Ciclo de Vida ---
async function loadData() {
  loading.value = true;
  try {
    const data = await dashboardService.loadDashboardData(1);

    // Mapeia os dados brutos para as variáveis reativas
    locatarios.value = data.locatarios;
    alugueis.value = data.alugueis;
    livrosMaisAlugados.value = data.livrosMaisAlugados;
    
    // Contadores diretos da API
    entreguesNoPrazo.value = data.entreguesNoPrazo;
    entreguesAtraso.value = data.entreguesAtraso;
    alugueisAtrasados.value = data.alugueisAtrasados;
    
    // nextTick garante que o DOM esteja atualizado (o canvas exista) antes de desenhar
    await nextTick();
    renderCharts();

  } catch (error) {
    console.error('Erro no loadData:', error);
    $q.notify({
      type: 'negative',
      message: 'Falha ao carregar dados da Dashboard.',
      caption: error.response?.data?.message || 'Verifique sua conexão ou a API.',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});

// Re-renderiza gráficos ao redimensionar para garantir responsividade e ajuste de legendas
watch(() => $q.screen.width, () => {
    setTimeout(renderCharts, 100); 
});
</script>

