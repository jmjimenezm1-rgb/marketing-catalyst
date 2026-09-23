import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, Clock, Mail, MessageCircle, Pause, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { KpiCard, PageHeader, Pill } from "@/components/common";
import { useStore } from "@/lib/store";
import { nombreCampana, nombreProducto, campanas, type CondicionPaso, type PasoSecuencia } from "@/data/mock";

export const Route = createFileRoute("/secuencias")({
  head: () => ({
    meta: [
      { title: "Campañas evolutivas y secuencias — MarketingHub AI" },
      {
        name: "description",
        content:
          "Diseño de secuencias de refuerzo con condiciones de activación, esperas, canal por paso y adaptación de contenido con IA.",
      },
      { property: "og:title", content: "Campañas evolutivas y secuencias — MarketingHub AI" },
      {
        property: "og:description",
        content: "Pasos sucesivos con condiciones de respuesta o no respuesta y revisión humana requerida.",
      },
    ],
  }),
  component: SecuenciasPage,
});

const CONDICIONES: Record<CondicionPaso, string> = {
  siempre: "Siempre (paso inicial)",
  no_responde: "Si el cliente no responde",
  responde_positivo: "Si responde positivamente",
  responde_negativo: "Si responde negativamente",
  pide_info: "Si pide más información",
  solicita_baja: "Si solicita baja (detiene la secuencia)",
  interes_otro_producto: "Si muestra interés en otro producto",
  email_no_entregado: "Si el email no se entrega",
  whatsapp_no_entregado: "Si el WhatsApp no se entrega",
  abre_sin_responder: "Si abre el email pero no responde",
  hace_clic: "Si hace clic",
  agenda_reunion: "Si agenda reunión",
  comercial_marca_oportunidad: "Si el comercial marca oportunidad",
};

const TIPOS_PASO: Record<PasoSecuencia["tipo"], string> = {
  inicial: "Mensaje inicial",
  seguimiento_1: "Primer seguimiento",
  seguimiento_2: "Segundo seguimiento",
  recordatorio: "Recordatorio",
  caso_uso: "Mensaje con caso de uso",
  propuesta_valor: "Propuesta de valor ampliada",
  cierre: "Mensaje de cierre",
  reactivacion: "Mensaje de reactivación",
  post_respuesta: "Mensaje posterior a respuesta",
  post_no_respuesta: "Mensaje posterior a no respuesta",
};

const SEÑALES_IA = [
  "Historial de interacción",
  "Respuesta del cliente",
  "Producto",
  "Segmento",
  "Objeciones detectadas",
  "Tono de la conversación",
  "Estado de la oportunidad",
];

function SecuenciasPage() {
  const { secuencias, cambiarEstadoSecuencia, actualizarPaso } = useStore();
  const [activa, setActiva] = useState(secuencias[0]?.id ?? "");
  const [editando, setEditando] = useState<PasoSecuencia | null>(null);
  const [previsualizar, setPrevisualizar] = useState<PasoSecuencia | null>(null);

  const secuencia = secuencias.find((s) => s.id === activa) ?? secuencias[0];
  if (!secuencia) return null;
  const campana = campanas.find((c) => c.id === secuencia.campanaId);

  const guardar = (cambios: Partial<PasoSecuencia>) => {
    if (!editando) return;
    actualizarPaso(secuencia.id, editando.id, cambios);
    setEditando(null);
    toast.success("Paso actualizado");
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-8">
      <PageHeader
        title="Campañas evolutivas y secuencias"
        subtitle="Módulo 9 · Secuencias de refuerzo con orden, canal, plantilla, condición de activación, espera y segmento. Toda solicitud de baja detiene la secuencia y ningún paso sale sin revisión humana cuando está marcada."
        right={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Select value={secuencia.id} onValueChange={setActiva}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {secuencias.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={secuencia.estado === "activa" ? "outline" : "default"}
              onClick={() => {
                cambiarEstadoSecuencia(secuencia.id, secuencia.estado === "activa" ? "pausada" : "activa");
                toast.success(secuencia.estado === "activa" ? "Secuencia pausada" : "Secuencia activada");
              }}
            >
              {secuencia.estado === "activa" ? (
                <>
                  <Pause className="mr-2 size-4" /> Pausar
                </>
              ) : (
                <>
                  <Play className="mr-2 size-4" /> Activar
                </>
              )}
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Campaña" value={nombreCampana(secuencia.campanaId)} hint={campana ? nombreProducto(campana.productoId) : ""} />
        <KpiCard label="Pasos definidos" value={secuencia.pasos.length} />
        <KpiCard
          label="Pasos activos"
          value={secuencia.pasos.filter((p) => p.estado === "activo").length}
          tone="aprobado"
        />
        <KpiCard
          label="Pendientes de revisión"
          value={secuencia.pasos.filter((p) => p.revisionRequerida).length}
          tone="pendiente"
          hint="Revisión humana obligatoria"
        />
      </div>

      <div className="space-y-3">
        {secuencia.pasos
          .slice()
          .sort((a, b) => a.orden - b.orden)
          .map((paso, i) => (
            <div key={paso.id}>
              {i > 0 && (
                <div className="flex items-center gap-2 py-2 pl-6 text-xs text-muted-foreground">
                  <ArrowDown className="size-4" />
                  <Clock className="size-3.5" />
                  Espera {paso.esperaDias} día(s) · condición: {CONDICIONES[paso.condicion]}
                </div>
              )}
              <div className="rounded-xl border border-border bg-card p-4 shadow-panel">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                      {paso.orden}
                    </span>
                    <div>
                      <p className="font-medium">{TIPOS_PASO[paso.tipo]}</p>
                      <p className="text-xs text-muted-foreground">
                        Plantilla {paso.plantilla} · variación {paso.variacion} · {paso.segmento}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">Objetivo: {paso.objetivo}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill
                      value={paso.canal}
                      label={paso.canal === "email" ? "Email" : "WhatsApp"}
                      tone="outline"
                    />
                    <Pill value={paso.estado} />
                    {paso.revisionRequerida && <Pill value="pendiente_revision" label="revisión requerida" />}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">Adaptación IA:</span>
                  {paso.adaptacionIA.map((s) => (
                    <Pill key={s} value={s} tone="outline" />
                  ))}
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPrevisualizar(paso)}>
                      <Sparkles className="mr-2 size-3.5" /> Previsualizar adaptación
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditando(paso)}>
                      Editar paso
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <p className="rounded-xl border border-border bg-muted/60 p-3 text-xs text-muted-foreground">
        Regla de cumplimiento: si el cliente solicita baja o se opone al tratamiento, la secuencia se detiene, el
        contacto pasa a la lista interna de exclusión y no se generan nuevos mensajes comerciales. La IA solo adapta el
        contenido con datos ya registrados: no inventa información ni infiere atributos personales.
      </p>

      {/* Editor de paso */}
      <Dialog open={!!editando} onOpenChange={(o) => !o && setEditando(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {editando && <EditorPaso paso={editando} onGuardar={guardar} />}
        </DialogContent>
      </Dialog>

      {/* Previsualización IA */}
      <Dialog open={!!previsualizar} onOpenChange={(o) => !o && setPrevisualizar(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adaptación simulada del paso</DialogTitle>
            <DialogDescription>
              Generación simulada (sin modelo real conectado). Editable siempre antes del envío y sujeta a revisión
              humana.
            </DialogDescription>
          </DialogHeader>
          {previsualizar && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {previsualizar.canal === "email" ? <Mail className="size-4" /> : <MessageCircle className="size-4" />}
                {previsualizar.canal} · {TIPOS_PASO[previsualizar.tipo]}
              </div>
              <Textarea
                readOnly
                rows={8}
                value={`[Simulado] ${TIPOS_PASO[previsualizar.tipo]} para el segmento "${previsualizar.segmento}".\n\nSeñales usadas: ${previsualizar.adaptacionIA.join(", ")}.\nObjetivo: ${previsualizar.objetivo}.\n\nSi el cliente no aportó datos adicionales, el mensaje se mantiene genérico y sin afirmaciones no verificadas. Incluye siempre mecanismo de baja.`}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditorPaso({
  paso,
  onGuardar,
}: {
  paso: PasoSecuencia;
  onGuardar: (cambios: Partial<PasoSecuencia>) => void;
}) {
  const [estado, setEstado] = useState(paso.estado);
  const [canal, setCanal] = useState(paso.canal);
  const [condicion, setCondicion] = useState<CondicionPaso>(paso.condicion);
  const [espera, setEspera] = useState(String(paso.esperaDias));
  const [plantilla, setPlantilla] = useState(paso.plantilla);
  const [segmento, setSegmento] = useState(paso.segmento);
  const [objetivo, setObjetivo] = useState(paso.objetivo);
  const [revision, setRevision] = useState(paso.revisionRequerida);
  const [senales, setSenales] = useState<string[]>(paso.adaptacionIA);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Paso {paso.orden} · {TIPOS_PASO[paso.tipo]}</DialogTitle>
        <DialogDescription>Configura canal, condición de activación, espera y adaptación con IA.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Canal</Label>
            <Select value={canal} onValueChange={(v) => setCanal(v as PasoSecuencia["canal"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Estado</Label>
            <Select value={estado} onValueChange={(v) => setEstado(v as PasoSecuencia["estado"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Condición de activación</Label>
          <Select value={condicion} onValueChange={(v) => setCondicion(v as CondicionPaso)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CONDICIONES).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Espera entre mensajes (días)</Label>
            <Input type="number" min={0} value={espera} onChange={(e) => setEspera(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Plantilla</Label>
            <Input value={plantilla} onChange={(e) => setPlantilla(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Segmento afectado</Label>
          <Input value={segmento} onChange={(e) => setSegmento(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Objetivo del paso</Label>
          <Input value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <p className="text-sm font-medium">Revisión humana requerida</p>
            <p className="text-xs text-muted-foreground">Obligatoria en envíos masivos y en mensajes de alto riesgo.</p>
          </div>
          <Switch checked={revision} onCheckedChange={setRevision} />
        </div>
        <div className="space-y-2 rounded-lg border border-border p-3">
          <p className="text-sm font-medium">Señales de adaptación con IA</p>
          <div className="flex flex-wrap gap-2">
            {SEÑALES_IA.map((s) => {
              const on = senales.includes(s);
              return (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={on ? "default" : "outline"}
                  onClick={() => setSenales((prev) => (on ? prev.filter((x) => x !== s) : [...prev, s]))}
                >
                  {s}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={() =>
            onGuardar({
              estado,
              canal,
              condicion,
              esperaDias: Number(espera) || 0,
              plantilla,
              segmento,
              objetivo,
              revisionRequerida: revision,
              adaptacionIA: senales,
            })
          }
        >
          Guardar paso
        </Button>
      </DialogFooter>
    </>
  );
}
