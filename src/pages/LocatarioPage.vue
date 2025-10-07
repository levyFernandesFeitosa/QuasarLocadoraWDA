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
      :rows-per-page-options="$q.screen.lt.md ? [] : [6, 10, 20]"
      :pagination="{
        page: 1,
        rowsPerPage: $q.screen.lt.md ? 0 : 6,
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
          <q-td >
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
      <q-card class="modal " id="modalGrande">
        <div class="tituloModal">Cadastrar Locatário</div>
        <q-card-section class="conteudoModal">
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
      <q-card class="modal" id="modalGrande">
        <div class="tituloModal">Atualizar Locatário</div>
        <q-card-section class="conteudoModal">
          
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
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import LocatarioService from 'src/services/locatarioService'; // O serviço que criamos

const $q = useQuasar();

// 1. Variáveis de Estado (Modais e Formulários)
const allLocatarios = ref([]);
const loading = ref(false);
const pesquisa = ref('');
const locatarioParaExcluir = ref(null);

// Estado do Modal de Cadastro
const modalCadastro = ref(false);
const novoLocatario = ref({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
});
const errosCadastro = ref({}); // Para validar os inputs

// Estado do Modal de Edição
const modalEditar = ref(false);
const locatarioEditar = ref({
    id: null,
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
});
const modalExcluir = ref(false);

// 2. Colunas da Tabela (Mantido do seu código)
const columns = [
    { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
    { name: 'email', label: 'E-mail', field: 'email', align: 'left', sortable: true },
    { name: 'telephone', label: 'Telefone', field: 'telephone', align: 'left' },
    { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
    { name: 'address', label: 'Endereço', field: 'address', align: 'left' },
];

// --- 3. Funções de UI (Modais e Validação) ---

// FUNÇÃO RESTAURADA: Valida um campo individualmente (para o @input)
const validarCampo = (campo) => {
    if (!novoLocatario.value[campo] || novoLocatario.value[campo].trim() === '') {
        errosCadastro.value[campo] = true;
    } else {
        delete errosCadastro.value[campo];
    }
};

// NOVA FUNÇÃO: Valida o formulário inteiro antes de enviar
const validarFormulario = () => {
    errosCadastro.value = {};
    let valido = true;
    
    // Lista de campos obrigatórios
    const camposObrigatorios = ['nome', 'email', 'telefone', 'cpf', 'endereco'];

    camposObrigatorios.forEach(campo => {
        if (!novoLocatario.value[campo] || novoLocatario.value[campo].trim() === '') {
            errosCadastro.value[campo] = true;
            valido = false;
        }
    });
    return valido;
};

const abrirModalCadastro = () => {
    // Limpa o formulário antes de abrir
    novoLocatario.value = { nome: '', email: '', telefone: '', cpf: '', endereco: '' };
    errosCadastro.value = {}; // Limpa os erros!
    modalCadastro.value = true;
};

const editarLocatario = (locatario) => {
    // Preenche o formulário com os dados do locatário
    locatarioEditar.value = {
        id: locatario.id,
        nome: locatario.name,
        email: locatario.email,
        telefone: locatario.telephone,
        cpf: locatario.cpf,
        endereco: locatario.address,
    };
    modalEditar.value = true;
};

const confirmarExcluir = (locatario) => {
    locatarioParaExcluir.value = locatario;
    modalExcluir.value = true;
};


// --- 4. Lógica CRUD (Chama o Service) ---

const fetchLocatarios = async () => {
    loading.value = true;
    try {
        const data = await LocatarioService.getAll();
        allLocatarios.value = data;
    } catch (error) {
        const errorMessage = error.message || 'Erro ao carregar a lista de locatários. Verifique a API.';
        $q.notify({ 
            type: 'negative', 
            message: errorMessage,
            timeout: 5000 
        });
    } finally {
        loading.value = false;
    }
};

const cadastrarLocatario = async () => {
    // 1. VALIDAÇÃO DO FRONTEND
    if (!validarFormulario()) {
        $q.notify({ type: 'warning', message: 'Preencha todos os campos obrigatórios para cadastrar.' });
        return; // Sai da função se a validação falhar
    }
    
    // Mapeia os dados para a API
    const dataAPI = {
        name: novoLocatario.value.nome,
        email: novoLocatario.value.email,
        telephone: novoLocatario.value.telefone,
        cpf: novoLocatario.value.cpf,
        address: novoLocatario.value.endereco,
    };

    try {
        await LocatarioService.create(dataAPI);
        
        // Notificação de SUCESSO
        $q.notify({ type: 'positive', message: 'Locatário cadastrado com sucesso!' });
        
        modalCadastro.value = false;
        fetchLocatarios(); // Recarrega a lista
    } catch (error) {
        let errorMessage = 'Erro desconhecido ao cadastrar.';

        if (error.response && error.response.data) {
            const apiData = error.response.data;
            if (typeof apiData.message === 'string') {
                errorMessage = apiData.message;
            } else if (typeof apiData.detail === 'string') {
                errorMessage = apiData.detail;
            } else if (error.response.status === 400) {
                 errorMessage = 'Erro de validação nos dados. Verifique todos os campos.';
            }
        } else {
             errorMessage = error.message || 'Erro na conexão ou no servidor.';
        }

        // Notificação de FALHA
        $q.notify({ 
            type: 'negative', 
            message: errorMessage,
            timeout: 5000 
        });
    }
};

const atualizarLocatario = async () => {
    const dataAPI = {
        name: locatarioEditar.value.nome,
        email: locatarioEditar.value.email,
        telephone: locatarioEditar.value.telefone,
        cpf: locatarioEditar.value.cpf,
        address: locatarioEditar.value.endereco,
    };

    try {
        await LocatarioService.update(locatarioEditar.value.id, dataAPI);
        
        // Notificação de SUCESSO
        $q.notify({ type: 'positive', message: 'Locatário atualizado com sucesso!' });
        
        modalEditar.value = false;
        fetchLocatarios(); // Recarrega a lista
    } catch (error) {
         let errorMessage = error.message || 'Erro ao atualizar locatário.';

         if (error.response?.data?.message) {
             errorMessage = error.response.data.message;
         }

         // Notificação de FALHA
         $q.notify({ 
             type: 'negative', 
             message: errorMessage,
             timeout: 5000 
         });
    }
};

const excluirLocatario = async () => {
    if (!locatarioParaExcluir.value) return;

    try {
        await LocatarioService.delete(locatarioParaExcluir.value.id);
        
        // Notificação de SUCESSO
        $q.notify({ type: 'positive', message: 'Locatário excluído com sucesso!' });
        
        modalExcluir.value = false;
        fetchLocatarios(); // Recarrega a lista
    } catch (error) {
        let errorMessage = 'Erro ao excluir locatário.';

        // Tratamento específico para o 400 (Bad Request)
        if (error.response?.status === 400) {
             const apiMessage = error.response.data?.message;
             
             if (apiMessage && typeof apiMessage === 'string') {
                 errorMessage = apiMessage;
             } else {
                 // Mensagem para restrições de negócio (locatário com aluguel ativo)
                 errorMessage = 'Não foi possível deletar o locatário. Ele pode estar vinculado a um aluguel ou a outros registros.';
             }
        } else if (error.response?.status === 403) {
            errorMessage = 'Acesso negado. Você não tem permissão para excluir.';
        } else {
            errorMessage = error.message || 'Erro inesperado na exclusão.';
        }

        // Notificação de FALHA
        $q.notify({ 
            type: 'negative', 
            message: errorMessage,
            timeout: 7000
        });
    }
};

// 5. Computed Properties (Filtragem/Pesquisa)
const locatariosFiltrados = computed(() => {
    const termo = pesquisa.value.toLowerCase();
    if (!termo) return allLocatarios.value;
    
    return allLocatarios.value.filter(locatario => 
        locatario.name.toLowerCase().includes(termo) ||
        locatario.email.toLowerCase().includes(termo) ||
        locatario.cpf.includes(termo)
    );
});

onMounted(fetchLocatarios);
</script>