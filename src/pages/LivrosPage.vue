<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <div class="titulo q-mb-sm flex items-center">
            <q-icon name="menu_book" size="32px" class="q-mr-sm" color="primary" />
            Livros
          </div>
        </div>

        <div class="col-6 col-md-2">
          <q-btn
            class="CadastroBTN"
            label="Cadastrar"
            color="primary"
            @click="abrirModalCadastro"
          />
        </div>

        <div class="col-6 col-md-4">
          <q-input
            class="pesquisaALL"
            standout
            v-model="termoPesquisa"
            label="Pesquisar Livro"
            debounce="300" 
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table
      :rows="livros"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[5, 10, 20]"
      :loading="carregando"
      :filter="termoPesquisa"
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
            <span v-if="col.name === 'publisher'">{{ props.row.publisher?.name || 'N/A' }}</span>
            <span v-else>{{ col.value }}</span>
          </q-td>
          <q-td>
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              @click="abrirModalEdicao(props.row)"
            />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click="confirmarExclusao(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>
      
      <template v-slot:loading>
        <q-inner-loading showing color="primary" label="Carregando livros..." />
      </template>
    </q-table>

    <q-dialog v-model="modalAberto">
      <q-card class="modal" id="modalGrande">
        <q-form @submit.prevent="salvarLivro">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">{{ editando ? 'Atualizar Livro' : 'Cadastrar Livro' }}</div>
            <q-input class="inputModal" outlined v-model="livroForm.name" label="Título do Livro" required />
            <q-input class="inputModal" outlined v-model="livroForm.author" label="Autor" required />
            
            <q-input class="inputModal" outlined v-model="livroForm.launchDate" label="Data de Lançamento" type="date" stack-label required />
            
            <q-input 
              class="inputModal" 
              outlined 
              v-model.number="livroForm.totalQuantity" 
              label="Quantidade Total" 
              type="number"
              required 
              :disable="editando"
            />
            
            <q-input 
              v-if="editando" 
              class="inputModal" 
              outlined 
              v-model.number="livroForm.totalInUse" 
              label="Em Uso (Não Editável)" 
              type="number"
              disable
            />

            <q-select
              class="inputModal" 
              outlined
              v-model="livroForm.publisherName"
              :options="opcoesEditoras"
              label="Editora"
              required
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

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%;">
        <q-card-section class="conteudoModal">
          <div class="text-h6">Certeza que deseja excluir o Livro ID: **{{ livroParaDeletarId }}**?</div>
          <div class="text-h6">Após essa ação não haverá retorno.</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Excluir" color="negative" @click="deletarLivroConfirmado" />
          <q-btn class="modalBTN" label="Voltar" flat @click="modalExcluir = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import LivrosService from 'src/services/livrosService' 

const $q = useQuasar()

// --- Reatividade de Dados e Tabela
const livros = ref([])
const carregando = ref(true)
const termoPesquisa = ref('')
const opcoesEditoras = ref([]) 

const livroForm = ref({ 
  id: null,
  name: '', 
  author: '', 
  launchDate: '', 
  totalQuantity: null, 
  totalInUse: 0, 
  publisherName: '' 
})

// Variáveis de Estado dos Modais
const modalAberto = ref(false) 
const editando = ref(false)
const salvando = ref(false)
const modalExcluir = ref(false) 
const livroParaDeletarId = ref(null)

// Colunas da Tabela
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Título', field: 'name', align: 'left', sortable: true },
  { name: 'author', label: 'Autor', field: 'author', align: 'left', sortable: true },
  // Formatando a data para exibir apenas AAAA-MM-DD
  { name: 'launchDate', label: 'Lançamento', field: 'launchDate', align: 'center', sortable: true, format: val => val ? val.substring(0, 10) : 'N/A' },
  { name: 'totalQuantity', label: 'Total', field: 'totalQuantity', align: 'center', sortable: true },
  { name: 'totalInUse', label: 'Em Uso', field: 'totalInUse', align: 'center', sortable: true },
  { name: 'publisher', label: 'Editora', field: row => row.publisher?.name || 'N/A', align: 'left', sortable: true },
]


// --- Funções de API

async function carregarTudo() {
  carregando.value = true
  try {
    // 1. Carrega Editoras
    const editoras = await LivrosService.carregarEditoras()
    opcoesEditoras.value = editoras.map(e => e.name) 
    
    // 2. Carrega Livros
    livros.value = await LivrosService.buscarTodos()

  } catch (error) {
    console.error('Falha geral ao carregar dados:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao carregar dados da API. Verifique o servidor/rede.'
    })
    livros.value = []
  } finally {
    carregando.value = false
  }
}

// --- Funções de Modal

function limparFormulario() {
  livroForm.value = { 
    id: null,
    name: '',
    author: '',
    launchDate: '',
    totalQuantity: null,
    totalInUse: 0,
    publisherName: ''
  }
}

function fecharModal() {
  modalAberto.value = false
  limparFormulario()
}

function abrirModalCadastro() {
  editando.value = false
  limparFormulario()
  modalAberto.value = true
}

function abrirModalEdicao(livro) {
  editando.value = true
  // Garantimos que a data está no formato 'YYYY-MM-DD' para o input type="date"
  const launchDateString = livro.launchDate ? livro.launchDate.substring(0, 10) : ''

  livroForm.value = {
    id: livro.id,
    name: livro.name,
    author: livro.author,
    launchDate: launchDateString,
    totalQuantity: livro.totalQuantity,
    totalInUse: livro.totalInUse,
    // Pega o nome da editora do objeto aninhado
    publisherName: livro.publisher?.name || ''
  }
  modalAberto.value = true
}

async function salvarLivro() {
  salvando.value = true
  try {
    if (editando.value) {
      await LivrosService.atualizar(livroForm.value.id, livroForm.value)
      $q.notify({ type: 'positive', message: 'Livro atualizado com sucesso!' })
    } else {
      await LivrosService.cadastrar(livroForm.value)
      $q.notify({ type: 'positive', message: 'Livro cadastrado com sucesso!' })
    }

    await carregarTudo()
    fecharModal()

  } catch (error) {
    $q.notify({
      type: 'negative',
      // Aqui a mensagem de erro do serviço (se o ID da editora falhar) será exibida.
      message: error.message || 'Erro ao salvar o livro.'
    })
  } finally {
    salvando.value = false
  }
}


// --- Funções de Exclusão

function confirmarExclusao(id) {
  livroParaDeletarId.value = id
  modalExcluir.value = true
}

async function deletarLivroConfirmado() {
  modalExcluir.value = false
  carregando.value = true
  try {
    await LivrosService.deletar(livroParaDeletarId.value)
    $q.notify({ type: 'positive', message: 'Livro deletado com sucesso!' })
    await carregarTudo() 
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao deletar o livro.'
    })
  } finally {
    carregando.value = false
  }
}


// --- Inicialização
onMounted(() => {
  carregarTudo()
})
</script>