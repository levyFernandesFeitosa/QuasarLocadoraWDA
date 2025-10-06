const routes = [
  // 1. ROTA DE LOGIN (PÚBLICA - path: '/')
  // Esta é a rota que o botão de Logout deve buscar.
  {
    path: '/',
    // O componente de layout que envolve a página de login
    component: () => import('layouts/LoginLayout.vue'), 
    children: [
      // A página de login em si está na rota raiz
      { path: '', component: () => import('pages/LoginPage.vue') } 
    ]
  },

  // 2. ROTAS AUTENTICADAS (PRIVADAS - path: /SEU_MODULO)
  // Agrupa todas as rotas que precisam do MainLayout.
  {
    path: '/', // Define a rota base para que as filhas sejam /dashboard, /locatario, etc.
    // O componente principal que fornece cabeçalho, drawer, etc.
    component: () => import('layouts/MainLayout.vue'), 
    children: [
      // Rotas Filhas (não use barra inicial no path, ex: 'dashboard')
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'locatario', component: () => import('pages/LocatarioPage.vue') },
      { path: 'editoras', component: () => import('pages/EditorasPage.vue') },
      { path: 'livros', component: () => import('pages/LivrosPage.vue') },
      { path: 'alugueis', component: () => import('pages/AlugueisPage.vue') },
      { path: 'usuario', component: () => import('pages/UsuarioPage.vue') }
    ]
  },
  
  // 3. ROTA 404 (Sempre por último)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes