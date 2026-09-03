import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  TriangleAlert,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { products, movements, categoryData, weeklyFlow, brl, stockStatus } from "@/lib/stock-data";
import { StockBadge } from "@/components/stock-badge";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — StockFlow | Gestão de Estoque" },
      { name: "description", content: "Visão geral do estoque: produtos, alertas de estoque baixo, movimentações e fluxo semanal." },
      { property: "og:title", content: "Dashboard — StockFlow" },
      { property: "og:description", content: "Visão geral do estoque: produtos, alertas, movimentações e fluxo semanal." },
    ],
  }),
  component: Dashboard,
});

const totalItems = products.reduce((s, p) => s + p.stock, 0);
const stockValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
const lowStock = products.filter((p) => stockStatus(p) !== "ok");
const entradasHoje = movements.filter((m) => m.type === "entrada").reduce((s, m) => s + m.qty, 0);
const saidasHoje = movements.filter((m) => m.type === "saida").reduce((s, m) => s + m.qty, 0);

const kpis = [
  { label: "Itens em estoque", value: totalItems.toString(), sub: `${products.length} produtos ativos`, icon: Package, tone: "text-primary bg-primary/10" },
  { label: "Valor do estoque", value: brl(stockValue), sub: "+8,2% vs. mês anterior", icon: TrendingUp, tone: "text-success bg-success/10" },
  { label: "Alertas de reposição", value: lowStock.length.toString(), sub: "abaixo do estoque mínimo", icon: TriangleAlert, tone: "text-warning-foreground bg-warning/15" },
  { label: "Giro da semana", value: `${entradasHoje + saidasHoje}`, sub: `${entradasHoje} entradas · ${saidasHoje} saídas`, icon: ArrowLeftRight, tone: "text-primary bg-primary/10" },
];

function Donut() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={84} paddingAngle={3} strokeWidth={0}>
          {categoryData.map((category) => <Cell key={category.name} fill={category.color} />)}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão geral do seu estoque em tempo real.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-lg ${kpi.tone}`}>
                <kpi.icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight">{kpi.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs xl:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold tracking-tight">Fluxo da semana</h2>
              <p className="text-xs text-muted-foreground">Entradas e saídas por dia</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-chart-1" /> Entradas</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-chart-2" /> Saídas</span>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyFlow} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} width={28} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Bar dataKey="entradas" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs xl:col-span-2">
          <h2 className="font-semibold tracking-tight">Estoque por categoria</h2>
          <p className="text-xs text-muted-foreground">Distribuição de itens</p>
          <div className="mt-2 flex h-56 items-center justify-center">
            <Donut />
          </div>
          <ul className="mt-1 space-y-1.5">
            {categoryData.map((c) => (
              <li key={c.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="font-medium tabular-nums">{c.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Low stock + recent movements */}
      <div className="grid gap-4 xl:grid-cols-5">
        <div className="rounded-xl border border-border bg-card shadow-xs xl:col-span-3">
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <h2 className="font-semibold tracking-tight">Alertas de reposição</h2>
              <p className="text-xs text-muted-foreground">Produtos abaixo do estoque mínimo</p>
            </div>
            <Link to="/produtos" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted">
                  <Package className="h-4.5 w-4.5 text-muted-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{p.sku}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums">{p.stock} un</p>
                  <p className="text-xs text-muted-foreground">mín. {p.minStock}</p>
                </div>
                <StockBadge product={p} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-xs xl:col-span-2">
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <h2 className="font-semibold tracking-tight">Últimas movimentações</h2>
              <p className="text-xs text-muted-foreground">Entradas e saídas recentes</p>
            </div>
            <Link to="/movimentacoes" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Histórico <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {movements.slice(0, 5).map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${m.type === "entrada" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {m.type === "entrada" ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowUpFromLine className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.product}</p>
                  <p className="text-xs text-muted-foreground">{m.user} · {m.date}</p>
                </div>
                <span className={`shrink-0 text-sm font-semibold tabular-nums ${m.type === "entrada" ? "text-success" : "text-destructive"}`}>
                  {m.type === "entrada" ? "+" : "−"}{m.qty}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
