<template>
  <div class="print-container" ref="printArea">
    <header class="print-header">
      <div class="app-logo">🍲</div>
      <h1>RecipeApp</h1>
    </header>
    <main class="recipe-content">
      <h2>{{ recipe.nome }}</h2>
      <div class="meta-info">
        <span class="category-tag">{{ recipe.category.nome }}</span>
        <span><strong>Tempo:</strong> {{ recipe.tempo_preparo || 'N/A' }} min</span>
        <span><strong>Rendimento:</strong> {{ recipe.porcoes || 'N/A' }} porções</span>
      </div>

      <div class="section">
        <h3>Ingredientes</h3>
        <ul>
          <li v-for="(ing, index) in recipe.ingredientes" :key="index">{{ ing }}</li>
        </ul>
      </div>

      <div class="section">
        <h3>Modo de Preparo</h3>
        <p v-html="formattedInstructions"></p>
      </div>
    </main>
    <footer class="print-footer">
      <p>Sua receita, seu sabor. | www.recipeapp.com</p>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Formata o modo de preparo para exibir quebras de linha no HTML
    formattedInstructions() {
      if (!this.recipe.modo_preparo) return '';
      return this.recipe.modo_preparo.replace(/\n/g, '<br>');
    }
  }
}
</script>

<style scoped>
/* Estilos otimizados para um formato A4 */
.print-container {
  font-family: 'Georgia', serif;
  width: 210mm; /* Largura de uma folha A4 */
  min-height: 297mm; /* Altura de uma folha A4, pode crescer */
  padding: 15mm;
  background-color: #fff;
  color: #333;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.print-header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.app-logo {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.print-header h1 {
  font-family: 'Helvetica', sans-serif;
  font-size: 1.5rem;
  color: #444;
  margin: 0;
}

.recipe-content h2 {
  font-size: 2.2rem;
  color: #d66800;
  text-align: center;
  margin-bottom: 1rem;
}

.meta-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  font-style: italic;
  color: #555;
}

.category-tag {
  background-color: #f3e9e0;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-weight: bold;
}

.section {
  margin-bottom: 2rem;
}

.section h3 {
  font-size: 1.6rem;
  color: #333;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

ul {
  list-style-type: '- ';
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

p {
  line-height: 1.8;
  white-space: pre-wrap; /* Preserva as quebras de linha do texto */
}

.print-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 2px solid #eee;
  text-align: center;
  font-style: italic;
  color: #888;
}
</style>
