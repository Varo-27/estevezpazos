const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const dbFile = path.join(__dirname, "../data/db.json");

// GET - Obtener todas las noticias
router.get("/", async (req, res) => {
    try {
        console.log("📰 GET /api/noticias - Obteniendo noticias...");

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        const noticias = db.noticias || [];
        console.log(`📰 Encontradas ${noticias.length} noticias`);

        // Ordenar por fecha descendente (más recientes primero)
        noticias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        res.json(noticias);
    } catch (error) {
        console.error("❌ Error al obtener noticias:", error);
        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message,
        });
    }
});

// POST - Crear nueva noticia
router.post("/", async (req, res) => {
    try {
        console.log("📰 POST /api/noticias - Creando noticia:", req.body);

        const nuevaNoticia = {
            id: Math.random().toString(36).substring(2, 6),
            titulo: req.body.titulo,
            contenido: req.body.contenido,
            fecha: req.body.fecha || new Date().toISOString().split("T")[0],
        };

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.noticias) {
            db.noticias = [];
        }

        db.noticias.unshift(nuevaNoticia);

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
        console.log("✅ Noticia creada:", nuevaNoticia.id);

        res.status(201).json(nuevaNoticia);
    } catch (error) {
        console.error("❌ Error al crear noticia:", error);
        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message,
        });
    }
});

// DELETE - Eliminar noticia
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📰 DELETE /api/noticias/${id} - Eliminando noticia...`);

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.noticias) {
            return res.status(404).json({ error: "No hay noticias" });
        }

        const index = db.noticias.findIndex((n) => n.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Noticia no encontrada" });
        }

        db.noticias.splice(index, 1);

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
        console.log("✅ Noticia eliminada:", id);

        res.json({ message: "Noticia eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar noticia:", error);
        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message,
        });
    }
});

module.exports = router;
