import { createRouter, createWebHistory } from 'vue-router'
import PrincipalView from '../views/PrincipalView.vue'
import LoginView from '../views/LoginView.vue'
import HistorialClinicoView from '../views/HistorialClinicoView.vue'
import GestionHistorialView from '../views/GestionHistorialView.vue'
import CitasView from '../views/CitasView.vue'
import GestionCitasView from '../views/GestionCitasView.vue'


const routes = [
  { path: '/', component: PrincipalView },
  { path: '/login', component: LoginView },
  { path: '/historial-clinico', component: HistorialClinicoView },
  { path: '/gestion-historial', component: GestionHistorialView },
  { path: '/citas', component: CitasView },
  { path: '/gestion-citas', component: GestionCitasView }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
