<template>
    <div class="registro-form">
      <h2>Registrar Apoyo</h2>
      <form @submit.prevent="submitForm">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div>
          <label for="registro">Registro:</label>
          <input type="number" id="registro" v-model="nuevoRegistro.Registro" required />
        </div>
        <div>
          <label for="fecha">Fecha:</label>
          <input type="date" id="fecha" v-model="nuevoRegistro.Fecha" required />
        </div>
        <div>
        <label for="id_usuario">ID de Usuario:</label>
        <input type="number" id="id_usuario" v-model="nuevoRegistro.id_usuario" required />
      </div>
        <div>
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="nuevoRegistro.Nombre" required />
        </div>
        <div>
          <label for="domicilio_calle">Domicilio Calle:</label>
          <input type="text" id="domicilio_calle" v-model="nuevoRegistro.Domicilio_Calle" required />
        </div>
        <div>
          <label for="colonia_comunidad">Colonia Comunidad:</label>
          <input type="text" id="colonia_comunidad" v-model="nuevoRegistro.Colonia_Comunidad" required />
        </div>
        <div>
          <label for="seccion">Sección:</label>
          <input type="number" id="seccion" v-model.number="nuevoRegistro.Seccion" required />
        </div>
        <div>
          <label for="contacto">Contacto:</label>
          <input type="text" id="contacto" v-model="nuevoRegistro.Contacto" required />
        </div>
        <div>
          <label for="tipo_apoyo">Tipo de Apoyo:</label>
          <input type="text" id="tipo_apoyo" v-model="nuevoRegistro.TipoDeApoyo" required />
        </div>
        <div>
          <label for="descripcion_apoyo">Descripción del Apoyo:</label>
          <textarea id="descripcion_apoyo" v-model="nuevoRegistro.Descripcion_Apoyo" required></textarea>
        </div>
        <div>
          <label for="monto_autorizado">Monto Autorizado:</label>
          <input type="number" id="monto_autorizado" v-model.number="nuevoRegistro.Monto_Autorizado" required step="0.01" />
        </div>
        <div>
          <label for="otro_tipo_de_ayuda">Otro Tipo de Ayuda:</label>
          <input type="text" id="otro_tipo_de_ayuda" v-model="nuevoRegistro.Otro_Tipo_De_Ayuda" />
        </div>
        <div>
          <label for="turnado_a">Turnado A:</label>
          <input type="text" id="turnado_a" v-model="nuevoRegistro.Turnado_A" />
        </div>
        <div>
          <label for="historial">Historial:</label>
          <textarea id="historial" v-model="nuevoRegistro.Historial" />
        </div>
        <div>
          <label for="nube">Nube:</label>
          <input type="url" id="nube" v-model="nuevoRegistro.Nube" />
        </div>
        <div>
          <label for="observaciones">Observaciones:</label>
          <textarea id="observaciones" v-model="nuevoRegistro.Observaciones" />
        </div>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando...' : 'Registrar' }}
        </button>
      </form>
    </div>
  </template>
 <script setup>
 import { ref } from 'vue';
 import axios from 'axios';
 import { normalizeText } from '../utils.js'; // Asegúrate de que esta ruta es correcta
 
 const nuevoRegistro = ref({
   Registro: null,
   Fecha: '',
   id_usuario: null,
   Nombre: '',
   Domicilio_Calle: '',
   Colonia_Comunidad: '',
   Seccion: null,
   Contacto: '',
   TipoDeApoyo: '',
   Descripcion_Apoyo: '',
   Monto_Autorizado: null,
   Otro_Tipo_De_Ayuda: '',
   Turnado_A: '',
   Historial: '',
   Nube: '',
   Observaciones: '', 
   Status: 'En proceso',
 });
 
 const isSubmitting = ref(false);
 const errorMessage = ref('');
 
 const submitForm = async () => {
   isSubmitting.value = true;
   errorMessage.value = '';
 
   try {
       // Normaliza los valores de Domicilio_Calle y Colonia_Comunidad
       nuevoRegistro.value.Domicilio_Calle = normalizeText(nuevoRegistro.value.Domicilio_Calle);
       nuevoRegistro.value.Colonia_Comunidad = normalizeText(nuevoRegistro.value.Colonia_Comunidad);
 
       // Verificar duplicados en una sola solicitud
       const response = await axios.get('http://localhost:3000/api/registros/validate', {
           params: {
               Domicilio_Calle: nuevoRegistro.value.Domicilio_Calle,
               Colonia_Comunidad: nuevoRegistro.value.Colonia_Comunidad,
               Registro: nuevoRegistro.value.Registro
           }
       });
 
       if (response.data.exists) {
           errorMessage.value = 'Ya existe un registro con el mismo domicilio, colonia, o número de registro.';
           isSubmitting.value = false;
           return;
       }
       
       // Si no hay duplicados, procede a crear el registro
       await axios.post('http://localhost:3000/api/registros', nuevoRegistro.value);
       alert('Registro creado exitosamente');
       resetForm();
   } catch (err) {
       console.error('Error al procesar el registro:', err);
       errorMessage.value = 'Hubo un error al verificar o guardar el registro. Por favor, intente nuevamente.';
   } finally {
       isSubmitting.value = false;
   }
 };
 
 // Función para reiniciar el formulario
 const resetForm = () => {
   nuevoRegistro.value = {
     Registro: null,
     Fecha: '',
     id_usuario: null,
     Nombre: '',
     Domicilio_Calle: '',
     Colonia_Comunidad: '',
     Seccion: null,
     Contacto: '',
     TipoDeApoyo: '',
     Descripcion_Apoyo: '',
     Monto_Autorizado: null,
     Otro_Tipo_De_Ayuda: '',
     Turnado_A: '',
     Historial: '',
     Nube: '',
     Observaciones: '', 
     Status: 'En proceso',
   };
   errorMessage.value = '';
 };
 </script>
 
  
  <style scoped>
  .registro-form {
    margin: 20px;
    font-family: Arial, sans-serif;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 500px;
    margin: 0 auto;
  }
  
  label {
    font-weight: bold;
  }
  
  input, textarea {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }
  
  button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: red;
    margin-bottom: 10px;
    font-weight: bold;
  }
  </style>
  