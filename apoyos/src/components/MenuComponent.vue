<template>
    <nav class="menu">
      <router-link to="/registro" class="menu-item">Registro</router-link>
      <router-link to="/visual" class="menu-item">Visual</router-link>
      <router-link to="/grafica" class="menu-item">grafica</router-link>
    </nav>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .menu {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
  }
  .menu-item {
    margin: 0 10px;
    text-decoration: none;
    color: #42b983;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 3px;
    transition: background-color 0.3s;
  }
  .menu-item:hover,
  .menu-item.router-link-active {
    background-color: #42b983;
    color: white;
  }
  </style>
  