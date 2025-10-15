<template>
  <q-page class="flex flex-center q-pa-md" style="height: 100vh; background-color: #edead0;">
    
    <div class="language-selector-container">
      
      <q-btn 
        round 
        flat 
        icon="language" 
        @click="langMenuVisible = !langMenuVisible" 
        :color="langMenuVisible ? 'primary' : 'grey-8'"
        size="md"
        class="q-pa-sm"
      />
      
      <div v-if="langMenuVisible" class="language-menu shadow-5">
        <q-list dense>
          <q-item
            v-for="lang in languages"
            :key="lang.code"
            clickable
            @click="changeLanguage(lang.code)"
            :active="locale === lang.code"
            active-class="bg-blue-1"
          >
            <q-item-section avatar>
              <div :class="lang.icon" style="width: 25px; height: 18px; background-size: contain; background-repeat: no-repeat;"></div>
            </q-item-section>
            <q-item-section>
              {{ lang.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      
    </div>

    <q-card class="row q-card-login-responsive" style="border-radius: 3vh;">
      
      <div 
        class="containerLeft col-md-5 hidden-sm hidden-xs" 
        style="border-radius: 3vh;"
      >
        <div class="flex">
          <div class="contentLeft"> 
            <div class="logoWDA"><img :src="logo" alt="Logo WDA" /></div>
            <div class="text1">{{ $t('login.welcome_to') }}</div>
            <div class="text2">{{ $t('login.app_name') }}</div>
          </div>
        </div>
      </div>
      
      <div class="containerRight col-xs-12 col-sm-12 col-md-7">
        <q-card flat class="full-width" >
          <q-card-section>
            <div class="text3">{{ $t('login.make_your_login') }}</div>
            <div class="text4">{{ $t('login.happy_to_see_you_again') }}</div>
          </q-card-section>
          
          <q-form class="campos" @submit.prevent="handleLogin">
            <q-input 
              filled 
              v-model="email" 
              :label="$t('login.email_label')" 
              outlined 
              type="email" 
              required 
              :disable="loading"
            />
            <q-input 
              filled 
              v-model="password" 
              :label="$t('login.password_label')" 
              type="password" 
              required 
              :disable="loading"
            />
            <q-btn 
              :label="$t('login.enter_button')" 
              type="submit" 
              color="primary" 
              :loading="loading"
            />
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
// Certifique-se de que este caminho está correto
import authService from 'src/services/authService.js'; 
// Certifique-se de que este caminho está correto
import { usuarioService } from 'src/services/usuarioService';
import logo from 'src/assets/image.png'; 
import { useI18n } from 'vue-i18n'; 

export default {
  name: 'LoginPage', 
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const { t, locale } = useI18n(); 

    // VARIÁVEIS REATIVAS EXISTENTES
    const email = ref('');
    const password = ref('');
    const error = ref(null); 
    const loading = ref(false); 

    // NOVO: Estado para controlar a visibilidade das bandeiras
    const langMenuVisible = ref(false);

    // NOVO: Dados das linguagens
    const languages = [
      { code: 'pt-BR', name: 'Português', icon: 'flag-icon flag-icon-br' }, 
      { code: 'en-US', name: 'English (US)', icon: 'flag-icon flag-icon-us' }, 
      { code: 'es', name: 'Español', icon: 'flag-icon flag-icon-es' },
      { code: 'fr', name: 'Français', icon: 'flag-icon flag-icon-fr' },
    ];

    // NOVO: Função para mudar o idioma
    const changeLanguage = (langCode) => {
      locale.value = langCode;
      localStorage.setItem('user-language', langCode);
      langMenuVisible.value = false;
    };

    // FUNÇÃO PRINCIPAL DE LOGIN (handleLogin) - ATUALIZADA
    const handleLogin = async () => {
      error.value = null; 
      loading.value = true;
      const loginEmail = email.value.toLowerCase(); // Captura o email para busca

      try {
        // 1. Tenta fazer o login e salvar o token (authService.js já faz isso)
        // Precisamos apenas da confirmação de sucesso para prosseguir
        await authService.login(loginEmail, password.value);
        
        console.log("Passo 1: Login bem-sucedido. Token salvo.");

        // 2. BUSCA A LISTA COMPLETA DE USUÁRIOS (Usando o token recém-salvo)
        const allUsers = await usuarioService.listarUsuarios();
        
        // 3. ENCONTRA O USUÁRIO LOGADO PELO E-MAIL
        const loggedUser = allUsers.find(
          (user) => user.email.toLowerCase() === loginEmail
        );

        if (loggedUser) {
            // 4. SALVA APENAS OS DADOS DO USUÁRIO ENCONTRADO
            // O MainLayout precisa de { name, email, role }
            localStorage.setItem('userInfo', JSON.stringify(loggedUser));
            console.log("Passo 4: Dados do usuário encontrados e salvos:", loggedUser.name);
        } else {
            console.error("Usuário autenticado, mas não encontrado na listagem. MainLayout pode falhar.");
            // Salva apenas os dados conhecidos para evitar o 'Carregando...'
            localStorage.setItem('userInfo', JSON.stringify({ 
                name: loginEmail.split('@')[0], 
                email: loginEmail, 
                role: 'GUEST' // Assume um papel padrão
            }));
        }

        $q.notify({
          type: 'positive',
          message: t('login.success_message'), 
          position: 'top'
        });

        router.push('/dashboard'); 
        
      } catch (err) {
        loading.value = false;
        
        const fallbackMsg = t('login.error_message_default'); 
        const msg = err.response?.data?.message || err.message || fallbackMsg;
        error.value = msg; 
        
        $q.notify({
          type: 'negative',
          message: msg,
          position: 'top',
          timeout: 5000 
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      logo, 
      email,
      password,
      error,
      loading,
      handleLogin,
      locale,
      languages,
      changeLanguage,
      langMenuVisible,
    };
  }
};
</script>