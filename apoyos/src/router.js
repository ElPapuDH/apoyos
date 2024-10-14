import { createRouter, createWebHistory } from 'vue-router';
import RegistroForm from './components/RegistroForm.vue';
import VisualTab from './components/VisualTab.vue';
import GraficaComponent from './components/GraficaComponent.vue';
import AdminRegister from './components/AdminRegister.vue';
import LoginComponent from './components/LoginComponent.vue';
import Home from './components/Home.vue';

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: Home 
  },
  { 
    path: '/registrof', 
    name: 'RegistroF',
    component: RegistroForm 
  },
  { 
    path: '/visual',
    name: 'Visualizacion',
    component: VisualTab 
  },
  { 
    path: '/grafica', 
    name: 'Graficas',
    component: GraficaComponent 
  },
  { 
    path: '/registro', 
    name: 'Registro',
    component: AdminRegister 
  },
  { 
    path: '/login', 
    name: 'Login',
    component: LoginComponent 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;