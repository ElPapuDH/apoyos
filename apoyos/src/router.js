import { createRouter, createWebHistory } from 'vue-router';
import MenuComponent from './components/MenuComponent.vue';
import RegistroForm from './components/RegistroForm.vue';
import VisualTab from './components/VisualTab.vue';
import GraficaComponent from './components/GraficaComponent.vue';

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: MenuComponent 
  },
  { 
    path: '/registro', 
    name: 'Registro',
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
