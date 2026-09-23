import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import type { Canal, Cliente } from "@/data/mock";

export const Route = createFileRoute("/consentimientos")({
  head: () => ({
    meta: [
      { title: "Consentimientos y bajas — MarketingHub AI" },
      { name: "description", content: "Registro de opt-in, bajas, oposiciones y lista interna de exclusión por canal." },
      { property: "og:title", content: "Consentimientos y bajas — MarketingHub AI" },
      { property: "og:description", content: "Control RGPD/LSSI-CE de consentimiento por canal y lista de exclusión." },
    ],
  }),
  component: ConsentimientosPage,
});

const CANALES: Canal[] = ["email", "whatsapp"];

function ConsentimientosPage() {
  const { clientes, registrarBaja, registrarConsentimiento } = useStore();
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [baja, setBaja] = useState<Cliente | null>(null);
  const [optin, setOptin] = useState<Cliente | null>(null);

  const filtrados = useMemo(
    () =>
      clientes.filter((c) => {
        const t = `${c.nombre} ${c.contacto}`.toLowerCase();
        if (q && !t.includes(q.toLowerCase())) return false;
        if (filtro === "todos") return true;
        return CANALES.some((k) => c.consentimiento[k] === filtro);
      }),
    [clientes, q, filtro],
  );

  const excluidos = clientes.filter((c) => CANALES.some((k) => ["baja", "revocado"].includes(c.consentimiento[k])));
  const cuenta = (e: string) => clientes.reduce((n, c) => n + CANALES.filter((k) => c.consentimiento[k] === e).length, 0);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title="Consentimientos y bajas"
        subtitle="Estado de consentimiento por contacto y canal, base jurídica, fuente y lista interna de exclusión. Una baja cancela automáticamente los envíos pendientes."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Consentimientos válidos" value={cuenta("valido")} tone="aprobado" hint="Contacto·canal" />
        <KpiCard label="Sin consentimiento" value={cuenta("ausente")} tone="riesgo" hint="No se puede enviar" />
        <KpiCard label="Revocados" value={cuenta("revocado")} tone="bloqueado" />
        <KpiCard label="En lista de exclusión" value={excluidos.length} tone="bloqueado" hint="Contactos" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Input placeholder="Buscar contacto…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="valido">Con algún válido</SelectItem>
            <SelectItem value="ausente">Con algún ausente</SelectItem>
            <SelectItem value="revocado">Con algún revocado</SelectItem>
            <SelectItem value="baja">Con alguna baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contacto</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Base jurídica</TableHead>
              <TableHead>Fuente</TableHead>
              <TableHead>Último contacto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="font-medium">{c.nombre}</div>
                  <div className="text-xs text-muted-foreground">{c.contacto}</div>
                </TableCell>
                <TableCell><Pill value={c.consentimiento.email} /></TableCell>
                <TableCell><Pill value={c.consentimiento.whatsapp} /></TableCell>
                <TableCell className="text-sm">{c.baseJuridica}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.fuenteConsentimiento}</TableCell>
                <TableCell className="text-sm">{fecha(c.ultimoContacto)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setOptin(c)}>
                      <ShieldCheck className="size-4" /> Opt-in
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setBaja(c)}>
                      <ShieldOff className="size-4" /> Baja
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Lista interna de exclusión</h2>
        <p className="mb-3 text-xs text-muted-foreground">Estos contactos no recibirán comunicaciones comerciales en los canales indicados.</p>
        {excluidos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin contactos excluidos.</p>
        ) : (
          <ul className="divide-y divide-border">
            {excluidos.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span>{c.nombre} · <span className="text-muted-foreground">{c.contacto}</span></span>
                <span className="flex gap-1">
                  {CANALES.filter((k) => ["baja", "revocado"].includes(c.consentimiento[k])).map((k) => (
                    <Pill key={k} tone="bloqueado" label={k} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <BajaDialog
        cliente={baja}
        onClose={() => setBaja(null)}
        onConfirm={(canales, motivo, origen) => {
          if (!baja) return;
          registrarBaja(baja.id, canales, motivo, origen);
          toast.success(`Baja registrada para ${baja.nombre}. Envíos pendientes cancelados.`);
          setBaja(null);
        }}
      />
      <OptinDialog
        cliente={optin}
        onClose={() => setOptin(null)}
        onConfirm={(canal, fuente) => {
          if (!optin) return;
          registrarConsentimiento(optin.id, canal, fuente);
          toast.success(`Consentimiento ${canal} registrado para ${optin.nombre}`);
          setOptin(null);
        }}
      />
    </div>
  );
}

function BajaDialog({
  cliente,
  onClose,
  onConfirm,
}: {
  cliente: Cliente | null;
  onClose: () => void;
  onConfirm: (canales: Canal[], motivo: string, origen: string) => void;
}) {
  const [canales, setCanales] = useState<Canal[]>(["email", "whatsapp"]);
  const [origen, setOrigen] = useState("Solicitud del interesado");
  const [motivo, setMotivo] = useState("");
  return (
    <Dialog open={!!cliente} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar baja / oposición</DialogTitle>
          <DialogDescription>{cliente?.nombre} — se añadirá a la lista de exclusión y se cancelarán envíos pendientes.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-4">
            {CANALES.map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={canales.includes(k)}
                  onCheckedChange={(v) => setCanales((p) => (v ? [...p, k] : p.filter((x) => x !== k)))}
                />
                {k}
              </label>
            ))}
          </div>
          <div className="space-y-1">
            <Label>Origen</Label>
            <Select value={origen} onValueChange={setOrigen}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Solicitud del interesado">Solicitud del interesado</SelectItem>
                <SelectItem value="Enlace de baja">Enlace de baja</SelectItem>
                <SelectItem value="Respuesta STOP WhatsApp">Respuesta STOP WhatsApp</SelectItem>
                <SelectItem value="Ejercicio de derechos RGPD">Ejercicio de derechos RGPD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Motivo / observaciones</Label>
            <Textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Opcional" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" disabled={canales.length === 0} onClick={() => onConfirm(canales, motivo || "—", origen)}>
            Confirmar baja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OptinDialog({
  cliente,
  onClose,
  onConfirm,
}: {
  cliente: Cliente | null;
  onClose: () => void;
  onConfirm: (canal: Canal, fuente: string) => void;
}) {
  const [canal, setCanal] = useState<Canal>("email");
  const [fuente, setFuente] = useState("");
  const [prueba, setPrueba] = useState(false);
  const bloqueado = cliente && ["baja", "revocado"].includes(cliente.consentimiento[canal]);
  return (
    <Dialog open={!!cliente} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar consentimiento (opt-in)</DialogTitle>
          <DialogDescription>Solo con evidencia verificable de consentimiento libre, específico e informado.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Canal</Label>
            <Select value={canal} onValueChange={(v) => setCanal(v as Canal)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Fuente del consentimiento</Label>
            <Input value={fuente} onChange={(e) => setFuente(e.target.value)} placeholder="Ej.: formulario web doble opt-in 23/09" />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={prueba} onCheckedChange={(v) => setPrueba(!!v)} />
            Confirmo que existe prueba documentada del consentimiento.
          </label>
          {bloqueado && (
            <p className="rounded-md border border-border bg-muted p-2 text-xs text-muted-foreground">
              Este contacto tiene una baja previa en {canal}. Solo registra el opt-in si el propio interesado lo ha solicitado de nuevo.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button disabled={!fuente.trim() || !prueba} onClick={() => onConfirm(canal, fuente.trim())}>
            Registrar opt-in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
