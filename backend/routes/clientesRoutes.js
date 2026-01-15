import express from "express";
import {
    readDB,
    writeDB,
    generateId,
    getCurrentDate,
} from "../utils/helpers.js";

const router = express.Router();

// GET - Obtener todos los clientes
router.get("/", async (req, res) => {
    try {
        const { historico } = req.query;
        const db = await readDB();
        let clientes = db.clientes || [];

        // Filtrar por histórico si se especifica
        if (historico !== undefined) {
            const esHistorico = historico === "true";
            clientes = clientes.filter(
                (cliente) => cliente.historico === esHistorico
            );
        }

        // Ordenar por apellidos
        clientes.sort((a, b) =>
            (a.apellidos || "").localeCompare(b.apellidos || "")
        );

        res.json(clientes);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// GET - Obtener cliente por DNI
router.get("/dni/:dni", async (req, res) => {
    try {
        const { dni } = req.params;
        const db = await readDB();
        const clientes = db.clientes || [];
        const cliente = clientes.find(
            (c) => c.dni && c.dni.toUpperCase() === dni.toUpperCase()
        );

        if (!cliente) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json(cliente);
    } catch (error) {
        console.error("Error al buscar cliente por DNI:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST - Crear nuevo cliente
router.post("/", async (req, res) => {
    try {
        const nuevoCliente = {
            ...req.body,
            id: generateId(),
            fecha_alta: req.body.fecha_alta || getCurrentDate(),
        };

        const db = await readDB();
        if (!db.clientes) db.clientes = [];
        db.clientes.push(nuevoCliente);
        await writeDB(db);

        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error("Error al crear cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// PUT - Actualizar cliente
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();

        if (!db.clientes) {
            return res.status(404).json({ error: "No hay clientes" });
        }

        const index = db.clientes.findIndex((c) => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        db.clientes[index] = { ...db.clientes[index], ...req.body };
        await writeDB(db);

        res.json(db.clientes[index]);
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE - Eliminar cliente (soft delete)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();

        if (!db.clientes) {
            return res.status(404).json({ error: "No hay clientes" });
        }

        const index = db.clientes.findIndex((c) => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        // Soft delete - marcar como histórico
        db.clientes[index].historico = false;
        await writeDB(db);

        res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
