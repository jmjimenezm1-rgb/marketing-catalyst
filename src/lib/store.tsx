import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  borradoresSeed,
  clientes as clientesSeed,
  type Canal,
  type Cliente,
  entradasSeed,
  enviosSeed,
  secuenciasSeed,
  type Borrador,
  type Envio,
  type MensajeEntrada,
  type PasoSecuencia,
  type Secuencia,
} from "@/data/mock";

const USUARIO_ACTUAL = "l.vega@demo";

interface Store {
  envios: Envio[];
  secuencias: Secuencia[];
  entradas: MensajeEntrada[];
  borradores: Borrador[];
  usuario: string;
  registrarEvento: (envioId: string, evento: string) => void;
  actualizarEnvio: (id: string, cambios: Partial<Envio>, evento: string) => void;
  actualizarPaso: (secuenciaId: string, pasoId: string, cambios: Partial<PasoSecuencia>) => void;
  cambiarEstadoSecuencia: (id: string, estado: Secuencia["estado"]) => void;
  actualizarEntrada: (id: string, cambios: Partial<MensajeEntrada>) => void;
  añadirNota: (entradaId: string, texto: string) => void;
  actualizarBorrador: (id: string, cambios: Partial<Borrador>) => void;
  crearBorradorIA: (entrada: MensajeEntrada, texto: string) => void;
  clientes: Cliente[];
  auditoria: EventoAuditoria[];
  registrarBaja: (clienteId: string, canales: Canal[], motivo: string, origen: string) => void;
  registrarConsentimiento: (clienteId: string, canal: Canal, fuente: string) => void;
}

export interface EventoAuditoria {
  id: string;
  fecha: string;
  usuario: string;
  modulo: string;
  accion: string;
  detalle: string;
  clienteId?: string | undefined;
}

const StoreContext = createContext<Store | null>(null);

const ahora = () => new Date().toISOString();

export function StoreProvider({ children }: { children: ReactNode }) {
  const [envios, setEnvios] = useState<Envio[]>(enviosSeed);
  const [secuencias, setSecuencias] = useState<Secuencia[]>(secuenciasSeed);
  const [entradas, setEntradas] = useState<MensajeEntrada[]>(entradasSeed);
  const [borradores, setBorradores] = useState<Borrador[]>(borradoresSeed);
  const [clientes, setClientes] = useState<Cliente[]>(clientesSeed);
  const [auditoria, setAuditoria] = useState<EventoAuditoria[]>([]);
  const log = (e: Omit<EventoAuditoria, "id" | "fecha" | "usuario">) =>
    setAuditoria((prev) => [
      { ...e, id: Math.random().toString(36).slice(2, 10), fecha: ahora(), usuario: USUARIO_ACTUAL },
      ...prev,
    ]);
  // Mantiene sincronizado el registro compartido que usa el servicio de cumplimiento (mock).
  const aplicarCliente = (id: string, fn: (c: Cliente) => Cliente) =>
    setClientes((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nuevo = fn(c);
        const ref = clientesSeed.find((x) => x.id === id);
        if (ref) Object.assign(ref, nuevo);
        return nuevo;
      }),
    );

  const value = useMemo<Store>(
    () => ({
      envios,
      secuencias,
      entradas,
      borradores,
      usuario: USUARIO_ACTUAL,
      clientes,
      auditoria,
      registrarBaja: (clienteId, canales, motivo, origen) => {
        aplicarCliente(clienteId, (c) => ({
          ...c,
          consentimiento: {
            ...c.consentimiento,
            ...Object.fromEntries(canales.map((k) => [k, "baja"])),
          } as Cliente["consentimiento"],
        }));
        // Cancela envíos pendientes/programados del contacto en los canales afectados.
        setEnvios((prev) =>
          prev.map((e) =>
            e.clienteId === clienteId && canales.includes(e.canal) && ["pendiente", "programado"].includes(e.estado)
              ? {
                  ...e,
                  estado: "cancelado",
                  historial: [...e.historial, { fecha: ahora(), evento: "Cancelado por baja/oposición", usuario: USUARIO_ACTUAL }],
                }
              : e,
          ),
        );
        log({ modulo: "Consentimientos", accion: "Baja / oposición registrada", detalle: `${canales.join(", ")} · ${origen} · ${motivo}`, clienteId });
      },
      registrarConsentimiento: (clienteId, canal, fuente) => {
        aplicarCliente(clienteId, (c) => ({
          ...c,
          fuenteConsentimiento: fuente,
          consentimiento: { ...c.consentimiento, [canal]: "valido" },
        }));
        log({ modulo: "Consentimientos", accion: "Opt-in registrado", detalle: `${canal} · fuente: ${fuente}`, clienteId });
      },
      registrarEvento: (envioId, evento) =>
        setEnvios((prev) =>
          prev.map((e) =>
            e.id === envioId
              ? { ...e, historial: [...e.historial, { fecha: ahora(), evento, usuario: USUARIO_ACTUAL }] }
              : e,
          ),
        ),
      actualizarEnvio: (id, cambios, evento) =>
        setEnvios((prev) =>
          prev.map((e) =>
            e.id === id
              ? {
                  ...e,
                  ...cambios,
                  historial: [...e.historial, { fecha: ahora(), evento, usuario: USUARIO_ACTUAL }],
                }
              : e,
          ),
        ),
      actualizarPaso: (secuenciaId, pasoId, cambios) =>
        setSecuencias((prev) =>
          prev.map((s) =>
            s.id === secuenciaId
              ? { ...s, pasos: s.pasos.map((p) => (p.id === pasoId ? { ...p, ...cambios } : p)) }
              : s,
          ),
        ),
      cambiarEstadoSecuencia: (id, estado) =>
        setSecuencias((prev) => prev.map((s) => (s.id === id ? { ...s, estado } : s))),
      actualizarEntrada: (id, cambios) =>
        setEntradas((prev) => prev.map((e) => (e.id === id ? { ...e, ...cambios } : e))),
      añadirNota: (entradaId, texto) =>
        setEntradas((prev) =>
          prev.map((e) =>
            e.id === entradaId
              ? { ...e, notas: [...e.notas, { fecha: ahora(), usuario: USUARIO_ACTUAL, texto }] }
              : e,
          ),
        ),
      actualizarBorrador: (id, cambios) =>
        setBorradores((prev) => prev.map((b) => (b.id === id ? { ...b, ...cambios } : b))),
      crearBorradorIA: (entrada, texto) =>
        setBorradores((prev) => [
          {
            id: `b${Math.random().toString(36).slice(2, 8)}`,
            clienteId: entrada.clienteId,
            campanaId: entrada.campanaId,
            productoId: entrada.productoId,
            canal: entrada.canal,
            entradaId: entrada.id,
            texto,
            estado: entrada.intencion === "solicita_baja" ? "pendiente_revision" : "borrador",
            responsable: entrada.responsable,
            creado: ahora(),
            riesgoLegal:
              entrada.intencion === "solicita_baja" || entrada.intencion === "queja" ? "alto" : "bajo",
            revisionLegal: entrada.intencion === "solicita_baja" || entrada.intencion === "queja",
          },
          ...prev,
        ]),
    }),
    [envios, secuencias, entradas, borradores, clientes, auditoria],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}
