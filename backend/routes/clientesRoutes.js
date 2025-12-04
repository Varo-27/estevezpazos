const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

// Cambiar la ruta para usar db.json en lugar de clientes.json
const dbFile = path.join(__dirname, "../data/db.json");

// GET - Obtener todos los clientes
router.get("/", async (req, res) => {
    try {
        const { historico } = req.query;

        // Leer archivo JSON completo
        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);
        let clientes = db.clientes || [];

        // Filtrar por histórico si se especifica
        if (historico !== undefined) {
            const esHistorico = historico === "true";
            clientes = clientes.filter(
                (cliente) => cliente.historico === esHistorico
            );
        }

        // Ordenar por apellidos
        clientes.sort((a, b) => a.apellidos.localeCompare(b.apellidos));

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

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);
        const clientes = db.clientes || [];

        const cliente = clientes.find(
            (c) => c.dni.toUpperCase() === dni.toUpperCase()
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
            id: Date.now().toString(36) + Math.random().toString(36).substr(2), // ID único
            fecha_alta:
                req.body.fecha_alta || new Date().toISOString().split("T")[0],
        };

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.clientes) {
            db.clientes = [];
        }

        db.clientes.push(nuevoCliente);

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));

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

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);
        let clientes = db.clientes || [];

        const index = clientes.findIndex((c) => c.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        clientes[index] = { ...clientes[index], ...req.body };
        db.clientes = clientes;

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));

        res.json(clientes[index]);
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE - Eliminar cliente (soft delete)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);
        let clientes = db.clientes || [];

        const index = clientes.findIndex((c) => c.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        // Soft delete - marcar como histórico false
        clientes[index].historico = false;
        db.clientes = clientes;

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));

        res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
