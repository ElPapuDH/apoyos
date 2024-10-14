<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Registro de Usuarios</h2>
      </div>
      <form @submit.prevent="registerUser" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="nombre" class="sr-only">Nombre</label>
            <input v-model="newUser.nombre" id="nombre" name="nombre" type="text" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Nombre">
            <p v-if="errors.nombre" class="text-red-500 text-xs italic">{{ errors.nombre }}</p>
          </div>
          <div>
            <label for="correo" class="sr-only">Correo</label>
            <input v-model="newUser.correo" id="correo" name="correo" type="email" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Correo">
            <p v-if="errors.correo" class="text-red-500 text-xs italic">{{ errors.correo }}</p>
          </div>
          <div>
            <label for="rol" class="sr-only">Rol</label>
            <select v-model="newUser.rol" id="rol" name="rol" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
              <option value="normal">Normal</option>
              <option value="admin">Administrador</option>
              <option value="gerente">Gerente</option>
            </select>
          </div>
          <div v-if="newUser.rol === 'normal'">
            <label for="id_usuario" class="sr-only">ID Usuario</label>
            <input v-model="newUser.id_usuario" id="id_usuario" name="id_usuario" type="number" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="ID Usuario">
            <p v-if="errors.id_usuario" class="text-red-500 text-xs italic">{{ errors.id_usuario }}</p>
          </div>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Registrar Usuario
          </button>
        </div>
      </form>
      <div v-if="registrationCode" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
        <p class="text-sm">Usuario registrado exitosamente. Código de acceso:</p>
        <p class="font-bold text-lg">{{ registrationCode }}</p>
      </div>
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <p class="text-sm">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const newUser = ref({
      nombre: '',
      correo: '',
      rol: 'normal',
      id_usuario: ''
    })
    const registrationCode = ref('')
    const errorMessage = ref('')
    const errors = ref({})

    // Function to generate a unique random code
    const generateRandomCode = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      for (let i = 0; i < 10; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return code;
    }

    const validateForm = () => {
      errors.value = {}
      let valid = true

      if (!newUser.value.nombre) {
        errors.value.nombre = 'El nombre es obligatorio.'
        valid = false
      }

      if (!newUser.value.correo) {
        errors.value.correo = 'El correo es obligatorio.'
        valid = false
      } else if (!/\S+@\S+\.\S+/.test(newUser.value.correo)) {
        errors.value.correo = 'El correo no es válido.'
        valid = false
      }

      if (newUser.value.rol === 'normal' && !newUser.value.id_usuario) {
        errors.value.id_usuario = 'El ID de usuario es obligatorio para usuarios normales.'
        valid = false
      }

      return valid
    }

    const registerUser = async () => {
      if (!validateForm()) {
        return
      }

      try {
        // Asignar un código de acceso único al usuario
        newUser.value.codigo_acceso = generateRandomCode();

        // Preparar los datos para el backend
        const userToRegister = {
          nombre: newUser.value.nombre,
          correo: newUser.value.correo,
          rol: newUser.value.rol,
          codigo_acceso: newUser.value.codigo_acceso
        }

        // Agregar id_usuario si el rol es 'normal'
        if (newUser.value.rol === 'normal') {
          userToRegister.id_usuario = newUser.value.id_usuario
        }

        const response = await fetch('http://localhost:3030/api/registro_usuarios', { // Cambia la URL aquí
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userToRegister)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error en la respuesta del servidor.');
        }

        const data = await response.json();
        registrationCode.value = data.codigo_acceso || newUser.value.codigo_acceso
        errorMessage.value = '' 
        newUser.value = { nombre: '', correo: '', rol: 'normal', id_usuario: '' }
      } catch (error) {
        errorMessage.value = 'Error al registrar usuario: ' + error.message
      }
    }

    return {
      newUser,
      registerUser,
      registrationCode,
      generateRandomCode,
      errorMessage,
      errors
    }
  }
}
</script>

<style scoped>
/* (Tus estilos aquí) */
.min-h-screen {
  min-height: 100vh;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.sm\:px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.lg\:px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.max-w-md {
  max-width: 28rem;
}

.w-full {
  width: 100%;
}

.space-y-8 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 2rem;
}

.bg-white {
  background-color: #ffffff;
}

.p-8 {
  padding: 2rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}

.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.font-extrabold {
  font-weight: 800;
}

.text-gray-900 {
  color: #111827;
}

.mt-8 {
  margin-top: 2rem;
}

.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.-space-y-px > :not([hidden]) ~ :not([hidden]) {
  border-top-width: 0;
}

.appearance-none {
  appearance: none;
}

.rounded-none {
  border-radius: 0;
}

.relative {
  position: relative;
}

.block {
  display: block;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.placeholder-gray-500 {
  color: #6b7280;
}

.text-gray-900 {
  color: #111827;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-indigo-500:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
}

.focus\:border-indigo-500:focus {
  border-color: #6366f1;
}

.focus\:z-10 {
  z-index: 10;
}

.sm\:text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.group {
  display: block;
}

.relative {
  position: relative;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.border {
  border-width: 1px;
}

.border-transparent {
  border-color: transparent;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.font-medium {
  font-weight: 500;
}

.rounded-md {
  border-radius: 0.375rem;
}

.text-white {
  color: #ffffff;
}

.bg-indigo-600 {
  background-color: #4f46e5;
}

.hover\:bg-indigo-700:hover {
  background-color: #4338ca;
}

.mt-4 {
  margin-top: 1rem;
}

.p-4 {
  padding: 1rem;
}

.bg-green-100 {
  background-color: #bbf7d0;
}

.border-green-400 {
  border-color: #bbf7d0;
}

.text-green-700 {
  color: #2f855a;
}

.rounded-md {
  border-radius: 0.375rem;
}

.text-xs {
  font-size: 0.75rem;
}

.italic {
  font-style: italic;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.border-red-400 {
  border-color: #fee2e2;
}

.text-red-700 {
  color: #c53030;
}

.font-bold {
  font-weight: 700;
}

.text-lg {
  font-size: 1.125rem;
}
</style>
