const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const citasFile = path.join(__dirname, "../data/citas.json");

// GET - Obtener todas las citas
router.get("/", async (req, res) => {
    try {
        const data = await fs.readFile(citasFile, "utf8");
        const citas = JSON.parse(data);

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
            id: Date.now().toString(),
            ...req.body,
            estado: req.body.estado || "pendiente",
        };

        const data = await fs.readFile(citasFile, "utf8");
        const citas = JSON.parse(data);

        citas.push(nuevaCita);

        await fs.writeFile(citasFile, JSON.stringify(citas, null, 2));

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

        const data = await fs.readFile(citasFile, "utf8");
        let citas = JSON.parse(data);

        const index = citas.findIndex((c) => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        citas[index] = { ...citas[index], ...req.body };

        await fs.writeFile(citasFile, JSON.stringify(citas, null, 2));

        res.json(citas[index]);
    } catch (error) {
        console.error("Error al actualizar cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE - Eliminar cita
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const data = await fs.readFile(citasFile, "utf8");
        let citas = JSON.parse(data);

        const index = citas.findIndex((c) => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        citas.splice(index, 1);

        await fs.writeFile(citasFile, JSON.stringify(citas, null, 2));

        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
