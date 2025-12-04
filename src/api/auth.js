import { api } from "./index.js";

export const loginUsuario = async (dni, password) => {
    const response = await api.post("/auth/login", { dni, password });
    return response.data;
};

export const verificarAdmin = async () => {
    const response = await api.get("/auth/check-admin");
    return response.data;
};
