import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard, PageHeader, Pill, fecha } from "@/components/common";
import { useStore } from "@/lib/store";
import { nombreCliente } from "@/data/mock";

export const Route = createFileRoute("/auditoria")({
  head: () => ({
    meta: [
      { title: "Auditoría legal — MarketingHub AI" },
      { name: "description", content: "Registro unificado y exportable de acciones sobre envíos, consentimientos y respuestas." },
      { property: "og:title", content: "Auditoría legal — MarketingHub AI" },
      { property: "og:description", content: "Trazabilidad completa de quién hizo qué y cuándo, exportable a CSV." },
    ],
  }),
  component: AuditoriaPage,
});

interface Fila {
  id: string;
  fecha: string;
  usuario: string;
  modulo: string;
  accion: string;
  detalle: string;
  cliente: string;
}

function AuditoriaPage() {
  const { envios, auditoria, borradores } = useStore();
  const [q, setQ] = useState("");
  const [modulo, setModulo] = useState("todos");

  const filas = useMemo<Fila[]>(() => {
    const deEnvios = envios.flatMap((e) =>
      e.historial.map((h, i) => ({
        id: `${e.id}-${i}`,
        fecha: h.fecha,
        usuario: h.usuario,
        modulo: "Envíos",
        accion: h.evento,
        detalle: `${e.id} · ${e.canal}`,
        cliente: nombreCliente(e.clienteId),
      })),
    );
    const deBorradores = borradores.map((b) => ({
      id: b.id,
      fecha: b.creado,
      usuario: b.responsable,
      modulo: "Bandeja de salida",
      accion: `Borrador ${b.estado.replace(/_/g, " ")}`,
      detalle: `${b.canal} · riesgo ${b.riesgoLegal}${b.revisionLegal ? " · revisión legal" : ""}`,
      cliente: nombreCliente(b.clienteId),
    }));
    const globales = auditoria.map((a) => ({ ...a, cliente: a.clienteId ? nombreCliente(a.clienteId) : "—" }));
    return [...globales, ...deEnvios, ...deBorradores].sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [envios, auditoria, borradores]);

  const visibles = filas.filter(
    (f) =>
      (modulo === "todos" || f.modulo === modulo) &&
      (!q || `${f.accion} ${f.detalle} ${f.cliente} ${f.usuario}`.toLowerCase().includes(q.toLowerCase())),
  );

  const exportar = () => {
    const cab = ["fecha", "usuario", "modulo", "accion", "cliente", "detalle"];
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [cab.join(","), ...visibles.map((f) => [f.fecha, f.usuario, f.modulo, f.accion, f.cliente, f.detalle].map(esc).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title="Auditoría legal"
        subtitle="Registro inmutable de acciones: quién, cuándo, sobre qué contacto y en qué módulo. Exportable para responder a requerimientos o ejercicios de derechos."
        right={
          <Button variant="outline" onClick={exportar}>
            <Download className="size-4" /> Exportar CSV
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Eventos registrados" value={filas.length} />
        <KpiCard label="Bajas registradas" value={filas.filter((f) => /baja/i.test(f.accion)).length} tone="bloqueado" />
        <KpiCard label="Revisión legal" value={borradores.filter((b) => b.revisionLegal).length} tone="pendiente" />
        <KpiCard label="Envíos cancelados" value={envios.filter((e) => e.estado === "cancelado").length} tone="riesgo" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Buscar acción, contacto, usuario…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={modulo} onValueChange={setModulo}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los módulos</SelectItem>
            <SelectItem value="Envíos">Envíos</SelectItem>
            <SelectItem value="Bandeja de salida">Bandeja de salida</SelectItem>
            <SelectItem value="Consentimientos">Consentimientos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Detalle</TableHead>
              <TableHead>Usuario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibles.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="whitespace-nowrap text-sm">{fecha(f.fecha)}</TableCell>
                <TableCell><Pill tone="outline" label={f.modulo} /></TableCell>
                <TableCell className="text-sm font-medium">{f.accion}</TableCell>
                <TableCell className="text-sm">{f.cliente}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{f.detalle}</TableCell>
                <TableCell className="text-sm">{f.usuario}</TableCell>
              </TableRow>
            ))}
            {visibles.length === 0 && (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">Sin eventos.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
