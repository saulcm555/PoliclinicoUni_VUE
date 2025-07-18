import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Si tienes un CSS global para toda la app, puedes descomentar esta línea y ajustarla al nombre real de tu CSS
// import './assets/css/principal.css'

createApp(App)
  .use(router)
  .mount('#app')
