<template>
  <div>
    <!-- HEADER -->
    <header class="citas-header">
      <button class="logo-btn" @click="goPrincipal">
        <img
          class="logo-uleam"
          src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM-VERTICAL.png"
          alt="Uleam"
        />
      </button>
      <span class="citas-title">AGENDAR CITA</span>
    </header>
    <!-- FORMULARIO -->
    <main>
      <div class="cita-form-container">
        <form @submit.prevent="solicitarCita">
          <h2>Solicitar cita médica</h2>
          <label>Seleccione el día:</label>
          <input type="date" v-model="fecha" :min="minFecha" required />
          <label>Motivo de la cita:</label>
          <input type="text" v-model="motivo" maxlength="120" required />
          <button type="submit">Solicitar cita</button>
          <div id="cita-mensaje" :style="{ color: mensajeColor }">
            {{ mensaje }}
          </div>
        </form>
      </div>
      <!-- MIS CITAS -->
      <div class="mis-citas-container">
        <h3>Mis citas agendadas</h3>
        <div id="mis-citas-lista">
          <div v-if="misCitas.length === 0" class="no-citas">
            No tiene citas agendadas.
          </div>
          <div v-else>
            <div
              v-for="(cita, idx) in misCitas"
              :key="idx"
              :class="['cita-card', cita.estado]"
            >
              <div><b>Día:</b> {{ cita.fecha }}</div>
              <div><b>Motivo:</b> {{ cita.motivo }}</div>
              <div><b>Estado:</b> {{ formateaEstado(cita.estado) }}</div>
              <div v-if="cita.estado === 'aceptada'">
                <b>Hora:</b> {{ cita.hora }}
              </div>
              <div v-if="cita.estado === 'rechazada'">
                <b>Motivo de rechazo:</b> {{ cita.respuesta }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ALERTA DE ACCESO SOLO PACIENTES -->
      <div v-if="mostrarAlerta" class="alerta-roja">
        Solo los pacientes pueden agendar citas.
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const fecha = ref("");
const motivo = ref("");
const mensaje = ref("");
const mensajeColor = ref("#239962");
const misCitas = ref([]);
const minFecha = ref("");
const mostrarAlerta = ref(false);

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
  if (!usuario || usuario.rol !== "paciente") {
    mostrarAlerta.value = true;
    setTimeout(() => router.push("/login"), 1600);
    return;
  }
  // Setear mínimo en fecha (hoy)
  const hoy = new Date();
  minFecha.value = hoy.toISOString().split("T")[0];
  mostrarMisCitas();
});

function goPrincipal() {
  router.push("/");
}

function solicitarCita() {
  mensaje.value = "";
  mensajeColor.value = "#239962";
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
  if (!fecha.value || !motivo.value.trim()) {
    mensaje.value = "Debe completar todos los campos.";
    mensajeColor.value = "#d32f2f";
    return;
  }
  let citas = JSON.parse(localStorage.getItem("citasMedicas") || "[]");
  const yaExiste = citas.some(
    (c) =>
      c.cedula === usuario.cedula &&
      c.fecha === fecha.value &&
      (c.estado === "pendiente" || c.estado === "aceptada")
  );
  if (yaExiste) {
    mensaje.value = "Ya tiene una cita agendada para ese día.";
    mensajeColor.value = "#d32f2f";
    return;
  }
  // Validar cupo máximo
  const aceptadasHoy = citas.filter(
    (c) => c.fecha === fecha.value && c.estado === "aceptada"
  ).length;
  if (aceptadasHoy >= 6) {
    mensaje.value = "No hay más citas disponibles para ese día.";
    mensajeColor.value = "#d32f2f";
    return;
  }
  // Registrar cita
  const nuevaCita = {
    cedula: usuario.cedula,
    nombre: usuario.nombre,
    fecha: fecha.value,
    motivo: motivo.value.trim(),
    estado: "pendiente",
    respuesta: "",
    hora: null,
    creada: new Date().toISOString(),
  };
  citas.push(nuevaCita);
  localStorage.setItem("citasMedicas", JSON.stringify(citas));
  mensaje.value = "Cita solicitada correctamente. Espere aprobación.";
  mensajeColor.value = "#239962";
  fecha.value = "";
  motivo.value = "";
  mostrarMisCitas();
}

function mostrarMisCitas() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
  let citas = JSON.parse(localStorage.getItem("citasMedicas") || "[]")
    .filter((c) => c.cedula === usuario.cedula)
    .sort((a, b) => new Date(b.creada) - new Date(a.creada));
  misCitas.value = citas;
}

function formateaEstado(estado) {
  if (estado === "pendiente") return "Pendiente de revisión";
  if (estado === "aceptada") return "Aceptada";
  if (estado === "rechazada") return "Rechazada";
  return estado;
}
</script>

<style scoped>
@import "../assets/css/citas.css";
</style>
