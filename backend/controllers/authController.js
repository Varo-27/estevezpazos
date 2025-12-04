const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;
const path = require("path");

const JWT_SECRET = "tu_secreto_super_seguro_aqui";
const dbFile = path.join(__dirname, "../data/db.json");

const login = async (req, res) => {
    try {
        const { dni, password } = req.body;

        console.log("🔐 Intento de login:", dni);

        // Leer usuarios desde db.json
        const data = await fs.readFile(dbFile, "utf8");
        const db = JSON.parse(data);

        const usuarios = db.clientes || [];
        const usuario = usuarios.find((u) => u.dni === dni.toUpperCase());

        if (!usuario) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Verificar password (asumiendo que está hasheada)
        const passwordValida = await bcrypt.compare(
            password,
            usuario.password || "$2a$10$default"
        );

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
            tipo: usuario.tipoCliente || "user",
        });
    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const verificarToken = (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token no proporcionado" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ error: "Token inválido" });
    }
};

const soloAdmin = (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token no proporcionado" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.tipo !== "admin") {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        res.json({ message: "Acceso autorizado", user: decoded });
    } catch (error) {
        res.status(401).json({ error: "Token inválido" });
    }
};

module.exports = { login, verificarToken, soloAdmin };
