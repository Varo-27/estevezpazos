<template>
    <h4 class="text-center my-1 bg-primary-subtle py-1">Noticias</h4>

    <div v-if="isAdmin" class="border rounded-3 shadow-sm p-4">
        <form @submit.prevent="agregarNoticia">
            <label for="title" class="col-sm-2 col-form-label fw-bold text-primary">Título:</label>
            <input type="text" class="form-control" id="title" v-model="nuevoTitulo" />
            <label for="desc" class="col-sm-2 col-form-label fw-bold text-primary">Descripción:</label>
            <textarea class="form-control" id="desc" rows="4" v-model="nuevoContenido"></textarea>
            <div class="text-center mt-3">
                <button type="submit" class="btn btn-primary">Publicar</button>
            </div>
        </form>
    </div>

    <!-- Contenedor de noticias -->
    <div class="mt-3">
        <div v-for="noticia in noticias" :key="noticia.id" class="noticia-card mb-3 rounded-3 overflow-hidden">
            <!-- Título y fecha -->
            <div class="p-3 bg-info-subtle d-flex justify-content-between ">
                <div class="d-flex justify-content-between align-items-center">
                    <strong class="text-primary">{{ noticia.titulo }}</strong>
                </div>
                <div class="align-items-center">
                    <small class="text-muted me-4">{{ noticia.fecha }}</small>
                    <button class="btn btn-warning" @click.prevent="actualizarNoticia(noticia.id)">
                        <i class="bi bi-hand-thumbs-up"></i></button>
                    <small class="btn bg-warning-subtle ms-2">{{ noticia.likes }}</small>
                </div>
            </div>

            <!-- Contenido -->
            <div class="p-3 bg-info-subtle">
                <p class="mb-2">
                    {{ isExpanded[noticia.id] ? noticia.contenido : noticia.contenido.slice(0, 150) + "..." }}
                </p>

                <div class="d-flex justify-content-between align-items-center">
                    <a href="#" @click.prevent="toggleExpand(noticia.id)" class="text-decoration-none">
                        {{ isExpanded[noticia.id] ? "Mostrar menos..." : "Seguir leyendo..." }}
                    </a>
                    <button v-if="isAdmin" class="btn btn-outline-secondary btn-sm"
                        @click.prevent="eliminarNoticia(noticia.id)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getNoticias, addNoticia, updateNoticia, deleteNoticia } from "@/api/noticias.js";
import { useAuth } from '@/composables/useAuth.js'

const { isAdmin } = useAuth()

const noticias = ref([]);
const isExpanded = reactive({});
const nuevoTitulo = ref("");
const nuevoContenido = ref("");

// Cargar noticias al montar el componente
onMounted(async () => {
    await cargarNoticias();
});

const cargarNoticias = async () => {
    try {
        noticias.value = await getNoticias();
    } catch (error) {
        console.error("Error al cargar noticias:", error);
        alert("Error al cargar las noticias");
    }
};

const agregarNoticia = async () => {
    if (!nuevoTitulo.value || !nuevoContenido.value) {
        alert("Por favor completa todos los campos");
        return;
    }

    const nuevaNoticia = {
        titulo: nuevoTitulo.value,
        contenido: nuevoContenido.value,
        fecha: new Date()
            .toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .split("/")
            .reverse()
            .join("-"), // Formato YYYY-MM-DD
        likes: 0
    };

    try {
        // ✅ El backend devuelve la noticia con el ID generado
        const noticiaCreada = await addNoticia(nuevaNoticia);

        // ✅ Usar la noticia que devuelve el backend (con ID)
        noticias.value.unshift(noticiaCreada);

        // Limpiar el formulario
        nuevoTitulo.value = "";
        nuevoContenido.value = "";
    } catch (error) {
        console.error("Error al publicar la noticia:", error);
        alert("Error al publicar la noticia");
    }
};

const eliminarNoticia = async (id) => {
    try {
        await deleteNoticia(id);
        noticias.value = noticias.value.filter((noticia) => noticia.id !== id);
        // Eliminar el estado de expansión
        delete isExpanded[id];
    } catch (error) {
        console.error("Error al eliminar la noticia:", error);
        alert("Error al eliminar la noticia");
    }
}

const actualizarNoticia = async (id) => {
    try {
        const noticiaEncontrada = noticias.value.find(noticia => noticia.id === id);

        if (!noticiaEncontrada) {
            console.error("Noticia no encontrada");
            return;
        }

        await updateNoticia(id, {...noticiaEncontrada, likes: noticiaEncontrada.likes+1});
        cargarNoticias()
    } catch (error) {
        console.error("Error al eliminar la noticia:", error);
        alert("Error al eliminar la noticia");
    }
}











const toggleExpand = (id) => {
    isExpanded[id] = !isExpanded[id];
};

</script>

<style scoped>
.noticia-card {
    background-color: #e3f2fd !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bg-info-subtle {
    background-color: #f3faff !important;
}
</style>
