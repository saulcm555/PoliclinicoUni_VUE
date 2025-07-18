// src/components/validacionHistorial.js
// Valida los campos del formulario de crear/editar historial
export function validarFormularioHistorial(datos) {
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

// Valida los campos del formulario de agregar/editar cita
export function validarFormularioCita(datos) {
    let ok = true;
    let mensajes = [];

    const { fecha, diagnostico, tratamiento, receta } = datos;

    if (!fecha) { ok = false; mensajes.push("El campo 'Fecha' es obligatorio."); }
    if (!diagnostico) { ok = false; mensajes.push("El campo 'Diagnóstico' es obligatorio."); }
    if (!tratamiento) { ok = false; mensajes.push("El campo 'Tratamiento' es obligatorio."); }
    if (!receta) { ok = false; mensajes.push("El campo 'Receta' es obligatorio."); }

    return { ok, mensajes };
}
