import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Configuración de rutas base
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const DB_FILE = path.join(__dirname, "../data/db.json");
export const UPLOADS_PATH = path.join(__dirname, "../uploads");

/**
 * Lee y parsea el archivo db.json
 * @returns {Promise<Object>} Contenido del archivo db.json
 */
export const readDB = async () => {
    const data = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(data);
};

/**
 * Escribe datos en el archivo db.json
 * @param {Object} data - Datos a escribir
 */
export const writeDB = async (data) => {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
};

/**
 * Genera un ID único corto
 * @returns {string} ID de 4 caracteres
 */
export const generateId = () => {
    return Math.random().toString(36).substring(2, 6);
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
export const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
};
