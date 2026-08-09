import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, CheckCircle2, Scale, Send, Sparkles, XCircle } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard, PageHeader, Pill, fecha } from "@/components/common";
import { useStore } from "@/lib/store";
import { generarRespuesta } from "@/services/ia";
import { getCliente, nombreCampana, nombreCliente, nombreProducto, type Borrador } from "@/data/mock";

export const Route = createFileRoute("/bandeja-salida")({
  head: () => ({
    meta: [
      { title: "Bandeja de salida y borradores — MarketingHub AI" },
      {
        name: "description",
        content:
          "Workflow de respuestas generadas pendientes de revisión, aprobación, programación o envío, con control de riesgo legal.",
      },
      { property: "og:title", content: "Bandeja de salida y borradores — MarketingHub AI" },
      {
        property: "og:description",
        content: "Revisión humana, aprobación, programación y marcado para revisión legal antes de enviar.",
      },
    ],
  }),
  component: BandejaSalidaPage,
});

const COLUMNAS: { estado: Borrador["estado"]; titulo: string }[] = [
  { estado: "borrador", titulo: "Borradores" },
  { estado: "pendiente_revision", titulo: "Pendiente de revisión" },
  { estado: "aprobada", titulo: "Aprobadas" },
  { estado: "programada", titulo: "Programadas" },
  { estado: "enviada", titulo: "Enviadas" },
];

function BandejaSalidaPage() {
  const { borradores, entradas, actualizarBorrador } = useStore();
  const [vista, setVista] = useState<"workflow" | "tabla">("workflow");
  const [filtroCanal, setFiltroCanal] = useState("todos");
  const [filtroRiesgo, setFiltroRiesgo] = useState("todos");
  const [abierto, setAbierto] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [programado, setProgramado] = useState("");

  const filtrados = useMemo(
    () =>
      borradores.filter((b) => {
        if (filtroCanal !== "todos" && b.canal !== filtroCanal) return false;
        if (filtroRiesgo !== "todos" && b.riesgoLegal !== filtroRiesgo) return false;
        return true;
      }),
    [borradores, filtroCanal, filtroRiesgo],
  );

  const actual = borradores.find((b) => b.id === abierto);
  const entradaOrigen = actual?.entradaId ? entradas.find((e) => e.id === actual.entradaId) : undefined;

  const abrir = (b: Borrador) => {
    setAbierto(b.id);
    setTexto(b.texto);
    setProgramado("");
  };

  const accion = (cambios: Partial<Borrador>, mensaje: string) => {
    if (!actual) return;
    actualizarBorrador(actual.id, cambios);
    toast.success(mensaje);
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
      <PageHeader
        title="Bandeja de salida y borradores"
        subtitle="Módulo 11 · Respuestas generadas y no enviadas, en flujo de revisión humana. Ninguna respuesta sale sin aprobación, y las de riesgo legal alto requieren visto bueno de cumplimiento."
        right={
          <div className="flex gap-2">
            <Button variant={vista === "workflow" ? "default" : "outline"} onClick={() => setVista("workflow")}>
              Workflow
            </Button>
            <Button variant={vista === "tabla" ? "default" : "outline"} onClick={() => setVista("tabla")}>
              Tabla
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total en bandeja" value={borradores.length} />
        <KpiCard
          label="Pendientes de revisión"
          value={borradores.filter((b) => b.estado === "pendiente_revision").length}
          tone="pendiente"
        />
        <KpiCard label="Aprobadas" value={borradores.filter((b) => b.estado === "aprobada").length} tone="aprobado" />
        <KpiCard
          label="Con revisión legal"
          value={borradores.filter((b) => b.revisionLegal).length}
          tone="riesgo"
          hint="Riesgo legal alto o solicitud de derechos"
        />
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-3 shadow-panel">
        <Select value={filtroCanal} onValueChange={setFiltroCanal}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los canales</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroRiesgo} onValueChange={setFiltroRiesgo}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Riesgo legal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todo riesgo legal</SelectItem>
            <SelectItem value="bajo">Riesgo bajo</SelectItem>
            <SelectItem value="medio">Riesgo medio</SelectItem>
            <SelectItem value="alto">Riesgo alto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {vista === "workflow" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {COLUMNAS.map((col) => {
            const items = filtrados.filter((b) => b.estado === col.estado);
            return (
              <div key={col.estado} className="rounded-xl border border-border bg-muted/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{col.titulo}</p>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {items.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => abrir(b)}
                      className="w-full rounded-lg border border-border bg-card p-3 text-left shadow-panel transition-colors hover:border-ring"
                    >
                      <p className="truncate text-sm font-medium">{nombreCliente(b.clienteId)}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {nombreCampana(b.campanaId)} · {b.canal}
                      </p>
                      <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{b.texto}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Pill value={b.riesgoLegal} label={`riesgo ${b.riesgoLegal}`} />
                        {b.revisionLegal && <Pill value="bloqueado" label="revisión legal" />}
                      </div>
                    </button>
                  ))}
                  {items.length === 0 && <p className="text-xs text-muted-foreground">Vacío</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-panel">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Campaña / Producto</TableHead>
                <TableHead>Respuesta generada</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Creación</TableHead>
                <TableHead>Previsto envío</TableHead>
                <TableHead>Riesgo legal</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((b) => (
                <TableRow key={b.id} className="align-top">
                  <TableCell className="font-medium">{nombreCliente(b.clienteId)}</TableCell>
                  <TableCell className="capitalize">{b.canal}</TableCell>
                  <TableCell>
                    {nombreCampana(b.campanaId)}
                    <div className="text-xs text-muted-foreground">{nombreProducto(b.productoId)}</div>
                  </TableCell>
                  <TableCell className="max-w-[280px] text-xs text-muted-foreground">
                    <span className="line-clamp-2">{b.texto}</span>
                  </TableCell>
                  <TableCell>
                    <Pill value={b.estado} />
                  </TableCell>
                  <TableCell className="text-xs">{b.responsable}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{fecha(b.creado)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{fecha(b.previstoEnvio)}</TableCell>
                  <TableCell>
                    <Pill value={b.riesgoLegal} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => abrir(b)}>
                      Revisar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">
                    Sin borradores para estos filtros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!abierto} onOpenChange={(o) => !o && setAbierto(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {actual && (
            <>
              <DialogHeader>
                <DialogTitle>{nombreCliente(actual.clienteId)}</DialogTitle>
                <DialogDescription>
                  {nombreCampana(actual.campanaId)} · {nombreProducto(actual.productoId)} · canal {actual.canal} ·{" "}
                  responsable {actual.responsable}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-2">
                <Pill value={actual.estado} />
                <Pill value={actual.riesgoLegal} label={`riesgo ${actual.riesgoLegal}`} />
                <Pill
                  value={getCliente(actual.clienteId)?.consentimiento[actual.canal]}
                  label={`consentimiento ${actual.canal}: ${getCliente(actual.clienteId)?.consentimiento[actual.canal]}`}
                />
                {actual.revisionLegal && <Pill value="bloqueado" label="requiere revisión legal" />}
              </div>

              {entradaOrigen && (
                <div className="rounded-lg border border-border bg-muted/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Mensaje original del cliente
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{fecha(entradaOrigen.fecha)}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{entradaOrigen.texto}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="respuesta">Respuesta (editable antes del envío)</Label>
                <Textarea id="respuesta" rows={8} value={texto} onChange={(e) => setTexto(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fechaprev">Fecha prevista de envío</Label>
                <Input
                  id="fechaprev"
                  type="datetime-local"
                  value={programado}
                  onChange={(e) => setProgramado(e.target.value)}
                />
              </div>

              <DialogFooter className="flex-wrap gap-2 sm:justify-start">
                <Button onClick={() => accion({ texto }, "Cambios guardados")} variant="secondary">
                  Guardar edición
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!entradaOrigen) {
                      toast.error("Sin mensaje original para regenerar");
                      return;
                    }
                    const nuevo = generarRespuesta(entradaOrigen);
                    setTexto(nuevo);
                    accion({ texto: nuevo, estado: "borrador" }, "Respuesta regenerada (simulada)");
                  }}
                >
                  <Sparkles className="mr-2 size-4" /> Regenerar con IA
                </Button>
                <Button
                  onClick={() => {
                    if (actual.revisionLegal) {
                      toast.error("Requiere aprobación de cumplimiento antes de aprobar comercialmente");
                      return;
                    }
                    accion({ texto, estado: "aprobada" }, "Respuesta aprobada");
                  }}
                >
                  <CheckCircle2 className="mr-2 size-4" /> Aprobar
                </Button>
                <Button
                  onClick={() => {
                    if (actual.estado !== "aprobada") {
                      toast.error("Solo se pueden enviar respuestas aprobadas");
                      return;
                    }
                    accion({ texto, estado: "enviada" }, "Respuesta enviada (conector simulado)");
                  }}
                >
                  <Send className="mr-2 size-4" /> Enviar
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!programado) {
                      toast.error("Indica la fecha prevista de envío");
                      return;
                    }
                    accion(
                      { texto, estado: "programada", previstoEnvio: new Date(programado).toISOString() },
                      "Respuesta programada",
                    );
                  }}
                >
                  <CalendarClock className="mr-2 size-4" /> Programar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => accion({ revisionLegal: true, estado: "pendiente_revision" }, "Marcado para revisión legal")}
                >
                  <Scale className="mr-2 size-4" /> Revisión legal
                </Button>
                <Button variant="outline" onClick={() => accion({ estado: "cancelada" }, "Respuesta cancelada")}>
                  <XCircle className="mr-2 size-4" /> Cancelar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
