<template>
    <div
        class="d-flex flex-column justify-content-center align-items-center h-100 position-relative bg-secondary bg-opacity-25">
        <video autoplay muted loop class="position-fixed top-0 start-0 w-100 h-100"
            style="object-fit: cover; z-index: -1">
            <source src="@/assets/background.mp4" type="video/mp4" />
        </video>

        <div v-if="mostrarBienvenida" class="texto-bienvenida" :class="{ 'fade-out': desvaneciendo }">
            <h1 class="display-1 fw-bold text-white text-shadow">Bienvenido a CarTeis</h1>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const mostrarBienvenida = ref(true);
const desvaneciendo = ref(false);

onMounted(() => {
    setTimeout(() => {
        desvaneciendo.value = true;
    }, 8000);

    setTimeout(() => {
        mostrarBienvenida.value = false;
    }, 10000);
});
</script>

<style scoped>
.texto-bienvenida {
    text-align: center;
    opacity: 1;
    transition: opacity 2s ease-out;
}

.fade-out {
    opacity: 0;
}

.text-shadow {
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
}
</style>
