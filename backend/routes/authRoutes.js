import express from "express";
import {
    login,
    verificarToken,
    verificarAdmin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/verify", verificarToken);
router.get("/verificar-admin", verificarAdmin);

export default router;
