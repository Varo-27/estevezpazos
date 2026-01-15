import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { readDB } from "../utils/helpers.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_123456";

export const login = async (req, res) => {
    try {
        const { dni, password } = req.body;

        const db = await readDB();
        const usuarios = db.clientes || [];
        const usuario = usuarios.find(
            (u) => u.dni && u.dni.toUpperCase() === dni.toUpperCase()
        );

        if (!usuario) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Verificar password
        let passwordValida = false;

        if (usuario.password) {
            // Si la password está hasheada
            if (
                usuario.password.startsWith("$2b$") ||
                usuario.password.startsWith("$2a$")
            ) {
                passwordValida = await bcrypt.compare(
                    password,
                    usuario.password
                );
            } else {
                // Password en texto plano (solo para testing)
                passwordValida = password === usuario.password;
            }
        }

        if (!passwordValida) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Crear token
        const token = jwt.sign(
            {
                id: usuario.id,
                dni: usuario.dni,
                tipo: usuario.tipoCliente || "user",
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            token,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            tipo: usuario.tipoCliente || "user",
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const verificarToken = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ valid: false });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            valid: true,
            user: {
                id: decoded.id,
                dni: decoded.dni,
                tipo: decoded.tipo,
            },
        });
    } catch {
        res.status(401).json({ valid: false });
    }
};

export const verificarAdmin = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ esAdmin: false });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const db = await readDB();
        const usuarios = db.clientes || [];
        const usuario = usuarios.find((u) => u.id === decoded.id);

        res.json({ esAdmin: usuario?.tipoCliente === "admin" });
    } catch {
        res.status(401).json({ esAdmin: false });
    }
};
