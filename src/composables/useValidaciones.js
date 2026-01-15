export function useValidaciones() {
    /**
     * Capitaliza texto (Title Case)
     * @param {string} texto
     * @returns {string}
     */
    const capitalizar = (texto) => {
        if (!texto) return "";
        return texto
            .toLowerCase()
            .split(" ")
            .map((palabra) => {
                if (!palabra) return "";
                return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
            })
            .join(" ");
    };

    /**
     * Convierte texto a mayúsculas
     * @param {string} texto
     * @returns {string}
     */
    const mayusculas = (texto) => {
        return (texto ?? "").toUpperCase();
    };

    /**
     * Valida email
     * @param {string} email
     * @returns {boolean}
     */
    const esEmailValido = (email) => {
        if (!email || email.trim() === "") return true;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email.trim());
    };

    /**
     * Valida móvil español (comienza con 6 o 7, 9 dígitos)
     * @param {string} movil
     * @returns {boolean}
     */
    const esMovilValido = (movil) => {
        if (!movil || movil.trim() === "") return true;
        const movilRegex = /^[67]\d{8}$/;
        return movilRegex.test(movil.trim());
    };

    /**
     * Valida DNI o NIE español
     * @param {string} valor
     * @returns {boolean}
     */
    const esDniNieValido = (valor) => {
        if (!valor) return false;
        const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
        const dniRegex = /^[0-9]{8}[A-Z]$/;
        const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

        valor = valor.toUpperCase().trim();

        if (dniRegex.test(valor)) {
            const numero = parseInt(valor.slice(0, 8), 10);
            const letra = valor.charAt(8);
            return letra === letras[numero % 23];
        } else if (nieRegex.test(valor)) {
            const nie = valor
                .replace("X", "0")
                .replace("Y", "1")
                .replace("Z", "2");
            const numero = parseInt(nie.slice(0, 8), 10);
            const letra = valor.charAt(8);
            return letra === letras[numero % 23];
        }
        return false;
    };

    /**
     * Formatea fecha para input type="date" (yyyy-mm-dd)
     * @param {string} fecha - Fecha en formato dd/mm/yyyy o yyyy-mm-dd
     * @returns {string}
     */
    const formatearFechaInput = (fecha) => {
        if (!fecha) return "";

        if (fecha.includes("/")) {
            const [dd, mm, yyyy] = fecha.split("/");
            return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
        }

        if (fecha.includes("-")) {
            const partes = fecha.split("-");
            if (partes.length === 3) return fecha;
        }

        return "";
    };

    /**
     * Formatea fecha ISO para mostrar (dd/mm/yyyy)
     * @param {string} fecha - Fecha ISO o yyyy-mm-dd
     * @returns {string}
     */
    const formatearFechaDisplay = (fecha) => {
        if (!fecha) return "";
        const date = new Date(fecha);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleDateString("es-ES");
    };

    return {
        capitalizar,
        mayusculas,
        esEmailValido,
        esMovilValido,
        esDniNieValido,
        formatearFechaInput,
        formatearFechaDisplay,
    };
}
