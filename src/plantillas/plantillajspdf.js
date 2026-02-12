// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                    PLANTILLA EXPLICATIVA DE jsPDF v4                       ║
// ║                     con jspdf-autotable v5                                ║
// ║                                                                            ║
// ║  Esta plantilla es una guía de referencia con ejemplos prácticos.          ║
// ║  Cada sección explica una funcionalidad de jsPDF con comentarios           ║
// ║  detallados para que puedas crear tus propios PDFs personalizados.         ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ============================================================================
// 1. IMPORTACIONES
// ============================================================================
// jsPDF se puede importar de dos formas, ambas válidas en la versión 4:
//
//   import jsPDF from 'jspdf'          ← export por defecto (usado en Success.vue)
//   import { jsPDF } from 'jspdf'      ← export con nombre (usado en Ventas.vue)
//
// autoTable se importa aparte y se usa como función independiente:
//   import autoTable from 'jspdf-autotable'
//
// Para imágenes locales (en Vue/Vite) se importan como módulo:
//   import logo from '@/assets/logo.png'
// ============================================================================

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
// import logo from '@/assets/logo.png' // ← Descomenta si quieres usar tu logo

// ============================================================================
// 2. CREAR UN DOCUMENTO PDF — El Constructor
// ============================================================================
// new jsPDF(opciones) acepta un objeto con las siguientes propiedades:
//
//   orientation : 'portrait' (vertical) | 'landscape' (horizontal)
//                 Por defecto: 'portrait'
//
//   unit        : Unidad de medida para todas las coordenadas
//                 'mm' (milímetros) | 'pt' (puntos) | 'px' (píxeles) | 'in' (pulgadas) | 'cm'
//                 Por defecto: 'mm'
//
//   format      : Tamaño del papel
//                 'a4' | 'a3' | 'a5' | 'letter' | 'legal' | [ancho, alto]
//                 Por defecto: 'a4'
//
//   compress    : true | false → Comprime el PDF (reduce tamaño de archivo)
//
// COORDENADAS: El punto (0, 0) está en la ESQUINA SUPERIOR IZQUIERDA.
//   - X crece hacia la DERECHA
//   - Y crece hacia ABAJO
//
// Tamaño A4 en mm: 210 x 297 (ancho x alto)
// ============================================================================

/**
 * Genera un PDF de ejemplo completo con todas las funcionalidades de jsPDF.
 * Puedes llamar a esta función desde cualquier componente Vue para probar.
 */
export function generarPDFEjemploCompleto() {
    // --- Crear documento ---
    // Sin argumentos = A4 vertical en milímetros (la opción más común)
    const doc = new jsPDF()

    // Si quisieras horizontal y en A3:
    // const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' })

    // Si quisieras un tamaño personalizado (ej: ticket de 80mm x 200mm):
    // const doc = new jsPDF({ unit: 'mm', format: [80, 200] })

    // ========================================================================
    // 3. TEXTO — Lo más básico
    // ========================================================================
    // doc.text(texto, x, y, opciones?)
    //
    //   texto   : String o Array de strings (para multilínea)
    //   x, y    : Coordenadas en la unidad definida (mm por defecto)
    //   opciones: { align: 'left'|'center'|'right', angle: número, maxWidth: número }
    //
    // IMPORTANTE: El texto se posiciona por su línea base (baseline),
    //             no por la esquina superior. Un texto en y=10 aparecerá
    //             con la parte inferior de las letras a 10mm del borde.
    // ========================================================================

    // --- Configurar fuente ANTES de escribir ---
    // doc.setFont(familia, estilo)
    //   familia: 'helvetica' | 'times' | 'courier' (fuentes integradas)
    //   estilo : 'normal' | 'bold' | 'italic' | 'bolditalic'
    doc.setFont('helvetica', 'bold')

    // doc.setFontSize(tamaño) → Tamaño en puntos (pt), no en mm
    doc.setFontSize(22)

    // doc.setTextColor(R, G, B) → Valores de 0 a 255
    // También acepta: doc.setTextColor('#0d6efd') en formato hex
    doc.setTextColor(13, 110, 253) // Azul Bootstrap primary

    // Escribir texto alineado a la izquierda (por defecto)
    doc.text('GUÍA DE jsPDF', 14, 20)

    // --- Texto centrado ---
    // Para centrar, usa x = mitad de la página (105 en A4) y align: 'center'
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(128, 128, 128) // Gris
    doc.text('Plantilla explicativa con ejemplos prácticos', 105, 28, { align: 'center' })

    // --- Texto alineado a la derecha ---
    // Usa x = margen derecho (ej: 196 para dejar 14mm de margen) y align: 'right'
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0) // Negro
    doc.text('Alineado a la derecha →', 196, 28, { align: 'right' })

    // --- Texto multilínea (con array) ---
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(
        [
            'Línea 1: Puedes pasar un array de strings',
            'Línea 2: Cada elemento es una línea nueva',
            'Línea 3: El interlineado se calcula automáticamente',
        ],
        14,
        38
    )

    // --- Texto con maxWidth (ajuste automático de línea) ---
    // Si el texto es muy largo, maxWidth lo parte en varias líneas automáticamente
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(
        'Este texto tiene maxWidth de 80mm, así que se partirá automáticamente en varias líneas si es necesario. Muy útil para descripciones largas.',
        14,
        60,
        { maxWidth: 80 }
    )

    // --- Obtener el ancho de un texto (útil para posicionar) ---
    // doc.getTextWidth(texto) → devuelve el ancho en la unidad actual
    const anchoTexto = doc.getTextWidth('Texto de ejemplo')
    doc.text(`El texto "Texto de ejemplo" mide ${anchoTexto.toFixed(1)}mm de ancho`, 14, 78)

    // ========================================================================
    // 4. LÍNEAS Y FORMAS GEOMÉTRICAS
    // ========================================================================
    // Antes de dibujar, configura el estilo de trazo:
    //
    //   doc.setDrawColor(R, G, B)  → Color de las líneas/bordes
    //   doc.setFillColor(R, G, B)  → Color de relleno
    //   doc.setLineWidth(grosor)   → Grosor de línea en la unidad actual (mm)
    //
    // Modos de dibujo (último parámetro en rect, circle, etc.):
    //   'S'  = Solo trazo (stroke)         ← por defecto
    //   'F'  = Solo relleno (fill)
    //   'FD' = Relleno + trazo (fill & draw)
    // ========================================================================

    const seccionY = 85

    // --- Título de sección ---
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(13, 110, 253)
    doc.text('4. Líneas y Formas', 14, seccionY)

    // --- Línea simple ---
    // doc.line(x1, y1, x2, y2) → Dibuja una línea de (x1,y1) a (x2,y2)
    doc.setDrawColor(13, 110, 253) // Color azul
    doc.setLineWidth(0.5) // Grosor medio
    doc.line(14, seccionY + 3, 100, seccionY + 3)

    // --- Línea gruesa ---
    doc.setDrawColor(220, 53, 69) // Rojo
    doc.setLineWidth(1.5)
    doc.line(14, seccionY + 8, 100, seccionY + 8)

    // --- Línea punteada (dashArray) ---
    // doc.setLineDashPattern([longTrazo, longEspacio], fase)
    doc.setDrawColor(40, 167, 69) // Verde
    doc.setLineWidth(0.5)
    doc.setLineDashPattern([3, 2], 0) // Trazo de 3mm, espacio de 2mm
    doc.line(14, seccionY + 13, 100, seccionY + 13)
    doc.setLineDashPattern([], 0) // ¡¡IMPORTANTE!! Resetear a línea continua

    // --- Rectángulo (solo borde) ---
    // doc.rect(x, y, ancho, alto, estilo)
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.3)
    doc.rect(14, seccionY + 18, 40, 15, 'S') // Solo trazo
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text('rect con "S" (trazo)', 16, seccionY + 27)

    // --- Rectángulo relleno ---
    doc.setFillColor(13, 110, 253) // Relleno azul
    doc.rect(60, seccionY + 18, 40, 15, 'F') // Solo relleno
    doc.setTextColor(255, 255, 255) // Texto blanco sobre fondo azul
    doc.text('rect con "F" (relleno)', 62, seccionY + 27)

    // --- Rectángulo con borde y relleno ---
    doc.setFillColor(255, 193, 7) // Amarillo
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.5)
    doc.rect(106, seccionY + 18, 40, 15, 'FD') // Relleno + trazo
    doc.setTextColor(0, 0, 0)
    doc.text('rect con "FD" (ambos)', 108, seccionY + 27)

    // --- Rectángulo redondeado ---
    // doc.roundedRect(x, y, ancho, alto, radioX, radioY, estilo)
    doc.setFillColor(108, 117, 125) // Gris
    doc.roundedRect(152, seccionY + 18, 40, 15, 3, 3, 'FD')
    doc.setTextColor(255, 255, 255)
    doc.text('roundedRect', 158, seccionY + 27)

    // --- Círculo ---
    // doc.circle(xCentro, yCentro, radio, estilo)
    doc.setFillColor(220, 53, 69) // Rojo
    doc.setDrawColor(0, 0, 0)
    doc.circle(25, seccionY + 45, 6, 'FD')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.text('circle', 20, seccionY + 46)

    // --- Elipse ---
    // doc.ellipse(xCentro, yCentro, radioX, radioY, estilo)
    doc.setFillColor(111, 66, 193) // Morado
    doc.ellipse(55, seccionY + 45, 12, 6, 'FD')
    doc.setTextColor(255, 255, 255)
    doc.text('ellipse', 49, seccionY + 46)

    // --- Triángulo (usando líneas) ---
    // No hay método nativo, pero se pueden usar líneas:
    doc.setDrawColor(255, 127, 0) // Naranja
    doc.setFillColor(255, 193, 7)
    doc.setLineWidth(0.5)
    // doc.triangle(x1, y1, x2, y2, x3, y3, estilo)
    doc.triangle(85, seccionY + 39, 75, seccionY + 51, 95, seccionY + 51, 'FD')
    doc.setTextColor(0, 0, 0)
    doc.text('triangle', 80, seccionY + 48)

    // ========================================================================
    // 5. IMÁGENES
    // ========================================================================
    // doc.addImage(datos, formato, x, y, ancho, alto)
    //
    //   datos   : HTMLImageElement | String (base64/URL) | Canvas
    //   formato : 'PNG' | 'JPEG' | 'GIF' | 'WEBP'
    //   x, y    : Posición
    //   ancho, alto : Dimensiones en la unidad actual
    //
    // IMPORTANTE: Para mantener proporciones, calcula el ratio:
    //   ratio = imgHeight / imgWidth
    //   drawHeight = drawWidth * ratio
    //
    // En Vue/Vite, importa la imagen como módulo:
    //   import miImagen from '@/assets/imagen.png'
    // ========================================================================

    const imgSeccionY = seccionY + 58

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(13, 110, 253)
    doc.text('5. Imágenes', 14, imgSeccionY)
    doc.setDrawColor(13, 110, 253)
    doc.setLineWidth(0.5)
    doc.line(14, imgSeccionY + 3, 100, imgSeccionY + 3)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(
        [
            'Para añadir imágenes, usa doc.addImage().',
            'Ejemplo con carga asíncrona (ver código fuente):',
            '',
            '  const img = new Image()',
            '  img.src = rutaImagen',
            '  img.onload = () => {',
            '    const ratio = img.naturalHeight / img.naturalWidth',
            '    doc.addImage(img, "PNG", x, y, ancho, ancho * ratio)',
            '  }',
            '',
            'Formatos soportados: PNG, JPEG, GIF, WEBP',
            'Tip: Usa try/catch con fallback por si la imagen falla.',
        ],
        14,
        imgSeccionY + 10
    )

    // ========================================================================
    // 6. TABLAS CON autoTable
    // ========================================================================
    // autoTable(doc, opciones) — Se importa de 'jspdf-autotable'
    //
    // Opciones principales:
    //   startY       : Coordenada Y donde empieza la tabla
    //   head         : Array de arrays → Cabecera(s) de la tabla
    //   body         : Array de arrays → Filas de datos
    //   foot         : Array de arrays → Pie de tabla (opcional)
    //   theme        : 'striped' | 'grid' | 'plain'
    //   headStyles   : { fillColor, textColor, fontSize, fontStyle, halign }
    //   bodyStyles   : Estilos para las celdas del cuerpo
    //   footStyles   : Estilos para el pie
    //   columnStyles : { 0: { halign, cellWidth }, 1: { ... } } → Por índice de columna
    //   alternateRowStyles : { fillColor } → Color alterno para filas
    //   margin       : { top, right, bottom, left } → Márgenes de la tabla
    //   styles       : Estilos globales para todas las celdas
    //   didDrawCell  : función callback ejecutada al dibujar cada celda
    //   willDrawCell : función callback antes de dibujar cada celda
    //
    // Después de dibujar, puedes obtener la posición final:
    //   doc.lastAutoTable.finalY → coordenada Y donde termina la tabla
    // ========================================================================

    // --- NUEVA PÁGINA para la sección de tablas ---
    doc.addPage() // Añade una nueva página al documento

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(13, 110, 253)
    doc.text('6. Tablas con autoTable', 14, 20)
    doc.setDrawColor(13, 110, 253)
    doc.setLineWidth(0.5)
    doc.line(14, 23, 120, 23)

    // --- Tabla básica (tema striped = filas alternas) ---
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('6.1 Tabla con theme "striped":', 14, 30)

    autoTable(doc, {
        startY: 33,
        // Cabecera: array de arrays (cada array = una fila de cabecera)
        head: [['ID', 'Producto', 'Precio', 'Stock']],
        // Cuerpo: cada array es una fila de datos
        body: [
            ['001', 'Seat León', '22.500,00 €', '3'],
            ['002', 'VW Golf', '28.900,00 €', '5'],
            ['003', 'Ford Focus', '19.750,00 €', '2'],
            ['004', 'Toyota Corolla', '24.300,00 €', '7'],
        ],
        // Tema visual
        theme: 'striped', // Filas con color alterno
        // Estilos de la cabecera
        headStyles: {
            fillColor: [13, 110, 253], // Fondo azul
            textColor: 255, // Texto blanco (un solo valor = escala de grises)
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center', // Alineación horizontal: 'left' | 'center' | 'right'
        },
        // Estilos por columna (índice empieza en 0)
        columnStyles: {
            0: { halign: 'center', cellWidth: 20 }, // ID centrado, 20mm de ancho
            1: { halign: 'left', cellWidth: 60 }, // Producto a la izquierda
            2: { halign: 'right', cellWidth: 40 }, // Precio a la derecha
            3: { halign: 'center', cellWidth: 25 }, // Stock centrado
        },
        // Color de filas alternas
        alternateRowStyles: {
            fillColor: [240, 245, 255], // Azul muy claro
        },
    })

    // --- Obtener posición final de la tabla ---
    // Muy útil para saber dónde poner el siguiente contenido
    const despuesDePrimeraTabla = doc.lastAutoTable.finalY + 10

    // --- Tabla con theme "grid" ---
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('6.2 Tabla con theme "grid":', 14, despuesDePrimeraTabla)

    autoTable(doc, {
        startY: despuesDePrimeraTabla + 3,
        head: [['Mes', 'Ventas', 'Beneficio']],
        body: [
            ['Enero', '45', '12.500 €'],
            ['Febrero', '52', '15.200 €'],
            ['Marzo', '38', '9.800 €'],
        ],
        theme: 'grid', // Todas las celdas con bordes visibles
        headStyles: {
            fillColor: [40, 167, 69], // Verde
            textColor: 255,
            halign: 'center',
        },
        // Estilos globales (aplican a todas las celdas)
        styles: {
            fontSize: 9,
            cellPadding: 4, // Padding interno de cada celda (mm)
            halign: 'center',
        },
    })

    const despuesDeSegundaTabla = doc.lastAutoTable.finalY + 10

    // --- Tabla con theme "plain" y footer ---
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('6.3 Tabla con theme "plain" + pie de tabla:', 14, despuesDeSegundaTabla)

    autoTable(doc, {
        startY: despuesDeSegundaTabla + 3,
        head: [['Concepto', 'Cantidad', 'Importe']],
        body: [
            ['Mano de obra', '3h', '120,00 €'],
            ['Filtro de aceite', '1', '18,50 €'],
            ['Aceite 5W30', '4L', '45,00 €'],
        ],
        // ¡Pie de tabla! Funciona igual que head
        foot: [['', 'TOTAL', '183,50 €']],
        theme: 'plain', // Sin fondo ni rayas, solo bordes finos
        headStyles: {
            fillColor: [52, 58, 64], // Gris oscuro
            textColor: 255,
        },
        footStyles: {
            fillColor: [52, 58, 64],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'right',
        },
        columnStyles: {
            2: { halign: 'right' },
        },
    })

    // ========================================================================
    // 7. MULTIPÁGINA Y PIE DE PÁGINA
    // ========================================================================
    // doc.addPage()                         → Añadir nueva página
    // doc.getNumberOfPages()                → Número total de páginas
    // doc.setPage(n)                        → Ir a la página n (1-based)
    // doc.internal.pageSize.getWidth()      → Ancho de la página
    // doc.internal.pageSize.getHeight()     → Alto de la página
    //   (también: doc.internal.pageSize.width / .height)
    // ========================================================================

    doc.addPage()

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(13, 110, 253)
    doc.text('7. Multipágina y Pie de Página', 14, 20)
    doc.setDrawColor(13, 110, 253)
    doc.setLineWidth(0.5)
    doc.line(14, 23, 140, 23)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(
        [
            'Este documento tiene varias páginas. Puedes:',
            '',
            '• doc.addPage()            → Añadir una página nueva',
            '• doc.addPage("a3", "l")   → Página A3 horizontal',
            '• doc.getNumberOfPages()   → Saber cuántas páginas hay',
            '• doc.setPage(2)           → Volver a la página 2 para editarla',
            '',
            'Abajo se añade un pie de página a TODAS las páginas del documento.',
        ],
        14,
        32
    )

    // --- Añadir pie de página a TODAS las páginas ---
    // Esto se hace al final, recorriendo todas las páginas con setPage()
    const totalPaginas = doc.getNumberOfPages()
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()

    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i) // Ir a la página i

        // Línea separadora del pie
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.3)
        doc.line(14, pageH - 18, pageW - 14, pageH - 18)

        // Texto del pie (izquierda)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(128, 128, 128)
        doc.text('Documento generado con jsPDF — Plantilla de ejemplo', 14, pageH - 12)

        // Número de página (derecha)
        doc.text(`Página ${i} de ${totalPaginas}`, pageW - 14, pageH - 12, { align: 'right' })
    }

    // ========================================================================
    // 8. GUARDAR EL PDF
    // ========================================================================
    // doc.save('nombre_archivo.pdf')  → Descarga el PDF con ese nombre
    //
    // Otras opciones:
    //   doc.output('datauristring')   → Devuelve el PDF como string base64
    //   doc.output('blob')            → Devuelve un Blob (útil para subir a servidor)
    //   doc.output('arraybuffer')     → ArrayBuffer (útil para procesamiento)
    //   doc.output('dataurlnewwindow')→ Abre el PDF en una nueva pestaña
    // ========================================================================

    doc.save('ejemplo_jspdf_completo.pdf')
}

// ============================================================================
// 9. FUNCIÓN AUXILIAR REUTILIZABLE — Cabecera CarTeis
// ============================================================================
// Esta función aplica la cabecera de tu empresa a cualquier documento jsPDF.
// Así no tienes que repetir el código del logo + datos en cada PDF.
//
// USO:
//   const doc = new jsPDF()
//   await aplicarCabeceraCarTeis(doc, logoImportado)
//   // ... resto del PDF ...
//   doc.save('mi_pdf.pdf')
// ============================================================================

/**
 * Aplica la cabecera estándar de CarTeis a un documento jsPDF.
 * Incluye logo con cálculo de proporciones, título y datos de la empresa.
 *
 * @param {jsPDF}  doc       - Instancia de jsPDF
 * @param {string} logoSrc   - Ruta/URL de la imagen del logo (importada con import)
 * @param {string} titulo    - Título del documento (ej: 'FACTURA', 'PRESUPUESTO')
 * @returns {Promise<number>} - La coordenada Y donde termina la cabecera
 */
export async function aplicarCabeceraCarTeis(doc, logoSrc, titulo = 'DOCUMENTO') {
    let cabeceraFinY = 30 // Posición Y por defecto si no hay logo

    // --- Logo ---
    if (logoSrc) {
        try {
            await new Promise((resolve) => {
                const img = new Image()
                img.src = logoSrc
                img.onload = () => {
                    // Calcular dimensiones manteniendo proporciones
                    const maxW = 36
                    const maxH = 20
                    const ratio = img.naturalHeight / img.naturalWidth
                    let drawW = maxW
                    let drawH = drawW * ratio
                    if (drawH > maxH) {
                        drawH = maxH
                        drawW = drawH / ratio
                    }

                    doc.addImage(img, 'PNG', 14, 8, drawW, drawH)

                    // Línea decorativa bajo el logo
                    doc.setDrawColor(13, 110, 253)
                    doc.setLineWidth(0.5)
                    cabeceraFinY = 8 + drawH + 4
                    doc.line(14, cabeceraFinY, 50, cabeceraFinY)
                    resolve()
                }
                img.onerror = () => {
                    // Fallback: texto en vez de imagen
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
        } catch {
            // Fallback por si falla la Promise
            doc.setFontSize(20)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(13, 110, 253)
            doc.text('CarTeis', 14, 20)
        }
    }

    // --- Título centrado ---
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text(titulo, 105, 20, { align: 'center' })

    // --- Datos de la empresa (derecha) ---
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text('CarTeis S.L.', 200, 30, { align: 'right' })
    doc.text('Avenida Galicia 101', 200, 35, { align: 'right' })
    doc.text('36216 Vigo, Pontevedra', 200, 40, { align: 'right' })
    doc.text('Tlfo: 986 666 333', 200, 45, { align: 'right' })
    doc.text('Email: carteis@example.com', 200, 50, { align: 'right' })

    // Línea separadora
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(14, 55, 196, 55)

    return 60 // Devuelve la Y donde empieza el contenido
}

/**
 * Aplica un pie de página estándar a TODAS las páginas del documento.
 * Llama a esta función JUSTO ANTES de doc.save().
 *
 * @param {jsPDF} doc          - Instancia de jsPDF
 * @param {string} textoIzq    - Texto del lado izquierdo del pie
 */
export function aplicarPieDePagina(doc, textoIzq = 'CarTeis - Su concesionario de confianza') {
    const totalPaginas = doc.getNumberOfPages()
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()

    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i)

        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.3)
        doc.line(14, pageH - 18, pageW - 14, pageH - 18)

        doc.setFontSize(8)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(128, 128, 128)
        doc.text(textoIzq, 14, pageH - 12)
        doc.text(`Página ${i} de ${totalPaginas}`, pageW - 14, pageH - 12, { align: 'right' })
    }
}

// ============================================================================
// 10. CHEATSHEET RÁPIDA (Resumen de métodos)
// ============================================================================
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ DOCUMENTO                                                                  │
// │   new jsPDF({ orientation, unit, format })   Crear documento               │
// │   doc.addPage(formato?, orientación?)        Añadir página                 │
// │   doc.setPage(n)                             Ir a página n                 │
// │   doc.getNumberOfPages()                     Total de páginas              │
// │   doc.internal.pageSize.getWidth()           Ancho de página               │
// │   doc.internal.pageSize.getHeight()          Alto de página                │
// │   doc.save('archivo.pdf')                    Descargar PDF                 │
// │   doc.output('blob')                         Obtener como Blob             │
// ├─────────────────────────────────────────────────────────────────────────────┤
// │ TEXTO                                                                      │
// │   doc.text(str, x, y, { align, maxWidth })   Escribir texto               │
// │   doc.setFont(familia, estilo)                Fuente                       │
// │   doc.setFontSize(puntos)                     Tamaño                       │
// │   doc.setTextColor(R, G, B)                   Color del texto              │
// │   doc.getTextWidth(str)                       Ancho del texto              │
// ├─────────────────────────────────────────────────────────────────────────────┤
// │ LÍNEAS Y FORMAS                                                            │
// │   doc.line(x1, y1, x2, y2)                   Línea                        │
// │   doc.rect(x, y, w, h, estilo)               Rectángulo                   │
// │   doc.roundedRect(x, y, w, h, rx, ry, est)   Rectángulo redondeado        │
// │   doc.circle(cx, cy, r, estilo)              Círculo                      │
// │   doc.ellipse(cx, cy, rx, ry, estilo)        Elipse                       │
// │   doc.triangle(x1,y1,x2,y2,x3,y3, estilo)   Triángulo                    │
// │   doc.setDrawColor(R, G, B)                   Color de trazo              │
// │   doc.setFillColor(R, G, B)                   Color de relleno            │
// │   doc.setLineWidth(mm)                        Grosor de línea             │
// │   doc.setLineDashPattern([trazo, esp], fase)   Línea punteada             │
// ├─────────────────────────────────────────────────────────────────────────────┤
// │ IMÁGENES                                                                   │
// │   doc.addImage(img, fmt, x, y, w, h)         Añadir imagen               │
// │   Formatos: 'PNG', 'JPEG', 'GIF', 'WEBP'                                 │
// ├─────────────────────────────────────────────────────────────────────────────┤
// │ TABLAS (jspdf-autotable)                                                   │
// │   autoTable(doc, { startY, head, body, foot, theme, ... })                │
// │   doc.lastAutoTable.finalY                   Posición Y final de tabla     │
// │   Temas: 'striped', 'grid', 'plain'                                       │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// ============================================================================

// ============================================================================
// 11. CÓMO USAR ESTA PLANTILLA EN TUS COMPONENTES VUE
// ============================================================================
//
// ---- EJEMPLO 1: Generar el PDF de ejemplo completo ----
//
//   <template>
//     <button @click="probarPDF">Generar PDF de ejemplo</button>
//   </template>
//
//   <script setup>
//   import { generarPDFEjemploCompleto } from '@/plantillas/plantillajspdf.js'
//
//   const probarPDF = () => {
//       generarPDFEjemploCompleto()
//   }
//   </script>
//
// ---- EJEMPLO 2: Usar las funciones auxiliares para tu propio PDF ----
//
//   <script setup>
//   import jsPDF from 'jspdf'
//   import autoTable from 'jspdf-autotable'
//   import { aplicarCabeceraCarTeis, aplicarPieDePagina } from '@/plantillas/plantillajspdf.js'
//   import logo from '@/assets/logo.png'
//
//   const generarMiPDF = async () => {
//       const doc = new jsPDF()
//
//       // 1. Aplicar cabecera reutilizable (devuelve la Y donde empieza tu contenido)
//       const startY = await aplicarCabeceraCarTeis(doc, logo, 'PRESUPUESTO')
//
//       // 2. Tu contenido personalizado
//       doc.setFont('helvetica', 'normal')
//       doc.setFontSize(10)
//       doc.text('Cliente: Juan Pérez', 14, startY)
//       doc.text('Fecha: 12/02/2026', 14, startY + 5)
//
//       // 3. Tu tabla personalizada
//       autoTable(doc, {
//           startY: startY + 15,
//           head: [['Servicio', 'Precio']],
//           body: [
//               ['Revisión completa', '150,00 €'],
//               ['Cambio de aceite', '45,00 €'],
//           ],
//           theme: 'striped',
//           headStyles: { fillColor: [13, 110, 253] },
//       })
//
//       // 4. Total
//       const finTabla = doc.lastAutoTable.finalY + 10
//       doc.setFont('helvetica', 'bold')
//       doc.setFontSize(14)
//       doc.text('TOTAL: 195,00 €', 196, finTabla, { align: 'right' })
//
//       // 5. Aplicar pie de página (SIEMPRE antes de save)
//       aplicarPieDePagina(doc)
//
//       // 6. Descargar
//       doc.save('presupuesto_CarTeis.pdf')
//   }
//   </script>
//
// ============================================================================
