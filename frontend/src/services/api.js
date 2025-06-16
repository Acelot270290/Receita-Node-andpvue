import axios from 'axios';
import Swal from 'sweetalert2';

// Cria uma instância do Axios com a URL base da nossa API
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// --- INTERCETOR DE REQUISIÇÃO (Já existente) ---
// Adiciona o token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


// ✅ --- INTERCETOR DE RESPOSTA ATUALIZADO ---
// Trata os erros de forma global
api.interceptors.response.use(
  // Se a resposta for bem-sucedida, não faz nada, apenas a repassa.
  response => response,

  // Se a resposta tiver um erro...
  error => {
    // ✅ CORREÇÃO: Verifica se o erro é 401 (Não Autorizado) OU 403 (Proibido/Token Expirado)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // 1. Remove o token inválido do armazenamento
      localStorage.removeItem('authToken');

      // 2. Mostra um alerta amigável para o utilizador
      Swal.fire({
        icon: 'warning',
        title: 'Sessão Expirada',
        text: 'Por favor, faça o login novamente para continuar.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        // 3. Redireciona o utilizador para a página de login APÓS ele fechar o alerta
        window.location.href = '/login';
      });
      
    }

    // Para todos os outros erros, apenas os repassa para que possam ser
    // tratados localmente (nos componentes que fizeram a chamada).
    return Promise.reject(error);
  }
);


export default api;
