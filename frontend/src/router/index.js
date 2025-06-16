import { createRouter, createWebHistory } from 'vue-router';
import AuthView from '../Auth/AuthView.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import Home from '../views/Home.vue';
import RecipeForm from '../views/RecipeForm.vue';
import RecipesListView from '../views/RecipesListView.vue'; // 1. Importa a nova página de lista

const routes = [
  // Rota de autenticação
  {
    path: '/login',
    name: 'Auth',
    component: AuthView
  },
  // Rota principal que usa o DashboardLayout
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true }, // Todas as rotas filhas exigirão autenticação
    children: [
      {
        path: '', // Quando o caminho for '/', vai renderizar a Home
        name: 'Home',
        component: Home
      },
      {
        path: 'receitas/nova', // O caminho será localhost:8080/receitas/nova
        name: 'NewRecipe',
        component: RecipeForm
      },
      // ✅ 2. ADICIONA A NOVA ROTA PARA A LISTA DE RECEITAS
      {
        path: 'recipes', // O caminho será localhost:8080/recipes
        name: 'Recipes',
        component: RecipesListView
      },
       { 
        path: 'receitas/:id/editar', // Rota dinâmica com o ID da receita
        name: 'EditRecipe', 
        component: RecipeForm,
        props: true // Permite passar o ':id' como prop para o componente RecipeForm
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// A guarda de navegação continua a mesma, mas agora protege o layout
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('authToken');

  // Redireciona para o login se não estiver autenticado
  if (to.meta.requiresAuth && !loggedIn) {
    next({ name: 'Auth' });
  } else if (to.name === 'Auth' && loggedIn) {
    // Se o usuário já logado tentar ir para /login, redireciona para a Home
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
