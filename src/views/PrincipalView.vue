<template>
  <!-- Encabezado -->
  <header>
    <div class="logo-titulo">
      <span class="logo">MEDITECH</span>
      <img
        class="logo-uleam"
        src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM-VERTICAL.png"
        alt="Logo Uleam"
      />
    </div>
    <nav id="menu-navegacion">
      <!-- Menú fijo -->
      <template v-for="opc in menuOpcionesFijas" :key="opc.texto">
        <router-link v-if="opc.vueRoute" :to="opc.href" :class="opc.clase">
          {{ opc.texto }}
        </router-link>
        <a v-else :href="opc.href" :class="opc.clase">
          {{ opc.texto }}
        </a>
      </template>

      <!-- Si usuario está logueado -->
      <template v-if="usuario">
        <!-- Gestión de Citas solo para doctor -->
        <router-link v-if="usuario.rol === 'doctor'" to="/gestion-citas">
          Gestión de Citas
        </router-link>

        <!-- Perfil de usuario con menú desplegable -->
        <div class="perfil-dropdown" @click.stop="togglePerfilMenu">
          <div class="perfil-circle">{{ getIniciales(usuario.nombre) }}</div>
          <div class="perfil-menu" :class="{ show: perfilMenuVisible }">
            <div>Perfil</div>
            <div>Preferencias</div>
            <div>Idioma</div>
            <div @click="cerrarSesion">Cerrar sesión</div>
          </div>
        </div>
      </template>

      <!-- Si NO está logueado -->
      <template v-else>
        <template v-for="opc in menuOpcionesExtra" :key="opc.texto">
          <router-link v-if="opc.vueRoute" :to="opc.href" :class="opc.clase">
            {{ opc.texto }}
          </router-link>
          <a v-else :href="opc.href" :class="opc.clase">
            {{ opc.texto }}
          </a>
        </template>
      </template>
    </nav>
  </header>
  <div class="separador"></div>

  <!-- Banner -->
  <section class="banner-polimed">
    <div class="banner-overlay"></div>
    <div class="banner-content">
      <span class="banner-bar"></span>
      <h1>
        Centro Policlínico<br />
        ULEAM Salud
      </h1>
    </div>
  </section>

  <main>
    <!-- Sección Nosotros -->
    <section class="nosotros">
      <div class="nosotros-contenido">
        <div class="nosotros-texto">
          <h2>¿Nuestra Misión?</h2>
          <div class="acento"></div>
          <p>
            Brindar atención especializada, con calidad, eficacia, eficiencia y
            calidez satisfaciendo las necesidades de salud integral, física,
            emocional y social de la población universitaria y la que acude en
            demanda de sus servicios, sin distinción de condición económica,
            nacionalidad, raza o religión, para lo cual cuenta con una moderna
            infraestructura y tecnología y personal altamente calificado,
            construyendo de esta manera a velar por la buena salud de la
            comunidad universitaria.
          </p>
        </div>
        <div class="nosotros-img">
          <img
            src="https://www.shutterstock.com/image-photo/hands-doctor-clipboard-writing-notes-600nw-2507090935.jpg"
            alt="Doctor escribiendo en un portapapeles"
          />
        </div>
      </div>
    </section>

    <!-- Nueva sección destacada (servicios) -->
    <section class="seccion-destacada">
      <div class="destacada-overlay"></div>
      <div class="destacada-container-outer">
        <!-- Cambia el botón a router-link -->
        <router-link class="btn-pedir-cita" to="/citas"
          >QUIERO PEDIR CITA</router-link
        >
        <div class="destacada-container">
          <div class="destacada-item">
            <div class="destacada-icon" style="font-size: 64px">🔎</div>
            <div class="destacada-title">DIAGNÓSTICO</div>
            <div class="destacada-divider"></div>
            <div class="destacada-desc">Estudio y diagnóstico</div>
          </div>
          <div class="destacada-item">
            <div class="destacada-icon" style="font-size: 64px">💉</div>
            <div class="destacada-title">TRATAMIENTO</div>
            <div class="destacada-divider"></div>
            <div class="destacada-desc">Seguimiento y tratamiento</div>
          </div>
          <div class="destacada-item">
            <div class="destacada-icon" style="font-size: 64px">🩺</div>
            <div class="destacada-title">ESPECIALISTAS</div>
            <div class="destacada-divider"></div>
            <div class="destacada-desc">Especialistas para adultos y niños</div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer-uleam">
    <div class="footer-bar">
      <div class="footer-logo">
        <img
          src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM-HORIZONTAL.png"
          alt="Uleam"
        />
      </div>
      <div class="footer-direccion">
        <span class="footer-dir-title"><b>Dirección:</b></span>
        Av. Circunvalación – Vía a San Mateo – Manta – Manabí – Ecuador
      </div>
      <div class="footer-redes">
        <a
          href="https://twitter.com/UleamEcuador"
          target="_blank"
          title="Twitter"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg"
            alt="Twitter"
          />
        </a>
        <a
          href="https://www.facebook.com/uleam.ec"
          target="_blank"
          title="Facebook"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
            alt="Facebook"
          />
        </a>
        <a
          href="https://www.youtube.com/@UleamOficial"
          target="_blank"
          title="YouTube"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg"
            alt="YouTube"
          />
        </a>
      </div>
    </div>
    <div class="footer-separator"></div>
    <div class="footer-copyright">
      Copyright © 2025 Dirección de Bienestar Universitario - Uleam | Powered by
      Dirección de Bienestar Universitario - Uleam.
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// Función para obtener iniciales
function getIniciales(nombreCompleto) {
  const partes = nombreCompleto.trim().split(" ");
  let iniciales = "";
  if (partes.length > 0) iniciales += partes[0][0].toUpperCase();
  if (partes.length > 1) iniciales += partes[1][0].toUpperCase();
  return iniciales;
}

// Estado reactivo
const usuario = ref(null);
const perfilMenuVisible = ref(false);

// Opciones fijas (reactivas a usuario)
const menuOpcionesFijas = computed(() => [
  { texto: "Extensiones", href: "#", clase: "extensiones-btn" },
  {
    texto: "Historial Clínico",
    href:
      usuario.value && usuario.value.rol === "doctor"
        ? "/gestion-historial" // <- esta es la ruta del view de doctor
        : "/historial-clinico", // <- esta es la ruta del view de paciente
  },
  { texto: "Contáctanos", href: "#" },
]);

// Opciones extra si no está logueado
const menuOpcionesExtra = [
  { texto: "Regístrate", href: "#" },
  { texto: "Iniciar Sesión", href: "/login", clase: "nav-btn" },
];

// Función cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuarioLogueado");
  window.location.reload();
}

// Mostrar/Ocultar menú perfil
function togglePerfilMenu() {
  perfilMenuVisible.value = !perfilMenuVisible.value;
}

// Cerrar menú al hacer clic fuera
function handleClickOutside(event) {
  const perfilDropdown = document.querySelector(".perfil-dropdown");
  if (perfilDropdown && !perfilDropdown.contains(event.target)) {
    perfilMenuVisible.value = false;
  }
}

onMounted(() => {
  usuario.value = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
@import "../assets/css/principal.css";
</style>
