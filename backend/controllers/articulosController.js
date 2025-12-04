const fs = require("fs").promises;
const path = require("path");

const dbFile = path.join(__dirname, "../data/db.json");

const getAllArticulos = async (req, res) => {
    try {
        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);
        const articulos = db.articulos || [];
        res.json(articulos);
    } catch (error) {
        console.error("Error al obtener artículos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const createArticulo = async (req, res) => {
    try {
        const nuevoArticulo = {
            id: Date.now().toString(),
            ...req.body,
            fecha_creacion: new Date().toISOString(),
        };

        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        if (!db.articulos) {
            db.articulos = [];
        }

        db.articulos.push(nuevoArticulo);

        await fs.writeFile(dbFile, JSON.stringify(db, null, 2));

        res.status(201).json(nuevoArticulo);
    } catch (error) {
        console.error("Error al crear artículo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const updateArticulo = async (req, res) => {
    try {
        const { id } = req.params;

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

        res.json(db.articulos[index]);
    } catch (error) {
        console.error("Error al actualizar artículo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const deleteArticulo = async (req, res) => {
    try {
        const { id } = req.params;

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

        res.json({ message: "Artículo eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar artículo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    getAllArticulos,
    createArticulo,
    updateArticulo,
    deleteArticulo,
};
