<template>
    <div>
      <h2>Usuarios Registrados</h2>
  
      <!-- Filtro por Rol -->
      <div>
        <label for="rolFilter">Filtrar por Rol:</label>
        <select id="rolFilter" v-model="rolFiltro">
          <option value="">Todos</option>
          <option value="normal">normal</option>
          <option value="admin">Admin</option>
          <option value="gerente">Gerente</option>
        </select>
      </div>
  
      <!-- Buscador por Nombre -->
      <div>
        <label for="nombreSearch">Buscar por Nombre:</label>
        <input
          type="text"
          id="nombreSearch"
          v-model="nombreBusqueda"
          placeholder="Escribe el nombre del usuario"
        />
      </div>
  
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.correo }}</td>
            <td>{{ usuario.rol }}</td>
            <td>{{ usuario.codigo_acceso }}</td>
            <td>{{ usuario.creado_en }}</td>
            <td>{{ usuario.actualizado_en }}</td>
            <td>
              <button @click="abrirModalEdicion(usuario)">Editar</button>
              <button @click="eliminarUsuario(usuario.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal de Edición de Usuario -->
      <div v-if="usuarioEditable" class="modal">
        <div class="modal-content">
          <h3>Editar Usuario</h3>
          <label>Nombre:</label>
          <input v-model="usuarioEditable.nombre" />
          
          <label>Correo:</label>
          <input v-model="usuarioEditable.correo" />
          
          <label>Rol:</label>
          <select v-model="usuarioEditable.rol">
            <option value="normal">normal</option>
            <option value="admin">Admin</option>
            <option value="gerente">Gerente</option>
          </select>
          
          <label>Código de Acceso:</label>
          <input v-model="usuarioEditable.codigo_acceso" />
          
          <button @click="guardarEdicionUsuario">Guardar</button>
          <button @click="cerrarModalEdicion">Cancelar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'TablaUsuarios',
    data() {
      return {
        usuarios: [],
        rolFiltro: '',        
        nombreBusqueda: '',
        usuarioEditable: null // Usuario actualmente en edición
      };
    },
    computed: {
      usuariosFiltrados() {
        return this.usuarios.filter(usuario => {
          const coincideRol = this.rolFiltro ? usuario.rol === this.rolFiltro : true;
          const coincideNombre = usuario.nombre.toLowerCase().includes(this.nombreBusqueda.toLowerCase());
          return coincideRol && coincideNombre;
        });
      }
    },
    mounted() {
      this.obtenerUsuarios();
    },
    methods: {
      async obtenerUsuarios() {
        try {
          const response = await axios.get('http://localhost:3030/api/registro_usuarios');
          console.log('Datos recibidos:', response.data);
          this.usuarios = response.data;
        } catch (error) {
          console.error('Error al obtener usuarios:', error);
        }
      },
      async eliminarUsuario(id) {
        try {
          await axios.delete(`http://localhost:3030/api/registro_usuarios/${id}`);
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
          alert('Usuario eliminado exitosamente.');
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          alert('Hubo un problema al eliminar el usuario.');
        }
      },
      abrirModalEdicion(usuario) {
        this.usuarioEditable = { ...usuario };
      },
      cerrarModalEdicion() {
        this.usuarioEditable = null;
      },
      async guardarEdicionUsuario() {
        try {
          const { id, nombre, correo, rol, codigo_acceso } = this.usuarioEditable;
          await axios.put(`http://localhost:3030/api/registro_usuarios/${id}`, {
            nombre,
            correo,
            rol,
            codigo_acceso
          });
          this.obtenerUsuarios(); // Actualiza la lista de usuarios
          this.cerrarModalEdicion();
          alert('Usuario actualizado correctamente.');
        } catch (error) {
          console.error('Error al actualizar usuario:', error);
          alert('Hubo un problema al actualizar el usuario.');
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
  
  label, select, input {
    margin: 10px;
  }
  
  button {
    margin-right: 5px;
    padding: 5px 10px;
    border: none;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
  }
  
  button:last-child {
    background-color: #f44336;
  }
  
  /* Estilos para el modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  }
  </style>
  