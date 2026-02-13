<template>
    <div class="container mt-4">
        <h2>Mi Cesta</h2>
        <div v-if="cesta.items.length === 0" class="alert alert-info">
            La cesta está vacía.
        </div>
        <div v-else>
            <table class="table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cesta.items" :key="item.id">
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.precio }} €</td>
                        <td>
                            <button class="btn btn-sm btn-outline-secondary me-1"
                                @click="decrementar(item.id)">-</button>
                            {{ item.cantidad }}
                            <button class="btn btn-sm btn-outline-secondary ms-1"
                                @click="incrementar(item.id)">+</button>
                        </td>
                        <td>{{ item.precio * item.cantidad }} €</td>
                        <td>
                            <button class="btn btn-sm btn-danger" @click="removeProducto(item.id)"> Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="row mt-3">
                <div class="col-md-6">
                    <label for="codigo">Código descuento</label>
                    <input id="codigo" class="form-control w-50" v-model="codigoDescuento"
                        placeholder="Introduce código" />
                </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3">
                <div>
                    <div>Subtotal: {{ formato(precioBase) }} €</div>
                    <div v-if="descuento > 0">Descuento: -{{ formato(descuento) }} €</div>
                    <div>IVA: {{ formato(iva) }} €</div>
                    <div v-if="gastosEnvio > 0">Gastos de envío: +{{ formato(gastosEnvio) }} €</div>
                </div>
                <div>
                    <h5>Total: {{ formato(totalFinal) }} €</h5>
                    <button class="btn btn-success" @click="iniciarPago">Iniciar Pago</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCestaStore } from '@/store/cesta.js'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth.js'

import Swal from 'sweetalert2'

const cesta = useCestaStore()
const { isLogueado } = useAuth()
const router = useRouter()

// Funciones de la cesta
const incrementar = (id) => cesta.incrementarCantidad(id)
const decrementar = (id) => cesta.decrementarCantidad(id)
const removeProducto = (id) => cesta.removeProducto(id)

// Estado de administrador simulado
const isUsuario = ref(
    sessionStorage.getItem('isUsuario') === 'true'
)

// Descuento y gastos de envío
const codigoDescuento = ref('')
const precioBase = computed(() => Number(cesta.totalPrecio || 0))
const descuento = computed(() => {
    return codigoDescuento.value && codigoDescuento.value.trim().toUpperCase() === 'DESCUENTO'
        ? Number((precioBase.value * 0.1).toFixed(2))
        : 0
})
const iva = computed(() => {
    return esEmpresa()
        ? Number((precioBase.value * 0.1).toFixed(2))
        : Number((precioBase.value * 0.21).toFixed(2))
})

function esEmpresa(){
    return sessionStorage.getItem("userType") === "company";
}

const gastosEnvio = computed(() => {
    const subtotal = precioBase.value - descuento.value
    
    return subtotal > 0 && subtotal < 50 ? 5 : 0
})
const totalFinal = computed(() => {
    return Number((precioBase.value - descuento.value + gastosEnvio.value + iva.value).toFixed(2))
})

const formato = (n) => (typeof n === 'number' ? n.toFixed(2) : n)

// Mostrar alertas
const mostrarAlerta = (titulo, texto, icono) => {
    Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        confirmButtonText: 'Aceptar'
    })
}

// Truncar ID
const truncarId = (id) => id.slice(-8)

// Iniciar pago con Stripe usando axios
const iniciarPago = async () => {
    if (!cesta.items.length) {
        mostrarAlerta('Aviso', 'La cesta está vacía', 'warning')
        return
    }

    if (!isLogueado.value) {
        router.push({ name: 'TablaLogin' })
        return
    }

    // Guardar cesta en localStorage
    localStorage.setItem('checkout_items', JSON.stringify(cesta.items))
    localStorage.setItem('checkout_total', totalFinal.value)
    try {
        // Crear la sesión de pago en el backend
        const response = await axios.post('http://localhost:5000/crear-checkout-session', {
            items: cesta.items,
            amount: totalFinal.value
        })
        console.log('Respuesta de crear-checkout-session:', response.data)
        const session = response.data

        if (!session.url) {
            console.error('❌ No se recibió URL de Stripe.')
            mostrarAlerta('Error', 'No se pudo iniciar el pago', 'error')
            return
        }

        // Redirigir directamente al checkout de Stripe
        window.location.href = session.url

    } catch (error) {
        console.error('Error en iniciarPago:', error)
        mostrarAlerta('Error', 'No se pudo iniciar el pago', 'error')
    }
}
</script>