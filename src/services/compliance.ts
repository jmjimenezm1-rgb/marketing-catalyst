// Servicio de cumplimiento (mock, sin APIs reales).
// Valida cada envío antes de permitirlo: consentimiento, bajas, canal, frecuencia,
// aprobación de campaña y mensaje, mecanismo de baja y límites de envío.
import {
  campanas,
  getCliente,
  getMensaje,
  type Canal,
  type Envio,
} from "@/data/mock";

export interface Chequeo {
  clave: string;
  etiqueta: string;
  ok: boolean;
  bloqueante: boolean;
  detalle: string;
}

export interface ResultadoValidacion {
  permitido: boolean;
  chequeos: Chequeo[];
}

export const LIMITE_ENVIOS_DIARIOS = 500;
export const DIAS_MIN_ENTRE_CONTACTOS = 3;
export const CANALES_HABILITADOS: Record<Canal, boolean> = { email: true, whatsapp: true };

export function validarEnvio(envio: Envio, enviosDelDia = 0): ResultadoValidacion {
  const cliente = getCliente(envio.clienteId);
  const mensaje = getMensaje(envio.mensajeId);
  const campana = campanas.find((c) => c.id === envio.campanaId);
  const consentimiento = cliente?.consentimiento[envio.canal];

  const dias = cliente
    ? Math.floor((Date.now() - new Date(cliente.ultimoContacto).getTime()) / 86400000)
    : 99;

  const chequeos: Chequeo[] = [
    {
      clave: "campana",
      etiqueta: "Campaña aprobada",
      ok: !!campana && ["aprobada", "programada", "activa"].includes(campana.estado),
      bloqueante: true,
      detalle: campana ? `Estado: ${campana.estado.replace("_", " ")}` : "Campaña no encontrada",
    },
    {
      clave: "mensaje",
      etiqueta: "Mensaje aprobado",
      ok: !!mensaje?.aprobado,
      bloqueante: true,
      detalle: mensaje?.aprobado ? "Aprobado en revisión humana" : "Pendiente de revisión",
    },
    {
      clave: "consentimiento",
      etiqueta: `Consentimiento válido (${envio.canal})`,
      ok: consentimiento === "valido",
      bloqueante: true,
      detalle: cliente
        ? `${consentimiento} · ${cliente.baseJuridica} · ${cliente.fuenteConsentimiento}`
        : "Cliente no encontrado",
    },
    {
      clave: "baja",
      etiqueta: "Sin baja ni oposición",
      ok: consentimiento !== "baja" && consentimiento !== "revocado",
      bloqueante: true,
      detalle:
        consentimiento === "baja" || consentimiento === "revocado"
          ? "Contacto en lista interna de exclusión"
          : "No consta baja ni oposición",
    },
    {
      clave: "canal",
      etiqueta: "Canal habilitado",
      ok: CANALES_HABILITADOS[envio.canal],
      bloqueante: true,
      detalle: `Conector ${envio.canal} simulado (mock) activo`,
    },
    {
      clave: "frecuencia",
      etiqueta: "Frecuencia de contacto aceptable",
      ok: dias >= DIAS_MIN_ENTRE_CONTACTOS,
      bloqueante: false,
      detalle: `Último contacto hace ${dias} días (mínimo ${DIAS_MIN_ENTRE_CONTACTOS})`,
    },
    {
      clave: "opt_out",
      etiqueta: "Incluye mecanismo de baja",
      ok: !!mensaje?.incluyeBaja,
      bloqueante: true,
      detalle: mensaje?.incluyeBaja ? "Enlace/instrucción de baja presente" : "Falta mecanismo de baja",
    },
    {
      clave: "riesgo",
      etiqueta: "Sin alertas legales bloqueantes",
      ok: mensaje?.riesgoLegal !== "alto",
      bloqueante: true,
      detalle: `Riesgo legal del mensaje: ${mensaje?.riesgoLegal ?? "desconocido"}`,
    },
    {
      clave: "limite",
      etiqueta: "Dentro del límite de envíos",
      ok: enviosDelDia < LIMITE_ENVIOS_DIARIOS,
      bloqueante: true,
      detalle: `${enviosDelDia}/${LIMITE_ENVIOS_DIARIOS} envíos del día`,
    },
  ];

  return { permitido: chequeos.every((c) => c.ok || !c.bloqueante), chequeos };
}
