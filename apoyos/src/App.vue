<template>
  <div class="app-container">
    <MenuComponent />
    <router-view></router-view>
  </div>
</template>

<script setup>
import MenuComponent from './components/MenuComponent.vue';
</script>

<style scoped>
.app-container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>