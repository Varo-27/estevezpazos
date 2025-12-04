import { api } from "./index.js";

export const getClientes = async () => {
    const response = await api.get(
        "/clientes?_sort=apellidos&_order=asc&historico=true"
    );
    return response.data;
};

export const addCliente = async (cliente) => {
    const response = await api.post("/clientes", cliente);
    return response.data;
};

export const updateCliente = async (id, cliente) => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
};

export const deleteCliente = async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
};

export const getClientePorDni = async (dni) => {
    const response = await api.get(`/clientes/dni/${dni}`);
    return response.data;
};
