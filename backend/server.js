import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

// Configuración para __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar CORS
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Log de requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ✅ IMPORTAR TODAS LAS RUTAS
import authRoutes from "./routes/authRoutes.js";
import articulosRoutes from "./routes/articulosRoutes.js";
import clientesRoutes from "./routes/clientesRoutes.js";
import noticiasRoutes from "./routes/noticiasRoutes.js";
import tallerRoutes from "./routes/tallerRoutes.js";
import contactoRoutes from "./routes/contactoRoutes.js";

// ✅ USAR TODAS LAS RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/articulos", articulosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/noticias", noticiasRoutes);
app.use("/api/taller", tallerRoutes);
app.use("/api/contacto", contactoRoutes);

// ✅ ENDPOINTS PARA DATOS ESTÁTICOS
app.get("/api/provmuni", (req, res) => {
    try {
        const provmuniData = JSON.parse(
            readFileSync(path.join(__dirname, "data/provmuni.json"), "utf-8")
        );
        res.json(provmuniData);
    } catch (error) {
        console.error("Error al cargar provmuni:", error);
        res.status(500).json({ error: "Error al cargar datos de provincias" });
    }
});

app.get("/api/coches", (req, res) => {
    try {
        const cochesData = JSON.parse(
            readFileSync(path.join(__dirname, "data/coches.json"), "utf-8")
        );
        res.json(cochesData);
    } catch (error) {
        console.error("Error al cargar coches:", error);
        res.status(500).json({ error: "Error al cargar datos de coches" });
    }
});

// Ruta base
app.get("/", (req, res) => {
    res.json({
        message: "✅ Servidor funcionando correctamente",
        timestamp: new Date().toISOString(),
        routes: [
            "GET  /api/auth/login",
            "GET  /api/auth/verify",
            "GET  /api/articulos",
            "POST /api/articulos",
            "GET  /api/clientes",
            "POST /api/clientes",
            "GET  /api/noticias",
            "POST /api/noticias",
            "GET  /api/taller",
            "POST /api/taller",
            "GET  /api/provmuni",
            "GET  /api/coches",
            "POST /api/contacto/enviar",
        ],
    });
});

// Middleware de error
app.use((err, req, res, next) => {
    console.error("Error del servidor:", err);
    res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📁 Rutas API disponibles:`);
    console.log(`   🔐 /api/auth/login`);
    console.log(`   🚗 /api/articulos`);
    console.log(`   👥 /api/clientes`);
    console.log(`   📰 /api/noticias`);
    console.log(`   🔧 /api/taller`);
    console.log(`   🌍 /api/provmuni`);
    console.log(`   🚙 /api/coches`);
    console.log(`   📧 /api/contacto/enviar`);
});

export default app;
