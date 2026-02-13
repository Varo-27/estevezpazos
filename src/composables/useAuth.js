import { ref, computed } from "vue";
import { loginUsuario } from "@/api/auth.js";
import Swal from "sweetalert2";

// Estado global compartido
const isLogueado = ref(false);
const user = ref(null);

export function useAuth() {
    const isAdmin = computed(() => user.value?.tipo === "admin");
    const userName = computed(() => user.value?.nombre || "");
    const userFullName = computed(() => {
        if (!user.value?.nombre) return "";
        return `${user.value.nombre}${user.value.apellidos ? ' ' + user.value.apellidos : ''}`;
    });
    const userDNI = computed(() => user.value?.dni || "");

    const initAuth = () => {
        const token = sessionStorage.getItem("token");
        const userName = sessionStorage.getItem("userName");
        const userLastName = sessionStorage.getItem("userLastName");
        const userDNI = sessionStorage.getItem("userDNI");
        const userType = sessionStorage.getItem("userType");

        if (token && userName) {
            isLogueado.value = true;
            user.value = {
                nombre: userName,
                apellidos: userLastName,
                dni: userDNI,
                tipo: userType
            };
        }
    };

    const login = async (dni, password) => {
        try {
            const data = await loginUsuario(dni, password);

            // Actualizar estado
            isLogueado.value = true;
            user.value = {
                nombre: data.nombre,
                apellidos: data.apellidos,
                dni: data.dni,
                tipo: data.tipo || "user"
            };

            // Guardar en sessionStorage
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("userName", data.nombre);
            sessionStorage.setItem("userLastName", data.apellidos || "");
            sessionStorage.setItem("userDNI", data.dni || "");
            sessionStorage.setItem("userType", data.tipo || "user");

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
        userFullName,
        userDNI,
        initAuth,
        login,
        logout,
    };
}
