import { createApp } from 'vue';
import App from './App.vue'; // Asegúrate de que este archivo existe
import router from './router'; // Asegúrate de que el path es correcto

const app = createApp(App);
app.use(router); // Aquí estás utilizando el router
app.mount('#app');
