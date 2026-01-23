<template>
    <div class="container mt-4">
        <h5 class="text-center bg-primary-subtle ms-1 py-1"><i class="bi bi-car-front me-2"></i>Buscando: "{{ termino
            }}"</h5>
        <hr>
        <!-- CLIENTES -->
        <div v-if="clientes.length">
            <h6 class="fw-bold">Clientes</h6>
            <ul>
                <li v-for="c in clientes" :key="c.id">
                    {{ c.nombre }}
                    <span v-html="resaltar(c.apellidos, termino)"></span>
                    <small class="text-muted" v-html="resaltar(c.email, termino)"></small>
                </li>
            </ul>
        </div>
        <!-- NOTICIAS -->
        <div v-if="noticias.length" class="mt-4">
            <h6 class="fw-bold">Noticias</h6>
            <ul>
                <li v-for="n in noticias" :key="n.id">
                    <span v-html="resaltar(n.titulo, termino)"></span>
                </li>
            </ul>
        </div>
        <!-- SIN RESULTADOS -->
        <div v-if="!clientes.length && !noticias.length" class="mt-3">
            <p>No se encontraron resultados.</p>
        </div>
    </div>
</template>
<script setup>

// IMPORTANTE: usamos funciones del API en lugar de fetch
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getClientes } from '../../api/clientes.js'
import { getNoticias } from '../../api/noticias.js'
import { useAuth } from '@/composables/useAuth.js'

const route = useRoute()
const termino = ref(route.query.q?.toLowerCase() || "")

const clientes = ref([])
const noticias = ref([])
const { isAdmin } = useAuth()

async function buscar() {
    const q = termino.value.trim().toLowerCase()
    if (!q) {
        clientes.value = []
        noticias.value = []
        return
    }

    let listaClientes = null
    if (isAdmin.value) {
        listaClientes = await getClientes()
    }
    const listaNoticias = await getNoticias()

    clientes.value = (listaClientes || []).filter(c =>
        (c.apellidos && c.apellidos.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.nombre && c.nombre.toLowerCase().includes(q))
    )

    noticias.value = (listaNoticias || []).filter(n =>
        n.titulo && n.titulo.toLowerCase().includes(q)
    )
}

onMounted(() => {
    termino.value = route.query.q?.toLowerCase() || ''
    if (termino.value) buscar()
})

// Vigila cambios en el query 'q' para actualizar resultados y volver a buscar
watch(() => route.query.q, (nuevo) => {
    termino.value = nuevo ? nuevo.toLowerCase() : ''
    if (termino.value) buscar()
    else {
        clientes.value = []
        noticias.value = []
    }
})

// FUNCION PARA RESALTAR TEXTO
function resaltar(texto, termino) {
    if (!texto || !termino) return texto || ""
    const escaped = String(termino).replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")
    const regex = new RegExp(`(${escaped})`, "gi")
    return String(texto).replace(regex, "<mark>$1</mark>")
}
</script>