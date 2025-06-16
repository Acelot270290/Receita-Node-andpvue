<template>
  <div class="form-wrapper">
    <h1>{{ isEditMode ? 'Editar Receita' : 'Criar Nova Receita' }}</h1>
    
    <form @submit.prevent="submitRecipe" class="recipe-form">
      
      <div class="form-group">
        <label for="nome">Nome da Receita</label>
        <input id="nome" v-model="recipe.nome" type="text" placeholder="Ex: Bolo de Chocolate Fofinho" required />
      </div>

      <div class="form-group">
        <label for="categoria">Categoria</label>
        <select id="categoria" v-model="recipe.categoriaId" required>
          <option disabled value="">Selecione uma categoria</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.nome }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="ingredientes">Ingredientes (um por linha)</label>
        <textarea id="ingredientes" v-model="ingredientsText" rows="8" placeholder="Ex:&#10;1 xícara de farinha&#10;2 ovos&#10;1 lata de leite condensado" required></textarea>
      </div>
      
      <div class="form-group">
        <label for="modo_preparo">Modo de Preparo</label>
        <textarea id="modo_preparo" v-model="recipe.modo_preparo" rows="8" placeholder="Descreva o passo a passo da sua receita..." required></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="tempo_preparo">Tempo de Preparo (minutos)</label>
          <input id="tempo_preparo" v-model.number="recipe.tempo_preparo" type="number" placeholder="Ex: 45" />
        </div>
        <div class="form-group">
          <label for="porcoes">Rendimento (porções)</label>
          <input id="porcoes" v-model.number="recipe.porcoes" type="number" placeholder="Ex: 8" />
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$router.push('/recipes')" class="btn-cancel">Cancelar</button>
        <button type="submit" class="btn-submit">{{ isEditMode ? 'Salvar Alterações' : 'Salvar Receita' }}</button>
      </div>

    </form>
  </div>
</template>

<script>
import CategoryService from '../services/CategoryService';
import RecipeService from '../services/RecipeService';
import Swal from 'sweetalert2';

export default {
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      recipe: {
        nome: '',
        ingredientes: [],
        modo_preparo: '',
        tempo_preparo: null,
        porcoes: null,
        categoriaId: '',
      },
      ingredientsText: '',
      categories: [],
    };
  },
  computed: {
    isEditMode() {
      return !!this.id;
    }
  },
  async created() {
    await this.fetchCategories();
    if (this.isEditMode) {
      await this.fetchRecipeData();
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await CategoryService.getAllCategories();
        this.categories = response.data;
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível buscar as categorias.', 'error');
      }
    },
    async fetchRecipeData() {
      try {
        const response = await RecipeService.getRecipe(this.id);
        const data = response.data;
        this.recipe.nome = data.nome;
        this.recipe.modo_preparo = data.modo_preparo;
        this.recipe.tempo_preparo = data.tempo_preparo;
        this.recipe.porcoes = data.porcoes;
        this.recipe.categoriaId = data.category.id;
        this.ingredientsText = data.ingredientes.join('\n');
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível carregar os dados da receita.', 'error');
        this.$router.push({ name: 'Recipes' });
      }
    },
    async submitRecipe() {
      this.recipe.ingredientes = this.ingredientsText.split('\n').filter(line => line.trim() !== '');
      if (this.recipe.ingredientes.length === 0) {
        Swal.fire('Atenção', 'O campo de ingredientes não pode estar vazio.', 'warning');
        return;
      }

      try {
        if (this.isEditMode) {
          await RecipeService.updateRecipe(this.id, this.recipe);
          Swal.fire('Sucesso!', 'Sua receita foi atualizada.', 'success');
        } else {
          await RecipeService.createRecipe(this.recipe);
          Swal.fire('Sucesso!', 'Sua receita foi criada.', 'success');
        }
        this.$router.push({ name: 'Recipes' });
      } catch (error) {
        Swal.fire('Erro ao Salvar', error.response?.data?.message || 'Não foi possível salvar a receita.', 'error');
      }
    }
  }
}
</script>

<style scoped>
.form-wrapper { background: #fff; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
h1 { font-size: 2rem; color: #1e293b; margin-bottom: 2rem; text-align: center; }
.recipe-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; }
label { margin-bottom: 0.5rem; font-weight: 500; color: #475569; }
input, select, textarea { padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; font-family: 'Poppins', sans-serif; transition: border-color 0.2s, box-shadow 0.2s; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; border-top: 1px solid #e2e8f0; padding-top: 1.5rem; }
.btn-cancel, .btn-submit { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-cancel { background-color: #e2e8f0; color: #475569; }
.btn-cancel:hover { background-color: #cbd5e1; }
.btn-submit { background-color: #4f46e5; color: white; }
.btn-submit:hover { background-color: #4338ca; }
</style>
