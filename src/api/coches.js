import { api } from "./index.js";

// Obtener todos los coches
export const getCoches = async () => {
    const response = await api.get("/coches");
    return response.data;
};

// Obtener coche por ID
export const getCoche = async (id) => {
    const response = await api.get(`/coches/${id}`);
    return response.data;
};

// Crear nuevo coche con imagen
export const addCoche = async (coche, imagen = null) => {
    const formData = new FormData();

    // Añadir los datos del coche como JSON string
    formData.append("cocheData", JSON.stringify(coche));

    // Añadir la imagen si existe
    if (imagen) {
        formData.append("imagen", imagen);
    }

    const response = await api.post("/coches", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// Actualizar coche con imagen
export const updateCoche = async (id, coche, imagen = null) => {
    const formData = new FormData();

    // Añadir los datos del coche como JSON string
    formData.append("cocheData", JSON.stringify(coche));

    // Añadir la imagen si existe
    if (imagen) {
        formData.append("imagen", imagen);
    }

    const response = await api.put(`/coches/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// Eliminar coche
export const deleteCoche = async (id) => {
    const response = await api.delete(`/coches/${id}`);
    return response.data;
};
