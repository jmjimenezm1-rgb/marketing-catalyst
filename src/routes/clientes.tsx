import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { KpiCard, PageHeader, Pill, fecha } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Canal, Cliente } from "@/data/mock";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — MarketingHub AI" },
      {
        name: "description",
        content:
          "Fichas de clientes con consentimiento por canal, base jurídica, fuente del dato e historial de interacciones.",
      },
      { property: "og:title", content: "Clientes — MarketingHub AI" },
      {
        property: "og:description",
        content: "Gestión de contactos con trazabilidad de consentimiento y lista de exclusión.",
      },
    ],
  }),
  component: ClientesPage,
});

const ETIQUETA_CONSENTIMIENTO: Record<string, string> = {
  valido: "Válido",
  ausente: "Sin consentimiento",
  revocado: "Revocado",
  baja: "Baja",
};

function ClientesPage() {
  const { clientes, envios, entradas, borradores, registrarBaja, registrarConsentimiento } =
    useStore();
  const [busqueda, setBusqueda] = useState("");
  const [sector, setSector] = useState("todos");
  const [seleccionado, setSeleccionado] = useState<Cliente | null>(null);
  const [fuenteOptIn, setFuenteOptIn] = useState("");
  const [canalOptIn, setCanalOptIn] = useState<Canal>("email");
  const [motivoBaja, setMotivoBaja] = useState("");

  const sectores = useMemo(() => [...new Set(clientes.map((c) => c.sector))].sort(), [clientes]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return clientes.filter(
      (c) =>
        (sector === "todos" || c.sector === sector) &&
        (!q ||
          c.nombre.toLowerCase().includes(q) ||
          c.contacto.toLowerCase().includes(q) ||
          c.responsable.toLowerCase().includes(q)),
    );
  }, [clientes, busqueda, sector]);

  const conConsentimiento = clientes.filter(
    (c) => c.consentimiento.email === "valido" || c.consentimiento.whatsapp === "valido",
  ).length;
  const enExclusion = clientes.filter(
    (c) =>
      [c.consentimiento.email, c.consentimiento.whatsapp].some((e) => e === "baja" || e === "revocado"),
  ).length;
  const sinConsentimiento = clientes.filter(
    (c) => c.consentimiento.email === "ausente" && c.consentimiento.whatsapp === "ausente",
  ).length;

  // El detalle se deriva del store para reflejar cambios de consentimiento al instante.
  const detalle = seleccionado ? clientes.find((c) => c.id === seleccionado.id) ?? null : null;

  const enviosCliente = detalle ? envios.filter((e) => e.clienteId === detalle.id) : [];
  const entradasCliente = detalle ? entradas.filter((e) => e.clienteId === detalle.id) : [];
  const borradoresCliente = detalle ? borradores.filter((b) => b.clienteId === detalle.id) : [];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-8">
      <PageHeader
        title="Clientes"
        subtitle="Fichas de contacto con consentimiento por canal, base jurídica y fuente del dato. Toda baja u opt-in queda registrada en la auditoría legal."
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Clientes" value={clientes.length} hint="Datos ficticios" />
        <KpiCard label="Con consentimiento" value={conConsentimiento} tone="aprobado" hint="Válido en algún canal" />
        <KpiCard label="En lista de exclusión" value={enExclusion} tone="bloqueado" hint="Baja o revocado" />
        <KpiCard label="Sin consentimiento" value={sinConsentimiento} tone="riesgo" hint="No se puede enviar" />
      </section>

      <section className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar cliente, contacto o responsable…"
            className="pl-9"
          />
        </div>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los sectores</SelectItem>
            {sectores.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="overflow-x-auto rounded-xl border border-border bg-card shadow-panel">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Base jurídica</TableHead>
              <TableHead>Último contacto</TableHead>
              <TableHead>Responsable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((c) => (
              <TableRow
                key={c.id}
                className="cursor-pointer"
                onClick={() => {
                  setSeleccionado(c);
                  setFuenteOptIn("");
                  setMotivoBaja("");
                }}
              >
                <TableCell>
                  <p className="font-medium text-foreground">{c.nombre}</p>
                  <p className="text-xs text-muted-foreground">{c.contacto}</p>
                </TableCell>
                <TableCell>{c.sector}</TableCell>
                <TableCell>
                  <Pill value={c.consentimiento.email} label={ETIQUETA_CONSENTIMIENTO[c.consentimiento.email]} />
                </TableCell>
                <TableCell>
                  <Pill value={c.consentimiento.whatsapp} label={ETIQUETA_CONSENTIMIENTO[c.consentimiento.whatsapp]} />
                </TableCell>
                <TableCell className="max-w-56 text-xs text-muted-foreground">{c.baseJuridica}</TableCell>
                <TableCell className="whitespace-nowrap text-xs">{fecha(c.ultimoContacto)}</TableCell>
                <TableCell>{c.responsable}</TableCell>
              </TableRow>
            ))}
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No hay clientes que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <Sheet open={!!detalle} onOpenChange={(open) => !open && setSeleccionado(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {detalle && (
            <>
              <SheetHeader>
                <SheetTitle>{detalle.nombre}</SheetTitle>
                <SheetDescription>
                  {detalle.contacto} · {detalle.sector} · Responsable: {detalle.responsable}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 px-4 pb-6">
                <section className="rounded-lg border border-border p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="size-4" /> Consentimiento y protección de datos
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <Pill value={detalle.consentimiento.email} label={ETIQUETA_CONSENTIMIENTO[detalle.consentimiento.email]} />
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">WhatsApp</dt>
                      <dd>
                        <Pill value={detalle.consentimiento.whatsapp} label={ETIQUETA_CONSENTIMIENTO[detalle.consentimiento.whatsapp]} />
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">Base jurídica</dt>
                      <dd className="text-right text-xs">{detalle.baseJuridica}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">Fuente</dt>
                      <dd className="text-right text-xs">{detalle.fuenteConsentimiento}</dd>
                    </div>
                  </dl>
                </section>

                <section className="rounded-lg border border-border p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <UserPlus className="size-4" /> Registrar opt-in
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requiere fuente documentada. Queda anotado en la auditoría legal.
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Select value={canalOptIn} onValueChange={(v) => setCanalOptIn(v as Canal)}>
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={fuenteOptIn}
                        onChange={(e) => setFuenteOptIn(e.target.value)}
                        placeholder="Fuente (p. ej. formulario web, fecha)"
                        className="flex-1"
                      />
                    </div>
                    <Button
                      size="sm"
                      disabled={!fuenteOptIn.trim()}
                      onClick={() => {
                        registrarConsentimiento(detalle.id, canalOptIn, fuenteOptIn.trim());
                        setFuenteOptIn("");
                        toast.success(`Opt-in de ${canalOptIn} registrado para ${detalle.nombre}`);
                      }}
                    >
                      Registrar opt-in
                    </Button>
                  </div>
                </section>

                <section className="rounded-lg border border-destructive/40 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <UserMinus className="size-4" /> Registrar baja / oposición
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Añade el contacto a la lista interna de exclusión y cancela sus envíos pendientes en ambos canales.
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    <Label htmlFor="motivo-baja" className="text-xs">
                      Motivo
                    </Label>
                    <Input
                      id="motivo-baja"
                      value={motivoBaja}
                      onChange={(e) => setMotivoBaja(e.target.value)}
                      placeholder="p. ej. Solicitud del interesado por email"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={!motivoBaja.trim()}
                      onClick={() => {
                        registrarBaja(detalle.id, ["email", "whatsapp"], motivoBaja.trim(), "Ficha de cliente");
                        setMotivoBaja("");
                        toast.success(`Baja registrada para ${detalle.nombre}`);
                      }}
                    >
                      Registrar baja en todos los canales
                    </Button>
                  </div>
                </section>

                <section className="rounded-lg border border-border p-4">
                  <h3 className="text-sm font-semibold">Actividad relacionada</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-lg font-semibold">{enviosCliente.length}</p>
                      <p className="text-xs text-muted-foreground">Envíos</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-lg font-semibold">{entradasCliente.length}</p>
                      <p className="text-xs text-muted-foreground">Respuestas</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-lg font-semibold">{borradoresCliente.length}</p>
                      <p className="text-xs text-muted-foreground">Borradores</p>
                    </div>
                  </div>
                  {enviosCliente.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {enviosCliente.slice(0, 5).map((e) => (
                        <li key={e.id} className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-muted-foreground">
                            {e.canal} · {e.tipo.replace(/_/g, " ")}
                          </span>
                          <Pill value={e.estado} />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
