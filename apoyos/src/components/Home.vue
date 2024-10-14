<template>
    <div class="home-container">
      <div class="welcome-content">
        <h1 class="welcome-title">Bienvenidos</h1>
        <p class="welcome-message">Gracias por visitar nuestra plataforma. Estamos aquí para ayudarte.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeComponent'
  }
  </script>
  
  <style scoped>
  .home-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .welcome-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background-color: #f0f4f8;
  }
  
  .welcome-title {
    font-size: 3rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  .welcome-message {
    font-size: 1.2rem;
    color: #34495e;
    text-align: center;
    max-width: 600px;
  }
  </style>