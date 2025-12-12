import express from "express";
import {
    login,
    verificarToken,
    soloAdmin,
} from "../controllers/authController.js";

const router = express.Router();

// Rutas de autenticación
router.post("/login", login);
router.get("/verify", verificarToken);
router.get("/admin", soloAdmin);

export default router;
