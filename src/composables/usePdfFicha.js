import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export function usePdfFicha() {
    const imprimirFichaVehiculo = (vehiculo) => {
        if (!vehiculo) return

        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.setFont(undefined, 'bold')
        doc.text('Ficha del Vehículo', 105, 15, { align: 'center' })

        doc.setFontSize(14)
        doc.text(`Matrícula: ${vehiculo.matricula || 'Sin matrícula'}`, 105, 23, { align: 'center' })

        const datosVehiculo = [
            ['Tipo de vehículo', vehiculo.tipo || '-'],
            ['Marca', vehiculo.marca || '-'],
            ['Modelo', vehiculo.modelo || '-'],
            ['Año', vehiculo.anio ? String(vehiculo.anio) : '-'],
            ['Kilómetros', vehiculo.kilometros ? `${vehiculo.kilometros.toLocaleString('es-ES')} km` : '-'],
            ['Precio', vehiculo.precio ? `${vehiculo.precio.toLocaleString('es-ES')} €` : '-'],
            ['Combustible', vehiculo.combustible || '-'],
            ['Transmisión', vehiculo.transmision || '-'],
            ['Potencia', vehiculo.potencia_cv ? `${vehiculo.potencia_cv} CV` : '-'],
            ['Estado', vehiculo.estado || '-'],
            ['Provincia', vehiculo.ubicacion?.provincia || '-'],
            ['Ciudad', vehiculo.ubicacion?.ciudad || '-'],
            ['Contacto - Nombre', vehiculo.contacto?.nombre || '-'],
            ['Contacto - Teléfono', vehiculo.contacto?.telefono || '-'],
            ['Contacto - Email', vehiculo.contacto?.email || '-'],
            ['Fecha de publicación', vehiculo.fecha_publicacion ? new Date(vehiculo.fecha_publicacion).toLocaleDateString('es-ES') : '-'],
            ['Descripción', vehiculo.descripcion || 'Sin descripción']
        ]

        autoTable(doc, {
            head: [['Campo', 'Valor']],
            body: datosVehiculo,
            startY: 30,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
            columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold' }, 1: { cellWidth: 120 } },
            alternateRowStyles: { fillColor: [245, 247, 250] }
        })

        const fecha = new Date().toISOString().split('T')[0]
        const matriculaLimpia = (vehiculo.matricula || 'SIN-MATRICULA').replace(/\s+/g, '_')
        const nombreArchivo = `ficha_${matriculaLimpia}_${fecha}.pdf`

        doc.save(nombreArchivo)
    }

    return { imprimirFichaVehiculo }
}
