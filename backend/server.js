const express = require("express");
const cors = require("cors");
const path = require("path");

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
const authRoutes = require("./routes/authRoutes");
const articulosRoutes = require("./routes/articulosRoutes");
const clientesRoutes = require("./routes/clientesRoutes");
const noticiasRoutes = require("./routes/noticiasRoutes");
const tallerRoutes = require("./routes/tallerRoutes");

// ✅ USAR TODAS LAS RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/articulos", articulosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/noticias", noticiasRoutes);
app.use("/api/taller", tallerRoutes);

// ✅ ENDPOINTS PARA DATOS ESTÁTICOS
app.get("/api/provmuni", (req, res) => {
    try {
        const provmuniData = require("./data/provmuni.json");
        res.json(provmuniData);
    } catch (error) {
        console.error("Error al cargar provmuni:", error);
        res.status(500).json({ error: "Error al cargar datos de provincias" });
    }
});

app.get("/api/coches", (req, res) => {
    try {
        const cochesData = require("./data/coches.json");
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
});

module.exports = app;
