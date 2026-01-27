<template>
    <div class="container-fluid my-3">
        <h4 class="text-center bg-primary-subtle py-2 mb-4">
            <i class="bi bi-car-front me-2"></i>Vehículos en Venta
        </h4>

        <!-- Filtros -->
        <div class="row mb-4 g-3">
            <div class="col-md-3">
                <select v-model="filtroMarca" class="form-select">
                    <option value="">Todas las marcas</option>
                    <option v-for="marca in marcasUnicas" :key="marca" :value="marca">{{ marca }}</option>
                </select>
            </div>
            <div class="col-md-3">
                <select v-model="filtroCombustible" class="form-select">
                    <option value="">Todos los combustibles</option>
                    <option value="gasolina">Gasolina</option>
                    <option value="diésel">Diésel</option>
                    <option value="híbrido">Híbrido</option>
                    <option value="eléctrico">Eléctrico</option>
                </select>
            </div>
            <div class="col-md-3">
                <select v-model="filtroEstado" class="form-select">
                    <option value="">Todos los estados</option>
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
                </select>
            </div>
            <div class="col-md-3">
                <button @click="limpiarFiltros" class="btn btn-outline-secondary w-100">
                    <i class="bi bi-x-circle me-1"></i>Limpiar filtros
                </button>
            </div>
        </div>

        <!-- Tarjetas de vehículos -->
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div class="col" v-for="coche in cochesFiltrados" :key="coche._id">
                <div class="card h-100 shadow-sm">
                    <!-- Imagen: usar imagen guardada (solo nombre de archivo) o placeholder -->
                    <div v-if="imagenSrc(coche)" class="card-img-top p-0" style="height:200px; overflow:hidden;">
                        <img :src="imagenSrc(coche)" :alt="coche.marca + ' ' + coche.modelo"
                            style="width:100%; height:100%; object-fit:cover; display:block;">
                    </div>
                    <div v-else class="card-img-top bg-light d-flex align-items-center justify-content-center"
                        style="height: 200px;">
                        <i class="bi bi-car-front text-secondary" style="font-size: 4rem;"></i>
                    </div>

                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0">{{ coche.marca }} {{ coche.modelo }}</h5>
                            <span :class="{
                                'badge bg-success': coche.estado === 'disponible',
                                'badge bg-warning text-dark': coche.estado === 'reservado',
                                'badge bg-danger': coche.estado === 'vendido'
                            }">
                                {{ coche.estado }}
                            </span>
                        </div>

                        <h6 class="text-primary fw-bold mb-3">{{ coche.precio?.toLocaleString() }} €</h6>

                        <ul class="list-unstyled small">
                            <li><i class="bi bi-calendar me-2"></i><strong>Año:</strong> {{ coche.anio }}</li>
                            <li><i class="bi bi-speedometer2 me-2"></i><strong>Km:</strong> {{
                                coche.kilometros?.toLocaleString() }}</li>
                            <li><i class="bi bi-fuel-pump me-2"></i><strong>Combustible:</strong> {{ coche.combustible
                                }}</li>
                            <li><i class="bi bi-gear me-2"></i><strong>Transmisión:</strong> {{ coche.transmision }}
                            </li>
                            <li><i class="bi bi-lightning me-2"></i><strong>Potencia:</strong> {{ coche.potencia_cv }}
                                CV</li>
                            <li v-if="coche.ubicacion"><i class="bi bi-geo-alt me-2"></i><strong>Ubicación:</strong> {{
                                coche.ubicacion.ciudad }}, {{ coche.ubicacion.provincia }}</li>
                        </ul>

                        <p class="card-text small text-muted mt-2">{{ coche.descripcion }}</p>
                    </div>

                    <div class="card-footer bg-white border-top-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="bi bi-clock me-1"></i>{{ formatearFechaDisplay(coche.fecha_publicacion) }}
                            </small>
                            <button class="btn btn-primary btn-sm" @click="verDetalles(coche)"
                                :disabled="coche.estado === 'vendido'">
                                <i class="bi bi-eye me-1"></i>Ver más
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mensaje si no hay coches -->
            <div v-if="cochesFiltrados.length === 0" class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle me-2"></i>No hay vehículos disponibles con los filtros seleccionados.
                </div>
            </div>
        </div>

        <!-- Modal de detalles -->
        <div class="modal fade" id="modalDetalles" tabindex="-1" ref="modalRef">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-car-front me-2"></i>{{ cocheSeleccionado?.marca }} {{
                                cocheSeleccionado?.modelo }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="cocheSeleccionado">
                        <div class="mb-3 text-center" v-if="imagenSrc(cocheSeleccionado)">
                            <img :src="imagenSrc(cocheSeleccionado)"
                                :alt="cocheSeleccionado.marca + ' ' + cocheSeleccionado.modelo"
                                class="img-fluid rounded" style="max-height:300px; object-fit:cover; width:100%;">
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="text-primary">Características</h6>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Tipo</span><strong>{{ cocheSeleccionado.tipo }}</strong>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Año</span><strong>{{ cocheSeleccionado.anio }}</strong>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Kilómetros</span><strong>{{ cocheSeleccionado.kilometros?.toLocaleString()
                                            }} km</strong>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Combustible</span><strong>{{ cocheSeleccionado.combustible }}</strong>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Transmisión</span><strong>{{ cocheSeleccionado.transmision }}</strong>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>Potencia</span><strong>{{ cocheSeleccionado.potencia_cv }} CV</strong>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-primary">Contacto</h6>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">
                                        <i class="bi bi-person me-2"></i>{{ cocheSeleccionado.contacto?.nombre }}
                                    </li>
                                    <li class="list-group-item">
                                        <i class="bi bi-telephone me-2"></i>{{ cocheSeleccionado.contacto?.telefono }}
                                    </li>
                                    <li class="list-group-item">
                                        <i class="bi bi-envelope me-2"></i>{{ cocheSeleccionado.contacto?.email }}
                                    </li>
                                    <li class="list-group-item">
                                        <i class="bi bi-geo-alt me-2"></i>{{ cocheSeleccionado.ubicacion?.ciudad }}, {{
                                            cocheSeleccionado.ubicacion?.provincia }}
                                    </li>
                                </ul>
                                <div class="mt-3">
                                    <h4 class="text-success fw-bold">{{ cocheSeleccionado.precio?.toLocaleString() }} €
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h6 class="text-primary">Descripción</h6>
                            <p>{{ cocheSeleccionado.descripcion }}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <a v-if="cocheSeleccionado?.contacto?.telefono"
                            :href="'tel:' + cocheSeleccionado.contacto.telefono" class="btn btn-success">
                            <i class="bi bi-telephone me-1"></i>Llamar
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCoches } from '@/api/coches.js'
import { Modal } from 'bootstrap'
import { useValidaciones } from '@/composables/useValidaciones.js'

const { formatearFechaDisplay } = useValidaciones()

const coches = ref([])
const cocheSeleccionado = ref(null)
const modalRef = ref(null)
let modal = null

// Filtros
const filtroMarca = ref('')
const filtroCombustible = ref('')
const filtroEstado = ref('')

onMounted(async () => {
    await cargarCoches()
})

// Construye la URL pública de la imagen a partir del valor almacenado en la BD
// Usa la variable de entorno VITE_API_URL si está disponible, si no usa http://localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const imagenSrc = (coche) => {
    if (!coche || !coche.imagen) return null
    const name = String(coche.imagen).trim()
    // Si ya es una URL absoluta, devolverla
    if (/^https?:\/\//i.test(name)) return name
    // Normalizar empezando por uploads
    const filename = name.replace(/^\/+/, '')
    return `${API_BASE}/uploads/${filename}`
}

const cargarCoches = async () => {
    try {
        coches.value = await getCoches()
    } catch (error) {
        console.error('Error al cargar coches:', error)
    }
}

// Computed para marcas únicas
const marcasUnicas = computed(() => {
    const marcas = coches.value.map(c => c.marca).filter(Boolean)
    return [...new Set(marcas)].sort()
})

// Computed para coches filtrados
const cochesFiltrados = computed(() => {
    return coches.value.filter(coche => {
        // Excluir vendidos por defecto si no hay filtro de estado
        if (!filtroEstado.value && coche.estado === 'vendido') return false

        if (filtroMarca.value && coche.marca !== filtroMarca.value) return false
        if (filtroCombustible.value && coche.combustible?.toLowerCase() !== filtroCombustible.value) return false
        if (filtroEstado.value && coche.estado !== filtroEstado.value) return false

        return true
    })
})

const limpiarFiltros = () => {
    filtroMarca.value = ''
    filtroCombustible.value = ''
    filtroEstado.value = ''
}

const verDetalles = (coche) => {
    cocheSeleccionado.value = coche
    if (!modal && modalRef.value) {
        modal = new Modal(modalRef.value)
    }
    modal?.show()
}
</script>

<style scoped>
.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-img-top {
    border-bottom: 1px solid #dee2e6;
}
</style>