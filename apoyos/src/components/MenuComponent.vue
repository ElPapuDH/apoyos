<template>
  <div :class="['menu-container', { 'menu-open': isMenuOpen }]">
    <button v-if="!isMenuOpen" @click="toggleMenu" class="menu-toggle-btn">
      <span>☰</span>
    </button>
    <nav class="menu" v-show="isMenuOpen">
      <div class="menu-header">
      </div>
      <router-link to="/home" class="menu-item">
        <span class="menu-icon">🏠</span>
        Inicio
      </router-link>
      <router-link to="/registrof" class="menu-item">
        <span class="menu-icon">📝</span>
        Registro Apoyos
      </router-link>
      <router-link to="/visual" class="menu-item">
        <span class="menu-icon">👁️</span>
        Visual de Registros de apoyos
      </router-link>
      <router-link to="/grafica" class="menu-item">
        <span class="menu-icon">📊</span>
        Gráfica
      </router-link>
      <router-link to="/registro" class="menu-item">
        <span class="menu-icon">👤</span>
        Registro de Usuarios
      </router-link>
      <router-link to="/tablaUs" class="menu-item">
        <span class="menu-icon">👁️</span>
        Visualicacion de los usuarios
      </router-link>
      <router-link to="/login" class="menu-item">
        <span class="menu-icon">🔐</span>
        Login
      </router-link>
      <button @click="toggleMenu" class="menu-item hide-menu-btn">
        <span class="menu-icon">◀️</span>
        Ocultar menú
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false); 

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
.menu-container {
  width: 250px;
  height: 100vh;
  background-color: #f8f9fa;
  transition: width 0.3s ease;
  overflow-y: auto;
  position: relative;
}

.menu-container:not(.menu-open) {
  width: 60px;
}

.menu {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.menu-header {
  padding: 0 20px 20px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.menu-logo {
  width: 100%;
  max-width: 150px;
  margin-bottom: 15px;
}

.menu-search {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  text-decoration: none;
  color: #495057;
  transition: background-color 0.2s;
}

.menu-item:hover,
.menu-item.router-link-active {
  background-color: #e9ecef;
  color: #6f42c1;
}

.menu-icon {
  margin-right: 10px;
  font-size: 1.2em;
  width: 24px;
  text-align: center;
}

.menu-toggle-btn {
  position: fixed;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #495057;
  z-index: 1000;
}

.hide-menu-btn {
  margin-top: auto;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.menu-container:not(.menu-open) .menu-item span:not(.menu-icon),
.menu-container:not(.menu-open) .menu-header,
.menu-container:not(.menu-open) .hide-menu-btn {
  display: none;
}

.menu-container:not(.menu-open) .menu-item {
  padding: 10px;
  justify-content: center;
}

.menu-container:not(.menu-open) .menu-icon {
  margin-right: 0;
}
</style>