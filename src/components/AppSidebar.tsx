import { Link, useRouterState } from "@tanstack/react-router";
import {
  Send,
  GitBranch,
  Inbox,
  FileEdit,
  LayoutDashboard,
  Users,
  Target,
  Package,
  Megaphone,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  BarChart3,
  Settings,
  Plug,
  ScrollText,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const activos = [
  { title: "Envíos", url: "/envios", icon: Send },
  { title: "Secuencias", url: "/secuencias", icon: GitBranch },
  { title: "Bandeja de entrada", url: "/bandeja-entrada", icon: Inbox },
  { title: "Bandeja de salida", url: "/bandeja-salida", icon: FileEdit },
];

const pendientes = [
  { title: "Dashboard", icon: LayoutDashboard },
  { title: "Clientes", icon: Users },
  { title: "Potenciales clientes", icon: Target },
  { title: "Productos", icon: Package },
  { title: "Campañas", icon: Megaphone },
  { title: "Generador de mensajes", icon: Sparkles },
  { title: "Revisión de mensajes", icon: ClipboardCheck },
  { title: "Respuesta inteligente", icon: Sparkles },
  { title: "Consentimientos", icon: ShieldCheck },
  { title: "Auditoría legal", icon: ScrollText },
  { title: "Analítica", icon: BarChart3 },
  { title: "Integraciones", icon: Plug },
  { title: "Configuración", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-semibold">
            M
          </span>
          <span className="truncate text-sm font-semibold tracking-tight">MarketingHub AI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operación de campañas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activos.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Módulos externos (se integrarán)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pendientes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={`${item.title} — módulo externo`}
                    className="cursor-not-allowed opacity-50"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
