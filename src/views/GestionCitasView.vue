<template>
  <div>
    <!-- Header -->
    <header class="gc-header">
      <button class="logo-btn" @click="goPrincipal">
        <img
          class="logo-uleam"
          src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM-VERTICAL.png"
          alt="Uleam"
        />
      </button>
      <span class="gc-title">GESTIÓN DE CITAS</span>
    </header>
    <!-- Main content -->
    <main>
      <div class="gestion-citas-container">
        <h2>Citas pendientes</h2>
        <div v-if="citasPendientes.length === 0" class="no-citas">
          No hay citas pendientes.
        </div>
        <div v-else>
          <div
            v-for="(cita, i) in citasPendientes"
            :key="cita.cedula + cita.fecha"
            class="cita-card pendiente"
          >
            <div><b>Paciente:</b> {{ cita.nombre }}</div>
            <div><b>Día:</b> {{ cita.fecha }}</div>
            <div><b>Motivo:</b> {{ cita.motivo }}</div>
            <div class="acciones-cita">
              <button @click="aceptarCita(cita)">Aceptar</button>
              <button class="rechazar" @click="abrirRechazo(i)">
                Rechazar
              </button>
            </div>
            <div
              v-if="rechazoAbierto === i"
              :id="
                'motivo-rechazo-' + cita.cedula + cita.fecha.replaceAll('-', '')
              "
            >
              <form @submit.prevent="rechazarCita(cita, motivoRechazo)">
                <input
                  v-model="motivoRechazo"
                  type="text"
                  placeholder="Motivo de rechazo"
                  required
                  maxlength="150"
                  style="width: 80%; padding: 5px"
                />
                <button type="submit" class="rechazar">
                  Confirmar rechazo
                </button>
                <button type="button" @click="rechazoAbierto = null">
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        </div>

        <h2 style="margin-top: 30px">Citas aceptadas</h2>
        <div v-if="citasAceptadas.length === 0" class="no-citas">
          No hay citas aceptadas.
        </div>
        <div v-else>
          <div
            v-for="cita in citasAceptadas"
            :key="cita.cedula + cita.fecha"
            class="cita-card aceptada"
          >
            <div><b>Paciente:</b> {{ cita.nombre }}</div>
            <div><b>Día:</b> {{ cita.fecha }}</div>
            <div><b>Hora asignada:</b> {{ cita.hora }}</div>
            <div><b>Motivo:</b> {{ cita.motivo }}</div>
          </div>
        </div>

        <h2 style="margin-top: 30px">Citas rechazadas</h2>
        <div v-if="citasRechazadas.length === 0" class="no-citas">
          No hay citas rechazadas.
        </div>
        <div v-else>
          <div
            v-for="cita in citasRechazadas"
            :key="cita.cedula + cita.fecha"
            class="cita-card rechazada"
          >
            <div><b>Paciente:</b> {{ cita.nombre }}</div>
            <div><b>Día:</b> {{ cita.fecha }}</div>
            <div><b>Motivo:</b> {{ cita.motivo }}</div>
            <div><b>Motivo de rechazo:</b> {{ cita.respuesta }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const HORAS_CITA = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

const citasPendientes = ref([]);
const citasAceptadas = ref([]);
const citasRechazadas = ref([]);

const rechazoAbierto = ref(null);
const motivoRechazo = ref("");

// Navegar a principal
function goPrincipal() {
  router.push("/");
}

// Cargar citas al iniciar
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
  if (!usuario || usuario.rol !== "doctor") {
    alert("Solo personal verificado puede acceder.");
    router.push("/login");
    return;
  }
  mostrarCitas();
});

// Mostrar citas por estado
function mostrarCitas() {
  let citas = JSON.parse(localStorage.getItem("citasMedicas") || "[]");
  citas = citas.sort(
    (a, b) =>
      new Date(a.fecha) - new Date(b.fecha) ||
      new Date(a.creada) - new Date(b.creada)
  );

  citasPendientes.value = citas.filter((c) => c.estado === "pendiente");
  citasAceptadas.value = citas.filter((c) => c.estado === "aceptada");
  citasRechazadas.value = citas.filter((c) => c.estado === "rechazada");
  rechazoAbierto.value = null;
  motivoRechazo.value = "";
}

// Aceptar cita
function aceptarCita(cita) {
  let citas = JSON.parse(localStorage.getItem("citasMedicas") || "[]");
  // Verificar cupo
  const aceptadas = citas.filter(
    (c) => c.fecha === cita.fecha && c.estado === "aceptada"
  );
  if (aceptadas.length >= 6) {
    alert("Ya se alcanzó el máximo de 6 citas aceptadas para este día.");
    return;
  }
  // Buscar siguiente hora disponible
  const horasOcupadas = aceptadas.map((c) => c.hora);
  const siguienteHora = HORAS_CITA.find((h) => !horasOcupadas.includes(h));
  if (!siguienteHora) {
    alert("No hay horas disponibles para ese día.");
    return;
  }
  // Actualizar cita
  const idx = citas.findIndex(
    (c) =>
      c.cedula === cita.cedula &&
      c.fecha === cita.fecha &&
      c.estado === "pendiente"
  );
  if (idx !== -1) {
    citas[idx].estado = "aceptada";
    citas[idx].hora = siguienteHora;
    citas[idx].respuesta = "";
    localStorage.setItem("citasMedicas", JSON.stringify(citas));
    mostrarCitas();
  }
}

// Abrir/cerrar campo de rechazo
function abrirRechazo(idx) {
  if (rechazoAbierto.value === idx) {
    rechazoAbierto.value = null;
    motivoRechazo.value = "";
  } else {
    rechazoAbierto.value = idx;
    motivoRechazo.value = "";
  }
}

// Rechazar cita
function rechazarCita(cita, motivo) {
  let citas = JSON.parse(localStorage.getItem("citasMedicas") || "[]");
  const idx = citas.findIndex(
    (c) =>
      c.cedula === cita.cedula &&
      c.fecha === cita.fecha &&
      c.estado === "pendiente"
  );
  if (idx !== -1) {
    citas[idx].estado = "rechazada";
    citas[idx].respuesta = motivo || "Sin motivo especificado";
    citas[idx].hora = null;
    localStorage.setItem("citasMedicas", JSON.stringify(citas));
    mostrarCitas();
  }
}
</script>

<style scoped>
@import "../assets/css/gestion_citas.css";
</style>
