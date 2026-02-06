<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-75 mt-5">
    <div class="text-center mb-4">
      <h5 class="fw-bold text-uppercase text-primary position-relative d-inline-block">
        <i class="bi bi-people-fill me-2 fs-3"></i>
        Iniciar sesión
        <span class="underline-effect"></span>
      </h5>
    </div>

    <div class="border p-4 shadow-sm rounded w-100" style="max-width: 400px">
      <form @submit.prevent="iniciarSesion">
        <div class="mb-3">
          <label for="dni" class="form-label fw-bold">DNI:</label>
          <input type="text" id="dni" autocomplete="off" @blur="capitalizarTexto" class="form-control text-center"
            v-model="dni" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label fw-bold">Contraseña:</label>
          <input type="password" id="pass" autocomplete="new-password" class="form-control" v-model="pass" required />
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-primary w-50">
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth.js";
import { useValidaciones } from "@/composables/useValidaciones.js";
import Swal from "sweetalert2";

const dni = ref("");
const pass = ref("");
const router = useRouter();

const { login } = useAuth();
const { mayusculas } = useValidaciones();

const capitalizarTexto = () => {
  dni.value = mayusculas(dni.value.trim());
};

const iniciarSesion = async () => {
  if (!dni.value.trim() || !pass.value.trim()) {
    Swal.fire({
      title: "Campos vacíos",
      text: "Por favor, complete todos los campos",
      icon: "warning",
      confirmButtonText: "Entendido"
    });
    return;
  }

  try {
    await login(dni.value.trim().toUpperCase(), pass.value.trim());

    // El success se muestra en useAuth, aquí solo redirigimos
    setTimeout(() => {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push({ name: "Inicio" });
      }
    }, 1500);
  } catch (error) {
    console.error("Error en login:", error);
    // El error también se muestra en useAuth
  }
};
</script>

<style>
.form-label {
  background-color: transparent !important;
  margin-bottom: 0.5rem;
}
</style>
