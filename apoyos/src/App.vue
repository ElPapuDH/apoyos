<template>
  <div class="app-container">
    <MenuComponent v-if="isLoggedIn" />
    <div class="main-content">
      <router-view @login-success="handleLoginSuccess"></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MenuComponent from './components/MenuComponent.vue';

const isLoggedIn = ref(false);
const router = useRouter();

const checkLoginStatus = () => {
  const user = localStorage.getItem('user');
  isLoggedIn.value = !!user;
};

const handleLoginSuccess = () => {
  isLoggedIn.value = true;
  router.push('/home');
};

watch(isLoggedIn, (newValue) => {
  if (!newValue) {
    router.push('/');
  }
});

onMounted(() => {
  checkLoginStatus();
  if (isLoggedIn.value) {
    router.push('/home');
  } else {
    router.push('/');
  }
});
</script>

<style>
.app-container {
  display: flex;
  font-family: Arial, sans-serif;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>