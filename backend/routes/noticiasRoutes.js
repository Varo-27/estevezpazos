import express from "express";
import {
    readDB,
    writeDB,
    generateId,
    getCurrentDate,
} from "../utils/helpers.js";

const router = express.Router();

// GET - Obtener todas las noticias
router.get("/", async (req, res) => {
    try {
        const db = await readDB();
        const noticias = db.noticias || [];

        // Ordenar por fecha descendente (más recientes primero)
        noticias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        res.json(noticias);
    } catch (error) {
        console.error("Error al obtener noticias:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST - Crear nueva noticia
router.post("/", async (req, res) => {
    try {
        const nuevaNoticia = {
            id: generateId(),
            titulo: req.body.titulo,
            contenido: req.body.contenido,
            fecha: req.body.fecha || getCurrentDate(),
        };

        const db = await readDB();
        if (!db.noticias) db.noticias = [];
        db.noticias.unshift(nuevaNoticia);
        await writeDB(db);

        res.status(201).json(nuevaNoticia);
    } catch (error) {
        console.error("Error al crear noticia:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE - Eliminar noticia
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();

        if (!db.noticias) {
            return res.status(404).json({ error: "No hay noticias" });
        }

        const index = db.noticias.findIndex((n) => n.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Noticia no encontrada" });
        }

        db.noticias.splice(index, 1);
        await writeDB(db);

        res.json({ message: "Noticia eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar noticia:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
