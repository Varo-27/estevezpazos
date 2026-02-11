import { MongoClient } from "mongodb";

const DB_NAME = "bbdd";

let client = null;
let db = null;

export const conectarDB = async () => {
    if (db) return db;

    try {
        // Leer la URI aquí (lazy) para que process.env ya esté cargado por server.js
        const MONGO_URI = process.env.MONGO_URI;

        client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log("✅ Conectado a MongoDB");
        return db;
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        throw error;
    }
};

export const getDB = () => {
    if (!db) {
        throw new Error(
            "Base de datos no conectada. Llama a conectarDB() primero."
        );
    }
    return db;
};

export const cerrarDB = async () => {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
};
