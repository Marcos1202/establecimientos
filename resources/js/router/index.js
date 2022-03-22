import Vue from 'vue'
import VueRouter  from 'vue-router'
import VuePageTransition  from 'vue-page-transition'
import InicioEstablecimientos from '../components/InicioEstablecimientos'
import MostrarEstablecimiento from '../components/MostrarEstablecimiento'
Vue.use(VueRouter);

const routes = [
    {
        path:'/',
        component: InicioEstablecimientos
    },
    {
        path: '/establecimiento/:id',
        name:"establecimiento",
        component: MostrarEstablecimiento

    }
]

const router = new VueRouter({
    mode: "history",
    routes
});

Vue.use(VuePageTransition);
export default router;