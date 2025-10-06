<template>
  <q-page class="flex flex-center" style="height: 100vh; background-color: hsl(180, 100%, 92%);">
    
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
    <q-card class="row no-wrap" style="border-radius: 3vh; width: 70%; height: 70%;">
      <div class="containerLeft" style="border-radius: 3vh;">
        <div>
          <div class="logoWDA"><img :src="logo" alt="Logo WDA" /></div>
          <div class="text1">{{ $t('login.welcome_to') }}</div>
          <div class="text2">{{ $t('login.app_name') }}</div>
        </div>
      </div>
      <div class="containerRight">
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
import authService from 'src/services/authService.js'; 
import logo from 'src/assets/wda-group-logo.png';
import { useI18n } from 'vue-i18n'; 

export default {
  name: 'LoginPage', 
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    // NOVO: Destruturando `locale` (o idioma atual) e `t` (função de tradução)
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
      // 1. Altera o locale reativo do vue-i18n
      locale.value = langCode;
      
      // 2. Salva no localStorage (opcional, mas recomendado para persistência)
      localStorage.setItem('user-language', langCode);
      
      // 3. Fecha o menu após a seleção
      langMenuVisible.value = false;
    };

    // FUNÇÃO PRINCIPAL DE LOGIN (handleLogin)
    const handleLogin = async () => {
      error.value = null; 
      loading.value = true;

      try {
        await authService.login(email.value, password.value);

        $q.notify({
          type: 'positive',
          message: t('login.success_message'), 
          position: 'top'
        });

        router.push('/dashboard'); 
        
      } catch (err) {
        loading.value = false;
        
        const fallbackMsg = t('login.error_message_default'); 
        const msg = err.response?.data?.message || fallbackMsg;
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
      // NOVOS RETORNOS PARA O SELETOR DE IDIOMA
      locale,
      languages,
      changeLanguage,
      langMenuVisible,
    };
  }
};
</script>

<style>


/* Nota: Para que as classes de bandeiras (e.g., flag-icon-br) funcionem, 
   certifique-se de ter uma biblioteca como a flag-icon-css configurada no seu projeto Quasar. */
</style>