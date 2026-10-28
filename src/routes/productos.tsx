import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Package } from "lucide-react";

import { KpiCard, PageHeader, Pill } from "@/components/common";
import { mensajes, productos } from "@/data/mock";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/productos")({
  head: () => ({
    meta: [
      { title: "Productos — MarketingHub AI" },
      {
        name: "description",
        content:
          "Catálogo de productos con su uso en campañas, mensajes y envíos por canal.",
      },
      { property: "og:title", content: "Productos — MarketingHub AI" },
      {
        property: "og:description",
        content: "Catálogo de productos vinculado a campañas, mensajes y envíos multicanal.",
      },
    ],
  }),
  component: ProductosPage,
});

function ProductosPage() {
  const { campanas, envios, entradas } = useStore();

  const fichas = productos.map((p) => {
    const campanasProducto = campanas.filter((c) => c.productoId === p.id);
    const mensajesProducto = mensajes.filter((m) => m.productoId === p.id);
    const enviosProducto = envios.filter((e) => e.productoId === p.id);
    const respuestas = entradas.filter((e) => e.productoId === p.id).length;
    const porEmail = enviosProducto.filter((e) => e.canal === "email").length;
    const porWhatsapp = enviosProducto.filter((e) => e.canal === "whatsapp").length;
    const riesgoAlto = mensajesProducto.filter((m) => m.riesgoLegal === "alto").length;
    return { p, campanasProducto, mensajesProducto, enviosProducto, respuestas, porEmail, porWhatsapp, riesgoAlto };
  });

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-8">
      <PageHeader
        title="Productos"
        subtitle="Catálogo de productos y servicios vinculado a campañas, mensajes y envíos. Los mensajes con riesgo legal alto quedan bloqueados hasta su revisión."
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Productos" value={productos.length} hint="Catálogo ficticio" />
        <KpiCard label="Campañas vinculadas" value={campanas.length} />
        <KpiCard
          label="Mensajes creados"
          value={mensajes.length}
          hint={`${mensajes.filter((m) => m.aprobado).length} aprobados`}
        />
        <KpiCard
          label="Riesgo legal alto"
          value={mensajes.filter((m) => m.riesgoLegal === "alto").length}
          tone="riesgo"
          hint="Bloqueados para envío"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {fichas.map(({ p, campanasProducto, mensajesProducto, enviosProducto, respuestas, porEmail, porWhatsapp, riesgoAlto }) => (
          <article key={p.id} className="rounded-xl border border-border bg-card p-5 shadow-panel">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Package className="size-5" />
                </span>
                <h2 className="font-semibold">{p.nombre}</h2>
              </div>
              {riesgoAlto > 0 && <Pill value="alto" label={`${riesgoAlto} riesgo alto`} />}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
              <div className="rounded-md bg-muted p-3">
                <p className="text-lg font-semibold">{campanasProducto.length}</p>
                <p className="text-xs text-muted-foreground">Campañas</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-lg font-semibold">{mensajesProducto.length}</p>
                <p className="text-xs text-muted-foreground">Mensajes</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-lg font-semibold">{enviosProducto.length}</p>
                <p className="text-xs text-muted-foreground">Envíos</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-lg font-semibold">{respuestas}</p>
                <p className="text-xs text-muted-foreground">Respuestas</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Mail className="size-3.5" /> {porEmail} por email
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="size-3.5" /> {porWhatsapp} por WhatsApp
              </span>
            </div>

            {campanasProducto.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-border pt-3">
                {campanasProducto.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">{c.nombre}</span>
                    <Pill value={c.estado} />
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
