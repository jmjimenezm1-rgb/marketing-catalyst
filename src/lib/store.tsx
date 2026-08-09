import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  borradoresSeed,
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
}

const StoreContext = createContext<Store | null>(null);

const ahora = () => new Date().toISOString();

export function StoreProvider({ children }: { children: ReactNode }) {
  const [envios, setEnvios] = useState<Envio[]>(enviosSeed);
  const [secuencias, setSecuencias] = useState<Secuencia[]>(secuenciasSeed);
  const [entradas, setEntradas] = useState<MensajeEntrada[]>(entradasSeed);
  const [borradores, setBorradores] = useState<Borrador[]>(borradoresSeed);

  const value = useMemo<Store>(
    () => ({
      envios,
      secuencias,
      entradas,
      borradores,
      usuario: USUARIO_ACTUAL,
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
    [envios, secuencias, entradas, borradores],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}
