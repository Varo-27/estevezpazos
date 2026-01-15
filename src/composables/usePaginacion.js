import { ref, computed } from "vue";

/**
 * Composable para manejar paginación de datos
 * @param {number} itemsPorPagina - Número de items por página (default: 10)
 */
export function usePaginacion(itemsPorPagina = 10) {
    const currentPage = ref(1);
    const itemsPorPage = itemsPorPagina;

    /**
     * Crea un computed que devuelve los items paginados
     * @param {Ref<Array>} items - Ref con el array de items a paginar
     * @returns {ComputedRef<Array>}
     */
    const crearItemsPaginados = (items) => {
        return computed(() => {
            const start = (currentPage.value - 1) * itemsPorPage;
            return items.value.slice(start, start + itemsPorPage);
        });
    };

    /**
     * Crea un computed con el total de páginas
     * @param {Ref<Array>} items - Ref con el array de items
     * @returns {ComputedRef<number>}
     */
    const crearTotalPages = (items) => {
        return computed(() => Math.ceil(items.value.length / itemsPorPage));
    };

    const nextPagina = (totalPagesValue) => {
        // Si viene de template, totalPagesValue ya es número
        // Si viene de código, puede ser ref
        const total =
            typeof totalPagesValue === "number"
                ? totalPagesValue
                : totalPagesValue.value;
        if (currentPage.value < total) {
            currentPage.value++;
        }
    };

    const beforePagina = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    const resetPagina = () => {
        currentPage.value = 1;
    };

    return {
        currentPage,
        itemsPorPage,
        crearItemsPaginados,
        crearTotalPages,
        nextPagina,
        beforePagina,
        resetPagina,
    };
}
