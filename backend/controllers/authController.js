import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ USAR process.env.JWT_SECRET del archivo .env
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_123456";
const dbFile = path.join(__dirname, "../data/db.json");

// Credenciales de administrador (deberías usar bcrypt en producción)
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

export const login = async (req, res) => {
    try {
        const { dni, password } = req.body;

        console.log("🔐 Intento de login:", dni);
        console.log(
            "🔑 JWT_SECRET desde .env:",
            JWT_SECRET ? "CARGADO" : "NO CARGADO"
        );
        console.log(
            "🔑 Valor JWT_SECRET:",
            JWT_SECRET.substring(0, 10) + "..."
        );

        // Leer usuarios desde db.json
        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        const usuarios = db.clientes || [];
        const usuario = usuarios.find(
            (u) => u.dni && u.dni.toUpperCase() === dni.toUpperCase()
        );

        if (!usuario) {
            console.log("❌ Usuario no encontrado:", dni);
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        console.log("👤 Usuario encontrado:", {
            dni: usuario.dni,
            nombre: usuario.nombre,
            tipo: usuario.tipoCliente,
            tienePassword: !!usuario.password,
        });

        // Verificar password
        let passwordValida = false;

        if (usuario.password) {
            // Si la password está hasheada
            if (
                usuario.password.startsWith("$2b$") ||
                usuario.password.startsWith("$2a$")
            ) {
                console.log("🔐 Verificando password hasheada...");
                passwordValida = await bcrypt.compare(
                    password,
                    usuario.password
                );
            } else {
                // Si la password está en texto plano (solo para testing)
                console.log("🔐 Verificando password en texto plano...");
                passwordValida = password === usuario.password;
            }
        }

        console.log("🔐 Password válida:", passwordValida);

        if (!passwordValida) {
            console.log("❌ Password inválida para usuario:", dni);
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        console.log("✅ Usuario autenticado, generando token...");

        // ✅ Crear token con JWT_SECRET
        const token = jwt.sign(
            {
                id: usuario.id,
                dni: usuario.dni,
                tipo: usuario.tipoCliente || "user",
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        console.log("✅ Token generado correctamente");

        res.json({
            token,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            tipo: usuario.tipoCliente || "user",
        });
    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const verificarToken = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ valid: false });
    }

    // Aquí deberías verificar el token real
    res.json({
        valid: true,
        user: {
            username: ADMIN_USER,
            role: "admin",
        },
    });
};

export const soloAdmin = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No autorizado" });
    }

    res.json({ message: "Acceso permitido para admin" });
};

export const verificarAdmin = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ esAdmin: false });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Leer usuarios desde db.json
        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);
        const usuarios = db.clientes || [];

        const usuario = usuarios.find((u) => u.id === decoded.id);

        res.json({ esAdmin: usuario?.tipoCliente === "admin" });
    } catch (error) {
        console.error("Error al verificar admin:", error);
        res.status(401).json({ esAdmin: false });
    }
};
