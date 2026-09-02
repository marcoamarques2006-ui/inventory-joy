import { Link, Outlet } from "@tanstack/react-router";
import {
  Boxes,
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  Warehouse,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/movimentacoes", label: "Movimentações", icon: ArrowLeftRight },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
];

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary">
            <Boxes className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight">StockFlow</p>
            <p className="truncate text-xs text-sidebar-muted">Gestão de Estoque</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact ?? false }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground [&.active]:bg-sidebar-accent [&.active]:text-sidebar-foreground"
              activeProps={{ className: "active" }}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <Settings className="h-4.5 w-4.5 shrink-0" />
            Configurações
          </button>
          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary-foreground">
              MM
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Marco Marques</p>
              <p className="truncate text-xs text-sidebar-muted">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 sm:max-w-md">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              placeholder="Buscar produto, SKU ou fornecedor..."
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-input bg-card text-muted-foreground transition-colors hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo produto</span>
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
