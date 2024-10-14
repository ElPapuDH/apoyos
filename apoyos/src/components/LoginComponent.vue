<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div>
        <h2 class="text-3xl font-extrabold text-center text-gray-900">Iniciar Sesión</h2>
      </div>
      <form @submit.prevent="login" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="nombre" class="sr-only">Nombre</label>
            <input
              v-model="loginData.nombre"
              id="nombre"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nombre"
            />
          </div>
          <div>
            <label for="codigoAcceso" class="sr-only">Código de Acceso</label>
            <input
              v-model="loginData.codigoAcceso"
              id="codigoAcceso"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Código de Acceso"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Iniciar Sesión
          </button>
        </div>
      </form>
      <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <p class="text-sm">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const loginData = ref({
      nombre: '',
      codigoAcceso: ''
    })
    const error = ref('')
    const router = useRouter()

    const login = async () => {
    try {
        error.value = ''; // Limpiar errores previos
        const response = await fetch('http://localhost:3030/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData.value) // Envia { nombre, codigoAcceso }
        });
        const data = await response.json();
        if (data.success) {
            alert('Sesión iniciada'); // Mostrar alerta de sesión iniciada
            // Almacenar información del usuario en el almacenamiento local o en el estado de la aplicación
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redirigir al usuario a su página correspondiente según su rol
            if (data.user.rol === 'admin') {
                router.push('/admin-dashboard');
            } else if (data.user.rol === 'gerente') {
                router.push('/gerente-dashboard');
            } else {
                router.push('/user-dashboard');
            }
        } else {
            error.value = 'Nombre o código de acceso inválido';
        }
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        error.value = 'Ocurrió un error al intentar iniciar sesión. Por favor, intente de nuevo.';
    }
}


    return {
      loginData,
      login,
      error
    }
  }
}
</script>
<style scoped>
/* Estilo del contenedor principal */
.min-h-screen {
  min-height: 100vh;
}

.bg-gray-100 {
  background-color: #f7fafc;
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

/* Estilo del formulario */
.max-w-md {
  max-width: 28rem;
}

.w-full {
  width: 100%;
}

.space-y-8 > * + * {
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
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Estilo del título */
.text-3xl {
  font-size: 1.875rem;
}

.font-extrabold {
  font-weight: 800;
}

.text-center {
  text-align: center;
}

.text-gray-900 {
  color: #1a202c;
}

/* Estilo de los campos de entrada */
.appearance-none {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
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
  border-color: #d2d6dc;
}

.placeholder-gray-500::placeholder {
  color: #a0aec0;
}

.text-gray-900 {
  color: #1a202c;
}

.rounded-md {
  border-radius: 0.375rem;
}

.focus\:outline-none:focus {
  outline: none;
}

.focus\:ring-indigo-500:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}

.focus\:border-indigo-500:focus {
  border-color: #6366f1;
}

.sm\:text-sm {
  font-size: 0.875rem;
}

/* Estilo del botón */
.group {
  display: inline-flex;
}

.text-white {
  color: #ffffff;
}

.bg-indigo-600 {
  background-color: #4CAF50;
}

.hover\:bg-indigo-700:hover {
  background-color: #45a049;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
}

.focus\:ring-offset-2:focus {
  border-width: 2px;
  border-color: transparent;
}

.focus\:outline-none:focus {
  outline: none;
}

/* Estilo de mensajes de error */
.mt-4 {
  margin-top: 1rem;
}

.p-4 {
  padding: 1rem;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.border-red-400 {
  border-color: #f87171;
}

.text-red-700 {
  color: #b91c1c;
}

.rounded-md {
  border-radius: 0.375rem;
}
</style>
