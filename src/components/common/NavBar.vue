<template>
  <nav class="navbar navbar-dark bg-primary navbar-expand-lg" ref="navbarRef">
    <div class="container-fluid d-flex align-items-center position-relative">

      <div class="d-flex align-items-center flex-shrink-0">
        <a class="navbar-brand me-2" href="#">CarTeis</a>
        <button class="navbar-toggler d-lg-none" type="button" @click="toggleMenu" aria-controls="navbarNav"
          :aria-expanded="menuAbierto" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <div class="navbar-collapse flex-grow-1 ps-5 pe-3 ps-lg-0 pe-lg-0"
        :class="{ 'menu-abierto': menuAbierto, 'menu-cerrado': !menuAbierto }" id="navbarNav" ref="navbarCollapse">
        <ul class="navbar-nav mx-lg-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="cerrarMenu">
              <span class="nav-underline">Inicio</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/clientes" @click="cerrarMenu">
              <span class="nav-underline">Clientes</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/noticias" @click="cerrarMenu">
              <span class="nav-underline">Noticias</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ventas" @click="cerrarMenu">
              <span class="nav-underline">Ventas</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/modelos" @click="cerrarMenu">
              <span class="nav-underline">Modelos</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/taller" @click="cerrarMenu">
              <span class="nav-underline">Taller</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contacto" @click="cerrarMenu">
              <span class="nav-underline">Contacto</span>
            </router-link>
          </li>
          <form class="d-flex pb-3 ps-0 pb-lg-0 form-control-sm" role="search">
            <input class="form-control me-2" type="search" placeholder="Buscar..." aria-label="Buscar"
              v-model="query" />
            <button class="btn btn-light" type="submit"><i class="bi bi-search"></i></button>
          </form>
        </ul>
      </div>

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
    Talle
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

/* En pantallas grandes, siempre visible y centrado */
@media (min-width: 992px) {
  .navbar-collapse {
    display: flex !important;
    max-height: none !important;
    overflow: visible;
    justify-content: center;
  }

  .dropdown.ms-lg-auto {
    margin-left: auto !important;
  }
}

/* En pantallas pequeñas, evitar que el colapso ocupe ancho y empuje el icono */
@media (max-width: 991.98px) {
  .container-fluid {
    position: relative;
    flex-wrap: nowrap;
    align-items: center;
  }

  /* Hacer que el collapse sea overlay (no ocupa ancho en la fila) */
  .navbar-collapse {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    width: 100%;
    flex: 0 0 auto !important;
    max-height: 0;
    overflow: hidden;
    background-color: var(--bs-primary, #0d6efd);
    transition: max-height 0.35s ease;
    z-index: 1040;
  }

  .navbar-collapse.menu-abierto {
    max-height: 480px;
  }

  .dropdown {
    margin-left: auto;
    z-index: 1100;
  }
}

/* Mantener color y la variante usada (.underline-3-inner) */
.nav-link {
  color: rgba(255, 255, 255, 0.95);
}

.nav-underline {
  display: inline-block;
  background-image: linear-gradient(#fff, #fff);
  background-repeat: no-repeat;
  background-size: 0% 2px;
  background-position: center 100%;
  transition: background-size .28s ease;
  padding: 0;
}

.nav-underline:hover,
/* activar cuando el padre recibe hover/focus/active o está marcado como router-link-active */
.nav-link:hover .nav-underline,
.nav-link:focus .nav-underline,
.nav-link:active .nav-underline,
.nav-link.router-link-active .nav-underline,
.nav-link.active .nav-underline {
  background-size: 80% 2px;
}

/* pequeña separación para el menú colapsado */
.navbar-collapse .nav-item {
  margin-bottom: .25rem;
}
</style>
