import { ref } from "vue";
import { api } from "@/api/index.js";

const provincias = ref([]);
const municipios = ref([]);
const cargado = ref(false);

export function useProvincias() {
    const municipiosFiltrados = ref([]);

    const cargarProvincias = async () => {
        if (cargado.value) return true;

        try {
            const response = await api.get("/provmuni");
            provincias.value = response.data.provincias || [];
            municipios.value = response.data.municipios || {};
            cargado.value = true;
            return true;
        } catch (err) {
            console.error("Error al cargar provincias:", err);
            return false;
        }
    };

    const filtrarMunicipios = (provinciaNombre) => {
        if (!provinciaNombre) {
            municipiosFiltrados.value = [];
            return "";
        }

        const provinciaSeleccionada = provincias.value.find(
            (p) => p.nm === provinciaNombre
        );

        if (!provinciaSeleccionada) {
            municipiosFiltrados.value = [];
            return "";
        }

        const codigoProvincia = provinciaSeleccionada.id;
        municipiosFiltrados.value = municipios.value.filter((m) =>
            m.id.startsWith(codigoProvincia)
        );

        return "";
    };

    return {
        provincias,
        municipios,
        municipiosFiltrados,
        cargarProvincias,
        filtrarMunicipios,
    };
}
