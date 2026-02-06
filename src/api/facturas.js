import { api } from "./index.js";

// Obtener todas las facturas
export const getFacturas = async () => {
    const response = await api.get("/facturas");
    return response.data;
};

// Obtener factura por ID
export const getFactura = async (id) => {
    const response = await api.get(`/facturas/${id}`);
    return response.data;
};

// Crear nueva factura
export const addFactura = async (factura) => {
    const response = await api.post("/facturas", factura);
    return response.data;
};

// Obtener facturas por nombre de usuario
export const getFacturasByUsuario = async (nombreUsuario) => {
    const response = await api.get(`/facturas/usuario/${nombreUsuario}`);
    return response.data;
};
