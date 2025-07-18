<template>
  <div>
    <!-- Header personalizado -->
    <header class="hc-header">
      <button class="logo-btn" @click="goHome">
        <img class="logo-uleam" src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM-VERTICAL.png" alt="Uleam" />
      </button>
      <span class="hc-title">HISTORIAL CLÍNICO</span>
    </header class="hc-header">
    <main>
      <div id="historial-container">
        <!-- Mensaje si no está logueado o no es paciente -->
        <div v-if="!usuario || usuario.rol !== 'paciente'" class="no-historial">
          Para ver un historial clínico necesitas estar logeado. Redireccionando al inicio de sesión...
        </div>

        <!-- Mensaje si no hay historia -->
        <div v-else-if="!historia">
          <div class="no-historial">No hay historia clínica registrada para este paciente.</div>
        </div>

        <!-- Datos si existe historia -->
        <div v-else>
          <div class="paciente-datos">
            <div><span class="campo-label">PACIENTE:</span> {{ usuario.nombre }}</div>
            <div><span class="campo-label">SEXO:</span> {{ historia.sexo || "-" }}</div>
            <div><span class="campo-label">FECHA DE NACIMIENTO:</span> {{ historia.fechaNacimiento || "-" }}</div>
            <div><span class="campo-label">CÉDULA:</span> {{ historia.cedula || "-" }}</div>
            <div><span class="campo-label">TIPO DE SANGRE:</span> {{ historia.tipoSangre || "-" }}</div>
            <div><span class="campo-label">RAZA:</span> {{ historia.raza || "-" }}</div>
            <div><span class="campo-label">TELÉFONO:</span> {{ historia.telefono || "-" }}</div>
            <div><span class="campo-label">CORREO:</span> {{ historia.correo || usuario.correo || "-" }}</div>
            <div><span class="campo-label">ANTECEDENTES FAMILIARES:</span> {{ historia.antecedentes || "-" }}</div>
            <div><span class="campo-label">ALERGIAS:</span> {{ historia.alergias || "-" }}</div>
            <div><span class="campo-label">DOCTOR:</span> {{ historia.doctor || "-" }}</div>
          </div>
          <div class="citas-lista">
            <div v-if="!historia.citas || historia.citas.length === 0" class="no-historial">
              No hay citas registradas para este paciente.
            </div>
            <div v-else>
              <div v-for="(cita, i) in historia.citas" :key="i" class="cita-item">
                <div
                  class="cita-header"
                  :class="{ open: citaAbierta === i }"
                  @click="toggleCita(i)"
                >
                  <span class="icono-cita">&#9654;</span>
                  Cita generada el <span class="cita-fecha"><b>{{ cita.fecha }}</b></span>
                </div>
                <div class="cita-detalle" :class="{ show: citaAbierta === i }">
                  <div><span class="cita-label">Diagnóstico:</span> {{ cita.diagnostico }}</div>
                  <div><span class="cita-label">Tratamiento:</span> {{ cita.tratamiento }}</div>
                  <div><span class="cita-label">Receta:</span> {{ cita.receta }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Estado reactivo
const usuario = ref(null)
const historia = ref(null)
const citaAbierta = ref(null)
const router = useRouter()

onMounted(() => {
  usuario.value = JSON.parse(localStorage.getItem("usuarioLogueado") || "null")
  const historiales = JSON.parse(localStorage.getItem("historialesClinicos") || "[]")

  if (!usuario.value || usuario.value.rol !== "paciente") {
    setTimeout(() => router.push('/login'), 1800)
    return
  }

  historia.value = historiales.find(h => h.cedula === usuario.value.cedula)
})

// Acordeón de citas
function toggleCita(i) {
  citaAbierta.value = citaAbierta.value === i ? null : i
}

// Ir a principal
function goHome() {
  router.push('/')
}
</script>

<style scoped>
@import '../assets/css/historia.css';
</style>
