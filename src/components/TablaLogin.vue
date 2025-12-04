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
          <input
            type="text"
            id="dni"
            autocomplete="off"
            @blur="capitalizarTexto"
            class="form-control text-center"
            v-model="dni"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label fw-bold">Contraseña:</label>
          <input
            type="password"
            id="pass"
            autocomplete="new-password"
            class="form-control"
            v-model="pass"
            required
          />
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
import Swal from "sweetalert2";
import { loginUsuario } from "@/api/authApi.js";
import jwtDecode from "jwt-decode"; // ya no hace falta usar `.default`
import { ref } from "vue";
import { useRouter } from "vue-router";

// ✅ Reemplazo de data()
const dni = ref("");
const pass = ref("");

// ✅ Reemplazo de this.$router
const router = useRouter();

// ✅ Funciones directamente definidas
const capitalizarTexto = () => {
  dni.value = dni.value.toUpperCase().trim();
};

const iniciarSesion = async () => {
  try {
    dni.value = dni.value.toUpperCase().trim();
    pass.value = pass.value.trim();

    if (dni.value === "" || pass.value === "") {
      Swal.fire({
        title: "Campos vacíos",
        text: "Por favor, complete ambos campos.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const data = await loginUsuario(dni.value, pass.value);
    const decoded = jwtDecode(data.token);

    // Guardar en sessionStorage
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("isLogueado", "true");
    sessionStorage.setItem("isAdmin", decoded.tipo === "admin" ? "true" : "false");
    sessionStorage.setItem("isUsuario", decoded.tipo !== "admin" ? "true" : "false");
    sessionStorage.setItem("userName", data.nombre);

    // Redirigir
    router.push({ name: "Inicio" }).then(() => window.location.reload());

    Swal.fire({
      title: "Bienvenido",
      text: `Hola ${data.nombre}`,
      icon: "success",
      showConfirmButton: false,
      timer: 3000,
    });
  } catch (error) {
    console.error("Error en iniciarSesion:", error);
    Swal.fire({
      title: "Error de autenticación",
      text: "Error usuario o contraseña. Verifica tus credenciales.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
};
</script>

<style>
.form-label {
  background-color: transparent !important;
  margin-bottom: 0.5rem;
}
</style>
