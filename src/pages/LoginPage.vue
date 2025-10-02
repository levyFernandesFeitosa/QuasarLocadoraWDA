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

<script>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import authService from 'src/service/authService.js'; // Importa seu serviço de autenticação
import logo from 'src/assets/wda-group-logo.png'; // Ajuste para seu caminho de logo

export default {
  // O nome do componente (opcional, mas recomendado)
  name: 'LoginPage', 
  
  // A função setup é onde você define as variáveis reativas e métodos
  setup() {
    // Hooks do Vue e Quasar
    const router = useRouter();
    const $q = useQuasar();

    // VARIÁVEIS REATIVAS (v-model no template)
    const email = ref('');
    const password = ref('');
    const error = ref(null); // Para a mensagem de erro no q-banner
    const loading = ref(false); // Para desabilitar o botão enquanto espera a resposta

    // FUNÇÃO PRINCIPAL DE LOGIN (chamada pelo @submit.prevent="handleLogin")
    const handleLogin = async () => {
      // Limpa a mensagem de erro anterior e ativa o estado de loading
      error.value = null; 
      loading.value = true;

      try {
        // 1. Chama a função de login no service
        await authService.login(email.value, password.value);

        // 2. Se for sucesso: notifica e redireciona
        $q.notify({
          type: 'positive',
          message: 'Login bem-sucedido!',
          position: 'top'
        });

        // Redireciona para o dashboard (ajuste o path conforme o seu Vue Router)
        // No Quasar, você deve usar o Vue Router para navegação
        router.push('/dashboard'); 
        
      } catch (err) {
        // 3. Se for erro: exibe a mensagem
        loading.value = false;
        
        // Tentativa de pegar a mensagem de erro da API ou um padrão
        const msg = err.response?.data?.message || 'Email ou senha inválidos. Tente novamente.';
        error.value = msg; 
        
        $q.notify({
          type: 'negative',
          message: msg,
          position: 'top',
          timeout: 5000 
        });
      } finally {
        // 4. Garante que o loading seja desativado
        loading.value = false;
      }
    };

    // Retorna todas as variáveis e funções que o template usa
    return {
      logo, // Se você estiver usando uma imagem
      email,
      password,
      error,
      loading,
      handleLogin,
    };
  }
};
</script>
