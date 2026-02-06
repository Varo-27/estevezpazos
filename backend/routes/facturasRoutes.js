import express from "express";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET - Obtener todas las facturas
router.get("/", async (req, res) => {
    try {
        const db = getDB();
        const facturas = await db
            .collection("facturas")
            .find({})
            .sort({ fecha: -1 })
            .toArray();
        res.json(facturas);
    } catch (error) {
        console.error("Error al obtener facturas:", error);
        res.status(500).json({ error: "Error al obtener facturas" });
    }
});

// GET - Obtener factura por ID
router.get("/:id", async (req, res) => {
    try {
        const db = getDB();
        const factura = await db
            .collection("facturas")
            .findOne({ _id: new ObjectId(req.params.id) });

        if (!factura) {
            return res.status(404).json({ error: "Factura no encontrada" });
        }

        res.json(factura);
    } catch (error) {
        console.error("Error al obtener factura:", error);
        res.status(500).json({ error: "Error al obtener factura" });
    }
});

// POST - Crear nueva factura
router.post("/", async (req, res) => {
    try {
        const db = getDB();
        const { numeroFactura, nombreUsuario, productos, total, fecha } =
            req.body;

        // Validaciones
        if (!nombreUsuario || !productos || !total) {
            return res.status(400).json({
                error: "Faltan datos requeridos (nombreUsuario, productos, total)",
            });
        }

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                error: "Los productos deben ser un array no vacío",
            });
        }

        const nuevaFactura = {
            numeroFactura:
                numeroFactura ||
                `F-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, "0")}`,
            nombreUsuario,
            productos: productos.map((p) => ({
                id: p.id,
                nombre: p.nombre,
                precio: p.precio,
                cantidad: p.cantidad,
                total: p.total || p.precio * p.cantidad,
            })),
            total: parseFloat(total),
            fecha: fecha || new Date(),
        };

        const result = await db.collection("facturas").insertOne(nuevaFactura);

        res.status(201).json({
            message: "Factura creada exitosamente",
            facturaId: result.insertedId,
            factura: { _id: result.insertedId, ...nuevaFactura },
        });
    } catch (error) {
        console.error("Error al crear factura:", error);
        res.status(500).json({ error: "Error al crear factura" });
    }
});

// GET - Obtener facturas por nombre de usuario
router.get("/usuario/:nombreUsuario", async (req, res) => {
    try {
        const db = getDB();
        const facturas = await db
            .collection("facturas")
            .find({ nombreUsuario: req.params.nombreUsuario })
            .sort({ fecha: -1 })
            .toArray();

        res.json(facturas);
    } catch (error) {
        console.error("Error al obtener facturas del usuario:", error);
        res.status(500).json({ error: "Error al obtener facturas del usuario" });
    }
});

export default router;
