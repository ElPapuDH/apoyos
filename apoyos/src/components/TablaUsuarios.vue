<template>
    <div>
      <h2>Usuarios Registrados</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Codigo de acceso</th>
            <th>Creado en</th>
            <th>Actualizado en</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.correo }}</td>
            <td>{{ usuario.rol }}</td>
            <td>{{ usuario.codigo_acceso }}</td>
            <td>{{ usuario.creado_en }}</td>
            <td>{{ usuario.actualizado_en }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'TablaUsuarios',
    data() {
      return {
        usuarios: []
      };
    },
    mounted() {
      this.obtenerUsuarios();
    },
    methods: {
        async obtenerUsuarios() {
  try {
    const response = await axios.get('http://localhost:3030/api/registro_usuarios');
    console.log('Datos recibidos:', response.data); // Verifica que los datos están llegando
    this.usuarios = response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  }

      }
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
  }
  </style>
  