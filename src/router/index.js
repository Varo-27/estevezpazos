import { createRouter, createWebHistory } from "vue-router";

// Componentes comunes
import NotFound from "@/components/common/NotFound.vue";

// Componentes de páginas
import AvisoLegal from "@/components/pages/AvisoLegal.vue";
import Buscar from "@/components/pages/Buscar.vue";
import Cesta from "@/components/pages/Cesta.vue";
import CitasTaller from "@/components/pages/CitasTaller.vue";
import ConTacto from "@/components/pages/ConTacto.vue";
import GestionClientes from "@/components/pages/GestionClientes.vue";
import ModeLos from "@/components/pages/ModeLos.vue";
import NoTicias from "@/components/pages/NoTicias.vue";
import PoliticaPrivacidad from "@/components/pages/PoliticaPrivacidad.vue";
import PaginaInicio from "@/components/pages/PaginaInicio.vue";
import Ventas from "@/components/pages/Ventas.vue";
import Success from "@/components/pages/Success.vue";
import Cancel from "@/components/pages/Cancel.vue";

// Componentes de autenticación
import TablaLogin from "@/components/auth/TablaLogin.vue";

// API
import { api } from "@/api";

const routes = [
    {
        path: "/",
        name: "Inicio",
        component: PaginaInicio,
    },
    {
        path: "/clientes",
        name: "GestionClientes",
        component: GestionClientes,
    },
    {
        path: "/noticias",
        name: "NoTicias",
        component: NoTicias,
    },
    {
        path: "/modelos",
        name: "ModeLos",
        component: ModeLos,
        meta: { requiresAdmin: true },
    },
    {
        path: "/taller",
        name: "CitasTaller",
        component: CitasTaller,
        meta: { requiresAdmin: true },
    },
    {
        path: "/ventas",
        name: "Ventas",
        component: Ventas,
    },
    {
        path: "/aviso-legal",
        name: "AvisoLegal",
        component: AvisoLegal,
    },
    {
        path: "/politica-privacidad",
        name: "PoliticaPrivacidad",
        component: PoliticaPrivacidad,
    },
    {
        path: "/login",
        name: "TablaLogin",
        component: TablaLogin,
    },
    {
        path: "/contacto",
        name: "ConTacto",
        component: ConTacto,
    },
    {
        path: "/buscar",
        name: "Buscar",
        component: Buscar,
    },
    {
        path: "/cesta",
        name: "Cesta",
        component: Cesta,
    },
    {
        path: "/success",
        name: "Success",
        component: Success,
    },
    {
        path: "/cancel",
        name: "Cancel",
        component: Cancel,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const token = sessionStorage.getItem("token");

    // Si la ruta requiere ser admin
    if (to.meta.requiresAdmin) {
        // Si no hay token → al login
        if (!token) return next({ name: "TablaLogin" });

        try {
            // Consultar al backend si es admin
            const response = await api.get("/auth/verificar-admin");

            if (!response.data.esAdmin) {
                return next({ name: "Inicio" });
            }
        } catch (error) {
            console.error("Error al verificar admin:", error);
            return next({ name: "TablaLogin" });
        }
    }

    next();
});

export default router;
