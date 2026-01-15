<template>
  <nav class="navbar navbar-dark bg-primary sticky-top navbar-expand-lg" ref="navbarRef">
    <div class="container-fluid">
      <!-- Marca o logo -->
      <a class="navbar-brand" href="#">EmpresaTeis</a>

      <!-- Contenedor para hamburguesa y dropdown (siempre a la derecha) -->
      <div class="d-flex align-items-center order-lg-2">
        <!-- Dropdown de acceso/registro -->
        <div class="dropdown" ref="dropdownRef">
          <button class="btn btn-primary dropdown-toggle" type="button" @click="toggleDropdown">
            <i class="bi bi-person fs-2"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" :class="{ show: dropdownAbierto }">
            <li v-if="!isLogueado">
              <router-link class="dropdown-item" to="/login" @click="cerrarTodo">Acceso</router-link>
            </li>
            <li v-if="!isLogueado">
              <router-link class="dropdown-item" to="/clientes" @click="cerrarTodo">Registro</router-link>
            </li>
            <li v-if="isLogueado">
              <span class="dropdown-item">Hola {{ userName }}</span>
            </li>
            <li v-if="isLogueado">
              <a class="dropdown-item" href="#" @click.prevent="cerrarSesion">Cerrar Sesión</a>
            </li>
          </ul>
        </div>

        <!-- Botón de hamburguesa (solo visible en móvil) -->
        <button class="navbar-toggler ms-2" type="button" @click="toggleMenu" aria-controls="navbarNav"
          :aria-expanded="menuAbierto" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- Links de navegación con animación -->
      <div class="navbar-collapse order-lg-1" :class="{ 'menu-abierto': menuAbierto, 'menu-cerrado': !menuAbierto }"
        id="navbarNav" ref="navbarCollapse">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="cerrarMenu">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/clientes" @click="cerrarMenu">Clientes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/noticias" @click="cerrarMenu">Noticias</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ventas" @click="cerrarMenu">Ventas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/modelos" @click="cerrarMenu">Modelos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/taller" @click="cerrarMenu">Citas Taller</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contacto" @click="cerrarMenu">Contacto</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth.js'

const { isLogueado, userName, initAuth, logout } = useAuth()

const navbarRef = ref(null)
const navbarCollapse = ref(null)
const dropdownRef = ref(null)
const dropdownAbierto = ref(false)
const menuAbierto = ref(false)

onMounted(() => {
  initAuth()
  document.addEventListener('click', cerrarAlClickFuera)
})

onUnmounted(() => {
  document.removeEventListener('click', cerrarAlClickFuera)
})

const toggleDropdown = (event) => {
  event.stopPropagation()
  dropdownAbierto.value = !dropdownAbierto.value
}

const toggleMenu = (event) => {
  event.stopPropagation()
  menuAbierto.value = !menuAbierto.value
}

const cerrarAlClickFuera = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownAbierto.value = false
  }
  if (navbarRef.value && !navbarRef.value.contains(event.target)) {
    menuAbierto.value = false
  }
}

const cerrarMenu = () => {
  menuAbierto.value = false
}

const cerrarTodo = () => {
  menuAbierto.value = false
  dropdownAbierto.value = false
}

const cerrarSesion = async () => {
  cerrarTodo()
  logout()
  setTimeout(() => {
    window.location.href = '/'
  }, 1500)
}
</script>

<style>
.navbar-dark .nav-link {
  color: rgba(255, 255, 255, 0.9);
}

.navbar-dark .nav-link:hover,
.navbar-dark .nav-link:focus {
  color: #fff;
}

.dropdown-menu.show {
  display: block;
}

/* Animación del menú hamburguesa */
.navbar-collapse {
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.menu-cerrado {
  max-height: 0;
}

.menu-abierto {
  max-height: 500px;
}

/* En pantallas grandes, siempre visible */
@media (min-width: 992px) {
  .navbar-collapse {
    display: flex !important;
    max-height: none !important;
    overflow: visible;
  }
}
</style>
