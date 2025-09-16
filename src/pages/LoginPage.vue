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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from 'src/assets/image.png'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  error.value = ''

  if (email.value === 'admin@gmail.com' && password.value === '12345678') {
    // Armazena um token fake só pra manter a lógica de autenticação
    localStorage.setItem('authToken', 'fake-token-admin')
    router.push('/dashboard')
  } else {
    error.value = 'Email ou senha inválidos'
  }
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')

  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

</script>
