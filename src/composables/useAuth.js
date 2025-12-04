import { ref, computed } from "vue";
import { loginUsuario } from "@/api/auth.js";
import Swal from "sweetalert2";

// Estado global compartido
const isLogueado = ref(false);
const user = ref(null);

export function useAuth() {
    const isAdmin = computed(() => user.value?.tipo === "admin");
    const userName = computed(() => user.value?.nombre || "");

    const initAuth = () => {
        const token = sessionStorage.getItem("token");
        const userName = sessionStorage.getItem("userName");

        if (token && userName) {
            isLogueado.value = true;
            user.value = { nombre: userName };
        }
    };

    const login = async (dni, password) => {
        try {
            const data = await loginUsuario(dni, password);

            // Actualizar estado
            isLogueado.value = true;
            user.value = { nombre: data.nombre, tipo: data.tipo || "user" };

            // Guardar en sessionStorage
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("userName", data.nombre);

            Swal.fire({
                title: "Bienvenido",
                text: `Hola ${data.nombre}`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            return data;
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Credenciales incorrectas",
                icon: "error",
            });
            throw error;
        }
    };

    const logout = () => {
        isLogueado.value = false;
        user.value = null;
        sessionStorage.clear();

        Swal.fire({
            title: "Sesión cerrada",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
        });
    };

    return {
        isLogueado: computed(() => isLogueado.value),
        isAdmin,
        userName,
        initAuth,
        login,
        logout,
    };
}
