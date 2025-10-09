<template>
  <q-page class="q-pa-md" style="background-color: #edead0"> 
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <div class="titulo q-mb-sm flex items-center">
            <q-icon name="event" size="32px" class="q-mr-sm" color="primary" />
            Alugueis
          </div>
        </div>

        <div class="col-6 col-md-2">
          <q-btn
            class="CadastroBTN"
            label="Cadastrar"
            color="primary"
            @click="openCreateModal" />
        </div>

        <div class="col-6 col-md-4">
          <q-input
            class="pesquisaALL"
            standout
            v-model="searchTerm" label="Pesquisar Aluguel"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table
      :rows="alugueis" :columns="columns"
      row-key="id"
      :filter="searchTerm" :rows-per-page-options="[5, 10, 15]"
      :loading="loading"
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
              v-if="props.row.status === 'RENTED' || props.row.status === 'IN_TIME' || props.row.status === 'LATE'"
              dense
              flat
              icon="library_add_check" 
              color="green" 
              tooltip="Marcar como Recebido"
              @click="registrarRecebimento(props.row)"
            />
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              tooltip="Editar Prazo de Devolução"
              @click="openEditModal(props.row)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="modalAberto">
      <q-card class="modal" style="min-width: 450px;">
        <q-form @submit.prevent="salvarAluguel" style="width: 100%;">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{ editando ? "Atualizar Aluguel" : "Cadastrar Aluguel" }}
            </div>
            
            <q-select
              class="inputModalSelect"
              outlined
              v-model="aluguelForm.renterId"
              :options="locatariosOptions"
              option-value="value" 
              option-label="label"
              emit-value 
              map-options
              label="Locatário"
              :error="errosCadastro.renterId"
              error-color="negative"
              @update:model-value="validarCampo('renterId')"
              :disable="editando"
            />

            <q-select
              class="inputModalSelect"
              outlined
              v-model="aluguelForm.bookId"
              :options="livrosOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Livro"
              :error="errosCadastro.bookId"
              error-color="negative"
              @update:model-value="validarCampo('bookId')"
              :disable="editando"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>Disponível: {{ scope.opt.totalAvailable }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              class="inputModal"
              outlined
              v-model="aluguelForm.rentDate"
              label="Data de Aluguel"
              type="date"
              stack-label
              :error="errosCadastro.rentDate"
              error-color="negative"
              @input="validarCampo('rentDate')"
              :disable="editando"
            />

            <q-input
              class="inputModal"
              outlined
              v-model="aluguelForm.deadLine"
              label="Prazo de Devolução"
              type="date"
              stack-label
              :error="errosCadastro.deadLine"
              error-color="negative"
              @input="validarCampo('deadLine')"
            />
            
          </q-card-section>
          
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="editando ? 'Atualizar' : 'Cadastrar'"
              color="primary"
              type="submit"
              :loading="salvando"
            />
            <q-btn class="modalBTN" label="Cancelar" @click="fecharModal" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page> 
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 💡 MUDANÇA AQUI: Importamos 'useQuasar' E 'Dialog' para garantir o funcionamento.
import { useQuasar } from 'quasar'; 
import AlugueisService from "src/services/alugueisService"; 

const $q = useQuasar();

// DEFINIÇÃO LOCAL DO statusPT
const statusPT = {
    RENTED: 'Alugado',
    IN_TIME: 'No Prazo',
    LATE: 'Atrasado',
    DELIVERED_ON_TIME: 'Devolvido no Prazo',
    DELIVERED_WITH_DELAY: 'Devolvido com Atraso',
};


// --- Variáveis de Estado Reativas e Formulário ---
const alugueis = ref([]); 
const loading = ref(false); 

const locatariosOptions = ref([]); 
const livrosOptions = ref([]);     

const aluguelForm = ref({
    id: null,
    renterId: null,      
    bookId: null,        
    rentDate: null,      
    deadLine: null,      
});

const modalAberto = ref(false);
const editando = ref(false); 
const salvando = ref(false);
const errosCadastro = ref({});


// --- Variáveis de Busca e Tabela ---
const searchTerm = ref(''); 

const columns = [
    // ... colunas (não alteradas)
    { name: 'locatario', label: 'Locatário', align: 'left', field: row => row.renter?.name || '-', sortable: true },
    { name: 'livro', label: 'Livro', align: 'left', field: row => row.book?.name || '-', sortable: true },
    { name: 'rentDate', label: 'Alugado', align: 'left', field: 'rentDate', format: val => formatarData(val), sortable: true },
    { name: 'deadLine', label: 'Prazo', align: 'left', field: 'deadLine', format: val => formatarData(val), sortable: true },
    { name: 'devolutionDate', label: 'Devolução', align: 'left', field: 'devolutionDate', format: val => formatarData(val), sortable: true },
    { 
        name: 'status', 
        label: 'Status', 
        align: 'left', 
        field: row => statusPT[row.status] || row.status, 
        sortable: true 
    },
    
];

// --- Funções Auxiliares (Data Formatting) ---

function formatarData(data) {
    if (!data) return "-";
    return data.substring(0, 10).split('-').reverse().join('/');
}

// --- Funções de Validação ---

const validarCampo = (campo) => {
    if (!aluguelForm.value[campo] || aluguelForm.value[campo].toString().trim() === "") {
        errosCadastro.value[campo] = true;
    } else {
        delete errosCadastro.value[campo];
    }
};

const validarFormulario = () => {
    errosCadastro.value = {};
    let valido = true;

    const camposObrigatorios = ["renterId", "bookId", "rentDate", "deadLine"];

    camposObrigatorios.forEach((campo) => {
        if (!aluguelForm.value[campo]) {
            errosCadastro.value[campo] = true;
            valido = false;
        }
    });
    return valido;
};

// --- Funções de Busca da API ---

async function fetchAllData() {
    loading.value = true;
    try {
        alugueis.value = await AlugueisService.getAllAlugueis();
        
        const dependencies = await AlugueisService.getDependencies();
        locatariosOptions.value = dependencies.locatarios.map(r => ({ label: r.name, value: r.id }));
        livrosOptions.value = dependencies.livros.map(b => ({ label: b.name, value: b.id, totalAvailable: b.totalQuantity - b.totalInUse }));

    } catch (error) {
        $q.notify({
            type: 'negative',
            message: 'Erro ao carregar dados. Verifique sua conexão e permissões.',
        });
    } finally {
        loading.value = false;
    }
}

// --- Funções de Modal ---

function limparFormulario() {
    aluguelForm.value = {
        id: null,
        renterId: null,
        bookId: null,
        rentDate: null,
        deadLine: null,
    };
    errosCadastro.value = {}; 
}

function fecharModal() {
    modalAberto.value = false;
    limparFormulario();
}

function openCreateModal() {
    editando.value = false;
    limparFormulario();
    modalAberto.value = true;
}

function openEditModal(aluguel) {
    editando.value = true;
    errosCadastro.value = {}; 

    aluguelForm.value = {
        id: aluguel.id,
        renterId: aluguel.renter?.id || null, 
        bookId: aluguel.book?.id || null,     
        rentDate: aluguel.rentDate?.substring(0, 10) || null,
        deadLine: aluguel.deadLine?.substring(0, 10) || null,
    };
    modalAberto.value = true;
}

// --- FUNÇÃO DE CADASTRO/ATUALIZAÇÃO ---
async function salvarAluguel() {
    if (!validarFormulario()) {
        $q.notify({
            type: "warning",
            message: "Preencha todos os campos obrigatórios para salvar.",
        });
        return; 
    }

    salvando.value = true;
    try {
        if (editando.value) {
            await AlugueisService.updateAluguel(aluguelForm.value.id, aluguelForm.value);
            $q.notify({ type: "positive", message: "Aluguel atualizado com sucesso!" });
        } else {
            await AlugueisService.createAluguel(aluguelForm.value);
            $q.notify({ type: "positive", message: "Aluguel cadastrado com sucesso!" });
        }

        await fetchAllData(); 
        fecharModal();
    } catch (error) {
        let errorMessage = "Erro ao salvar o aluguel.";

        if (error.response?.data?.detail) {
            errorMessage = error.response.data.detail;
        } else if (error.response?.data?.message) {
             errorMessage = error.response.data.message;
        }

        $q.notify({
            type: "negative",
            message: errorMessage,
        });
    } finally {
        salvando.value = false;
    }
}

// --- Funções de Ações Adicionais (Aceitar Devolução) ---

// --- Funções de Ações Adicionais (Aceitar Devolução) ---

// --- Funções de Ações Adicionais (Aceitar Devolução) ---

async function registrarRecebimento(aluguel) {
    // Estilos
    const BG_COLOR = '#0d1b2a'; // Fundo do modal (cor azul escura)
    const TEXT_COLOR = 'white'; // Cor do texto
    const BUTTON_COLOR = '#274e55'; // Cor dos botões (azul acinzentado)

    // Aplica estilos customizados no modal (usando classe e cores de botão)
    $q.dialog({
        // Título e Mensagem com cores embutidas (o fundo é mais difícil de mudar
        // diretamente, mas a classe 'text-white' ajuda)
        title: `<span style="color: ${TEXT_COLOR};">Confirmar Recebimento</span>`,
        message: `<span style="color: ${TEXT_COLOR};">Deseja marcar o livro <strong>"${aluguel.book?.name}"</strong> como recebido? A data de hoje será registrada como devolução.</span>`,
       
        html: true, // Importante: Permite HTML no título e mensagem
        
        // Botão de Cancelar
        cancel: {
            label: 'Cancelar',
            color: BUTTON_COLOR, // Cor #274e55
            flat: true
        },

        // Botão de OK (Confirmação)
        ok: {
            label: 'Confirmar',
            color: BUTTON_COLOR // Cor #274e55
        },
        
        // Classe para tentar aplicar o fundo escuro do modal
        // IMPORTANTE: Esta classe precisa ser definida no CSS global para ter efeito total.
        class: 'dialogo-escuro', 

        persistent: true
    }).onOk(async () => {
        try {
            const dados = {
                ...aluguel,
                devolutionDate: new Date().toISOString().split('T')[0] 
            };

            await AlugueisService.updateAluguel(aluguel.id, dados);
            
            $q.notify({ type: 'positive', message: 'Livro recebido com sucesso! Status atualizado.' });
            await fetchAllData(); 
        } catch (error) {
            $q.notify({ 
                type: 'negative', 
                message: 'Erro ao registrar recebimento. Verifique o servidor.' 
            });
        }
    });
}


// --- Inicialização
onMounted(() => {
    fetchAllData(); 
});
</script>