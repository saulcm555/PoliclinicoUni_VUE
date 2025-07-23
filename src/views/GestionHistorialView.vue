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

        <!-- Formulario de historial (crear/editar) -->
        <div v-if="mostrarFormulario === 'crear' || mostrarFormulario === 'editar'" class="form-historial">
          <h3>{{ mostrarFormulario === 'crear' ? 'Crear' : 'Editar' }} historial clínico para {{ pacienteEncontrado.nombre }}</h3>
          <form @submit.prevent="guardarHistorial">
            <div
              v-if="erroresFormulario.length"
              class="form-errores"
              v-html="erroresHTML"
            ></div>
            
            <!-- Campos del formulario -->
            <label>Sexo: 
              <select v-model="formHistorial.sexo">
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </label>
            <label>Fecha de nacimiento: <input type="date" v-model="formHistorial.fechaNacimiento" /></label>
            <label>Tipo de sangre: 
              <select v-model="formHistorial.tipoSangre">
                <option value="">Seleccione...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </label>
            <label>Raza: <input v-model="formHistorial.raza" /></label>
            <label>Teléfono: <input v-model="formHistorial.telefono" /></label>
            <label>Antecedentes familiares: <input v-model="formHistorial.antecedentes" /></label>
            <label>Alergias: <input v-model="formHistorial.alergias" /></label>
            <label>Doctor: <input v-model="formHistorial.doctor" /></label>
            
            <!-- Botones -->
            <button type="submit">
              {{ mostrarFormulario === 'crear' ? 'Guardar historial' : 'Guardar cambios' }}
            </button>
            <button v-if="mostrarFormulario === 'editar'" type="button" @click="cancelarFormulario">
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

// ================ FUNCIONES DE VALIDACIÓN ================
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

// ================ VARIABLES REACTIVAS ================
// Control de acceso y estado general
const accesoPermitido = ref(true);
const busqueda = ref("");
const mensajeError = ref("");
const mostrarFormulario = ref(""); // '', 'crear', 'editar', 'cita'

// Datos de paciente e historial
const pacienteEncontrado = ref(null);
const historialActual = ref(null);

// Control de formularios
const erroresFormulario = ref([]);
const citaAbierta = ref(null);
const indiceCitaEdicion = ref(null);

// Formularios reactivos
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

// ================ COMPUTED PROPERTIES ================
const erroresHTML = computed(() =>
  erroresFormulario.value.length
    ? erroresFormulario.value.map((m) => `• ${m}`).join("<br>")
    : ""
);

// ================ INICIALIZACIÓN ================
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
  if (!usuario || usuario.rol !== "doctor") {
    accesoPermitido.value = false;
    setTimeout(() => router.push("/"), 1800);
  }
});

// ================ GESTIÓN DE HISTORIALES ================

// Buscar paciente
function onBuscar() {
  limpiarFormularios();
  
  const valor = busqueda.value.trim();
  if (!valor) {
    mensajeError.value = "Ingrese una cédula o correo para buscar.";
    return;
  }

  const paciente = buscarPaciente(valor);
  if (!paciente) {
    mensajeError.value = "Paciente no encontrado.";
    return;
  }

  pacienteEncontrado.value = paciente;
  const historia = buscarHistorial(paciente.cedula);
  
  if (!historia) {
    prepararCrearHistorial(paciente);
  } else {
    historialActual.value = historia;
  }
}

// Funciones auxiliares de búsqueda
function buscarPaciente(valor) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  return usuarios.find(u => 
    (u.cedula === valor || u.correo === valor) && u.rol === "paciente"
  );
}

function buscarHistorial(cedula) {
  const historiales = JSON.parse(localStorage.getItem("historialesClinicos") || "[]");
  return historiales.find(h => h.cedula === cedula);
}

function prepararCrearHistorial(paciente) {
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
}

// Función unificada para guardar historial (crear o editar)
function guardarHistorial() {
  erroresFormulario.value = [];
  const { ok, mensajes } = validarFormularioHistorial(formHistorial);
  
  if (!ok) {
    erroresFormulario.value = mensajes;
    return;
  }

  let historiales = JSON.parse(localStorage.getItem("historialesClinicos") || "[]");
  
  if (mostrarFormulario.value === "crear") {
    // Crear nuevo historial
    historiales.push({
      cedula: pacienteEncontrado.value.cedula,
      paciente: pacienteEncontrado.value.nombre,
      correo: pacienteEncontrado.value.correo,
      citas: [],
      ...formHistorial,
    });
  } else {
    // Editar historial existente
    const idx = historiales.findIndex(h => h.cedula === pacienteEncontrado.value.cedula);
    if (idx !== -1) {
      historiales[idx] = { ...historiales[idx], ...formHistorial };
    }
  }

  localStorage.setItem("historialesClinicos", JSON.stringify(historiales));
  historialActual.value = historiales.find(h => h.cedula === pacienteEncontrado.value.cedula);
  mostrarFormulario.value = "";
}

// Preparar edición de historial
function editarHistorial() {
  if (!historialActual.value) return;
  Object.assign(formHistorial, historialActual.value);
  mostrarFormulario.value = "editar";
}

// Eliminar historial
function eliminarHistorial() {
  if (!confirm("¿Está seguro de eliminar el historial completo?")) return;
  
  let historiales = JSON.parse(localStorage.getItem("historialesClinicos") || "[]");
  historiales = historiales.filter(h => h.cedula !== pacienteEncontrado.value.cedula);
  
  localStorage.setItem("historialesClinicos", JSON.stringify(historiales));
  historialActual.value = null;
  mensajeError.value = "Historial eliminado correctamente.";
  setTimeout(() => (mensajeError.value = ""), 1600);
}

// Cancelar formulario
function cancelarFormulario() {
  mostrarFormulario.value = "";
}

// Limpiar todos los formularios y estados
function limpiarFormularios() {
  mensajeError.value = "";
  mostrarFormulario.value = "";
  pacienteEncontrado.value = null;
  historialActual.value = null;
  citaAbierta.value = null;
  erroresFormulario.value = [];
}

// ================ GESTIÓN DE CITAS EN HISTORIAL ================

function agregarCita() {
  prepararFormularioCita();
  mostrarFormulario.value = "cita";
}

function editarCita(idx) {
  prepararFormularioCita(idx);
  mostrarFormulario.value = "cita";
}

function prepararFormularioCita(indiceEdicion = null) {
  indiceCitaEdicion.value = indiceEdicion;
  
  if (indiceEdicion !== null) {
    // Editar cita existente
    Object.assign(formCita, historialActual.value.citas[indiceEdicion]);
  } else {
    // Nueva cita
    Object.assign(formCita, {
      fecha: "",
      diagnostico: "",
      tratamiento: "",
      receta: "",
    });
  }
}

function eliminarCita(idx) {
  if (!confirm("¿Seguro de eliminar esta cita?")) return;
  
  const historiales = JSON.parse(localStorage.getItem("historialesClinicos") || "[]");
  const historia = historiales.find(h => h.cedula === pacienteEncontrado.value.cedula);
  
  if (historia) {
    historia.citas.splice(idx, 1);
    localStorage.setItem("historialesClinicos", JSON.stringify(historiales));
    historialActual.value = historia;
    citaAbierta.value = null;
  }
}

function guardarCita() {
  erroresFormulario.value = [];
  const { ok, mensajes } = validarFormularioCita(formCita);
  
  if (!ok) {
    erroresFormulario.value = mensajes;
    return;
  }

  const historiales = JSON.parse(localStorage.getItem("historialesClinicos") || "[]");
  const historia = historiales.find(h => h.cedula === pacienteEncontrado.value.cedula);
  
  if (!historia) return;

  if (indiceCitaEdicion.value !== null) {
    // Editar cita existente
    historia.citas[indiceCitaEdicion.value] = { ...formCita };
  } else {
    // Agregar nueva cita
    historia.citas.push({ ...formCita });
  }

  localStorage.setItem("historialesClinicos", JSON.stringify(historiales));
  historialActual.value = historia;
  cancelarEdicionCita();
}

function cancelarEdicionCita() {
  mostrarFormulario.value = "";
  citaAbierta.value = null;
}

function toggleCita(idx) {
  citaAbierta.value = citaAbierta.value === idx ? null : idx;
}
</script>

<style scoped>
@import "../assets/css/gestion_historial.css";
</style>
