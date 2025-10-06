// src/boot/quasar-lang.js

import { Lang } from 'quasar' // Importa apenas Lang, que é o necessário

// O defineBoot ('#q-app/wrappers') foi removido.
// Usamos o formato padrão de exportação de boot file do Quasar.
export default async ({ app }) => {
  // Define o idioma padrão do seu aplicativo.
  // Deve ser o mesmo que o 'locale' definido em src/boot/i18n.js
  const defaultLang = 'pt-BR'

  try {
    // 1. Importa dinamicamente o pacote de linguagem do Quasar
    // Note que usamos o formato padrão de boot file, recebendo o objeto app.
    const langPack = await import(`quasar/lang/${defaultLang}.mjs`)
    
    // 2. Define a linguagem para os componentes do Quasar
    // Usamos Lang.set() diretamente, sem depender de $q ou defineBoot.
    Lang.set(langPack.default)
    
  } catch (err) {
    // Tratamento de erro
    console.error(`[Quasar Lang] Falha ao carregar o pacote de linguagem do Quasar para ${defaultLang}:`, err)
  }
}
