import api from './api'; // Importa nossa instância do Axios configurada

export default {
  getAllCategories() {
    return api.get('/categorias');
  },

   getCategoryCount() {
    return api.get('/categorias/count');
  }
};
