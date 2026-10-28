import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, CirclePlay, Flag, Search, Send } from "lucide-react";
import { toast } from "sonner";

import { KpiCard, PageHeader, Pill } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mensajes, nombreProducto, type Campana } from "@/data/mock";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/campanas")({
  head: () => ({
    meta: [
      { title: "Campañas — MarketingHub AI" },
      {
        name: "description",
        content:
          "Gestión de campañas con flujo de aprobación: borrador, revisión, aprobación, programación, activación y cierre.",
      },
      { property: "og:title", content: "Campañas — MarketingHub AI" },
      {
        property: "og:description",
        content: "Flujo de aprobación de campañas con controles de cumplimiento antes de la activación.",
      },
    ],
  }),
  component: CampanasPage,
});

// Flujo permitido: ninguna campaña se activa sin pasar por revisión y aprobación.
const TRANSICIONES: Record<Campana["estado"], { a: Campana["estado"]; etiqueta: string; icono: typeof Send } | null> = {
  borrador: { a: "pendiente_revision", etiqueta: "Enviar a revisión", icono: Send },
  pendiente_revision: { a: "aprobada", etiqueta: "Aprobar", icono: CheckCircle2 },
  aprobada: { a: "programada", etiqueta: "Programar", icono: CirclePlay },
  programada: { a: "activa", etiqueta: "Activar", icono: CirclePlay },
  activa: { a: "finalizada", etiqueta: "Finalizar", icono: Flag },
  finalizada: null,
};

function CampanasPage() {
  const { campanas, envios, entradas, cambiarEstadoCampana } = useStore();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return campanas.filter(
      (c) =>
        (filtroEstado === "todos" || c.estado === filtroEstado) &&
        (!q || c.nombre.toLowerCase().includes(q) || nombreProducto(c.productoId).toLowerCase().includes(q)),
    );
  }, [campanas, busqueda, filtroEstado]);

  const contar = (estado: Campana["estado"]) => campanas.filter((c) => c.estado === estado).length;

  const avanzar = (c: Campana) => {
    const t = TRANSICIONES[c.estado];
    if (!t) return;
    // Bloqueo de cumplimiento: no se aprueba una campaña con mensajes sin revisar o de riesgo alto.
    if (t.a === "aprobada") {
      const ms = mensajes.filter((m) => m.campanaId === c.id);
      const pendientes = ms.filter((m) => !m.aprobado).length;
      const riesgoAlto = ms.filter((m) => m.riesgoLegal === "alto").length;
      if (pendientes > 0 || riesgoAlto > 0) {
        toast.error(
          `No se puede aprobar «${c.nombre}»: ${pendientes} mensaje(s) sin revisión humana y ${riesgoAlto} con riesgo legal alto.`,
        );
        return;
      }
    }
    cambiarEstadoCampana(c.id, t.a);
    toast.success(`«${c.nombre}» pasa a estado ${t.a.replace("_", " ")}`);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-8">
      <PageHeader
        title="Campañas"
        subtitle="Flujo de aprobación obligatorio: ninguna campaña se activa sin revisión humana. Los mensajes sin aprobar o con riesgo legal alto bloquean la aprobación."
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Campañas" value={campanas.length} hint="Datos ficticios" />
        <KpiCard label="Activas" value={contar("activa")} tone="aprobado" />
        <KpiCard label="Pendientes de revisión" value={contar("pendiente_revision")} tone="pendiente" hint="Requieren aprobación humana" />
        <KpiCard label="Finalizadas" value={contar("finalizada")} tone="neutral" />
      </section>

      <section className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar campaña o producto…"
            className="pl-9"
          />
        </div>
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="borrador">Borrador</SelectItem>
            <SelectItem value="pendiente_revision">Pendiente de revisión</SelectItem>
            <SelectItem value="aprobada">Aprobada</SelectItem>
            <SelectItem value="programada">Programada</SelectItem>
            <SelectItem value="activa">Activa</SelectItem>
            <SelectItem value="finalizada">Finalizada</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="overflow-x-auto rounded-xl border border-border bg-card shadow-panel">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaña</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Envíos</TableHead>
              <TableHead>Respuestas</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.map((c) => {
              const t = TRANSICIONES[c.estado];
              const nEnvios = envios.filter((e) => e.campanaId === c.id).length;
              const nRespuestas = entradas.filter((e) => e.campanaId === c.id).length;
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-foreground">{c.nombre}</TableCell>
                  <TableCell>{nombreProducto(c.productoId)}</TableCell>
                  <TableCell className="capitalize">{c.canal}</TableCell>
                  <TableCell>
                    <Pill value={c.estado} />
                  </TableCell>
                  <TableCell className="tabular-nums">{nEnvios}</TableCell>
                  <TableCell className="tabular-nums">{nRespuestas}</TableCell>
                  <TableCell className="text-right">
                    {t ? (
                      <Button size="sm" variant="outline" onClick={() => avanzar(c)}>
                        <t.icono className="size-4" /> {t.etiqueta}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Cerrada</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filtradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No hay campañas que coincidan con el filtro.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
