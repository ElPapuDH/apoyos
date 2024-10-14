<template>
  <div :class="['menu-container', { 'menu-open': isMenuOpen }]">
    <button @click="toggleMenu" class="menu-toggle-btn">
      <span v-if="!isMenuOpen">☰</span>
      <span v-else>&times;</span>
    </button>
    <nav class="menu" v-show="isMenuOpen">
      <div class="menu-header">
        <!-- <img src="/path-to-your-logo.png" alt="Logo" class="menu-logo"> -->
        <input type="text" placeholder="Buscar en el menú..." class="menu-search">
      </div>
      <router-link to="/" class="menu-item">
        <span class="menu-icon">🏠</span>
        Inicio
      </router-link>
      <router-link to="/registrof" class="menu-item">
        <span class="menu-icon">📝</span>
        Registro Apoyos
      </router-link>
      <router-link to="/visual" class="menu-item">
        <span class="menu-icon">👁️</span>
        Visual
      </router-link>
      <router-link to="/grafica" class="menu-item">
        <span class="menu-icon">📊</span>
        Gráfica
      </router-link>
      <router-link to="/registro" class="menu-item">
        <span class="menu-icon">👤</span>
        Registro de Usuarios
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

const isMenuOpen = ref(false); // Cambiado a false para que el menú esté cerrado por defecto

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
  position: relative; /* Añadido para el botón */
}

.menu-container:not(.menu-open) {
  width: 60px; /* Tamaño del contenedor cuando está cerrado */
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
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #495057;
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
