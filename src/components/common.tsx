import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const estadoPill = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border bg-muted text-muted-foreground",
        aprobado: "border-transparent bg-success text-success-foreground",
        pendiente: "border-transparent bg-warning text-warning-foreground",
        enviado: "border-transparent bg-info text-info-foreground",
        respondido: "border-transparent bg-brand text-brand-foreground",
        riesgo: "border-transparent bg-destructive text-destructive-foreground",
        bloqueado: "border-transparent bg-blocked text-blocked-foreground",
        outline: "border-border bg-card text-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type Tone = NonNullable<VariantProps<typeof estadoPill>["tone"]>;

const TONOS: Record<string, Tone> = {
  // envíos
  pendiente: "pendiente",
  programado: "pendiente",
  enviado: "enviado",
  entregado: "enviado",
  leido: "enviado",
  respondido: "respondido",
  fallido: "riesgo",
  cancelado: "bloqueado",
  // consentimiento
  valido: "aprobado",
  ausente: "riesgo",
  revocado: "bloqueado",
  baja: "bloqueado",
  // revisión / secuencias / borradores
  aprobado: "aprobado",
  aprobada: "aprobado",
  borrador: "neutral",
  pendiente_revision: "pendiente",
  activo: "aprobado",
  activa: "aprobado",
  pausado: "bloqueado",
  pausada: "bloqueado",
  enviada: "enviado",
  cancelada: "bloqueado",
  // riesgo
  bajo: "aprobado",
  medio: "pendiente",
  alto: "riesgo",
  // prioridad / estados bandeja
  alta: "riesgo",
  media: "pendiente",
  baja_prioridad: "neutral",
  nuevo: "enviado",
  en_curso: "pendiente",
  resuelto: "aprobado",
};

export function Pill({
  value,
  label,
  tone,
  className,
}: {
  value?: string | undefined;
  label?: string | undefined;
  tone?: Tone | undefined;
  className?: string | undefined;
}) {
  const resolved = tone ?? (value ? TONOS[value] ?? "neutral" : "neutral");
  return (
    <span className={cn(estadoPill({ tone: resolved }), className)}>
      {(label ?? value ?? "").replace(/_/g, " ")}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode | undefined;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  tone = "outline",
}: {
  label: string;
  value: string | number;
  hint?: string | undefined;
  tone?: Tone | undefined;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-panel">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {tone !== "outline" && <span className={cn(estadoPill({ tone }), "px-1.5 py-0")}>·</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function fecha(iso?: string | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
