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
          <label for="color" class="form-label mb-0 me-2 text-nowrap">Matricula:</label>
          <input type="text" id="matricula" @blur="todoTexto('matricula')" v-model="vehiculo.matricula"
            class="form-control rounded-0 shadow-none border">
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
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
          <label for="transmision" class="form-label mb-0 me-2 text-nowrap">Transmisión:</label>
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
        <div class="col-12 col-md-4 d-flex align-items-center me-2">
          <label for="provincia" class="form-label mb-0 me-2 text-nowrap">Provincia:</label>
          <select id="provincia" @change="filtrarMunicipios" v-model="vehiculo.ubicacion.provincia"
            class="form-select rounded-0 shadow-none border">
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">{{ prov.nm }}</option>
          </select>
        </div>

        <div class="col-12 col-md-4 d-flex align-items-center me-2">
          <label for="ciudad" class="form-label mb-0 me-2 text-nowrap">Ciudad:</label>
          <select id="ciudad" v-model="vehiculo.ubicacion.ciudad" class="form-select rounded-0 shadow-none border">
            <option disabled value="">Seleccione ciudad</option>
            <option v-for="mun in municipiosFiltrados" :key="mun.id" :value="mun.nm">{{ mun.nm }}</option>
          </select>
        </div>

        <div class="col-12 col-md-3 d-flex align-items-center">
          <label for="fecha_publicacion" class="form-label mb-0 me-2 text-nowrap">Fecha Publicación:</label>
          <input type="date" id="fecha_publicacion" v-model="vehiculo.fecha_publicacion"
            class="form-control text-center rounded-0 shadow-none border">
        </div>
      </div>

      <!-- FILA: Contacto -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 col-md-4 d-flex align-items-center me-2">
          <label for="contacto.nombre" class="form-label mb-0 me-2 text-nowrap">Nombre Contacto:</label>
          <input type="text" id="contacto.nombre" @blur="capitalizarNombreContacto" v-model="vehiculo.contacto.nombre"
            class="form-control rounded-0 shadow-none border">
        </div>
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label for="contacto.telefono" class="form-label text-end mb-0 me-2 text-nowrap">Teléfono:</label>
          <input type="tel" id="contacto.telefono" @blur="validarMovil()" v-model="vehiculo.contacto.telefono"
            class="form-control text-center rounded-0 shadow-none border">
        </div>
        <div class="col-12 col-md-4 d-flex align-items-center">
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
          <button type="button" @click="limpiarFormulario"
            class="btn btn-secondary rounded-0 border shadow-none px-4 py-2 ms-2">
            Limpiar
          </button>
          <button type="button" @click="imprimirPDF"
            class="btn btn-secondary rounded-0 border shadow-none px-4 py-2 ms-2"><i class="bi bi-printer"></i>Imprimir
          </button>
        </div>
      </div>
    </form>

    <!-- TABLA DE VEHÍCULOS -->
    <div class="table-responsive mt-4">
      <h5 class="text-center bg-primary-subtle py-1 mb-3"><i class="bi bi-list-ul me-2"></i>Listado de Vehículos</h5>
      <table class="table table-striped table-hover table-bordered">
        <thead class="table-primary">
          <tr>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Km</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coche in coches" :key="coche._id">
            <td>{{ coche.tipo }}</td>
            <td>{{ coche.marca }}</td>
            <td>{{ coche.modelo }}</td>
            <td>{{ coche.anio }}</td>
            <td>{{ coche.kilometros?.toLocaleString() }}</td>
            <td>{{ coche.precio?.toLocaleString() }} €</td>
            <td>
              <span :class="{
                'badge bg-success': coche.estado === 'disponible',
                'badge bg-warning': coche.estado === 'reservado',
                'badge bg-danger': coche.estado === 'vendido'
              }">
                {{ coche.estado }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" @click="editarVehiculo(coche)" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="eliminarVehiculo(coche._id)" title="Eliminar">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="coches.length === 0">
            <td colspan="8" class="text-center text-muted">No hay vehículos registrados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useNotifications } from "@/composables/useNotifications";
import { useProvincias } from "@/composables/useProvincias";
import { useValidaciones } from "@/composables/useValidaciones";
import { ref, onMounted } from "vue"
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getCoches, addCoche, deleteCoche, updateCoche } from "@/api/coches.js"

const { success, error } = useNotifications();
const { provincias, municipiosFiltrados, cargarProvincias, filtrarMunicipios: filtrarMunicipiosBase } = useProvincias();
const { capitalizar, mayusculas, esEmailValido, esMovilValido } = useValidaciones();

const coches = ref([]);

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

const editando = ref(false);
const cocheEditandoId = ref(null);
const archivo = ref(null);
const emailValido = ref(true);
const movilValido = ref(true);

onMounted(async () => {
  await cargarDatos();
});

const cargarDatos = async () => {
  try {
    await cargarProvincias();
    coches.value = await getCoches();
  } catch (err) {
    console.error('Error al cargar datos:', err);
    error('Error', 'No se pudieron cargar los datos necesarios');
  }
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    archivo.value = file;
  }
};

const filtrarMunicipios = () => {
  filtrarMunicipiosBase(vehiculo.value.ubicacion.provincia);
  vehiculo.value.ubicacion.ciudad = "";
};

const guardarVehiculo = async () => {
  try {
    const cocheData = {
      tipo: vehiculo.value.tipo,
      matricula: vehiculo.value.matricula,
      marca: vehiculo.value.marca,
      modelo: vehiculo.value.modelo,
      anio: parseInt(vehiculo.value.anio),
      estado: vehiculo.value.estado,
      kilometros: parseInt(vehiculo.value.kilometros),
      precio: parseInt(vehiculo.value.precio),
      combustible: vehiculo.value.combustible,
      transmision: vehiculo.value.transmision,
      potencia_cv: parseInt(vehiculo.value.potencia_cv),
      descripcion: vehiculo.value.descripcion,
      ubicacion: vehiculo.value.ubicacion,
      contacto: vehiculo.value.contacto,
      fecha_publicacion: vehiculo.value.fecha_publicacion || new Date().toISOString()
    };

    if (editando.value) {
      // Pasar archivo.value como segundo parámetro (imagen)
      await updateCoche(cocheEditandoId.value, cocheData, archivo.value);
      success("Vehículo actualizado", "El vehículo ha sido actualizado correctamente.");
    } else {
      // Pasar archivo.value como segundo parámetro (imagen)
      await addCoche(cocheData, archivo.value);
      success("Vehículo guardado", "El vehículo ha sido guardado correctamente.");
    }

    // Recargar lista y limpiar formulario
    await cargarDatos();
    limpiarFormulario();

  } catch (err) {
    console.error("Error al guardar:", err);
    error("Error", "Error al guardar el vehículo. Por favor, inténtalo de nuevo.");
  }
};

const editarVehiculo = (coche) => {
  editando.value = true;
  cocheEditandoId.value = coche._id;

  vehiculo.value = {
    tipo: coche.tipo || "",
    matricula: coche.matricula || "",
    marca: coche.marca || "",
    modelo: coche.modelo || "",
    anio: coche.anio?.toString() || "",
    estado: coche.estado || "disponible",
    kilometros: coche.kilometros?.toString() || "",
    precio: coche.precio?.toString() || "",
    combustible: coche.combustible || "",
    transmision: coche.transmision || "",
    potencia_cv: coche.potencia_cv?.toString() || "",
    descripcion: coche.descripcion || "",
    ubicacion: coche.ubicacion || { provincia: "", ciudad: "" },
    contacto: coche.contacto || { nombre: "", telefono: "", email: "" },
    fecha_publicacion: coche.fecha_publicacion?.split('T')[0] || ""
  };

  // Filtrar municipios si hay provincia
  if (vehiculo.value.ubicacion.provincia) {
    // Cargar municipios de la provincia y mantener la ciudad existente
    filtrarMunicipiosBase(vehiculo.value.ubicacion.provincia);
    vehiculo.value.ubicacion.ciudad = coche.ubicacion?.ciudad || vehiculo.value.ubicacion.ciudad || "";
  }
};

const eliminarVehiculo = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) return;

  try {
    await deleteCoche(id);
    success("Vehículo eliminado", "El vehículo ha sido eliminado correctamente.");
    await cargarDatos();
  } catch (err) {
    console.error("Error al eliminar:", err);
    error("Error", "Error al eliminar el vehículo.");
  }
};

const limpiarFormulario = () => {
  editando.value = false;
  cocheEditandoId.value = null;
  archivo.value = null;

  const inputFile = document.getElementById('foto');
  if (inputFile) {
    inputFile.value = '';
  }

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
  municipiosFiltrados.value = [];
};

const todoTexto = (campo) => {
  vehiculo.value[campo] = mayusculas(vehiculo.value[campo]);
};

const capitalizarTexto = (campo) => {
  vehiculo.value[campo] = capitalizar(vehiculo.value[campo]);
};

const capitalizarNombreContacto = () => {
  vehiculo.value.contacto.nombre = capitalizar(vehiculo.value.contacto.nombre);
};

const validarEmail = () => {
  emailValido.value = esEmailValido(vehiculo.value.contacto.email);
  if (!emailValido.value) {
    error("Email invalido", "Por favor, introduce un email válido");
  }
  return emailValido.value;
};

const validarMovil = () => {
  movilValido.value = esMovilValido(vehiculo.value.contacto.telefono);
  if (!movilValido.value && vehiculo.value.contacto.telefono?.trim()) {
    error('Móvil inválido', 'El número de móvil debe tener 9 dígitos y comenzar con 6 o 7.');
  }
  return movilValido.value;
};

const imprimirPDF = () => {

  const doc = new jsPDF();

  if (typeof autoTable === 'function') {
    console.log('autoTable (función) está disponible');
  } else {
    console.error('autoTable no está disponible como función');
  }

  doc.setFontSize(18);
  doc.text("Listado de Vehículos", 14, 20);

  let y = 30;
  doc.setFontSize(12);

  // Definir los encabezados de la tabla
  const headers = ["Matrícula", "Marca", "Modelo", "Estado", "Combustible", "Precio"];
  // Añadir encabezados y en el body van los campos que hemos elegido no hace consultas sino que los obtiene del template
  // el principio del componente.
  // podríamos hacer consultas pero será algo que dejaremos para la factura aunque prefiero siempre tenerlos cargados desde
  try {
    autoTable(doc, {
      starty: y,
      head: [headers],
      body: coches.value.map(coche => [
        coche.matricula,
        coche.marca,
        coche.modelo,
        coche.estado,
        coche.combustible,
        coche.precio
      ]),
      theme: "striped", // Aplicar tema de rayas a la tabla
      styles: { fontSize: 10, cellPadding: 3 }
    });
  } catch (err) {
    console.error('Error generando autoTable:', err);
    error('Error PDF', 'No se pudo generar la tabla en el PDF.');
    return;
  }

  doc.save('listado_vehiculos.pdf');
}
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