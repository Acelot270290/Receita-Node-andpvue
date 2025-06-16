import api from './api'; // Importa nossa instância do Axios configurada

export default {
  // GET /api/receitas
  getAllRecipes() {
    return api.get('/receitas');
  },
  
  // GET /api/receitas/:id
  getRecipe(id) {
    return api.get(`/receitas/${id}`);
  },

  // POST /api/receitas
  createRecipe(recipeData) {
    return api.post('/receitas', recipeData);
  },

  // PUT /api/receitas/:id
  updateRecipe(id, recipeData) {
    return api.put(`/receitas/${id}`, recipeData);
  },

  // DELETE /api/receitas/:id
  deleteRecipe(id) {
    return api.delete(`/receitas/${id}`);
  }
};
