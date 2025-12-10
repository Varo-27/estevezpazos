<template>
  <div class="container-fluid my-3 p-2 border rounded-0 shadow-sm bg-light">
    <h5 class="text-center bg-primary-subtle ms-1 py-1"><i class="bi bi-car-front me-2"></i>Registro de Vehículos </h5>
    <form @submit.prevent="guardarVehiculo" class="mb-2 mt-1 ms-1">
      <!-- FILA: Tipo, Marca, Modelo -->
      <div class="row g-3 align-items-center mt-1">
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label class="form-label mb-0 me-2 text-nowrap">Tipo:</label>
          <div class="d-flex align-items-center">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="tipo-coche" value="coche" v-model="vehiculo.tipo">
              <label class="form-check-label" for="tipo-coche">Coche</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="tipo-furgoneta" value="furgoneta"
                v-model="vehiculo.tipo">
              <label class="form-check-label" for="tipo-furgoneta">Furgoneta</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="tipo-moto" value="moto" v-model="vehiculo.tipo">
              <label class="form-check-label" for="tipo-moto">Moto</label>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="color" class="form-label mb-0 me-2 text-nowrap ms-2">Matricula:</label>
          <input type="text" id="matricula" @blur="todoTexto('matricula')" v-model="vehiculo.matricula"
            class="form-control rounded-0 shadow-none border">
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center ms-2">
          <label for="marca" class="form-label mb-0 me-2 text-nowrap">Marca:</label>
          <input type="text" id="marca" @blur="capitalizarTexto('marca')" v-model="vehiculo.marca"
            class="form-control rounded-0 shadow-none border" required>
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="modelo" class="form-label mb-0 me-2 text-nowrap">Modelo:</label>
          <input type="text" id="modelo" @blur="capitalizarTexto('modelo')" v-model="vehiculo.modelo"
            class="form-control rounded-0 shadow-none border" required>
        </div>
        <div class="col-12 col-md-1 d-flex align-items-center">
          <label for="anio" class="form-label mb-0 me-1 text-nowrap text-end">Año:</label>
          <input type="text" id="anio" v-model="vehiculo.anio"
            class="form-control text-center rounded-0 shadow-none border" required>
        </div>
        <div class="col-12 col-md-1 d-flex align-items-center">
          <label class="form-label mb-0 me-2 text-nowrap">Estado:</label>
          <select v-model="vehiculo.estado" class="form-select d-inline-block w-auto rounded-0 shadow-none border">
            <option value="disponible">Disponible</option>
            <option value="vendido">Vendido</option>
            <option value="reservado">Reservado</option>
          </select>
        </div>
      </div>

      <!-- FILA: Año, Kilómetros, Precio -->
      <div class="row g-3 align-items-center mt-2">
        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="kilometros" class="form-label mb-0 me-2 text-nowrap">Kilómetros:</label>
          <input type="text" id="kilometros" v-model="vehiculo.kilometros"
            class="form-control text-end rounded-0 shadow-none border" required>
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="precio" class="form-label mb-0 me-2 text-nowrap">Precio (€):</label>
          <input type="text" id="precio" v-model="vehiculo.precio"
            class="form-control text-end rounded-0 shadow-none border" required>
        </div>

        <div class="col-12 col-md-3 d-flex align-items-center">
          <label for="combustible" class="form-label mb-0 me-2 text-nowrap">Combustible:</label>
          <select id="combustible" v-model="vehiculo.combustible" class="form-select rounded-0 shadow-none border">
            <option disabled value="">Seleccione</option>
            <option>Gasolina</option>
            <option>Diésel</option>
            <option>Híbrido</option>
            <option>GLP</option>
            <option>Eléctrico</option>
          </select>
        </div>
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label for="transmision" class="form-label mb-0 ms-2 me-2 text-nowrap">Transmisión:</label>
          <div class="d-flex align-items-center">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="tipo-automatica" value="automatica"
                v-model="vehiculo.transmision">
              <label class="form-check-label" for="tipo-automatica">Automatica</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="tipo-manual" value="manual"
                v-model="vehiculo.transmision">
              <label class="form-check-label" for="tipo-manual">Manual</label>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="potencia" class="form-label mb-0 me-2 text-nowrap">Potencia (CV):</label>
          <input type="text" id="potencia" v-model="vehiculo.potencia_cv"
            class="form-control rounded-0 me-2 shadow-none border text-end" required>
        </div>
      </div>

      <!-- FILA: Descripción -->
      <div class="row g-2 mt-2">
        <div class="col">
          <label for="descripcion" class="form-label mb-0 me-3 text-nowrap">Descripción:</label>
          <textarea id="descripcion" v-model="vehiculo.descripcion" rows="3"
            class="form-control rounded-0 shadow-none border mt-2 mb-4"
            placeholder="Describe el estado, potencia, color, revisiones, etc."></textarea>
        </div>
      </div>

      <!-- FILA: Imagen del vehículo -->
      <div class="row g-3 align-items-center mb-3">
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label for="foto" class="form-label mb-0 me-2 text-nowrap">Imagen del vehículo:</label>
          <input type="file" id="foto" accept="image/*" @change="onFileChange"
            class="form-control-file col-md-10 border rounded-0 shadow-none btn-file-azul">
        </div>
      </div>

      <h5 class="text-center bg-primary-subtle py-1"><i class="bi bi-person me-2"></i>Cliente Ubicación</h5>

      <!-- FILA: Ubicación -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label for="provincia" class="form-label mb-0 me-2 text-nowrap">Provincia:</label>
          <select id="provincia" @change="filtrarMunicipios" v-model="vehiculo.ubicacion.provincia"
            class="form-select rounded-0 shadow-none border">
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">{{ prov.nm }}</option>
          </select>
        </div>

        <div class="col-12 col-md-4 ms-4 d-flex align-items-center">
          <label for="ciudad" class="form-label mb-0 me-2 text-nowrap">Ciudad:</label>
          <select id="ciudad" v-model="vehiculo.ubicacion.ciudad" class="form-select rounded-0 shadow-none border">
            <option disabled value="">Seleccione ciudad</option>
            <option v-for="mun in municipiosFiltrados" :key="mun.id" :value="mun.nm">{{ mun.nm }}</option>
          </select>
        </div>

        <div class="col-12 col-md-3 ms-4 d-flex align-items-center">
          <label for="fecha_publicacion" class="form-label mb-0 me-2 text-nowrap">Fecha Publicación:</label>
          <input type="date" id="fecha_publicacion" v-model="vehiculo.fecha_publicacion"
            class="form-control text-center rounded-0 shadow-none border">
        </div>
      </div>

      <!-- FILA: Contacto -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 col-md-4 d-flex align-items-center">
          <label for="contacto.nombre" class="form-label mb-0 me-2 text-nowrap">Nombre Contacto:</label>
          <input type="text" id="contacto.nombre" @blur="capitalizarNombreContacto" v-model="vehiculo.contacto.nombre"
            class="form-control rounded-0 shadow-none border">
        </div>
        <div class="col-12 col-md-2 ms-4 d-flex align-items-center">
          <label for="contacto.telefono" class="form-label text-end mb-0 me-2 text-nowrap">Teléfono:</label>
          <input type="tel" id="contacto.telefono" @blur="validarMovil()" v-model="vehiculo.contacto.telefono"
            class="form-control text-center rounded-0 shadow-none border">
        </div>
        <div class="col-12 col-md-4 d-flex ms-4 align-items-center">
          <label for="contacto.email" class="form-label mb-0 me-2 text-nowrap">Email:</label>
          <input type="email" id="contacto.email" @blur="validarEmail()" v-model="vehiculo.contacto.email"
            class="form-control rounded-0 shadow-none border">
        </div>
      </div>

      <!-- FILA: Estado y botón -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 d-flex justify-content-center align-items-center">
          <button type="submit" class="btn btn-primary rounded-0 border shadow-none px-4 py-2">
            {{ editando ? 'Modificar' : 'Guardar' }}
          </button>
          <button type="button" class="btn btn-danger rounded-0 border shadow-none px-4 py-2 ms-2">
            Eliminar
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useNotifications } from "@/composables/useNotifications";
import { ref, onMounted } from "vue"
import { addArticulo } from "@/api/articulos.js"
import { api } from '@/api/index.js'

const { success, error } = useNotifications();

// ✅ Variables de datos - UNA SOLA DECLARACIÓN
const provincias = ref([]);
const municipios = ref([]);
const municipiosFiltrados = ref([]);
const coches = ref([]);

// ✅ Variables del formulario
const vehiculo = ref({
  tipo: "",
  matricula: "",
  marca: "",
  modelo: "",
  anio: "",
  estado: "disponible",
  kilometros: "",
  precio: "",
  combustible: "",
  transmision: "",
  potencia_cv: "",
  descripcion: "",
  ubicacion: {
    provincia: "",
    ciudad: ""
  },
  contacto: {
    nombre: "",
    telefono: "",
    email: ""
  },
  fecha_publicacion: ""
});

// ✅ Variables de estado
const editando = ref(false);
const archivo = ref(null);
const emailValido = ref(true);
const movilValido = ref(true);

// ✅ UNA SOLA función onMounted
onMounted(async () => {
  try {
    // Cargar provincias desde API
    const provmuniResponse = await api.get('/provmuni');
    provincias.value = provmuniResponse.data.provincias || [];
    municipios.value = provmuniResponse.data.municipios || {};

    // Cargar coches desde API
    const cochesResponse = await api.get('/coches');
    coches.value = cochesResponse.data || [];
  } catch (error) {
    console.error('Error al cargar datos:', error);
    error('No se pudieron cargar los datos necesarios');
  }
});

// ✅ Función para manejar cambio de archivo
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    archivo.value = file;
  }
};

// ✅ FUNCIÓN CORREGIDA para ModeLos
const filtrarMunicipios = () => {
  console.log('🔍 Filtrando municipios para:', vehiculo.value.ubicacion.provincia);

  if (!vehiculo.value.ubicacion.provincia) {
    municipiosFiltrados.value = [];
    vehiculo.value.ubicacion.ciudad = "";
    return;
  }

  // Buscar provincia seleccionada
  const provinciaSeleccionada = provincias.value.find(p => p.nm === vehiculo.value.ubicacion.provincia);

  if (!provinciaSeleccionada) {
    console.warn('⚠️ Provincia no encontrada:', vehiculo.value.ubicacion.provincia);
    municipiosFiltrados.value = [];
    return;
  }

  // Filtrar municipios por código de provincia
  const codigoProvincia = provinciaSeleccionada.id;
  municipiosFiltrados.value = municipios.value.filter(m =>
    m.id.startsWith(codigoProvincia)
  );

  console.log(`🏙️ Encontrados ${municipiosFiltrados.value.length} municipios para código ${codigoProvincia}`);

  // Reset ciudad
  vehiculo.value.ubicacion.ciudad = "";
};

// ✅ Función para guardar vehículo
const guardarVehiculo = async () => {
  try {
    const formData = new FormData();

    if (archivo.value) {
      formData.append("imagen", archivo.value);
    }

    formData.append("vehiculo", JSON.stringify(vehiculo.value));

    const nuevo = await addArticulo(formData);

    if (nuevo && nuevo._id) {
      success("Vehículo guardado", "El vehículo ha sido guardado correctamente.")

      // Limpiar formulario
      Object.assign(vehiculo.value, {
        tipo: "",
        matricula: "",
        marca: "",
        modelo: "",
        anio: "",
        estado: "disponible",
        kilometros: "",
        precio: "",
        combustible: "",
        transmision: "",
        potencia_cv: "",
        descripcion: "",
        ubicacion: { provincia: "", ciudad: "" },
        contacto: { nombre: "", telefono: "", email: "" },
        fecha_publicacion: ""
      });
      archivo.value = null;
    } else {
      throw new Error('No se recibió respuesta válida del servidor');
    }
  } catch (error) {
    console.error("Error al guardar:", error);
    error("Error al guardar el vehículo", "Por favor, inténtalo de nuevo.")
  }
};

// ✅ Funciones auxiliares
const todoTexto = (campo) => {
  const texto = vehiculo.value[campo] ?? '';
  vehiculo.value[campo] = texto.toUpperCase();
};

const capitalizarTexto = (campo) => {
  const texto = vehiculo.value[campo] ?? '';
  vehiculo.value[campo] = texto
    .toLowerCase()
    .split(' ')
    .map(palabra => {
      if (!palabra) return '';
      return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
    })
    .join(' ');
};

const capitalizarNombreContacto = () => {
  const nombre = vehiculo.value.contacto.nombre ?? '';
  vehiculo.value.contacto.nombre = nombre
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra ? palabra.charAt(0).toUpperCase() + palabra.slice(1) : '')
    .join(' ');
};

const validarEmail = () => {
  const email = vehiculo.value.contacto.email || '';
  if (email === '') {
    emailValido.value = true;
    return true;
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  emailValido.value = regex.test(email);

  if (!emailValido.value) {
    error("Email invalido", "Por favor, introduce un email válido")
  }
  return emailValido.value;
};

const validarMovil = () => {
  const movil = vehiculo.value.contacto.telefono?.trim() || '';
  if (movil === '') {
    movilValido.value = true;
    return true;
  }

  const movilRegex = /^[67]\d{8}$/;

  if (movil.charAt(0) === '6' || movil.charAt(0) === '7') {
    movilValido.value = movilRegex.test(movil);
    if (movilValido.value) {
      return true;
    } else {
      error('Móvil inválido', 'El número de móvil debe tener 9 dígitos.')
      return false;
    }
  } else {
    movilValido.value = false;
    error('Móvil inválido', 'El número de móvil debe comenzar con 6 o 7.')
    return false;
  }
};
</script>

<style>
.btn-file-azul::file-selector-button {
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>