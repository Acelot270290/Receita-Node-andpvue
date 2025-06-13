<template>
  <div class="auth-container">
    <!-- Ícone da aplicação -->
    <div class="app-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
    </div>
    
    <!-- Formulário de Login -->
    <LoginForm 
      v-if="showLogin" 
      @login="handleLogin" 
      @toggle="toggleForm" 
    />

    <!-- Formulário de Registro -->
    <RegisterForm 
      v-else 
      @register="handleRegister" 
      @toggle="toggleForm" 
    />
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';
import AuthService from '../services/AuthService';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'; // 1. Importa o SweetAlert2

export default {
  components: {
    LoginForm,
    RegisterForm
  },
  setup() {
    const router = useRouter();
    const redirectToHome = () => {
      router.push({ name: 'Home' });
    };
    return { redirectToHome };
  },
  data() {
    return {
      showLogin: true,
    };
  },
  methods: {
    toggleForm() {
      this.showLogin = !this.showLogin;
    },
    async handleLogin(credentials) {
      try {
        // Mostra um alerta de carregamento
        Swal.fire({
          title: 'Aguarde...',
          text: 'Verificando suas credenciais.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await AuthService.login(credentials);
        localStorage.setItem('authToken', response.data.token);
        
        Swal.close(); // Fecha o alerta de carregamento
        this.redirectToHome();

      } catch (err) {
        // 2. Substitui o erro de texto por um SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Ops...',
          text: err.response?.data?.message || 'Credenciais inválidas!',
          confirmButtonColor: '#d33'
        });
      }
    },
    async handleRegister(userInfo) {
      try {
        Swal.fire({
          title: 'Aguarde...',
          text: 'Criando sua conta.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await AuthService.register(userInfo);
        
        // 3. Alerta de sucesso para o registro
        Swal.fire({
          icon: 'success',
          title: 'Conta Criada!',
          text: 'Seu registro foi realizado com sucesso. Agora você pode fazer login.',
          confirmButtonColor: '#3085d6'
        });

        this.showLogin = true; // Muda para o formulário de login

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Erro no Registro',
          text: err.response?.data?.message || 'Não foi possível criar a conta.',
          confirmButtonColor: '#d33'
        });
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  /* Fundo gradiente para um visual moderno */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-sizing: border-box;
}

.app-icon {
  margin-bottom: 2rem;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
</style>
