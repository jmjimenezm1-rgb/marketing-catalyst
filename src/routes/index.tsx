import { createFileRoute, Link } from "@tanstack/react-router";
import { FileEdit, GitBranch, Inbox, Send, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { KpiCard, Pill } from "@/components/common";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MarketingHub AI — Operación de campañas multicanal" },
      {
        name: "description",
        content:
          "Centro de operación de envíos, secuencias evolutivas y bandejas de entrada y salida para campañas de email y WhatsApp con cumplimiento RGPD desde el diseño.",
      },
      { property: "og:title", content: "MarketingHub AI — Operación de campañas multicanal" },
      {
        property: "og:description",
        content: "Envíos validados, secuencias con condiciones, respuestas clasificadas y borradores con revisión humana.",
      },
    ],
  }),
  component: Index,
});

const modulos = [
  {
    n: 8,
    url: "/envios",
    icon: Send,
    titulo: "Envíos",
    desc: "Individuales, masivos, por lotes, en secuencia y condicionados. Validación previa de consentimiento, bajas, canal, frecuencia y límites.",
  },
  {
    n: 9,
    url: "/secuencias",
    icon: GitBranch,
    titulo: "Campañas evolutivas y secuencias",
    desc: "Pasos de refuerzo con orden, canal, plantilla, condición de activación, espera y adaptación de contenido con IA.",
  },
  {
    n: 10,
    url: "/bandeja-entrada",
    icon: Inbox,
    titulo: "Bandeja de entrada",
    desc: "Respuestas unificadas de email y WhatsApp, clasificadas por intención comercial, con prioridad y próxima acción.",
  },
  {
    n: 11,
    url: "/bandeja-salida",
    icon: FileEdit,
    titulo: "Bandeja de salida y borradores",
    desc: "Workflow de respuestas generadas: revisión, aprobación, programación, envío y marcado para revisión legal.",
  },
] as const;

function Index() {
  const { envios, secuencias, entradas, borradores } = useStore();

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-4 md:p-8">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-panel md:p-8">
        <Pill value="aprobado" label="Compliance by design" />
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          MarketingHub AI — operación de campañas multicanal
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
          Esta versión implementa los módulos 8 a 11: envíos, campañas evolutivas, bandeja de entrada y bandeja de
          salida. Los módulos 1-7 y 12-25 se integrarán posteriormente. Todos los datos son ficticios y los conectores
          de email, WhatsApp Business Platform e IA están simulados y claramente identificados.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/envios">Ir a envíos</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/bandeja-entrada">Ver respuestas recibidas</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Envíos registrados" value={envios.length} hint="Con historial auditable" />
        <KpiCard label="Secuencias definidas" value={secuencias.length} hint="Pasos con condiciones" />
        <KpiCard label="Respuestas recibidas" value={entradas.length} tone="enviado" />
        <KpiCard label="Borradores en salida" value={borradores.length} tone="pendiente" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {modulos.map((m) => (
          <Link
            key={m.url}
            to={m.url}
            className="group rounded-xl border border-border bg-card p-5 shadow-panel transition-colors hover:border-ring"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <m.icon className="size-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Módulo {m.n}</p>
                <h2 className="font-semibold">{m.titulo}</h2>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{m.desc}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-muted/50 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="size-4" /> Controles de cumplimiento activos
        </h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>Bloqueo de envíos sin consentimiento válido por canal o sin base jurídica registrada.</li>
          <li>Lista interna de exclusión: bajas y oposiciones detienen campañas y secuencias.</li>
          <li>Revisión humana obligatoria antes de cualquier envío masivo.</li>
          <li>Mecanismo de baja verificado en cada mensaje antes de permitir el envío.</li>
          <li>Trazabilidad completa: origen del dato, fuente del consentimiento, aprobador y motivo de bloqueo.</li>
          <li>IA responsable: sin datos inventados, sin atributos sensibles y edición siempre disponible.</li>
        </ul>
      </section>
    </div>
  );
}
