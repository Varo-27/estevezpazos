import express from "express";
import {
    getAllArticulos,
    createArticulo,
    updateArticulo,
    deleteArticulo,
} from "../controllers/articulosController.js";

const router = express.Router();

router.get("/", getAllArticulos);
router.post("/", createArticulo);
router.put("/:id", updateArticulo);
router.delete("/:id", deleteArticulo);

export default router;
