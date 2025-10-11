<template>
  <q-page class="dashboard-page q-pa-md bg-grey-1" style="background-color: #edead0;">
    <div class="dashboard">
      <div class="dashboard-grid">
        <q-card class="card">
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ $t('DashboardPage.Rental_Distribution') }}</div>
            <canvas id="graficoDistribuicaoAlugueis"></canvas>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ $t('DashboardPage.Most_Rented_Books') }}</div>
            <canvas id="graficoLivrosMaisAlugados"></canvas>
          </q-card-section>
        </q-card>

        <div class="cards-coluna">
          <q-card class="card-total">
            <q-card-section>
              <div class="text-h6">{{ $t('DashboardPage.Total_Rentals') }}</div>
              <span class="text-h5">{{ totalAlugueis }}</span>
            </q-card-section>
          </q-card>
          <q-card class="card-total">
            <q-card-section>
              <div class="text-h6">{{ $t('DashboardPage.Total_Renters') }}</div>
              <span class="text-h5">{{ totalLocatarios }}</span>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="dashboard-extra">
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
          <template v-slot:header="props">
            <q-tr :props="props" class="linha-destacada">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

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
import { useI18n } from 'vue-i18n'; // <-- Importado para tradução
import { dashboardService } from 'src/services/dashboardService';
import Chart from 'chart.js/auto';

const $q = useQuasar();
const { t, locale } = useI18n(); // <-- Injetado 't' para traduzir e 'locale' para reatividade

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

// --- Colunas da Tabela (AGORA COMPUTADA para reatividade do idioma) ---
const columns = computed(() => [
  { name: 'nome', label: t('DashboardPage.Renter'), field: 'nome', align: 'left', sortable: true },
  { name: 'totalAlugueis', label: t('DashboardPage.Total_Loans'), field: 'totalAlugueis', align: 'center', sortable: true },
  { name: 'livrosDevolvidos', label: t('DashboardPage.Rentals_Returned'), field: 'livrosDevolvidos', align: 'center', sortable: true },
]);

/**
 * Lógica de Processamento de Tabela
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
          label: t('DashboardPage.Most_Rented_Books'), // <-- Traduzindo o Label
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
        // Rótulos traduzidos com a função 't'
        labels: [
          t('DashboardPage.Returned'),
          t('DashboardPage.Pending'), 
          t('DashboardPage.Rentals')
        ],
        datasets: [{
          label: t('DashboardPage.Rental_Distribution'), // <-- Traduzindo o Label
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
    
    // Renderiza gráficos após carregar os dados
    await nextTick();
    renderCharts();

  } catch (error) {
    console.error('Erro no loadData:', error);
    $q.notify({
      type: 'negative',
      message: t('general.data_load_error'), // Use uma chave geral para notificação de erro, se existir
      caption: error.response?.data?.message || 'Verifique sua conexão ou a API.',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});

// 1. Observa a largura da tela para responsividade do Quasar
watch(() => $q.screen.width, () => {
    setTimeout(renderCharts, 100); 
});

// 2. Observa a mudança de idioma (locale) para re-renderizar os gráficos
// Os 'columns' já são reativos por serem 'computed'
watch(locale, () => {
    // É importante recriar os gráficos pois o Chart.js não atualiza os rótulos automaticamente
    setTimeout(renderCharts, 100); 
});

</script>