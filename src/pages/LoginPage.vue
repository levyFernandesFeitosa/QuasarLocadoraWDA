<template>
  <q-page class="flex flex-center" style="height: 100vh; background-color: hsl(180, 100%, 92%);">
    <q-card class="row no-wrap" style="border-radius: 3vh; width: 70%; height: 70%;">
      <!-- Divisão Esquerda -->
      <div class="containerLeft" style="border-radius: 3vh;">
        <div>
          <div class="logoWDA"><img :src="logo" alt="Logo WDA" /></div>
          <div class="text1">Bem Vindo a</div>
          <div class="text2">Locadora de Livros</div>
        </div>
      </div>
      <!-- Divisão Direita -->
      <div class="containerRight">
        <q-card flat class="full-width" >
          <q-card-section>
            <div class="text3">Faça aqui o seu Login</div>
            <div class="text4">feliz em vê-lo novamente!</div>
          </q-card-section>
          <q-form class="campos" @submit.prevent="handleLogin">
            <q-input filled v-model="email" label="Email" outlined type="email" required />
            <q-input filled v-model="password" label="Senha" type="password" required />
            <q-btn label="Entrar" type="submit" color="primary" />
            <q-banner v-if="error" class="q-mt-md bg-red text-white">
              {{ error }}
            </q-banner>
          </q-form>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import logo from 'src/assets/wda-group-logo.png'; // Ajuste para seu caminho de logo

const $q = useQuasar();

const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  try {
    // Usa a função global $authenticate do boot
    const data = await $authenticate(email.value, password.value);

    if (data?.token) {
      $q.notify({ type: 'positive', message: 'Login realizado com sucesso!' });
      window.location.href = '/tudo/html/dashboard.html'; // Ajuste conforme sua rota
    } else {
      error.value = 'Erro ao resgatar token.';
    }
  } catch (err) {
    error.value = 'Email ou senha inválidos.';
  }
};
</script>
