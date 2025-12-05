const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;
const path = require("path");

// ✅ USAR process.env.JWT_SECRET del archivo .env
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_123456";
const dbFile = path.join(__dirname, "../data/db.json");

const login = async (req, res) => {
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
            JWT_SECRET, // ✅ Esta variable debe tener valor del .env
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

const verificarToken = (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token no proporcionado" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        console.error("❌ Error verificando token:", error);
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
        console.error("❌ Error en soloAdmin:", error);
        res.status(401).json({ error: "Token inválido" });
    }
};

module.exports = { login, verificarToken, soloAdmin };
