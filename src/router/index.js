import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue";
import GestionClientes from "../components/GestionClientes.vue";
import NoTicias from "../components/NoTicias.vue";
import AvisoLegal from "../components/AvisoLegal.vue";
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue";
import ModeLos from "../components/ModeLos.vue";
import CitasTaller from "../components/CitasTaller.vue";
import TablaLogin from "../components/TablaLogin.vue";
import { createRouter, createWebHistory } from "vue-router";

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