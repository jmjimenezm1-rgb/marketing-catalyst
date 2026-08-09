// Datos FICTICIOS de demostración. No corresponden a personas reales.
// Módulos 8-11: Envíos, Secuencias, Bandeja de entrada, Bandeja de salida.

export type Canal = "email" | "whatsapp";

export type EstadoEnvio =
  | "pendiente"
  | "programado"
  | "enviado"
  | "entregado"
  | "leido"
  | "respondido"
  | "fallido"
  | "cancelado";

export type EstadoConsentimiento = "valido" | "ausente" | "revocado" | "baja";

export interface Cliente {
  id: string;
  nombre: string;
  contacto: string;
  sector: string;
  responsable: string;
  consentimiento: Record<Canal, EstadoConsentimiento>;
  fuenteConsentimiento: string;
  baseJuridica: string;
  ultimoContacto: string; // ISO
}

export interface Producto {
  id: string;
  nombre: string;
}

export interface Campana {
  id: string;
  nombre: string;
  productoId: string;
  estado: "borrador" | "pendiente_revision" | "aprobada" | "programada" | "activa" | "finalizada";
  canal: "email" | "whatsapp" | "mixto";
}

export interface Mensaje {
  id: string;
  clienteId: string;
  campanaId: string;
  productoId: string;
  canal: Canal;
  asunto?: string | undefined;
  texto: string;
  aprobado: boolean;
  riesgoLegal: "bajo" | "medio" | "alto";
  incluyeBaja: boolean;
  personalizacion: "baja" | "media" | "alta";
}

export interface Envio {
  id: string;
  clienteId: string;
  campanaId: string;
  productoId: string;
  mensajeId: string;
  canal: Canal;
  tipo:
    | "individual_inmediato"
    | "individual_programado"
    | "masivo_inmediato"
    | "masivo_programado"
    | "lotes"
    | "secuencia"
    | "condicionado_respuesta"
    | "condicionado_no_respuesta";
  estado: EstadoEnvio;
  fechaProgramacion?: string | undefined;
  fechaEnvio?: string | undefined;
  fechaEntrega?: string | undefined;
  fechaLectura?: string | undefined;
  fechaRespuesta?: string | undefined;
  error?: string | undefined;
  idExterno?: string | undefined;
  aprobadoPor?: string | undefined;
  enviadoPor?: string | undefined;
  historial: { fecha: string; evento: string; usuario: string }[];
}

export type CondicionPaso =
  | "siempre"
  | "no_responde"
  | "responde_positivo"
  | "responde_negativo"
  | "pide_info"
  | "solicita_baja"
  | "interes_otro_producto"
  | "email_no_entregado"
  | "whatsapp_no_entregado"
  | "abre_sin_responder"
  | "hace_clic"
  | "agenda_reunion"
  | "comercial_marca_oportunidad";

export interface PasoSecuencia {
  id: string;
  orden: number;
  tipo:
    | "inicial"
    | "seguimiento_1"
    | "seguimiento_2"
    | "recordatorio"
    | "caso_uso"
    | "propuesta_valor"
    | "cierre"
    | "reactivacion"
    | "post_respuesta"
    | "post_no_respuesta";
  canal: Canal;
  plantilla: string;
  condicion: CondicionPaso;
  esperaDias: number;
  segmento: string;
  variacion: string;
  objetivo: string;
  estado: "borrador" | "activo" | "pausado";
  revisionRequerida: boolean;
  adaptacionIA: string[];
}

export interface Secuencia {
  id: string;
  campanaId: string;
  nombre: string;
  estado: "borrador" | "activa" | "pausada";
  pasos: PasoSecuencia[];
}

export type IntencionEntrada =
  | "interesado"
  | "solicita_info"
  | "solicita_llamada"
  | "objecion_precio"
  | "objecion_timing"
  | "no_interesado"
  | "solicita_baja"
  | "respuesta_automatica"
  | "error_contacto"
  | "queja"
  | "otro";

export interface MensajeEntrada {
  id: string;
  clienteId: string;
  campanaId: string;
  productoId: string;
  canal: Canal;
  fecha: string;
  texto: string;
  intencion: IntencionEntrada;
  prioridad: "alta" | "media" | "baja";
  estado: "nuevo" | "en_curso" | "resuelto";
  responsable: string;
  proximaAccion: string;
  notas: { fecha: string; usuario: string; texto: string }[];
}

export interface Borrador {
  id: string;
  clienteId: string;
  campanaId: string;
  productoId: string;
  canal: Canal;
  entradaId?: string | undefined;
  texto: string;
  estado: "borrador" | "pendiente_revision" | "aprobada" | "programada" | "enviada" | "cancelada";
  responsable: string;
  creado: string;
  previstoEnvio?: string | undefined;
  riesgoLegal: "bajo" | "medio" | "alto";
  revisionLegal: boolean;
}

export const productos: Producto[] = [
  { id: "p1", nombre: "Suite de Facturación Cloud" },
  { id: "p2", nombre: "Consultoría RGPD" },
  { id: "p3", nombre: "Plataforma de Firma Digital" },
  { id: "p4", nombre: "Soporte IT Gestionado" },
  { id: "p5", nombre: "Formación en Ciberseguridad" },
];

export const campanas: Campana[] = [
  { id: "c1", nombre: "Captación PYME Q3", productoId: "p1", estado: "aprobada", canal: "mixto" },
  { id: "c2", nombre: "Reactivación clientes 2024", productoId: "p4", estado: "activa", canal: "email" },
  { id: "c3", nombre: "Cross-selling RGPD", productoId: "p2", estado: "pendiente_revision", canal: "email" },
  { id: "c4", nombre: "Lanzamiento Firma Digital", productoId: "p3", estado: "programada", canal: "whatsapp" },
];

export const clientes: Cliente[] = [
  {
    id: "cl1",
    nombre: "Nortia Logística S.L. (ficticio)",
    contacto: "Ana Ficticia — Dir. Operaciones",
    sector: "Logística",
    responsable: "L. Vega",
    consentimiento: { email: "valido", whatsapp: "valido" },
    fuenteConsentimiento: "Formulario web 2025-11-04",
    baseJuridica: "Consentimiento expreso",
    ultimoContacto: "2026-07-28",
  },
  {
    id: "cl2",
    nombre: "Talleres Aribau (ficticio)",
    contacto: "Marc Ejemplo — Gerente",
    sector: "Automoción",
    responsable: "L. Vega",
    consentimiento: { email: "valido", whatsapp: "ausente" },
    fuenteConsentimiento: "Relación contractual previa",
    baseJuridica: "Art. 21.2 LSSI (productos similares)",
    ultimoContacto: "2026-08-01",
  },
  {
    id: "cl3",
    nombre: "Clínica Solmar (ficticio)",
    contacto: "Rosa Demo — Administración",
    sector: "Salud",
    responsable: "P. Ruiz",
    consentimiento: { email: "ausente", whatsapp: "ausente" },
    fuenteConsentimiento: "Sin evidencia registrada",
    baseJuridica: "Pendiente de validación legal",
    ultimoContacto: "2026-06-12",
  },
  {
    id: "cl4",
    nombre: "Grupo Aldavara (ficticio)",
    contacto: "Iván Prueba — CFO",
    sector: "Construcción",
    responsable: "P. Ruiz",
    consentimiento: { email: "baja", whatsapp: "revocado" },
    fuenteConsentimiento: "Opt-out 2026-05-19",
    baseJuridica: "Baja registrada",
    ultimoContacto: "2026-05-19",
  },
  {
    id: "cl5",
    nombre: "Editorial Vandelia (ficticio)",
    contacto: "Nuria Muestra — Marketing",
    sector: "Editorial",
    responsable: "S. Coll",
    consentimiento: { email: "valido", whatsapp: "valido" },
    fuenteConsentimiento: "Doble opt-in 2026-02-11",
    baseJuridica: "Consentimiento expreso",
    ultimoContacto: "2026-08-06",
  },
  {
    id: "cl6",
    nombre: "Bodegas Trescampos (ficticio)",
    contacto: "Hugo Test — Director",
    sector: "Alimentación",
    responsable: "S. Coll",
    consentimiento: { email: "valido", whatsapp: "ausente" },
    fuenteConsentimiento: "Formulario feria 2026-03-02",
    baseJuridica: "Consentimiento expreso",
    ultimoContacto: "2026-07-15",
  },
];

export const mensajes: Mensaje[] = [
  {
    id: "m1",
    clienteId: "cl1",
    campanaId: "c1",
    productoId: "p1",
    canal: "email",
    asunto: "Cierra el mes en 2 horas, no en 2 días",
    texto:
      "Hola Ana,\n\nEn Nortia gestionáis picos de facturación estacionales. Nuestra Suite de Facturación Cloud automatiza validaciones y conciliación.\n\n¿Te encaja una demo de 20 minutos?\n\nPuedes darte de baja de estas comunicaciones en cualquier momento.",
    aprobado: true,
    riesgoLegal: "bajo",
    incluyeBaja: true,
    personalizacion: "alta",
  },
  {
    id: "m2",
    clienteId: "cl2",
    campanaId: "c1",
    productoId: "p1",
    canal: "email",
    asunto: "Facturación de taller sin dobles registros",
    texto:
      "Hola Marc,\n\nComo cliente de Soporte IT Gestionado, puedes activar la Suite de Facturación Cloud sin migraciones.\n\nBaja disponible en el pie del mensaje.",
    aprobado: true,
    riesgoLegal: "medio",
    incluyeBaja: true,
    personalizacion: "media",
  },
  {
    id: "m3",
    clienteId: "cl3",
    campanaId: "c3",
    productoId: "p2",
    canal: "email",
    asunto: "Revisión RGPD para clínicas",
    texto: "Hola Rosa,\n\nOs proponemos una revisión de cumplimiento RGPD adaptada al sector salud.",
    aprobado: false,
    riesgoLegal: "alto",
    incluyeBaja: false,
    personalizacion: "baja",
  },
  {
    id: "m4",
    clienteId: "cl5",
    campanaId: "c2",
    productoId: "p4",
    canal: "email",
    asunto: "Volvemos a estar disponibles para Vandelia",
    texto: "Hola Nuria,\n\nRetomamos contacto para revisar vuestro soporte IT. Baja disponible al final.",
    aprobado: true,
    riesgoLegal: "bajo",
    incluyeBaja: true,
    personalizacion: "alta",
  },
  {
    id: "m5",
    clienteId: "cl1",
    campanaId: "c4",
    productoId: "p3",
    canal: "whatsapp",
    texto:
      "Hola Ana, soy Laura de MarketingHub (ficticio). ¿Te enviamos la ficha de Firma Digital? Responde BAJA para no recibir más mensajes.",
    aprobado: true,
    riesgoLegal: "bajo",
    incluyeBaja: true,
    personalizacion: "media",
  },
  {
    id: "m6",
    clienteId: "cl6",
    campanaId: "c4",
    productoId: "p3",
    canal: "whatsapp",
    texto: "Hola Hugo, ¿te interesa la Firma Digital para pedidos? Responde BAJA para dejar de recibir mensajes.",
    aprobado: true,
    riesgoLegal: "medio",
    incluyeBaja: true,
    personalizacion: "baja",
  },
  {
    id: "m7",
    clienteId: "cl4",
    campanaId: "c2",
    productoId: "p4",
    canal: "email",
    asunto: "Renovación de soporte",
    texto: "Hola Iván, revisamos la renovación del soporte gestionado.",
    aprobado: true,
    riesgoLegal: "alto",
    incluyeBaja: true,
    personalizacion: "media",
  },
];

export const enviosSeed: Envio[] = [
  {
    id: "e1",
    clienteId: "cl1",
    campanaId: "c1",
    productoId: "p1",
    mensajeId: "m1",
    canal: "email",
    tipo: "masivo_programado",
    estado: "respondido",
    fechaProgramacion: "2026-08-03T09:00:00Z",
    fechaEnvio: "2026-08-03T09:00:12Z",
    fechaEntrega: "2026-08-03T09:00:41Z",
    fechaLectura: "2026-08-03T11:22:00Z",
    fechaRespuesta: "2026-08-04T08:10:00Z",
    idExterno: "esp_9f21ac",
    aprobadoPor: "compliance@demo",
    enviadoPor: "l.vega@demo",
    historial: [
      { fecha: "2026-08-02T17:00:00Z", evento: "Aprobado por Legal", usuario: "compliance@demo" },
      { fecha: "2026-08-03T09:00:12Z", evento: "Enviado vía proveedor email (mock)", usuario: "sistema" },
      { fecha: "2026-08-04T08:10:00Z", evento: "Respuesta recibida", usuario: "sistema" },
    ],
  },
  {
    id: "e2",
    clienteId: "cl2",
    campanaId: "c1",
    productoId: "p1",
    mensajeId: "m2",
    canal: "email",
    tipo: "masivo_programado",
    estado: "leido",
    fechaProgramacion: "2026-08-03T09:00:00Z",
    fechaEnvio: "2026-08-03T09:00:15Z",
    fechaEntrega: "2026-08-03T09:01:02Z",
    fechaLectura: "2026-08-05T07:45:00Z",
    idExterno: "esp_9f21ad",
    aprobadoPor: "compliance@demo",
    enviadoPor: "l.vega@demo",
    historial: [{ fecha: "2026-08-03T09:00:15Z", evento: "Enviado (mock)", usuario: "sistema" }],
  },
  {
    id: "e3",
    clienteId: "cl5",
    campanaId: "c2",
    productoId: "p4",
    mensajeId: "m4",
    canal: "email",
    tipo: "secuencia",
    estado: "programado",
    fechaProgramacion: "2026-08-12T08:00:00Z",
    aprobadoPor: "compliance@demo",
    historial: [{ fecha: "2026-08-07T10:00:00Z", evento: "Programado paso 2 de secuencia", usuario: "s.coll@demo" }],
  },
  {
    id: "e4",
    clienteId: "cl1",
    campanaId: "c4",
    productoId: "p3",
    mensajeId: "m5",
    canal: "whatsapp",
    tipo: "individual_programado",
    estado: "pendiente",
    fechaProgramacion: "2026-08-10T16:30:00Z",
    historial: [{ fecha: "2026-08-08T09:12:00Z", evento: "Creado desde revisión de mensajes", usuario: "s.coll@demo" }],
  },
  {
    id: "e5",
    clienteId: "cl6",
    campanaId: "c4",
    productoId: "p3",
    mensajeId: "m6",
    canal: "whatsapp",
    tipo: "masivo_inmediato",
    estado: "fallido",
    fechaEnvio: "2026-08-06T12:00:00Z",
    error: "Bloqueado por cumplimiento: falta opt-in específico de WhatsApp",
    historial: [
      { fecha: "2026-08-06T12:00:00Z", evento: "Envío bloqueado por validación de consentimiento", usuario: "sistema" },
    ],
  },
  {
    id: "e6",
    clienteId: "cl4",
    campanaId: "c2",
    productoId: "p4",
    mensajeId: "m7",
    canal: "email",
    tipo: "masivo_programado",
    estado: "cancelado",
    fechaProgramacion: "2026-08-05T09:00:00Z",
    error: "Contacto con baja registrada (opt-out 2026-05-19)",
    historial: [{ fecha: "2026-08-04T18:00:00Z", evento: "Cancelado por lista de exclusión", usuario: "sistema" }],
  },
];

export const secuenciasSeed: Secuencia[] = [
  {
    id: "s1",
    campanaId: "c1",
    nombre: "Captación PYME — 5 toques",
    estado: "activa",
    pasos: [
      {
        id: "s1p1",
        orden: 1,
        tipo: "inicial",
        canal: "email",
        plantilla: "PYME_intro_v3",
        condicion: "siempre",
        esperaDias: 0,
        segmento: "PYME 10-50 empleados",
        variacion: "A",
        objetivo: "Presentar propuesta de valor",
        estado: "activo",
        revisionRequerida: true,
        adaptacionIA: ["Producto", "Segmento"],
      },
      {
        id: "s1p2",
        orden: 2,
        tipo: "seguimiento_1",
        canal: "email",
        plantilla: "PYME_follow_1",
        condicion: "no_responde",
        esperaDias: 4,
        segmento: "PYME 10-50 empleados",
        variacion: "A",
        objetivo: "Recordar con caso de uso",
        estado: "activo",
        revisionRequerida: true,
        adaptacionIA: ["Historial de interacción", "Objeciones detectadas"],
      },
      {
        id: "s1p3",
        orden: 3,
        tipo: "caso_uso",
        canal: "whatsapp",
        plantilla: "PYME_caso_uso_wa",
        condicion: "abre_sin_responder",
        esperaDias: 3,
        segmento: "Con opt-in WhatsApp",
        variacion: "B",
        objetivo: "Aportar prueba social",
        estado: "activo",
        revisionRequerida: true,
        adaptacionIA: ["Tono de la conversación"],
      },
      {
        id: "s1p4",
        orden: 4,
        tipo: "cierre",
        canal: "email",
        plantilla: "PYME_cierre",
        condicion: "pide_info",
        esperaDias: 2,
        segmento: "Interesados",
        variacion: "A",
        objetivo: "Agendar reunión",
        estado: "borrador",
        revisionRequerida: true,
        adaptacionIA: ["Estado de la oportunidad"],
      },
    ],
  },
  {
    id: "s2",
    campanaId: "c2",
    nombre: "Reactivación — 3 toques",
    estado: "activa",
    pasos: [
      {
        id: "s2p1",
        orden: 1,
        tipo: "reactivacion",
        canal: "email",
        plantilla: "REACT_intro",
        condicion: "siempre",
        esperaDias: 0,
        segmento: "Inactivos 12 meses",
        variacion: "A",
        objetivo: "Retomar contacto",
        estado: "activo",
        revisionRequerida: true,
        adaptacionIA: ["Historial de interacción"],
      },
      {
        id: "s2p2",
        orden: 2,
        tipo: "propuesta_valor",
        canal: "email",
        plantilla: "REACT_valor",
        condicion: "no_responde",
        esperaDias: 7,
        segmento: "Inactivos 12 meses",
        variacion: "B",
        objetivo: "Ampliar propuesta de valor",
        estado: "activo",
        revisionRequerida: true,
        adaptacionIA: ["Producto", "Respuesta del cliente"],
      },
      {
        id: "s2p3",
        orden: 3,
        tipo: "post_respuesta",
        canal: "email",
        plantilla: "REACT_post_resp",
        condicion: "responde_positivo",
        esperaDias: 1,
        segmento: "Respuestas positivas",
        variacion: "A",
        objetivo: "Derivar a comercial",
        estado: "activo",
        revisionRequerida: false,
        adaptacionIA: ["Estado de la oportunidad"],
      },
    ],
  },
  {
    id: "s3",
    campanaId: "c4",
    nombre: "Lanzamiento Firma Digital — WhatsApp",
    estado: "pausada",
    pasos: [
      {
        id: "s3p1",
        orden: 1,
        tipo: "inicial",
        canal: "whatsapp",
        plantilla: "FIRMA_intro_wa",
        condicion: "siempre",
        esperaDias: 0,
        segmento: "Opt-in WhatsApp verificado",
        variacion: "A",
        objetivo: "Anunciar lanzamiento",
        estado: "pausado",
        revisionRequerida: true,
        adaptacionIA: ["Segmento"],
      },
      {
        id: "s3p2",
        orden: 2,
        tipo: "recordatorio",
        canal: "whatsapp",
        plantilla: "FIRMA_recordatorio",
        condicion: "no_responde",
        esperaDias: 5,
        segmento: "Opt-in WhatsApp verificado",
        variacion: "A",
        objetivo: "Recordar oferta de lanzamiento",
        estado: "borrador",
        revisionRequerida: true,
        adaptacionIA: ["Objeciones detectadas"],
      },
    ],
  },
];

export const entradasSeed: MensajeEntrada[] = [
  {
    id: "in1",
    clienteId: "cl1",
    campanaId: "c1",
    productoId: "p1",
    canal: "email",
    fecha: "2026-08-04T08:10:00Z",
    texto: "Nos interesa. ¿Podéis enviarnos precios y disponibilidad para una demo la semana que viene?",
    intencion: "solicita_info",
    prioridad: "alta",
    estado: "nuevo",
    responsable: "L. Vega",
    proximaAccion: "Enviar dossier y proponer 2 franjas de reunión",
    notas: [],
  },
  {
    id: "in2",
    clienteId: "cl2",
    campanaId: "c1",
    productoId: "p1",
    canal: "email",
    fecha: "2026-08-05T09:30:00Z",
    texto: "Ahora mismo el presupuesto está cerrado, retomad en enero.",
    intencion: "objecion_timing",
    prioridad: "media",
    estado: "en_curso",
    responsable: "L. Vega",
    proximaAccion: "Programar reactivación en enero",
    notas: [{ fecha: "2026-08-05T10:00:00Z", usuario: "l.vega@demo", texto: "Añadido a secuencia de nutrición." }],
  },
  {
    id: "in3",
    clienteId: "cl4",
    campanaId: "c2",
    productoId: "p4",
    canal: "email",
    fecha: "2026-08-05T18:02:00Z",
    texto: "Quiero darme de baja y que dejéis de tratar mis datos para publicidad.",
    intencion: "solicita_baja",
    prioridad: "alta",
    estado: "nuevo",
    responsable: "Compliance",
    proximaAccion: "Registrar baja y oposición; bloquear para campañas",
    notas: [],
  },
  {
    id: "in4",
    clienteId: "cl5",
    campanaId: "c2",
    productoId: "p4",
    canal: "whatsapp",
    fecha: "2026-08-06T11:15:00Z",
    texto: "El precio nos parece alto comparado con nuestro proveedor actual.",
    intencion: "objecion_precio",
    prioridad: "media",
    estado: "nuevo",
    responsable: "S. Coll",
    proximaAccion: "Responder con comparativa de coste total",
    notas: [],
  },
  {
    id: "in5",
    clienteId: "cl6",
    campanaId: "c4",
    productoId: "p3",
    canal: "whatsapp",
    fecha: "2026-08-07T13:40:00Z",
    texto: "¿Podéis llamarme mañana por la mañana?",
    intencion: "solicita_llamada",
    prioridad: "alta",
    estado: "nuevo",
    responsable: "S. Coll",
    proximaAccion: "Agendar llamada y confirmar por WhatsApp",
    notas: [],
  },
  {
    id: "in6",
    clienteId: "cl3",
    campanaId: "c3",
    productoId: "p2",
    canal: "email",
    fecha: "2026-08-07T15:05:00Z",
    texto: "¿De dónde habéis obtenido mis datos? Solicito información sobre el tratamiento.",
    intencion: "queja",
    prioridad: "alta",
    estado: "nuevo",
    responsable: "Compliance",
    proximaAccion: "Respuesta revisable por Legal con origen del dato y base jurídica",
    notas: [],
  },
  {
    id: "in7",
    clienteId: "cl2",
    campanaId: "c1",
    productoId: "p1",
    canal: "email",
    fecha: "2026-08-08T07:00:00Z",
    texto: "Estaré fuera de la oficina hasta el 20 de agosto.",
    intencion: "respuesta_automatica",
    prioridad: "baja",
    estado: "resuelto",
    responsable: "Sistema",
    proximaAccion: "Reprogramar seguimiento tras el 20 de agosto",
    notas: [],
  },
];

export const borradoresSeed: Borrador[] = [
  {
    id: "b1",
    clienteId: "cl1",
    campanaId: "c1",
    productoId: "p1",
    canal: "email",
    entradaId: "in1",
    texto:
      "Hola Ana,\n\nGracias por tu interés. Te adjunto el dossier con el detalle funcional y precios orientativos por número de usuarios.\n\n¿Te encaja el martes a las 10:00 o el jueves a las 16:00?\n\nPuedes darte de baja de estas comunicaciones cuando quieras.",
    estado: "pendiente_revision",
    responsable: "L. Vega",
    creado: "2026-08-04T09:00:00Z",
    previstoEnvio: "2026-08-09T09:00:00Z",
    riesgoLegal: "bajo",
    revisionLegal: false,
  },
  {
    id: "b2",
    clienteId: "cl4",
    campanaId: "c2",
    productoId: "p4",
    canal: "email",
    entradaId: "in3",
    texto:
      "Estimado Iván,\n\nHemos registrado su solicitud de baja y su oposición al tratamiento con fines publicitarios. Su contacto queda excluido de futuras campañas y añadido a nuestra lista interna de exclusión.",
    estado: "pendiente_revision",
    responsable: "Compliance",
    creado: "2026-08-05T18:20:00Z",
    riesgoLegal: "alto",
    revisionLegal: true,
  },
  {
    id: "b3",
    clienteId: "cl5",
    campanaId: "c2",
    productoId: "p4",
    canal: "whatsapp",
    entradaId: "in4",
    texto:
      "Hola Nuria, entiendo la comparación. Te paso el desglose de coste total a 12 meses incluyendo soporte y horas incluidas. ¿Lo revisamos en 15 minutos?",
    estado: "borrador",
    responsable: "S. Coll",
    creado: "2026-08-06T12:00:00Z",
    riesgoLegal: "bajo",
    revisionLegal: false,
  },
  {
    id: "b4",
    clienteId: "cl3",
    campanaId: "c3",
    productoId: "p2",
    canal: "email",
    entradaId: "in6",
    texto:
      "Estimada Rosa,\n\nLe informamos del origen de sus datos, la base jurídica aplicada y la finalidad del tratamiento. Adjuntamos la política de privacidad y el procedimiento para ejercer sus derechos.",
    estado: "borrador",
    responsable: "Compliance",
    creado: "2026-08-07T15:30:00Z",
    riesgoLegal: "alto",
    revisionLegal: true,
  },
  {
    id: "b5",
    clienteId: "cl6",
    campanaId: "c4",
    productoId: "p3",
    canal: "whatsapp",
    entradaId: "in5",
    texto: "Hola Hugo, te llamo mañana a las 10:00. Si prefieres otra hora, dime y lo ajusto.",
    estado: "aprobada",
    responsable: "S. Coll",
    creado: "2026-08-07T14:00:00Z",
    previstoEnvio: "2026-08-09T08:00:00Z",
    riesgoLegal: "bajo",
    revisionLegal: false,
  },
];

export const nombreCliente = (id: string) => clientes.find((c) => c.id === id)?.nombre ?? id;
export const nombreCampana = (id: string) => campanas.find((c) => c.id === id)?.nombre ?? id;
export const nombreProducto = (id: string) => productos.find((p) => p.id === id)?.nombre ?? id;
export const getCliente = (id: string) => clientes.find((c) => c.id === id);
export const getMensaje = (id: string) => mensajes.find((m) => m.id === id);
