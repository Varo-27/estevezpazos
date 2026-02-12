<template>
  <!-- contenedor padre a 80% y centrado -->
  <div class="layout-root">
    <NavBar />
    <div id="app" class="container">
      <main class="app-main overflow-auto">
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
<!-- <script type="text/javascript">
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/69709eabcba9c0197c1235ff/1jffunk34';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
})();
</script> -->
<!--End of Tawk.to Script-->

<style scoped>
.container {
  /* Usar el comportamiento nativo de Bootstrap para contenedores pero mantener layout flex
     para que el main crezca y el footer quede pegado al fondo */
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}

.layout-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1 1 auto;
  min-height: 0;
}
</style>

<style>
/* Estilo global para todo el fondo */
body {
  background-color: #f8f9fa;
}
</style>