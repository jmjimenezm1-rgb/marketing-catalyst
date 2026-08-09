// Generador de respuestas SIMULADO (mock). No hay modelo real conectado.
// Reglas de IA responsable: no inventa datos, no promete resultados absolutos,
// no oculta la identidad del remitente, prioriza las bajas y siempre permite edición humana.
import { nombreProducto, type MensajeEntrada } from "@/data/mock";

export type TonoRespuesta = "comercial" | "consultivo" | "formal" | "breve" | "legal";

export function generarRespuesta(entrada: MensajeEntrada, tono: TonoRespuesta = "consultivo"): string {
  const producto = nombreProducto(entrada.productoId);
  const cierre =
    "\n\nPuedes indicarnos en cualquier momento si no deseas recibir más comunicaciones comerciales.";

  if (entrada.intencion === "solicita_baja") {
    return (
      "Hemos registrado su solicitud de baja y su oposición al tratamiento con fines de comunicación comercial. " +
      "Su contacto queda excluido de futuras campañas y añadido a nuestra lista interna de exclusión. " +
      "No se generarán nuevos mensajes comerciales."
    );
  }
  if (entrada.intencion === "queja") {
    return (
      "Hemos recibido su comunicación y la hemos escalado con prioridad alta. " +
      "Le indicamos el origen de sus datos, la base jurídica aplicada y la finalidad del tratamiento, " +
      "y le adjuntamos el procedimiento para ejercer sus derechos. Esta respuesta requiere revisión legal antes del envío."
    );
  }

  const base: Record<TonoRespuesta, string> = {
    comercial: `Gracias por responder. Sobre ${producto}, le propongo una demostración de 20 minutos centrada en su caso.`,
    consultivo: `Gracias por su respuesta. Antes de proponer nada sobre ${producto}, me gustaría entender cómo lo resuelven hoy y qué prioridad tiene para ustedes.`,
    formal: `Estimado/a cliente:\n\nAgradecemos su respuesta en relación con ${producto}. Quedamos a su disposición para facilitarle la documentación que precise.`,
    breve: `Gracias por responder. ¿Le encaja una llamada corta esta semana para ver ${producto}?`,
    legal: `Le confirmamos que su solicitud ha sido registrada. Esta respuesta requiere revisión previa del área de cumplimiento antes de su envío.`,
  };

  const porIntencion: Partial<Record<MensajeEntrada["intencion"], string>> = {
    objecion_precio: "\n\nLe envío el desglose de coste total a 12 meses para que la comparación sea equivalente.",
    objecion_timing: "\n\nSi el presupuesto está cerrado, retomamos contacto en la fecha que nos indique.",
    solicita_llamada: "\n\nLe propongo dos franjas horarias y confirmo la que mejor le encaje.",
    solicita_info: "\n\nLe adjunto el dossier con el detalle funcional y precios orientativos.",
    no_interesado: "\n\nTomamos nota y no insistiremos con esta propuesta.",
  };

  return (
    (base[tono] ?? base.consultivo) +
    (porIntencion[entrada.intencion] ?? "") +
    "\n\n[Simulado: sin datos inventados. Los campos no registrados se han omitido en lugar de completarse.]" +
    cierre
  );
}
