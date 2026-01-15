import express from "express";
import { readDB, writeDB, generateId } from "../utils/helpers.js";

const router = express.Router();

// GET - Obtener todas las citas
router.get("/", async (req, res) => {
    try {
        const db = await readDB();
        const citas = db.taller || [];

        // Ordenar por fecha y hora
        citas.sort((a, b) => {
            const fechaA = new Date(`${a.fecha} ${a.hora}`);
            const fechaB = new Date(`${b.fecha} ${b.hora}`);
            return fechaA - fechaB;
        });

        res.json(citas);
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST - Crear nueva cita
router.post("/", async (req, res) => {
    try {
        const nuevaCita = {
            id: generateId(),
            ...req.body,
            estado: req.body.estado || "pendiente",
        };

        const db = await readDB();
        if (!db.taller) db.taller = [];
        db.taller.push(nuevaCita);
        await writeDB(db);

        res.status(201).json(nuevaCita);
    } catch (error) {
        console.error("Error al crear cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// PUT - Actualizar cita
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();

        if (!db.taller) {
            return res.status(404).json({ error: "No hay citas" });
        }

        const index = db.taller.findIndex((c) => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        db.taller[index] = { ...db.taller[index], ...req.body };
        await writeDB(db);

        res.json(db.taller[index]);
    } catch (error) {
        console.error("Error al actualizar cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE - Eliminar cita
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();

        if (!db.taller) {
            return res.status(404).json({ error: "No hay citas" });
        }

        const index = db.taller.findIndex((c) => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        db.taller.splice(index, 1);
        await writeDB(db);

        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
