<template>
    <div class="my-2 p-4 bg-light border rounded shadow-sm min-vh-75">
        <h3 class="text-center mb-4">Gestión de Clientes</h3>

        <form @submit.prevent="guardarCliente" class="row g-3">
            <!-- DNI + acciones (inline en pantallas grandes, apilado en pequeñas) -->
            <div class="col-12 col-md-6">
                <div class="row align-items-center">
                    <label for="dni" class="col-12 col-md-3 form-label mb-0 text-md-start">DNI</label>
                    <div class="col-12 col-md-8 col-xxl-5">
                        <div class="input-group">
                            <input id="dni" type="text" v-model="nuevoCliente.dni" @blur="validarDni"
                                :class="['form-control', { 'is-invalid': !dniValido }]" class="pe-0" required />
                            <button type="button" class="btn btn-outline-primary"
                                @click="buscarClientePorDNI(nuevoCliente.dni)" title="Buscar">
                                <i class="bi bi-search"></i>
                            </button>
                            <button type="button" class="btn btn-outline-secondary" @click="recargaForm"
                                title="Limpiar">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                        <div v-if="!dniValido" class="invalid-feedback d-block">DNI o NIE inválido.</div>
                    </div>
                </div>
            </div>

            <!-- Fecha de alta -->
            <div class="col-12 col-md-6">
                <div class="row align-items-center">
                    <label for="fecha_alta" class="col-12 col-md-3 form-label mb-0 text-md-start">Fecha de Alta</label>
                    <div class="col-12 col-md-8 col-xxl-5">
                        <input id="fecha_alta" type="date" v-model="nuevoCliente.fecha_alta" class="form-control" />
                    </div>
                </div>
            </div>

            <!-- Email -->
            <div class="col-12 col-md-6">
                <div class="row align-items-center">
                    <label for="email" class="col-12 col-md-3 form-label mb-0 text-md-start">Email</label>
                    <div class="col-12 col-md-8">
                        <input id="email" type="email" v-model="nuevoCliente.email" @blur="validarEmail"
                            :class="['form-control', { 'is-invalid': !emailValido }]" />
                    </div>
                </div>
            </div>

            <!-- Tipo de cliente -->
            <div class="col-12 col-md-6">
                <div class="row align-middle mt-2">
                    <label for="tipo" class="col-12 col-md-3 form-label mb-0 text-md-start">Categoría:</label>
                    <div class="col-12 col-md-9 m-0 pe-0">
                        <div class="input-group form-check-inline">
                            <div class="form-check ms-1">
                                <input type="radio" id="tipocliente" v-model="nuevoCliente.tipoCliente"
                                    class="form-check-input" value="user" />
                                <label for="tipocliente" class="form-check-label me-3">User</label>
                            </div>
                            <div class="form-check">
                                <input type="radio" id="tipocliente2" v-model="nuevoCliente.tipoCliente"
                                    class="form-check-input" value="company" />
                                <label for="tipocliente2" class="form-check-label">Company</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nombre -->
            <div class="col-12 col-md-6">
                <div class="row align-items-center">
                    <label for="nombre" class="col-12 col-md-3 form-label mb-0 text-md-start">Nombre</label>
                    <div class="col-12 col-md-8">
                        <input id="nombre" type="text" v-model="nuevoCliente.nombre" @blur="capitalizarTexto('nombre')"
                            class="form-control" required />
                    </div>
                </div>
            </div>

            <!-- Apellidos -->
            <div class="col-12 col-md-6">
                <div class="row align-items-center">
                    <label for="apellidos" class="col-12 col-md-3 form-label mb-0 text-md-start">Apellidos</label>
                    <div class="col-12 col-md-8">
                        <input id="apellidos" type="text" v-model="nuevoCliente.apellidos"
                            @blur="capitalizarTexto('apellidos')" class="form-control" required />
                    </div>
                </div>
            </div>

            <!-- Dirección -->
            <div class="col-12 col-md-6">
                <div class="row align-items-center">
                    <label for="direccion" class="col-12 col-md-3 form-label mb-0 text-md-start">Dirección</label>
                    <div class="col-12 col-md-8">
                        <input id="direccion" type="text" v-model="nuevoCliente.direccion" class="form-control" />
                    </div>
                </div>
            </div>

            <!-- Móvil -->
            <div class="col-12 col-md-6">
                <div class="row align-items-center">
                    <label for="movil" class="col-12 col-md-3 form-label mb-0 text-md-start">Móvil</label>
                    <div class="col-12 col-md-8 col-xxl-5">
                        <input id="movil" type="tel" v-model="nuevoCliente.movil" @blur="validarMovil"
                            :class="['form-control text-center', { 'is-invalid': !movilValido }]" />
                    </div>
                </div>
            </div>

            <!-- Provincia -->
            <div class="col-12 col-md-6">
                <div class="row align-items-center">
                    <label for="provincia" class="col-12 col-md-3 form-label mb-0 text-md-start">Provincia</label>
                    <div class="col-12 col-md-8">
                        <select id="provincia" v-model="nuevoCliente.provincia" @change="filtrarMunicipios"
                            class="form-select">
                            <option disabled value="">Seleccione provincia</option>
                            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">{{ prov.nm }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Municipio -->
            <div class="col-12 col-md-6">
                <div class="row align-items-center">
                    <label for="municipio" class="col-12 col-md-3 form-label mb-0 text-md-start">Municipio</label>
                    <div class="col-12 col-md-8">
                        <select id="municipio" v-model="nuevoCliente.municipio" class="form-select">
                            <option disabled value="">Seleccione municipio</option>
                            <option v-for="mun in municipiosFiltrados" :key="mun.id" :value="mun.nm">
                                {{ mun.nm }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Bloque Contraseña y Repetir Contraseña con labels a la izquierda -->
            <div class="row g-3 justify-content-center mt-2">
                <div class="col-md-3 d-flex align-items-center">
                    <label for="contrasena"
                        class="form-label mb-0 fw-medium text-nowrap me-2 align-middle">Contraseña:</label>
                    <input type="password" name="contrasena" id="contrasena" class="form-control"
                        v-model="nuevoCliente.password" required />
                </div>

                <div class="col-md-3 d-flex align-items-center ms-5">
                    <label for="repeat-contrasena"
                        class="form-label mb-0 fw-medium text-nowrap me-2 align-middle">Repetir
                        Contraseña:</label>
                    <input type="password" name="repeat-contrasena" id="repeat-contrasena" class="form-control"
                        @blur="validarPasswords" :class="{ 'is-invalid': !passwordsIguales }"
                        v-model="nuevoCliente.password2" required />
                </div>
            </div>


            <!-- Condiciones -->
            <div class="col-12 text-center">
                <div class="form-check d-inline-block">
                    <input id="condiciones" type="checkbox" v-model="nuevoCliente.lopd" class="form-check-input"
                        required />
                    <label class="form-check-label" for="condiciones">
                        Acepto los terminos y condiciones en
                        <router-link :to="{ path: '/aviso-legal' }" target="_blank" rel="noopener noreferrer"
                            class="text-primary">Aviso Legal</router-link>
                    </label>
                </div>
            </div>

            <!-- Botones -->
            <div class="col-12 position-relative d-flex justify-content-center align-items-center">
                <!-- Botón centrado -->
                <button type="submit" class="btn btn-primary">
                    {{ editando ? "Modificar Cliente" : "Guardar Cliente" }}
                </button>

                <!-- Switch posicionado a la derecha -->
                <div class="form-check form-switch position-absolute end-0">
                    <input id="historico" type="checkbox" v-model="mostrarHistorico" class="form-check-input"
                        @change="cargarClientes" />
                    <label for="historico" class="form-check-label ms-2">Histórico</label>
                </div>
            </div>
        </form>

        <!-- Lista de Clientes -->
        <div v-if="admin" class="table-responsive mt-4">
            <h4 class="text-center mb-3">Listado Clientes</h4>
            <table class="table table-bordered table-striped">
                <thead class="table-primary">
                    <tr>
                        <th class="text-center">ID</th>
                        <th class="text-center">Apellidos</th>
                        <th class="text-center">Nombre</th>
                        <th class="text-center">Móvil</th>
                        <th class="text-center">Municipio</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(cliente, index) in clientesPaginados" :key="cliente.id || index">
                        <th scope="row" class="text-center">{{ (currentPage - 1) * clientesPorPage + index + 1 }}</th>
                        <td>{{ cliente.apellidos }}</td>
                        <td>{{ cliente.nombre }}</td>
                        <td class="text-center">{{ cliente.movil }}</td>
                        <td class="text-center">{{ cliente.municipio }}</td>
                        <td class="text-center align-middle">
                            <button @click="eliminarCliente(cliente.movil)" class="btn btn-danger btn-sm me-1">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button @click="editarCliente(cliente.movil)" class="btn btn-warning btn-sm me-1">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button v-if="cliente.historico === false" @click="activarCliente(cliente)"
                                class="btn btn-secondary btn-sm">
                                <i class="bi bi-person-check"></i>
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
import { ref, onMounted, computed } from 'vue'
import { getClientes, addCliente, deleteCliente, updateCliente, getClientePorDni } from '@/api/clientes.js'
import { api } from '@/api/index.js'
import Swal from 'sweetalert2';
import bcrypt from "bcryptjs";
import { useAuth } from '@/composables/useAuth.js'

const { isAdmin } = useAuth()
const admin = computed(() => isAdmin.value)

// Variables para provincias (ahora se cargan desde API)
const provincias = ref([]);
const municipios = ref([]);
const municipiosFiltrados = ref([]);

const nuevoCliente = ref({
    dni: "",
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    direccion: "",
    provincia: "",
    municipio: "",
    fecha_alta: "",
    historico: true,
    lopd: false,
    tipoCliente: "user",
    password: "",
    password2: ""
});

// Variables reactivas
const passwordsIguales = ref(true);
const editando = ref(false);
const clienteEditandoId = ref(null);
const mostrarHistorico = ref(false);
const clientes = ref([])
const currentPage = ref(1);
const clientesPorPage = 10;

// Estados de validación
const dniValido = ref(true);
const movilValido = ref(true);
const emailValido = ref(true);

onMounted(async () => {
    // ✅ Cargar provincias desde API
    try {
        const response = await api.get('/provmuni');
        provincias.value = response.data.provincias || [];
        municipios.value = response.data.municipios || {};
    } catch (error) {
        console.error('Error al cargar provincias:', error);
        Swal.fire('Error', 'No se pudieron cargar las provincias', 'error');
    }

    // Cargar clientes
    await cargarClientes();
    currentPage.value = 1;
});

// Computed properties
const clientesPaginados = computed(() => {
    const start = (currentPage.value - 1) * clientesPorPage;
    const end = start + clientesPorPage;
    return clientes.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(clientes.value.length / clientesPorPage);
});

// ✅ FUNCIÓN CORREGIDA para filtrar municipios por código de provincia
const filtrarMunicipios = () => {
    console.log('🔍 Provincia seleccionada:', nuevoCliente.value.provincia);

    if (!nuevoCliente.value.provincia) {
        municipiosFiltrados.value = [];
        nuevoCliente.value.municipio = "";
        return;
    }

    // Buscar la provincia seleccionada para obtener su ID/código
    const provinciaSeleccionada = provincias.value.find(p => p.nm === nuevoCliente.value.provincia);

    if (!provinciaSeleccionada) {
        console.warn('⚠️ Provincia no encontrada:', nuevoCliente.value.provincia);
        municipiosFiltrados.value = [];
        return;
    }

    // Obtener código de provincia (ej: "01", "15", "46")
    const codigoProvincia = provinciaSeleccionada.id;

    // Filtrar municipios que empiecen con ese código
    // Ej: si provincia es "01" (Álava), buscar municipios "01001", "01002", etc.
    municipiosFiltrados.value = municipios.value.filter(m =>
        m.id.startsWith(codigoProvincia)
    );

    console.log(`🏙️ Encontrados ${municipiosFiltrados.value.length} municipios para ${nuevoCliente.value.provincia} (código: ${codigoProvincia})`);

    // Reset municipio seleccionado
    nuevoCliente.value.municipio = "";
};

// Resto de tus funciones actuales...
const cargarClientes = async () => {
    try {
        clientes.value = await getClientes();
    } catch (error) {
        console.error("Error al cargar los clientes:", error);
        Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    }
};

const guardarCliente = async () => {
    if (!passwordsIguales.value) {
        Swal.fire({
            icon: "error",
            title: "Las contraseñas deben coincidir",
            showConfirmButton: false,
            timer: 2000,
        });
        return;
    }

    if (nuevoCliente.value.fecha_alta.includes("/")) {
        nuevoCliente.value.fecha_alta = formatearFechaParaInput(
            nuevoCliente.value.fecha_alta
        );
    }

    // Validar duplicados solo si estás creando (no si editando)
    if (!editando.value) {
        const duplicado = clientes.value.find(
            (cliente) =>
                cliente.dni === nuevoCliente.value.dni ||
                cliente.movil === nuevoCliente.value.movil ||
                cliente.email === nuevoCliente.value.email
        );
        if (duplicado) {
            Swal.fire({
                icon: "error",
                title: "DNI, móvil o email duplicados",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
    }

    const result = await Swal.fire({
        title: editando.value ? '¿Desea modificar este cliente?' : '¿Desea grabar este cliente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: editando.value ? 'Modificar' : 'Grabar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(nuevoCliente.value.password, salt);
    nuevoCliente.value.password = hash;
    delete nuevoCliente.value.password2;

    try {
        if (editando.value) {
            const clienteActualizado = await updateCliente(clienteEditandoId.value, nuevoCliente.value);
            const index = clientes.value.findIndex(c => c.id === clienteEditandoId.value);
            if (index !== -1) clientes.value[index] = clienteActualizado;

            Swal.fire({
                icon: 'success',
                title: 'Cliente modificado',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            const clienteAgregado = await addCliente(nuevoCliente.value);
            clientes.value.push(clienteAgregado);

            Swal.fire({
                icon: 'success',
                title: 'Cliente agregado',
                showConfirmButton: false,
                timer: 1500
            });
        }

        // Reset formulario
        recargaForm();
        clientes.value = await getClientes(mostrarHistorico.value);

    } catch (error) {
        console.error('Error al guardar cliente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al guardar cliente',
            text: 'Inténtelo de nuevo o contacte con el administrador.',
            showConfirmButton: false,
            timer: 1500
        });
    }
};

function validarPasswords() {
    passwordsIguales.value = nuevoCliente.value.password === nuevoCliente.value.password2;
}

const eliminarCliente = async (movil) => {
    clientes.value = await getClientes(mostrarHistorico.value);
    const clienteAEliminar = clientes.value.find(cliente => cliente.movil === movil);

    if (!clienteAEliminar) {
        Swal.fire({
            icon: 'error',
            title: 'Cliente no encontrado',
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    if (!clienteAEliminar.historico) {
        Swal.fire({
            icon: "error",
            title: "Cliente ya dado de Baja",
            showConfirmButton: false,
            timer: 1500,
        });
        return;
    }

    const result = await Swal.fire({
        title: `¿Eliminar al cliente ${clienteAEliminar.nombre} ${clienteAEliminar.apellidos}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    await deleteCliente(clienteAEliminar.id);
    clientes.value = await getClientes(mostrarHistorico.value);

    Swal.fire({
        icon: 'success',
        title: 'Cliente eliminado',
        showConfirmButton: false,
        timer: 1500
    });
};

const editarCliente = (movil) => {
    const cliente = clientes.value.find((c) => c.movil === movil);
    if (!cliente) {
        Swal.fire({
            icon: "error",
            title: "Cliente no encontrado",
            showConfirmButton: false,
            timer: 1500,
        });
        return;
    }

    let fechaFormateada = cliente.fecha_alta;
    if (fechaFormateada && fechaFormateada.includes("/")) {
        fechaFormateada = formatearFechaParaInput(fechaFormateada);
    }

    nuevoCliente.value = { ...cliente, fecha_alta: fechaFormateada };
    nuevoCliente.value.lopd = cliente.lopd;
    nuevoCliente.value.password = "";
    nuevoCliente.value.password2 = "";
    editando.value = true;
    filtrarMunicipios();
    nuevoCliente.value.municipio = cliente.municipio;
    clienteEditandoId.value = cliente.id;
};

const activarCliente = async (cliente) => {
    const confirmacion = await Swal.fire({
        title: `¿Activar cliente ${cliente.nombre} ${cliente.apellidos}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Activar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    try {
        const clienteActivado = { ...cliente, historico: true };
        const actualizado = await updateCliente(cliente.id, clienteActivado);

        const index = clientes.value.findIndex(c => c.id === cliente.id);
        if (index !== -1) {
            clientes.value[index] = actualizado;
        }

        Swal.fire({
            icon: 'success',
            title: 'Cliente reactivado',
            showConfirmButton: false,
            timer: 1500
        });

        await cargarClientes();

    } catch (error) {
        console.error('Error al reactivar cliente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al activar cliente',
            text: 'Por favor, intenta de nuevo.',
            timer: 1500
        });
    }
};

const buscarClientePorDNI = async (dni) => {
    if (!dni || dni.trim() === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Debe introducir un DNI antes de buscar.',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    try {
        const cliente = await getClientePorDni(dni.trim().toUpperCase());

        if (!cliente) {
            Swal.fire({
                icon: 'info',
                title: 'Cliente no encontrado',
                text: 'No existe ningún cliente con ese DNI.',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        // Cargar datos del cliente encontrado
        nuevoCliente.value = { ...cliente };
        nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);
        nuevoCliente.value.lopd = cliente.lopd;
        nuevoCliente.value.password = "";
        nuevoCliente.value.password2 = "";
        editando.value = true;
        filtrarMunicipios();
        nuevoCliente.value.municipio = cliente.municipio;
        clienteEditandoId.value = cliente.id;

        Swal.fire({
            icon: 'success',
            title: 'Cliente encontrado y cargado',
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error buscando cliente por DNI:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al buscar cliente',
            text: 'Verifique la conexión o contacte con el administrador.',
            timer: 2000,
            showConfirmButton: false
        });
    }
};

// Validaciones
const validarDniNie = (valor) => {
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

    valor = valor.toUpperCase();

    if (dniRegex.test(valor)) {
        const numero = parseInt(valor.slice(0, 8), 10);
        const letra = valor.charAt(8);
        return letra === letras[numero % 23];
    } else if (nieRegex.test(valor)) {
        const nie = valor.replace('X', '0').replace('Y', '1').replace('Z', '2');
        const numero = parseInt(nie.slice(0, 8), 10);
        const letra = valor.charAt(8);
        return letra === letras[numero % 23];
    }
    return false;
};

const validarDni = () => {
    nuevoCliente.value.dni = nuevoCliente.value.dni.trim().toUpperCase();
    dniValido.value = validarDniNie(nuevoCliente.value.dni);
};

const capitalizarTexto = (campo) => {
    const texto = nuevoCliente.value[campo] ?? '';
    nuevoCliente.value[campo] = texto
        .toLowerCase()
        .split(' ')
        .map(palabra => {
            if (!palabra) return '';
            return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
        })
        .join(' ');
};

const movilRegex = /^[67]\d{8}$/;

const validarMovil = () => {
    const movil = nuevoCliente.value.movil.trim();

    if (movil === '') {
        movilValido.value = true;
        return true;
    }

    if (movil.charAt(0) === '6' || movil.charAt(0) === '7') {
        movilValido.value = movilRegex.test(movil);
        return movilValido.value;
    } else {
        movilValido.value = false;
        return false;
    }
};

const validarEmail = () => {
    const email = nuevoCliente.value.email.trim();
    if (email === '') {
        emailValido.value = true;
        return true;
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    emailValido.value = regex.test(email);
};

function formatearFechaParaInput(fecha) {
    if (!fecha) return '';

    if (fecha.includes('/')) {
        const [dd, mm, yyyy] = fecha.split('/');
        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }

    if (fecha.includes('-')) {
        const partes = fecha.split('-');
        if (partes.length === 3) return fecha;
    }

    return '';
}

function recargaForm() {
    nuevoCliente.value = {
        dni: '',
        nombre: '',
        apellidos: '',
        email: '',
        movil: '',
        direccion: '',
        provincia: '',
        municipio: '',
        fecha_alta: '',
        historico: true,
        lopd: false,
        tipoCliente: "",
        password: "",
        password2: "",
    };
    dniValido.value = true;
    movilValido.value = true;
    emailValido.value = true;
    municipiosFiltrados.value = [];
    editando.value = false;
    clienteEditandoId.value = null;
}
</script>

<style scoped>
input.form-control.text-center {
    text-align: center;
}

.gap-3 {
    gap: 0.75rem;
}
</style>
