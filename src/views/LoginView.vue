<template>
  <div>
    <!-- Topbar -->
    <header class="topbar">
      <div class="topbar-left">
        <RouterLink to="/" class="main-btn">
          <img
            src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM-VERTICAL.png"
            class="logo-mini"
            alt="ULEAM Logo"
          />
          <span>Página Principal</span>
        </RouterLink>
      </div>
      <div class="topbar-right">
        <div class="lang-dropdown" @click.stop="toggleLangMenu">
          <button id="langBtn" class="lang-btn" type="button">
            <span style="font-size: 1.1em">🌐</span> Español - Internacional
            (es)
            <svg class="arrow" width="16" height="10">
              <polyline
                points="2,2 8,8 14,2"
                fill="none"
                stroke="#fff"
                stroke-width="2"
              />
            </svg>
          </button>
          <ul class="lang-list" :class="{ show: langMenuOpen }" id="langMenu">
            <li>Español - Internacional (es)</li>
          </ul>
        </div>
      </div>
    </header>

    <!-- Login Form -->
    <main>
      <section class="login-section">
        <form class="login-form" @submit.prevent="login">
          <h1>Acceso al Sistema</h1>
          <input
            v-model="usuario"
            type="text"
            placeholder="Nombre de usuario"
            autocomplete="username"
            required
          />
          <input
            v-model="contrasena"
            type="password"
            placeholder="Contraseña"
            autocomplete="current-password"
            required
          />
          <button type="submit" class="login-btn">Acceder</button>
          <a href="#" class="forgot">¿Olvidó su contraseña?</a>
          <div class="form-divider"></div>
          <div class="login-metodo-label">
            Identifíquese usando su cuenta en:
          </div>
          <!-- Custom Select -->
          <div class="custom-select" ref="metodoSelect">
            <div
              class="select-selected"
              :class="{ active: selectOpen }"
              @click.stop="toggleSelect"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoft.svg"
                alt="Microsoft"
                class="icon"
              />
              {{
                metodoActual === "paciente"
                  ? "Microsoft 365 Uleam"
                  : "Personal Verificado"
              }}
              <svg
                width="18"
                height="12"
                style="margin-left: 12px; vertical-align: middle"
              >
                <polyline
                  points="2,2 9,10 16,2"
                  fill="none"
                  stroke="#228be6"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div class="select-items" :class="{ 'select-hide': !selectOpen }">
              <div data-metodo="paciente" @click="setMetodo('paciente')">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoft.svg"
                  alt="Microsoft"
                  class="icon"
                />
                Microsoft 365 Uleam
              </div>
              <div data-metodo="doctor" @click="setMetodo('doctor')">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2942/2942813.png"
                  alt="Verificado"
                  class="icon"
                />
                Personal Verificado
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter, RouterLink } from "vue-router";

const usuario = ref("");
const contrasena = ref("");
const metodoActual = ref("paciente");
const selectOpen = ref(false);
const langMenuOpen = ref(false);
const metodoSelect = ref(null);
const router = useRouter();

// ---- Inicializar usuarios en localStorage si no existen ----
onMounted(() => {
  if (!localStorage.getItem("usuarios")) {
    const usuarios = [
      {
        nombre: "Ana Gómez Rodríguez",
        cedula: "1312782558",
        contrasena: "123",
        correo: "e1312782558@live.uleam.edu.ec",
        fecha_nacimiento: "2001-04-10",
        rol: "paciente",
      },
      {
        nombre: "Carlos Méndez Loor",
        cedula: "1312346789",
        contrasena: "Carlos2024!",
        correo: "e1312346789@live.uleam.edu.ec",
        fecha_nacimiento: "2000-11-23",
        rol: "paciente",
      },
      {
        nombre: "Valeria Ruiz Vera",
        cedula: "1312987678",
        contrasena: "Vale4567@",
        correo: "e1312987678@live.uleam.edu.ec",
        fecha_nacimiento: "2002-07-30",
        rol: "paciente",
      },
      {
        nombre: "Pedro Zambrano Aguirre",
        cedula: "0905678321",
        contrasena: "123",
        correo: "p0905678321@live.uleam.edu.ec",
        fecha_nacimiento: "1980-03-12",
        rol: "doctor",
      },
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  // Cerrar custom select y lang si se hace click fuera
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// ---- Custom Select para método ----
function toggleSelect() {
  selectOpen.value = !selectOpen.value;
}
function setMetodo(metodo) {
  metodoActual.value = metodo;
  selectOpen.value = false;
}
function handleClickOutside(e) {
  if (metodoSelect.value && !metodoSelect.value.contains(e.target)) {
    selectOpen.value = false;
  }
  langMenuOpen.value = false;
}

// ---- Custom Dropdown Idioma ----
function toggleLangMenu() {
  langMenuOpen.value = !langMenuOpen.value;
}

// ---- Lógica de Login ----
function login() {
  // Buscar usuarios por cédula o correo + contraseña
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  let user = usuarios.find(
    (u) =>
      (u.cedula === usuario.value || u.correo === usuario.value) &&
      u.contrasena === contrasena.value
  );
  if (user) {
    if (user.rol !== metodoActual.value) {
      alert("Seleccione el metodo de identificación correcto.");
      return;
    }
    localStorage.setItem("usuarioLogueado", JSON.stringify(user));
    router.push("/"); // Cambia a la ruta principal
  } else {
    alert("Credenciales incorrectas");
  }
}
</script>

<style scoped>
@import "../assets/css/login.css";
</style>
