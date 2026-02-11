import { api } from "./index.js";

// Enviar mensaje de contacto
export const enviarMensajeContacto = async (formData) => {
    const response = await api.post("/contacto/enviar", formData);
    return response.data;
};
