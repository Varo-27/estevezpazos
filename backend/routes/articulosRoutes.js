const express = require("express");
const {
    getAllArticulos,
    createArticulo,
    updateArticulo,
    deleteArticulo,
} = require("../controllers/articulosController.js");

const router = express.Router();

router.get("/", getAllArticulos);
router.post("/", createArticulo);
router.put("/:id", updateArticulo);
router.delete("/:id", deleteArticulo);

module.exports = router;
