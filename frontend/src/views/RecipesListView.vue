<template>
  <div class="list-container">
    <div class="list-header">
      <h1>Minhas Receitas</h1>
      <router-link to="/receitas/nova" class="btn-new-recipe">+ Adicionar Receita</router-link>
    </div>

    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Pesquisar pelo nome da receita..." />
    </div>

    <div v-if="loading" class="loading-state">A carregar receitas...</div>
    
    <div v-else-if="filteredRecipes.length === 0" class="empty-state">
      <p>Nenhuma receita encontrada.</p>
      <p v-if="searchQuery">Tente um termo de busca diferente.</p>
      <p v-else>Que tal <router-link to="/receitas/nova">criar a sua primeira receita</router-link>?</p>
    </div>

    <table v-else class="recipes-table">
      <thead>
        <tr>
          <th>Nome da Receita</th>
          <th>Categoria</th>
          <th>Tempo de Preparo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="recipe in filteredRecipes" :key="recipe.id">
          <td>{{ recipe.nome }}</td>
          <td>
            <span v-if="recipe.category" class="category-badge">{{ recipe.category.nome }}</span>
            <span v-else>Sem Categoria</span>
          </td>
          <td>{{ recipe.tempo_preparo ? `${recipe.tempo_preparo} min` : 'N/A' }}</td>
          <td class="actions-cell">
            <router-link :to="{ name: 'EditRecipe', params: { id: recipe.id } }" class="action-btn btn-edit" title="Editar">✏️</router-link>
            <button @click="confirmDelete(recipe.id)" class="action-btn btn-delete" title="Excluir">🗑️</button>
            <!-- ✅ BOTÃO DE IMPRIMIR AGORA CHAMA O MÉTODO -->
            <button @click="printRecipe(recipe.id)" class="action-btn btn-print" title="Imprimir">🖨️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ✅ Área invisível para renderizar o componente de impressão -->
    <div style="position: absolute; left: -9999px;">
      <RecipePrint v-if="recipeToPrint" :recipe="recipeToPrint" ref="printableContent" />
    </div>

  </div>
</template>

<script>
import RecipeService from '../services/RecipeService';
import Swal from 'sweetalert2';
import RecipePrint from '../components/RecipePrint.vue'; // 1. Importa o novo componente
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  components: {
    RecipePrint // 2. Regista o componente
  },
  data() {
    return {
      recipes: [],
      searchQuery: '',
      loading: true,
      recipeToPrint: null // 3. Armazena a receita a ser impressa
    };
  },
  computed: {
    // Filtra as receitas com base no texto da busca
    filteredRecipes() {
      if (!this.searchQuery) {
        return this.recipes;
      }
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      return this.recipes.filter(recipe =>
        recipe.nome.toLowerCase().includes(lowerCaseQuery)
      );
    },
  },
  methods: {
    // Busca as receitas do backend
    async fetchRecipes() {
      this.loading = true;
      try {
        const response = await RecipeService.getAllRecipes();
        this.recipes = response.data;
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível buscar as suas receitas.', 'error');
      } finally {
        this.loading = false;
      }
    },
    // Pede confirmação antes de apagar
    confirmDelete(recipeId) {
      Swal.fire({
        title: 'Tem a certeza?',
        text: "Não poderá reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, apagar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteRecipe(recipeId);
        }
      });
    },
    // Apaga a receita
    async deleteRecipe(recipeId) {
      try {
        await RecipeService.deleteRecipe(recipeId);
        this.recipes = this.recipes.filter(r => r.id !== recipeId);
        Swal.fire('Apagado!', 'A sua receita foi apagada com sucesso.', 'success');
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível apagar a receita.', 'error');
      }
    },

    // ✅ 4. NOVO MÉTODO PARA GERAR O PDF
    async printRecipe(recipeId) {
      Swal.fire({
        title: 'A gerar PDF...',
        text: 'Por favor, aguarde um momento.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        // Busca os dados completos da receita
        const response = await RecipeService.getRecipe(recipeId);
        this.recipeToPrint = response.data;

        // Aguarda o Vue renderizar o componente RecipePrint
        await this.$nextTick();
        
        const printArea = this.$refs.printableContent.$refs.printArea;
        const canvas = await html2canvas(printArea, { scale: 2 }); // Aumenta a escala para melhor qualidade
        const imgData = canvas.toDataURL('image/png');

        // Cria o PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Guarda o PDF
        const fileName = `receita-${this.recipeToPrint.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        pdf.save(fileName);

        Swal.close();
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível gerar o PDF da receita.', 'error');
      } finally {
        this.recipeToPrint = null; // Limpa a receita para impressão
      }
    },
  },
  created() {
    this.fetchRecipes();
  },
};
</script>

<style scoped>
.list-container {
  background: #fff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

h1 {
  font-size: 2rem;
  color: #1e293b;
  margin: 0;
}

.btn-new-recipe {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: #4f46e5;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;
}
.btn-new-recipe:hover { background-color: #4338ca; }

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.recipes-table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  background-color: #eef2ff;
  color: #4f46e5;
  font-size: 0.8rem;
  font-weight: 500;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  color: inherit; /* Garante que o emoji não fique azul (cor padrão de link) */
  text-decoration: none; /* Remove o sublinhado do link */
}
.action-btn:hover { background-color: #f1f5f9; }

.empty-state, .loading-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}
</style>
