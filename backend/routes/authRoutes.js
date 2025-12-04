const express = require("express");
const {
    login,
    verificarToken,
    soloAdmin,
} = require("../controllers/authController.js");

const router = express.Router();

// Rutas de autenticación
router.post("/login", login);
router.get("/verify", verificarToken);
router.get("/admin", soloAdmin);

module.exports = router;
