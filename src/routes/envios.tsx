import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Send,
  ShieldAlert,
  XCircle,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard, PageHeader, Pill, fecha } from "@/components/common";
import { useStore } from "@/lib/store";
import { validarEnvio } from "@/services/compliance";
import {
  campanas,
  getCliente,
  getMensaje,
  nombreCampana,
  nombreCliente,
  nombreProducto,
  type Envio,
} from "@/data/mock";

export const Route = createFileRoute("/envios")({
  head: () => ({
    meta: [
      { title: "Envíos — MarketingHub AI" },
      {
        name: "description",
        content:
          "Gestión de envíos individuales, masivos, por lotes y condicionados, con validación de consentimiento y trazabilidad completa.",
      },
      { property: "og:title", content: "Envíos — MarketingHub AI" },
      {
        property: "og:description",
        content: "Validación de cumplimiento previa a cada envío de email o WhatsApp.",
      },
    ],
  }),
  component: EnviosPage,
});

const TIPOS: Record<Envio["tipo"], string> = {
  individual_inmediato: "Individual inmediato",
  individual_programado: "Individual programado",
  masivo_inmediato: "Masivo inmediato",
  masivo_programado: "Masivo programado",
  lotes: "Por lotes",
  secuencia: "Secuencia sucesiva",
  condicionado_respuesta: "Condicionado por respuesta",
  condicionado_no_respuesta: "Condicionado por falta de respuesta",
};

function EnviosPage() {
  const { envios, actualizarEnvio } = useStore();
  const [canal, setCanal] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [tipo, setTipo] = useState("todos");
  const [campana, setCampana] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [detalle, setDetalle] = useState<Envio | null>(null);
  const [loteAbierto, setLoteAbierto] = useState(false);
  const [programarFecha, setProgramarFecha] = useState("");

  const enviadosHoy = envios.filter((e) => ["enviado", "entregado", "leido", "respondido"].includes(e.estado)).length;

  const filtrados = useMemo(
    () =>
      envios.filter((e) => {
        if (canal !== "todos" && e.canal !== canal) return false;
        if (estado !== "todos" && e.estado !== estado) return false;
        if (tipo !== "todos" && e.tipo !== tipo) return false;
        if (campana !== "todas" && e.campanaId !== campana) return false;
        if (busqueda && !nombreCliente(e.clienteId).toLowerCase().includes(busqueda.toLowerCase())) return false;
        return true;
      }),
    [envios, canal, estado, tipo, campana, busqueda],
  );

  const seleccionados = envios.filter((e) => seleccion.includes(e.id));
  const validaciones = seleccionados.map((e) => ({ envio: e, resultado: validarEnvio(e, enviadosHoy) }));
  const aptos = validaciones.filter((v) => v.resultado.permitido);
  const bloqueados = validaciones.filter((v) => !v.resultado.permitido);

  const toggle = (id: string) =>
    setSeleccion((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const enviar = (envio: Envio) => {
    const { permitido, chequeos } = validarEnvio(envio, enviadosHoy);
    if (!permitido) {
      const fallo = chequeos.find((c) => !c.ok && c.bloqueante);
      actualizarEnvio(
        envio.id,
        { estado: "fallido", error: `Bloqueado por cumplimiento: ${fallo?.etiqueta}` },
        `Envío bloqueado — ${fallo?.etiqueta}: ${fallo?.detalle}`,
      );
      toast.error("Envío bloqueado por cumplimiento", { description: fallo?.detalle });
      return;
    }
    const ahora = new Date().toISOString();
    actualizarEnvio(
      envio.id,
      {
        estado: "enviado",
        fechaEnvio: ahora,
        error: undefined,
        idExterno: `mock_${Math.random().toString(36).slice(2, 8)}`,
        enviadoPor: "l.vega@demo",
      },
      "Enviado mediante conector simulado",
    );
    toast.success("Envío realizado (conector simulado)");
  };

  const programar = (envio: Envio) => {
    if (!programarFecha) {
      toast.error("Indica fecha y hora de programación");
      return;
    }
    actualizarEnvio(
      envio.id,
      { estado: "programado", fechaProgramacion: new Date(programarFecha).toISOString() },
      `Programado para ${fecha(new Date(programarFecha).toISOString())}`,
    );
    toast.success("Envío programado");
  };

  const cancelar = (envio: Envio) => {
    actualizarEnvio(envio.id, { estado: "cancelado" }, "Envío cancelado manualmente");
    toast.success("Envío cancelado");
  };

  const enviarLote = () => {
    aptos.forEach(({ envio }) => enviar(envio));
    bloqueados.forEach(({ envio, resultado }) => {
      const fallo = resultado.chequeos.find((c) => !c.ok && c.bloqueante);
      actualizarEnvio(
        envio.id,
        { estado: "fallido", error: `Bloqueado por cumplimiento: ${fallo?.etiqueta}` },
        `Excluido del envío masivo — ${fallo?.etiqueta}`,
      );
    });
    setLoteAbierto(false);
    setSeleccion([]);
    toast.success(`${aptos.length} envíos ejecutados · ${bloqueados.length} bloqueados`);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-8">
      <PageHeader
        title="Envíos"
        subtitle="Módulo 8 · Envíos individuales, masivos, por lotes, en secuencia y condicionados por respuesta. Ningún envío se ejecuta sin pasar la validación de consentimiento, bajas, canal, frecuencia y límites."
        right={
          <Button disabled={seleccion.length === 0} onClick={() => setLoteAbierto(true)}>
            <Send className="mr-2 size-4" />
            Validar y enviar ({seleccion.length})
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Total envíos" value={envios.length} hint="Registro auditable" />
        <KpiCard label="Programados" value={envios.filter((e) => e.estado === "programado").length} tone="pendiente" />
        <KpiCard label="Enviados / entregados" value={enviadosHoy} tone="enviado" />
        <KpiCard label="Respondidos" value={envios.filter((e) => e.estado === "respondido").length} tone="respondido" />
        <KpiCard
          label="Bloqueados o fallidos"
          value={envios.filter((e) => e.estado === "fallido" || e.estado === "cancelado").length}
          tone="riesgo"
          hint="Motivo registrado en auditoría"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-panel">
        <Input
          placeholder="Buscar cliente…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:w-56"
        />
        <Tabs value={canal} onValueChange={setCanal}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={estado} onValueChange={setEstado}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {["todos", "pendiente", "programado", "enviado", "entregado", "leido", "respondido", "fallido", "cancelado"].map(
              (v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Tipo de envío" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            {Object.entries(TIPOS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={campana} onValueChange={setCampana}>
          <SelectTrigger className="w-[210px]">
            <SelectValue placeholder="Campaña" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las campañas</SelectItem>
            {campanas.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-panel">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Cliente</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Campaña / Producto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Consentimiento</TableHead>
              <TableHead>Programado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((e) => {
              const cliente = getCliente(e.clienteId);
              return (
                <TableRow key={e.id} className="align-top">
                  <TableCell>
                    <Checkbox checked={seleccion.includes(e.id)} onCheckedChange={() => toggle(e.id)} />
                  </TableCell>
                  <TableCell className="font-medium">
                    {nombreCliente(e.clienteId)}
                    <div className="text-xs text-muted-foreground">{cliente?.responsable}</div>
                  </TableCell>
                  <TableCell className="capitalize">{e.canal}</TableCell>
                  <TableCell>
                    {nombreCampana(e.campanaId)}
                    <div className="text-xs text-muted-foreground">{nombreProducto(e.productoId)}</div>
                  </TableCell>
                  <TableCell className="text-xs">{TIPOS[e.tipo]}</TableCell>
                  <TableCell>
                    <Pill value={e.estado} />
                    {e.error && (
                      <div className="mt-1 max-w-[220px] text-xs text-destructive">{e.error}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Pill value={cliente?.consentimiento[e.canal]} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{fecha(e.fechaProgramacion)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setDetalle(e)}>
                      Detalle
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                  Sin envíos para los filtros seleccionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detalle de envío */}
      <Dialog open={!!detalle} onOpenChange={(o) => !o && setDetalle(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {detalle && <DetalleEnvio envio={envios.find((e) => e.id === detalle.id) ?? detalle} />}
          {detalle && (
            <div className="space-y-3 rounded-lg border border-border p-3">
              <Label htmlFor="prog">Programar envío</Label>
              <Input
                id="prog"
                type="datetime-local"
                value={programarFecha}
                onChange={(ev) => setProgramarFecha(ev.target.value)}
              />
              <DialogFooter className="gap-2 sm:justify-start">
                <Button onClick={() => enviar(detalle)}>
                  <Send className="mr-2 size-4" /> Enviar ahora
                </Button>
                <Button variant="secondary" onClick={() => programar(detalle)}>
                  <CalendarClock className="mr-2 size-4" /> Programar
                </Button>
                <Button variant="outline" onClick={() => cancelar(detalle)}>
                  <XCircle className="mr-2 size-4" /> Cancelar
                </Button>
                {detalle.estado === "fallido" && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      actualizarEnvio(detalle.id, { estado: "pendiente", error: undefined }, "Reintento preparado")
                    }
                  >
                    <RotateCcw className="mr-2 size-4" /> Reintentar
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Validación previa a envío masivo */}
      <Dialog open={loteAbierto} onOpenChange={setLoteAbierto}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Validación de cumplimiento previa al envío masivo</DialogTitle>
            <DialogDescription>
              Revisión humana obligatoria. Los contactos sin base jurídica válida quedan excluidos automáticamente y el
              motivo se registra en la auditoría legal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {validaciones.map(({ envio, resultado }) => (
              <div key={envio.id} className="rounded-lg border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {nombreCliente(envio.clienteId)} · {envio.canal}
                  </span>
                  <Pill
                    value={resultado.permitido ? "aprobado" : "bloqueado"}
                    label={resultado.permitido ? "Apto para envío" : "Bloqueado"}
                  />
                </div>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                  {resultado.chequeos.map((c) => (
                    <li key={c.clave} className="flex items-start gap-2 text-xs">
                      {c.ok ? (
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                      ) : c.bloqueante ? (
                        <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                      ) : (
                        <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
                      )}
                      <span>
                        <span className="font-medium">{c.etiqueta}</span>
                        <span className="block text-muted-foreground">{c.detalle}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoteAbierto(false)}>
              Volver
            </Button>
            <Button onClick={enviarLote} disabled={aptos.length === 0}>
              Enviar {aptos.length} aptos · excluir {bloqueados.length}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetalleEnvio({ envio }: { envio: Envio }) {
  const cliente = getCliente(envio.clienteId);
  const mensaje = getMensaje(envio.mensajeId);
  const { chequeos, permitido } = validarEnvio(envio);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{nombreCliente(envio.clienteId)}</DialogTitle>
        <DialogDescription>
          {nombreCampana(envio.campanaId)} · {nombreProducto(envio.productoId)} · canal {envio.canal}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1 rounded-lg border border-border p-3 text-sm">
          <Dato k="Estado" v={<Pill value={envio.estado} />} />
          <Dato k="Tipo" v={TIPOS[envio.tipo]} />
          <Dato k="Programado" v={fecha(envio.fechaProgramacion)} />
          <Dato k="Enviado" v={fecha(envio.fechaEnvio)} />
          <Dato k="Entregado" v={fecha(envio.fechaEntrega)} />
          <Dato k="Leído" v={fecha(envio.fechaLectura)} />
          <Dato k="Respondido" v={fecha(envio.fechaRespuesta)} />
        </div>
        <div className="space-y-1 rounded-lg border border-border p-3 text-sm">
          <Dato k="ID externo proveedor" v={envio.idExterno ?? "—"} />
          <Dato k="Aprobado por" v={envio.aprobadoPor ?? "—"} />
          <Dato k="Enviado por" v={envio.enviadoPor ?? "—"} />
          <Dato k="Base jurídica" v={cliente?.baseJuridica ?? "—"} />
          <Dato k="Fuente consentimiento" v={cliente?.fuenteConsentimiento ?? "—"} />
          <Dato k="Riesgo legal mensaje" v={<Pill value={mensaje?.riesgoLegal} />} />
        </div>
      </div>

      <div className="rounded-lg border border-border p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mensaje aprobado</p>
        {mensaje?.asunto && <p className="mt-1 text-sm font-medium">{mensaje.asunto}</p>}
        <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{mensaje?.texto}</p>
      </div>

      <div className="rounded-lg border border-border p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Validación de cumplimiento
          </p>
          <Pill value={permitido ? "aprobado" : "bloqueado"} label={permitido ? "Apto" : "Bloqueado"} />
        </div>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {chequeos.map((c) => (
            <li key={c.clave} className="flex items-start gap-2 text-xs">
              {c.ok ? (
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
              ) : c.bloqueante ? (
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              ) : (
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
              )}
              <span>
                <span className="font-medium">{c.etiqueta}</span>
                <span className="block text-muted-foreground">{c.detalle}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-border p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Historial / auditoría</p>
        <ol className="mt-2 space-y-2">
          {envio.historial.map((h, i) => (
            <li key={i} className="text-xs">
              <span className="font-medium">{fecha(h.fecha)}</span> · {h.evento}
              <span className="text-muted-foreground"> — {h.usuario}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function Dato({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{k}</span>
      <span className="text-right text-xs font-medium">{v}</span>
    </div>
  );
}
