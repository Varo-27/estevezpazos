import { MongoClient } from "mongodb";

const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb://admin:admin@localhost:27017/admin?authSource=admin";
const DB_NAME = "admin";

let client = null;
let db = null;

export const conectarDB = async () => {
    if (db) return db;

    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log("Conectado a MongoDB");
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
