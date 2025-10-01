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
  import { ref, computed, onMounted } from 'vue';
  import { 
    listarLocatarios, 
    criarLocatario, 
    atualizarLocatario as atualizarLocatarioAPI, 
    deletarLocatario 
  } from 'src/services/locatarioService';

  const locatarios = ref([]);
  const pesquisa = ref('');
  const modalCadastro = ref(false);
  const modalEditar = ref(false);
  const modalExcluir = ref(false);

  const novoLocatario = ref({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: ''
  });

  const locatarioEditar = ref({});
  const locatarioExcluir = ref(null);

  const errosCadastro = ref({
    nome: false,
    email: false,
    telefone: false,
    cpf: false,
    endereco: false
  });

  // Carrega dados na montagem
  onMounted(async () => {
    await carregarLocatarios();
  });

  async function carregarLocatarios() {
    try {
      const { data } = await listarLocatarios();
      locatarios.value = data;
    } catch (err) {
      console.error('Erro ao listar locatários:', err);
    }
  }

  // Criar
  async function cadastrarLocatario() {
    try {
      await criarLocatario(novoLocatario.value);
      modalCadastro.value = false;
      await carregarLocatarios();
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
    }
  }

  // Atualizar
  async function atualizarLocatario() {
    try {
      await atualizarLocatarioAPI(locatarioEditar.value.id, locatarioEditar.value);
      modalEditar.value = false;
      await carregarLocatarios();
    } catch (err) {
      console.error('Erro ao atualizar:', err);
    }
  }

  // Excluir
  async function excluirLocatario() {
    try {
      await deletarLocatario(locatarioExcluir.value.id);
      modalExcluir.value = false;
      await carregarLocatarios();
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  }

  // Abrir modal de cadastro
  function abrirModalCadastro() {
    novoLocatario.value = { nome: '', email: '', telefone: '', cpf: '', endereco: '' };
    modalCadastro.value = true;
  }

  // Abrir modal de edição
  function editarLocatario(locatario) {
    locatarioEditar.value = { ...locatario };
    modalEditar.value = true;
  }

  // Abrir modal de exclusão
  function confirmarExcluir(locatario) {
    locatarioExcluir.value = locatario;
    modalExcluir.value = true;
  }

  // Filtro da pesquisa
  const locatariosFiltrados = computed(() => {
    if (!pesquisa.value) return locatarios.value;
    const termo = pesquisa.value.toLowerCase();
    return locatarios.value.filter(l =>
      l.nome.toLowerCase().includes(termo) ||
      l.email.toLowerCase().includes(termo) ||
      l.telefone.toLowerCase().includes(termo) ||
      l.cpf.toLowerCase().includes(termo) ||
      l.endereco.toLowerCase().includes(termo)
    );
  });

  const columns = [
    { name: 'id', label: 'ID', field: 'id', align: 'left' },
    { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
    { name: 'email', label: 'Email', field: 'email', align: 'left' },
    { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
    { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
    { name: 'endereco', label: 'Endereço', field: 'endereco', align: 'left' }
  ];
</script>

