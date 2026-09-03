import { createFileRoute } from "@tanstack/react-router";
import { Download, TrendingUp, TriangleAlert, DollarSign, Search, ArrowDownUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { products, weeklyFlow, brl, stockStatus } from "@/lib/stock-data";

export const Route = createFileRoute("/_app/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — StockFlow" },
      { name: "description", content: "Relatórios de valor de estoque, giro e produtos críticos." },
      { property: "og:title", content: "Relatórios — StockFlow" },
      { property: "og:description", content: "Relatórios de valor de estoque, giro e produtos críticos." },
    ],
  }),
  component: Relatorios,
});

const marginData = [...products]
  .map((p) => ({ name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name, margem: Math.round(((p.price - p.cost) / p.price) * 100) }))
  .sort((a, b) => b.margem - a.margem)
  .slice(0, 7);

const topSelling = [...products].sort((a, b) => b.soldQuantity - a.soldQuantity).slice(0, 5);

function Relatorios() {
  const stockValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const saleValue = products.reduce((s, p) => s + p.stock * p.price, 0);
  const critical = products.filter((p) => stockStatus(p) === "critico").length;

  const cards = [
    { label: "Valor em custo", value: brl(stockValue), icon: DollarSign },
    { label: "Valor potencial de venda", value: brl(saleValue), icon: TrendingUp },
    { label: "Margem média potencial", value: `${Math.round(((saleValue - stockValue) / stockValue) * 100)}%`, icon: TrendingUp },
    { label: "Produtos em nível crítico", value: critical.toString(), icon: TriangleAlert },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">Relatórios</h1>
          <p className="mt-1 text-sm text-muted-foreground">Indicadores financeiros e operacionais do estoque.</p>
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-lg border border-input bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted">
          <Download className="h-4 w-4" /> Exportar CSV
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
              <c.icon className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <h2 className="font-semibold tracking-tight">Margem por produto (%)</h2>
          <p className="text-xs text-muted-foreground">Top 7 produtos por margem de lucro</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} unit="%" />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={140} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} formatter={(v) => [`${v}%`, "Margem"]} />
                <Bar dataKey="margem" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <h2 className="font-semibold tracking-tight">Giro semanal consolidado</h2>
          <p className="text-xs text-muted-foreground">Comparativo de entradas vs. saídas</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyFlow} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} width={28} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Bar dataKey="entradas" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold tracking-tight">Produtos mais vendidos</h2>
              <p className="text-xs text-muted-foreground">Ranking por quantidade vendida</p>
            </div>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <div className="mt-4 space-y-3">
            {topSelling.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-xs font-bold text-muted-foreground">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-success" style={{ width: `${(product.soldQuantity / topSelling[0].soldQuantity) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold tabular-nums">{product.soldQuantity} un.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <h2 className="font-semibold tracking-tight">Análise dos algoritmos</h2>
          <p className="text-xs text-muted-foreground">Critérios usados no backend</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold"><ArrowDownUp className="h-4 w-4 text-primary" /> QuickSort</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Ordena por nome, preço ou vendas. Complexidade média O(n log n).</p>
            </div>
            <div className="rounded-lg bg-success/5 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold"><Search className="h-4 w-4 text-success" /> Busca binária</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Localiza códigos em O(log n) após ordenar a coleção por SKU.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
