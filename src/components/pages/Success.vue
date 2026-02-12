<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card shadow-lg border-0">
                    <div class="card-body text-center py-5">
                        <div class="mb-4">
                            <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
                        </div>
                        <h2 class="card-title text-success mb-3">¡Pago Completado!</h2>
                        <p class="card-text text-muted mb-4">
                            Tu pago se ha procesado correctamente. Gracias por tu compra.
                        </p>

                        <div class="alert alert-success" role="alert">
                            <i class="bi bi-envelope-check me-2"></i>
                            Recibirás un correo de confirmación en breve.
                        </div>

                        <div class="invoice-container my-4">
                            <p class="text-muted mb-3">Descargue su factura en formato PDF:</p>
                            <button @click="generarFacturaPDF" class="btn btn-success">
                                <i class="bi bi-file-earmark-pdf me-2"></i>Descargar Factura
                            </button>
                        </div>

                        <div class="d-flex justify-content-center gap-3 mt-4">
                            <router-link to="/" class="btn btn-primary">
                                <i class="bi bi-house me-2"></i>Volver al inicio
                            </router-link>
                            <router-link to="/ventas" class="btn btn-outline-primary">
                                <i class="bi bi-car-front me-2"></i>Ver más vehículos
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCestaStore } from '@/store/cesta.js'
import { useAuth } from '@/composables/useAuth.js'
import { addFactura } from '@/api/facturas.js'
import { updateCoche } from '@/api/coches.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logo from '@/assets/logo.png'
import Swal from 'sweetalert2'

const cestaStore = useCestaStore()
const { userName } = useAuth()
const cartItems = ref([])
const totalPrice = ref(0)
const numeroFactura = ref('')

onMounted(async () => {
    // Recuperar datos de la compra desde localStorage antes de limpiar
    const savedItems = localStorage.getItem('checkout_items')
    const savedTotal = localStorage.getItem('checkout_total')

    if (savedItems) {
        cartItems.value = JSON.parse(savedItems)
    }
    if (savedTotal) {
        totalPrice.value = parseFloat(savedTotal)
    }

    // Generar número de factura
    numeroFactura.value = `F-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`

    // Guardar factura en MongoDB
    await guardarFacturaEnDB()

    // Limpiar la cesta después del pago exitoso
    cestaStore.clearCesta()
})

onBeforeUnmount(() => {
    // Limpiar localStorage al salir de la página
    localStorage.removeItem('checkout_items')
    localStorage.removeItem('checkout_total')
})

const guardarFacturaEnDB = async () => {
    try {
        if (cartItems.value.length === 0) {
            console.warn('No hay productos para guardar en la factura')
            return
        }

        const factura = {
            numeroFactura: numeroFactura.value,
            nombreUsuario: userName.value || 'Usuario Invitado',
            productos: cartItems.value.map((item) => ({
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad,
                total: item.precio * item.cantidad,
            })),
            total: totalPrice.value,
            fecha: new Date(),
        }

        const response = await addFactura(factura)
        console.log('✅ Factura guardada en MongoDB:', response)

        // Marcar los coches comprados como vendidos en la base de datos
        try {
            for (const item of cartItems.value) {
                if (item.id) {
                    // Enviar solo el campo estado para actualizar
                    await updateCoche(item.id, { estado: 'vendido' })
                }
            }
            console.log('✅ Coches marcados como vendidos')
        } catch (err) {
            console.error('❌ Error marcando coches como vendidos:', err)
        }
    } catch (error) {
        console.error('❌ Error al guardar factura en MongoDB:', error)
        // No mostramos error al usuario para no afectar la experiencia
    }
}

const generarFacturaPDF = async () => {
    if (cartItems.value.length === 0) {
        console.error('No hay productos en el carrito. No se puede generar la factura.')
        alert('No hay productos para generar la factura. Los datos pueden haberse perdido.')
        return
    }

    const doc = new jsPDF()

    // Cargar y dibujar logo en la parte superior izquierda respetando proporciones
    try {
        await new Promise((resolve) => {
            const img = new Image()
            img.src = logo
            img.onload = () => {
                const maxW = 36 // ancho máximo en unidades del PDF
                const maxH = 20 // alto máximo
                const iw = img.naturalWidth || img.width
                const ih = img.naturalHeight || img.height

                // Calcular tamaño manteniendo proporciones
                let drawW = maxW
                let drawH = (ih / iw) * drawW
                if (drawH > maxH) {
                    drawH = maxH
                    drawW = (iw / ih) * drawH
                }

                const x = 14
                const y = 8
                try {
                    doc.addImage(img, 'PNG', x, y, drawW, drawH)
                } catch (e) {
                    // Si no se puede añadir la imagen, dibujar texto como fallback
                    doc.setFontSize(20)
                    doc.setFont('helvetica', 'bold')
                    doc.setTextColor(13, 110, 253)
                    doc.text('CarTeis', 14, 20)
                }

                // Línea decorativa ubicada justo debajo del logo (dependiendo de su altura)
                doc.setDrawColor(13, 110, 253)
                doc.setLineWidth(0.5)
                const lineY = y + drawH + 4
                doc.line(14, lineY, 50, lineY)

                resolve()
            }

            img.onerror = () => {
                // Fallback: texto y línea si la imagen no carga
                doc.setFontSize(20)
                doc.setFont('helvetica', 'bold')
                doc.setTextColor(13, 110, 253)
                doc.text('CarTeis', 14, 20)
                doc.setDrawColor(13, 110, 253)
                doc.setLineWidth(0.5)
                doc.line(14, 23, 50, 23)
                resolve()
            }
        })
    } catch (err) {
        console.warn('Error cargando logo:', err)
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(13, 110, 253)
        doc.text('CarTeis', 14, 20)
        doc.setDrawColor(13, 110, 253)
        doc.setLineWidth(0.5)
        doc.line(14, 23, 50, 23)
    }

    // Título de la factura
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text('FACTURA', 105, 20, { align: 'center' })

    // Información del negocio (derecha)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('CarTeis S.L.', 200, 30, { align: 'right' })
    doc.text('Avenida Galicia 101', 200, 35, { align: 'right' })
    doc.text('36216 Vigo, Pontevedra', 200, 40, { align: 'right' })
    doc.text('Tlfo: 986 666 333', 200, 45, { align: 'right' })
    doc.text('Email: carteis@example.com', 200, 50, { align: 'right' })

    // Información de la factura (izquierda)
    doc.setFontSize(10)
    const fecha = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    const numFactura = numeroFactura.value

    doc.text(`Fecha: ${fecha}`, 14, 50)
    doc.text(`Factura Nº: ${numFactura}`, 14, 55)

    // Línea separadora
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(14, 65, 196, 65)

    // Crear la tabla con los productos del carrito
    const headers = [['ID', 'Producto', 'Cantidad', 'Precio Unit.', 'Total']]
    const data = cartItems.value.map((item) => [
        item.id ? String(item.id).substring(0, 8) : 'N/A',
        item.nombre || 'Sin nombre',
        item.cantidad || 1,
        `${(item.precio || 0).toFixed(2)} €`,
        `${((item.precio || 0) * (item.cantidad || 1)).toFixed(2)} €`
    ])

    autoTable(doc, {
        startY: 70,
        head: headers,
        body: data,
        headStyles: {
            fillColor: [13, 110, 253],
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 25 },
            1: { halign: 'left', cellWidth: 70 },
            2: { halign: 'center', cellWidth: 25 },
            3: { halign: 'right', cellWidth: 35 },
            4: { halign: 'right', cellWidth: 35 }
        },
        theme: 'striped',
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    })

    // Total de la compra (alineado a la derecha)
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setDrawColor(13, 110, 253)
    doc.setLineWidth(0.5)
    doc.line(140, finalY, 196, finalY)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('TOTAL:', 140, finalY + 7)
    doc.text(`${totalPrice.value.toFixed(2)} €`, 196, finalY + 7, { align: 'right' })

    // Pie de página
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(128, 128, 128)
    const pageHeight = doc.internal.pageSize.height
    doc.text('Gracias por su compra', 105, pageHeight - 20, { align: 'center' })

    // Pie de página (texto alternativo, sin logo en el pie)
    doc.text('CarTeis - Su concesionario de confianza', 105, pageHeight - 15, { align: 'center' })

    // Guardar el archivo PDF
    const nombreArchivo = `factura_CarTeis_${numFactura.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    doc.save(nombreArchivo)
}
</script>

<style scoped>
.card {
    border-radius: 15px;
}

.bi-check-circle-fill {
    animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
    from {
        transform: scale(0);
    }

    to {
        transform: scale(1);
    }
}
</style>
