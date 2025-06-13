import { createRouter, createWebHistory } from 'vue-router';
import AuthView from '../Auth/AuthView.vue';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: AuthView
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } // Marca esta rota como protegida
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// "Guarda de Navegação" - Roda antes de cada mudança de rota
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('authToken');

  // Se a rota requer autenticação e o usuário não está logado
  if (to.meta.requiresAuth && !loggedIn) {
    // Redireciona para a tela de autenticação
    next({ name: 'Auth' });
  } else {
    // Caso contrário, permite o acesso
    next();
  }
});

export default router;
