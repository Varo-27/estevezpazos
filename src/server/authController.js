import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";

//Creamos el routing para que sirva en el server con app.use
const router = express.Router();

//funcion que se llamara y obtendra los datos enviados por authApi
async function login(req, res) {
    const { dni, password } = req.body;
    try {
        //Buscar usuario en JSON-Server
        const response = await axios.get(
            `http://localhost:3000/clientes?dni=${dni}`
        );
        const user = response.data[0];

        //Compara las contraseñas hasheando la que pasamos por parametro
        if (!user)
            return res.status(400).json({ message: "Usuario no encontrado" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            return res
                .status(400)
                .json({ message: "Usuario o Contraseña incorrecto" });

        const token = jwt.sign(
            {
                dni: user.dni,
                tipo: user.tipo || "user",
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );
        res.json({
            token,
            nombre: user.nombre,
            tipo: user.tipo || "user",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

router.post("/login", login);

//Hay que exportar el router para ser detectado por el express en el server
export default router;

/////////////// MEJOR EN UN FICHERO APARTE authMiddleware.js

// Middleware: verificar JWT
// Se usa en rutas que requieren autenticación
// Verifica el token enviado en el header Authorization

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization; // Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return res
            .status(401)
            .json({ mensaje: "Token no válido o no recibido" });

    const token = authHeader.split(" ")[1]; // separar "Bearer" del token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // guardar info del usuario en req
        next(); // continuar al controlador
    } catch (err) {
        console.error("Error verificando token:", err.message);
        return res.status(403).json({ mensaje: "Token inválido o expirado" });
    }
};

/// TAMBIEN EN EL FICHERO APARTE authMiddleware.js
// Middleware: solo admin
export const soloAdmin = (req, res, next) => {
    if (req.user?.tipo !== "admin") {
        return res
            .status(403)
            .json({ mensaje: "Acceso solo para administradores" });
    }
    next();
};
