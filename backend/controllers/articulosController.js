import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, "../data/db.json");

export const getAllArticulos = async (req, res) => {
    try {
        console.log("🚗 GET /api/articulos - Obteniendo artículos...");

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        const articulos = db.articulos || [];
        console.log(`🚗 Encontrados ${articulos.length} artículos`);

        res.json(articulos);
    } catch (error) {
        console.error("❌ Error al obtener artículos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createArticulo = async (req, res) => {
    try {
        console.log("🚗 POST /api/articulos - Creando artículo:", req.body);

        const nuevoArticulo = {
            id: Math.random().toString(36).substring(2, 6),
            ...req.body,
            fecha_entrada:
                req.body.fecha_entrada ||
                new Date().toISOString().split("T")[0],
        };

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.articulos) {
            db.articulos = [];
        }

        db.articulos.push(nuevoArticulo);

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
        console.log("✅ Artículo creado:", nuevoArticulo.id);

        res.status(201).json(nuevoArticulo);
    } catch (error) {
        console.error("❌ Error al crear artículo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const updateArticulo = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🚗 PUT /api/articulos/${id}`);

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.articulos) {
            return res.status(404).json({ error: "No hay artículos" });
        }

        const index = db.articulos.findIndex((a) => a.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Artículo no encontrado" });
        }

        db.articulos[index] = { ...db.articulos[index], ...req.body };

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
        console.log("✅ Artículo actualizado:", id);

        res.json(db.articulos[index]);
    } catch (error) {
        console.error("❌ Error al actualizar artículo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteArticulo = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🚗 DELETE /api/articulos/${id}`);

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.articulos) {
            return res.status(404).json({ error: "No hay artículos" });
        }

        const index = db.articulos.findIndex((a) => a.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Artículo no encontrado" });
        }

        db.articulos.splice(index, 1);

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
        console.log("✅ Artículo eliminado:", id);

        res.json({ message: "Artículo eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar artículo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
