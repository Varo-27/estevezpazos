import { api } from './index.js'

// Obtener artículo (coche) por ID
export const getArticuloById = async (id) => {
    const response = await api.get(`/coches/${id}`)
    return response.data
}

// Reservar un artículo: envía datos de reserva y marca estado 'reservado'
export const reservarArticulo = async (id, reservaData) => {
    // Construimos el objeto a actualizar
    const payload = {
        estado: 'reservado',
        reserva: {
            ...reservaData,
            reservado: true,
            fecha_reserva: new Date().toISOString(),
        },
    }

    const response = await api.put(`/coches/${id}`, payload)
    // El backend devuelve el documento actualizado en response.data
    // Para compatibilidad con componentes existentes, devolvemos { coche: <doc> }
    return { coche: response.data }
}

// Anular reserva: vuelve a 'disponible' y elimina la info de reserva
export const anularReserva = async (id) => {
    const payload = {
        estado: 'disponible',
        reserva: { reservado: false },
    }
    const response = await api.put(`/coches/${id}`, payload)
    return { coche: response.data }
}

export default {
    getArticuloById,
    reservarArticulo,
    anularReserva,
}
