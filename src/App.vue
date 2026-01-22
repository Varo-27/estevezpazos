<template>
  <!-- contenedor padre a 80% y centrado -->
  <div>
    <NavBar />
    <div id="app" class="app-container">
      <main class="flex-grow-1 overflow-auto">
        <router-view />
      </main>
    </div>
    <FooTer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from '@/components/common/NavBar.vue'
import FooTer from '@/components/common/FooTer.vue'
import { useAuth } from '@/composables/useAuth.js'

// Inicializar autenticación al cargar la app
const { initAuth } = useAuth()

onMounted(() => {
  initAuth()
})
</script>
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/69709eabcba9c0197c1235ff/1jffunk34';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
})();
</script>
<!--End of Tawk.to Script-->

<style scoped>
.app-container {
  max-width: 80%;
  margin: 0 auto;
  /* centra horizontalmente */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<style>
/* Estilo global para todo el fondo */
body {
  background-color: #f8f9fa;
}
</style>