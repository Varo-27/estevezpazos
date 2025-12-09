<template>
    <div class="my-2 p-4 bg-light border rounded shadow-sm min-vh-75">
        <h3 class="text-center mb-4">Gestión de Citas</h3>

        <form @submit.prevent="guardarCita" class="row g-3">

            <!-- Nombre -->
            <div class="col-12 col-md-4">
                <div class="row align-items-center">
                    <label for="nombre" class="col-12 col-md-3 form-label mb-0 text-md-start">Matricula</label>
                    <div class="col-12 col-md-5">
                        <input id="nombre" type="text" v-model="nuevaCita.matricula" class="form-control" required />
                    </div>
                    <div class="col-12 col-md-2">
                        <button type="button" class="btn btn-outline-secondary" @click="recargaForm" title="Limpiar">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tipo de cliente -->
            <div class="col-12 col-md-4">
                <div class="row align-middle mt-2">
                    <label for="tipo" class="col-12 col-md-2 form-label mb-0 text-md-start">Estado:</label>
                    <div class="col-12 col-md-9 m-0 pe-0">
                        <div class="input-group form-check-inline">
                            <div class="form-check ms-1">
                                <input type="radio" id="tipocliente" v-model="nuevaCita.estadoCita"
                                    class="form-check-input" value="Pendiente" />
                                <label for="tipocliente" class="form-check-label me-3">Pendiente</label>
                            </div>
                            <div class="form-check">
                                <input type="radio" id="tipocliente2" v-model="nuevaCita.estadoCita"
                                    class="form-check-input" value="Finalizado" />
                                <label for="tipocliente2" class="form-check-label">Finalizado</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fecha de alta -->
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
                        <select id="servicio" v-model="nuevaCita.servicioTaller" class="form-select">
                            <option disabled value="">Seleccione</option>
                            <option value="Revisión">Revisión</option>
                            <option value="PreITV">PreITV</option>
                            <option value="Neumáticos">Neumáticos</option>
                            <option value="Frenos">Frenos</option>
                            <option value="Cambio de aceite">Cambio de aceite</option>
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
                            :class="['form-control text-center', { 'is-invalid': !movilValido }]" />
                    </div>
                </div>
            </div>

            <!-- Condiciones -->
            <div class="col-12 text-center">
                <div class="form-check d-inline-block">
                    <input id="condiciones" type="checkbox" v-model="nuevaCita.acepta" class="form-check-input"/>
                    <label class="form-check-label" for="condiciones">
                        Acepta el presupuesto
                    </label>
                </div>
            </div>

            <!-- Botones -->
            <div class="col-12 position-relative d-flex justify-content-center align-items-center">
                <!-- Botón centrado -->
                <button type="submit" class="btn btn-primary">
                    {{ editando ? "Modificar Cita" : "Guardar Cita" }}
                </button>
            </div>
        </form>

        <!-- Lista de Citas -->
        <div class="table-responsive mt-4">
            <h4 class="text-center mb-3">Listado Citas Taller</h4>
            <table class="table table-bordered table-striped">
                <thead class="table-primary">
                    <tr>
                        <th class="text-center">ID</th>
                        <th class="text-center">Fecha</th>
                        <th class="text-center">Matricula</th>
                        <th class="text-center">Móvil</th>
                        <th class="text-center">Servicio</th>
                        <th class="text-center">Estado</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(cita, index) in citasPaginadas" :key="cita.id || index">
                        <th scope="row" class="text-center">{{ (currentPage - 1) * citasPorPage + index + 1 }}</th>
                        <td>{{ cita.fechaAlta }}</td>
                        <td>{{ cita.matricula }}</td>
                        <td class="text-center">{{ cita.movilcliente }}</td>
                        <td class="text-center">{{ cita.servicioTaller }}</td>
                        <td class="text-center">{{ cita.estadoCita }}</td>
                        <td class="text-center align-middle">
                            <button @click="eliminarCita(cita.movilcliente)" class="btn btn-danger btn-sm me-1">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button @click="editarCita(cita.movilcliente)" class="btn btn-warning btn-sm me-1">
                                <i class="bi bi-pencil"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Paginación -->
        <div class="d-flex justify-content-center my-3">
            <button class="btn btn-outline-primary btn-sm me-2" @click="beforePagina" :disabled="currentPage <= 1">
                <i class="bi bi-chevron-left"></i>
            </button>
            <span class="mx-3 align-self-center text-muted">Página {{ currentPage }}</span>
            <button class="btn btn-outline-primary btn-sm" @click="nextPagina" :disabled="currentPage >= totalPages">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
//Scripts CRUD
import { ref, onMounted, computed } from "vue";
import { getCitasTaller, deleteCitaTaller, addCitaTaller, updateCitaTaller } from "@/api/taller.js";
import { useNotifications } from '@/composables/useNotifications';
const {success, error, warning, confirm} = useNotifications()
import Swal from "sweetalert2";

const nuevaCita = ref({
    matricula: "",
    movilcliente: "",
    fechaAlta: "",
    servicioTaller: "",
    estadoCita: "Pendiente",
    acepta: false
});

const citas = ref([]);
const editando = ref(false);
const citaEditandoId = ref(null);
const numCitas = ref(0);
const currentPage = ref(1);
const citasPorPage = 5;

// Zona Cargar citas Al Montar el componente
onMounted(async () => {
    cargarCitas();
});

const cargarCitas = () => {
    getCitasTaller().then((data) => {
        citas.value = data;
        numCitas.value = data.length;
    });
    success('Listando Citas')
};

// Funcion Eliminar Cita with patch (histórico a false)
const eliminarCita = async (movilcliente) => {
    // Refrescar lista desde la API
    citas.value = await getCitasTaller();
    // Buscar cita completa (que incluye el ID)
    const citaAEliminar = citas.value.find((cita) => cita.movilcliente === movilcliente);

    if (!citaAEliminar) {
        error("Cita no encontrada")
        return;
    }

    // Pedir confirmación antes de eliminar
    const result = await Swal.fire({
        title: `¿Eliminar la cita con matrícula ${citaAEliminar.matricula}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    });

    // Si no confirma, salir
    if (!result.isConfirmed) return;

    // Si confirma, eliminar cita usando la API y movil como ID
    await deleteCitaTaller(citaAEliminar.id);
    // Refrescar la lista desde la "API"
    citas.value = await getCitasTaller();

    success("Cita eliminada")
};

const guardarCita = async () => {
    if (!nuevaCita.value.acepta) {
        warning("Debe aceptar el presupuesto", "Por favor, marque la casilla para continuar.")
        return;
    }

    // Validar duplicados solo si estás creando (no si editando)
    if (!editando.value) {
        const duplicado = citas.value.find(
            (cita) =>
                cita.movilcliente === nuevaCita.value.movilcliente
        );
        if (duplicado) {
            Swal.fire({
                icon: "error",
                title: "Móvil duplicado",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
    }

    // Confirmación antes de guardar
    const result = await Swal.fire({
        title: editando.value ? "¿Desea modificar esta cita?" : "¿Desea grabar esta cita?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: editando.value ? "Modificar" : "Grabar",
        cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
        if (editando.value) {
            // Modificar cita (PUT)
            const citaActualizada = await updateCitaTaller(citaEditandoId.value, nuevaCita.value);
            // Actualiza la cita en la lista local
            const index = citas.value.findIndex((c) => c.id === citaEditandoId.value);
            if (index !== -1) citas.value[index] = citaActualizada;
            Swal.fire({
                icon: "success",
                title: "Cita modificada",
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            // Agregar cita (POST)
            const citaAgregada = await addCitaTaller(nuevaCita.value);
            citas.value.push(citaAgregada);
            Swal.fire({
                icon: "success",
                title: "Cita agregada",
                showConfirmButton: false,
                timer: 1500,
            });
        }

        nuevaCita.value = {
            matricula: "",
            movilcliente: "",
            fechaAlta: "",
            servicioTaller: "",
            estadoCita: "Pendiente",
            acepta: false
        };

        editando.value = false;
        citaEditandoId.value = null;

        movilValido.value = true;

        // Refrescar lista completa (opcional)
        citas.value = await getCitasTaller();
    } catch (error) {
        console.error("Error al guardar cita:", error);
        Swal.fire({
            icon: "error",
            title: "Error al guardar cita",
            text: "Inténtelo de nuevo o contacte con el administrador.",
            showConfirmButton: false,
            timer: 1500,
        });
    }
};

// Función Editar Cita (carga datos en el formulario)
const editarCita = (movilcliente) => {
    const cita = citas.value.find((c) => c.movilcliente === movilcliente);
    if (!cita) {
        Swal.fire({
            icon: "error",
            title: "Cita no encontrada",
            showConfirmButton: false,
            timer: 1500,
        });
        return;
    }

    // Copiar datos al formulario
    nuevaCita.value = { ...cita };
    editando.value = true;
    citaEditandoId.value = cita.id;

    // Formatear fecha para el input type="date"
    if (cita.fechaAlta) {
        nuevaCita.value.fechaAlta = formatearFechaParaInput(cita.fechaAlta);
    }
};

function recargaForm() {
    nuevaCita.value = {
        matricula: "",
        movilcliente: "",
        fechaAlta: "",
        servicioTaller: "",
        estadoCita: "Pendiente",
        acepta: false
    };
    editando.value = false;
    citaEditandoId.value = null;

    movilValido.value = true;
}

//////////////////////////////////////////////////////

// conversor fecha
const formatearFechaParaInput = (fecha) => {
    if (!fecha) return "";

    // Detecta formato dd/mm/yyyy
    if (fecha.includes("/")) {
        const [dd, mm, yyyy] = fecha.split("/");
        return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }

    // Detecta formato yyyy-mm-dd
    if (fecha.includes("-")) {
        const partes = fecha.split("-");
        if (partes.length === 3) return fecha; // ya formato ISO
    }

    return "";
};

//Scripts auxiliares

///////////////////////////

// Control móvil
const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;

const validarMovil = () => {
    const movil = nuevaCita.value.movilcliente.trim();

    if (movil === "") {
        movilValido.value = true; // Vacío = válido (opcional)
        return true;
    }

    if (movil.charAt(0) === "6" || movil.charAt(0) === "7") {
        movilValido.value = movilRegex.test(movil);
        return movilValido.value;
    } else {
        movilValido.value = false;
        return false;
    }
};

// Métodos de paginación
const beforePagina = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const nextPagina = () => {
    const totalPages = Math.ceil(numCitas.value / citasPorPage);
    //redondear hacia arriba para mostrar la última página aunque no esté completa
    if (currentPage.value < totalPages) {
        currentPage.value++;
    }
};

// Propiedad computada para obtener las citas en la página actual
// computed crea una propiedad reactiva que se actualiza automáticamente
// cuando cambian las dependencias (currentPage o citas)
// es decir paso pagina o vuelvo atrás cargando las citas de esa página
// slice extrae una sección del array citas
// start es el índice inicial y end el índice final (no incluido)

const citasPaginadas = computed(() => {
    const start = (currentPage.value - 1) * citasPorPage;
    const end = start + citasPorPage;
    return citas.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(numCitas.value / citasPorPage);
});
</script>

<style scoped>
/* Pequeños ajustes para mantener alineación limpia */

input.form-control.text-center {
    text-align: center;
}

.gap-3 {
    gap: 0.75rem;
}
</style>
