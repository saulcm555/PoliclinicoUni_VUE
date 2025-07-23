<template>
  <div>
    <!-- Topbar -->
    <header class="topbar">
      <router-link to="/" class="logo-link" title="Ir a página principal">
        <img
          src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM-VERTICAL.png"
          alt="ULEAM Logo"
        />
      </router-link>
      <h1>Gestión de Historiales</h1>
    </header>

    <!-- Buscar paciente -->
    <div class="buscar-form">
      <form id="form-buscar" @submit.prevent="onBuscar">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Ingrese cédula o correo del paciente"
          autocomplete="off"
        />
        <button type="submit">Buscar</button>
      </form>
    </div>

    <div id="gestion-container">
      <!-- Mensajes o formularios según el estado -->
      <div v-if="!accesoPermitido" class="no-historial">
        Acceso solo permitido para personal verificado. Redireccionando...
      </div>

      <div v-else>
        <!-- Mensaje de error -->
        <div v-if="mensajeError" class="no-historial">{{ mensajeError }}</div>

        <!-- Crear historial -->
        <div v-if="mostrarFormulario === 'crear'" class="crear-historial">
          <h3>Crear historial clínico para {{ pacienteEncontrado.nombre }}</h3>
          <form @submit.prevent="guardarNuevoHistorial">
            <div
              v-if="erroresFormulario.length"
              class="form-errores"
              v-html="erroresHTML"
            ></div>
            <label>Sexo: <input v-model="formHistorial.sexo" /></label>
            <label
              >Fecha de nacimiento:
              <input type="date" v-model="formHistorial.fechaNacimiento"
            /></label>
            <label
              >Tipo de sangre: <input v-model="formHistorial.tipoSangre"
            /></label>
            <label>Raza: <input v-model="formHistorial.raza" /></label>
            <label>Teléfono: <input v-model="formHistorial.telefono" /></label>
            <label
              >Antecedentes familiares:
              <input v-model="formHistorial.antecedentes"
            /></label>
            <label>Alergias: <input v-model="formHistorial.alergias" /></label>
            <label>Doctor: <input v-model="formHistorial.doctor" /></label>
            <button type="submit">Guardar historial</button>
          </form>
        </div>

        <!-- Editar historial -->
        <div v-if="mostrarFormulario === 'editar'" class="editar-historial">
          <h3>Editar historial clínico de {{ pacienteEncontrado.nombre }}</h3>
          <form @submit.prevent="guardarEdicionHistorial">
            <div
              v-if="erroresFormulario.length"
              class="form-errores"
              v-html="erroresHTML"
            ></div>
            <label>Sexo: <input v-model="formHistorial.sexo" /></label>
            <label
              >Fecha de nacimiento:
              <input type="date" v-model="formHistorial.fechaNacimiento"
            /></label>
            <label
              >Tipo de sangre: <input v-model="formHistorial.tipoSangre"
            /></label>
            <label>Raza: <input v-model="formHistorial.raza" /></label>
            <label>Teléfono: <input v-model="formHistorial.telefono" /></label>
            <label
              >Antecedentes familiares:
              <input v-model="formHistorial.antecedentes"
            /></label>
            <label>Alergias: <input v-model="formHistorial.alergias" /></label>
            <label>Doctor: <input v-model="formHistorial.doctor" /></label>
            <button type="submit">Guardar cambios</button>
            <button
              type="button"
              id="btn-cancelar-editar"
              @click="mostrarFormulario = ''"
            >
              Cancelar
            </button>
          </form>
        </div>

        <!-- Mostrar historial existente -->
        <div
          v-if="mostrarFormulario === '' && historialActual"
          class="paciente-datos"
        >
          <div>
            <span class="campo-label">PACIENTE:</span>
            {{ pacienteEncontrado.nombre }}
          </div>
          <div>
            <span class="campo-label">SEXO:</span>
            {{ historialActual.sexo || "-" }}
          </div>
          <div>
            <span class="campo-label">FECHA DE NACIMIENTO:</span>
            {{ historialActual.fechaNacimiento || "-" }}
          </div>
          <div>
            <span class="campo-label">CÉDULA:</span>
            {{ historialActual.cedula }}
          </div>
          <div>
            <span class="campo-label">TIPO DE SANGRE:</span>
            {{ historialActual.tipoSangre || "-" }}
          </div>
          <div>
            <span class="campo-label">RAZA:</span>
            {{ historialActual.raza || "-" }}
          </div>
          <div>
            <span class="campo-label">TELÉFONO:</span>
            {{ historialActual.telefono || "-" }}
          </div>
          <div>
            <span class="campo-label">CORREO:</span>
            {{ historialActual.correo || "-" }}
          </div>
          <div>
            <span class="campo-label">ANTECEDENTES FAMILIARES:</span>
            {{ historialActual.antecedentes || "-" }}
          </div>
          <div>
            <span class="campo-label">ALERGIAS:</span>
            {{ historialActual.alergias || "-" }}
          </div>
          <div>
            <span class="campo-label">DOCTOR:</span>
            {{ historialActual.doctor || "-" }}
          </div>
        </div>
        <div
          v-if="mostrarFormulario === '' && historialActual"
          class="botones-historial"
        >
          <button @click="editarHistorial">Editar historial</button>
          <button class="danger" @click="eliminarHistorial">
            Eliminar historial
          </button>
        </div>

        <!-- Citas -->
        <div
          v-if="mostrarFormulario === '' && historialActual"
          class="citas-lista"
        >
          <h3 style="margin-bottom: 0; margin-top: 15px">Citas del paciente</h3>
          <div
            v-if="!historialActual.citas || !historialActual.citas.length"
            class="no-historial"
          >
            No hay citas registradas para este paciente.
          </div>
          <template v-else>
            <div
              v-for="(cita, idx) in historialActual.citas"
              :key="idx"
              class="cita-item"
            >
              <div
                class="cita-header"
                :class="{ open: citaAbierta === idx }"
                @click="toggleCita(idx)"
              >
                <span class="icono-cita">&#9654;</span>
                Cita generada el
                <span class="cita-fecha"
                  ><b>{{ cita.fecha }}</b></span
                >
              </div>
              <div class="cita-detalle" :class="{ show: citaAbierta === idx }">
                <div>
                  <span class="cita-label">Diagnóstico:</span>
                  {{ cita.diagnostico }}
                </div>
                <div>
                  <span class="cita-label">Tratamiento:</span>
                  {{ cita.tratamiento }}
                </div>
                <div>
                  <span class="cita-label">Receta:</span> {{ cita.receta }}
                </div>
                <button @click="editarCita(idx)">Editar</button>
                <button class="danger" @click="eliminarCita(idx)">
                  Eliminar
                </button>
              </div>
            </div>
          </template>
          <button
            id="btn-agregar-cita"
            style="margin-top: 14px"
            @click="agregarCita"
          >
            Agregar nueva cita
          </button>
        </div>

        <!-- Agregar/Editar cita -->
        <div v-if="mostrarFormulario === 'cita'" class="form-cita">
          <h3>{{ indiceCitaEdicion !== null ? "Editar" : "Agregar" }} cita</h3>
          <form @submit.prevent="guardarCita">
            <div
              v-if="erroresFormulario.length"
              class="form-errores"
              v-html="erroresHTML"
            ></div>
            <label>Fecha: <input type="date" v-model="formCita.fecha" /></label>
            <label>Diagnóstico: <input v-model="formCita.diagnostico" /></label>
            <label>Tratamiento: <input v-model="formCita.tratamiento" /></label>
            <label>Receta: <input v-model="formCita.receta" /></label>
            <button type="submit">
              {{
                indiceCitaEdicion !== null ? "Guardar cambios" : "Agregar cita"
              }}
            </button>
            <button
              type="button"
              id="btn-cancelar-cita"
              @click="cancelarEdicionCita"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Funciones de validación
function validarFormularioHistorial(datos) {
  let ok = true;
  let mensajes = [];

  const { sexo, fechaNacimiento, tipoSangre, raza, telefono, antecedentes, alergias, doctor } = datos;

  if (!sexo) { ok = false; mensajes.push("El campo 'Sexo' es obligatorio."); }
  if (!fechaNacimiento) { ok = false; mensajes.push("El campo 'Fecha de nacimiento' es obligatorio."); }
  if (!tipoSangre) { ok = false; mensajes.push("El campo 'Tipo de sangre' es obligatorio."); }
  if (!raza) { ok = false; mensajes.push("El campo 'Raza' es obligatorio."); }
  if (!telefono) { ok = false; mensajes.push("El campo 'Teléfono' es obligatorio."); }
  if (!antecedentes) { ok = false; mensajes.push("El campo 'Antecedentes familiares' es obligatorio."); }
  if (!alergias) { ok = false; mensajes.push("El campo 'Alergias' es obligatorio."); }
  if (!doctor) { ok = false; mensajes.push("El campo 'Doctor' es obligatorio."); }

  // Teléfono: exactamente 10 dígitos numéricos
  if (telefono && !/^\d{10}$/.test(telefono)) {
    ok = false;
    mensajes.push("El teléfono debe tener exactamente 10 dígitos numéricos.");
  }

  return { ok, mensajes };
}

function validarFormularioCita(datos) {
  let ok = true;
  let mensajes = [];

  const { fecha, diagnostico, tratamiento, receta } = datos;

  if (!fecha) { ok = false; mensajes.push("El campo 'Fecha' es obligatorio."); }
  if (!diagnostico) { ok = false; mensajes.push("El campo 'Diagnóstico' es obligatorio."); }
  if (!tratamiento) { ok = false; mensajes.push("El campo 'Tratamiento' es obligatorio."); }
  if (!receta) { ok = false; mensajes.push("El campo 'Receta' es obligatorio."); }

  return { ok, mensajes };
}

// Estado principal
const accesoPermitido = ref(true);
const busqueda = ref("");
const mensajeError = ref("");
const mostrarFormulario = ref(""); // '', 'crear', 'editar', 'cita'
const pacienteEncontrado = ref(null);
const historialActual = ref(null);
const erroresFormulario = ref([]);
const citaAbierta = ref(null);
const formHistorial = reactive({
  sexo: "",
  fechaNacimiento: "",
  tipoSangre: "",
  raza: "",
  telefono: "",
  antecedentes: "",
  alergias: "",
  doctor: "",
});
const formCita = reactive({
  fecha: "",
  diagnostico: "",
  tratamiento: "",
  receta: "",
});
const indiceCitaEdicion = ref(null);

// Utilidad para renderizar errores como HTML
const erroresHTML = computed(() =>
  erroresFormulario.value.length
    ? erroresFormulario.value.map((m) => `• ${m}`).join("<br>")
    : ""
);

// Validar que sea doctor
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
  if (!usuario || usuario.rol !== "doctor") {
    accesoPermitido.value = false;
    setTimeout(() => router.push("/"), 1800);
  }
});

// Buscar paciente
function onBuscar() {
  mensajeError.value = "";
  mostrarFormulario.value = "";
  pacienteEncontrado.value = null;
  historialActual.value = null;
  citaAbierta.value = null;

  const valor = busqueda.value.trim();
  if (!valor) {
    mensajeError.value = "Ingrese una cédula o correo para buscar.";
    return;
  }
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const paciente = usuarios.find(
    (u) => u.cedula === valor || u.correo === valor
  );
  if (!paciente || paciente.rol !== "paciente") {
    mensajeError.value = "Paciente no encontrado.";
    return;
  }
  pacienteEncontrado.value = paciente;

  let historiales = JSON.parse(
    localStorage.getItem("historialesClinicos") || "[]"
  );
  let historia = historiales.find((h) => h.cedula === paciente.cedula);
  if (!historia) {
    mostrarFormulario.value = "crear";
    Object.assign(formHistorial, {
      sexo: paciente.sexo || "",
      fechaNacimiento: paciente.fechaNacimiento || "",
      tipoSangre: paciente.tipoSangre || "",
      raza: paciente.raza || "",
      telefono: paciente.telefono || "",
      antecedentes: "",
      alergias: "",
      doctor: "Dr. Leonardo Hidalgo",
    });
    historialActual.value = null;
    return;
  }
  historialActual.value = historia;
}

// Guardar nuevo historial
function guardarNuevoHistorial() {
  erroresFormulario.value = [];
  const { ok, mensajes } = validarFormularioHistorial(formHistorial);
  if (!ok) {
    erroresFormulario.value = mensajes;
    return;
  }
  let historiales = JSON.parse(
    localStorage.getItem("historialesClinicos") || "[]"
  );
  historiales.push({
    cedula: pacienteEncontrado.value.cedula,
    paciente: pacienteEncontrado.value.nombre,
    ...formHistorial,
    correo: pacienteEncontrado.value.correo,
    citas: [],
  });
  localStorage.setItem("historialesClinicos", JSON.stringify(historiales));
  mostrarFormulario.value = "";
  historialActual.value = historiales.find(
    (h) => h.cedula === pacienteEncontrado.value.cedula
  );
}

// Editar historial
function editarHistorial() {
  if (!historialActual.value) return;
  Object.assign(formHistorial, historialActual.value);
  mostrarFormulario.value = "editar";
}

// Guardar edición de historial
function guardarEdicionHistorial() {
  erroresFormulario.value = [];
  const { ok, mensajes } = validarFormularioHistorial(formHistorial);
  if (!ok) {
    erroresFormulario.value = mensajes;
    return;
  }
  let historiales = JSON.parse(
    localStorage.getItem("historialesClinicos") || "[]"
  );
  const idx = historiales.findIndex(
    (h) => h.cedula === pacienteEncontrado.value.cedula
  );
  if (idx !== -1) {
    historiales[idx] = {
      ...historiales[idx],
      ...formHistorial,
    };
    localStorage.setItem("historialesClinicos", JSON.stringify(historiales));
    historialActual.value = historiales[idx];
    mostrarFormulario.value = "";
  }
}

// Eliminar historial
function eliminarHistorial() {
  if (confirm("¿Está seguro de eliminar el historial completo?")) {
    let historiales = JSON.parse(
      localStorage.getItem("historialesClinicos") || "[]"
    );
    historiales = historiales.filter(
      (h) => h.cedula !== pacienteEncontrado.value.cedula
    );
    localStorage.setItem("historialesClinicos", JSON.stringify(historiales));
    historialActual.value = null;
    mensajeError.value = "Historial eliminado correctamente.";
    setTimeout(() => (mensajeError.value = ""), 1600);
  }
}

// ----- Citas -----
function agregarCita() {
  indiceCitaEdicion.value = null;
  formCita.fecha = "";
  formCita.diagnostico = "";
  formCita.tratamiento = "";
  formCita.receta = "";
  mostrarFormulario.value = "cita";
}
function editarCita(idx) {
  indiceCitaEdicion.value = idx;
  Object.assign(formCita, historialActual.value.citas[idx]);
  mostrarFormulario.value = "cita";
}
function eliminarCita(idx) {
  if (confirm("¿Seguro de eliminar esta cita?")) {
    let historiales = JSON.parse(
      localStorage.getItem("historialesClinicos") || "[]"
    );
    const historia = historiales.find(
      (h) => h.cedula === pacienteEncontrado.value.cedula
    );
    if (historia) {
      historia.citas.splice(idx, 1);
      localStorage.setItem("historialesClinicos", JSON.stringify(historiales));
      historialActual.value = historia;
      citaAbierta.value = null;
    }
  }
}

// Guardar cita (agregar o editar)
function guardarCita() {
  erroresFormulario.value = [];
  const { ok, mensajes } = validarFormularioCita(formCita);
  if (!ok) {
    erroresFormulario.value = mensajes;
    return;
  }
  let historiales = JSON.parse(
    localStorage.getItem("historialesClinicos") || "[]"
  );
  const historia = historiales.find(
    (h) => h.cedula === pacienteEncontrado.value.cedula
  );
  if (historia) {
    if (indiceCitaEdicion.value !== null) {
      historia.citas[indiceCitaEdicion.value] = { ...formCita };
    } else {
      historia.citas.push({ ...formCita });
    }
    localStorage.setItem("historialesClinicos", JSON.stringify(historiales));
    historialActual.value = historia;
    mostrarFormulario.value = "";
    citaAbierta.value = null;
  }
}

function cancelarEdicionCita() {
  mostrarFormulario.value = "";
  citaAbierta.value = null;
}

// Acordeón citas
function toggleCita(idx) {
  citaAbierta.value = citaAbierta.value === idx ? null : idx;
}
</script>

<style scoped>
@import "../assets/css/gestion_historial.css";
</style>
