import { api } from "./index.js";

export const getCitasTaller = async () => {
    const response = await api.get("/taller");
    return response.data;
};

export const addCitaTaller = async (cita) => {
    const response = await api.post("/taller", cita);
    return response.data;
};

export const updateCitaTaller = async (id, cita) => {
    const response = await api.put(`/taller/${id}`, cita);
    return response.data;
};

export const deleteCitaTaller = async (id) => {
    const response = await api.delete(`/taller/${id}`);
    return response.data;
};
