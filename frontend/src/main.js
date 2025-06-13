import { createApp } from 'vue';
import App from './App.vue';
// 1. Importa o router que configuramos
import router from './router'; 

// 2. Cria a aplicação Vue
const app = createApp(App);

// 3. (A LINHA MAIS IMPORTANTE) - Instala o router na aplicação
// É isso que faz o <router-view> funcionar.
app.use(router);

// 4. Monta a aplicação na página
app.mount('#app');
