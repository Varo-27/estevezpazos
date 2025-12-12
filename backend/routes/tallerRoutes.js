import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const dbFile = path.join(__dirname, "../data/db.json");

// GET - Obtener todas las citas
router.get("/", async (req, res) => {
    try {
        console.log("🔧 GET /api/taller - Obteniendo citas...");

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        const citas = db.taller || [];

        // Ordenar por fecha y hora
        citas.sort((a, b) => {
            const fechaA = new Date(`${a.fecha} ${a.hora}`);
            const fechaB = new Date(`${b.fecha} ${b.hora}`);
            return fechaA - fechaB;
        });

        console.log(`🔧 Encontradas ${citas.length} citas`);
        res.json(citas);
    } catch (error) {
        console.error("❌ Error al obtener citas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST - Crear nueva cita
router.post("/", async (req, res) => {
    try {
        console.log("🔧 POST /api/taller - Creando cita:", req.body);

        const nuevaCita = {
            id: Math.random().toString(36).substring(2, 6),
            ...req.body,
            estado: req.body.estado || "pendiente",
        };

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.taller) {
            db.taller = [];
        }

        db.taller.push(nuevaCita);

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
        console.log("✅ Cita creada:", nuevaCita.id);

        res.status(201).json(nuevaCita);
    } catch (error) {
        console.error("❌ Error al crear cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// PUT - Actualizar cita
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔧 PUT /api/taller/${id}`);

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.taller) {
            return res.status(404).json({ error: "No hay citas" });
        }

        const index = db.taller.findIndex((c) => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        db.taller[index] = { ...db.taller[index], ...req.body };

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
        console.log("✅ Cita actualizada:", id);

        res.json(db.taller[index]);
    } catch (error) {
        console.error("❌ Error al actualizar cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE - Eliminar cita
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔧 DELETE /api/taller/${id}`);

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.taller) {
            return res.status(404).json({ error: "No hay citas" });
        }

        const index = db.taller.findIndex((c) => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        db.taller.splice(index, 1);

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
        console.log("✅ Cita eliminada:", id);

        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
