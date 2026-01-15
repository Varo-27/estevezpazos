import express from "express";
import { Resend } from "resend";

const router = express.Router();

// Lazy initialization de Resend
let resend = null;
const getResend = () => {
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
};

router.post("/enviar", async (req, res) => {
    try {
        const { nombre, correo, asunto, mensaje } = req.body;

        if (!nombre || !correo || !asunto || !mensaje) {
            return res
                .status(400)
                .json({ error: "Todos los campos son obligatorios" });
        }

        const { data, error } = await getResend().emails.send({
            from: "Contacto <onboarding@resend.dev>",
            to: ["a24alvaroep@iesteis.es"],
            subject: `${asunto} - De: ${nombre}`,
            html: `
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${correo}</p>
                <p><strong>Asunto:</strong> ${asunto}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${mensaje}</p>
            `,
        });

        if (error) {
            return res
                .status(400)
                .json({ error: error.message || "Error al enviar el email" });
        }

        res.json({ message: "Email enviado correctamente", data });
    } catch (error) {
        console.error("Error al enviar email:", error);
        res.status(500).json({ error: "Error al enviar el mensaje" });
    }
});

export default router;
