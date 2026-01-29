import { defineStore } from "pinia";

// Store de la cesta
export const useCestaStore = defineStore("cesta", {
    state: () => ({ items: [] }),

    getters: {
        totalItems(state) {
            return state.items.reduce(
                (total, item) => total + item.cantidad,
                0,
            );
        },

        totalPrecio(state) {
            return state.items.reduce(
                (total, item) => total + item.precio * item.cantidad,
                0,
            );
        },
    },

    actions: {
        // Añadir producto (si existe, suma 1)
        addProducto(producto) {
            const existente = this.items.find(
                (item) => item.id === producto.id,
            );
            if (existente) existente.cantidad++;
            else this.items.push({ ...producto, cantidad: 1 });
        },

        removeProducto(id) {
            this.items = this.items.filter((item) => item.id !== id);
        },

        incrementar(id) {
            const item = this.items.find((item) => item.id === id);
            if (item) item.cantidad++;
        },

        decrementar(id) {
            const item = this.items.find(
                (item) => item.id === id && item.cantidad > 1,
            );
            if (item) item.cantidad--;
        },

        clearCesta() {
            this.items = [];
        },
    },
});
