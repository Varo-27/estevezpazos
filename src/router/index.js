import { createRouter, createWebHistory } from "vue-router";

// Componentes comunes
import NotFound from "@/components/common/NotFound.vue";

// Componentes de páginas
import PaginaInicio from "@/components/pages/PaginaInicio.vue";
import GestionClientes from "@/components/pages/GestionClientes.vue";
import NoTicias from "@/components/pages/NoTicias.vue";
import AvisoLegal from "@/components/pages/AvisoLegal.vue";
import PoliticaPrivacidad from "@/components/pages/PoliticaPrivacidad.vue";
import ModeLos from "@/components/pages/ModeLos.vue";
import CitasTaller from "@/components/pages/CitasTaller.vue";
import Ventas from "@/components/pages/Ventas.vue";
import ConTacto from "@/components/pages/ConTacto.vue";

// Componentes de autenticación
import TablaLogin from "@/components/auth/TablaLogin.vue";

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
    },
    {
        path: "/taller",
        name: "CitasTaller",
        component: CitasTaller,
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
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
