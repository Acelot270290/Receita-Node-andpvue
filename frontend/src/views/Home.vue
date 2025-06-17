<template>
  <div class="home-content">
    <h1>Dashboard</h1>
    <p class="subtitle">Bem-vindo(a) ao seu livro de receitas digital!</p>

    <div class="stats-cards">
      <div class="card">
        <h2>{{ totalReceitas }}</h2>
        <p>Receitas Criadas</p>
      </div>
      <div class="card">
        <h2>{{ totalCategorias }}</h2>
        <p>Categorias</p>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Acesso Rápido</h2>
      <button @click="goToNewRecipe" class="action-btn">+ Nova Receita</button>
      <button @click="comingSoon" class="action-btn">+ Nova Categoria</button>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import RecipeService from '../services/RecipeService';
import CategoryService from '../services/CategoryService';

export default {
  data() {
    return {
      totalReceitas: 0,
      totalCategorias: 0
    };
  },
  methods: {
    async fetchCounts() {
      try {
        const [resReceitas, resCategorias] = await Promise.all([
          RecipeService.getCount(),
          CategoryService.getCategoryCount()
        ]);

        this.totalReceitas = resReceitas.data.count;
        this.totalCategorias = resCategorias.data.count;
      } catch (error) {
        console.error('Erro ao buscar contagens:', error);
      }
    },
    goToNewRecipe() {
      this.$router.push({ name: 'NewRecipe' });
    },
    comingSoon() {
      Swal.fire('Em breve!', 'Esta funcionalidade ainda está em desenvolvimento.', 'info');
    }
  },
  mounted() {
    this.fetchCounts();
  }
};
</script>

<style scoped>
.action-btn {
  padding: 0.75rem 1.5rem;
  margin-right: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #4f46e5;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
}
.action-btn:hover {
  background-color: #4338ca;
}

.home-content h1 {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}
.subtitle {
  font-size: 1.2rem;
  color: #475569;
  margin-bottom: 2.5rem;
}
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}
.card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  text-align: center;
}
.card h2 {
  font-size: 3rem;
  color: #4f46e5;
  margin: 0;
}
.card p {
  margin: 0.5rem 0 0 0;
  color: #64748b;
}
.quick-actions h2 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 1rem;
}
</style>
