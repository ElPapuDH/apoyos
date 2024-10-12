<template>
    <div class="visual-tab">
      <h2>Registros de Apoyos</h2>
      <div v-if="loading" class="loading">Cargando registros...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="filters">
          <input
            v-model="searchTerm"
            placeholder="Buscar por nombre o tipo de apoyo"
            @input="filterRegistros"
            class="search-input"
          />
          <select v-model="selectedSeccion" @change="filterRegistros" class="sort-select">
            <option value="">Filtrar por Sección</option>
            <option v-for="seccion in secciones" :key="seccion" :value="seccion">{{ seccion }}</option>
          </select>
          <select v-model="sortBy" @change="sortRegistros" class="sort-select">
            <option value="Registro">Ordenar por Registro</option>
            <option value="Fecha">Ordenar por Fecha</option>
            <option value="Nombre">Ordenar por Nombre</option>
            <option value="Tipo_Apoyo">Ordenar por Tipo de Apoyo</option>
            <option value="Monto_Autorizado">Ordenar por Monto Autorizado</option>
          </select>
        </div>
  
        <!-- Formulario de Edición -->
        <div v-if="isEditing" class="edit-form">
          <h3>Editar Registro</h3>
          <input v-model="editRegistro.Nombre" placeholder="Nombre" />
          <input v-model="editRegistro.Domicilio_Calle" placeholder="Domicilio" />
          <input v-model="editRegistro.Colonia_Comunidad" placeholder="Colonia/Comunidad" />
          <input v-model.number="editRegistro.Seccion" placeholder="Sección" type="number" />
          <input v-model="editRegistro.Contacto" placeholder="Contacto" />
          <input v-model="editRegistro.TipoDeApoyo" placeholder="Tipo de Apoyo" />
          <input v-model="editRegistro.Descripcion_Apoyo" placeholder="Descripción del Apoyo" />
          <input v-model.number="editRegistro.Monto_Autorizado" placeholder="Monto Autorizado" type="number" />
          <input v-model="editRegistro.Otro_Tipo_De_Ayuda" placeholder="Otro Tipo de Ayuda" />
          
          <select v-model="editRegistro.Status" class="status-select">
            <option value="Autorizado">Autorizado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
  
          <button @click="actualizarRegistro" class="edit-btn">Guardar Cambios</button>
          <button @click="cancelarEdicion" class="cancel-btn">Cancelar</button>
        </div>
  
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Registro</th>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Domicilio</th>
                <th>Colonia/Comunidad</th>
                <th>Sección</th>
                <th>Contacto</th>
                <th>Tipo de Apoyo</th>
                <th>Descripción del Apoyo</th>
                <th>Status</th>
                <th>Monto Autorizado</th>
                <th>Otro Tipo de Ayuda</th>
                <th>Turnado A</th>
                <th>Historial</th>
                <th>Nube</th>
                <th>Creación de Registro</th>
                <th>Actualización de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="registro in filteredRegistros" :key="registro.Registro">
                <td>{{ registro.Registro }}</td>
                <td>{{ formatDate(registro.Fecha) }}</td>
                <td>{{ registro.Nombre }}</td>
                <td>{{ registro.Domicilio_Calle }}</td>
                <td>{{ registro.Colonia_Comunidad }}</td>
                <td>{{ registro.Seccion }}</td>
                <td>{{ registro.Contacto }}</td>
                <td>{{ registro.TipoDeApoyo }}</td>
                <td>{{ registro.Descripcion_Apoyo }}</td>
                <td>{{ registro.Status }}</td>
                <td>{{ formatCurrency(registro.Monto_Autorizado) }}</td>
                <td>{{ registro.Otro_Tipo_De_Ayuda }}</td>
                <td>{{ registro.Turnado_A }}</td>
                <td>{{ registro.Historial }}</td>
                <td>
                  <a v-if="registro.Nube" :href="registro.Nube" target="_blank">Ver documento</a>
                  <span v-else>No disponible</span>
                </td>
                <td>{{ formatDate(registro.creacion_de_registro) }}</td>
                <td>{{ formatDate(registro.actualizacion_de_registro) }}</td>
                <td>
                  <button @click="iniciarEdicion(registro)" class="edit-btn">Editar</button>
                  <button @click="confirmarEliminacion(registro.Registro)" class="delete-btn">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Total por mes y sección -->
        <div class="totales">
          <h3>Total Gastado por Mes y Sección</h3>
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Sección</th>
                <th>Total Gastado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(total, index) in totalPorMesYSeccion" :key="index">
                <td>{{ total.mes }}</td>
                <td>{{ total.seccion }}</td>
                <td>{{ formatCurrency(total.monto) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
      </div>
    </div>
  </template>
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  
  // Estado del componente
  const registros = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const searchTerm = ref('');
  const selectedSeccion = ref(''); // Nuevo estado para el filtro de sección
  const sortBy = ref('Registro');
  const isEditing = ref(false);
  const editRegistro = ref({}); // Registro en edición
  const secciones = ref([]); // Estado para almacenar secciones únicas
  
  // Funciones de formato
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('es-MX', options);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };
  
  // Fetch de registros
  const fetchRegistros = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/registros');
      registros.value = response.data;
      loading.value = false;
  
      // Obtener secciones únicas
      secciones.value = [...new Set(response.data.map(registro => registro.Seccion))];
    } catch (err) {
      error.value = 'Error al cargar los registros. Por favor, intente nuevamente.';
      loading.value = false;
      console.error('Error fetching registros:', err);
    }
  };
  
  onMounted(fetchRegistros);
  
  // Filtrado de registros
  const filteredRegistros = computed(() => {
    let filtered = registros.value;
  
    if (searchTerm.value) {
      const searchLower = searchTerm.value.toLowerCase();
      filtered = filtered.filter(registro => 
        registro.Nombre.toLowerCase().includes(searchLower) ||
        registro.TipoDeApoyo.toLowerCase().includes(searchLower)
      );
    }
  
    if (selectedSeccion.value) {
      filtered = filtered.filter(registro => registro.Seccion === selectedSeccion.value);
    }
  
    return filtered.sort((a, b) => {
      if (sortBy.value === 'Monto_Autorizado') {
        return a[sortBy.value] - b[sortBy.value];
      }
      if (sortBy.value === 'Registro') {
        return Number(a.Registro) - Number(b.Registro);
      }
      if (a[sortBy.value] < b[sortBy.value]) return -1;
      if (a[sortBy.value] > b[sortBy.value]) return 1;
      return 0;
    });
  });
  
  // Calcular total por mes y sección
  const totalPorMesYSeccion = computed(() => {
    const totals = {};
    filteredRegistros.value.forEach(registro => {
      const month = formatDate(registro.Fecha).split('/')[1]; // Obtener mes
      const section = registro.Seccion;
      const amount = Number(registro.Monto_Autorizado) || 0; // Convertir a número y manejar valores nulos
  
      const key = `${month}-${section}`;
  
      if (!totals[key]) {
        totals[key] = { mes: month, seccion: section, monto: 0 };
      }
  
      totals[key].monto += amount; // Sumar al total
    });
  
    return Object.values(totals);
  });
  
  // Iniciar la edición de un registro
  const iniciarEdicion = (registro) => {
    isEditing.value = true;
    editRegistro.value = { ...registro }; // Clonar el registro para edición
  };
  
  // Cancelar la edición
  const cancelarEdicion = () => {
    isEditing.value = false;
    editRegistro.value = {};
  };
  
  // Actualizar el registro en la base de datos
  const actualizarRegistro = async () => {
    try {
      await axios.put(`http://localhost:3000/api/registros/${editRegistro.value.Registro}`, editRegistro.value);
      const index = registros.value.findIndex(registro => registro.Registro === editRegistro.value.Registro);
      registros.value[index] = { ...editRegistro.value }; // Actualizar el registro en la lista
      cancelarEdicion(); // Resetear el formulario
    } catch (err) {
      console.error('Error al actualizar el registro:', err);
      alert('Hubo un error al actualizar el registro. Por favor, intente nuevamente.');
    }
  };
  
  // Confirmar eliminación de un registro
  const confirmarEliminacion = (registroId) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el registro ${registroId}?`)) {
      eliminarRegistro(registroId);
    }
  };
  
  // Eliminar registro de la base de datos
  const eliminarRegistro = async (registroId) => {
    try {
      await axios.delete(`http://localhost:3000/api/registros/${registroId}`);
      registros.value = registros.value.filter(registro => registro.Registro !== registroId);
    } catch (err) {
      console.error('Error al eliminar el registro:', err);
      alert('Hubo un error al eliminar el registro. Por favor, intente nuevamente.');
    }
  };
  </script>
  
  
  <style scoped>
  .visual-tab {
    margin: 20px;
    font-family: Arial, sans-serif;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .loading {
    text-align: center;
    font-size: 18px;
  }
  
  .error {
    color: red;
    text-align: center;
  }
  
  .filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 40%;
    padding: 5px;
    font-size: 16px;
  }
  
  .sort-select {
    padding: 5px;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  .edit-btn, .delete-btn {
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .edit-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .delete-btn {
    background-color: #f44336;
    color: white;
  }
  
  .edit-form {
    margin-bottom: 20px;
  }
  
  .edit-form input {
    display: block;
    margin: 5px 0;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .cancel-btn {
    background-color: #ccc;
    color: black;
  }
  
  .status-select {
    padding: 5px;
    margin: 5px 0;
  }
  
  .totales {
    margin-top: 20px;
  }
  </style>
  