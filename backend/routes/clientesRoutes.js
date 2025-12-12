import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const dbFile = path.join(__dirname, "../data/db.json");

// GET - Obtener todos los clientes
router.get("/", async (req, res) => {
    try {
        console.log("👥 GET /api/clientes - Obteniendo clientes...");

        const { historico } = req.query;

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
        clientes.sort((a, b) =>
            (a.apellidos || "").localeCompare(b.apellidos || "")
        );

        console.log(`👥 Encontrados ${clientes.length} clientes`);
        res.json(clientes);
    } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// GET - Obtener cliente por DNI
router.get("/dni/:dni", async (req, res) => {
    try {
        const { dni } = req.params;
        console.log(`👥 GET /api/clientes/dni/${dni}`);

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        const clientes = db.clientes || [];
        const cliente = clientes.find(
            (c) => c.dni && c.dni.toUpperCase() === dni.toUpperCase()
        );

        if (!cliente) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json(cliente);
    } catch (error) {
        console.error("❌ Error al buscar cliente por DNI:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST - Crear nuevo cliente
router.post("/", async (req, res) => {
    try {
        console.log("👥 POST /api/clientes - Creando cliente:", req.body);

        const nuevoCliente = {
            ...req.body,
            id: Math.random().toString(36).substring(2, 6),
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
        console.log("✅ Cliente creado:", nuevoCliente.id);

        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error("❌ Error al crear cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// PUT - Actualizar cliente
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`👥 PUT /api/clientes/${id}`);

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.clientes) {
            return res.status(404).json({ error: "No hay clientes" });
        }

        const index = db.clientes.findIndex((c) => c.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        db.clientes[index] = { ...db.clientes[index], ...req.body };

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
        console.log("✅ Cliente actualizado:", id);

        res.json(db.clientes[index]);
    } catch (error) {
        console.error("❌ Error al actualizar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE - Eliminar cliente (soft delete)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`👥 DELETE /api/clientes/${id}`);

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.clientes) {
            return res.status(404).json({ error: "No hay clientes" });
        }

        const index = db.clientes.findIndex((c) => c.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        // Soft delete - marcar como histórico false
        db.clientes[index].historico = false;

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
        console.log("✅ Cliente eliminado (soft delete):", id);

        res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
