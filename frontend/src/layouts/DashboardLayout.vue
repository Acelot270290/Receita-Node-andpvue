<template>
  <div class="dashboard">
    <!-- Menu Lateral -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logo-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
        <h3>RecipeApp</h3>
      </div>
      <nav class="nav-menu">
        <router-link to="/" class="nav-link">
          <i class="icon-home"></i>
          <span>Início</span>
        </router-link>
        <router-link to="/recipes" class="nav-link">
          <i class="icon-recipes"></i>
          <span>Minhas Receitas</span>
        </router-link>
        <router-link to="/profile" class="nav-link">
          <i class="icon-user"></i>
          <span>Meu Perfil</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn">
          <i class="icon-logout"></i>
          <span>Sair</span>
        </button>
      </div>
    </aside>

    <!-- Conteúdo Principal -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('authToken');
      this.$router.push({ name: 'Auth' });
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.dashboard {
  display: flex;
  height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* --- Sidebar --- */
.sidebar {
  width: 260px;
  background: #1e293b;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  transition: width 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 0 0.5rem 1.5rem 0.5rem;
  border-bottom: 1px solid #334155;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  margin-right: 1rem;
  color: #94a3b8;
}

h3 {
  margin: 0;
  font-weight: 600;
  font-size: 1.25rem;
}

.nav-menu {
  flex-grow: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.85rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: #cbd5e1;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover {
  background-color: #334155;
  color: #fff;
}

/* Estilo para a rota ativa */
.router-link-exact-active {
  background-color: #4f46e5;
  color: #fff;
  font-weight: 500;
}

.nav-link i {
  margin-right: 1rem;
  font-style: normal;
  /* Ícones SVG inline para simplicidade */
}

/* Ícones */
.icon-home::before { content: '🏠'; }
.icon-recipes::before { content: '🍲'; }
.icon-user::before { content: '👤'; }
.icon-logout::before { content: '🚪';}

/* --- Logout Button --- */
.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid #334155;
}

.logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.85rem 1rem;
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;
}

.logout-btn:hover {
  background-color: #ef4444;
  color: #fff;
}

/* --- Main Content --- */
.main-content {
  flex-grow: 1;
  background-color: #f1f5f9;
  padding: 2rem;
  overflow-y: auto;
}
</style>
