import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Ban, Mail, MessageCircle, Sparkles, StickyNote, Target, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KpiCard, PageHeader, Pill, fecha } from "@/components/common";
import { useStore } from "@/lib/store";
import { generarRespuesta, type TonoRespuesta } from "@/services/ia";
import {
  getCliente,
  nombreCampana,
  nombreCliente,
  nombreProducto,
  type IntencionEntrada,
  type MensajeEntrada,
} from "@/data/mock";

export const Route = createFileRoute("/bandeja-entrada")({
  head: () => ({
    meta: [
      { title: "Bandeja de entrada — MarketingHub AI" },
      {
        name: "description",
        content:
          "Bandeja unificada de respuestas de clientes por email y WhatsApp, con clasificación de intención comercial, prioridad y próxima acción recomendada.",
      },
      { property: "og:title", content: "Bandeja de entrada — MarketingHub AI" },
      {
        property: "og:description",
        content: "Clasificación de intención comercial, generación de borradores y registro de bajas.",
      },
    ],
  }),
  component: BandejaEntradaPage,
});

const INTENCIONES: Record<IntencionEntrada, string> = {
  interesado: "Interesado",
  solicita_info: "Solicita más información",
  solicita_llamada: "Solicita llamada",
  objecion_precio: "Objeción de precio",
  objecion_timing: "Objeción de timing",
  no_interesado: "No interesado",
  solicita_baja: "Solicita baja",
  respuesta_automatica: "Respuesta automática",
  error_contacto: "Error de contacto",
  queja: "Queja",
  otro: "Otro",
};

const RESPONSABLES = ["L. Vega", "P. Ruiz", "S. Coll", "Compliance", "Sistema"];

function BandejaEntradaPage() {
  const { entradas, actualizarEntrada, añadirNota, crearBorradorIA } = useStore();
  const [seleccionada, setSeleccionada] = useState(entradas[0]?.id ?? "");
  const [filtroIntencion, setFiltroIntencion] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [tono, setTono] = useState<TonoRespuesta>("consultivo");
  const [borrador, setBorrador] = useState("");
  const [nota, setNota] = useState("");

  const filtradas = useMemo(
    () =>
      entradas.filter((e) => {
        if (filtroIntencion !== "todas" && e.intencion !== filtroIntencion) return false;
        if (filtroEstado !== "todos" && e.estado !== filtroEstado) return false;
        if (busqueda && !nombreCliente(e.clienteId).toLowerCase().includes(busqueda.toLowerCase())) return false;
        return true;
      }),
    [entradas, filtroIntencion, filtroEstado, busqueda],
  );

  const actual = entradas.find((e) => e.id === seleccionada) ?? filtradas[0];
  const cliente = actual ? getCliente(actual.clienteId) : undefined;
  const esBaja = actual?.intencion === "solicita_baja";

  const generar = () => {
    if (!actual) return;
    setBorrador(generarRespuesta(actual, esBaja ? "legal" : tono));
    toast.success("Borrador generado (simulado)", {
      description: esBaja
        ? "Solicitud de baja: se prioriza el registro de la baja y no se generan mensajes comerciales."
        : "Editable antes de aprobar o enviar.",
    });
  };

  const guardarBorrador = () => {
    if (!actual || !borrador.trim()) {
      toast.error("Genera o escribe una respuesta primero");
      return;
    }
    crearBorradorIA(actual, borrador);
    actualizarEntrada(actual.id, { estado: "en_curso" });
    setBorrador("");
    toast.success("Respuesta guardada en la bandeja de salida");
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
      <PageHeader
        title="Bandeja de entrada"
        subtitle="Módulo 10 · Respuestas recibidas por email y WhatsApp, unificadas y clasificadas por intención comercial. No se etiquetan emociones ni atributos personales: solo intención respecto a la propuesta."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Respuestas recibidas" value={entradas.length} />
        <KpiCard label="Nuevas sin revisar" value={entradas.filter((e) => e.estado === "nuevo").length} tone="enviado" />
        <KpiCard label="Prioridad alta" value={entradas.filter((e) => e.prioridad === "alta").length} tone="riesgo" />
        <KpiCard
          label="Solicitudes de baja"
          value={entradas.filter((e) => e.intencion === "solicita_baja").length}
          tone="bloqueado"
          hint="Prioridad de tramitación"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        {/* Lista */}
        <div className="space-y-3">
          <div className="space-y-2 rounded-xl border border-border bg-card p-3 shadow-panel">
            <Input placeholder="Buscar cliente…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Select value={filtroIntencion} onValueChange={setFiltroIntencion}>
                <SelectTrigger>
                  <SelectValue placeholder="Intención" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Toda intención</SelectItem>
                  {Object.entries(INTENCIONES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todo estado</SelectItem>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="en_curso">En curso</SelectItem>
                  <SelectItem value="resuelto">Resuelto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-panel">
            {filtradas.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setSeleccionada(e.id);
                  setBorrador("");
                }}
                className={`w-full px-3 py-3 text-left transition-colors hover:bg-secondary ${
                  actual?.id === e.id ? "bg-secondary" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{nombreCliente(e.clienteId)}</span>
                  {e.canal === "email" ? (
                    <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                  ) : (
                    <MessageCircle className="size-3.5 shrink-0 text-muted-foreground" />
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{e.texto}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Pill value={e.intencion} label={INTENCIONES[e.intencion]} tone={e.intencion === "solicita_baja" ? "bloqueado" : "outline"} />
                  <Pill value={e.prioridad === "baja" ? "baja_prioridad" : e.prioridad} label={`prioridad ${e.prioridad}`} />
                  <Pill value={e.estado} />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{fecha(e.fecha)}</p>
              </button>
            ))}
            {filtradas.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">Sin mensajes para estos filtros.</p>
            )}
          </div>
        </div>

        {/* Conversación */}
        {actual && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-panel">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{nombreCliente(actual.clienteId)}</h2>
                  <p className="text-xs text-muted-foreground">
                    {cliente?.contacto} · {cliente?.sector} · {nombreCampana(actual.campanaId)} ·{" "}
                    {nombreProducto(actual.productoId)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill value={cliente?.consentimiento.email} label={`email: ${cliente?.consentimiento.email}`} />
                  <Pill value={cliente?.consentimiento.whatsapp} label={`whatsapp: ${cliente?.consentimiento.whatsapp}`} />
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  {fecha(actual.fecha)} · canal {actual.canal}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{actual.texto}</p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Intención detectada</Label>
                  <Select
                    value={actual.intencion}
                    onValueChange={(v) => actualizarEntrada(actual.id, { intencion: v as IntencionEntrada })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(INTENCIONES).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Responsable</Label>
                  <Select
                    value={actual.responsable}
                    onValueChange={(v) => actualizarEntrada(actual.id, { responsable: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESPONSABLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Estado</Label>
                  <Select
                    value={actual.estado}
                    onValueChange={(v) => actualizarEntrada(actual.id, { estado: v as MensajeEntrada["estado"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuevo">Nuevo</SelectItem>
                      <SelectItem value="en_curso">En curso</SelectItem>
                      <SelectItem value="resuelto">Resuelto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="mt-3 rounded-lg border border-border p-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Próxima acción recomendada:</span> {actual.proximaAccion}
              </p>
            </div>

            {/* Generación de respuesta */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-panel">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Preparar respuesta</h3>
                <div className="flex items-center gap-2">
                  <Select value={tono} onValueChange={(v) => setTono(v as TonoRespuesta)} disabled={esBaja}>
                    <SelectTrigger className="w-[170px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comercial">Tono comercial</SelectItem>
                      <SelectItem value="consultivo">Tono consultivo</SelectItem>
                      <SelectItem value="formal">Formal (email)</SelectItem>
                      <SelectItem value="breve">Breve (WhatsApp)</SelectItem>
                      <SelectItem value="legal">Revisable por Legal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="secondary" onClick={generar}>
                    <Sparkles className="mr-2 size-4" /> Generar con IA
                  </Button>
                </div>
              </div>

              {esBaja && (
                <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                  El cliente solicita baja u oposición: se prioriza el registro de la baja, se bloquea el contacto para
                  campañas y no se generan mensajes comerciales.
                </p>
              )}

              <Textarea
                className="mt-3"
                rows={7}
                placeholder="Respuesta generada o redactada manualmente…"
                value={borrador}
                onChange={(e) => setBorrador(e.target.value)}
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={guardarBorrador}>Guardar en bandeja de salida</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    actualizarEntrada(actual.id, { estado: "resuelto" });
                    toast.success("Conversación marcada como resuelta");
                  }}
                >
                  Marcar como resuelto
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    actualizarEntrada(actual.id, {
                      proximaAccion: "Oportunidad comercial creada — seguimiento por el responsable",
                      estado: "en_curso",
                    });
                    toast.success("Oportunidad creada (simulada)");
                  }}
                >
                  <Target className="mr-2 size-4" /> Crear oportunidad
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    actualizarEntrada(actual.id, {
                      intencion: "solicita_baja",
                      prioridad: "alta",
                      responsable: "Compliance",
                      proximaAccion: "Baja registrada · contacto excluido de campañas",
                    });
                    toast.success("Baja registrada y contacto excluido de campañas");
                  }}
                >
                  <Ban className="mr-2 size-4" /> Registrar baja
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    actualizarEntrada(actual.id, { responsable: "Compliance" });
                    toast.success("Asignado a Compliance");
                  }}
                >
                  <UserCheck className="mr-2 size-4" /> Asignar a Compliance
                </Button>
              </div>
            </div>

            {/* Notas e histórico */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-panel">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <StickyNote className="size-4" /> Notas e histórico
              </h3>
              <div className="mt-3 flex gap-2">
                <Input placeholder="Añadir nota interna…" value={nota} onChange={(e) => setNota(e.target.value)} />
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!nota.trim()) return;
                    añadirNota(actual.id, nota);
                    setNota("");
                    toast.success("Nota añadida");
                  }}
                >
                  Añadir
                </Button>
              </div>
              <ul className="mt-3 space-y-2">
                {actual.notas.map((n, i) => (
                  <li key={i} className="rounded-lg border border-border p-2 text-xs">
                    <span className="font-medium">{fecha(n.fecha)}</span> · {n.usuario}
                    <p className="mt-0.5 text-muted-foreground">{n.texto}</p>
                  </li>
                ))}
                {actual.notas.length === 0 && (
                  <li className="text-xs text-muted-foreground">Sin notas registradas.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
