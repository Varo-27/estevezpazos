import express from "express";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_PATH = path.join(__dirname, "..", "uploads");

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(UPLOADS_PATH)) {
            fs.mkdirSync(UPLOADS_PATH, { recursive: true });
        }
        cb(null, UPLOADS_PATH);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `vehiculo-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
    ];
    cb(null, allowedTypes.includes(file.mimetype));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

// Función auxiliar para eliminar imagen
// Soporta tanto el formato almacenado anteriormente ('/uploads/xxx')
// como el nuevo formato (solo 'xxx'). Borra desde la carpeta UPLOADS_PATH.
const eliminarImagen = (imagenPath) => {
    if (!imagenPath) return;
    const filename = path.basename(imagenPath); // extrae 'vehiculo-....png' de cualquiera de los formatos
    const fullPath = path.join(UPLOADS_PATH, filename);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};

// Función auxiliar para parsear datos del coche
const parseCocheData = (body) => {
    return body.cocheData ? JSON.parse(body.cocheData) : body;
};

// GET - Obtener todos los coches
router.get("/", async (req, res) => {
    try {
        const db = getDB();
        const coches = await db.collection("coches").find({}).toArray();
        res.json(coches);
    } catch (error) {
        console.error("Error al obtener coches:", error);
        res.status(500).json({ error: "Error al obtener coches" });
    }
});

// GET - Obtener coche por ID
router.get("/:id", async (req, res) => {
    try {
        const db = getDB();
        const coche = await db
            .collection("coches")
            .findOne({ _id: new ObjectId(req.params.id) });

        if (!coche) {
            return res.status(404).json({ error: "Coche no encontrado" });
        }

        res.json(coche);
    } catch (error) {
        console.error("Error al obtener coche:", error);
        res.status(500).json({ error: "Error al obtener coche" });
    }
});

// POST - Crear nuevo coche
router.post("/", upload.single("imagen"), async (req, res) => {
    try {
        const db = getDB();
        const cocheData = parseCocheData(req.body);

        const nuevoCoche = {
            ...cocheData,
            fecha_publicacion: cocheData.fecha_publicacion || new Date(),
            // Guardar solo el nombre del archivo en la BD
            imagen: req.file ? req.file.filename : null,
        };

        const result = await db.collection("coches").insertOne(nuevoCoche);
        const cocheCreado = await db
            .collection("coches")
            .findOne({ _id: result.insertedId });

        res.status(201).json(cocheCreado);
    } catch (error) {
        console.error("Error al crear coche:", error);
        res.status(500).json({ error: "Error al crear coche" });
    }
});

// PUT - Actualizar coche
router.put("/:id", upload.single("imagen"), async (req, res) => {
    try {
        const db = getDB();
        const datosActualizados = parseCocheData(req.body);
        delete datosActualizados._id;

        if (req.file) {
            const cocheActual = await db
                .collection("coches")
                .findOne({ _id: new ObjectId(req.params.id) });
            // eliminar la imagen anterior (si existe)
            eliminarImagen(cocheActual?.imagen);
            // Guardar solo el nombre del archivo en la BD
            datosActualizados.imagen = req.file.filename;
        }

        const result = await db
            .collection("coches")
            .findOneAndUpdate(
                { _id: new ObjectId(req.params.id) },
                { $set: datosActualizados },
                { returnDocument: "after" },
            );

        if (!result) {
            return res.status(404).json({ error: "Coche no encontrado" });
        }

        res.json(result);
    } catch (error) {
        console.error("Error al actualizar coche:", error);
        res.status(500).json({ error: "Error al actualizar coche" });
    }
});

// DELETE - Eliminar coche
router.delete("/:id", async (req, res) => {
    try {
        const db = getDB();
        const coche = await db
            .collection("coches")
            .findOne({ _id: new ObjectId(req.params.id) });

        eliminarImagen(coche?.imagen);

        const result = await db
            .collection("coches")
            .deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Coche no encontrado" });
        }

        res.json({ message: "Coche eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar coche:", error);
        res.status(500).json({ error: "Error al eliminar coche" });
    }
});

export default router;
