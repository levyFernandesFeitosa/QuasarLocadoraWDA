// Exemplo do seu arquivo src/boot/i18n.js (ou similar)
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default ({ app }) => {
  // 1. Tenta obter o idioma salvo no Local Storage
  const savedLang = localStorage.getItem('user-language');
  
  // 2. Define o idioma padrão
  let initialLang = 'pt-BR'; // Este deve ser o seu padrão de fallback
  
  // 3. Se houver um idioma salvo, ele é o novo inicial
  if (savedLang) {
    initialLang = savedLang;
  }
  
  // 4. Cria a instância do i18n
  const i18n = createI18n({
    // Usa o idioma encontrado ou o padrão 'pt-BR'
    locale: initialLang,
    // Garante que 'pt-BR' está disponível se houver erro
    fallbackLocale: 'pt-BR', 
    globalInjection: true,
    messages
  });

  // 5. Instala o i18n no seu aplicativo Vue
  app.use(i18n);
};