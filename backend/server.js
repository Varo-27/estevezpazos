import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { conectarDB } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Log de requests (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Importar rutas
import authRoutes from "./routes/authRoutes.js";
import clientesRoutes from "./routes/clientesRoutes.js";
import noticiasRoutes from "./routes/noticiasRoutes.js";
import tallerRoutes from "./routes/tallerRoutes.js";
import contactoRoutes from "./routes/contactoRoutes.js";
import cochesRoutes from "./routes/cochesRoutes.js";
import facturasRoutes from "./routes/facturasRoutes.js";
import Stripe from "stripe";

// Configuración de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Registrar rutas
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/noticias", noticiasRoutes);
app.use("/api/taller", tallerRoutes);
app.use("/api/contacto", contactoRoutes);
app.use("/api/coches", cochesRoutes);
app.use("/api/facturas", facturasRoutes);

// Endpoint para datos estáticos de provincias/municipios
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

// Ruta para crear sesión de checkout con Stripe
app.post("/crear-checkout-session", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Items requeridos" });
        }

        const lineItems = items.map((item) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.nombre,
                },
                unit_amount: Math.round(item.precio * 100), // convertir a céntimos
            },
            quantity: item.cantidad,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Internal Server Error" });
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

// Iniciar servidor
const iniciarServidor = async () => {
    try {
        await conectarDB();
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar servidor:", error);
        process.exit(1);
    }
};

iniciarServidor();

export default app;
