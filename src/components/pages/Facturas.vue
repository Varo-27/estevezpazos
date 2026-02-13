<template>
    <div class="table-responsive mt-4">
        <h5 class="text-center bg-primary-subtle py-1 mb-3"><i class="bi bi-list-ul me-2"></i>Listado de Vehículos</h5>

        <table class="table table-hover table-bordered">
            <thead class="table-primary">
                <tr>
                    <th>Factura</th>
                    <th>Fecha</th>
                    <th>Modelo</th>
                    <th>Precio</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="factura in facturas" :key="factura._id">
                    <td>{{ factura._id }}</td>
                    <td>{{ factura.fecha }}</td>
                    <td>{{ factura.productos[0].nombre }}</td>
                    <td>{{ factura.productos[0].precio }}</td>
                    <td>{{ factura.productos[0].total }}</td>
                </tr>
                <tr v-if="facturas.length === 0">
                    <td colspan="8" class="text-center text-muted">
                        No hay facturas</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { getFacturas } from '@/api/facturas.js'


const facturas = ref([])

onMounted(async () => {
    await cargarFacturas()
})


const cargarFacturas = async () => {
    try {
        facturas.value = await getFacturas()
        console.log(facturas)
    } catch (error) {
        console.error('Error al cargar las facturas:', error)
    }
}

</script>

<style scoped>
</style>
