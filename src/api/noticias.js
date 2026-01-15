import { api } from "./index.js";

export const getNoticias = async () => {
    const response = await api.get("/noticias");
    return response.data;
};

export const addNoticia = async (noticia) => {
    const response = await api.post("/noticias", noticia);
    return response.data;
};

export const deleteNoticia = async (id) => {
    const response = await api.delete(`/noticias/${id}`);
    return response.data;
};
