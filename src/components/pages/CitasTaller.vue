<template>
    <div class="my-2 p-4 bg-light border rounded shadow-sm min-vh-75">
        <h3 class="text-center mb-4">Gestión de Citas</h3>

        <form @submit.prevent="guardarCita" class="row g-3">
            <!-- Matricula -->
            <div class="col-12 col-md-4">
                <div class="row align-items-center">
                    <label for="matricula" class="col-12 col-md-3 form-label mb-0 text-md-start">Matricula</label>
                    <div class="col-12 col-md-5">
                        <input id="matricula" type="text" v-model="nuevaCita.matricula" class="form-control" required />
                    </div>
                    <div class="col-12 col-md-2">
                        <button type="button" class="btn btn-outline-secondary" @click="recargaForm" title="Limpiar">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Estado -->
            <div class="col-12 col-md-4">
                <div class="row align-middle mt-2">
                    <label class="col-12 col-md-2 form-label mb-0 text-md-start">Estado:</label>
                    <div class="col-12 col-md-9 m-0 pe-0">
                        <div class="input-group form-check-inline">
                            <div class="form-check ms-1">
                                <input type="radio" id="estadoPendiente" v-model="nuevaCita.estadoCita"
                                    class="form-check-input" value="Pendiente" />
                                <label for="estadoPendiente" class="form-check-label me-3">Pendiente</label>
                            </div>
                            <div class="form-check">
                                <input type="radio" id="estadoFinalizado" v-model="nuevaCita.estadoCita"
                                    class="form-check-input" value="Finalizado" />
                                <label for="estadoFinalizado" class="form-check-label">Finalizado</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fecha -->
            <div class="col-12 col-md-4">
                <div class="row align-items-center">
                    <label for="fecha" class="col-12 col-md-3 form-label mb-0 text-md-start">Fecha</label>
                    <div class="col-12 col-md-5">
                        <input id="fecha" type="date" v-model="nuevaCita.fechaAlta" class="form-control" />
                    </div>
                </div>
            </div>

            <!-- Servicio -->
            <div class="col-12 col-md-4">
                <div class="row align-items-center">
                    <label for="servicio" class="col-12 col-md-3 form-label mb-0 text-md-start">Servicio</label>
                    <div class="col-12 col-md-5">
                        <select id="servicio" v-model="nuevaCita.servicioTaller" class="form-select" required>
                            <option disabled value="">Seleccione</option>
                            <option v-for="servicio in servicios" :key="servicio" :value="servicio">
                                {{ servicio }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Móvil -->
            <div class="col-12 col-md-4">
                <div class="row align-items-center">
                    <label for="movil" class="col-12 col-md-2 form-label mb-0 text-md-start">Móvil</label>
                    <div class="col-12 col-md-8 col-xxl-5">
                        <input id="movil" type="tel" v-model="nuevaCita.movilcliente" @blur="validarMovil"
                            :class="['form-control text-center', { 'is-invalid': !movilValido }]" required />
                    </div>
                </div>
            </div>

            <!-- Acepta presupuesto -->
            <div class="col-12 text-center">
                <div class="form-check d-inline-block">
                    <input id="acepta" type="checkbox" v-model="nuevaCita.acepta" class="form-check-input" />
                    <label class="form-check-label" for="acepta">
                        Acepta el presupuesto
                    </label>
                </div>
            </div>

            <!-- Botón -->
            <div class="col-12 text-center">
                <button type="submit" class="btn btn-primary">
                    {{ editando ? "Modificar Cita" : "Guardar Cita" }}
                </button>
            </div>
        </form>

        <!-- Tabla de Citas -->
        <div class="table-responsive mt-4">
            <h4 class="text-center mb-3">Listado Citas Taller</h4>
            <table class="table table-bordered table-striped">
                <thead class="table-primary">
                    <tr>
                        <th class="text-center">Nº</th>
                        <th class="text-center">Fecha</th>
                        <th class="text-center">Matricula</th>
                        <th class="text-center">Móvil</th>
                        <th class="text-center">Servicio</th>
                        <th class="text-center">Estado</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(cita, index) in citasPaginadas" :key="cita.id">
                        <td class="text-center">{{ (currentPage - 1) * citasPorPage + index + 1 }}</td>
                        <td class="text-center">{{ cita.fechaAlta }}</td>
                        <td class="text-center">{{ cita.matricula }}</td>
                        <td class="text-center">{{ cita.movilcliente }}</td>
                        <td class="text-center">{{ cita.servicioTaller }}</td>
                        <td class="text-center">
                            <span :class="['badge', cita.estadoCita === 'Pendiente' ? 'bg-warning' : 'bg-success']">
                                {{ cita.estadoCita }}
                            </span>
                        </td>
                        <td class="text-center">
                            <button @click="editarCita(cita.id)" class="btn btn-warning btn-sm me-1" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button @click="eliminarCita(cita.id)" class="btn btn-danger btn-sm" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Paginación -->
        <div class="d-flex justify-content-center my-3">
            <button class="btn btn-outline-primary btn-sm me-2" @click="currentPage--" :disabled="currentPage <= 1">
                <i class="bi bi-chevron-left"></i>
            </button>
            <span class="mx-3 align-self-center text-muted">Página {{ currentPage }} de {{ totalPages }}</span>
            <button class="btn btn-outline-primary btn-sm" @click="currentPage++" :disabled="currentPage >= totalPages">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getCitasTaller, deleteCitaTaller, addCitaTaller, updateCitaTaller } from "@/api/taller.js";
import { useNotifications } from '@/composables/useNotifications.js';
import Swal from "sweetalert2";

const { success, error, warning } = useNotifications();

// ✅ Constantes
const servicios = ["Revisión", "PreITV", "Neumáticos", "Frenos", "Cambio de aceite"];
const movilRegex = /^[67]\d{8}$/;
const citasPorPage = 5;

// ✅ Estado reactivo
const citas = ref([]);
const nuevaCita = ref(crearCitaVacia());
const editando = ref(false);
const citaEditandoId = ref(null);
const movilValido = ref(true);
const currentPage = ref(1);

// ✅ Computed properties
const citasPaginadas = computed(() => {
    const start = (currentPage.value - 1) * citasPorPage;
    return citas.value.slice(start, start + citasPorPage);
});

const totalPages = computed(() => Math.ceil(citas.value.length / citasPorPage));

// ✅ Función auxiliar para crear cita vacía
function crearCitaVacia() {
    return {
        matricula: "",
        movilcliente: "",
        fechaAlta: "",
        servicioTaller: "",
        estadoCita: "Pendiente",
        acepta: false
    };
}

// ✅ Cargar citas al montar
onMounted(async () => {
    await cargarCitas();
});

const cargarCitas = async () => {
    try {
        citas.value = await getCitasTaller();
        success('Citas cargadas correctamente');
    } catch (err) {
        error('Error al cargar las citas');
        console.error(err);
    }
};

// ✅ Validar móvil
const validarMovil = () => {
    const movil = nuevaCita.value.movilcliente.trim();
    movilValido.value = !movil || movilRegex.test(movil);
    return movilValido.value;
};

// ✅ Guardar cita (crear o editar)
const guardarCita = async () => {
    // Validaciones
    if (!nuevaCita.value.acepta) {
        warning("Debe aceptar el presupuesto");
        return;
    }

    if (!validarMovil()) {
        error("Móvil inválido");
        return;
    }

    // Verificar duplicado solo al crear
    if (!editando.value && citas.value.some(c => c.movilcliente === nuevaCita.value.movilcliente)) {
        error("Ya existe una cita con este móvil");
        return;
    }

    // Confirmar acción
    const result = await Swal.fire({
        title: editando.value ? "¿Modificar esta cita?" : "¿Guardar esta cita?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: editando.value ? "Modificar" : "Guardar",
        cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    try {
        if (editando.value) {
            // Actualizar
            const citaActualizada = await updateCitaTaller(citaEditandoId.value, nuevaCita.value);
            const index = citas.value.findIndex(c => c.id === citaEditandoId.value);
            if (index !== -1) citas.value[index] = citaActualizada;
            success("Cita modificada correctamente");
        } else {
            // Crear
            const citaNueva = await addCitaTaller(nuevaCita.value);
            citas.value.push(citaNueva);
            success("Cita guardada correctamente");
        }

        recargaForm();
    } catch (err) {
        error("Error al guardar la cita");
        console.error(err);
    }
};

// ✅ Editar cita
const editarCita = (id) => {
    const cita = citas.value.find(c => c.id === id);
    if (!cita) {
        error("Cita no encontrada");
        return;
    }

    nuevaCita.value = { ...cita };
    editando.value = true;
    citaEditandoId.value = id;
};

// ✅ Eliminar cita
const eliminarCita = async (id) => {
    const cita = citas.value.find(c => c.id === id);
    if (!cita) {
        error("Cita no encontrada");
        return;
    }

    const result = await Swal.fire({
        title: `¿Eliminar la cita de ${cita.matricula}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    try {
        await deleteCitaTaller(id);
        citas.value = citas.value.filter(c => c.id !== id);
        success("Cita eliminada correctamente");
    } catch (err) {
        error("Error al eliminar la cita");
        console.error(err);
    }
};

// ✅ Limpiar formulario
const recargaForm = () => {
    nuevaCita.value = crearCitaVacia();
    editando.value = false;
    citaEditandoId.value = null;
    movilValido.value = true;
};
</script>

<style scoped>
input.form-control.text-center {
    text-align: center;
}
</style>
