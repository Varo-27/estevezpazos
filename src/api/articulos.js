import { api } from "./index.js";

export const getArticulos = async () => {
    const response = await api.get("/articulos");
    return response.data;
};

export const addArticulo = async (articulo) => {
    const response = await api.post("/articulos", articulo);
    return response.data;
};

export const updateArticulo = async (id, articulo) => {
    const response = await api.put(`/articulos/${id}`, articulo);
    return response.data;
};

export const deleteArticulo = async (id) => {
    const response = await api.delete(`/articulos/${id}`);
    return response.data;
};
