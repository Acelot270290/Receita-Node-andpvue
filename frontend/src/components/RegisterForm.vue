<template>
  <div class="form-container">
    <h2>Criar Conta</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Nome:</label>
        <input v-model="nome" type="text" required placeholder="Seu nome completo">
      </div>
      <div class="form-group">
        <label>Login:</label>
        <input v-model="login" type="text" required placeholder="seu_usuario">
      </div>
      <div class="form-group">
        <label>Senha:</label>
        <input v-model="senha" type="password" required placeholder="••••••••">
      </div>
      <button type="submit" class="submit-btn">Registrar</button>
      <p class="toggle-text">
        Já tem uma conta? 
        <span @click="toggleForm" class="toggle-link">Faça login</span>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nome: '',
      login: '',
      senha: ''
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('register', {
        nome: this.nome,
        login: this.login,
        senha: this.senha
      });
    },
    toggleForm() {
      this.$emit('toggle');
    }
  }
}
</script>

<style scoped>
/* Estilização completa para o formulário de registro */
.form-container {
  max-width: 400px;
  width: 100%;
  padding: 2.5rem;
  border-radius: 12px;
  background: #ffffff;
  /* Sombra mais pronunciada e profissional */
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: left;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box; /* Garante que o padding não aumente a largura */
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
}

.submit-btn {
  width: 100%;
  padding: 0.85rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.toggle-text {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
}

.toggle-link {
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
}

.toggle-link:hover {
  text-decoration: underline;
}
</style>
