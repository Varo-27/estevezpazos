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
                            <button v-if="isAdmin" type="button" class="btn btn-outline-primary"
                                @click="buscarClientePorDNI(nuevoCliente.dni)" title="Buscar">
                                <i class="bi bi-search"></i>
                            </button>
                            <button v-if="isAdmin" type="button" class="btn btn-outline-secondary" @click="recargaForm"
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

            <!-- Bloque Contraseña y Repetir Contraseña -->
            <div class="row g-3 justify-content-center mt-2">
                <div class="col-md-3 d-flex align-items-center">
                    <label for="contrasena" class="form-label mb-0 fw-medium text-nowrap me-2 align-middle">
                        Contraseña{{ editando ? ' (opcional)' : '' }}:
                    </label>
                    <input type="password" name="contrasena" id="contrasena" class="form-control"
                        v-model="nuevoCliente.password" :required="!editando" />
                </div>

                <div class="col-md-3 d-flex align-items-center ms-5">
                    <label for="repeat-contrasena" class="form-label mb-0 fw-medium text-nowrap me-2 align-middle">
                        Repetir Contraseña{{ editando ? ' (opcional)' : '' }}:
                    </label>
                    <input type="password" name="repeat-contrasena" id="repeat-contrasena" class="form-control"
                        @blur="validarPasswords"
                        :class="{ 'is-invalid': !passwordsIguales && nuevoCliente.password !== '' }"
                        v-model="nuevoCliente.password2" :required="!editando" />
                </div>

                <small v-if="editando" class="text-muted text-center w-100">
                    Deja los campos vacíos para mantener la contraseña actual
                </small>
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
        <div v-if="isAdmin" class="table-responsive mt-4">
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
                        <th scope="row" class="text-center">{{ (currentPage - 1) * itemsPorPage + index + 1 }}</th>
                        <td>{{ cliente.apellidos }}</td>
                        <td>{{ cliente.nombre }}</td>
                        <td class="text-center">{{ cliente.movil }}</td>
                        <td class="text-center">{{ cliente.municipio }}</td>
                        <td class="text-center align-middle">
                            <button v-if="cliente.historico === true" @click="eliminarCliente(cliente.movil)"
                                class="btn btn-danger btn-sm me-1">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button v-if="cliente.historico === false" @click="activarCliente(cliente)"
                                class="btn btn-secondary  btn-sm me-1">
                                <i class="bi bi-person-check"></i>
                            </button>
                            <button @click="editarCliente(cliente.movil)" class="btn btn-warning btn-sm me-1">
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
            <span class="mx-3 align-self-center text-muted">Página {{ currentPage }} de {{ totalPages }}</span>
            <button class="btn btn-outline-primary btn-sm" @click="nextPagina(totalPages)"
                :disabled="currentPage >= totalPages">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getClientes, addCliente, deleteCliente, updateCliente, getClientePorDni } from '@/api/clientes.js'
import { api } from '@/api/index.js'
import bcrypt from "bcryptjs";
import { useAuth } from '@/composables/useAuth.js'
import { useProvincias } from '@/composables/useProvincias.js'
import { useNotifications } from '@/composables/useNotifications.js'
import { useValidaciones } from '@/composables/useValidaciones.js'
import { usePaginacion } from '@/composables/usePaginacion.js'

const { success, error, warning, confirmDelete, confirmSave, confirmActivate } = useNotifications();
const { provincias, municipiosFiltrados, cargarProvincias, filtrarMunicipios: filtrarMunicipiosBase } = useProvincias();
const { capitalizar, mayusculas, esEmailValido, esMovilValido, esDniNieValido, formatearFechaInput } = useValidaciones();
const { currentPage, itemsPorPage, crearItemsPaginados, crearTotalPages, nextPagina, beforePagina, resetPagina } = usePaginacion(10);
const { isAdmin } = useAuth()

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

// Estados de validación
const dniValido = ref(true);
const movilValido = ref(true);
const emailValido = ref(true);

// Paginación
const clientesPaginados = crearItemsPaginados(clientes);
const totalPages = crearTotalPages(clientes);

onMounted(async () => {
    const cargado = await cargarProvincias();
    if (!cargado) {
        error('Error', 'No se pudieron cargar las provincias');
    }
    await cargarClientes();
    // Si el usuario NO es admin, cargar sus datos en el formulario
    try {
        if (!isAdmin.value) {
            const resp = await api.get('/auth/verify');
            if (resp.data && resp.data.valid && resp.data.user?.dni) {
                const dni = resp.data.user.dni;
                try {
                    const cliente = await getClientePorDni(dni);
                    if (cliente) {
                        let fechaFormateada = cliente.fecha_alta || '';
                        if (fechaFormateada && fechaFormateada.includes('/')) {
                            fechaFormateada = formatearFechaInput(fechaFormateada);
                        }

                        nuevoCliente.value = { ...cliente, fecha_alta: fechaFormateada };
                        nuevoCliente.value.lopd = cliente.lopd;
                        nuevoCliente.value.password = '';
                        nuevoCliente.value.password2 = '';
                        editando.value = true;
                        filtrarMunicipios();
                        nuevoCliente.value.municipio = cliente.municipio;
                        clienteEditandoId.value = cliente.id;
                    }
                } catch (err) {
                    console.error('Error al obtener cliente por DNI:', err);
                }
            }
        }
    } catch (err) {
        // Silencioso si no hay token o falla la verificación
        console.error('Verificación de usuario fallida:', err);
    }
    resetPagina();
});

const filtrarMunicipios = () => {
    filtrarMunicipiosBase(nuevoCliente.value.provincia);
    nuevoCliente.value.municipio = "";
};

// Resto de tus funciones actuales...
const cargarClientes = async () => {
    try {
        const todosClientes = await getClientes(mostrarHistorico.value);

        // Filtrar clientes que tengan datos válidos
        clientes.value = todosClientes.filter(c => c.dni && c.nombre);

        resetPagina();

    } catch (err) {
        console.error("Error al cargar los clientes:", err);
    }
};

function validarPasswords() {
    // Si ambos campos están vacíos (editando sin cambiar contraseña), es válido
    if (nuevoCliente.value.password === '' && nuevoCliente.value.password2 === '') {
        passwordsIguales.value = true;
        return;
    }
    passwordsIguales.value = nuevoCliente.value.password === nuevoCliente.value.password2;
}

const guardarCliente = async () => {
    // Validar contraseñas
    if (!editando.value) {
        // Creando: contraseña obligatoria
        if (!nuevoCliente.value.password) {
            error("Error", "La contraseña es obligatoria");
            return;
        }
        if (!passwordsIguales.value) {
            error("Error", "Las contraseñas deben coincidir");
            return;
        }
    } else {
        // Editando: si puso contraseña, deben coincidir
        if (nuevoCliente.value.password !== '' && !passwordsIguales.value) {
            error("Error", "Las contraseñas deben coincidir");
            return;
        }
    }

    if (nuevoCliente.value.fecha_alta.includes("/")) {
        nuevoCliente.value.fecha_alta = formatearFechaInput(
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
            error("Error", "DNI, móvil o email duplicados");
            return;
        }
    }

    const result = await confirmSave(editando.value);

    if (!result.isConfirmed) return;

    // Preparar cliente para guardar
    const clienteAGuardar = { ...nuevoCliente.value };
    delete clienteAGuardar.password2;

    // Hashear contraseña solo si se proporcionó una nueva
    if (clienteAGuardar.password && clienteAGuardar.password !== '') {
        const salt = bcrypt.genSaltSync(10);
        clienteAGuardar.password = bcrypt.hashSync(clienteAGuardar.password, salt);
    } else {
        // Si no hay contraseña nueva, eliminar el campo para no sobrescribir
        delete clienteAGuardar.password;
    }

    try {
        if (editando.value) {
            const clienteActualizado = await updateCliente(clienteEditandoId.value, clienteAGuardar);
            const index = clientes.value.findIndex(c => c.id === clienteEditandoId.value);
            if (index !== -1) clientes.value[index] = clienteActualizado;
            success('Cliente modificado');
        } else {
            const clienteAgregado = await addCliente(clienteAGuardar);
            clientes.value.push(clienteAgregado);
            success('Cliente agregado');
        }

        // Reset formulario
        recargaForm();
        clientes.value = await getClientes(mostrarHistorico.value);

    } catch (err) {
        console.error('Error al guardar cliente:', err);
        error('Error al guardar cliente', 'Inténtelo de nuevo o contacte con el administrador.');
    }
};

const eliminarCliente = async (movil) => {
    clientes.value = await getClientes(mostrarHistorico.value);
    const clienteAEliminar = clientes.value.find(cliente => cliente.movil === movil);

    if (!clienteAEliminar) {
        error('Cliente no encontrado');
        return;
    }

    if (!clienteAEliminar.historico) {
        error("Cliente ya dado de Baja")
        return;
    }

    const result = await confirmDelete(`${clienteAEliminar.nombre} ${clienteAEliminar.apellidos}?`)

    if (!result.isConfirmed) return;

    await deleteCliente(clienteAEliminar.id);
    clientes.value = await getClientes(mostrarHistorico.value);
    success('Cliente eliminado');
};

const editarCliente = (movil) => {
    const cliente = clientes.value.find((c) => c.movil === movil);
    if (!cliente) {
        error("Cliente no encontrado");
        return;
    }

    let fechaFormateada = cliente.fecha_alta;
    if (fechaFormateada && fechaFormateada.includes("/")) {
        fechaFormateada = formatearFechaInput(fechaFormateada);
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
    const confirmacion = await confirmActivate(`${cliente.nombre} ${cliente.apellidos}`);

    if (!confirmacion.isConfirmed) return;

    try {
        const clienteActivado = { ...cliente, historico: true };
        const actualizado = await updateCliente(cliente.id, clienteActivado);

        const index = clientes.value.findIndex(c => c.id === cliente.id);
        if (index !== -1) {
            clientes.value[index] = actualizado;
        }
        success('Cliente reactivado');

        await cargarClientes();

    } catch (error) {
        console.error('Error al reactivar cliente:', error);
        error('Error al activar cliente', 'Por favor, intenta de nuevo.');
    }
};

const buscarClientePorDNI = async (dni) => {
    if (!dni || dni.trim() === '') {
        warning('Debe introducir un DNI antes de buscar.');
        return;
    }

    try {
        const cliente = await getClientePorDni(dni.trim().toUpperCase());

        // Si llega aquí, el cliente SÍ existe
        nuevoCliente.value = { ...cliente };
        nuevoCliente.value.fecha_alta = formatearFechaInput(cliente.fecha_alta);
        nuevoCliente.value.lopd = cliente.lopd;
        nuevoCliente.value.password = "";
        nuevoCliente.value.password2 = "";
        editando.value = true;
        filtrarMunicipios();
        nuevoCliente.value.municipio = cliente.municipio;
        clienteEditandoId.value = cliente.id;

        success('Cliente encontrado y cargado');

    } catch (err) {
        console.error('Error buscando cliente por DNI:', err);

        // Verificar si es un error 404 (no encontrado)
        if (err.response && err.response.status === 404) {
            warning('Cliente no encontrado', 'No existe ningún cliente con ese DNI.');
        } else {
            // Otro tipo de error (servidor, red, etc.)
            error('Error al buscar cliente', 'Verifique la conexión o contacte con el administrador.');
        }
    }
};

// Validaciones usando composable
const validarDni = () => {
    nuevoCliente.value.dni = mayusculas(nuevoCliente.value.dni.trim());
    dniValido.value = esDniNieValido(nuevoCliente.value.dni);
};

const capitalizarTexto = (campo) => {
    nuevoCliente.value[campo] = capitalizar(nuevoCliente.value[campo]);
};

const validarMovil = () => {
    movilValido.value = esMovilValido(nuevoCliente.value.movil);
    return movilValido.value;
};

const validarEmail = () => {
    emailValido.value = esEmailValido(nuevoCliente.value.email);
};

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
