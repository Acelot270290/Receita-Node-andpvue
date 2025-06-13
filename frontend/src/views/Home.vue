<template>
  <div class="home-container">
    <h1>Bem-vindo à sua Página de Receitas!</h1>
    <p>Você está autenticado.</p>
    <button @click="logout" class="logout-btn">Sair</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // Remove o token para deslogar o usuário
      localStorage.removeItem('authToken');
      // Redireciona para a tela de login
      this.$router.push({ name: 'Auth' });
    }
  }
}
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 50px;
}
.logout-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.logout-btn:hover {
  background-color: #d32f2f;
}
</style>
