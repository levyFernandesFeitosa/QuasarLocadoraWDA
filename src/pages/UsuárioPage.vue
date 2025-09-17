<template>
  <q-page class="q-pa-md" style="background-color: #f0ffff;">
    <div class="q-mb-md flex items-center justify-between">
      <div class="q-mb-md flex items-center" style="flex-grow: 1;">
        <div class="titulo q-mb-sm flex items-center">
          <q-icon name="manage_accounts" size="32px" class="q-mr-sm" color="primary" />
          Usuários
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
          label="Pesquisar Usuários"
          :dense="true"
          style="width: 19%; height: 100%; margin-left: 16px;"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <q-table
      :rows="usuariosFiltrados"
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
              @click="editarUsuario(props.row)"
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
      <q-card class="modal" style="height: 80%;">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Cadastrar Locatário</div>
          <q-input
            class="inputModal" outlined
            v-model="novoUsuario.nome"
            label="Nome do Usuário"
            required
          />
          <q-input class="inputModal" outlined v-model="novoUsuario.email" label="Email" required />
          <q-input
            class="inputModal" outlined
            v-model="novoUsuario.senha"
            label="Senha"
            type="password"
            required
          />
          <q-select
            class="inputModalSelect" outlined
            v-model="novoUsuario.tipo"
            :options="['USER', 'ADMIN']"
            label="Tipo de Usuário"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Cadastrar" color="primary" @click="cadastrarUsuario" />
          <q-btn class="modalBTN" label="Cancelar" @click="modalCadastro = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Editar -->
    <q-dialog v-model="modalEditar">
      <q-card class="modal">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">Cadastrar Locatário</div>
          <q-input
            class="inputModal" outlined
            v-model="usuarioEditar.nome"
            label="Nome do Usuário"
            required
          />
          <q-input class="inputModal" outlined v-model="usuarioEditar.email" label="Email" required />
          <q-input
            class="inputModal" outlined
            v-model="usuarioEditar.senha"
            label="Nova Senha (Opcional)"
            type="password"
          />
          <q-input
            class="inputModal" 
            v-model="usuarioEditar.confirmarSenha"
            label="Confirmar Nova Senha"
            type="password"
          />
          <q-select
            class="inputModalSelect" outlined
            v-model="usuarioEditar.tipo"
            :options="['USER', 'ADMIN']"
            label="Tipo de Usuário"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Atualizar" color="primary" @click="atualizarUsuario" />
          <q-btn class="modalBTN" label="Fechar" @click="modalEditar = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Confirmar Excluir -->
    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="max-width: 35%; width: 100%;">
        <q-card-section class="conteudoModal">
          <div class="text-h6">Certeza que deseja excluir esse Usuário?</div>
          <div class="text-h6">Após essa ação não haverá retorno.</div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn class="modalBTN" label="Excluir" color="negative" @click="excluirUsuario" />
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

const usuarios = ref([
  { id: 1, nome: "Ana Paula", email: "ana@email.com", tipo: "USER" },
  { id: 2, nome: "Bruno Lima", email: "bruno@email.com", tipo: "ADMIN" },
  { id: 3, nome: "Carlos Souza", email: "carlos@email.com", tipo: "USER" },
]);

const columns = [
  { name: "nome", label: "Nome do Usuário", field: "nome", align: "left" },
  { name: "email", label: "Email", field: "email", align: "left" },
  { name: "tipo", label: "Permições", field: "tipo", align: "left" },
];

const usuariosFiltrados = computed(() => {
  if (!pesquisa.value) return usuarios.value;
  return usuarios.value.filter(
    (u) =>
      u.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
      u.email.toLowerCase().includes(pesquisa.value.toLowerCase())
  );
});

// Cadastro
const novoUsuario = ref({
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
  tipo: "USER",
});
function abrirModalCadastro() {
  Object.assign(novoUsuario.value, {
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    tipo: "USER",
  });
  modalCadastro.value = true;
}
function cadastrarUsuario() {
  if (novoUsuario.value.senha = null) {
    // Adicione sua lógica de validação aqui
    return;
  }
  const novoId = usuarios.value.length
    ? Math.max(...usuarios.value.map((u) => u.id)) + 1
    : 1;
  usuarios.value.push({
    id: novoId,
    nome: novoUsuario.value.nome,
    email: novoUsuario.value.email,
    tipo: novoUsuario.value.tipo,
  });
  modalCadastro.value = false;
}

// Editar
const usuarioEditar = ref({});
function editarUsuario(usuario) {
  usuarioEditar.value = { ...usuario, senha: "", confirmarSenha: "" };
  modalEditar.value = true;
}
function atualizarUsuario() {
  if (
    usuarioEditar.value.senha &&
    usuarioEditar.value.senha !== usuarioEditar.value.confirmarSenha
  ) {
    // Adicione sua lógica de validação aqui
    return;
  }
  const idx = usuarios.value.findIndex((u) => u.id === usuarioEditar.value.id);
  if (idx !== -1) {
    usuarios.value[idx] = {
      ...usuarios.value[idx],
      nome: usuarioEditar.value.nome,
      email: usuarioEditar.value.email,
      tipo: usuarioEditar.value.tipo,
    };
  }
  modalEditar.value = false;
}

// Excluir
const usuarioExcluir = ref({});
function confirmarExcluir(usuario) {
  usuarioExcluir.value = usuario;
  modalExcluir.value = true;
}
function excluirUsuario() {
  usuarios.value = usuarios.value.filter(
    (u) => u.id !== usuarioExcluir.value.id
  );
  modalExcluir.value = false;
}
</script>