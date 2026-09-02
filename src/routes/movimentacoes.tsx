import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from "lucide-react";
import { movements } from "@/lib/stock-data";

export const Route = createFileRoute("/movimentacoes")({
  head: () => ({
    meta: [
      { title: "Movimentações — StockFlow" },
      { name: "description", content: "Histórico de entradas e saídas do estoque com responsável e data." },
      { property: "og:title", content: "Movimentações — StockFlow" },
      { property: "og:description", content: "Histórico de entradas e saídas do estoque com responsável e data." },
    ],
  }),
  component: Movimentacoes,
});

function Movimentacoes() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">Movimentações</h1>
          <p className="mt-1 text-sm text-muted-foreground">Histórico de entradas e saídas do estoque.</p>
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <ArrowLeftRight className="h-4 w-4" /> Registrar movimentação
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-xs">
        <ul className="divide-y divide-border">
          {movements.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${m.type === "entrada" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                {m.type === "entrada" ? <ArrowDownToLine className="h-5 w-5" /> : <ArrowUpFromLine className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {m.type === "entrada" ? "Entrada" : "Saída"} · {m.product}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-mono text-xs">{m.sku}</span> · por {m.user}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className={`font-semibold tabular-nums ${m.type === "entrada" ? "text-success" : "text-destructive"}`}>
                  {m.type === "entrada" ? "+" : "−"}{m.qty} un
                </p>
                <p className="text-xs text-muted-foreground">{m.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
