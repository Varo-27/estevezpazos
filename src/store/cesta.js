import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

//Creamos un objeto que utilice la dependencia Pinia y le asignamos los datos y los métodos que tendrá.
export const useCestaStore = defineStore("cesta", () => {
    // Creamos un objeto reactivo que almacenará los items que añadimos/quitamos de la cesta para ir cambiando su valor en ejecución
    const items = ref([]);
    //Segundo array vacío para que, al pagar, deje de verse visualmente la lista pero se mantenga para la factura.
    const compraCompleta = ref([]);

    //Conseguir el número total de items añadidos a la lista
    //total es el valor previo, empieza en 0 por el ultimo dato pasado a la funcion
    const totalItems = computed(() => {
        if (!Array.isArray(items.value)) return 0;
        return items.value.reduce((total, item) => total + (item.cantidad || 0), 0);
    });

    //Calcula el precio total de todos los productos
    const totalPrecio = computed(() => {
        //Vemos si la lista principal esta vacia, si lo está, usamos la otra
        const currentList =
            items.value.length > 0 ? items.value : compraCompleta.value;
        if (!Array.isArray(currentList)) return 0;

        return currentList.reduce(
            (total, item) => total + item.precio * (item.cantidad || 0),
            0,
        );
    });

    //Copua la lista a la lista para la factura y vacia la original(para visual)
    function completarCompra() {
        if (items.value.length > 0) {
            compraCompleta.value = [...items.value];
            items.value = [];
        }
    }
    // Acción que añade un producto a la lista, y si ya existe, solo aumente su cantidad
    function addProducto(producto) {
        const existente = items.value.find((item) => item.id === producto.id);
        if (existente) {
            existente.cantidad = (existente.cantidad || 0) + 1;
        } else {
            items.value.push({
                ...producto,
                cantidad: 1,
            });
        }
    }

    //Funcion que elimina un producto de la lista
    function removeProducto(id) {
        const index = items.value.findIndex((item) => item.id === id);
        if (index > -1) {
            items.value.splice(index, 1); //splice MANTIENE reactividad
        }
    }

    //Aumenta la cantidad de un producto en base a su id
    function incrementarCantidad(id) {
        const item = items.value.find((item) => item.id === id);
        if (item) item.cantidad++;
    }

    //Funcion que reduce la cantidad de un item en concreto, si el item existe pero la cantidad es menor a 1, lo borra
    function decrementarCantidad(id) {
        const item = items.value.find((item) => item.id === id);
        if (item && item.cantidad > 1) {
            item.cantidad--;
        } else if (item) {
            removeProducto(id);
        }
    }

    //Vacías la cesta y borra el sessionStorage(vacío real)
    function clearCesta() {
        items.value = [];
        compraCompleta.value = [];
        sessionStorage.removeItem("items");
    }

    //Cuando se crea el objeto mira si hay un items en el sessionStorage, si lo hay le asigna el valor a items.
    const itemsData = sessionStorage.getItem("items");
    if (itemsData) {
        try {
            items.value = JSON.parse(itemsData);
        } catch (e) {
            console.error("Error parsing cart:", e);
        }
    }

    // Cada vez que un item nuevo entre en items, se cambiara el sessionSotrage para que entre este mismo, newItems es una referencia al array real
    watch(
        items,
        (newItems) => {
            sessionStorage.setItem("items", JSON.stringify(newItems));
        },
        { deep: true },
    );

    return {
        items,
        compraCompleta,
        totalItems,
        totalPrecio,
        addProducto,
        removeProducto,
        incrementarCantidad,
        decrementarCantidad,
        clearCesta,
        completarCompra,
    };
});
